import {notUAN, TYPE, typeIs, typeIsArray, typeIsFunction, typeIsString, typeIsTrue} from "./utils/TypeUtils";

/**
 * 事件名称只能用 `string` , `number` 两种类型之一
 */
type EventTargetType = string | number;

/**
 * 对事件监听时的额外选项
 */
export interface EventListenerOptions {
  once: boolean;
}

/**
 * 事件监听的回调函数类型
 * @param event 事件对象
 * @param removeSelf 调用该函数可以将当前的事件监听函数移除
 */
interface EventListenerType {
  listenerOptions?: EventListenerOptions,
  removeSelf?: () => void,
  (event: Event | ErrorEvent, removeSelf?: () => void): void;
}

interface EventTargetData {
  result?: boolean;
}
// type EventTargetData = Record<string | number, unknown> | Array<unknown> | string | void;

/**
 * EventTarget实现了基本的事件触发机制
 * 参考 [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget) 实现的简单事件触发机制
 */
export class EventTarget {
  static DEFAULT_EVENT_LISTENER_OPTIONS: EventListenerOptions = {
    once: false
  };

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
  addEventListener(
    type: EventTargetType,
    func: EventListenerType,
    options: EventListenerOptions = EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS
  )
    : () => void
  {
    if (!typeIs(type, TYPE.String, TYPE.Number) || !typeIs(func, TYPE.Function)) return null;

    const removeSelf = () => this.removeEventListener(type, func);

    options = {
      ...EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS,
      ...options
    };
    //  绑定监听器函数的可选项到函数对象上
    func.listenerOptions = options;
    func.removeSelf = removeSelf;

    if (!typeIsArray(this.listenerMap[type])) {
      this.listenerMap[type] = [];
    }
    this.listenerMap[type].push(func);

    return removeSelf;
  }

  /**
   * 对多个事件添加同一个事件监听器
   * @param types - 要监听的事件类型
   * @param func - 事件监听回调
   * @param options - 设置监听器参数
   * @return 若添加成功则返回一个函数, 用于移除事件监听
   */
  addEventListeners(
    types: Array<EventTargetType>,
    func: EventListenerType,
    options: EventListenerOptions = EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS
  )
    : () => void
  {
    if (!typeIs(types, TYPE.Array) || !typeIs(func, TYPE.Function)) return null;

    const removeFuncList: Array<() => void> = [];

    for (let i = types.length; i--;) {
      removeFuncList.push(this.addEventListener(types[i], func, options))
    }

    return () => removeFuncList.forEach(removeFunc => removeFunc());
  }

  /**
   * 移除事件监听器, 要提供与调用{@link addEventListener}或{@link addEventListeners}时相同的参数
   * @param type - 要移除的事件监听器类型
   * @param func - 要移除的事件监听器
   * @return 返回 `true` 表示移除成功
   */
  removeEventListener(
    type: EventTargetType,
    func: EventListenerType
  )
    : boolean
  {
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
  dispatchEvent(event: Event): boolean {
    const arr: Array<EventListenerType> = this.listenerMap[event.type];
    if (!typeIs(arr, TYPE.Array)) return false;
    const tempArr = arr.slice();

    tempArr.forEach(func => func(event, func.removeSelf));

    if (typeIsString(event.type)) {
      const eventType: string = event.type as string;
      const eventListenerLiteral = 'on' + eventType.substring(0, 1).toUpperCase() + eventType.substring(1);

      if (typeIsFunction(this[eventListenerLiteral])) this[eventListenerLiteral](event);
    }

    this.listenerMap[event.type] = arr.filter(func => !typeIsTrue(func.listenerOptions.once));
    return true;
  }

  /**
   * 简化的{@link dispatchEvent}接口
   * @param type
   * @param message
   * @param error 具体错误类型, 此时 {@link dispatchEventLite}的 `type` 应是一个 `xxxEventType.Error` 类型
   */
  dispatchEventLite(
    type: EventTargetType,
    message?: EventTargetData,
    error?: string | number
  )
    : boolean
  {
    let event;
    if (notUAN(error)) event = new ErrorEvent(type, error, message);
    else event = new Event(type, message);

    return this.dispatchEvent(event);
  }

  /**
   * 指定类型的事件是否被监听
   * @param type
   */
  hasListener(type: EventTargetType): boolean {
    const listeners: Array<EventListenerType> = this.listenerMap[type];

    return  notUAN(listeners) &&
            typeIs(listeners, TYPE.Array) &&
            listeners.length > 0;
  }

  /**
   * 清空所有绑定的事件
   */
  clearListener(): void {
    const keys = Object.keys(this.listenerMap);
    for (let i = keys.length; i--;) {
      delete this.listenerMap[keys[i]];
    }
  }
}

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

  error: string | number;

  /**
   * @param type - 事件类型
   * @param error - 具体错误
   * @param message - 该事件携带的数据
   */
  constructor(type: EventTargetType, error: string | number, message: EventTargetData) {
    super(type, message);
    this.error = error;
  }
}
