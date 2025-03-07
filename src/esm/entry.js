import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
import processTpl, { genLinkReplaceSymbol, getInlineStyleReplaceSymbol } from "./template";
import { defaultGetPublicPath, getInlineCode, requestIdleCallback, error, compose, getCurUrl } from "./utils";
import { WUJIE_TIPS_NO_FETCH, WUJIE_TIPS_SCRIPT_ERROR_REQUESTED, WUJIE_TIPS_CSS_ERROR_REQUESTED, WUJIE_TIPS_HTML_ERROR_REQUESTED } from "./constant";
import { getEffectLoaders, isMatchUrl } from "./plugin";
var styleCache = {};
var scriptCache = {};
var embedHTMLCache = {};
if (!window.fetch) {
  error(WUJIE_TIPS_NO_FETCH);
  throw new Error();
}
var defaultFetch = window.fetch.bind(window);
function defaultGetTemplate(tpl) {
  return tpl;
}

/**
 * 处理css-loader
 */
export function processCssLoader(_x, _x2, _x3) {
  return _processCssLoader.apply(this, arguments);
}

/**
 * convert external css link to inline style for performance optimization
 * @return embedHTML
 */
function _processCssLoader() {
  _processCssLoader = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(sandbox, template, getExternalStyleSheets) {
    var curUrl, composeCssLoader, processedCssList, embedHTML;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          curUrl = getCurUrl(sandbox.proxyLocation);
          /** css-loader */
          composeCssLoader = compose(sandbox.plugins.map(function (plugin) {
            return plugin.cssLoader;
          }));
          processedCssList = getExternalStyleSheets().map(function (_ref2) {
            var src = _ref2.src,
              ignore = _ref2.ignore,
              contentPromise = _ref2.contentPromise;
            return {
              src: src,
              ignore: ignore,
              contentPromise: contentPromise.then(function (content) {
                return composeCssLoader(content, src, curUrl);
              })
            };
          });
          _context.next = 5;
          return getEmbedHTML(template, processedCssList);
        case 5:
          embedHTML = _context.sent;
          return _context.abrupt("return", sandbox.replace ? sandbox.replace(embedHTML) : embedHTML);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _processCssLoader.apply(this, arguments);
}
function getEmbedHTML(_x4, _x5) {
  return _getEmbedHTML.apply(this, arguments);
}
function _getEmbedHTML() {
  _getEmbedHTML = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(template, styleResultList) {
    var embedHTML;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          embedHTML = template;
          return _context2.abrupt("return", Promise.all(styleResultList.map(function (styleResult, index) {
            return styleResult.contentPromise.then(function (content) {
              if (styleResult.src) {
                embedHTML = embedHTML.replace(genLinkReplaceSymbol(styleResult.src), styleResult.ignore ? "<link href=\"".concat(styleResult.src, "\" rel=\"stylesheet\" type=\"text/css\">") : "<style>/* ".concat(styleResult.src, " */").concat(content, "</style>"));
              } else if (content) {
                embedHTML = embedHTML.replace(getInlineStyleReplaceSymbol(index), "<style>/* inline-style-".concat(index, " */").concat(content, "</style>"));
              }
            });
          })).then(function () {
            return embedHTML;
          }));
        case 2:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getEmbedHTML.apply(this, arguments);
}
var isInlineCode = function isInlineCode(code) {
  return code.startsWith("<");
};
var fetchAssets = function fetchAssets(src, cache, fetch, cssFlag, loadError) {
  return cache[src] || (cache[src] = fetch(src).then(function (response) {
    // usually browser treats 4xx and 5xx response of script loading as an error and will fire a script error event
    // https://stackoverflow.com/questions/5625420/what-http-headers-responses-trigger-the-onerror-handler-on-a-script-tag/5625603
    if (response.status >= 400) {
      cache[src] = null;
      if (cssFlag) {
        error(WUJIE_TIPS_CSS_ERROR_REQUESTED, {
          src: src,
          response: response
        });
        loadError === null || loadError === void 0 || loadError(src, new Error(WUJIE_TIPS_CSS_ERROR_REQUESTED));
        return "";
      } else {
        error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED, {
          src: src,
          response: response
        });
        loadError === null || loadError === void 0 || loadError(src, new Error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED));
        throw new Error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED);
      }
    }
    return response.text();
  })["catch"](function (e) {
    cache[src] = null;
    if (cssFlag) {
      error(WUJIE_TIPS_CSS_ERROR_REQUESTED, src);
      loadError === null || loadError === void 0 || loadError(src, e);
      return "";
    } else {
      error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED, src);
      loadError === null || loadError === void 0 || loadError(src, e);
      return "";
    }
  }));
};

