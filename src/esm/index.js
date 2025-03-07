import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
import importHTML, { processCssLoader } from "./entry";
import WuJie from "./sandbox";
import { defineWujieWebComponent, addLoading } from "./shadow";
import { processAppForHrefJump } from "./sync";
import { getPlugins } from "./plugin";
import { wujieSupport, mergeOptions, isFunction, requestIdleCallback, isMatchSyncQueryById, warn, stopMainAppRun } from "./utils";
import { getWujieById, getOptionsById, addSandboxCacheWithOptions } from "./common";
import { EventBus } from "./event";
import { WUJIE_TIPS_NOT_SUPPORTED } from "./constant";
export var bus = new EventBus(Date.now().toString());

/**
 * 合并 preOptions 和 startOptions，并且将 url 和 el 变成可选
 */

/**
 * 强制中断主应用运行
 * wujie.__WUJIE 如果为true说明当前运行环境是子应用
 * window.__POWERED_BY_WUJIE__ 如果为false说明子应用还没初始化完成
 * 上述条件同时成立说明主应用代码在iframe的loading阶段混入进来了，必须中断执行
 */
if (window.__WUJIE && !window.__POWERED_BY_WUJIE__) {
  stopMainAppRun();
}

// 处理子应用链接跳转
processAppForHrefJump();

// 定义webComponent容器
defineWujieWebComponent();

// 如果不支持则告警
if (!wujieSupport) warn(WUJIE_TIPS_NOT_SUPPORTED);

/**
 * 缓存子应用配置
 */
export function setupApp(options) {
  if (options.name) addSandboxCacheWithOptions(options.name, options);
}

/**
 * 运行无界app
 */
export function startApp(_x) {
  return _startApp.apply(this, arguments);
}

/**
 * 预加载无界APP
 */
