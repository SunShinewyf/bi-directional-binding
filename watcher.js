/**
 * author: SunShinewyf
 * date: 2018-07-10
 * desc: 订阅器类
 */
import Dep from './dep';

/**
 *
 * @param {*组件} vm
 * @param {*} expOrFn
 * @param {*回调函数} cb
 */
function Watcher(vm, expOrFn, cb) {
  this.depIds = {}; //存储deps订阅的依赖
  this.vm = vm; //component 实例
  this.cb = cb; //更新数据时的回调函数
  this.expOrFn = expOrFn; //被订阅的数据
  this.val = this.get(); //维护更新前的数据
}

Watcher.prototype = {
  //暴露给 Dep 类的方法，用于在订阅的数据更新时触发
  update: function() {
    this.run();
  },

  run: function() {},

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
