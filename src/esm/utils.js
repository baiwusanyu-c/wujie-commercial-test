import _typeof from "@babel/runtime/helpers/typeof";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { WUJIE_SCRIPT_ID, WUJIE_TIPS_NO_URL, WUJIE_APP_ID, WUJIE_TIPS_STOP_APP, WUJIE_TIPS_STOP_APP_DETAIL } from "./constant";
export function toArray(array) {
  return Array.isArray(array) ? array : [array];
}
export function isFunction(value) {
  return typeof value === "function";
}
export function isHijackingTag(tagName) {
  return (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === "LINK" || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === "STYLE" || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === "SCRIPT" || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === "IFRAME";
}
export var wujieSupport = window.Proxy && window.CustomElementRegistry;

/**
 * in safari
 * typeof document.all === 'undefined' // true
 * typeof document.all === 'function' // true
 * We need to discriminate safari for better performance
 */
var naughtySafari = typeof document.all === "function" && typeof document.all === "undefined";
var callableFnCacheMap = new WeakMap();
export var isCallable = function isCallable(fn) {
  if (callableFnCacheMap.has(fn)) {
    return true;
  }
  var callable = naughtySafari ? typeof fn === "function" && typeof fn !== "undefined" : typeof fn === "function";
  if (callable) {
    callableFnCacheMap.set(fn, callable);
  }
  return callable;
};
var boundedMap = new WeakMap();
export function isBoundedFunction(fn) {
  if (boundedMap.has(fn)) {
    return boundedMap.get(fn);
  }
  var bounded = fn.name.indexOf("bound ") === 0 && !fn.hasOwnProperty("prototype");
  boundedMap.set(fn, bounded);
  return bounded;
}
var fnRegexCheckCacheMap = new WeakMap();
export function isConstructable(fn) {
  var hasPrototypeMethods = fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1;
  if (hasPrototypeMethods) return true;
  if (fnRegexCheckCacheMap.has(fn)) {
    return fnRegexCheckCacheMap.get(fn);
  }
  var constructable = hasPrototypeMethods;
  if (!constructable) {
    var fnString = fn.toString();
    var constructableFunctionRegex = /^function\b\s[A-Z].*/;
    var classRegex = /^class\b/;
    constructable = constructableFunctionRegex.test(fnString) || classRegex.test(fnString);
  }
  fnRegexCheckCacheMap.set(fn, constructable);
  return constructable;
}
var setFnCacheMap = new WeakMap();
export function checkProxyFunction(value) {
  if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value)) {
    if (!setFnCacheMap.has(value)) {
      setFnCacheMap.set(value, value);
    }
  }
}
export function getTargetValue(target, p) {
  var value = target[p];
  if (setFnCacheMap.has(value)) {
    return setFnCacheMap.get(value);
  }
  if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value)) {
    var boundValue = Function.prototype.bind.call(value, target);
    setFnCacheMap.set(value, boundValue);
    for (var key in value) {
      boundValue[key] = value[key];
    }
    if (value.hasOwnProperty("prototype") && !boundValue.hasOwnProperty("prototype")) {
      // https://github.com/kuitos/kuitos.github.io/issues/47
      Object.defineProperty(boundValue, "prototype", {
        value: value.prototype,
        enumerable: false,
        writable: true
      });
    }
    return boundValue;
  }
  return value;
}
export function getDegradeIframe(id) {
  return window.document.querySelector("iframe[".concat(WUJIE_APP_ID, "=\"").concat(id, "\"]"));
}
export function setAttrsToElement(element, attrs) {
  Object.keys(attrs).forEach(function (name) {
    element.setAttribute(name, attrs[name]);
  });
}
export function appRouteParse(url) {
  if (!url) {
    error(WUJIE_TIPS_NO_URL);
    throw new Error();
  }
  var urlElement = anchorElementGenerator(url);
  var appHostPath = urlElement.protocol + "//" + urlElement.host;
  var appRoutePath = urlElement.pathname + urlElement.search + urlElement.hash;
  if (!appRoutePath.startsWith("/")) appRoutePath = "/" + appRoutePath; // hack ie
  return {
    urlElement: urlElement,
    appHostPath: appHostPath,
    appRoutePath: appRoutePath
  };
}
export function anchorElementGenerator(url) {
  var element = window.document.createElement("a");
  element.href = url;
  element.href = element.href; // hack ie
  return element;
}
export function getAnchorElementQueryMap(anchorElement) {
  var queryList = anchorElement.search.replace("?", "").split("&");
  var queryMap = {};
  queryList.forEach(function (query) {
    var _query$split = query.split("="),
      _query$split2 = _slicedToArray(_query$split, 2),
      key = _query$split2[0],
      value = _query$split2[1];
    if (key && value) queryMap[key] = value;
  });
  return queryMap;
}

