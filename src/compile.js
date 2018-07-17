/**
 * author: SunShinewyf
 * date: 2018-07-16
 * desc: 编译类
 */
function Compile(options) {
  const { el } = options;
  this.el = this.isElementNode(el) ? el : document.querySelector(el);
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
    childNodes.forEach(node => {
      //是否是元素节点
      if (this.isElementNode(node)) {
        this.compileElement(node);
        this.compile(node);
      } else {
        //是否是文本节点
        this.compileText();
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
    attrs &&
      attrs.forEach(attr => {
        // 判断属性名字是不是包含v-model
        let attrName = attr.name;
        if (this.isDirective(attrName)) {
          // 取到对应的值放到节点中
          let expr = attr.value;
          let [, type] = attrName.split('-'); //
          // 调用对应的编译方法 编译哪个节点,用数据替换掉表达式
          CompileUtil[type](node, this.vm, expr);
        }
      });
  },

  //编译文本元素
  compileText: function(node) {
    let expr = node.textContent; // 取文本中的内容
    let reg = /\{\{([^}]+)\}\}/g; // {{a}} {{b}} {{c}}
    if (reg.test(expr)) {
      // 调用编译文本的方法 编译哪个节点,用数据替换掉表达式
      CompileUtil['text'](node, this.vm, expr);
    }
  }
};
