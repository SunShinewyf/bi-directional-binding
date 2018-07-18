/**
 * author: SunShinewyf
 * date: 2018-07-16
 * desc: 编译类
 */
function Compile(el, vm) {
  this.el = this.isElementNode(el) ? el : document.querySelector(el);
  this.vm = vm;
  if (this.el) {
    //将真实DOM移入内存 fragment 中
    let fragment = this.node2Fragment(this.el);
    this.compile(fragment);
    //将编译后的 fragment 再次转化为 DOM 塞回到页面中
    this.el.appendChild(fragment);
  }
}

Compile.prototype = {
  //将 DOM 转化为 fragment
  node2Fragment: function(el) {
    let fragment = document.createDocumentFragment();
    //每次获取DOM节点树中的第一个元素，直到移除完毕为止
    while (el.firstChild) {
      fragment.appendChild(el.firstChild);
    }
    //返回一个文档碎片容器，存储DOM树的所有节点
    return fragment;
  },
  //是否是DOM节点元素
  isElementNode(node) {
    return node.nodeType === 1;
  },
  //编译函数
  compile: function(fragment) {
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach(node => {
      //是否是元素节点
      if (this.isElementNode(node)) {
        this.compileElement(node);
        this.compile(node);
      } else {
        //是否是文本节点
        this.compileText(node);
      }
    });
  },

  //判断是否是指令
  isDirective: function(name) {
    return name.indexOf('v-') > -1;
  },

  //编译节点元素
  compileElement: function(node) {
    // 带v-model v-text
    let attrs = node.attributes; // 取出当前节点的属性
    Array.from(attrs).forEach(attr => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        // 取到指令对应的值放到节点中
        let expr = attr.value;
        let type = attrName.split('-')[1]; //获取指令是哪种类型，比如v-model,v-text
        // 调用对应的编译方法 编译哪个节点,用数据替换掉表达式
        CompileUtil[type](node, this.vm, expr);
      }
    });
  },

  //编译文本元素
  compileText: function(node) {
    let expr = node.textContent; // 取文本中的内容 todo:和 innerHTML 的区别
    let reg = /\{\{([^}]+)\}\}/g; // 不能直接检测 {{}} 这种情况，还要考虑这种情况 {{a}} {{b}} {{c}}
    if (reg.test(expr)) {
      // 调用编译文本的方法 编译哪个节点,用数据替换掉表达式
      CompileUtil['text'](node, this.vm, expr);
    }
  }
};

//指令处理集合
var CompileUtil = {
  //文本处理
  text: function(node, vm, expr) {
    let updateFn = Updater['textUpdater'];
    let value = this.getTextVal(vm, expr);
    expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
      //实例化观察者，添加到发布订阅的数组中
      new Watcher(vm, arguments[1], newValue => {
        //传入每次的表达式，比如出现 {{a}} {{b}}, 就要分别取获取表达式 a,b 的值,
        //如果直接传入 newValue,则后一个值会覆盖前一个值
        updateFn && updateFn(node, this.getTextVal());
      });
    });
    updateFn && updateFn(node, value);
  },
  //html指令处理
  html: function(node, vm, expr) {
    let updateFn = Updater['htmlUpdater'];
    new Watcher(vm, expr, newValue => {
      updateFn && updateFn(node, newValue);
    });
  },
  //model指令处理
  model: function(node, vm, expr) {
    let updateFn = Updater['modelUpdater'];
    new Watcher(vm, expr, newValue => {
      updateFn && updateFn(node, newValue);
    });
    updateFn && updateFn(node, this.getVal(vm, expr));
  },

  //获取文本的值
  getTextVal: function(vm, expr) {
    return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
      //argument[1] 就是 {{hello}} 里面的 hello 值
      return this.getVal(vm, arguments[1]);
    });
  },
  //获取值
  getVal: function(vm, expr) {
    expr = expr.split('.'); //将 hello.a.b 转化为数组,调用reduce获取最里面的值
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  }
};

//更新数据处理集合
var Updater = {
  //文本更新
  textUpdater: function(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  },
  //html 更新
  htmlUpdater: function(node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value;
  },
  //model 更新
  modelUpdater: function(node, value) {
    node.value = typeof value === 'undefined' ? '' : value;
  }
};
