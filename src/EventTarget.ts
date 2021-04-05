import {isTrue, notUAN, TYPE, typeIs, typeIsFunction, typeIsString} from "./tools/TypeUtils";

/**
 * 事件监听回调函数定义
 * @event
 * @param event - 触发的事件对象
 * @param removeSelf - 调用该函数可以将当前的事件监听函数移除
 */
type EventListenerType = (event: Event | ErrorEvent, removeSelf?: () => void) => void;

/**
 * 监听器类型定义
 */
type EventTargetType = string | number;
// type EventTargetData = {[key: string]: any} | Array<any> | string | void;
type EventTargetData = any;

/**
 * EventTarget实现了基本的事件触发机制
 * 参考 [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget) 实现的简单事件触发机制
 */
export class EventTarget {

  static DEFAULT_EVENT_LISTENER_OPTIONS: EventListenerOptions = {once: false};

  listenerMap: {[key: string]: Array<EventListenerType>};

  constructor() {
    this.listenerMap = {};
  }

  /**
   * 添加事件监听器
   * @param type - 要监听的事件类型
   *
   * @param func - 事件监听回调
   * @param [options] - 设置监听器参数
   * @return 若添加成功则返回一个函数, 用于移除事件监听
   */
  addEventListener(type: EventTargetType, func: EventListenerType, options?: EventListenerOptions): () => void {
    if (!typeIs(type, TYPE.String, TYPE.Number) || !typeIs(func, TYPE.Function)) return null;

    const removeSelf = () => this.removeEventListener(type, func);
    let listeners = this.listenerMap[type];

    options = {
      ...EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS,
      ...options
    };
    //  绑定监听器函数的可选项到函数对象上
    func['listenerOptions'] = options;
    func['removeSelf'] = removeSelf;

    if (!typeIs(listeners, TYPE.Array)) {
      this.listenerMap[type] = [];
      listeners = this.listenerMap[type];
    }
    listeners.push(func);

    return removeSelf;
  }

  /**
   * 对多个事件添加同一个事件监听器
   * @param types - 要监听的事件类型
   * @param func - 事件监听回调
   * @param options - 设置监听器参数
   * @return 若添加成功则返回一个函数, 用于移除事件监听
   */
  addEventListeners(types: Array<EventTargetType>, func: EventListenerType, options?: EventListenerOptions) {
    if (!typeIs(types, TYPE.Array) || !typeIs(func, TYPE.Function)) return false;

    const removeFuncs: Array<() => void> = [];

    types.forEach(type => removeFuncs.push(this.addEventListener(type, func)));

    return () => removeFuncs.forEach(removefunc => removefunc());
  }

  /**
   * 移除事件监听器, 要提供与调用{@link addEventListener}或{@link addEventListeners}时相同的参数
   * @param type - 要移除的事件监听器类型
   * @param func - 要移除的事件监听器
   * @return 返回true表示有该fun监听器并且移除成功
   */
  removeEventListener(type: EventTargetType, func: EventListenerType): boolean {
    if (!typeIs(type, TYPE.String, TYPE.Number) ||
        !typeIs(func, TYPE.Function) ||
        !typeIs(this.listenerMap[type], TYPE.Array)) {
      return false;
    }

    const arr: Array<EventListenerType> = this.listenerMap[type];
    const index = arr.indexOf(func);

    if (index <= -1) return false;
    else arr.splice(index, 1);

    return true;
  }

  /**
   * 分发事件
   * @param event - 分发的事件对象
   * @return 事件是否发送成功
   */
  dispatchEvent(event: Event) {
    const arr: Array<EventListenerType> = this.listenerMap[event.type];
    if (!typeIs(arr, TYPE.Array)) return false;
    const tempArr = arr.slice();

    tempArr.forEach(func => func(event, func['removeSelf']));

    if (typeIsString(event.type)) {
      const eventType: string = event.type as string;
      const eventListenerLiteral = 'on' + eventType.substring(0, 1).toUpperCase() + eventType.substring(1);

      if (typeIsFunction(this[eventListenerLiteral])) this[eventListenerLiteral](event);
    }

    this.listenerMap[event.type] = arr.filter(func => !isTrue(func['listenerOptions'].once));
    return true;
  }

  dispatchEventLite(type: EventTargetType, message?: EventTargetData, error?: string | number) {
    let event;
    if (notUAN(error)) event = new ErrorEvent(type, error, message);
    else event = new Event(type, message);

    this.dispatchEvent(event);
  }

  /**
   * 指定类型的事件是否被监听
   * @param type
   */
  hasListener(type: EventTargetType) {
    const listeners: Array<EventListenerType> = this.listenerMap[type];

    return  notUAN(listeners) &&
            typeIs(listeners, TYPE.Array) &&
            listeners.length > 0;
  }

  /**
   * 清空所有绑定的事件
   */
  clearListener() {
    for (let key of Object.keys(this.listenerMap)) {
      delete this.listenerMap[key];
    }
  }
}

/**
 * {@link EventTarget}发出的事件类型
 */
export class Event {

  type: EventTargetType;
  message: EventTargetData;

  /**
   * @param type - 事件类型
   * @param message - 该事件携带的数据
   */
  constructor(type: EventTargetType, message?: EventTargetData) {
    this.type = type;
    this.message = message;
  }
}

export class ErrorEvent extends Event {

  error: string;

  /**
   * @param type - 事件类型
   * @param error - 具体错误
   * @param message - 该事件携带的数据
   */
  constructor(type, error, message) {
    super(type, message);
    this.error = error;
  }
}

/**
 * 添加事件监听可选参数定义
 */
export interface EventListenerOptions {
  once: boolean;
}