/**
 * 当前url的查询参数中是否有给定的id
 */
export function isMatchSyncQueryById(id) {
  var queryMap = getAnchorElementQueryMap(anchorElementGenerator(window.location.href));
  return Object.keys(queryMap).includes(id);
}

/**
 * 劫持元素原型对相对地址的赋值转绝对地址
 * @param iframeWindow
 */
export function fixElementCtrSrcOrHref(iframeWindow, elementCtr, attr) {
  // patch setAttribute
  var rawElementSetAttribute = iframeWindow.Element.prototype.setAttribute;
  elementCtr.prototype.setAttribute = function (name, value) {
    var targetValue = value;
    if (name === attr) targetValue = getAbsolutePath(value, this.baseURI || "", true);
    rawElementSetAttribute.call(this, name, targetValue);
  };
  // patch href get and set
  var rawAnchorElementHrefDescriptor = Object.getOwnPropertyDescriptor(elementCtr.prototype, attr);
  var enumerable = rawAnchorElementHrefDescriptor.enumerable,
    configurable = rawAnchorElementHrefDescriptor.configurable,
    _get = rawAnchorElementHrefDescriptor.get,
    _set = rawAnchorElementHrefDescriptor.set;
  Object.defineProperty(elementCtr.prototype, attr, {
    enumerable: enumerable,
    configurable: configurable,
    get: function get() {
      return _get.call(this);
    },
    set: function set(href) {
      _set.call(this, getAbsolutePath(href, this.baseURI, true));
    }
  });
  // TODO: innerHTML的处理
}
export function getCurUrl(proxyLocation) {
  var location = proxyLocation;
  return location.protocol + "//" + location.host + location.pathname;
}
export function getAbsolutePath(url, base, hash) {
  try {
    // 为空值无需处理
    if (url) {
      // 需要处理hash的场景
      if (hash && url.startsWith("#")) return url;
      return new URL(url, base).href;
    } else return url;
  } catch (_unused) {
    return url;
  }
}
/**
 * 获取需要同步的url
 */
export function getSyncUrl(id, prefix) {
  var _syncUrl$match;
  var winUrlElement = anchorElementGenerator(window.location.href);
  var queryMap = getAnchorElementQueryMap(winUrlElement);
  winUrlElement = null;
  var syncUrl = window.decodeURIComponent(queryMap[id] || "");
  var validShortPath = (_syncUrl$match = syncUrl.match(/^{([^}]*)}/)) === null || _syncUrl$match === void 0 ? void 0 : _syncUrl$match[1];
  if (prefix && validShortPath) {
    return syncUrl.replace("{".concat(validShortPath, "}"), prefix[validShortPath]);
  }
  return syncUrl;
}
// @ts-ignore
export var requestIdleCallback = window.requestIdleCallback || function (cb) {
  return setTimeout(cb, 1);
};
export function getContainer(container) {
  return typeof container === "string" ? document.querySelector(container) : container;
}
export function warn(msg, data) {
  var _console;
  (_console = console) === null || _console === void 0 || _console.warn("[wujie warn]: ".concat(msg), data);
}
export function error(msg, data) {
  var _console2;
  (_console2 = console) === null || _console2 === void 0 || _console2.error("[wujie error]: ".concat(msg), data);
}
export function getInlineCode(match) {
  var start = match.indexOf(">") + 1;
  var end = match.lastIndexOf("<");
  return match.substring(start, end);
}
export function defaultGetPublicPath(entry) {
  if (_typeof(entry) === "object") {
    return "/";
  }
  try {
    var _URL = new URL(entry, location.href),
      origin = _URL.origin,
      pathname = _URL.pathname;
    var paths = pathname.split("/");
    // 移除最后一个元素
    paths.pop();
    return "".concat(origin).concat(paths.join("/"), "/");
  } catch (e) {
    console.warn(e);
    return "";
  }
}