// for prefetch
function _getExternalStyleSheets(styles) {
  var fetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFetch;
  var loadError = arguments.length > 2 ? arguments[2] : undefined;
  return styles.map(function (_ref) {
    var src = _ref.src,
      content = _ref.content,
      ignore = _ref.ignore;
    // 内联
    if (content) {
      return {
        src: "",
        contentPromise: Promise.resolve(content)
      };
    } else if (isInlineCode(src)) {
      // if it is inline style
      return {
        src: "",
        contentPromise: Promise.resolve(getInlineCode(src))
      };
    } else {
      // external styles
      return {
        src: src,
        ignore: ignore,
        contentPromise: ignore ? Promise.resolve("") : fetchAssets(src, styleCache, fetch, true, loadError)
      };
    }
  });
}

// for prefetch
export { _getExternalStyleSheets as getExternalStyleSheets };
function _getExternalScripts(scripts) {
  var fetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFetch;
  var loadError = arguments.length > 2 ? arguments[2] : undefined;
  var fiber = arguments.length > 3 ? arguments[3] : undefined;
  // module should be requested in iframe
  return scripts.map(function (script) {
    var src = script.src,
      async = script.async,
      defer = script.defer,
      module = script.module,
      ignore = script.ignore;
    var contentPromise = null;
    // async
    if ((async || defer) && src && !module) {
      contentPromise = new Promise(function (resolve, reject) {
        return fiber ? requestIdleCallback(function () {
          return fetchAssets(src, scriptCache, fetch, false, loadError).then(resolve, reject);
        }) : fetchAssets(src, scriptCache, fetch, false, loadError).then(resolve, reject);
      });
      // module || ignore
    } else if (module && src || ignore) {
      contentPromise = Promise.resolve("");
      // inline
    } else if (!src) {
      contentPromise = Promise.resolve(script.content);
      // outline
    } else {
      contentPromise = fetchAssets(src, scriptCache, fetch, false, loadError);
    }
    // refer https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer
    if (module && !async) script.defer = true;
    return _objectSpread(_objectSpread({}, script), {}, {
      contentPromise: contentPromise
    });
  });
}
export { _getExternalScripts as getExternalScripts };
export default function importHTML(params) {
  var _opts$fetch, _opts$fiber;
  var url = params.url,
    opts = params.opts,
    html = params.html;
  var fetch = (_opts$fetch = opts.fetch) !== null && _opts$fetch !== void 0 ? _opts$fetch : defaultFetch;
  var fiber = (_opts$fiber = opts.fiber) !== null && _opts$fiber !== void 0 ? _opts$fiber : true;
  var plugins = opts.plugins,
    loadError = opts.loadError;
  var htmlLoader = plugins ? compose(plugins.map(function (plugin) {
    return plugin.htmlLoader;
  })) : defaultGetTemplate;
  var jsExcludes = getEffectLoaders("jsExcludes", plugins);
  var cssExcludes = getEffectLoaders("cssExcludes", plugins);
  var jsIgnores = getEffectLoaders("jsIgnores", plugins);
  var cssIgnores = getEffectLoaders("cssIgnores", plugins);
  var getPublicPath = defaultGetPublicPath;
  var getHtmlParseResult = function getHtmlParseResult(url, html, htmlLoader) {
    return (html ? Promise.resolve(html) : fetch(url).then(function (response) {
      if (response.status >= 400) {
        error(WUJIE_TIPS_HTML_ERROR_REQUESTED, {
          url: url,
          response: response
        });
        loadError === null || loadError === void 0 || loadError(url, new Error(WUJIE_TIPS_HTML_ERROR_REQUESTED));
        return "";
      }
      return response.text();
    })["catch"](function (e) {
      embedHTMLCache[url] = null;
      loadError === null || loadError === void 0 || loadError(url, e);
      return Promise.reject(e);
    })).then(function (html) {
      var assetPublicPath = getPublicPath(url);
      var _processTpl = processTpl(htmlLoader(html), assetPublicPath),
        template = _processTpl.template,
        scripts = _processTpl.scripts,
        styles = _processTpl.styles;
      return {
        template: template,
        assetPublicPath: assetPublicPath,
        getExternalScripts: function getExternalScripts() {
          return _getExternalScripts(scripts.filter(function (script) {
            return !script.src || !isMatchUrl(script.src, jsExcludes);
          }).map(function (script) {
            return _objectSpread(_objectSpread({}, script), {}, {
              ignore: script.src && isMatchUrl(script.src, jsIgnores)
            });
          }), fetch, loadError, fiber);
        },
        getExternalStyleSheets: function getExternalStyleSheets() {
          return _getExternalStyleSheets(styles.filter(function (style) {
            return !style.src || !isMatchUrl(style.src, cssExcludes);
          }).map(function (style) {
            return _objectSpread(_objectSpread({}, style), {}, {
              ignore: style.src && isMatchUrl(style.src, cssIgnores)
            });
          }), fetch, loadError);
        }
      };
    });
  };
  if (opts !== null && opts !== void 0 && opts.plugins.some(function (plugin) {
    return plugin.htmlLoader;
  })) {
    return getHtmlParseResult(url, html, htmlLoader);
    // 没有html-loader可以做缓存
  } else {
    return embedHTMLCache[url] || (embedHTMLCache[url] = getHtmlParseResult(url, html, htmlLoader));
  }
}
//# sourceMappingURL=entry.js.map