/**
 * author: SunShinewyf
 * date: 2018-07-09
 * desc: 数据监听功能
 */
function Observer(data) {
  this.data = data;
  this.observe(this.data);
}

Observer.prototype = {
  /**
   *
   * @param {data} 要监听的数据对象
   */
  observe: data => {
    //为每一个属性设置数据监听
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  },

  /**
   * @param {data} 要监听的数据对象
   * @param {key} 要监听的对象属性key值
   * @param {value} 要监听的对象属性值
   */
  defineReactive: (data, key, value) => {
    let dep = new Dep();

    let self = this;
    //如果是该属性值是对象类型，则遍历
    let childObj = instanceObserver(value);

    object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: () => {
        return value;
      },
      set: newVal => {
        if (newVal === val) return;

        val = newVal;
        //新的值是 object 的话，进行监听
        childObj = instanceObserver(newVal);
        //通知所有订阅者
        dep.notify();
      }
    });
  }
};

/**
 * 实例化监听对象
 * @param {需要实例化的值} val
 */
instanceObserver: val => {
  if (!val || typeof val !== 'object') return;
  return new Observer(val);
};

export default Observer;
