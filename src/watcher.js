/**
 * author: SunShinewyf
 * date: 2018-07-10
 * desc: 订阅器类
 */
import Dep from './dep';

/**
 *
 * @param {*vm} 双向绑定实例
 * @param {*expOrFn} 是表达式还是function
 * @param {*cb} 执行更新时的回调函数
 */
function Watcher(vm, expOrFn, cb) {
  this.depIds = {}; //存储deps订阅的依赖
  this.vm = vm; //component 实例
  this.cb = cb; //更新数据时的回调函数
  this.expOrFn = expOrFn; //表达式还是function
  this.value = this.get(); //暂存更新前的值
}

Watcher.prototype = {
  //暴露给 Dep 类的方法，用于在订阅的数据更新时触发
  update: function() {
    this.run();
  },

  run: function() {
    const newValue = this.get(); //获取到的新值
    const oldValue = this.value; //获取到的旧值
    if (newValue !== oldValue) {
      //判断新旧值是否相等，不相等就执行回调
      this.value = value;
      this.cb.call(this.vm);
    }
  },

  addDep: function(dep) {
    //检查depIds对象是否存在某个实例，避免去查找原型链上的属性
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this); //在 dep 存储 watcher 监听器
      this.depIds[dep.id] = dep; //在 watcher 存储订阅者 dep
    }
  },

  get: function() {
    Dep.target = this;
    const val = this.vm._data[this.expOrFn];
    Dep.target = null;
    return val;
  }
};

export default Watcher;
