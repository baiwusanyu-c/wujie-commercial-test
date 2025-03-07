import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { warn, error } from "./utils";
import { WUJIE_ALL_EVENT, WUJIE_TIPS_NO_SUBJECT } from "./constant";
// 全部事件存储map
export var appEventObjMap = window.__POWERED_BY_WUJIE__ ? window.__WUJIE.inject.appEventObjMap : new Map();

// eventBus 事件中心
export var EventBus = /*#__PURE__*/function () {
  function EventBus(id) {
    _classCallCheck(this, EventBus);
    this.id = id;
    this.$clear();
    if (!appEventObjMap.get(this.id)) {
      appEventObjMap.set(this.id, {});
    }
    this.eventObj = appEventObjMap.get(this.id);
  }

  // 监听事件
  return _createClass(EventBus, [{
    key: "$on",
    value: function $on(event, fn) {
      var cbs = this.eventObj[event];
      if (!cbs) {
        this.eventObj[event] = [fn];
        return this;
      }
      if (!cbs.includes(fn)) cbs.push(fn);
      return this;
    }

    /** 任何$emit都会导致监听函数触发，第一个参数为事件名，后续的参数为$emit的参数 */
  }, {
    key: "$onAll",
    value: function $onAll(fn) {
      return this.$on(WUJIE_ALL_EVENT, fn);
    }

    // 一次性监听事件
  }, {
    key: "$once",
    value: function $once(event, fn) {
      var on = function () {
        this.$off(event, on);
        fn.apply(void 0, arguments);
      }.bind(this);
      this.$on(event, on);
    }

    // 取消监听
  }, {
    key: "$off",
    value: function $off(event, fn) {
      var cbs = this.eventObj[event];
      if (!event || !cbs || !cbs.length) {
        warn("".concat(event, " ").concat(WUJIE_TIPS_NO_SUBJECT));
        return this;
      }
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn) {
          cbs.splice(i, 1);
          break;
        }
      }
      return this;
    }

    // 取消监听$onAll
  }, {
    key: "$offAll",
    value: function $offAll(fn) {
      return this.$off(WUJIE_ALL_EVENT, fn);
    }

    // 发送事件
  }, {
    key: "$emit",
    value: function $emit(event) {
      var cbs = [];
      var allCbs = [];
      appEventObjMap.forEach(function (eventObj) {
        if (eventObj[event]) cbs = cbs.concat(eventObj[event]);
        if (eventObj[WUJIE_ALL_EVENT]) allCbs = allCbs.concat(eventObj[WUJIE_ALL_EVENT]);
      });
      if (!event || cbs.length === 0 && allCbs.length === 0) {
        warn("".concat(event, " ").concat(WUJIE_TIPS_NO_SUBJECT));
      } else {
        try {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          for (var i = 0, l = cbs.length; i < l; i++) {
            var _cbs;
            (_cbs = cbs)[i].apply(_cbs, args);
          }
          for (var _i = 0, _l = allCbs.length; _i < _l; _i++) {
            var _allCbs;
            (_allCbs = allCbs)[_i].apply(_allCbs, [event].concat(args));
          }
        } catch (e) {
          error(e);
        }
      }
      return this;
    }

    // 清空当前所有的监听事件
  }, {
    key: "$clear",
    value: function $clear() {
      var _appEventObjMap$get;
      var eventObj = (_appEventObjMap$get = appEventObjMap.get(this.id)) !== null && _appEventObjMap$get !== void 0 ? _appEventObjMap$get : {};
      var events = Object.keys(eventObj);
      events.forEach(function (event) {
        return delete eventObj[event];
      });
      return this;
    }
  }]);
}();
//# sourceMappingURL=event.js.map