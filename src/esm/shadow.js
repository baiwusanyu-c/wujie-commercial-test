import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _wrapNativeSuper from "@babel/runtime/helpers/wrapNativeSuper";
import _regeneratorRuntime from "@babel/runtime/regenerator";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
import { WUJIE_APP_ID, WUJIE_IFRAME_CLASS, WUJIE_SHADE_STYLE, CONTAINER_POSITION_DATA_FLAG, CONTAINER_OVERFLOW_DATA_FLAG, LOADING_DATA_FLAG, WUJIE_LOADING_STYLE, WUJIE_LOADING_SVG } from "./constant";
import { getWujieById, rawAppendChild, rawElementAppendChild, rawElementRemoveChild, relativeElementTagAttrMap } from "./common";
import { getExternalStyleSheets } from "./entry";
import { patchElementEffect } from "./iframe";
import { patchRenderEffect } from "./effect";
import { getCssLoader, getPresetLoaders } from "./plugin";
import { getAbsolutePath, getContainer, getCurUrl, setAttrsToElement } from "./utils";
var cssSelectorMap = {
  ":root": ":host"
};
/**
 * 定义 wujie webComponent，将shadow包裹并获得dom装载和卸载的生命周期
 */
export function defineWujieWebComponent() {
  var customElements = window.customElements;
  if (customElements && !(customElements !== null && customElements !== void 0 && customElements.get("wujie-app"))) {
    var WujieApp = /*#__PURE__*/function (_HTMLElement) {
      function WujieApp() {
        _classCallCheck(this, WujieApp);
        return _callSuper(this, WujieApp, arguments);
      }
      _inherits(WujieApp, _HTMLElement);
      return _createClass(WujieApp, [{
        key: "connectedCallback",
        value: function connectedCallback() {
          if (this.shadowRoot) return;
          var shadowRoot = this.attachShadow({
            mode: "open"
          });
          var sandbox = getWujieById(this.getAttribute(WUJIE_APP_ID));
          patchElementEffect(shadowRoot, sandbox.iframe.contentWindow);
          sandbox.shadowRoot = shadowRoot;
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          var sandbox = getWujieById(this.getAttribute(WUJIE_APP_ID));
          sandbox === null || sandbox === void 0 || sandbox.unmount();
        }
      }]);
    }(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
    customElements === null || customElements === void 0 || customElements.define("wujie-app", WujieApp);
  }
}
export function createWujieWebComponent(id) {
  var contentElement = window.document.createElement("wujie-app");
  contentElement.setAttribute(WUJIE_APP_ID, id);
  contentElement.classList.add(WUJIE_IFRAME_CLASS);
  return contentElement;
}

/**
 * 将准备好的内容插入容器
 */
export function renderElementToContainer(element, selectorOrElement) {
  var container = getContainer(selectorOrElement);
  if (container && !container.contains(element)) {
    // 有 loading 无需清理，已经清理过了
    if (!container.querySelector("div[".concat(LOADING_DATA_FLAG, "]"))) {
      // 清除内容
      clearChild(container);
    }
    // 插入元素
    if (element) {
      rawElementAppendChild.call(container, element);
    }
  }
  return container;
}

/**
 * 将降级的iframe挂在到容器上并进行初始化
 */
export function initRenderIframeAndContainer(id, parent) {
  var degradeAttrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var iframe = createIframeContainer(id, degradeAttrs);
  var container = renderElementToContainer(iframe, parent);
  var contentDocument = iframe.contentWindow.document;
  contentDocument.open();
  contentDocument.write("<!DOCTYPE html><html><head></head><body></body></html>");
  contentDocument.close();
  return {
    iframe: iframe,
    container: container
  };
}

/**
 * 处理css-before-loader 以及 css-after-loader
 */
function processCssLoaderForTemplate(_x, _x2) {
  return _processCssLoaderForTemplate.apply(this, arguments);
} // 替换html的head和body
function _processCssLoaderForTemplate() {
  _processCssLoaderForTemplate = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(sandbox, html) {
    var document, plugins, replace, proxyLocation, cssLoader, cssBeforeLoaders, cssAfterLoaders, curUrl;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          document = sandbox.iframe.contentDocument;
          plugins = sandbox.plugins, replace = sandbox.replace, proxyLocation = sandbox.proxyLocation;
          cssLoader = getCssLoader({
            plugins: plugins,
            replace: replace
          });
          cssBeforeLoaders = getPresetLoaders("cssBeforeLoaders", plugins);
          cssAfterLoaders = getPresetLoaders("cssAfterLoaders", plugins);
          curUrl = getCurUrl(proxyLocation);
          _context.next = 8;
          return Promise.all([Promise.all(getExternalStyleSheets(cssBeforeLoaders, sandbox.fetch, sandbox.lifecycles.loadError).map(function (_ref) {
            var src = _ref.src,
              contentPromise = _ref.contentPromise;
            return contentPromise.then(function (content) {
              return {
                src: src,
                content: content
              };
            });
          })).then(function (contentList) {
            contentList.forEach(function (_ref2) {
              var src = _ref2.src,
                content = _ref2.content;
              if (!content) return;
              var styleElement = document.createElement("style");
              styleElement.setAttribute("type", "text/css");
              styleElement.appendChild(document.createTextNode(content ? cssLoader(content, src, curUrl) : content));
              var head = html.querySelector("head");
              var body = html.querySelector("body");
              html.insertBefore(styleElement, head || body || html.firstChild);
            });
          }), Promise.all(getExternalStyleSheets(cssAfterLoaders, sandbox.fetch, sandbox.lifecycles.loadError).map(function (_ref3) {
            var src = _ref3.src,
              contentPromise = _ref3.contentPromise;
            return contentPromise.then(function (content) {
              return {
                src: src,
                content: content
              };
            });
          })).then(function (contentList) {
            contentList.forEach(function (_ref4) {
              var src = _ref4.src,
                content = _ref4.content;
              if (!content) return;
              var styleElement = document.createElement("style");
              styleElement.setAttribute("type", "text/css");
              styleElement.appendChild(document.createTextNode(content ? cssLoader(content, src, curUrl) : content));
              html.appendChild(styleElement);
            });
          })]).then(function () {
            return html;
          }, function () {
            return html;
          });
        case 8:
          return _context.abrupt("return", _context.sent);
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _processCssLoaderForTemplate.apply(this, arguments);
}
function replaceHeadAndBody(html, head, body) {
  var headElement = html.querySelector("head");
  var bodyElement = html.querySelector("body");
  if (headElement) {
    while (headElement.firstChild) {
      rawAppendChild.call(head, headElement.firstChild.cloneNode(true));
      headElement.removeChild(headElement.firstChild);
    }
    headElement.parentNode.replaceChild(head, headElement);
  }
  if (bodyElement) {
    while (bodyElement.firstChild) {
      rawAppendChild.call(body, bodyElement.firstChild.cloneNode(true));
      bodyElement.removeChild(bodyElement.firstChild);
    }
    bodyElement.parentNode.replaceChild(body, bodyElement);
  }
  return html;
}

/**
 * 将template渲染成html元素
 */
function renderTemplateToHtml(iframeWindow, template) {
  var sandbox = iframeWindow.__WUJIE;
  var head = sandbox.head,
    body = sandbox.body,
    alive = sandbox.alive,
    execFlag = sandbox.execFlag;
  var document = iframeWindow.document;
  var html = document.createElement("html");
  html.innerHTML = template;
  // 组件多次渲染，head和body必须一直使用同一个来应对被缓存的场景
  if (!alive && execFlag) {
    html = replaceHeadAndBody(html, head, body);
  } else {
    sandbox.head = html.querySelector("head");
    sandbox.body = html.querySelector("body");
  }
  var ElementIterator = document.createTreeWalker(html, NodeFilter.SHOW_ELEMENT, null, false);
  var nextElement = ElementIterator.currentNode;
  while (nextElement) {
    patchElementEffect(nextElement, iframeWindow);
    var relativeAttr = relativeElementTagAttrMap[nextElement.tagName];
    var url = nextElement[relativeAttr];
    if (relativeAttr) nextElement.setAttribute(relativeAttr, getAbsolutePath(url, nextElement.baseURI || ""));
    nextElement = ElementIterator.nextNode();
  }
  if (!html.querySelector("head")) {
    var _head = document.createElement("head");
    html.appendChild(_head);
  }
  if (!html.querySelector("body")) {
    var _body = document.createElement("body");
    html.appendChild(_body);
  }
  return html;
}

/**
 * 将template渲染到shadowRoot
 */
export function renderTemplateToShadowRoot(_x3, _x4, _x5) {
  return _renderTemplateToShadowRoot.apply(this, arguments);
}
function _renderTemplateToShadowRoot() {
  _renderTemplateToShadowRoot = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(shadowRoot, iframeWindow, template) {
    var html, processedHtml, shade;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          html = renderTemplateToHtml(iframeWindow, template); // 处理 css-before-loader 和 css-after-loader
          _context2.next = 3;
          return processCssLoaderForTemplate(iframeWindow.__WUJIE, html);
        case 3:
          processedHtml = _context2.sent;
          // change ownerDocument
          shadowRoot.appendChild(processedHtml);
          shade = document.createElement("div");
          shade.setAttribute("style", WUJIE_SHADE_STYLE);
          processedHtml.insertBefore(shade, processedHtml.firstChild);
          shadowRoot.head = shadowRoot.querySelector("head");
          shadowRoot.body = shadowRoot.querySelector("body");

          // 修复 html parentNode
          Object.defineProperty(shadowRoot.firstChild, "parentNode", {
            enumerable: true,
            configurable: true,
            get: function get() {
              return iframeWindow.document;
            }
          });
          patchRenderEffect(shadowRoot, iframeWindow.__WUJIE.id, false);
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _renderTemplateToShadowRoot.apply(this, arguments);
}
export function createIframeContainer(id) {
  var degradeAttrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var iframe = document.createElement("iframe");
  var defaultStyle = "height:100%;width:100%";
  setAttrsToElement(iframe, _objectSpread(_objectSpread({}, degradeAttrs), {}, _defineProperty({
    style: [defaultStyle, degradeAttrs.style].join(";")
  }, WUJIE_APP_ID, id)));
  return iframe;
}

/**
 * 将template渲染到iframe
 */
export function renderTemplateToIframe(_x6, _x7, _x8) {
  return _renderTemplateToIframe.apply(this, arguments);
}

/**
 * 清除Element所有节点
 */
function _renderTemplateToIframe() {
  _renderTemplateToIframe = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3(renderDocument, iframeWindow, template) {
    var html, processedHtml;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          // 插入template
          html = renderTemplateToHtml(iframeWindow, template); // 处理 css-before-loader 和 css-after-loader
          _context3.next = 3;
          return processCssLoaderForTemplate(iframeWindow.__WUJIE, html);
        case 3:
          processedHtml = _context3.sent;
          renderDocument.replaceChild(processedHtml, renderDocument.documentElement);

          // 修复 html parentNode
          Object.defineProperty(renderDocument.documentElement, "parentNode", {
            enumerable: true,
            configurable: true,
            get: function get() {
              return iframeWindow.document;
            }
          });
          patchRenderEffect(renderDocument, iframeWindow.__WUJIE.id, true);
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _renderTemplateToIframe.apply(this, arguments);
}
export function clearChild(root) {
  // 清除内容
  while (root !== null && root !== void 0 && root.firstChild) {
    rawElementRemoveChild.call(root, root.firstChild);
  }
}

/**
 * 给容器添加loading
 */
export function addLoading(el, loading) {
  var container = getContainer(el);
  clearChild(container);
  // 给容器设置一些样式，防止 loading 抖动
  var containerStyles = null;
  try {
    containerStyles = window.getComputedStyle(container);
  } catch (_unused) {
    return;
  }
  if (containerStyles.position === "static") {
    container.setAttribute(CONTAINER_POSITION_DATA_FLAG, containerStyles.position);
    container.setAttribute(CONTAINER_OVERFLOW_DATA_FLAG, containerStyles.overflow === "visible" ? "" : containerStyles.overflow);
    container.style.setProperty("position", "relative");
    container.style.setProperty("overflow", "hidden");
  } else if (["relative", "sticky"].includes(containerStyles.position)) {
    container.setAttribute(CONTAINER_OVERFLOW_DATA_FLAG, containerStyles.overflow === "visible" ? "" : containerStyles.overflow);
    container.style.setProperty("overflow", "hidden");
  }
  var loadingContainer = document.createElement("div");
  loadingContainer.setAttribute(LOADING_DATA_FLAG, "");
  loadingContainer.setAttribute("style", WUJIE_LOADING_STYLE);
  if (loading) loadingContainer.appendChild(loading);else loadingContainer.innerHTML = WUJIE_LOADING_SVG;
  container.appendChild(loadingContainer);
}
/**
 * 移除loading
 */
export function removeLoading(el) {
  // 去除容器设置的样式
  var positionFlag = el.getAttribute(CONTAINER_POSITION_DATA_FLAG);
  var overflowFlag = el.getAttribute(CONTAINER_OVERFLOW_DATA_FLAG);
  if (positionFlag) el.style.removeProperty("position");
  if (overflowFlag !== null) {
    overflowFlag ? el.style.setProperty("overflow", overflowFlag) : el.style.removeProperty("overflow");
  }
  el.removeAttribute(CONTAINER_POSITION_DATA_FLAG);
  el.removeAttribute(CONTAINER_OVERFLOW_DATA_FLAG);
  var loadingContainer = el.querySelector("div[".concat(LOADING_DATA_FLAG, "]"));
  loadingContainer && el.removeChild(loadingContainer);
}
/**
 * 获取修复好的样式元素
 * 主要是针对对root样式和font-face样式
 */
export function getPatchStyleElements(rootStyleSheets) {
  var rootCssRules = [];
  var fontCssRules = [];
  var rootStyleReg = /:root/g;

  // 找出root的cssRules
  for (var i = 0; i < rootStyleSheets.length; i++) {
    var _rootStyleSheets$i$cs, _rootStyleSheets$i;
    var cssRules = (_rootStyleSheets$i$cs = (_rootStyleSheets$i = rootStyleSheets[i]) === null || _rootStyleSheets$i === void 0 ? void 0 : _rootStyleSheets$i.cssRules) !== null && _rootStyleSheets$i$cs !== void 0 ? _rootStyleSheets$i$cs : [];
    for (var j = 0; j < cssRules.length; j++) {
      var cssRuleText = cssRules[j].cssText;
      // 如果是root的cssRule
      if (rootStyleReg.test(cssRuleText)) {
        rootCssRules.push(cssRuleText.replace(rootStyleReg, function (match) {
          return cssSelectorMap[match];
        }));
      }
      // 如果是font-face的cssRule
      if (cssRules[j].type === CSSRule.FONT_FACE_RULE) {
        fontCssRules.push(cssRuleText);
      }
    }
  }
  var rootStyleSheetElement = null;
  var fontStyleSheetElement = null;

  // 复制到host上
  if (rootCssRules.length) {
    rootStyleSheetElement = window.document.createElement("style");
    rootStyleSheetElement.innerHTML = rootCssRules.join("");
  }
  if (fontCssRules.length) {
    fontStyleSheetElement = window.document.createElement("style");
    fontStyleSheetElement.innerHTML = fontCssRules.join("");
  }
  return [rootStyleSheetElement, fontStyleSheetElement];
}
//# sourceMappingURL=shadow.js.map