/**
 * author: SunShinewyf
 * date: 2018-07-09
 * desc: 数据监听功能
 */
class Observer {
  constructor(data) {
    this._data = data;
    this.observer(this._data);
  }

  /**
   *
   * @param {data} 要监听的数据对象
   */
  observer = data => {
    //为每一个属性设置数据监听
    Object.keys(data).forEach(key => {
      this.defineRective(data, key, data[key]);
    });
  };

  /**
   * @param {data} 要监听的数据对象
   * @param {key} 要监听的对象属性key值
   * @param {value} 要监听的对象属性值
   */
  //   defineRective = (data, key, value) => {
  //     let self = this;
  //     //如果是该属性值是对象类型，则遍历
  //     if (value && typeof value === 'object') {
  //       this.observer(value);
  //     }
  //   };
}

export default Observer;