/** [f1, f2, f3, f4] => f4(f3(f2(f1))) 函数柯里化 */
export function compose(fnList) {
  return function (code) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return fnList.reduce(function (newCode, fn) {
      return isFunction(fn) ? fn.apply(void 0, [newCode].concat(args)) : newCode;
    }, code || "");
  };
}

// 微任务
export function nextTick(cb) {
  Promise.resolve().then(cb);
}

//执行钩子函数
export function execHooks(plugins, hookName) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }
  try {
    if (plugins && plugins.length > 0) {
      plugins.map(function (plugin) {
        return plugin[hookName];
      }).filter(function (hook) {
        return isFunction(hook);
      }).forEach(function (hook) {
        return hook.apply(void 0, args);
      });
    }
  } catch (e) {
    error(e);
  }
}
export function isScriptElement(element) {
  var _element$tagName;
  return ((_element$tagName = element.tagName) === null || _element$tagName === void 0 ? void 0 : _element$tagName.toUpperCase()) === "SCRIPT";
}
var count = 1;
export function setTagToScript(element, tag) {
  if (isScriptElement(element)) {
    var scriptTag = tag || String(count++);
    element.setAttribute(WUJIE_SCRIPT_ID, scriptTag);
  }
}
export function getTagFromScript(element) {
  if (isScriptElement(element)) {
    return element.getAttribute(WUJIE_SCRIPT_ID);
  }
  return null;
}

// 合并缓存
export function mergeOptions(options, cacheOptions) {
  return {
    name: options.name,
    el: options.el || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.el),
    url: options.url || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.url),
    html: options.html || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.html),
    exec: options.exec !== undefined ? options.exec : cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.exec,
    replace: options.replace || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.replace),
    fetch: options.fetch || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.fetch),
    props: options.props || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.props),
    sync: options.sync !== undefined ? options.sync : cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.sync,
    prefix: options.prefix || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.prefix),
    loading: options.loading || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.loading),
    // 默认 {}
    attrs: options.attrs !== undefined ? options.attrs : (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.attrs) || {},
    degradeAttrs: options.degradeAttrs !== undefined ? options.degradeAttrs : (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.degradeAttrs) || {},
    // 默认 true
    fiber: options.fiber !== undefined ? options.fiber : (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.fiber) !== undefined ? cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.fiber : true,
    alive: options.alive !== undefined ? options.alive : cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.alive,
    degrade: options.degrade !== undefined ? options.degrade : cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.degrade,
    plugins: options.plugins || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.plugins),
    mainHostPath: options.mainHostPath || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.mainHostPath),
    lifecycles: {
      beforeLoad: options.beforeLoad || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.beforeLoad),
      beforeMount: options.beforeMount || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.beforeMount),
      afterMount: options.afterMount || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.afterMount),
      beforeUnmount: options.beforeUnmount || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.beforeUnmount),
      afterUnmount: options.afterUnmount || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.afterUnmount),
      activated: options.activated || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.activated),
      deactivated: options.deactivated || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.deactivated),
      loadError: options.loadError || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.loadError)
    }
  };
}

/**
 * 事件触发器
 */
export function eventTrigger(el, eventName, detail) {
  var event;
  if (typeof window.CustomEvent === "function") {
    event = new CustomEvent(eventName, {
      detail: detail
    });
  } else {
    event = document.createEvent("CustomEvent");
    event.initCustomEvent(eventName, true, false, detail);
  }
  el.dispatchEvent(event);
}
export function stopMainAppRun() {
  warn(WUJIE_TIPS_STOP_APP_DETAIL);
  throw new Error(WUJIE_TIPS_STOP_APP);
}
//# sourceMappingURL=utils.js.map