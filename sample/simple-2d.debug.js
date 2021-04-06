(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Simple2D = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }

    /**
     * 类型定义
     */
    var TYPE;
    (function (TYPE) {
        TYPE["Array"] = "[object Array]";
        TYPE["Boolean"] = "[object Boolean]";
        TYPE["BigInt"] = "[object BigInt]";
        TYPE["Date"] = "[object Date]";
        TYPE["Error"] = "[object Error]";
        TYPE["Function"] = "[object Function]";
        TYPE["Number"] = "[object Number]";
        TYPE["Null"] = "[object Null]";
        TYPE["Math"] = "[object Math]";
        TYPE["MediaStream"] = "[object MediaStream]";
        TYPE["LocalMediaStream"] = "[object LocalMediaStream]";
        TYPE["MediaStreamTrack"] = "[object MediaStreamTrack]";
        TYPE["AudioStreamTrack"] = "[object AudioStreamTrack]";
        TYPE["VideoStreamTrack"] = "[object VideoStreamTrack]";
        TYPE["CanvasCaptureMediaStreamTrack"] = "[object CanvasCaptureMediaStreamTrack]";
        TYPE["Object"] = "[object Object]";
        TYPE["RegExp"] = "[object RegExp]";
        TYPE["String"] = "[object String]";
        TYPE["Symbol"] = "[object Symbol]";
        TYPE["Undefined"] = "[object Undefined]";
        TYPE["Unknown"] = "[object Unknown]";
        TYPE["Promise"] = "[object Promise]";
    })(TYPE || (TYPE = {}));
    /**
     * 组合类型定义
     */
    var TYPE_COMPOSE = {
        UAN: [TYPE.Undefined, TYPE.Null]
    };
    /**
     * 返回变量的类型
     * @param variable
     */
    function typeOf(variable) {
        var type;
        if (typeof variable === 'undefined' || variable === undefined)
            type = TYPE.Undefined;
        else if (variable === null)
            type = TYPE.Null;
        else
            type = Object.prototype.toString.call(variable);
        return type;
    }
    /**
     * 判断变量是否为`typeArray`中的某一个类型
     * @param variable - 待判断的变量
     * @param typeArray - 预选类型
     * @return {boolean} - `variable`的类型存在与`typeArray`中返回`true`，不存在返回`false`
     */
    function typeIs(variable) {
        var typeArray = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            typeArray[_i - 1] = arguments[_i];
        }
        var varType = typeOf(variable);
        for (var i = typeArray.length; i--;) {
            if (varType === typeArray[i])
                return true;
        }
        return false;
    }
    /**
     * 判断变量类型是否为{@link string}
     * @param variable
     * @param [notNull=true] 是否不允许空字符串, 即 `''`
     */
    function typeIsString(variable, notNull) {
        if (notNull === void 0) { notNull = true; }
        return typeIs(variable, TYPE.String) && (notNull ? variable.length > 0 : true);
    }
    /**
     * 判断变量是否非空, 即变量不为 `undefined` 和 `null`
     * @param variable
     */
    function notUAN(variable) {
        return !typeIs.apply(void 0, __spreadArray([variable], TYPE_COMPOSE.UAN));
    }
    /**
     * 判断变量类型是否为{@link function}
     * @param variable
     */
    function typeIsFunction(variable) {
        return typeIs(variable, TYPE.Function);
    }
    /**
     * 判断变量类型是否为 `true`
     * @param variable
     */
    function typeIsTrue(variable) {
        return typeIs(variable, TYPE.Boolean) && variable;
    }
    function typeIsArray(variable) {
        return typeIs(variable, TYPE.Array);
    }

    // type EventTargetData = Record<string | number, unknown> | Array<unknown> | string | void;
    /**
     * EventTarget实现了基本的事件触发机制
     * 参考 [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget) 实现的简单事件触发机制
     */
    var EventTarget = /** @class */ (function () {
        function EventTarget() {
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
        EventTarget.prototype.addEventListener = function (type, func, options) {
            var _this = this;
            if (options === void 0) { options = EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS; }
            if (!typeIs(type, TYPE.String, TYPE.Number) || !typeIs(func, TYPE.Function))
                return null;
            var removeSelf = function () { return _this.removeEventListener(type, func); };
            options = __assign(__assign({}, EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS), options);
            //  绑定监听器函数的可选项到函数对象上
            func.listenerOptions = options;
            func.removeSelf = removeSelf;
            if (!typeIsArray(this.listenerMap[type])) {
                this.listenerMap[type] = [];
            }
            this.listenerMap[type].push(func);
            return removeSelf;
        };
        /**
         * 对多个事件添加同一个事件监听器
         * @param types - 要监听的事件类型
         * @param func - 事件监听回调
         * @param options - 设置监听器参数
         * @return 若添加成功则返回一个函数, 用于移除事件监听
         */
        EventTarget.prototype.addEventListeners = function (types, func, options) {
            if (options === void 0) { options = EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS; }
            if (!typeIs(types, TYPE.Array) || !typeIs(func, TYPE.Function))
                return null;
            var removeFuncList = [];
            for (var i = types.length; i--;) {
                removeFuncList.push(this.addEventListener(types[i], func, options));
            }
            return function () { return removeFuncList.forEach(function (removeFunc) { return removeFunc(); }); };
        };
        /**
         * 移除事件监听器, 要提供与调用{@link addEventListener}或{@link addEventListeners}时相同的参数
         * @param type - 要移除的事件监听器类型
         * @param func - 要移除的事件监听器
         * @return 返回 `true` 表示移除成功
         */
        EventTarget.prototype.removeEventListener = function (type, func) {
            if (!typeIs(type, TYPE.String, TYPE.Number) ||
                !typeIs(func, TYPE.Function) ||
                !typeIs(this.listenerMap[type], TYPE.Array)) {
                return false;
            }
            var arr = this.listenerMap[type];
            var index = arr.indexOf(func);
            if (index <= -1)
                return false;
            else
                arr.splice(index, 1);
            return true;
        };
        /**
         * 分发事件
         * @param event - 分发的事件对象
         * @return 事件是否发送成功
         */
        EventTarget.prototype.dispatchEvent = function (event) {
            var arr = this.listenerMap[event.type];
            if (!typeIs(arr, TYPE.Array))
                return false;
            var tempArr = arr.slice();
            tempArr.forEach(function (func) { return func(event, func.removeSelf); });
            if (typeIsString(event.type)) {
                var eventType = event.type;
                var eventListenerLiteral = 'on' + eventType.substring(0, 1).toUpperCase() + eventType.substring(1);
                if (typeIsFunction(this[eventListenerLiteral]))
                    this[eventListenerLiteral](event);
            }
            this.listenerMap[event.type] = arr.filter(function (func) { return !typeIsTrue(func.listenerOptions.once); });
            return true;
        };
        /**
         * 简化的{@link dispatchEvent}接口
         * @param type
         * @param message
         * @param error 具体错误类型, 此时 {@link dispatchEventLite}的 `type` 应是一个 `xxxEventType.Error` 类型
         */
        EventTarget.prototype.dispatchEventLite = function (type, message, error) {
            var event;
            if (notUAN(error))
                event = new ErrorEvent(type, error, message);
            else
                event = new Event(type, message);
            return this.dispatchEvent(event);
        };
        /**
         * 指定类型的事件是否被监听
         * @param type
         */
        EventTarget.prototype.hasListener = function (type) {
            var listeners = this.listenerMap[type];
            return notUAN(listeners) &&
                typeIs(listeners, TYPE.Array) &&
                listeners.length > 0;
        };
        /**
         * 清空所有绑定的事件
         */
        EventTarget.prototype.clearListener = function () {
            var keys = Object.keys(this.listenerMap);
            for (var i = keys.length; i--;) {
                delete this.listenerMap[keys[i]];
            }
        };
        EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS = {
            once: false
        };
        return EventTarget;
    }());
    var Event = /** @class */ (function () {
        /**
         * @param type - 事件类型
         * @param message - 该事件携带的数据
         */
        function Event(type, message) {
            this.type = type;
            this.message = message;
        }
        return Event;
    }());
    var ErrorEvent = /** @class */ (function (_super) {
        __extends(ErrorEvent, _super);
        /**
         * @param type - 事件类型
         * @param error - 具体错误
         * @param message - 该事件携带的数据
         */
        function ErrorEvent(type, error, message) {
            var _this = _super.call(this, type, message) || this;
            _this.error = error;
            return _this;
        }
        return ErrorEvent;
    }(Event));

    var SimpleCanvas = /** @class */ (function () {
        function SimpleCanvas(canvas) {
            this.context = canvas.getContext('2d');
            this._evt = new EventTarget();
        }
        SimpleCanvas.prototype.drawText = function (text) {
            if (!this.context)
                return;
            this.context.save();
            this.context.textBaseline = 'middle';
            this.context.textAlign = 'center';
            var centerX = this.context.canvas.width * 0.5;
            var centerY = this.context.canvas.height * 0.5;
            this.context.fillText(text, centerX, centerY);
            this.context.strokeStyle = 'green';
            this.context.strokeText(text, centerX, centerY);
            this.context.restore();
        };
        return SimpleCanvas;
    }());

    function version() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return {"version":"1.0.0","gitHash":"277415565380088096d88308f1e37a6ae32cb1ba","gitHashShort":"2774155","buildTime":"2021-04-05T08:18:50.358Z"};
    }

    exports.SimpleCanvas = SimpleCanvas;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=simple-2d.debug.js.map