function _startApp() {
  _startApp = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(startOptions) {
    var _newSandbox$lifecycle, _newSandbox$lifecycle2;
    var sandbox, cacheOptions, options, name, url, html, replace, fetch, props, attrs, degradeAttrs, fiber, alive, degrade, sync, prefix, el, loading, plugins, lifecycles, mainHostPath, _iframeWindow, _sandbox$lifecycles3, _sandbox$lifecycles3$, _sandbox$lifecycles2, _sandbox$lifecycles2$, _yield$importHTML2, _getExternalScripts, _sandbox$lifecycles4, _sandbox$lifecycles4$, _sandbox$lifecycles5, _sandbox$lifecycles5$, newSandbox, _yield$importHTML3, template, getExternalScripts, getExternalStyleSheets, processedHtml;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          sandbox = getWujieById(startOptions.name);
          cacheOptions = getOptionsById(startOptions.name); // 合并缓存配置
          options = mergeOptions(startOptions, cacheOptions);
          name = options.name, url = options.url, html = options.html, replace = options.replace, fetch = options.fetch, props = options.props, attrs = options.attrs, degradeAttrs = options.degradeAttrs, fiber = options.fiber, alive = options.alive, degrade = options.degrade, sync = options.sync, prefix = options.prefix, el = options.el, loading = options.loading, plugins = options.plugins, lifecycles = options.lifecycles, mainHostPath = options.mainHostPath; // 已经初始化过的应用，快速渲染
          if (!sandbox) {
            _context2.next = 39;
            break;
          }
          sandbox.plugins = getPlugins(plugins);
          sandbox.lifecycles = lifecycles;
          _iframeWindow = sandbox.iframe.contentWindow;
          if (!sandbox.preload) {
            _context2.next = 11;
            break;
          }
          _context2.next = 11;
          return sandbox.preload;
        case 11:
          if (!alive) {
            _context2.next = 26;
            break;
          }
          _context2.next = 14;
          return sandbox.active({
            url: url,
            sync: sync,
            prefix: prefix,
            el: el,
            props: props,
            alive: alive,
            fetch: fetch,
            replace: replace
          });
        case 14:
          if (sandbox.execFlag) {
            _context2.next = 22;
            break;
          }
          (_sandbox$lifecycles2 = sandbox.lifecycles) === null || _sandbox$lifecycles2 === void 0 || (_sandbox$lifecycles2$ = _sandbox$lifecycles2.beforeLoad) === null || _sandbox$lifecycles2$ === void 0 || _sandbox$lifecycles2$.call(_sandbox$lifecycles2, sandbox.iframe.contentWindow);
          _context2.next = 18;
          return importHTML({
            url: url,
            html: html,
            opts: {
              fetch: fetch || window.fetch,
              plugins: sandbox.plugins,
              loadError: sandbox.lifecycles.loadError,
              fiber: fiber
            }
          });
        case 18:
          _yield$importHTML2 = _context2.sent;
          _getExternalScripts = _yield$importHTML2.getExternalScripts;
          _context2.next = 22;
          return sandbox.start(_getExternalScripts);
        case 22:
          (_sandbox$lifecycles3 = sandbox.lifecycles) === null || _sandbox$lifecycles3 === void 0 || (_sandbox$lifecycles3$ = _sandbox$lifecycles3.activated) === null || _sandbox$lifecycles3$ === void 0 || _sandbox$lifecycles3$.call(_sandbox$lifecycles3, sandbox.iframe.contentWindow);
          return _context2.abrupt("return", sandbox.destroy);
        case 26:
          if (!isFunction(_iframeWindow.__WUJIE_MOUNT)) {
            _context2.next = 38;
            break;
          }
          /**
           * 子应用切换会触发webcomponent的disconnectedCallback调用sandbox.unmount进行实例销毁
           * 此处是防止没有销毁webcomponent时调用startApp的情况，需要手动调用unmount
           */
          sandbox.unmount();
          _context2.next = 30;
          return sandbox.active({
            url: url,
            sync: sync,
            prefix: prefix,
            el: el,
            props: props,
            alive: alive,
            fetch: fetch,
            replace: replace
          });
        case 30:
          // 正常加载的情况，先注入css，最后才mount。重新激活也保持同样的时序
          sandbox.rebuildStyleSheets();
          // 有渲染函数
          (_sandbox$lifecycles4 = sandbox.lifecycles) === null || _sandbox$lifecycles4 === void 0 || (_sandbox$lifecycles4$ = _sandbox$lifecycles4.beforeMount) === null || _sandbox$lifecycles4$ === void 0 || _sandbox$lifecycles4$.call(_sandbox$lifecycles4, sandbox.iframe.contentWindow);
          _iframeWindow.__WUJIE_MOUNT();
          (_sandbox$lifecycles5 = sandbox.lifecycles) === null || _sandbox$lifecycles5 === void 0 || (_sandbox$lifecycles5$ = _sandbox$lifecycles5.afterMount) === null || _sandbox$lifecycles5$ === void 0 || _sandbox$lifecycles5$.call(_sandbox$lifecycles5, sandbox.iframe.contentWindow);
          sandbox.mountFlag = true;
          return _context2.abrupt("return", sandbox.destroy);
        case 38:
          // 没有渲染函数
          sandbox.destroy();
        case 39:
          // 设置loading
          addLoading(el, loading);
          newSandbox = new WuJie({
            name: name,
            url: url,
            attrs: attrs,
            degradeAttrs: degradeAttrs,
            fiber: fiber,
            degrade: degrade,
            plugins: plugins,
            lifecycles: lifecycles,
            mainHostPath: mainHostPath
          });
          (_newSandbox$lifecycle = newSandbox.lifecycles) === null || _newSandbox$lifecycle === void 0 || (_newSandbox$lifecycle2 = _newSandbox$lifecycle.beforeLoad) === null || _newSandbox$lifecycle2 === void 0 || _newSandbox$lifecycle2.call(_newSandbox$lifecycle, newSandbox.iframe.contentWindow);
          _context2.next = 44;
          return importHTML({
            url: url,
            html: html,
            opts: {
              fetch: fetch || window.fetch,
              plugins: newSandbox.plugins,
              loadError: newSandbox.lifecycles.loadError,
              fiber: fiber
            }
          });
        case 44:
          _yield$importHTML3 = _context2.sent;
          template = _yield$importHTML3.template;
          getExternalScripts = _yield$importHTML3.getExternalScripts;
          getExternalStyleSheets = _yield$importHTML3.getExternalStyleSheets;
          _context2.next = 50;
          return processCssLoader(newSandbox, template, getExternalStyleSheets);
        case 50:
          processedHtml = _context2.sent;
          _context2.next = 53;
          return newSandbox.active({
            url: url,
            sync: sync,
            prefix: prefix,
            template: processedHtml,
            el: el,
            props: props,
            alive: alive,
            fetch: fetch,
            replace: replace
          });
        case 53:
          _context2.next = 55;
          return newSandbox.start(getExternalScripts);
        case 55:
          return _context2.abrupt("return", newSandbox.destroy);
        case 56:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _startApp.apply(this, arguments);
}
export function preloadApp(preOptions) {
  requestIdleCallback(function () {
    /**
     * 已经存在
     * url查询参数中有子应用的id，大概率是刷新浏览器或者分享url，此时需要直接打开子应用，无需预加载
     */
    if (getWujieById(preOptions.name) || isMatchSyncQueryById(preOptions.name)) return;
    var cacheOptions = getOptionsById(preOptions.name);
    // 合并缓存配置
    var options = mergeOptions(_objectSpread({}, preOptions), cacheOptions);
    var name = options.name,
      url = options.url,
      html = options.html,
      props = options.props,
      alive = options.alive,
      replace = options.replace,
      fetch = options.fetch,
      exec = options.exec,
      attrs = options.attrs,
      degradeAttrs = options.degradeAttrs,
      fiber = options.fiber,
      degrade = options.degrade,
      prefix = options.prefix,
      plugins = options.plugins,
      lifecycles = options.lifecycles,
      mainHostPath = options.mainHostPath;
    var sandbox = new WuJie({
      name: name,
      url: url,
      attrs: attrs,
      degradeAttrs: degradeAttrs,
      fiber: fiber,
      degrade: degrade,
      plugins: plugins,
      lifecycles: lifecycles,
      mainHostPath: mainHostPath
    });
    if (sandbox.preload) return sandbox.preload;
    var runPreload = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var _sandbox$lifecycles, _sandbox$lifecycles$b;
        var _yield$importHTML, template, getExternalScripts, getExternalStyleSheets, processedHtml;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              (_sandbox$lifecycles = sandbox.lifecycles) === null || _sandbox$lifecycles === void 0 || (_sandbox$lifecycles$b = _sandbox$lifecycles.beforeLoad) === null || _sandbox$lifecycles$b === void 0 || _sandbox$lifecycles$b.call(_sandbox$lifecycles, sandbox.iframe.contentWindow);
              _context.next = 3;
              return importHTML({
                url: url,
                html: html,
                opts: {
                  fetch: fetch || window.fetch,
                  plugins: sandbox.plugins,
                  loadError: sandbox.lifecycles.loadError,
                  fiber: fiber
                }
              });
            case 3:
              _yield$importHTML = _context.sent;
              template = _yield$importHTML.template;
              getExternalScripts = _yield$importHTML.getExternalScripts;
              getExternalStyleSheets = _yield$importHTML.getExternalStyleSheets;
              _context.next = 9;
              return processCssLoader(sandbox, template, getExternalStyleSheets);
            case 9:
              processedHtml = _context.sent;
              _context.next = 12;
              return sandbox.active({
                url: url,
                props: props,
                prefix: prefix,
                alive: alive,
                template: processedHtml,
                fetch: fetch,
                replace: replace
              });
            case 12:
              if (!exec) {
                _context.next = 17;
                break;
              }
              _context.next = 15;
              return sandbox.start(getExternalScripts);
            case 15:
              _context.next = 19;
              break;
            case 17:
              _context.next = 19;
              return getExternalScripts();
            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function runPreload() {
        return _ref.apply(this, arguments);
      };
    }();
    sandbox.preload = runPreload();
  });
}

/**
 * 销毁无界APP
 */
export function destroyApp(id) {
  var sandbox = getWujieById(id);
  if (sandbox) {
    sandbox.destroy();
  }
}
//# sourceMappingURL=index.js.map