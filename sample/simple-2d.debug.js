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
     * ????????????
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
     * ??????????????????
     */
    var TYPE_COMPOSE = {
        UAN: [TYPE.Undefined, TYPE.Null]
    };
    /**
     * ?????????????????????
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
     * ?????????????????????`typeArray`?????????????????????
     * @param variable - ??????????????????
     * @param typeArray - ????????????
     * @return {boolean} - `variable`??????????????????`typeArray`?????????`true`??????????????????`false`
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
     * ???????????????????????????{@link string}
     * @param variable
     * @param [notNull=true] ???????????????????????????, ??? `''`
     */
    function typeIsString(variable, notNull) {
        if (notNull === void 0) { notNull = true; }
        return typeIs(variable, TYPE.String) && (notNull ? variable.length > 0 : true);
    }
    /**
     * ????????????????????????, ??????????????? `undefined` ??? `null`
     * @param variable
     */
    function notUAN(variable) {
        return !typeIs.apply(void 0, __spreadArray([variable], TYPE_COMPOSE.UAN));
    }
    /**
     * ???????????????????????????{@link function}
     * @param variable
     */
    function typeIsFunction(variable) {
        return typeIs(variable, TYPE.Function);
    }
    /**
     * ??????????????????????????? `true`
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
     * EventTarget????????????????????????????????????
     * ?????? [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget) ?????????????????????????????????
     */
    var EventTarget = /** @class */ (function () {
        function EventTarget() {
            this.listenerMap = {};
        }
        /**
         * ?????????????????????
         * @param type - ????????????????????????
         *
         * @param func - ??????????????????
         * @param [options] - ?????????????????????
         * @return ????????????????????????????????????, ????????????????????????
         */
        EventTarget.prototype.addEventListener = function (type, func, options) {
            var _this = this;
            if (options === void 0) { options = EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS; }
            if (!typeIs(type, TYPE.String, TYPE.Number) || !typeIs(func, TYPE.Function))
                return null;
            var removeSelf = function () { return _this.removeEventListener(type, func); };
            options = __assign(__assign({}, EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS), options);
            //  ???????????????????????????????????????????????????
            func.listenerOptions = options;
            func.removeSelf = removeSelf;
            if (!typeIsArray(this.listenerMap[type])) {
                this.listenerMap[type] = [];
            }
            this.listenerMap[type].push(func);
            return removeSelf;
        };
        /**
         * ?????????????????????????????????????????????
         * @param types - ????????????????????????
         * @param func - ??????????????????
         * @param options - ?????????????????????
         * @return ????????????????????????????????????, ????????????????????????
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
         * ?????????????????????, ??????????????????{@link addEventListener}???{@link addEventListeners}??????????????????
         * @param type - ?????????????????????????????????
         * @param func - ???????????????????????????
         * @return ?????? `true` ??????????????????
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
         * ????????????
         * @param event - ?????????????????????
         * @return ????????????????????????
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
         * ?????????{@link dispatchEvent}??????
         * @param type
         * @param message
         * @param error ??????????????????, ?????? {@link dispatchEventLite}??? `type` ???????????? `xxxEventType.Error` ??????
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
         * ????????????????????????????????????
         * @param type
         */
        EventTarget.prototype.hasListener = function (type) {
            var listeners = this.listenerMap[type];
            return notUAN(listeners) &&
                typeIs(listeners, TYPE.Array) &&
                listeners.length > 0;
        };
        /**
         * ???????????????????????????
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
         * @param type - ????????????
         * @param message - ????????????????????????
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
         * @param type - ????????????
         * @param error - ????????????
         * @param message - ????????????????????????
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
