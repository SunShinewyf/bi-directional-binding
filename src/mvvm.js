/**
 * author: SunShinewyf
 * date: 2018-07-16
 * desc: 入口文件
 */

function MVVM(options) {
  this.$el = options.el;
  this.$data = options.data;
  if (this.$el) {
    //对所有数据进行劫持
    new Observer(this.$data);
    new Compile(this.$el, this);
  }
}

MVVM.prototype = {};
