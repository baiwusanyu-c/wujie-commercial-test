import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { iframeGenerator, recoverEventListeners, recoverDocumentListeners, insertScriptToIframe, patchEventTimeStamp } from "./iframe";
import { syncUrlToWindow, syncUrlToIframe, clearInactiveAppUrl } from "./sync";
import { createWujieWebComponent, clearChild, getPatchStyleElements, renderElementToContainer, renderTemplateToShadowRoot, renderTemplateToIframe, initRenderIframeAndContainer, removeLoading } from "./shadow";
import { proxyGenerator, localGenerator } from "./proxy";
import { getPlugins, getPresetLoaders } from "./plugin";
import { removeEventListener } from "./effect";
import { idToSandboxCacheMap, addSandboxCacheWithWujie, deleteWujieById, rawElementAppendChild, rawDocumentQuerySelector } from "./common";
import { EventBus, appEventObjMap } from "./event";
import { isFunction, wujieSupport, appRouteParse, requestIdleCallback as _requestIdleCallback, getAbsolutePath, eventTrigger } from "./utils";
import { WUJIE_DATA_ATTACH_CSS_FLAG } from "./constant";
/**
 * 基于 Proxy和iframe 实现的沙箱
 */
var Wujie = /*#__PURE__*/function () {
  /**
   * @param id 子应用的id，唯一标识
   * @param url 子应用的url，可以包含protocol、host、path、query、hash
   */
  function Wujie(options) {
    _classCallCheck(this, Wujie);
    /** 激活时路由地址 */
    /** 子应用保活 */
    /** window代理 */
    /** document代理 */
    /** location代理 */
    /** 事件中心 */
    /** 容器 */
    /** js沙箱 */
    /** css沙箱 */
    /** 子应用的template */
    /** 子应用代码替换钩子 */
    /** 子应用自定义fetch */
    /** 子应用的生命周期 */
    /** 子应用的插件 */
    /** js沙箱ready态 */
    /** 子应用预加载态 */
    /** 降级时渲染iframe的属性 */
    /** 子应用js执行队列 */
    /** 子应用执行过标志 */
    /** 子应用激活标志 */
    /** 子应用mount标志 */
    /** 路由同步标志 */
    /** 子应用短路径替换，路由同步时生效 */
    /** 子应用跳转标志 */
    /** 子应用采用fiber模式执行 */
    /** 子应用降级标志 */
    /** 子应用降级document */
    /** 子应用styleSheet元素 */
    /** 子应用head元素 */
    /** 子应用body元素 */
    /** 自定义沙箱 iframe src */
    /** 子应用dom监听事件留存，当降级时用于保存元素事件 */
    _defineProperty(this, "elementEventCacheMap", new WeakMap());
    // 传递inject给嵌套子应用
    if (window.__POWERED_BY_WUJIE__) this.inject = window.__WUJIE.inject;else {
      this.inject = {
        idToSandboxMap: idToSandboxCacheMap,
        appEventObjMap: appEventObjMap,
        mainHostPath: options.mainHostPath || window.location.protocol + "//" + window.location.host
      };
    }
    var name = options.name,
      url = options.url,
      attrs = options.attrs,
      fiber = options.fiber,
      degradeAttrs = options.degradeAttrs,
      degrade = options.degrade,
      lifecycles = options.lifecycles,
      plugins = options.plugins;
    this.id = name;
    this.fiber = fiber;
    this.degrade = degrade || !wujieSupport;
    this.bus = new EventBus(this.id);
    this.url = url;
    this.degradeAttrs = degradeAttrs;
    this.provide = {
      bus: this.bus
    };
    this.styleSheetElements = [];
    this.execQueue = [];
    this.lifecycles = lifecycles;
    this.plugins = getPlugins(plugins);

    // 创建目标地址的解析
    var _appRouteParse = appRouteParse(url),
      urlElement = _appRouteParse.urlElement,
      appHostPath = _appRouteParse.appHostPath,
      appRoutePath = _appRouteParse.appRoutePath;
    var mainHostPath = this.inject.mainHostPath;
    // 创建iframe
    this.iframe = iframeGenerator(this, attrs, mainHostPath, appHostPath, appRoutePath);
    if (this.degrade) {
      var _localGenerator = localGenerator(this.iframe, urlElement, mainHostPath, appHostPath),
        proxyDocument = _localGenerator.proxyDocument,
        proxyLocation = _localGenerator.proxyLocation;
      this.proxyDocument = proxyDocument;
      this.proxyLocation = proxyLocation;
    } else {
      var _proxyGenerator = proxyGenerator(this.iframe, urlElement, mainHostPath, appHostPath),
        proxyWindow = _proxyGenerator.proxyWindow,
        _proxyDocument = _proxyGenerator.proxyDocument,
        _proxyLocation = _proxyGenerator.proxyLocation;
      this.proxy = proxyWindow;
      this.proxyDocument = _proxyDocument;
      this.proxyLocation = _proxyLocation;
    }
    this.provide.location = this.proxyLocation;
    addSandboxCacheWithWujie(this.id, this);
  }
  return _createClass(Wujie, [{
    key: "active",
    value: (
    /** $wujie对象，提供给子应用的接口 */
    /** 子应用嵌套场景，父应用传递给子应用的数据 */
    /** 激活子应用
     * 1、同步路由
     * 2、动态修改iframe的fetch
     * 3、准备shadow
     * 4、准备子应用注入
     */
    function () {
      var _active = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(options) {
        var _this = this;
        var sync, url, el, template, props, alive, prefix, fetch, replace, iframeWindow, iframeFetch, iframeBody, _initRenderIframeAndC, iframe, container, _iframeBody;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              sync = options.sync, url = options.url, el = options.el, template = options.template, props = options.props, alive = options.alive, prefix = options.prefix, fetch = options.fetch, replace = options.replace;
              this.url = url;
              this.sync = sync;
              this.alive = alive;
              this.hrefFlag = false;
              this.prefix = prefix !== null && prefix !== void 0 ? prefix : this.prefix;
              this.replace = replace !== null && replace !== void 0 ? replace : this.replace;
              this.provide.props = props !== null && props !== void 0 ? props : this.provide.props;
              this.activeFlag = true;
              // wait iframe init
              _context.next = 11;
              return this.iframeReady;
            case 11:
              // 处理子应用自定义fetch
              // TODO fetch检验合法性
              iframeWindow = this.iframe.contentWindow;
              iframeFetch = fetch ? function (input, init) {
                return fetch(typeof input === "string" ? getAbsolutePath(input, _this.proxyLocation.href) : input, init);
              } : this.fetch;
              if (iframeFetch) {
                iframeWindow.fetch = iframeFetch;
                this.fetch = iframeFetch;
              }

              // 处理子应用路由同步
              if (this.execFlag && this.alive) {
                // 当保活模式下子应用重新激活时，只需要将子应用路径同步回主应用
                syncUrlToWindow(iframeWindow);
              } else {
                // 先将url同步回iframe，然后再同步回浏览器url
                syncUrlToIframe(iframeWindow);
                syncUrlToWindow(iframeWindow);
              }

              // inject template
              this.template = template !== null && template !== void 0 ? template : this.template;

              /* 降级处理 */
              if (!this.degrade) {
                _context.next = 38;
                break;
              }
              iframeBody = rawDocumentQuerySelector.call(iframeWindow.document, "body");
              _initRenderIframeAndC = initRenderIframeAndContainer(this.id, el !== null && el !== void 0 ? el : iframeBody, this.degradeAttrs), iframe = _initRenderIframeAndC.iframe, container = _initRenderIframeAndC.container;
              this.el = container;
              // 销毁js运行iframe容器内部dom
              if (el) clearChild(iframeBody);
              // 修复vue的event.timeStamp问题
              patchEventTimeStamp(iframe.contentWindow, iframeWindow);
              // 当销毁iframe时主动unmount子应用
              iframe.contentWindow.onunload = function () {
                _this.unmount();
              };
              if (!this.document) {
                _context.next = 34;
                break;
              }
              if (!this.alive) {
                _context.next = 29;
                break;
              }
              iframe.contentDocument.replaceChild(this.document.documentElement, iframe.contentDocument.documentElement);
              // 保活场景需要事件全部恢复
              recoverEventListeners(iframe.contentDocument.documentElement, iframeWindow);
              _context.next = 32;
              break;
            case 29:
              _context.next = 31;
              return renderTemplateToIframe(iframe.contentDocument, this.iframe.contentWindow, this.template);
            case 31:
              // 非保活场景需要恢复根节点的事件，防止react16监听事件丢失
              recoverDocumentListeners(this.document.documentElement, iframe.contentDocument.documentElement, iframeWindow);
            case 32:
              _context.next = 36;
              break;
            case 34:
              _context.next = 36;
              return renderTemplateToIframe(iframe.contentDocument, this.iframe.contentWindow, this.template);
            case 36:
              this.document = iframe.contentDocument;
              return _context.abrupt("return");
            case 38:
              if (!this.shadowRoot) {
                _context.next = 44;
                break;
              }
              /*
               document.addEventListener was transfer to shadowRoot.addEventListener
               react 16 SyntheticEvent will remember document event for avoid repeat listen
               shadowRoot have to dispatchEvent for react 16 so can't be destroyed
               this may lead memory leak risk
               */
              this.el = renderElementToContainer(this.shadowRoot.host, el);
              if (!this.alive) {
                _context.next = 42;
                break;
              }
              return _context.abrupt("return");
            case 42:
              _context.next = 46;
              break;
            case 44:
              // 预执行无容器，暂时插入iframe内部触发Web Component的connect
              _iframeBody = rawDocumentQuerySelector.call(iframeWindow.document, "body");
              this.el = renderElementToContainer(createWujieWebComponent(this.id), el !== null && el !== void 0 ? el : _iframeBody);
            case 46:
              _context.next = 48;
              return renderTemplateToShadowRoot(this.shadowRoot, iframeWindow, this.template);
            case 48:
              this.patchCssRules();

              // inject shadowRoot to app
              this.provide.shadowRoot = this.shadowRoot;
            case 50:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function active(_x) {
        return _active.apply(this, arguments);
      }
      return active;
    }() // 未销毁，空闲时才回调
    )
  }, {
    key: "requestIdleCallback",
    value: function requestIdleCallback(callback) {
      var _this2 = this;
      return _requestIdleCallback(function () {
        // 假如已经被销毁了
        if (!_this2.iframe) return;
        callback.apply(_this2);
      });
    }
    /** 启动子应用
     * 1、运行js
     * 2、处理兼容样式
     */
  }, {
    key: "start",
    value: (function () {
      var _start = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(getExternalScripts) {
        var _this3 = this;
        var scriptResultList, iframeWindow, beforeScriptResultList, afterScriptResultList, syncScriptResultList, asyncScriptResultList, deferScriptResultList, domContentLoadedTrigger, domLoadedTrigger;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              this.execFlag = true;
              // 执行脚本
              _context2.next = 3;
              return getExternalScripts();
            case 3:
              scriptResultList = _context2.sent;
              if (this.iframe) {
                _context2.next = 6;
                break;
              }
              return _context2.abrupt("return");
            case 6:
              iframeWindow = this.iframe.contentWindow; // 标志位，执行代码前设置
              iframeWindow.__POWERED_BY_WUJIE__ = true;
              // 用户自定义代码前
              beforeScriptResultList = getPresetLoaders("jsBeforeLoaders", this.plugins); // 用户自定义代码后
              afterScriptResultList = getPresetLoaders("jsAfterLoaders", this.plugins); // 同步代码
              syncScriptResultList = []; // async代码无需保证顺序，所以不用放入执行队列
              asyncScriptResultList = []; // defer代码需要保证顺序并且DOMContentLoaded前完成，这里统一放置同步脚本后执行
              deferScriptResultList = [];
              scriptResultList.forEach(function (scriptResult) {
                if (scriptResult.defer) deferScriptResultList.push(scriptResult);else if (scriptResult.async) asyncScriptResultList.push(scriptResult);else syncScriptResultList.push(scriptResult);
              });

              // 插入代码前
              beforeScriptResultList.forEach(function (beforeScriptResult) {
                _this3.execQueue.push(function () {
                  return _this3.fiber ? _this3.requestIdleCallback(function () {
                    return insertScriptToIframe(beforeScriptResult, iframeWindow);
                  }) : insertScriptToIframe(beforeScriptResult, iframeWindow);
                });
              });

              // 同步代码
              syncScriptResultList.concat(deferScriptResultList).forEach(function (scriptResult) {
                _this3.execQueue.push(function () {
                  return scriptResult.contentPromise.then(function (content) {
                    return _this3.fiber ? _this3.requestIdleCallback(function () {
                      return insertScriptToIframe(_objectSpread(_objectSpread({}, scriptResult), {}, {
                        content: content
                      }), iframeWindow);
                    }) : insertScriptToIframe(_objectSpread(_objectSpread({}, scriptResult), {}, {
                      content: content
                    }), iframeWindow);
                  });
                });
              });

              // 异步代码
              asyncScriptResultList.forEach(function (scriptResult) {
                scriptResult.contentPromise.then(function (content) {
                  _this3.fiber ? _this3.requestIdleCallback(function () {
                    return insertScriptToIframe(_objectSpread(_objectSpread({}, scriptResult), {}, {
                      content: content
                    }), iframeWindow);
                  }) : insertScriptToIframe(_objectSpread(_objectSpread({}, scriptResult), {}, {
                    content: content
                  }), iframeWindow);
                });
              });

              //框架主动调用mount方法
              this.execQueue.push(this.fiber ? function () {
                return _this3.requestIdleCallback(function () {
                  return _this3.mount();
                });
              } : function () {
                return _this3.mount();
              });

              //触发 DOMContentLoaded 事件
              domContentLoadedTrigger = function domContentLoadedTrigger() {
                var _this3$execQueue$shif;
                eventTrigger(iframeWindow.document, "DOMContentLoaded");
                eventTrigger(iframeWindow, "DOMContentLoaded");
                (_this3$execQueue$shif = _this3.execQueue.shift()) === null || _this3$execQueue$shif === void 0 || _this3$execQueue$shif();
              };
              this.execQueue.push(this.fiber ? function () {
                return _this3.requestIdleCallback(domContentLoadedTrigger);
              } : domContentLoadedTrigger);

              // 插入代码后
              afterScriptResultList.forEach(function (afterScriptResult) {
                _this3.execQueue.push(function () {
                  return _this3.fiber ? _this3.requestIdleCallback(function () {
                    return insertScriptToIframe(afterScriptResult, iframeWindow);
                  }) : insertScriptToIframe(afterScriptResult, iframeWindow);
                });
              });

              //触发 loaded 事件
              domLoadedTrigger = function domLoadedTrigger() {
                var _this3$execQueue$shif2;
                eventTrigger(iframeWindow.document, "readystatechange");
                eventTrigger(iframeWindow, "load");
                (_this3$execQueue$shif2 = _this3.execQueue.shift()) === null || _this3$execQueue$shif2 === void 0 || _this3$execQueue$shif2();
              };
              this.execQueue.push(this.fiber ? function () {
                return _this3.requestIdleCallback(domLoadedTrigger);
              } : domLoadedTrigger);
              // 由于没有办法准确定位是哪个代码做了mount，保活、重建模式提前关闭loading
              if (this.alive || !isFunction(this.iframe.contentWindow.__WUJIE_UNMOUNT)) removeLoading(this.el);
              this.execQueue.shift()();

              // 所有的execQueue队列执行完毕，start才算结束，保证串行的执行子应用
              return _context2.abrupt("return", new Promise(function (resolve) {
                _this3.execQueue.push(function () {
                  var _this3$execQueue$shif3;
                  resolve();
                  (_this3$execQueue$shif3 = _this3.execQueue.shift()) === null || _this3$execQueue$shif3 === void 0 || _this3$execQueue$shif3();
                });
              }));
            case 26:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function start(_x2) {
        return _start.apply(this, arguments);
      }
      return start;
    }()
    /**
     * 框架主动发起mount，如果子应用是异步渲染实例，比如将生命周__WUJIE_MOUNT放到async函数内
     * 此时如果采用fiber模式渲染（主应用调用mount的时机也是异步不确定的），框架调用mount时可能
     * 子应用的__WUJIE_MOUNT还没有挂载到window，所以这里封装一个mount函数，当子应用是异步渲染
     * 实例时，子应用异步函数里面最后加上window.__WUJIE.mount()来主动调用
     */
    )
  }, {
    key: "mount",
    value: function mount() {
      var _this$execQueue$shift;
      if (this.mountFlag) return;
      if (isFunction(this.iframe.contentWindow.__WUJIE_MOUNT)) {
        var _this$lifecycles, _this$lifecycles$befo, _this$lifecycles2, _this$lifecycles2$aft;
        removeLoading(this.el);
        (_this$lifecycles = this.lifecycles) === null || _this$lifecycles === void 0 || (_this$lifecycles$befo = _this$lifecycles.beforeMount) === null || _this$lifecycles$befo === void 0 || _this$lifecycles$befo.call(_this$lifecycles, this.iframe.contentWindow);
        this.iframe.contentWindow.__WUJIE_MOUNT();
        (_this$lifecycles2 = this.lifecycles) === null || _this$lifecycles2 === void 0 || (_this$lifecycles2$aft = _this$lifecycles2.afterMount) === null || _this$lifecycles2$aft === void 0 || _this$lifecycles2$aft.call(_this$lifecycles2, this.iframe.contentWindow);
        this.mountFlag = true;
      }
      if (this.alive) {
        var _this$lifecycles3, _this$lifecycles3$act;
        (_this$lifecycles3 = this.lifecycles) === null || _this$lifecycles3 === void 0 || (_this$lifecycles3$act = _this$lifecycles3.activated) === null || _this$lifecycles3$act === void 0 || _this$lifecycles3$act.call(_this$lifecycles3, this.iframe.contentWindow);
      }
      (_this$execQueue$shift = this.execQueue.shift()) === null || _this$execQueue$shift === void 0 || _this$execQueue$shift();
    }

    /** 保活模式和使用proxyLocation.href跳转链接都不应该销毁shadow */
  }, {
    key: "unmount",
    value: function unmount() {
      this.activeFlag = false;
      // 清理子应用过期的同步参数
      clearInactiveAppUrl();
      if (this.alive) {
        var _this$lifecycles4, _this$lifecycles4$dea;
        (_this$lifecycles4 = this.lifecycles) === null || _this$lifecycles4 === void 0 || (_this$lifecycles4$dea = _this$lifecycles4.deactivated) === null || _this$lifecycles4$dea === void 0 || _this$lifecycles4$dea.call(_this$lifecycles4, this.iframe.contentWindow);
      }
      if (!this.mountFlag) return;
      if (isFunction(this.iframe.contentWindow.__WUJIE_UNMOUNT) && !this.alive && !this.hrefFlag) {
        var _this$lifecycles5, _this$lifecycles5$bef, _this$lifecycles6, _this$lifecycles6$aft;
        (_this$lifecycles5 = this.lifecycles) === null || _this$lifecycles5 === void 0 || (_this$lifecycles5$bef = _this$lifecycles5.beforeUnmount) === null || _this$lifecycles5$bef === void 0 || _this$lifecycles5$bef.call(_this$lifecycles5, this.iframe.contentWindow);
        this.iframe.contentWindow.__WUJIE_UNMOUNT();
        (_this$lifecycles6 = this.lifecycles) === null || _this$lifecycles6 === void 0 || (_this$lifecycles6$aft = _this$lifecycles6.afterUnmount) === null || _this$lifecycles6$aft === void 0 || _this$lifecycles6$aft.call(_this$lifecycles6, this.iframe.contentWindow);
        this.mountFlag = false;
        this.bus.$clear();
        if (!this.degrade) {
          clearChild(this.shadowRoot);
          // head body需要复用，每次都要清空事件
          removeEventListener(this.head);
          removeEventListener(this.body);
        }
        clearChild(this.head);
        clearChild(this.body);
      }
    }

    /** 销毁子应用 */
  }, {
    key: "destroy",
    value: function destroy() {
      this.unmount();
      this.bus.$clear();
      this.shadowRoot = null;
      this.proxy = null;
      this.proxyDocument = null;
      this.proxyLocation = null;
      this.execQueue = null;
      this.provide = null;
      this.degradeAttrs = null;
      this.styleSheetElements = null;
      this.bus = null;
      this.replace = null;
      this.fetch = null;
      this.execFlag = null;
      this.mountFlag = null;
      this.hrefFlag = null;
      this.document = null;
      this.head = null;
      this.body = null;
      this.elementEventCacheMap = null;
      this.lifecycles = null;
      this.plugins = null;
      this.provide = null;
      this.inject = null;
      this.execQueue = null;
      this.prefix = null;
      // 清除 dom
      if (this.el) {
        clearChild(this.el);
        this.el = null;
      }
      // 清除 iframe 沙箱
      if (this.iframe) {
        var _this$iframe$parentNo;
        var _iframeWindow = this.iframe.contentWindow;
        if (_iframeWindow !== null && _iframeWindow !== void 0 && _iframeWindow.__WUJIE_EVENTLISTENER__) {
          _iframeWindow.__WUJIE_EVENTLISTENER__.forEach(function (o) {
            _iframeWindow.removeEventListener(o.type, o.listener, o.options);
          });
        }
        (_this$iframe$parentNo = this.iframe.parentNode) === null || _this$iframe$parentNo === void 0 || _this$iframe$parentNo.removeChild(this.iframe);
        this.iframe = null;
      }
      deleteWujieById(this.id);
    }

    /** 当子应用再次激活后，只运行mount函数，样式需要重新恢复 */
  }, {
    key: "rebuildStyleSheets",
    value: function rebuildStyleSheets() {
      var _this4 = this;
      if (this.styleSheetElements && this.styleSheetElements.length) {
        this.styleSheetElements.forEach(function (styleSheetElement) {
          rawElementAppendChild.call(_this4.degrade ? _this4.document.head : _this4.shadowRoot.head, styleSheetElement);
        });
      }
      this.patchCssRules();
    }

    /**
     * 子应用样式打补丁
     * 1、兼容:root选择器样式到:host选择器上
     * 2、将@font-face定义到shadowRoot外部
     */
  }, {
    key: "patchCssRules",
    value: function patchCssRules() {
      if (this.degrade) return;
      if (this.shadowRoot.host.hasAttribute(WUJIE_DATA_ATTACH_CSS_FLAG)) return;
      var _getPatchStyleElement = getPatchStyleElements(Array.from(this.iframe.contentDocument.querySelectorAll("style")).map(function (styleSheetElement) {
          return styleSheetElement.sheet;
        })),
        _getPatchStyleElement2 = _slicedToArray(_getPatchStyleElement, 2),
        hostStyleSheetElement = _getPatchStyleElement2[0],
        fontStyleSheetElement = _getPatchStyleElement2[1];
      if (hostStyleSheetElement) {
        this.shadowRoot.head.appendChild(hostStyleSheetElement);
        this.styleSheetElements.push(hostStyleSheetElement);
      }
      if (fontStyleSheetElement) {
        this.shadowRoot.host.appendChild(fontStyleSheetElement);
      }
      (hostStyleSheetElement || fontStyleSheetElement) && this.shadowRoot.host.setAttribute(WUJIE_DATA_ATTACH_CSS_FLAG, "");
    }
  }]);
}();
export { Wujie as default };
//# sourceMappingURL=sandbox.js.map