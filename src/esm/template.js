import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { getInlineCode } from "./utils";
var ALL_SCRIPT_REGEX = /(<script[\s\S]*?>)[\s\S]*?<\/script>/gi;
var SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|")text\/ng-template\3)[^])*?>[^]*?<\/\1>/i;
var SCRIPT_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/;
var SCRIPT_TYPE_REGEX = /.*\stype=('|")?([^>'"\s]+)/;
var SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/;
var SCRIPT_ASYNC_REGEX = /.*\sasync\s*.*/;
var DEFER_ASYNC_REGEX = /.*\sdefer\s*.*/;
var SCRIPT_NO_MODULE_REGEX = /.*\snomodule\s*.*/;
var SCRIPT_MODULE_REGEX = /.*\stype=('|")?module('|")?\s*.*/;
var LINK_TAG_REGEX = /<(link)\s+[^]*?>/gi;
var LINK_PRELOAD_OR_PREFETCH_REGEX = /\srel=('|")?(preload|prefetch|modulepreload)\1/;
var LINK_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var LINK_AS_FONT = /.*\sas=('|")?font\1.*/;
var STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi;
var STYLE_TYPE_REGEX = /\s+rel=('|")?stylesheet\1.*/;
var STYLE_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
var LINK_IGNORE_REGEX = /<link(\s+|\s+[^]+\s+)ignore(\s*|\s+[^]*|=[^]*)>/i;
var STYLE_IGNORE_REGEX = /<style(\s+|\s+[^]+\s+)ignore(\s*|\s+[^]*|=[^]*)>/i;
var SCRIPT_IGNORE_REGEX = /<script(\s+|\s+[^]+\s+)ignore(\s*|\s+[^]*|=[^]*)>/i;
var CROSS_ORIGIN_REGEX = /.*\scrossorigin=?('|")?(use-credentials|anonymous)?('|")?/i;

/** 脚本对象 */

/** 样式对象 */

function hasProtocol(url) {
  return url.startsWith("//") || url.startsWith("http://") || url.startsWith("https://");
}
function getEntirePath(path, baseURI) {
  return new URL(path, baseURI).toString();
}
function isValidJavaScriptType(type) {
  var handleTypes = ["text/javascript", "module", "application/javascript", "text/ecmascript", "application/ecmascript"];
  return !type || handleTypes.indexOf(type) !== -1;
}

/**
 * 解析标签的属性
 * @param scriptOuterHTML script 标签的 outerHTML
 * @returns 返回一个对象，包含 script 标签的所有属性
 */
export function parseTagAttributes(TagOuterHTML) {
  var pattern = /<[-\w]+\s+([^>]*)>/i;
  var matches = pattern.exec(TagOuterHTML);
  if (!matches) {
    return {};
  }
  var attributesString = matches[1];
  var attributesPattern = /([^\s=]+)\s*=\s*(['"])(.*?)\2/g;
  var attributesObject = {};
  var attributeMatches;
  while ((attributeMatches = attributesPattern.exec(attributesString)) !== null) {
    var attributeName = attributeMatches[1];
    var attributeValue = attributeMatches[3];
    attributesObject[attributeName] = attributeValue;
  }
  return attributesObject;
}
function isModuleScriptSupported() {
  var s = window.document.createElement("script");
  return "noModule" in s;
}
export var genLinkReplaceSymbol = function genLinkReplaceSymbol(linkHref) {
  var preloadOrPrefetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return "<!-- ".concat(preloadOrPrefetch ? "prefetch/preload/modulepreload" : "", " link ").concat(linkHref, " replaced by wujie -->");
};
export var getInlineStyleReplaceSymbol = function getInlineStyleReplaceSymbol(index) {
  return "<!-- inline-style-".concat(index, " replaced by wujie -->");
};
export var genScriptReplaceSymbol = function genScriptReplaceSymbol(scriptSrc) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  return "<!-- ".concat(type, " script ").concat(scriptSrc, " replaced by wujie -->");
};
export var inlineScriptReplaceSymbol = "<!-- inline scripts replaced by wujie -->";
export var genIgnoreAssetReplaceSymbol = function genIgnoreAssetReplaceSymbol(url) {
  return "<!-- ignore asset ".concat(url || "file", " replaced by wujie -->");
};
export var genModuleScriptReplaceSymbol = function genModuleScriptReplaceSymbol(scriptSrc, moduleSupport) {
  return "<!-- ".concat(moduleSupport ? "nomodule" : "module", " script ").concat(scriptSrc, " ignored by wujie -->");
};

/**
 * parse the script link from the template
 * 1. collect stylesheets
 * 2. use global eval to evaluate the inline scripts
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Difference_between_Function_constructor_and_function_declaration
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!
 * @param tpl
 * @param baseURI
 * @stripStyles whether to strip the css links
 * @returns {{template: void | string | *, scripts: *[], entry: *}}
 */
export default function processTpl(tpl, baseURI, postProcessTemplate) {
  var scripts = [];
  var styles = [];
  var entry = null;
  var moduleSupport = isModuleScriptSupported();
  var template = tpl

  /*
   remove html comment first
   */.replace(HTML_COMMENT_REGEX, "").replace(LINK_TAG_REGEX, function (match) {
    /*
     change the css link
     */
    var styleType = !!match.match(STYLE_TYPE_REGEX);
    if (styleType) {
      var styleHref = match.match(STYLE_HREF_REGEX);
      var styleIgnore = match.match(LINK_IGNORE_REGEX);
      if (styleHref) {
        var href = styleHref && styleHref[2];
        var newHref = href;
        if (href && !hasProtocol(href)) {
          newHref = getEntirePath(href, baseURI);
        }
        if (styleIgnore) {
          return genIgnoreAssetReplaceSymbol(newHref);
        }
        styles.push({
          src: newHref
        });
        return genLinkReplaceSymbol(newHref);
      }
    }
    var preloadOrPrefetchType = match.match(LINK_PRELOAD_OR_PREFETCH_REGEX) && match.match(LINK_HREF_REGEX) && !match.match(LINK_AS_FONT);
    if (preloadOrPrefetchType) {
      var _match$match = match.match(LINK_HREF_REGEX),
        _match$match2 = _slicedToArray(_match$match, 3),
        linkHref = _match$match2[2];
      return genLinkReplaceSymbol(linkHref, true);
    }
    return match;
  }).replace(STYLE_TAG_REGEX, function (match) {
    if (STYLE_IGNORE_REGEX.test(match)) {
      return genIgnoreAssetReplaceSymbol("style file");
    } else {
      var code = getInlineCode(match);
      styles.push({
        src: "",
        content: code
      });
      return getInlineStyleReplaceSymbol(styles.length - 1);
    }
  }).replace(ALL_SCRIPT_REGEX, function (match, scriptTag) {
    var scriptIgnore = scriptTag.match(SCRIPT_IGNORE_REGEX);
    var isModuleScript = !!scriptTag.match(SCRIPT_MODULE_REGEX);
    var isCrossOriginScript = scriptTag.match(CROSS_ORIGIN_REGEX);
    var crossOriginType = (isCrossOriginScript === null || isCrossOriginScript === void 0 ? void 0 : isCrossOriginScript[2]) || "";
    var moduleScriptIgnore = moduleSupport && !!scriptTag.match(SCRIPT_NO_MODULE_REGEX) || !moduleSupport && isModuleScript;
    // in order to keep the exec order of all javascripts

    var matchedScriptTypeMatch = scriptTag.match(SCRIPT_TYPE_REGEX);
    var matchedScriptType = matchedScriptTypeMatch && matchedScriptTypeMatch[2];
    if (!isValidJavaScriptType(matchedScriptType)) {
      return match;
    }

    // if it is a external script
    if (SCRIPT_TAG_REGEX.test(match) && scriptTag.match(SCRIPT_SRC_REGEX)) {
      /*
       collect scripts and replace the ref
       */

      var matchedScriptEntry = scriptTag.match(SCRIPT_ENTRY_REGEX);
      var matchedScriptSrcMatch = scriptTag.match(SCRIPT_SRC_REGEX);
      var matchedScriptSrc = matchedScriptSrcMatch && matchedScriptSrcMatch[2];
      if (entry && matchedScriptEntry) {
        throw new SyntaxError("You should not set multiply entry script!");
      } else {
        // append the domain while the script not have an protocol prefix
        if (matchedScriptSrc && !hasProtocol(matchedScriptSrc)) {
          matchedScriptSrc = getEntirePath(matchedScriptSrc, baseURI);
        }
        entry = entry || matchedScriptEntry && matchedScriptSrc;
      }
      if (scriptIgnore) {
        return genIgnoreAssetReplaceSymbol(matchedScriptSrc || "js file");
      }
      if (moduleScriptIgnore) {
        return genModuleScriptReplaceSymbol(matchedScriptSrc || "js file", moduleSupport);
      }
      if (matchedScriptSrc) {
        var isAsyncScript = !!scriptTag.match(SCRIPT_ASYNC_REGEX);
        var isDeferScript = !!scriptTag.match(DEFER_ASYNC_REGEX);
        scripts.push(isAsyncScript || isDeferScript ? {
          async: isAsyncScript,
          defer: isDeferScript,
          src: matchedScriptSrc,
          module: isModuleScript,
          crossorigin: !!isCrossOriginScript,
          crossoriginType: crossOriginType,
          attrs: parseTagAttributes(match)
        } : {
          src: matchedScriptSrc,
          module: isModuleScript,
          crossorigin: !!isCrossOriginScript,
          crossoriginType: crossOriginType,
          attrs: parseTagAttributes(match)
        });
        return genScriptReplaceSymbol(matchedScriptSrc, isAsyncScript && "async" || isDeferScript && "defer" || "");
      }
      return match;
    } else {
      if (scriptIgnore) {
        return genIgnoreAssetReplaceSymbol("js file");
      }
      if (moduleScriptIgnore) {
        return genModuleScriptReplaceSymbol("js file", moduleSupport);
      }

      // if it is an inline script
      var code = getInlineCode(match);

      // remove script blocks when all of these lines are comments.
      var isPureCommentBlock = code.split(/[\r\n]+/).every(function (line) {
        return !line.trim() || line.trim().startsWith("//");
      });
      if (!isPureCommentBlock && code) {
        scripts.push({
          src: "",
          content: code,
          module: isModuleScript,
          crossorigin: !!isCrossOriginScript,
          crossoriginType: crossOriginType,
          attrs: parseTagAttributes(match)
        });
      }
      return inlineScriptReplaceSymbol;
    }
  });
  var tplResult = {
    template: template,
    scripts: scripts,
    styles: styles,
    // set the last script as entry if have not set
    entry: entry || scripts[scripts.length - 1]
  };
  if (typeof postProcessTemplate === "function") {
    tplResult = postProcessTemplate(tplResult);
  }
  return tplResult;
}
//# sourceMappingURL=template.js.map