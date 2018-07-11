/**
 * author: SunShinewyf
 * date: 2018-07-11
 * desc: 依赖类
 */
//订阅事件的唯一标识
let uid = 0;

//订阅类
function Dep() {
  this.id = uid++;
  this.subs = [];
}

Dep.prototype = {
  addSub: function(sub) {
    if (this.subs.indexOf(sub) === -1) {
      //避免重复添加
      this.subs.push(sub);
    }
  },

  removeSub: function(sub) {
    const index = this.subs.indexOf(sub);
    if (index > -1) {
      this.subs.splice(index, 1);
    }
  },
  depend: function() {
    Dep.target.addDep(this);
  },
  notify: function() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
};

//Dep 类的全局属性 target，是一个 Watch 实例
Dep.target = null;

export default Dep;
