var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function noop() {
}
const identity$1 = (x) => x;
function assign(tar, src) {
  for (const k in src) tar[k] = src[k];
  return (
    /** @type {T & S} */
    tar
  );
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function exclude_internal_props(props) {
  const result = {};
  for (const k in props) if (k[0] !== "$") result[k] = props[k];
  return result;
}
function compute_rest_props(props, keys4) {
  const rest = {};
  keys4 = new Set(keys4);
  for (const k in props) if (!keys4.has(k) && k[0] !== "$") rest[k] = props[k];
  return rest;
}
function compute_slots(slots) {
  const result = {};
  for (const key in slots) {
    result[key] = true;
  }
  return result;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
function split_css_unit(value) {
  const split = typeof value === "string" && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return split ? [parseFloat(split[1]), split[2] || "px"] : [
    /** @type {number} */
    value,
    "px"
  ];
}
const contenteditable_truthy_values = ["", true, 1, "true", "contenteditable"];
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0) raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0) raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function append(target, node) {
  target.appendChild(node);
}
function get_root_for_style(node) {
  if (!node) return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && /** @type {ShadowRoot} */
  root.host) {
    return (
      /** @type {ShadowRoot} */
      root
    );
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  style_element.textContent = "/* empty */";
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style) {
  append(
    /** @type {Document} */
    node.head || node,
    style
  );
  return style.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function stop_propagation(fn) {
  return function(event) {
    event.stopPropagation();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}
const always_set_through_set_attribute = ["width", "height"];
function set_attributes(node, attributes) {
  const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
  for (const key in attributes) {
    if (attributes[key] == null) {
      node.removeAttribute(key);
    } else if (key === "style") {
      node.style.cssText = attributes[key];
    } else if (key === "__value") {
      node.value = node[key] = attributes[key];
    } else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
      node[key] = attributes[key];
    } else {
      attr(node, key, attributes[key]);
    }
  }
}
function set_custom_element_data_map(node, data_map) {
  Object.keys(data_map).forEach((key) => {
    set_custom_element_data(node, key, data_map[key]);
  });
}
function set_custom_element_data(node, prop3, value) {
  const lower = prop3.toLowerCase();
  if (lower in node) {
    node[lower] = typeof node[lower] === "boolean" && value === "" ? true : value;
  } else if (prop3 in node) {
    node[prop3] = typeof node[prop3] === "boolean" && value === "" ? true : value;
  } else {
    attr(node, prop3, value);
  }
}
function set_dynamic_element_data(tag2) {
  return /-/.test(tag2) ? set_custom_element_data_map : set_attributes;
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data) return;
  text2.data = /** @type {string} */
  data;
}
function set_data_contenteditable(text2, data) {
  data = "" + data;
  if (text2.wholeText === data) return;
  text2.data = /** @type {string} */
  data;
}
function set_data_maybe_contenteditable(text2, data, attr_value) {
  if (~contenteditable_truthy_values.indexOf(attr_value)) {
    set_data_contenteditable(text2, data);
  } else {
    set_data(text2, data);
  }
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, "");
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList.toggle(name, true);
}
function custom_event(type3, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type3, { detail, bubbles, cancelable });
}
class HtmlTag {
  constructor(is_svg = false) {
    /**
     * @private
     * @default false
     */
    __publicField(this, "is_svg", false);
    /** parent for creating node */
    __publicField(this, "e");
    /** html tag nodes */
    __publicField(this, "n");
    /** target */
    __publicField(this, "t");
    /** anchor */
    __publicField(this, "a");
    this.is_svg = is_svg;
    this.e = this.n = null;
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  c(html) {
    this.h(html);
  }
  /**
   * @param {string} html
   * @param {HTMLElement | SVGElement} target
   * @param {HTMLElement | SVGElement} anchor
   * @returns {void}
   */
  m(html, target, anchor = null) {
    if (!this.e) {
      if (this.is_svg)
        this.e = svg_element(
          /** @type {keyof SVGElementTagNameMap} */
          target.nodeName
        );
      else
        this.e = element(
          /** @type {keyof HTMLElementTagNameMap} */
          target.nodeType === 11 ? "TEMPLATE" : target.nodeName
        );
      this.t = target.tagName !== "TEMPLATE" ? target : (
        /** @type {HTMLTemplateElement} */
        target.content
      );
      this.c(html);
    }
    this.i(anchor);
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  h(html) {
    this.e.innerHTML = html;
    this.n = Array.from(
      this.e.nodeName === "TEMPLATE" ? this.e.content.childNodes : this.e.childNodes
    );
  }
  /**
   * @returns {void} */
  i(anchor) {
    for (let i = 0; i < this.n.length; i += 1) {
      insert(this.t, this.n[i], anchor);
    }
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  p(html) {
    this.d();
    this.h(html);
    this.i(this.a);
  }
  /**
   * @returns {void} */
  d() {
    this.n.forEach(detach);
  }
}
function construct_svelte_component(component, props) {
  return new component(props);
}
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--) hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
    // remove all Svelte animations
  );
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active) clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active) return;
    managed_styles.forEach((info) => {
      const { ownerNode } = info.stylesheet;
      if (ownerNode) detach(ownerNode);
    });
    managed_styles.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component) throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type3, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type3];
    if (callbacks) {
      const event = custom_event(
        /** @type {string} */
        type3,
        detail,
        { cancelable }
      );
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
  return context;
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length) binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2) block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params2) {
  const options = { direction: "in" };
  let config2 = fn(node, params2, options);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;
  function cleanup() {
    if (animation_name) delete_rule(node, animation_name);
  }
  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity$1,
      tick: tick2 = noop,
      css
    } = config2 || null_transition;
    if (css) animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick2(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task) task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick2(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick2(t, 1 - t);
        }
      }
      return running;
    });
  }
  let started = false;
  return {
    start() {
      if (started) return;
      started = true;
      delete_rule(node);
      if (is_function(config2)) {
        config2 = config2(options);
        wait().then(go);
      } else {
        go();
      }
    },
    invalidate() {
      started = false;
    },
    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}
function create_out_transition(node, fn, params2) {
  const options = { direction: "out" };
  let config2 = fn(node, params2, options);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;
  let original_inert_value;
  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity$1,
      tick: tick2 = noop,
      css
    } = config2 || null_transition;
    if (css) animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, "start"));
    if ("inert" in node) {
      original_inert_value = /** @type {HTMLElement} */
      node.inert;
      node.inert = true;
    }
    loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick2(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick2(1 - t, t);
        }
      }
      return running;
    });
  }
  if (is_function(config2)) {
    wait().then(() => {
      config2 = config2(options);
      go();
    });
  } else {
    go();
  }
  return {
    end(reset) {
      if (reset && "inert" in node) {
        node.inert = original_inert_value;
      }
      if (reset && config2.tick) {
        config2.tick(1, 0);
      }
      if (running) {
        if (animation_name) delete_rule(node, animation_name);
        running = false;
      }
    }
  };
}
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function outro_and_destroy_block(block, lookup) {
  transition_out(block, 1, 1, () => {
    lookup.delete(block.key);
  });
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--) old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  const updates = [];
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block2(key, child_ctx);
      block.c();
    } else {
      updates.push(() => block.p(child_ctx, dirty));
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert2(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert2(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert2(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
  }
  while (n) insert2(new_blocks[n - 1]);
  run_all(updates);
  return new_blocks;
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n)) to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2)) update2[key] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
      if (ready) make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type3, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type3] || (this.$$.callbacks[type3] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
var define_process_env_default = {};
var __create$2 = Object.create;
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$2 = Object.getOwnPropertyNames;
var __getProtoOf$2 = Object.getPrototypeOf;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __commonJS$2 = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames$2(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __copyProps$2 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames$2(from))
      if (!__hasOwnProp$2.call(to, key) && key !== except)
        __defProp$2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc$2(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM$2 = (mod2, isNodeMode, target) => (target = mod2 != null ? __create$2(__getProtoOf$2(mod2)) : {}, __copyProps$2(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  __defProp$2(target, "default", { value: mod2, enumerable: true }),
  mod2
));
var require_symbols = __commonJS$2({
  "../node_modules/.pnpm/ansi-colors@4.1.3/node_modules/ansi-colors/symbols.js"(exports, module) {
    var isHyper = typeof process !== "undefined" && define_process_env_default.TERM_PROGRAM === "Hyper";
    var isWindows = typeof process !== "undefined" && process.platform === "win32";
    var isLinux = typeof process !== "undefined" && process.platform === "linux";
    var common = {
      ballotDisabled: "☒",
      ballotOff: "☐",
      ballotOn: "☑",
      bullet: "•",
      bulletWhite: "◦",
      fullBlock: "█",
      heart: "❤",
      identicalTo: "≡",
      line: "─",
      mark: "※",
      middot: "·",
      minus: "－",
      multiplication: "×",
      obelus: "÷",
      pencilDownRight: "✎",
      pencilRight: "✏",
      pencilUpRight: "✐",
      percent: "%",
      pilcrow2: "❡",
      pilcrow: "¶",
      plusMinus: "±",
      question: "?",
      section: "§",
      starsOff: "☆",
      starsOn: "★",
      upDownArrow: "↕"
    };
    var windows = Object.assign({}, common, {
      check: "√",
      cross: "×",
      ellipsisLarge: "...",
      ellipsis: "...",
      info: "i",
      questionSmall: "?",
      pointer: ">",
      pointerSmall: "»",
      radioOff: "( )",
      radioOn: "(*)",
      warning: "‼"
    });
    var other = Object.assign({}, common, {
      ballotCross: "✘",
      check: "✔",
      cross: "✖",
      ellipsisLarge: "⋯",
      ellipsis: "…",
      info: "ℹ",
      questionFull: "？",
      questionSmall: "﹖",
      pointer: isLinux ? "▸" : "❯",
      pointerSmall: isLinux ? "‣" : "›",
      radioOff: "◯",
      radioOn: "◉",
      warning: "⚠"
    });
    module.exports = isWindows && !isHyper ? windows : other;
    Reflect.defineProperty(module.exports, "common", { enumerable: false, value: common });
    Reflect.defineProperty(module.exports, "windows", { enumerable: false, value: windows });
    Reflect.defineProperty(module.exports, "other", { enumerable: false, value: other });
  }
});
var require_ansi_colors = __commonJS$2({
  "../node_modules/.pnpm/ansi-colors@4.1.3/node_modules/ansi-colors/index.js"(exports, module) {
    var isObject2 = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    var ANSI_REGEX = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g;
    var hasColor = () => {
      if (typeof process !== "undefined") {
        return define_process_env_default.FORCE_COLOR !== "0";
      }
      return false;
    };
    var create = () => {
      const colors2 = {
        enabled: hasColor(),
        visible: true,
        styles: {},
        keys: {}
      };
      const ansi = (style2) => {
        let open = style2.open = `\x1B[${style2.codes[0]}m`;
        let close = style2.close = `\x1B[${style2.codes[1]}m`;
        let regex = style2.regex = new RegExp(`\\u001b\\[${style2.codes[1]}m`, "g");
        style2.wrap = (input, newline) => {
          if (input.includes(close)) input = input.replace(regex, close + open);
          let output = open + input + close;
          return newline ? output.replace(/\r*\n/g, `${close}$&${open}`) : output;
        };
        return style2;
      };
      const wrap = (style2, input, newline) => {
        return typeof style2 === "function" ? style2(input) : style2.wrap(input, newline);
      };
      const style = (input, stack) => {
        if (input === "" || input == null) return "";
        if (colors2.enabled === false) return input;
        if (colors2.visible === false) return "";
        let str = "" + input;
        let nl = str.includes("\n");
        let n = stack.length;
        if (n > 0 && stack.includes("unstyle")) {
          stack = [.../* @__PURE__ */ new Set(["unstyle", ...stack])].reverse();
        }
        while (n-- > 0) str = wrap(colors2.styles[stack[n]], str, nl);
        return str;
      };
      const define2 = (name, codes, type3) => {
        colors2.styles[name] = ansi({ name, codes });
        let keys4 = colors2.keys[type3] || (colors2.keys[type3] = []);
        keys4.push(name);
        Reflect.defineProperty(colors2, name, {
          configurable: true,
          enumerable: true,
          set(value) {
            colors2.alias(name, value);
          },
          get() {
            let color = (input) => style(input, color.stack);
            Reflect.setPrototypeOf(color, colors2);
            color.stack = this.stack ? this.stack.concat(name) : [name];
            return color;
          }
        });
      };
      define2("reset", [0, 0], "modifier");
      define2("bold", [1, 22], "modifier");
      define2("dim", [2, 22], "modifier");
      define2("italic", [3, 23], "modifier");
      define2("underline", [4, 24], "modifier");
      define2("inverse", [7, 27], "modifier");
      define2("hidden", [8, 28], "modifier");
      define2("strikethrough", [9, 29], "modifier");
      define2("black", [30, 39], "color");
      define2("red", [31, 39], "color");
      define2("green", [32, 39], "color");
      define2("yellow", [33, 39], "color");
      define2("blue", [34, 39], "color");
      define2("magenta", [35, 39], "color");
      define2("cyan", [36, 39], "color");
      define2("white", [37, 39], "color");
      define2("gray", [90, 39], "color");
      define2("grey", [90, 39], "color");
      define2("bgBlack", [40, 49], "bg");
      define2("bgRed", [41, 49], "bg");
      define2("bgGreen", [42, 49], "bg");
      define2("bgYellow", [43, 49], "bg");
      define2("bgBlue", [44, 49], "bg");
      define2("bgMagenta", [45, 49], "bg");
      define2("bgCyan", [46, 49], "bg");
      define2("bgWhite", [47, 49], "bg");
      define2("blackBright", [90, 39], "bright");
      define2("redBright", [91, 39], "bright");
      define2("greenBright", [92, 39], "bright");
      define2("yellowBright", [93, 39], "bright");
      define2("blueBright", [94, 39], "bright");
      define2("magentaBright", [95, 39], "bright");
      define2("cyanBright", [96, 39], "bright");
      define2("whiteBright", [97, 39], "bright");
      define2("bgBlackBright", [100, 49], "bgBright");
      define2("bgRedBright", [101, 49], "bgBright");
      define2("bgGreenBright", [102, 49], "bgBright");
      define2("bgYellowBright", [103, 49], "bgBright");
      define2("bgBlueBright", [104, 49], "bgBright");
      define2("bgMagentaBright", [105, 49], "bgBright");
      define2("bgCyanBright", [106, 49], "bgBright");
      define2("bgWhiteBright", [107, 49], "bgBright");
      colors2.ansiRegex = ANSI_REGEX;
      colors2.hasColor = colors2.hasAnsi = (str) => {
        colors2.ansiRegex.lastIndex = 0;
        return typeof str === "string" && str !== "" && colors2.ansiRegex.test(str);
      };
      colors2.alias = (name, color) => {
        let fn = typeof color === "string" ? colors2[color] : color;
        if (typeof fn !== "function") {
          throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
        }
        if (!fn.stack) {
          Reflect.defineProperty(fn, "name", { value: name });
          colors2.styles[name] = fn;
          fn.stack = [name];
        }
        Reflect.defineProperty(colors2, name, {
          configurable: true,
          enumerable: true,
          set(value) {
            colors2.alias(name, value);
          },
          get() {
            let color2 = (input) => style(input, color2.stack);
            Reflect.setPrototypeOf(color2, colors2);
            color2.stack = this.stack ? this.stack.concat(fn.stack) : fn.stack;
            return color2;
          }
        });
      };
      colors2.theme = (custom) => {
        if (!isObject2(custom)) throw new TypeError("Expected theme to be an object");
        for (let name of Object.keys(custom)) {
          colors2.alias(name, custom[name]);
        }
        return colors2;
      };
      colors2.alias("unstyle", (str) => {
        if (typeof str === "string" && str !== "") {
          colors2.ansiRegex.lastIndex = 0;
          return str.replace(colors2.ansiRegex, "");
        }
        return "";
      });
      colors2.alias("noop", (str) => str);
      colors2.none = colors2.clear = colors2.noop;
      colors2.stripColor = colors2.unstyle;
      colors2.symbols = require_symbols();
      colors2.define = define2;
      return colors2;
    };
    module.exports = create();
    module.exports.create = create;
  }
});
__toESM$2(require_ansi_colors());
var extend = (objFir, objSec) => {
  return Object.assign({}, objFir, objSec);
};
function jsonClone(val) {
  return JSON.parse(JSON.stringify(val));
}
var isEmptyObj = (val) => JSON.stringify(val) === "{}";
var isString = (val) => typeof val === "string" && val.constructor === String;
var isNumber = (val) => typeof val === "number";
var isFunction$1 = (val) => Object.prototype.toString.call(val) === "[object Function]" || Object.prototype.toString.call(val) === "[object AsyncFunction]";
function isObject(val) {
  if (val === void 0 || val === null)
    return false;
  else
    return toString.call(val) === "[object Object]";
}
var isArray = (obj, func) => {
  if (isFunction$1(func) && func)
    ;
  else
    return toString.call(obj) === "[object Array]";
};
var __create$1 = Object.create;
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$1 = Object.getOwnPropertyNames;
var __getProtoOf$1 = Object.getPrototypeOf;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __commonJS$1 = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames$1(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __copyProps$1 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames$1(from))
      if (!__hasOwnProp$1.call(to, key) && key !== except)
        __defProp$1(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc$1(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM$1 = (mod2, isNodeMode, target) => (target = mod2 != null ? __create$1(__getProtoOf$1(mod2)) : {}, __copyProps$1(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  __defProp$1(target, "default", { value: mod2, enumerable: true }),
  mod2
));
var require_hash_sum = __commonJS$1({
  "../node_modules/.pnpm/hash-sum@2.0.0/node_modules/hash-sum/hash-sum.js"(exports, module) {
    function pad3(hash2, len) {
      while (hash2.length < len) {
        hash2 = "0" + hash2;
      }
      return hash2;
    }
    function fold(hash2, text2) {
      var i;
      var chr;
      var len;
      if (text2.length === 0) {
        return hash2;
      }
      for (i = 0, len = text2.length; i < len; i++) {
        chr = text2.charCodeAt(i);
        hash2 = (hash2 << 5) - hash2 + chr;
        hash2 |= 0;
      }
      return hash2 < 0 ? hash2 * -2 : hash2;
    }
    function foldObject(hash2, o, seen) {
      return Object.keys(o).sort().reduce(foldKey, hash2);
      function foldKey(hash3, key) {
        return foldValue(hash3, o[key], key, seen);
      }
    }
    function foldValue(input, value, key, seen) {
      var hash2 = fold(fold(fold(input, key), toString4(value)), typeof value);
      if (value === null) {
        return fold(hash2, "null");
      }
      if (value === void 0) {
        return fold(hash2, "undefined");
      }
      if (typeof value === "object" || typeof value === "function") {
        if (seen.indexOf(value) !== -1) {
          return fold(hash2, "[Circular]" + key);
        }
        seen.push(value);
        var objHash = foldObject(hash2, value, seen);
        if (!("valueOf" in value) || typeof value.valueOf !== "function") {
          return objHash;
        }
        try {
          return fold(objHash, String(value.valueOf()));
        } catch (err) {
          return fold(objHash, "[valueOf exception]" + (err.stack || err.message));
        }
      }
      return fold(hash2, value.toString());
    }
    function toString4(o) {
      return Object.prototype.toString.call(o);
    }
    function sum2(o) {
      return pad3(foldValue(0, o, "", []).toString(16), 8);
    }
    module.exports = sum2;
  }
});
__toESM$1(require_hash_sum());
function debounce(func, wait2) {
  let timeoutId;
  return function debounced(...args) {
    if (timeoutId !== void 0)
      clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      func(...args);
      timeoutId = void 0;
    }, wait2);
  };
}
var __create = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  __defProp2(target, "default", { value: mod2, enumerable: true }),
  mod2
));
var require_dayjs_min = __commonJS({
  "../node_modules/.pnpm/dayjs@1.11.13/node_modules/dayjs/dayjs.min.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
    }(exports, function() {
      var t = 1e3, e = 6e4, n = 36e5, r2 = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r22 = String(t2);
        return !r22 || r22.length >= e2 ? t2 : "" + Array(e2 + 1 - r22.length).join(n2) + t2;
      }, v = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r22 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r22, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date()) return -t2(n2, e2);
        var r22 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r22, c), s2 = n2 - i2 < 0, u2 = e2.clone().add(r22 + (s2 ? -1 : 1), c);
        return +(-(r22 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r2, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, g = "en", D = {};
      D[g] = M;
      var p = "$isDayjsObject", S = function(t2) {
        return t2 instanceof _ || !(!t2 || !t2[p]);
      }, w = function t2(e2, n2, r22) {
        var i2;
        if (!e2) return g;
        if ("string" == typeof e2) {
          var s2 = e2.toLowerCase();
          D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1) return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D[a2] = e2, i2 = a2;
        }
        return !r22 && i2 && (g = i2), i2 || !r22 && g;
      }, O = function(t2, e2) {
        if (S(t2)) return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _(n2);
      }, b = v;
      b.l = w, b.i = S, b.w = function(t2, e2) {
        return O(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = function() {
        function M2(t2) {
          this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
        }
        var m2 = M2.prototype;
        return m2.parse = function(t2) {
          this.$d = function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (null === e2) return /* @__PURE__ */ new Date(NaN);
            if (b.u(e2)) return /* @__PURE__ */ new Date();
            if (e2 instanceof Date) return new Date(e2);
            if ("string" == typeof e2 && !/Z$/i.test(e2)) {
              var r22 = e2.match($);
              if (r22) {
                var i2 = r22[2] - 1 || 0, s2 = (r22[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r22[1], i2, r22[3] || 1, r22[4] || 0, r22[5] || 0, r22[6] || 0, s2)) : new Date(r22[1], i2, r22[3] || 1, r22[4] || 0, r22[5] || 0, r22[6] || 0, s2);
              }
            }
            return new Date(e2);
          }(t2), this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return b;
        }, m2.isValid = function() {
          return !(this.$d.toString() === l);
        }, m2.isSame = function(t2, e2) {
          var n2 = O(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return O(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < O(t2);
        }, m2.$g = function(t2, e2, n2) {
          return b.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r22 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
            var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r22 ? i2 : i2.endOf(a);
          }, $2 = function(t3, e3) {
            return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r22 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
          switch (f2) {
            case h:
              return r22 ? l2(1, 0) : l2(31, 11);
            case c:
              return r22 ? l2(1, M3) : l2(0, M3 + 1);
            case o:
              var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
              return l2(r22 ? m3 - D2 : m3 + (6 - D2), M3);
            case a:
            case d:
              return $2(v2 + "Hours", 0);
            case u:
              return $2(v2 + "Minutes", 1);
            case s:
              return $2(v2 + "Seconds", 2);
            case i:
              return $2(v2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r2] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === c || o2 === h) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else l2 && this.$d[l2]($2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[b.p(t2)]();
        }, m2.add = function(r22, f2) {
          var d2, l2 = this;
          r22 = Number(r22);
          var $2 = b.p(f2), y2 = function(t2) {
            var e2 = O(l2);
            return b.w(e2.date(e2.date() + Math.round(t2 * r22)), l2);
          };
          if ($2 === c) return this.set(c, this.$M + r22);
          if ($2 === h) return this.set(h, this.$y + r22);
          if ($2 === a) return y2(1);
          if ($2 === o) return y2(7);
          var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r22 * M3;
          return b.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid()) return n2.invalidDate || l;
          var r22 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s3) {
            return t3 && (t3[n3] || t3(e2, r22)) || i3[n3].slice(0, s3);
          }, d2 = function(t3) {
            return b.s(s2 % 12 || 12, t3, "0");
          }, $2 = f2 || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          };
          return r22.replace(y, function(t3, r3) {
            return r3 || function(t4) {
              switch (t4) {
                case "YY":
                  return String(e2.$y).slice(-2);
                case "YYYY":
                  return b.s(e2.$y, 4, "0");
                case "M":
                  return a2 + 1;
                case "MM":
                  return b.s(a2 + 1, 2, "0");
                case "MMM":
                  return h2(n2.monthsShort, a2, c2, 3);
                case "MMMM":
                  return h2(c2, a2);
                case "D":
                  return e2.$D;
                case "DD":
                  return b.s(e2.$D, 2, "0");
                case "d":
                  return String(e2.$W);
                case "dd":
                  return h2(n2.weekdaysMin, e2.$W, o2, 2);
                case "ddd":
                  return h2(n2.weekdaysShort, e2.$W, o2, 3);
                case "dddd":
                  return o2[e2.$W];
                case "H":
                  return String(s2);
                case "HH":
                  return b.s(s2, 2, "0");
                case "h":
                  return d2(1);
                case "hh":
                  return d2(2);
                case "a":
                  return $2(s2, u2, true);
                case "A":
                  return $2(s2, u2, false);
                case "m":
                  return String(u2);
                case "mm":
                  return b.s(u2, 2, "0");
                case "s":
                  return String(e2.$s);
                case "ss":
                  return b.s(e2.$s, 2, "0");
                case "SSS":
                  return b.s(e2.$ms, 3, "0");
                case "Z":
                  return i2;
              }
              return null;
            }(t3) || i2.replace(":", "");
          });
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r22, d2, l2) {
          var $2, y2 = this, M3 = b.p(d2), m3 = O(r22), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
            return b.m(y2, m3);
          };
          switch (M3) {
            case h:
              $2 = D2() / 12;
              break;
            case c:
              $2 = D2();
              break;
            case f:
              $2 = D2() / 3;
              break;
            case o:
              $2 = (g2 - v2) / 6048e5;
              break;
            case a:
              $2 = (g2 - v2) / 864e5;
              break;
            case u:
              $2 = g2 / n;
              break;
            case s:
              $2 = g2 / e;
              break;
            case i:
              $2 = g2 / t;
              break;
            default:
              $2 = g2;
          }
          return l2 ? $2 : b.a($2);
        }, m2.daysInMonth = function() {
          return this.endOf(c).$D;
        }, m2.$locale = function() {
          return D[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2) return this.$L;
          var n2 = this.clone(), r22 = w(t2, e2, true);
          return r22 && (n2.$L = r22), n2;
        }, m2.clone = function() {
          return b.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M2;
      }(), k = _.prototype;
      return O.prototype = k, [["$ms", r2], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t2) {
        k[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }), O.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _, O), t2.$i = true), O;
      }, O.locale = w, O.isDayjs = S, O.unix = function(t2) {
        return O(1e3 * t2);
      }, O.en = D[g], O.Ls = D, O.p = {}, O;
    });
  }
});
var require_utc = __commonJS({
  "../node_modules/.pnpm/dayjs@1.11.13/node_modules/dayjs/plugin/utc.js"(exports, module) {
    !function(t, i) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define(i) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_utc = i();
    }(exports, function() {
      var t = "minute", i = /[+-]\d\d(?::?\d\d)?/g, e = /([+-]|\d\d)/g;
      return function(s, f, n) {
        var u = f.prototype;
        n.utc = function(t2) {
          var i2 = { date: t2, utc: true, args: arguments };
          return new f(i2);
        }, u.utc = function(i2) {
          var e2 = n(this.toDate(), { locale: this.$L, utc: true });
          return i2 ? e2.add(this.utcOffset(), t) : e2;
        }, u.local = function() {
          return n(this.toDate(), { locale: this.$L, utc: false });
        };
        var o = u.parse;
        u.parse = function(t2) {
          t2.utc && (this.$u = true), this.$utils().u(t2.$offset) || (this.$offset = t2.$offset), o.call(this, t2);
        };
        var r2 = u.init;
        u.init = function() {
          if (this.$u) {
            var t2 = this.$d;
            this.$y = t2.getUTCFullYear(), this.$M = t2.getUTCMonth(), this.$D = t2.getUTCDate(), this.$W = t2.getUTCDay(), this.$H = t2.getUTCHours(), this.$m = t2.getUTCMinutes(), this.$s = t2.getUTCSeconds(), this.$ms = t2.getUTCMilliseconds();
          } else r2.call(this);
        };
        var a = u.utcOffset;
        u.utcOffset = function(s2, f2) {
          var n2 = this.$utils().u;
          if (n2(s2)) return this.$u ? 0 : n2(this.$offset) ? a.call(this) : this.$offset;
          if ("string" == typeof s2 && (s2 = function(t2) {
            void 0 === t2 && (t2 = "");
            var s3 = t2.match(i);
            if (!s3) return null;
            var f3 = ("" + s3[0]).match(e) || ["-", 0, 0], n3 = f3[0], u3 = 60 * +f3[1] + +f3[2];
            return 0 === u3 ? 0 : "+" === n3 ? u3 : -u3;
          }(s2), null === s2)) return this;
          var u2 = Math.abs(s2) <= 16 ? 60 * s2 : s2, o2 = this;
          if (f2) return o2.$offset = u2, o2.$u = 0 === s2, o2;
          if (0 !== s2) {
            var r22 = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
            (o2 = this.local().add(u2 + r22, t)).$offset = u2, o2.$x.$localOffset = r22;
          } else o2 = this.utc();
          return o2;
        };
        var h = u.format;
        u.format = function(t2) {
          var i2 = t2 || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
          return h.call(this, i2);
        }, u.valueOf = function() {
          var t2 = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset());
          return this.$d.valueOf() - 6e4 * t2;
        }, u.isUTC = function() {
          return !!this.$u;
        }, u.toISOString = function() {
          return this.toDate().toISOString();
        }, u.toString = function() {
          return this.toDate().toUTCString();
        };
        var l = u.toDate;
        u.toDate = function(t2) {
          return "s" === t2 && this.$offset ? n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : l.call(this);
        };
        var c = u.diff;
        u.diff = function(t2, i2, e2) {
          if (t2 && this.$u === t2.$u) return c.call(this, t2, i2, e2);
          var s2 = this.local(), f2 = n(t2).local();
          return c.call(s2, f2, i2, e2);
        };
      };
    });
  }
});
var require_duration = __commonJS({
  "../node_modules/.pnpm/dayjs@1.11.13/node_modules/dayjs/plugin/duration.js"(exports, module) {
    !function(t, s) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = s() : "function" == typeof define && define.amd ? define(s) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_duration = s();
    }(exports, function() {
      var t, s, n = 1e3, i = 6e4, e = 36e5, r2 = 864e5, o = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, u = 31536e6, d = 2628e6, a = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/, h = { years: u, months: d, days: r2, hours: e, minutes: i, seconds: n, milliseconds: 1, weeks: 6048e5 }, c = function(t2) {
        return t2 instanceof g;
      }, f = function(t2, s2, n2) {
        return new g(t2, n2, s2.$l);
      }, m = function(t2) {
        return s.p(t2) + "s";
      }, l = function(t2) {
        return t2 < 0;
      }, $ = function(t2) {
        return l(t2) ? Math.ceil(t2) : Math.floor(t2);
      }, y = function(t2) {
        return Math.abs(t2);
      }, v = function(t2, s2) {
        return t2 ? l(t2) ? { negative: true, format: "" + y(t2) + s2 } : { negative: false, format: "" + t2 + s2 } : { negative: false, format: "" };
      }, g = function() {
        function l2(t2, s2, n2) {
          var i2 = this;
          if (this.$d = {}, this.$l = n2, void 0 === t2 && (this.$ms = 0, this.parseFromMilliseconds()), s2) return f(t2 * h[m(s2)], this);
          if ("number" == typeof t2) return this.$ms = t2, this.parseFromMilliseconds(), this;
          if ("object" == typeof t2) return Object.keys(t2).forEach(function(s3) {
            i2.$d[m(s3)] = t2[s3];
          }), this.calMilliseconds(), this;
          if ("string" == typeof t2) {
            var e2 = t2.match(a);
            if (e2) {
              var r22 = e2.slice(2).map(function(t3) {
                return null != t3 ? Number(t3) : 0;
              });
              return this.$d.years = r22[0], this.$d.months = r22[1], this.$d.weeks = r22[2], this.$d.days = r22[3], this.$d.hours = r22[4], this.$d.minutes = r22[5], this.$d.seconds = r22[6], this.calMilliseconds(), this;
            }
          }
          return this;
        }
        var y2 = l2.prototype;
        return y2.calMilliseconds = function() {
          var t2 = this;
          this.$ms = Object.keys(this.$d).reduce(function(s2, n2) {
            return s2 + (t2.$d[n2] || 0) * h[n2];
          }, 0);
        }, y2.parseFromMilliseconds = function() {
          var t2 = this.$ms;
          this.$d.years = $(t2 / u), t2 %= u, this.$d.months = $(t2 / d), t2 %= d, this.$d.days = $(t2 / r2), t2 %= r2, this.$d.hours = $(t2 / e), t2 %= e, this.$d.minutes = $(t2 / i), t2 %= i, this.$d.seconds = $(t2 / n), t2 %= n, this.$d.milliseconds = t2;
        }, y2.toISOString = function() {
          var t2 = v(this.$d.years, "Y"), s2 = v(this.$d.months, "M"), n2 = +this.$d.days || 0;
          this.$d.weeks && (n2 += 7 * this.$d.weeks);
          var i2 = v(n2, "D"), e2 = v(this.$d.hours, "H"), r22 = v(this.$d.minutes, "M"), o2 = this.$d.seconds || 0;
          this.$d.milliseconds && (o2 += this.$d.milliseconds / 1e3, o2 = Math.round(1e3 * o2) / 1e3);
          var u2 = v(o2, "S"), d2 = t2.negative || s2.negative || i2.negative || e2.negative || r22.negative || u2.negative, a2 = e2.format || r22.format || u2.format ? "T" : "", h2 = (d2 ? "-" : "") + "P" + t2.format + s2.format + i2.format + a2 + e2.format + r22.format + u2.format;
          return "P" === h2 || "-P" === h2 ? "P0D" : h2;
        }, y2.toJSON = function() {
          return this.toISOString();
        }, y2.format = function(t2) {
          var n2 = t2 || "YYYY-MM-DDTHH:mm:ss", i2 = { Y: this.$d.years, YY: s.s(this.$d.years, 2, "0"), YYYY: s.s(this.$d.years, 4, "0"), M: this.$d.months, MM: s.s(this.$d.months, 2, "0"), D: this.$d.days, DD: s.s(this.$d.days, 2, "0"), H: this.$d.hours, HH: s.s(this.$d.hours, 2, "0"), m: this.$d.minutes, mm: s.s(this.$d.minutes, 2, "0"), s: this.$d.seconds, ss: s.s(this.$d.seconds, 2, "0"), SSS: s.s(this.$d.milliseconds, 3, "0") };
          return n2.replace(o, function(t3, s2) {
            return s2 || String(i2[t3]);
          });
        }, y2.as = function(t2) {
          return this.$ms / h[m(t2)];
        }, y2.get = function(t2) {
          var s2 = this.$ms, n2 = m(t2);
          return "milliseconds" === n2 ? s2 %= 1e3 : s2 = "weeks" === n2 ? $(s2 / h[n2]) : this.$d[n2], s2 || 0;
        }, y2.add = function(t2, s2, n2) {
          var i2;
          return i2 = s2 ? t2 * h[m(s2)] : c(t2) ? t2.$ms : f(t2, this).$ms, f(this.$ms + i2 * (n2 ? -1 : 1), this);
        }, y2.subtract = function(t2, s2) {
          return this.add(t2, s2, true);
        }, y2.locale = function(t2) {
          var s2 = this.clone();
          return s2.$l = t2, s2;
        }, y2.clone = function() {
          return f(this.$ms, this);
        }, y2.humanize = function(s2) {
          return t().add(this.$ms, "ms").locale(this.$l).fromNow(!s2);
        }, y2.valueOf = function() {
          return this.asMilliseconds();
        }, y2.milliseconds = function() {
          return this.get("milliseconds");
        }, y2.asMilliseconds = function() {
          return this.as("milliseconds");
        }, y2.seconds = function() {
          return this.get("seconds");
        }, y2.asSeconds = function() {
          return this.as("seconds");
        }, y2.minutes = function() {
          return this.get("minutes");
        }, y2.asMinutes = function() {
          return this.as("minutes");
        }, y2.hours = function() {
          return this.get("hours");
        }, y2.asHours = function() {
          return this.as("hours");
        }, y2.days = function() {
          return this.get("days");
        }, y2.asDays = function() {
          return this.as("days");
        }, y2.weeks = function() {
          return this.get("weeks");
        }, y2.asWeeks = function() {
          return this.as("weeks");
        }, y2.months = function() {
          return this.get("months");
        }, y2.asMonths = function() {
          return this.as("months");
        }, y2.years = function() {
          return this.get("years");
        }, y2.asYears = function() {
          return this.as("years");
        }, l2;
      }(), p = function(t2, s2, n2) {
        return t2.add(s2.years() * n2, "y").add(s2.months() * n2, "M").add(s2.days() * n2, "d").add(s2.hours() * n2, "h").add(s2.minutes() * n2, "m").add(s2.seconds() * n2, "s").add(s2.milliseconds() * n2, "ms");
      };
      return function(n2, i2, e2) {
        t = e2, s = e2().$utils(), e2.duration = function(t2, s2) {
          var n3 = e2.locale();
          return f(t2, { $l: n3 }, s2);
        }, e2.isDuration = c;
        var r22 = i2.prototype.add, o2 = i2.prototype.subtract;
        i2.prototype.add = function(t2, s2) {
          return c(t2) ? p(this, t2, 1) : r22.bind(this)(t2, s2);
        }, i2.prototype.subtract = function(t2, s2) {
          return c(t2) ? p(this, t2, -1) : o2.bind(this)(t2, s2);
        };
      };
    });
  }
});
__toESM(require_dayjs_min());
__toESM(require_utc());
__toESM(require_duration());
var getPrefixCls = (cls) => `k-${cls}`;
var KSymbolKey = (key) => {
  key = key.replace(/[-|_]+/g, "_").replace(/[A-Z]/g, (key2) => `_${key2}`).replace(/_+([a-z])/g, (_, key2) => `_${key2}`).replace(/^_+|_+$/g, "");
  return Symbol(`K_${key.toUpperCase()}_KEY`);
};
KSymbolKey("breadcrumb");
var buttonGroupKey = KSymbolKey("buttonGroup");
KSymbolKey("collapseWrapper");
KSymbolKey("checkboxGroup");
KSymbolKey("radioGroup");
KSymbolKey("row");
KSymbolKey("contextmenu");
var formKey = KSymbolKey("form");
var formItemKey = KSymbolKey("formItem");
var dropDownKey = KSymbolKey("dropDown");
KSymbolKey("tabs");
KSymbolKey("descriptions");
KSymbolKey("segmented");
var menuKey = KSymbolKey("menu");
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
function create_fragment$r(ctx) {
  let span;
  let mounted;
  let dispose;
  let span_levels = [
    { class: (
      /*cnames*/
      ctx[3]
    ) },
    { role: (
      /*tag*/
      ctx[4]
    ) },
    /*$$restProps*/
    ctx[8],
    /*attrs*/
    ctx[0]
  ];
  let span_data = {};
  for (let i = 0; i < span_levels.length; i += 1) {
    span_data = assign(span_data, span_levels[i]);
  }
  return {
    c() {
      span = element("span");
      set_attributes(span, span_data);
      set_style(
        span,
        "width",
        /*widthInner*/
        ctx[2]
      );
      set_style(
        span,
        "height",
        /*heightInner*/
        ctx[1]
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (!mounted) {
        dispose = [
          listen(
            span,
            "mouseenter",
            /*onMouseenter*/
            ctx[6]
          ),
          listen(
            span,
            "mouseleave",
            /*onMouseleave*/
            ctx[7]
          ),
          listen(
            span,
            "click",
            /*onClick*/
            ctx[5]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      set_attributes(span, span_data = get_spread_update(span_levels, [
        dirty & /*cnames*/
        8 && { class: (
          /*cnames*/
          ctx2[3]
        ) },
        dirty & /*tag*/
        16 && { role: (
          /*tag*/
          ctx2[4]
        ) },
        dirty & /*$$restProps*/
        256 && /*$$restProps*/
        ctx2[8],
        dirty & /*attrs*/
        1 && /*attrs*/
        ctx2[0]
      ]));
      set_style(
        span,
        "width",
        /*widthInner*/
        ctx2[2]
      );
      set_style(
        span,
        "height",
        /*heightInner*/
        ctx2[1]
      );
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$o($$self, $$props, $$invalidate) {
  let tag2;
  let cnames;
  let widthInner;
  let heightInner;
  const omit_props_names = ["icon", "btn", "width", "height", "color", "cls", "attrs", "theme"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { icon = "" } = $$props;
  let { btn = false } = $$props;
  let { width = "24px" } = $$props;
  let { height = "24px" } = $$props;
  let { color = "" } = $$props;
  let { cls = "" } = $$props;
  let { attrs = {} } = $$props;
  let { theme = void 0 } = $$props;
  const dispatch2 = createEventDispatcher();
  const onClick = (event) => {
    dispatch2("click", event);
  };
  const onMouseenter = (event) => {
    dispatch2("mouseenter", event);
  };
  const onMouseleave = (event) => {
    dispatch2("mouseleave", event);
  };
  const prefixCls = getPrefixCls("icon");
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("icon" in $$new_props) $$invalidate(9, icon = $$new_props.icon);
    if ("btn" in $$new_props) $$invalidate(10, btn = $$new_props.btn);
    if ("width" in $$new_props) $$invalidate(11, width = $$new_props.width);
    if ("height" in $$new_props) $$invalidate(12, height = $$new_props.height);
    if ("color" in $$new_props) $$invalidate(13, color = $$new_props.color);
    if ("cls" in $$new_props) $$invalidate(14, cls = $$new_props.cls);
    if ("attrs" in $$new_props) $$invalidate(0, attrs = $$new_props.attrs);
    if ("theme" in $$new_props) $$invalidate(15, theme = $$new_props.theme);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*btn*/
    1024) {
      $$invalidate(4, tag2 = btn ? "button" : "");
    }
    if ($$self.$$.dirty & /*color, theme, btn, icon, cls*/
    58880) {
      $$invalidate(3, cnames = clsx(
        `${prefixCls}--base`,
        {
          [`${prefixCls}--base__dark`]: !color && (theme && theme === "dark" || theme === void 0),
          [`${prefixCls}--role-button`]: !!btn
        },
        `${prefixCls}-transition`,
        icon,
        color,
        cls
      ));
    }
    if ($$self.$$.dirty & /*width*/
    2048) {
      $$invalidate(2, widthInner = !width ? "24px" : width === "auto" ? void 0 : width);
    }
    if ($$self.$$.dirty & /*height*/
    4096) {
      $$invalidate(1, heightInner = !height ? "24px" : height === "auto" ? void 0 : height);
    }
  };
  return [
    attrs,
    heightInner,
    widthInner,
    cnames,
    tag2,
    onClick,
    onMouseenter,
    onMouseleave,
    $$restProps,
    icon,
    btn,
    width,
    height,
    color,
    cls,
    theme
  ];
}
let Dist$c = class Dist extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$o, create_fragment$r, safe_not_equal, {
      icon: 9,
      btn: 10,
      width: 11,
      height: 12,
      color: 13,
      cls: 14,
      attrs: 0,
      theme: 15
    });
  }
};
const getValueByPath = (path, target) => {
  const resolvePath = parsePath(path);
  let result = target;
  for (const key of resolvePath) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      console.warn(`[KFormItem]: The accessed field "${key}" does not exist`);
      return void 0;
    }
  }
  return result;
};
const setValueByPath = (path, target, value) => {
  const resolvePath = parsePath(path);
  let result = target;
  for (let i = 0; i < resolvePath.length - 1; i++) {
    const key = resolvePath[i];
    if (!(key in result)) {
      result[key] = {};
    }
    result = result[key];
  }
  result[resolvePath[resolvePath.length - 1]] = value;
  return target;
};
const parsePath = (path) => {
  if (isArray(path))
    return path;
  if (isString(path)) {
    return path.split(".");
  }
  console.error("[KFormItem]: prop format error");
  return [];
};
function doValidate(rules, target, errors = [], itemCompMap) {
  for (const field in rules) {
    const value = getValueByPath(field, target);
    const rule = rules[field];
    for (let i = 0; i < rule.length; i++) {
      const ruleOption = rule[i];
      if (ruleOption.validator) {
        ruleOption.validator(value, (msg) => {
          if (msg) {
            errors.push({
              message: msg,
              fieldValue: value,
              field
            });
            if (errors.length === 0) {
              throw new Error(msg);
            }
          }
        });
      } else {
        const type3 = (itemCompMap[field] || {}).type;
        validateRequired(ruleOption, value, field, errors, type3 !== "switch" && type3 !== "slider");
        validateMin(ruleOption, value, field, errors);
        validateMax(ruleOption, value, field, errors);
      }
    }
  }
}
function doValidateField(rules, path, value, itemCompMap) {
  if (rules) {
    const fieldRule = rules[path] || [];
    for (let i = 0; i < fieldRule.length; i++) {
      const ruleOption = fieldRule[i];
      if (ruleOption.validator) {
        ruleOption.validator(value, (msg) => {
          if (msg) {
            throw new Error(msg);
          }
        });
      } else {
        const type3 = (itemCompMap[path] || {}).type;
        validateRequired(ruleOption, value, path, void 0, type3 !== "switch" && type3 !== "slider");
        validateMin(ruleOption, value, path);
        validateMax(ruleOption, value, path);
      }
    }
  }
}
function validateRequired(rule, value, field, errors, isValidate = true) {
  if (rule.required && isValidate) {
    if (!value && value !== 0 || isEmptyObj(value) || JSON.stringify(value) === "[]") {
      const msg = rule.msg || `${field} is required`;
      errors && errors.push({
        message: msg,
        fieldValue: value,
        field
      });
      if (!errors) {
        throw new Error(msg);
      }
    }
  }
}
function validateMin(rule, value, field, errors) {
  if (rule.min || rule.min === 0) {
    if (isNumber(value) && value < rule.min) {
      const msg = rule.msg || `${field} cannot be less than ${rule.min}`;
      errors && errors.push({
        message: msg,
        fieldValue: value,
        field
      });
      if (!errors) {
        throw new Error(msg);
      }
    }
    if ((isString(value) || isArray(value)) && value.length < rule.min) {
      const msg = rule.msg || `${field} length cannot be less than ${rule.min}`;
      errors && errors.push({
        message: msg,
        fieldValue: value,
        field
      });
      if (!errors) {
        throw new Error(msg);
      }
    }
  }
}
function validateMax(rule, value, field, errors) {
  if (rule.max || rule.max === 0) {
    if (isNumber(value) && value > rule.max) {
      const msg = rule.msg || `${field} cannot be greater than ${rule.max}`;
      errors && errors.push({
        message: msg,
        fieldValue: value,
        field
      });
      if (!errors) {
        throw new Error(msg);
      }
    }
    if ((isString(value) || isArray(value)) && value.length > rule.max) {
      const msg = rule.msg || `${field} length cannot be greater than ${rule.max}`;
      errors && errors.push({
        message: msg,
        fieldValue: value,
        field
      });
      if (!errors) {
        throw new Error(msg);
      }
    }
  }
}
function traverseObjects(obj, cb, parentKey = "") {
  if (isObject(obj)) {
    for (const key in obj) {
      if (isObject(obj[key])) {
        traverseObjects(obj[key], cb, key);
      } else {
        cb(`${parentKey}.${key}`, obj[key]);
      }
    }
  }
}
const createForm = (option) => {
  return {
    /**
     * @internal
     */
    __default_value: jsonClone(option.initValue),
    /**
     * @internal
     */
    __value: jsonClone(option.initValue),
    /**
     * @internal
     */
    __manual_validate: option.manualValidate,
    /**
     * @internal
     */
    __validateEmitEvt: option.validateEmitEvt,
    /**
     * @internal
     */
    __rules: option.rules || void 0,
    /**
     * @internal
     */
    __showMsgMap: {},
    /**
     * @internal
     */
    __itemCompMap: {},
    /**
     * @internal
     */
    __errorCompEvtMap: {},
    /**
     * @internal
     */
    __propHandleEvtMap: [],
    /**
     * @internal
     */
    __dynamicProps: option.dynamicProps,
    /**
     * @internal
     */
    getValueByPath,
    /**
     * Update specific fields
     * It should be called when the value is updated in each form component
     * (such as KInput)
     * @internal
     * @param path field path
     * @param value
     * @param isValidate Whether to Validate form fields
     */
    updateField(path, value, isValidate = false) {
      let errorMsg = "";
      this.updateErrorMsg(path, "");
      try {
        if (isValidate) {
          doValidateField(this.__rules, path, value, this.__itemCompMap);
        }
      } catch (e) {
        errorMsg = e.message;
        this.updateErrorMsg(path, errorMsg);
      } finally {
        this.__value = setValueByPath(path, this.__value, value);
        errorMsg && this.__validateEmitEvt(this.__value, !!errorMsg, [
          {
            message: errorMsg,
            fieldValue: value,
            field: path
          }
        ]);
      }
    },
    /**
     * Clear the error message of KFormItem
     * @internal
     * @param key Field record,
     * which can be mapped to the showErrorMsg method of the corresponding KFormItem
     * @param msg error message
     */
    updateErrorMsg(key, msg) {
      if (Object.hasOwnProperty.call(this.__showMsgMap, key)) {
        const showMsg = this.__showMsgMap[key];
        showMsg(msg);
        if (this.__errorCompEvtMap[key]) {
          this.__errorCompEvtMap[key](!!msg);
        }
      }
    },
    /**
     * Update the value displayed in a form component
     * (such as KInput)
     * @internal
     * @param key
     */
    updateDomText(key) {
      if (Object.hasOwnProperty.call(this.__itemCompMap, key)) {
        const updateDom = this.__itemCompMap[key].update;
        updateDom();
      }
    },
    /**
     * Set the entire form object value
     * @internal
     * @param values
     * @param isValidate Whether to Validate form fields
     */
    setEntireForm(values, isValidate = false) {
      for (const key in this.__showMsgMap) {
        this.updateErrorMsg(key, "");
        this.updateDomText(key);
        if (isValidate && values) {
          this.updateField(key, this.getValueByPath(key, values), true);
        }
      }
    },
    /**
     * Validate the entire form object
     * @public
     * @param callback
     */
    validateForm(callback) {
      const errorMsgArr = [];
      if (this.__rules) {
        doValidate(this.__rules, this.__value, errorMsgArr, this.__itemCompMap);
      }
      errorMsgArr.forEach((error2) => {
        this.updateErrorMsg(error2.field, error2.message);
      });
      callback(this.__value, errorMsgArr.length === 0, errorMsgArr);
    },
    /**
     * Validate the specific fields
     * @public
     * @param path field path
     */
    validateField(path) {
      const resolveValue = this.getValueByPath(path, this.__value);
      this.updateField(path, resolveValue, true);
    },
    /**
     * Reset the entire form to default values and clear validation
     * @public
     */
    resetForm() {
      this.__value = jsonClone(this.__default_value);
      this.setEntireForm();
    },
    /**
     * Clear verification information of specific field
     * @public
     * @param path field path
     */
    clearValidateField(path) {
      this.updateErrorMsg(path, "");
    },
    /**
     * Set the entire form object value
     * @public
     * @param values
     * @param isValidate Whether to Validate form fields
     */
    setForm(values, isValidate) {
      this.__value = values;
      this.setEntireForm(values, isValidate);
    },
    /**
     * get the entire form object value
     * @public
     */
    getForm() {
      return this.__value;
    },
    /**
     * Set form field value
     * @public
     * @param path field path
     * @param value
     * @param isValidate Whether to Validate form fields
     */
    setField(path, value, isValidate) {
      this.updateField(path, value, isValidate);
      this.updateDomText(path);
      traverseObjects(value, (key, val) => {
        this.updateField(key, val, isValidate);
        this.updateDomText(key);
      }, path);
    }
  };
};
function create_fragment$q(ctx) {
  let form;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[20].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[19],
    null
  );
  let form_levels = [
    { class: (
      /*cnames*/
      ctx[1]
    ) },
    /*$$restProps*/
    ctx[2],
    /*attrs*/
    ctx[0]
  ];
  let form_data = {};
  for (let i = 0; i < form_levels.length; i += 1) {
    form_data = assign(form_data, form_levels[i]);
  }
  return {
    c() {
      form = element("form");
      if (default_slot) default_slot.c();
      set_attributes(form, form_data);
    },
    m(target, anchor) {
      insert(target, form, anchor);
      if (default_slot) {
        default_slot.m(form, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        524288)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[19],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[19]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[19],
              dirty,
              null
            ),
            null
          );
        }
      }
      set_attributes(form, form_data = get_spread_update(form_levels, [
        (!current || dirty & /*cnames*/
        2) && { class: (
          /*cnames*/
          ctx2[1]
        ) },
        dirty & /*$$restProps*/
        4 && /*$$restProps*/
        ctx2[2],
        dirty & /*attrs*/
        1 && /*attrs*/
        ctx2[0]
      ]));
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(form);
      }
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function instance$n($$self, $$props, $$invalidate) {
  let cnames;
  const omit_props_names = [
    "cls",
    "attrs",
    "rules",
    "size",
    "disabled",
    "manualValidate",
    "labelAlign",
    "labelPosition",
    "labelWidth",
    "initValue",
    "validateForm",
    "validateField",
    "resetForm",
    "clearValidateField",
    "setForm",
    "setField",
    "getForm"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { cls = void 0 } = $$props;
  let { attrs = {} } = $$props;
  let { rules = void 0 } = $$props;
  let { size = "md" } = $$props;
  let { disabled = false } = $$props;
  let { manualValidate = false } = $$props;
  let { labelAlign = "right" } = $$props;
  let { labelPosition = "horizontal" } = $$props;
  let { labelWidth = void 0 } = $$props;
  let { initValue = {} } = $$props;
  const formInst = createForm({
    rules,
    initValue,
    manualValidate,
    validateEmitEvt: handleValidateEvt,
    dynamicProps: {
      size,
      disabled,
      labelAlign,
      labelPosition,
      labelWidth
    }
  });
  setContext(formKey, formInst);
  function validateForm(callback) {
    formInst && formInst.validateForm(callback);
  }
  function validateField(path) {
    formInst && formInst.validateField(path);
  }
  function resetForm() {
    formInst && formInst.resetForm();
  }
  function clearValidateField(path) {
    formInst && formInst.clearValidateField(path);
  }
  function setForm(value, isValidate = false) {
    formInst && formInst.setForm(value, isValidate);
  }
  function setField(path, value, isValidate = false) {
    formInst && formInst.setField(path, value, isValidate);
  }
  function getForm() {
    return formInst && formInst.getForm();
  }
  const dispatch2 = createEventDispatcher();
  function handleValidateEvt(data, isValid, invalidFields) {
    dispatch2("validate", { data, isValid, invalidFields });
  }
  const prefixCls = getPrefixCls("form");
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("cls" in $$new_props) $$invalidate(3, cls = $$new_props.cls);
    if ("attrs" in $$new_props) $$invalidate(0, attrs = $$new_props.attrs);
    if ("rules" in $$new_props) $$invalidate(4, rules = $$new_props.rules);
    if ("size" in $$new_props) $$invalidate(5, size = $$new_props.size);
    if ("disabled" in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
    if ("manualValidate" in $$new_props) $$invalidate(7, manualValidate = $$new_props.manualValidate);
    if ("labelAlign" in $$new_props) $$invalidate(8, labelAlign = $$new_props.labelAlign);
    if ("labelPosition" in $$new_props) $$invalidate(9, labelPosition = $$new_props.labelPosition);
    if ("labelWidth" in $$new_props) $$invalidate(10, labelWidth = $$new_props.labelWidth);
    if ("initValue" in $$new_props) $$invalidate(11, initValue = $$new_props.initValue);
    if ("$$scope" in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*size, disabled, labelAlign, labelPosition, labelWidth*/
    1888) {
      {
        formInst.__propHandleEvtMap.forEach((cb) => {
          cb({
            size,
            disabled,
            labelAlign,
            labelPosition,
            labelWidth
          });
        });
      }
    }
    if ($$self.$$.dirty & /*cls*/
    8) {
      $$invalidate(1, cnames = clsx(prefixCls, cls));
    }
  };
  return [
    attrs,
    cnames,
    $$restProps,
    cls,
    rules,
    size,
    disabled,
    manualValidate,
    labelAlign,
    labelPosition,
    labelWidth,
    initValue,
    validateForm,
    validateField,
    resetForm,
    clearValidateField,
    setForm,
    setField,
    getForm,
    $$scope,
    slots
  ];
}
class Form extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$n, create_fragment$q, safe_not_equal, {
      cls: 3,
      attrs: 0,
      rules: 4,
      size: 5,
      disabled: 6,
      manualValidate: 7,
      labelAlign: 8,
      labelPosition: 9,
      labelWidth: 10,
      initValue: 11,
      validateForm: 12,
      validateField: 13,
      resetForm: 14,
      clearValidateField: 15,
      setForm: 16,
      setField: 17,
      getForm: 18
    });
  }
  get validateForm() {
    return this.$$.ctx[12];
  }
  get validateField() {
    return this.$$.ctx[13];
  }
  get resetForm() {
    return this.$$.ctx[14];
  }
  get clearValidateField() {
    return this.$$.ctx[15];
  }
  get setForm() {
    return this.$$.ctx[16];
  }
  get setField() {
    return this.$$.ctx[17];
  }
  get getForm() {
    return this.$$.ctx[18];
  }
}
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function fade(node, { delay = 0, duration = 400, easing = identity$1 } = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${t * o}`
  };
}
function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;
  const od = target_opacity * (1 - opacity);
  const [xValue, xUnit] = split_css_unit(x);
  const [yValue, yUnit] = split_css_unit(y);
  return {
    delay,
    duration,
    easing,
    css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * xValue}${xUnit}, ${(1 - t) * yValue}${yUnit});
			opacity: ${target_opacity - od * u}`
  };
}
function scale(node, { delay = 0, duration = 400, easing = cubicOut, start: start2 = 0, opacity = 0 } = {}) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;
  const sd = 1 - start2;
  const od = target_opacity * (1 - opacity);
  return {
    delay,
    duration,
    easing,
    css: (_t, u) => `
			transform: ${transform} scale(${1 - sd * u});
			opacity: ${target_opacity - od * u}
		`
  };
}
const get_error_slot_changes = (dirty) => ({});
const get_error_slot_context = (ctx) => ({});
const get_label_slot_changes$1 = (dirty) => ({});
const get_label_slot_context$1 = (ctx) => ({});
function create_if_block_1$7(ctx) {
  let label_1;
  let t;
  let current;
  let if_block = (
    /*isRequired*/
    ctx[6] && /*label*/
    (ctx[1] || /*$$slots*/
    ctx[15].label) && create_if_block_2$5(ctx)
  );
  const label_slot_template = (
    /*#slots*/
    ctx[23].label
  );
  const label_slot = create_slot(
    label_slot_template,
    ctx,
    /*$$scope*/
    ctx[22],
    get_label_slot_context$1
  );
  const label_slot_or_fallback = label_slot || fallback_block_1$3(ctx);
  return {
    c() {
      label_1 = element("label");
      if (if_block) if_block.c();
      t = space();
      if (label_slot_or_fallback) label_slot_or_fallback.c();
      attr(
        label_1,
        "class",
        /*lableCls*/
        ctx[12]
      );
      set_style(
        label_1,
        "min-width",
        /*minWidthInner*/
        ctx[7]
      );
      set_style(
        label_1,
        "width",
        /*labelWidthInner*/
        ctx[8]
      );
    },
    m(target, anchor) {
      insert(target, label_1, anchor);
      if (if_block) if_block.m(label_1, null);
      append(label_1, t);
      if (label_slot_or_fallback) {
        label_slot_or_fallback.m(label_1, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*isRequired*/
        ctx2[6] && /*label*/
        (ctx2[1] || /*$$slots*/
        ctx2[15].label)
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_2$5(ctx2);
          if_block.c();
          if_block.m(label_1, t);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (label_slot) {
        if (label_slot.p && (!current || dirty & /*$$scope*/
        4194304)) {
          update_slot_base(
            label_slot,
            label_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[22],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[22]
            ) : get_slot_changes(
              label_slot_template,
              /*$$scope*/
              ctx2[22],
              dirty,
              get_label_slot_changes$1
            ),
            get_label_slot_context$1
          );
        }
      } else {
        if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty & /*label*/
        2)) {
          label_slot_or_fallback.p(ctx2, !current ? -1 : dirty);
        }
      }
      if (!current || dirty & /*lableCls*/
      4096) {
        attr(
          label_1,
          "class",
          /*lableCls*/
          ctx2[12]
        );
      }
      if (dirty & /*minWidthInner*/
      128) {
        set_style(
          label_1,
          "min-width",
          /*minWidthInner*/
          ctx2[7]
        );
      }
      if (dirty & /*labelWidthInner*/
      256) {
        set_style(
          label_1,
          "width",
          /*labelWidthInner*/
          ctx2[8]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(label_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(label_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(label_1);
      }
      if (if_block) if_block.d();
      if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
    }
  };
}
function create_if_block_2$5(ctx) {
  let span;
  let t;
  return {
    c() {
      span = element("span");
      t = text("*");
      attr(
        span,
        "class",
        /*startCls*/
        ctx[11]
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*startCls*/
      2048) {
        attr(
          span,
          "class",
          /*startCls*/
          ctx2[11]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function fallback_block_1$3(ctx) {
  let t;
  return {
    c() {
      t = text(
        /*label*/
        ctx[1]
      );
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*label*/
      2) set_data(
        t,
        /*label*/
        ctx2[1]
      );
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_if_block$d(ctx) {
  let div2;
  let div_intro;
  let current;
  const error_slot_template = (
    /*#slots*/
    ctx[23].error
  );
  const error_slot = create_slot(
    error_slot_template,
    ctx,
    /*$$scope*/
    ctx[22],
    get_error_slot_context
  );
  const error_slot_or_fallback = error_slot || fallback_block$5(ctx);
  return {
    c() {
      div2 = element("div");
      if (error_slot_or_fallback) error_slot_or_fallback.c();
      attr(
        div2,
        "class",
        /*errorMsgCls*/
        ctx[9]
      );
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if (error_slot_or_fallback) {
        error_slot_or_fallback.m(div2, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (error_slot) {
        if (error_slot.p && (!current || dirty & /*$$scope*/
        4194304)) {
          update_slot_base(
            error_slot,
            error_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[22],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[22]
            ) : get_slot_changes(
              error_slot_template,
              /*$$scope*/
              ctx2[22],
              dirty,
              get_error_slot_changes
            ),
            get_error_slot_context
          );
        }
      } else {
        if (error_slot_or_fallback && error_slot_or_fallback.p && (!current || dirty & /*errorMsg*/
        32)) {
          error_slot_or_fallback.p(ctx2, !current ? -1 : dirty);
        }
      }
      if (!current || dirty & /*errorMsgCls*/
      512) {
        attr(
          div2,
          "class",
          /*errorMsgCls*/
          ctx2[9]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(error_slot_or_fallback, local);
      if (local) {
        if (!div_intro) {
          add_render_callback(() => {
            div_intro = create_in_transition(div2, fly, { y: -3, duration: 300 });
            div_intro.start();
          });
        }
      }
      current = true;
    },
    o(local) {
      transition_out(error_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (error_slot_or_fallback) error_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block$5(ctx) {
  let t;
  return {
    c() {
      t = text(
        /*errorMsg*/
        ctx[5]
      );
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*errorMsg*/
      32) set_data(
        t,
        /*errorMsg*/
        ctx2[5]
      );
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_fragment$p(ctx) {
  let div1;
  let t0;
  let div0;
  let t1;
  let current;
  let if_block0 = !(!/*$$slots*/
  ctx[15].label && !/*label*/
  ctx[1] && /*labelPosition*/
  ctx[4] === "vertical") && /*showLabel*/
  ctx[3] && create_if_block_1$7(ctx);
  const default_slot_template = (
    /*#slots*/
    ctx[23].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[22],
    null
  );
  let if_block1 = (
    /*errorMsg*/
    ctx[5] && /*showMsg*/
    ctx[2] && create_if_block$d(ctx)
  );
  let div1_levels = [
    { class: (
      /*cnames*/
      ctx[13]
    ) },
    /*$$restProps*/
    ctx[14],
    /*attrs*/
    ctx[0]
  ];
  let div_data_1 = {};
  for (let i = 0; i < div1_levels.length; i += 1) {
    div_data_1 = assign(div_data_1, div1_levels[i]);
  }
  return {
    c() {
      div1 = element("div");
      if (if_block0) if_block0.c();
      t0 = space();
      div0 = element("div");
      if (default_slot) default_slot.c();
      t1 = space();
      if (if_block1) if_block1.c();
      attr(
        div0,
        "class",
        /*contentCls*/
        ctx[10]
      );
      set_attributes(div1, div_data_1);
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      if (if_block0) if_block0.m(div1, null);
      append(div1, t0);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      append(div0, t1);
      if (if_block1) if_block1.m(div0, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (!(!/*$$slots*/
      ctx2[15].label && !/*label*/
      ctx2[1] && /*labelPosition*/
      ctx2[4] === "vertical") && /*showLabel*/
      ctx2[3]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & /*$$slots, label, labelPosition, showLabel*/
          32794) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$7(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div1, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4194304)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[22],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[22]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[22],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (
        /*errorMsg*/
        ctx2[5] && /*showMsg*/
        ctx2[2]
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & /*errorMsg, showMsg*/
          36) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$d(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div0, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (!current || dirty & /*contentCls*/
      1024) {
        attr(
          div0,
          "class",
          /*contentCls*/
          ctx2[10]
        );
      }
      set_attributes(div1, div_data_1 = get_spread_update(div1_levels, [
        (!current || dirty & /*cnames*/
        8192) && { class: (
          /*cnames*/
          ctx2[13]
        ) },
        dirty & /*$$restProps*/
        16384 && /*$$restProps*/
        ctx2[14],
        dirty & /*attrs*/
        1 && /*attrs*/
        ctx2[0]
      ]));
    },
    i(local) {
      if (current) return;
      transition_in(if_block0);
      transition_in(default_slot, local);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(default_slot, local);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (if_block0) if_block0.d();
      if (default_slot) default_slot.d(detaching);
      if (if_block1) if_block1.d();
    }
  };
}
function instance$m($$self, $$props, $$invalidate) {
  let cnames;
  let lableCls;
  let startCls;
  let contentCls;
  let errorMsgCls;
  let labelWidthInner;
  let minWidthInner;
  const omit_props_names = ["cls", "attrs", "field", "label", "showMsg", "showLabel"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const $$slots = compute_slots(slots);
  let { cls = void 0 } = $$props;
  let { attrs = {} } = $$props;
  let { field = "" } = $$props;
  let { label = "" } = $$props;
  let { showMsg = true } = $$props;
  let { showLabel = true } = $$props;
  let errorMsg = "";
  function showErrorMsg(msg) {
    $$invalidate(5, errorMsg = msg);
  }
  const formInstance = getContext(formKey);
  const formContext = getContext(formItemKey);
  let disabled = false;
  let size = "md";
  let labelPosition = "horizontal";
  let labelAlign = "right";
  let labelWidth = void 0;
  function formPropsChangeCb(props) {
    $$invalidate(19, size = props.size);
    $$invalidate(4, labelPosition = props.labelPosition);
    $$invalidate(18, disabled = props.disabled);
    $$invalidate(20, labelAlign = props.labelAlign);
    $$invalidate(21, labelWidth = props.labelWidth);
  }
  let isRequired = false;
  if (field) {
    let resolveField = field;
    if (formContext) {
      resolveField = `${formContext}&${field}`;
      setContext(formItemKey, resolveField);
      formInstance.__showMsgMap[field] = showErrorMsg;
    } else {
      setContext(formItemKey, resolveField);
      formInstance.__showMsgMap[field] = showErrorMsg;
    }
    const rules = formInstance.__rules || {};
    if (rules) {
      isRequired = (rules[field] || []).some((v) => v.required);
    }
  }
  if (formInstance) {
    formPropsChangeCb(formInstance.__dynamicProps);
    formInstance.__propHandleEvtMap.push(formPropsChangeCb);
  }
  const prefixCls = getPrefixCls("form-item");
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(14, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("cls" in $$new_props) $$invalidate(16, cls = $$new_props.cls);
    if ("attrs" in $$new_props) $$invalidate(0, attrs = $$new_props.attrs);
    if ("field" in $$new_props) $$invalidate(17, field = $$new_props.field);
    if ("label" in $$new_props) $$invalidate(1, label = $$new_props.label);
    if ("showMsg" in $$new_props) $$invalidate(2, showMsg = $$new_props.showMsg);
    if ("showLabel" in $$new_props) $$invalidate(3, showLabel = $$new_props.showLabel);
    if ("$$scope" in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*labelPosition, cls*/
    65552) {
      $$invalidate(13, cnames = clsx({ [prefixCls]: !formContext }, `${prefixCls}__${labelPosition}`, cls));
    }
    if ($$self.$$.dirty & /*labelAlign, labelPosition, size, disabled*/
    1835024) {
      $$invalidate(12, lableCls = clsx(
        `${prefixCls}-label`,
        { [`${prefixCls}-label__ml`]: !formContext },
        `${prefixCls}-label__dark`,
        {
          [`${prefixCls}-label__${labelAlign}`]: labelPosition !== "vertical"
        },
        `${prefixCls}-label__${labelPosition}`,
        `${prefixCls}-label__${size}`,
        {
          [`${prefixCls}-label__disabled`]: disabled
        }
      ));
    }
    if ($$self.$$.dirty & /*labelWidth*/
    2097152) {
      $$invalidate(8, labelWidthInner = !formContext && labelWidth ? `${labelWidth}px` : void 0);
    }
  };
  $$invalidate(11, startCls = clsx(`${prefixCls}-star`));
  $$invalidate(10, contentCls = clsx(`${prefixCls}-content`));
  $$invalidate(9, errorMsgCls = clsx(`${prefixCls}-msg_error`));
  $$invalidate(7, minWidthInner = !formContext ? `80px` : void 0);
  return [
    attrs,
    label,
    showMsg,
    showLabel,
    labelPosition,
    errorMsg,
    isRequired,
    minWidthInner,
    labelWidthInner,
    errorMsgCls,
    contentCls,
    startCls,
    lableCls,
    cnames,
    $$restProps,
    $$slots,
    cls,
    field,
    disabled,
    size,
    labelAlign,
    labelWidth,
    $$scope,
    slots
  ];
}
class Form_item extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$m, create_fragment$p, safe_not_equal, {
      cls: 16,
      attrs: 0,
      field: 17,
      label: 1,
      showMsg: 2,
      showLabel: 3
    });
  }
}
const min$1 = Math.min;
const max$2 = Math.max;
const round$1 = Math.round;
const floor$1 = Math.floor;
const createCoords = (v) => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp$1(start2, value, end) {
  return max$2(start2, min$1(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config2) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config2;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element2 = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element2))) != null ? _await$platform$isEle : true) ? element2 : element2.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const arrow$1 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state;
    const {
      element: element2,
      padding = 0
    } = evaluate(options, state) || {};
    if (element2 == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform2.getDimensions(element2);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element2));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min$1(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min$1(paddingObject[maxProp], largestPossiblePadding);
    const min$1$1 = minPadding;
    const max3 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp$1(min$1$1, center, max3);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1$1 ? center - min$1$1 : center - max3 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
const flip$3 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$1 = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
const shift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max3 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp$1(min2, mainAxisCoord, max3);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max3 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp$1(min2, crossAxisCoord, max3);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element2) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element2);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element2) {
  return ["table", "td", "th"].includes(getNodeName(element2));
}
function isTopLayer(element2) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element2.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((value) => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element2) {
  let currentNode = getParentNode(element2);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle$1(element2) {
  return getWindow(element2).getComputedStyle(element2);
}
function getNodeScroll(element2) {
  if (isElement(element2)) {
    return {
      scrollLeft: element2.scrollLeft,
      scrollTop: element2.scrollTop
    };
  }
  return {
    scrollLeft: element2.scrollX,
    scrollTop: element2.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element2) {
  const css = getComputedStyle$1(element2);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element2);
  const offsetWidth = hasOffset ? element2.offsetWidth : width;
  const offsetHeight = hasOffset ? element2.offsetHeight : height;
  const shouldFallback = round$1(width) !== offsetWidth || round$1(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element2) {
  return !isElement(element2) ? element2.contextElement : element2;
}
function getScale(element2) {
  const domElement = unwrapElement(element2);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round$1(rect.width) : rect.width) / width;
  let y = ($ ? round$1(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element2) {
  const win = getWindow(element2);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element2, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element2)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element2, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element2.getBoundingClientRect();
  const domElement = unwrapElement(element2);
  let scale2 = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale2 = getScale(offsetParent);
      }
    } else {
      scale2 = getScale(element2);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale2.x;
  let y = (clientRect.top + visualOffsets.y) / scale2.y;
  let width = clientRect.width / scale2.x;
  let height = clientRect.height / scale2.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function getWindowScrollBarX(element2, rect) {
  const leftScroll = getNodeScroll(element2).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element2)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 : (
    // RTL <body> scrollbar.
    getWindowScrollBarX(documentElement, htmlRect)
  ));
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale2 = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale2 = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
  return {
    width: rect.width * scale2.x,
    height: rect.height * scale2.y,
    x: rect.x * scale2.x - scroll.scrollLeft * scale2.x + offsets.x + htmlOffset.x,
    y: rect.y * scale2.y - scroll.scrollTop * scale2.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element2) {
  return Array.from(element2.getClientRects());
}
function getDocumentRect(element2) {
  const html = getDocumentElement(element2);
  const scroll = getNodeScroll(element2);
  const body = element2.ownerDocument.body;
  const width = max$2(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max$2(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element2);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max$2(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getViewportRect(element2, strategy) {
  const win = getWindow(element2);
  const html = getDocumentElement(element2);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element2, strategy) {
  const clientRect = getBoundingClientRect(element2, true, strategy === "fixed");
  const top = clientRect.top + element2.clientTop;
  const left = clientRect.left + element2.clientLeft;
  const scale2 = isHTMLElement(element2) ? getScale(element2) : createCoords(1);
  const width = element2.clientWidth * scale2.x;
  const height = element2.clientHeight * scale2.y;
  const x = left * scale2.x;
  const y = top * scale2.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element2, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element2, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element2));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element2);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element2, stopNode) {
  const parentNode = getParentNode(element2);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element2, cache) {
  const cachedResult = cache.get(element2);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element2, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element2).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element2) : element2;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element2, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element2, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element: element2,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element2) ? [] : getClippingElementAncestors(element2, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element2, clippingAncestor, strategy);
    accRect.top = max$2(rect.top, accRect.top);
    accRect.right = min$1(rect.right, accRect.right);
    accRect.bottom = min$1(rect.bottom, accRect.bottom);
    accRect.left = max$2(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element2, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element2) {
  const {
    width,
    height
  } = getCssDimensions(element2);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element2, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element2, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element2) {
  return getComputedStyle$1(element2).position === "static";
}
function getTrueOffsetParent(element2, polyfill2) {
  if (!isHTMLElement(element2) || getComputedStyle$1(element2).position === "fixed") {
    return null;
  }
  if (polyfill2) {
    return polyfill2(element2);
  }
  let rawOffsetParent = element2.offsetParent;
  if (getDocumentElement(element2) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element2, polyfill2) {
  const win = getWindow(element2);
  if (isTopLayer(element2)) {
    return win;
  }
  if (!isHTMLElement(element2)) {
    let svgOffsetParent = getParentNode(element2);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element2, polyfill2);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill2);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element2) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element2) {
  return getComputedStyle$1(element2).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element2, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element2);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element2.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor$1(top);
    const insetRight = floor$1(root.clientWidth - (left + width));
    const insetBottom = floor$1(root.clientHeight - (top + height));
    const insetLeft = floor$1(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max$2(0, min$1(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element2.getBoundingClientRect())) {
        refresh();
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element2);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update2, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update2, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update2);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update2) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update2();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update2();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update2();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update2);
      ancestorResize && ancestor.removeEventListener("resize", update2);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const offset = offset$1;
const shift = shift$1;
const flip$2 = flip$3;
const arrow = arrow$1;
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
const subscriber_queue = [];
function readable(value, start2) {
  return {
    subscribe: writable(value, start2).subscribe
  };
}
function writable(value, start2 = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start2(set, update2) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set, update2) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set, update2);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map(
      (store, i) => subscribe(
        store,
        (value) => {
          values[i] = value;
          pending &= ~(1 << i);
          if (started) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
function createFloatingActions(initOptions) {
  let referenceElement;
  let floatingElement;
  const defaultOptions = {
    autoUpdate: true
  };
  let options = initOptions;
  const getOptions = (mixin) => {
    return { ...defaultOptions, ...initOptions || {}, ...mixin || {} };
  };
  const updatePosition = (updateOptions) => {
    if (referenceElement && floatingElement) {
      options = getOptions(updateOptions);
      computePosition(referenceElement, floatingElement, options).then((v) => {
        Object.assign(floatingElement.style, {
          position: v.strategy,
          left: `${v.x}px`,
          top: `${v.y}px`
        });
        (options == null ? void 0 : options.onComputed) && options.onComputed(v);
      });
    }
  };
  const referenceAction = (node) => {
    if ("subscribe" in node) {
      setupVirtualElementObserver(node);
      return {};
    } else {
      referenceElement = node;
      updatePosition();
    }
  };
  const contentAction = (node, contentOptions) => {
    let autoUpdateDestroy;
    floatingElement = node;
    options = getOptions(contentOptions);
    setTimeout(() => updatePosition(contentOptions), 0);
    updatePosition(contentOptions);
    const destroyAutoUpdate = () => {
      if (autoUpdateDestroy) {
        autoUpdateDestroy();
        autoUpdateDestroy = void 0;
      }
    };
    const initAutoUpdate = ({ autoUpdate: autoUpdate$1 } = options || {}) => {
      destroyAutoUpdate();
      if (autoUpdate$1 !== false) {
        tick().then(() => {
          return autoUpdate(referenceElement, floatingElement, () => updatePosition(options), autoUpdate$1 === true ? {} : autoUpdate$1);
        });
      }
      return;
    };
    autoUpdateDestroy = initAutoUpdate();
    return {
      update(contentOptions2) {
        updatePosition(contentOptions2);
        autoUpdateDestroy = initAutoUpdate(contentOptions2);
      },
      destroy() {
        destroyAutoUpdate();
      }
    };
  };
  const setupVirtualElementObserver = (node) => {
    const unsubscribe = node.subscribe(($node) => {
      if (referenceElement === void 0) {
        referenceElement = $node;
        updatePosition();
      } else {
        Object.assign(referenceElement, $node);
        updatePosition();
      }
    });
    onDestroy(unsubscribe);
  };
  return [
    referenceAction,
    contentAction,
    updatePosition
  ];
}
const get_contentEl_slot_changes = (dirty) => ({});
const get_contentEl_slot_context = (ctx) => ({});
const get_triggerEl_slot_changes$1 = (dirty) => ({});
const get_triggerEl_slot_context$1 = (ctx) => ({});
function create_if_block$c(ctx) {
  let div2;
  let t;
  let div_intro;
  let div_outro;
  let current;
  let mounted;
  let dispose;
  const contentEl_slot_template = (
    /*#slots*/
    ctx[41].contentEl
  );
  const contentEl_slot = create_slot(
    contentEl_slot_template,
    ctx,
    /*$$scope*/
    ctx[40],
    get_contentEl_slot_context
  );
  let if_block = (
    /*arrow*/
    ctx[1] && create_if_block_1$6(ctx)
  );
  let div_levels = [
    { role: "tooltip" },
    { class: (
      /*cnames*/
      ctx[11]
    ) },
    { "data-popper-placement": "" },
    /*attrs*/
    ctx[0]
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div2 = element("div");
      if (contentEl_slot) contentEl_slot.c();
      t = space();
      if (if_block) if_block.c();
      set_attributes(div2, div_data);
      toggle_class(div2, "svelte-13arsd0");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if (contentEl_slot) {
        contentEl_slot.m(div2, null);
      }
      append(div2, t);
      if (if_block) if_block.m(div2, null);
      ctx[44](div2);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            div2,
            "animationend",
            /*onAnimationEnd*/
            ctx[18]
          ),
          listen(
            div2,
            "animationstart",
            /*onAnimationStart*/
            ctx[19]
          ),
          listen(
            div2,
            "mouseenter",
            /*handleMouseenter*/
            ctx[15]
          ),
          listen(
            div2,
            "mouseleave",
            /*handleMouseleave*/
            ctx[16]
          ),
          action_destroyer(
            /*clickOutside*/
            ctx[17].call(null, div2)
          ),
          action_destroyer(
            /*popperContent*/
            ctx[13].call(null, div2)
          )
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (contentEl_slot) {
        if (contentEl_slot.p && (!current || dirty[1] & /*$$scope*/
        512)) {
          update_slot_base(
            contentEl_slot,
            contentEl_slot_template,
            ctx,
            /*$$scope*/
            ctx[40],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx[40]
            ) : get_slot_changes(
              contentEl_slot_template,
              /*$$scope*/
              ctx[40],
              dirty,
              get_contentEl_slot_changes
            ),
            get_contentEl_slot_context
          );
        }
      }
      if (
        /*arrow*/
        ctx[1]
      ) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block_1$6(ctx);
          if_block.c();
          if_block.m(div2, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      set_attributes(div2, div_data = get_spread_update(div_levels, [
        { role: "tooltip" },
        (!current || dirty[0] & /*cnames*/
        2048) && { class: (
          /*cnames*/
          ctx[11]
        ) },
        { "data-popper-placement": "" },
        dirty[0] & /*attrs*/
        1 && /*attrs*/
        ctx[0]
      ]));
      toggle_class(div2, "svelte-13arsd0");
    },
    i(local) {
      if (current) return;
      transition_in(contentEl_slot, local);
      if (local) {
        add_render_callback(() => {
          if (!current) return;
          if (div_outro) div_outro.end(1);
          div_intro = create_in_transition(div2, scale, {
            duration: 300,
            start: 0.3,
            opacity: 0,
            easing: (
              /*cubeInOut*/
              ctx[20]
            )
          });
          div_intro.start();
        });
      }
      current = true;
    },
    o(local) {
      transition_out(contentEl_slot, local);
      if (div_intro) div_intro.invalidate();
      if (local) {
        div_outro = create_out_transition(div2, scale, {
          duration: 300,
          start: 0.3,
          opacity: 0,
          easing: (
            /*cubeInOut*/
            ctx[20]
          )
        });
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (contentEl_slot) contentEl_slot.d(detaching);
      if (if_block) if_block.d();
      ctx[44](null);
      if (detaching && div_outro) div_outro.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1$6(ctx) {
  let div2;
  let div_levels = [
    { "k-popover-arrow": true },
    { "data-popper-arrow-bottom": "" },
    { "data-popper-arrow-top": "" },
    { "data-popper-arrow-right": "" },
    { "data-popper-arrow-left": "" }
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div2 = element("div");
      set_attributes(div2, div_data);
      toggle_class(div2, "svelte-13arsd0");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      ctx[43](div2);
    },
    p(ctx2, dirty) {
      toggle_class(div2, "svelte-13arsd0");
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      ctx[43](null);
    }
  };
}
function create_fragment$o(ctx) {
  let div2;
  let t;
  let if_block_anchor;
  let current;
  let mounted;
  let dispose;
  const triggerEl_slot_template = (
    /*#slots*/
    ctx[41].triggerEl
  );
  const triggerEl_slot = create_slot(
    triggerEl_slot_template,
    ctx,
    /*$$scope*/
    ctx[40],
    get_triggerEl_slot_context$1
  );
  let div_levels = [
    /*attrsTrigger*/
    ctx[2],
    { class: (
      /*triggerCls*/
      ctx[10]
    ) },
    { role: "button" },
    { tabindex: "-1" },
    { "data-popover-trigger": "" }
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  let if_block = (
    /*isShow*/
    ctx[7] && create_if_block$c(ctx)
  );
  return {
    c() {
      div2 = element("div");
      if (triggerEl_slot) triggerEl_slot.c();
      t = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
      set_attributes(div2, div_data);
      set_style(
        div2,
        "width",
        /*width*/
        ctx[3]
      );
      set_style(
        div2,
        "order",
        /*order*/
        ctx[4]
      );
      set_style(
        div2,
        "opacity",
        /*opacity*/
        ctx[5]
      );
      toggle_class(div2, "svelte-13arsd0");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if (triggerEl_slot) {
        triggerEl_slot.m(div2, null);
      }
      ctx[42](div2);
      insert(target, t, anchor);
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(
            /*popperRef*/
            ctx[12].call(null, div2)
          ),
          listen(
            div2,
            "click",
            /*handleClick*/
            ctx[14]
          ),
          listen(
            div2,
            "mouseenter",
            /*handleMouseenter*/
            ctx[15]
          ),
          listen(
            div2,
            "mouseleave",
            /*handleMouseleave*/
            ctx[16]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (triggerEl_slot) {
        if (triggerEl_slot.p && (!current || dirty[1] & /*$$scope*/
        512)) {
          update_slot_base(
            triggerEl_slot,
            triggerEl_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[40],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[40]
            ) : get_slot_changes(
              triggerEl_slot_template,
              /*$$scope*/
              ctx2[40],
              dirty,
              get_triggerEl_slot_changes$1
            ),
            get_triggerEl_slot_context$1
          );
        }
      }
      set_attributes(div2, div_data = get_spread_update(div_levels, [
        dirty[0] & /*attrsTrigger*/
        4 && /*attrsTrigger*/
        ctx2[2],
        (!current || dirty[0] & /*triggerCls*/
        1024) && { class: (
          /*triggerCls*/
          ctx2[10]
        ) },
        { role: "button" },
        { tabindex: "-1" },
        { "data-popover-trigger": "" }
      ]));
      set_style(
        div2,
        "width",
        /*width*/
        ctx2[3]
      );
      set_style(
        div2,
        "order",
        /*order*/
        ctx2[4]
      );
      set_style(
        div2,
        "opacity",
        /*opacity*/
        ctx2[5]
      );
      toggle_class(div2, "svelte-13arsd0");
      if (
        /*isShow*/
        ctx2[7]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*isShow*/
          128) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$c(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(triggerEl_slot, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(triggerEl_slot, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
        detach(t);
        detach(if_block_anchor);
      }
      if (triggerEl_slot) triggerEl_slot.d(detaching);
      ctx[42](null);
      if (if_block) if_block.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$l($$self, $$props, $$invalidate) {
  let curPlacement;
  let isDark;
  let prefixCls;
  let cnames;
  let triggerCls;
  let { $$slots: slots = {}, $$scope } = $$props;
  let { placement = "top" } = $$props;
  let { trigger = "hover" } = $$props;
  let { attrs = {} } = $$props;
  let { disabled = false } = $$props;
  let { arrow: arrow$12 = true } = $$props;
  let { mouseEnterDelay = 100 } = $$props;
  let { mouseLeaveDelay = 100 } = $$props;
  let { cls = void 0 } = $$props;
  let { clsTrigger = void 0 } = $$props;
  let { defaultOpen = void 0 } = $$props;
  let { attrsTrigger = {} } = $$props;
  let { width = "fit-content" } = $$props;
  let { order = void 0 } = $$props;
  let { offset: offset$12 = { mainAxis: 8, crossAxis: 0 } } = $$props;
  let { offsetComputed = void 0 } = $$props;
  let { opacity = "" } = $$props;
  let { theme = void 0 } = $$props;
  let { fallbackPlacements = ["top", "right", "bottom", "left"] } = $$props;
  let arrowRef = null;
  const dispatch2 = createEventDispatcher();
  const [popperRef, popperContent, updateFloating] = createFloatingActions({
    strategy: "absolute",
    placement,
    middleware: [
      offset(offset$12),
      flip$2({ fallbackPlacements }),
      shift(),
      arrow({ element: arrowRef })
    ],
    onComputed({ placement: resolvePlacement }) {
      if (resolvePlacement !== curPlacement) {
        curPlacement = resolvePlacement;
        updateArrow();
      }
    }
  });
  let isShow = false;
  onMount(() => {
    if (defaultOpen !== void 0) {
      doUpdateShow(!!defaultOpen);
    }
  });
  const handleClick = () => {
    if (trigger === "manual") {
      doUpdateShow(!isShow);
    }
    if (trigger === "click") {
      doUpdateShow(true);
    }
  };
  let isEnter = false;
  const handleMouseenter = () => {
    if (trigger === "hover") {
      isEnter = true;
      doUpdateShow(true);
    }
  };
  const handleMouseleave = () => {
    if (trigger === "hover") {
      isEnter = false;
      doUpdateShow(false);
    }
  };
  function doUpdateShow(show) {
    if (disabled) return;
    const delay = show ? mouseEnterDelay : mouseLeaveDelay;
    setTimeout(
      async () => {
        if (isEnter) {
          if (isShow) return;
          $$invalidate(7, isShow = true);
          dispatch2("change", isShow);
          return;
        }
        if (show !== isShow) {
          $$invalidate(7, isShow = show);
          dispatch2("change", isShow);
        }
      },
      delay
    );
  }
  function updateArrow() {
    arrowRef && arrowRef.removeAttribute(`data-popper-arrow-top`);
    arrowRef && arrowRef.removeAttribute(`data-popper-arrow-bottom`);
    arrowRef && arrowRef.removeAttribute(`data-popper-arrow-left`);
    arrowRef && arrowRef.removeAttribute(`data-popper-arrow-right`);
    arrowRef && arrowRef.setAttribute(`data-popper-arrow-${curPlacement}`, "");
  }
  let popoverContainerRef = null;
  function clickOutside(node) {
    function handleClickOutside(e) {
      const target = e.target;
      const container = node;
      if (target && container && !container.contains(target)) {
        if (popoverContainerRef) {
          const triggerEl = popoverContainerRef.querySelector('[slot="triggerEl"]');
          if (!triggerEl || !triggerEl.contains(target)) {
            doUpdateShow(false);
          }
        } else {
          doUpdateShow(false);
        }
      }
    }
    trigger === "click" && window.addEventListener("click", handleClickOutside);
    return {
      destroy: () => {
        trigger === "click" && window.removeEventListener("click", handleClickOutside);
      }
    };
  }
  function updateShow(show) {
    if (trigger === "hover") {
      isEnter = false;
    }
    doUpdateShow(show);
  }
  function onAnimationEnd() {
    dispatch2("animateEnd");
  }
  let contentRef = null;
  function onAnimationStart() {
    updateArrow();
    dispatch2("animateStart");
  }
  function getPopoverContainerRef() {
    return popoverContainerRef;
  }
  function forceUpdated() {
    updateFloating();
  }
  function updatedArrow() {
    updateArrow();
  }
  function cubeInOut(t) {
    if (offsetComputed && isShow) {
      const offset2 = offsetComputed({
        popper: popoverContainerRef,
        reference: contentRef,
        placement
      });
      updateFloating({
        middleware: [
          offset(offset2),
          flip$2({ fallbackPlacements }),
          shift(),
          arrow({ element: arrowRef })
        ]
      });
    }
    return t < 0.5 ? 4 * t * t * t : 0.5 * Math.pow(2 * t - 2, 3) + 1;
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      popoverContainerRef = $$value;
      $$invalidate(8, popoverContainerRef);
    });
  }
  function div_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      arrowRef = $$value;
      $$invalidate(6, arrowRef);
    });
  }
  function div_binding_2($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      contentRef = $$value;
      $$invalidate(9, contentRef);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("placement" in $$props2) $$invalidate(21, placement = $$props2.placement);
    if ("trigger" in $$props2) $$invalidate(22, trigger = $$props2.trigger);
    if ("attrs" in $$props2) $$invalidate(0, attrs = $$props2.attrs);
    if ("disabled" in $$props2) $$invalidate(23, disabled = $$props2.disabled);
    if ("arrow" in $$props2) $$invalidate(1, arrow$12 = $$props2.arrow);
    if ("mouseEnterDelay" in $$props2) $$invalidate(24, mouseEnterDelay = $$props2.mouseEnterDelay);
    if ("mouseLeaveDelay" in $$props2) $$invalidate(25, mouseLeaveDelay = $$props2.mouseLeaveDelay);
    if ("cls" in $$props2) $$invalidate(26, cls = $$props2.cls);
    if ("clsTrigger" in $$props2) $$invalidate(27, clsTrigger = $$props2.clsTrigger);
    if ("defaultOpen" in $$props2) $$invalidate(28, defaultOpen = $$props2.defaultOpen);
    if ("attrsTrigger" in $$props2) $$invalidate(2, attrsTrigger = $$props2.attrsTrigger);
    if ("width" in $$props2) $$invalidate(3, width = $$props2.width);
    if ("order" in $$props2) $$invalidate(4, order = $$props2.order);
    if ("offset" in $$props2) $$invalidate(29, offset$12 = $$props2.offset);
    if ("offsetComputed" in $$props2) $$invalidate(30, offsetComputed = $$props2.offsetComputed);
    if ("opacity" in $$props2) $$invalidate(5, opacity = $$props2.opacity);
    if ("theme" in $$props2) $$invalidate(31, theme = $$props2.theme);
    if ("fallbackPlacements" in $$props2) $$invalidate(32, fallbackPlacements = $$props2.fallbackPlacements);
    if ("$$scope" in $$props2) $$invalidate(40, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*placement*/
    2097152) {
      curPlacement = placement;
    }
    if ($$self.$$.dirty[1] & /*theme*/
    1) {
      $$invalidate(39, isDark = theme && theme === "dark" || theme === void 0);
    }
    if ($$self.$$.dirty[0] & /*placement, cls*/
    69206016 | $$self.$$.dirty[1] & /*prefixCls, isDark*/
    384) {
      $$invalidate(11, cnames = clsx(
        `${prefixCls}--base`,
        `${prefixCls}--base__${placement}`,
        {
          [`${prefixCls}--base__${placement}__dark`]: isDark,
          [`${prefixCls}--base__dark`]: isDark
        },
        cls
      ));
    }
    if ($$self.$$.dirty[0] & /*clsTrigger*/
    134217728 | $$self.$$.dirty[1] & /*prefixCls*/
    128) {
      $$invalidate(10, triggerCls = clsx(`${prefixCls}--trigger`, clsTrigger));
    }
  };
  $$invalidate(38, prefixCls = getPrefixCls("popover"));
  return [
    attrs,
    arrow$12,
    attrsTrigger,
    width,
    order,
    opacity,
    arrowRef,
    isShow,
    popoverContainerRef,
    contentRef,
    triggerCls,
    cnames,
    popperRef,
    popperContent,
    handleClick,
    handleMouseenter,
    handleMouseleave,
    clickOutside,
    onAnimationEnd,
    onAnimationStart,
    cubeInOut,
    placement,
    trigger,
    disabled,
    mouseEnterDelay,
    mouseLeaveDelay,
    cls,
    clsTrigger,
    defaultOpen,
    offset$12,
    offsetComputed,
    theme,
    fallbackPlacements,
    doUpdateShow,
    updateShow,
    getPopoverContainerRef,
    forceUpdated,
    updatedArrow,
    prefixCls,
    isDark,
    $$scope,
    slots,
    div_binding,
    div_binding_1,
    div_binding_2
  ];
}
let Dist$b = class Dist2 extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$l,
      create_fragment$o,
      safe_not_equal,
      {
        placement: 21,
        trigger: 22,
        attrs: 0,
        disabled: 23,
        arrow: 1,
        mouseEnterDelay: 24,
        mouseLeaveDelay: 25,
        cls: 26,
        clsTrigger: 27,
        defaultOpen: 28,
        attrsTrigger: 2,
        width: 3,
        order: 4,
        offset: 29,
        offsetComputed: 30,
        opacity: 5,
        theme: 31,
        fallbackPlacements: 32,
        doUpdateShow: 33,
        updateShow: 34,
        getPopoverContainerRef: 35,
        forceUpdated: 36,
        updatedArrow: 37
      },
      null,
      [-1, -1]
    );
  }
  get doUpdateShow() {
    return this.$$.ctx[33];
  }
  get updateShow() {
    return this.$$.ctx[34];
  }
  get getPopoverContainerRef() {
    return this.$$.ctx[35];
  }
  get forceUpdated() {
    return this.$$.ctx[36];
  }
  get updatedArrow() {
    return this.$$.ctx[37];
  }
};
const scrollDefaultProps = {
  css: "",
  trackBackground: "transparent",
  trackRadius: "20px",
  width: "6px",
  height: "6px",
  thumbBackground: "var(--ikun-light-800)",
  thumbRadius: "20px"
};
const genCSSVariable = (props) => {
  const cssVariable = {
    ["--k-scrollbar--track"]: props.trackBackground,
    ["--k-scrollbar--track__radius"]: props.trackRadius,
    ["--k-scrollbar__w"]: props.width,
    ["--k-scrollbar__h"]: props.height,
    ["--k-scrollbar--thumb"]: props.thumbBackground,
    ["--k-scrollbar--thumb__radius"]: props.thumbRadius
  };
  let style = props.css;
  Object.keys(cssVariable).forEach((k) => {
    const value = cssVariable[k];
    if (value) {
      style = `${k}: ${value};${style}`;
    }
  });
  return style;
};
function create_if_block_2$4(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      icon: (
        /*icon*/
        ctx[0]
      ),
      color: (
        /*cnamesIcon*/
        ctx[7]
      ),
      width: `${/*iconSizeInner*/
      ctx[5]}px`,
      height: `${/*iconSizeInner*/
      ctx[5]}px`
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*icon*/
      1) kicon_changes.icon = /*icon*/
      ctx2[0];
      if (dirty[0] & /*cnamesIcon*/
      128) kicon_changes.color = /*cnamesIcon*/
      ctx2[7];
      if (dirty[0] & /*iconSizeInner*/
      32) kicon_changes.width = `${/*iconSizeInner*/
      ctx2[5]}px`;
      if (dirty[0] & /*iconSizeInner*/
      32) kicon_changes.height = `${/*iconSizeInner*/
      ctx2[5]}px`;
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function create_if_block_1$5(ctx) {
  let div2;
  return {
    c() {
      div2 = element("div");
      attr(div2, "class", "ml-1");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
    }
  };
}
function create_if_block$b(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      icon: (
        /*suffixIcon*/
        ctx[1]
      ),
      cls: "ml-1",
      color: (
        /*cnamesIcon*/
        ctx[7]
      ),
      width: `${/*iconSizeInner*/
      ctx[5]}px`,
      height: `${/*iconSizeInner*/
      ctx[5]}px`
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*suffixIcon*/
      2) kicon_changes.icon = /*suffixIcon*/
      ctx2[1];
      if (dirty[0] & /*cnamesIcon*/
      128) kicon_changes.color = /*cnamesIcon*/
      ctx2[7];
      if (dirty[0] & /*iconSizeInner*/
      32) kicon_changes.width = `${/*iconSizeInner*/
      ctx2[5]}px`;
      if (dirty[0] & /*iconSizeInner*/
      32) kicon_changes.height = `${/*iconSizeInner*/
      ctx2[5]}px`;
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function create_dynamic_element(ctx) {
  let svelte_element;
  let t0;
  let t1;
  let t2;
  let svelte_element_style_value;
  let current;
  let mounted;
  let dispose;
  let if_block0 = (
    /*icon*/
    ctx[0] && create_if_block_2$4(ctx)
  );
  let if_block1 = (
    /*$$slots*/
    ctx[12].default && /*icon*/
    ctx[0] && !/*hiddenSlot*/
    ctx[4] && create_if_block_1$5()
  );
  const default_slot_template = (
    /*#slots*/
    ctx[32].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[31],
    null
  );
  let if_block2 = (
    /*suffixIcon*/
    ctx[1] && create_if_block$b(ctx)
  );
  let svelte_element_levels = [
    {
      style: svelte_element_style_value = "border-radius: " + /*round*/
      (ctx[3] ? `${/*round*/
      ctx[3]}` : "4") + "px; font-size: " + /*iconSizeInner*/
      ctx[5] + "px"
    },
    { class: (
      /*cnames*/
      ctx[9]
    ) },
    /*attrsInner*/
    ctx[8],
    /*$$restProps*/
    ctx[11]
  ];
  let svelte_element_data = {};
  for (let i = 0; i < svelte_element_levels.length; i += 1) {
    svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
  }
  return {
    c() {
      svelte_element = element(
        /*to*/
        ctx[2] ? "a" : "button"
      );
      if (if_block0) if_block0.c();
      t0 = space();
      if (if_block1) if_block1.c();
      t1 = space();
      if (default_slot) default_slot.c();
      t2 = space();
      if (if_block2) if_block2.c();
      set_dynamic_element_data(
        /*to*/
        ctx[2] ? "a" : "button"
      )(svelte_element, svelte_element_data);
    },
    m(target, anchor) {
      insert(target, svelte_element, anchor);
      if (if_block0) if_block0.m(svelte_element, null);
      append(svelte_element, t0);
      if (if_block1) if_block1.m(svelte_element, null);
      append(svelte_element, t1);
      if (default_slot) {
        default_slot.m(svelte_element, null);
      }
      append(svelte_element, t2);
      if (if_block2) if_block2.m(svelte_element, null);
      ctx[33](svelte_element);
      current = true;
      if (!mounted) {
        dispose = listen(
          svelte_element,
          "click",
          /*handleClick*/
          ctx[10]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (
        /*icon*/
        ctx2[0]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty[0] & /*icon*/
          1) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_2$4(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(svelte_element, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (
        /*$$slots*/
        ctx2[12].default && /*icon*/
        ctx2[0] && !/*hiddenSlot*/
        ctx2[4]
      ) {
        if (if_block1) ;
        else {
          if_block1 = create_if_block_1$5();
          if_block1.c();
          if_block1.m(svelte_element, t1);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & /*$$scope*/
        1)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[31],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[31]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[31],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (
        /*suffixIcon*/
        ctx2[1]
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
          if (dirty[0] & /*suffixIcon*/
          2) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block$b(ctx2);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(svelte_element, null);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
      set_dynamic_element_data(
        /*to*/
        ctx2[2] ? "a" : "button"
      )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
        (!current || dirty[0] & /*round, iconSizeInner*/
        40 && svelte_element_style_value !== (svelte_element_style_value = "border-radius: " + /*round*/
        (ctx2[3] ? `${/*round*/
        ctx2[3]}` : "4") + "px; font-size: " + /*iconSizeInner*/
        ctx2[5] + "px")) && { style: svelte_element_style_value },
        (!current || dirty[0] & /*cnames*/
        512) && { class: (
          /*cnames*/
          ctx2[9]
        ) },
        dirty[0] & /*attrsInner*/
        256 && /*attrsInner*/
        ctx2[8],
        dirty[0] & /*$$restProps*/
        2048 && /*$$restProps*/
        ctx2[11]
      ]));
    },
    i(local) {
      if (current) return;
      transition_in(if_block0);
      transition_in(default_slot, local);
      transition_in(if_block2);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(default_slot, local);
      transition_out(if_block2);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(svelte_element);
      }
      if (if_block0) if_block0.d();
      if (if_block1) if_block1.d();
      if (default_slot) default_slot.d(detaching);
      if (if_block2) if_block2.d();
      ctx[33](null);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$n(ctx) {
  let previous_tag = (
    /*to*/
    ctx[2] ? "a" : "button"
  );
  let svelte_element_anchor;
  let current;
  let svelte_element = (
    /*to*/
    (ctx[2] ? "a" : "button") && create_dynamic_element(ctx)
  );
  return {
    c() {
      if (svelte_element) svelte_element.c();
      svelte_element_anchor = empty();
    },
    m(target, anchor) {
      if (svelte_element) svelte_element.m(target, anchor);
      insert(target, svelte_element_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*to*/
        ctx2[2] ? "a" : "button"
      ) {
        if (!previous_tag) {
          svelte_element = create_dynamic_element(ctx2);
          previous_tag = /*to*/
          ctx2[2] ? "a" : "button";
          svelte_element.c();
          svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
        } else if (safe_not_equal(
          previous_tag,
          /*to*/
          ctx2[2] ? "a" : "button"
        )) {
          svelte_element.d(1);
          svelte_element = create_dynamic_element(ctx2);
          previous_tag = /*to*/
          ctx2[2] ? "a" : "button";
          svelte_element.c();
          svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
        } else {
          svelte_element.p(ctx2, dirty);
        }
      } else if (previous_tag) {
        svelte_element.d(1);
        svelte_element = null;
        previous_tag = /*to*/
        ctx2[2] ? "a" : "button";
      }
    },
    i(local) {
      if (current) return;
      transition_in(svelte_element, local);
      current = true;
    },
    o(local) {
      transition_out(svelte_element, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(svelte_element_anchor);
      }
      if (svelte_element) svelte_element.d(detaching);
    }
  };
}
function instance$k($$self, $$props, $$invalidate) {
  let typeInner;
  let sizeInner;
  let disabledInner;
  let prefixCls;
  let typePrefixCls;
  let typePrefixClsHover;
  let cnames;
  let attrsInner;
  let prefixIconCls;
  let cnamesIcon;
  const omit_props_names = [
    "type",
    "size",
    "icon",
    "suffixIcon",
    "iconSize",
    "to",
    "round",
    "circle",
    "isBorder",
    "plain",
    "ghost",
    "disabled",
    "cls",
    "attrs",
    "hiddenSlot"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const $$slots = compute_slots(slots);
  let { type: type3 = "" } = $$props;
  let { size = "" } = $$props;
  let { icon = "" } = $$props;
  let { suffixIcon = "" } = $$props;
  let { iconSize = null } = $$props;
  let { to = "" } = $$props;
  let { round: round2 = "" } = $$props;
  let { circle = false } = $$props;
  let { isBorder = false } = $$props;
  let { plain = false } = $$props;
  let { ghost = false } = $$props;
  let { disabled = false } = $$props;
  let { cls = void 0 } = $$props;
  let { attrs = {} } = $$props;
  let { hiddenSlot = false } = $$props;
  var EButtonIconSize = /* @__PURE__ */ ((EButtonIconSize2) => {
    EButtonIconSize2[EButtonIconSize2["lg"] = 20] = "lg";
    EButtonIconSize2[EButtonIconSize2["md"] = 16] = "md";
    EButtonIconSize2[EButtonIconSize2["sm"] = 12] = "sm";
    return EButtonIconSize2;
  })(EButtonIconSize || {});
  const buttonGroupPropsInner = getContext(buttonGroupKey) || {};
  const isBorderInner = isBorder || (buttonGroupPropsInner == null ? void 0 : buttonGroupPropsInner.isBorder) || ghost || false;
  let iconSizeInner;
  const dropDownCtx = getContext(dropDownKey);
  if (dropDownCtx) {
    dropDownCtx.disabledEvt.push((disabledValue) => {
      $$invalidate(28, disabledInner = disabledValue);
    });
  }
  let btnRef = null;
  let animationCls = "";
  const handleAnimation = () => {
    if (btnRef) {
      $$invalidate(23, animationCls = `${prefixCls}--${typeInner}__animate`);
      setTimeout(
        () => {
          $$invalidate(23, animationCls = "");
        },
        310
      );
    }
  };
  const dispatch2 = createEventDispatcher();
  const formInstance = getContext(formKey);
  const handleClick = (e) => {
    if (disabledInner || formInstance) {
      e.preventDefault();
    }
    if (!to && !disabledInner) {
      dispatch2("click", e);
      handleAnimation();
    }
  };
  function svelte_element_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      btnRef = $$value;
      $$invalidate(6, btnRef);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("type" in $$new_props) $$invalidate(13, type3 = $$new_props.type);
    if ("size" in $$new_props) $$invalidate(14, size = $$new_props.size);
    if ("icon" in $$new_props) $$invalidate(0, icon = $$new_props.icon);
    if ("suffixIcon" in $$new_props) $$invalidate(1, suffixIcon = $$new_props.suffixIcon);
    if ("iconSize" in $$new_props) $$invalidate(15, iconSize = $$new_props.iconSize);
    if ("to" in $$new_props) $$invalidate(2, to = $$new_props.to);
    if ("round" in $$new_props) $$invalidate(3, round2 = $$new_props.round);
    if ("circle" in $$new_props) $$invalidate(16, circle = $$new_props.circle);
    if ("isBorder" in $$new_props) $$invalidate(17, isBorder = $$new_props.isBorder);
    if ("plain" in $$new_props) $$invalidate(18, plain = $$new_props.plain);
    if ("ghost" in $$new_props) $$invalidate(19, ghost = $$new_props.ghost);
    if ("disabled" in $$new_props) $$invalidate(20, disabled = $$new_props.disabled);
    if ("cls" in $$new_props) $$invalidate(21, cls = $$new_props.cls);
    if ("attrs" in $$new_props) $$invalidate(22, attrs = $$new_props.attrs);
    if ("hiddenSlot" in $$new_props) $$invalidate(4, hiddenSlot = $$new_props.hiddenSlot);
    if ("$$scope" in $$new_props) $$invalidate(31, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*type*/
    8192) {
      $$invalidate(25, typeInner = type3 || (buttonGroupPropsInner == null ? void 0 : buttonGroupPropsInner.type) || "primary");
    }
    if ($$self.$$.dirty[0] & /*size*/
    16384) {
      $$invalidate(27, sizeInner = (buttonGroupPropsInner == null ? void 0 : buttonGroupPropsInner.size) || size || "md");
    }
    if ($$self.$$.dirty[0] & /*disabled*/
    1048576) {
      $$invalidate(28, disabledInner = disabled || (buttonGroupPropsInner == null ? void 0 : buttonGroupPropsInner.disabled) || false);
    }
    if ($$self.$$.dirty[0] & /*iconSize, sizeInner*/
    134250496) {
      if (iconSize) {
        $$invalidate(5, iconSizeInner = iconSize);
      } else if (buttonGroupPropsInner == null ? void 0 : buttonGroupPropsInner.iconSize) {
        $$invalidate(5, iconSizeInner = buttonGroupPropsInner.iconSize);
      } else {
        $$invalidate(5, iconSizeInner = EButtonIconSize[sizeInner]);
      }
    }
    if ($$self.$$.dirty[0] & /*prefixCls, typeInner*/
    100663296) {
      $$invalidate(29, typePrefixCls = `${prefixCls}--${typeInner}`);
    }
    if ($$self.$$.dirty[0] & /*typePrefixCls*/
    536870912) {
      $$invalidate(30, typePrefixClsHover = `${typePrefixCls}__hover`);
    }
    if ($$self.$$.dirty[0] & /*prefixCls, typePrefixCls, plain, ghost, typePrefixClsHover, disabledInner, circle, sizeInner, typeInner, animationCls, cls*/
    2125266944) {
      $$invalidate(9, cnames = clsx(
        prefixCls,
        `${prefixCls}--base`,
        {
          [`${typePrefixCls}__ghost`]: !plain && ghost,
          [`${typePrefixCls}__ghost--dark`]: !plain && ghost,
          [`${typePrefixCls}__fill`]: !plain && !ghost,
          [`${typePrefixClsHover}__fill`]: !plain && !ghost,
          [typePrefixCls]: plain && !ghost,
          [typePrefixClsHover]: plain && !ghost
        },
        {
          [`${typePrefixCls}__active ${typePrefixCls}__focus`]: !disabledInner,
          [`k-cur-disabled ${prefixCls}--disabled`]: disabledInner,
          [`${prefixCls}--circle`]: circle,
          [`${prefixCls}--circle--sm`]: circle && sizeInner === "sm",
          [`${prefixCls}--circle--lg`]: circle && sizeInner === "lg"
        },
        {
          [`${prefixCls}--sm`]: sizeInner === "sm",
          [`${prefixCls}--lg`]: sizeInner === "lg"
        },
        {
          [`${prefixCls}--${typeInner}__border`]: isBorderInner
        },
        animationCls,
        cls
      ));
    }
    if ($$self.$$.dirty[0] & /*attrs, to*/
    4194308) {
      $$invalidate(8, attrsInner = extend(attrs, to ? { href: to } : {}));
    }
    if ($$self.$$.dirty[0] & /*prefixCls, typeInner*/
    100663296) {
      $$invalidate(24, prefixIconCls = `${prefixCls}--${typeInner}__icon`);
    }
    if ($$self.$$.dirty[0] & /*prefixIconCls, plain, ghost*/
    17563648) {
      $$invalidate(7, cnamesIcon = clsx({
        [prefixIconCls]: true,
        [`${prefixIconCls}__fill`]: !plain && !ghost
      }));
    }
  };
  $$invalidate(26, prefixCls = getPrefixCls("button"));
  return [
    icon,
    suffixIcon,
    to,
    round2,
    hiddenSlot,
    iconSizeInner,
    btnRef,
    cnamesIcon,
    attrsInner,
    cnames,
    handleClick,
    $$restProps,
    $$slots,
    type3,
    size,
    iconSize,
    circle,
    isBorder,
    plain,
    ghost,
    disabled,
    cls,
    attrs,
    animationCls,
    prefixIconCls,
    typeInner,
    prefixCls,
    sizeInner,
    disabledInner,
    typePrefixCls,
    typePrefixClsHover,
    $$scope,
    slots,
    svelte_element_binding
  ];
}
let Dist$a = class Dist3 extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$k,
      create_fragment$n,
      safe_not_equal,
      {
        type: 13,
        size: 14,
        icon: 0,
        suffixIcon: 1,
        iconSize: 15,
        to: 2,
        round: 3,
        circle: 16,
        isBorder: 17,
        plain: 18,
        ghost: 19,
        disabled: 20,
        cls: 21,
        attrs: 22,
        hiddenSlot: 4
      },
      null,
      [-1, -1]
    );
  }
};
function create_if_block$a(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[1].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[0],
    null
  );
  return {
    c() {
      if (default_slot) default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        1)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[0],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[0]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[0],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function create_fragment$m(ctx) {
  let if_block_anchor;
  let current;
  let if_block = create_if_block$a(ctx);
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if_block.p(ctx2, dirty);
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function instance$j($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  $$self.$$set = ($$props2) => {
    if ("$$scope" in $$props2) $$invalidate(0, $$scope = $$props2.$$scope);
  };
  return [$$scope, slots];
}
let Dist$9 = class Dist4 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$j, create_fragment$m, safe_not_equal, {});
  }
};
function create_if_block$9(ctx) {
  let div2;
  let div_style_value;
  let div_intro;
  let div_outro;
  let style_top = `${maskTop}px`;
  let style_left = `${maskLeft}px`;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = (
    /*#slots*/
    ctx[13].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[12],
    null
  );
  let div_levels = [
    /*attrs*/
    ctx[1],
    { role: "presentation" },
    {
      style: div_style_value = /*color*/
      ctx[0] ? `background-color: ${/*color*/
      ctx[0]}` : void 0
    },
    { class: (
      /*cnames*/
      ctx[7]
    ) }
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div2 = element("div");
      if (default_slot) default_slot.c();
      set_attributes(div2, div_data);
      set_style(div2, "top", style_top);
      set_style(div2, "left", style_left);
      set_style(
        div2,
        "width",
        /*maskWidth*/
        ctx[5]
      );
      set_style(
        div2,
        "height",
        /*maskHeight*/
        ctx[6]
      );
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if (default_slot) {
        default_slot.m(div2, null);
      }
      ctx[14](div2);
      current = true;
      if (!mounted) {
        dispose = listen(div2, "click", function() {
          if (is_function(
            /*onClickMask*/
            ctx[3]
          )) ctx[3].apply(this, arguments);
        });
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4096)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx,
            /*$$scope*/
            ctx[12],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx[12]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx[12],
              dirty,
              null
            ),
            null
          );
        }
      }
      set_attributes(div2, div_data = get_spread_update(div_levels, [
        dirty & /*attrs*/
        2 && /*attrs*/
        ctx[1],
        { role: "presentation" },
        (!current || dirty & /*color*/
        1 && div_style_value !== (div_style_value = /*color*/
        ctx[0] ? `background-color: ${/*color*/
        ctx[0]}` : void 0)) && { style: div_style_value },
        (!current || dirty & /*cnames*/
        128) && { class: (
          /*cnames*/
          ctx[7]
        ) }
      ]));
      if (dirty & /*color*/
      1) {
        style_top = `${maskTop}px`;
      }
      set_style(div2, "top", style_top);
      if (dirty & /*color*/
      1) {
        style_left = `${maskLeft}px`;
      }
      set_style(div2, "left", style_left);
      set_style(
        div2,
        "width",
        /*maskWidth*/
        ctx[5]
      );
      set_style(
        div2,
        "height",
        /*maskHeight*/
        ctx[6]
      );
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      if (local) {
        add_render_callback(() => {
          if (!current) return;
          if (div_outro) div_outro.end(1);
          div_intro = create_in_transition(div2, fade, { duration: 300 });
          div_intro.start();
        });
      }
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      if (div_intro) div_intro.invalidate();
      if (local) {
        div_outro = create_out_transition(div2, fade, { duration: 300 });
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (default_slot) default_slot.d(detaching);
      ctx[14](null);
      if (detaching && div_outro) div_outro.end();
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$l(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*value*/
    ctx[2] && create_if_block$9(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*value*/
        ctx2[2]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*value*/
          4) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$9(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
let maskTop = 0;
let maskLeft = 0;
function instance$i($$self, $$props, $$invalidate) {
  let cnames;
  let { $$slots: slots = {}, $$scope } = $$props;
  let { color = "" } = $$props;
  let { attrs = {} } = $$props;
  let { cls = "" } = $$props;
  let { value = false } = $$props;
  let { target = null } = $$props;
  let { onClickMask = void 0 } = $$props;
  let maskRef = null;
  let maskWidth = "100%";
  let maskHeight = "100%";
  const getParentEle = () => {
    if (maskRef && maskRef.parentElement) {
      return maskRef.parentElement;
    }
    return document.body;
  };
  const updatedPosition = () => {
    const parentEl = getParentEle();
    const containerDomRect = target ? target.getBoundingClientRect() : parentEl.getBoundingClientRect();
    if (containerDomRect) {
      $$invalidate(5, maskWidth = containerDomRect.width ? `${containerDomRect.width}px` : "100%");
      $$invalidate(6, maskHeight = "100%");
    }
  };
  async function setParent() {
    if (!value) return;
    await tick();
    const parentEl = target || getParentEle();
    const isBody = parentEl === document.body;
    if (isBody) {
      maskRef && $$invalidate(4, maskRef.style.position = "fixed", maskRef);
    }
    parentEl.style.overflow = "hidden";
    parentEl.style.position = "relative";
    updatedPosition();
    window.addEventListener("resize", updatedPosition);
  }
  const reset = () => {
    const parentEl = target || getParentEle();
    parentEl.style.overflow = "";
    parentEl.style.position = "";
    window.removeEventListener("resize", updatedPosition);
  };
  onDestroy(reset);
  let oldValue = value;
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      maskRef = $$value;
      $$invalidate(4, maskRef);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("color" in $$props2) $$invalidate(0, color = $$props2.color);
    if ("attrs" in $$props2) $$invalidate(1, attrs = $$props2.attrs);
    if ("cls" in $$props2) $$invalidate(8, cls = $$props2.cls);
    if ("value" in $$props2) $$invalidate(2, value = $$props2.value);
    if ("target" in $$props2) $$invalidate(9, target = $$props2.target);
    if ("onClickMask" in $$props2) $$invalidate(3, onClickMask = $$props2.onClickMask);
    if ("$$scope" in $$props2) $$invalidate(12, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*value, oldValue*/
    2052) {
      if (value) {
        setParent();
        $$invalidate(11, oldValue = value);
      } else {
        oldValue !== value && setTimeout(
          () => {
            reset();
            $$invalidate(11, oldValue = value);
          },
          300
        );
      }
    }
    if ($$self.$$.dirty & /*cls*/
    256) {
      $$invalidate(7, cnames = clsx("k-mask--base", cls));
    }
  };
  return [
    color,
    attrs,
    value,
    onClickMask,
    maskRef,
    maskWidth,
    maskHeight,
    cnames,
    cls,
    target,
    updatedPosition,
    oldValue,
    $$scope,
    slots,
    div_binding
  ];
}
let Dist$8 = class Dist5 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$i, create_fragment$l, safe_not_equal, {
      color: 0,
      attrs: 1,
      cls: 8,
      value: 2,
      target: 9,
      onClickMask: 3,
      updatedPosition: 10
    });
  }
  get updatedPosition() {
    return this.$$.ctx[10];
  }
};
const get_header_slot_changes$1 = (dirty) => ({});
const get_header_slot_context$1 = (ctx) => ({});
function create_if_block$8(ctx) {
  let current;
  const header_slot_template = (
    /*#slots*/
    ctx[12].header
  );
  const header_slot = create_slot(
    header_slot_template,
    ctx,
    /*$$scope*/
    ctx[14],
    get_header_slot_context$1
  );
  const header_slot_or_fallback = header_slot || fallback_block$4(ctx);
  return {
    c() {
      if (header_slot_or_fallback) header_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (header_slot_or_fallback) {
        header_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (header_slot) {
        if (header_slot.p && (!current || dirty & /*$$scope*/
        16384)) {
          update_slot_base(
            header_slot,
            header_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[14],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[14]
            ) : get_slot_changes(
              header_slot_template,
              /*$$scope*/
              ctx2[14],
              dirty,
              get_header_slot_changes$1
            ),
            get_header_slot_context$1
          );
        }
      } else {
        if (header_slot_or_fallback && header_slot_or_fallback.p && (!current || dirty & /*headerCls, isRight*/
        24)) {
          header_slot_or_fallback.p(ctx2, !current ? -1 : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(header_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(header_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (header_slot_or_fallback) header_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block$4(ctx) {
  let div2;
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      icon: (
        /*isRight*/
        ctx[3] ? "i-carbon-chevron-right" : "i-carbon-chevron-left"
      ),
      color: "hover:text-main",
      btn: true
    }
  });
  kicon.$on(
    "click",
    /*toggleClose*/
    ctx[6]
  );
  return {
    c() {
      div2 = element("div");
      create_component(kicon.$$.fragment);
      attr(
        div2,
        "class",
        /*headerCls*/
        ctx[4]
      );
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      mount_component(kicon, div2, null);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty & /*isRight*/
      8) kicon_changes.icon = /*isRight*/
      ctx2[3] ? "i-carbon-chevron-right" : "i-carbon-chevron-left";
      kicon.$set(kicon_changes);
      if (!current || dirty & /*headerCls*/
      16) {
        attr(
          div2,
          "class",
          /*headerCls*/
          ctx2[4]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      destroy_component(kicon);
    }
  };
}
function create_default_slot_1$5(ctx) {
  let div1;
  let t;
  let div0;
  let div1_intro;
  let div1_outro;
  let current;
  let mounted;
  let dispose;
  let if_block = (
    /*header*/
    ctx[2] && create_if_block$8(ctx)
  );
  const default_slot_template = (
    /*#slots*/
    ctx[12].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[14],
    null
  );
  let div1_levels = [
    { class: (
      /*maskCls*/
      ctx[5]
    ) },
    /*attrs*/
    ctx[1],
    { role: "dialog" },
    { "aria-modal": "true" }
  ];
  let div_data_1 = {};
  for (let i = 0; i < div1_levels.length; i += 1) {
    div_data_1 = assign(div_data_1, div1_levels[i]);
  }
  return {
    c() {
      div1 = element("div");
      if (if_block) if_block.c();
      t = space();
      div0 = element("div");
      if (default_slot) default_slot.c();
      attr(div0, "class", "k-drawer--content");
      set_style(div0, "height", "calc(100% - 24px)");
      set_attributes(div1, div_data_1);
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      if (if_block) if_block.m(div1, null);
      append(div1, t);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      current = true;
      if (!mounted) {
        dispose = listen(div1, "click", stop_propagation(
          /*click_handler*/
          ctx[13]
        ));
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (
        /*header*/
        ctx[2]
      ) {
        if (if_block) {
          if_block.p(ctx, dirty);
          if (dirty & /*header*/
          4) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$8(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div1, t);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        16384)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx,
            /*$$scope*/
            ctx[14],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx[14]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx[14],
              dirty,
              null
            ),
            null
          );
        }
      }
      set_attributes(div1, div_data_1 = get_spread_update(div1_levels, [
        (!current || dirty & /*maskCls*/
        32) && { class: (
          /*maskCls*/
          ctx[5]
        ) },
        dirty & /*attrs*/
        2 && /*attrs*/
        ctx[1],
        { role: "dialog" },
        { "aria-modal": "true" }
      ]));
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      transition_in(default_slot, local);
      if (local) {
        add_render_callback(() => {
          if (!current) return;
          if (div1_outro) div1_outro.end(1);
          div1_intro = create_in_transition(div1, fly, {
            duration: 250,
            x: (
              /*isRight*/
              ctx[3] ? 200 : -200
            )
          });
          div1_intro.start();
        });
      }
      current = true;
    },
    o(local) {
      transition_out(if_block);
      transition_out(default_slot, local);
      if (div1_intro) div1_intro.invalidate();
      if (local) {
        div1_outro = create_out_transition(div1, fly, {
          duration: 250,
          x: (
            /*isRight*/
            ctx[3] ? 200 : -200
          )
        });
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (if_block) if_block.d();
      if (default_slot) default_slot.d(detaching);
      if (detaching && div1_outro) div1_outro.end();
      mounted = false;
      dispose();
    }
  };
}
function create_default_slot$6(ctx) {
  let kmask;
  let current;
  kmask = new Dist$8({
    props: {
      onClickMask: (
        /*onClickMask*/
        ctx[7]
      ),
      target: document.body,
      value: (
        /*value*/
        ctx[0]
      ),
      $$slots: { default: [create_default_slot_1$5] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(kmask.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kmask, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kmask_changes = {};
      if (dirty & /*value*/
      1) kmask_changes.value = /*value*/
      ctx2[0];
      if (dirty & /*$$scope, maskCls, attrs, isRight, headerCls, header*/
      16446) {
        kmask_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kmask.$set(kmask_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kmask.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kmask.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kmask, detaching);
    }
  };
}
function create_fragment$k(ctx) {
  let kclientonly;
  let current;
  kclientonly = new Dist$9({
    props: {
      $$slots: { default: [create_default_slot$6] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(kclientonly.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kclientonly, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const kclientonly_changes = {};
      if (dirty & /*$$scope, value, maskCls, attrs, isRight, headerCls, header*/
      16447) {
        kclientonly_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kclientonly.$set(kclientonly_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kclientonly.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kclientonly.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kclientonly, detaching);
    }
  };
}
function instance$h($$self, $$props, $$invalidate) {
  let cnames;
  let maskCls;
  let headerCls;
  let isRight;
  let { $$slots: slots = {}, $$scope } = $$props;
  let { placement = "right" } = $$props;
  let { value = false } = $$props;
  let { cls = void 0 } = $$props;
  let { attrs = {} } = $$props;
  let { header = true } = $$props;
  let { closeOnClickMask = false } = $$props;
  const dispatch2 = createEventDispatcher();
  const toggleClose = () => {
    dispatch2("close");
  };
  const onClickMask = () => {
    if (closeOnClickMask) toggleClose();
  };
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$props2) => {
    if ("placement" in $$props2) $$invalidate(8, placement = $$props2.placement);
    if ("value" in $$props2) $$invalidate(0, value = $$props2.value);
    if ("cls" in $$props2) $$invalidate(9, cls = $$props2.cls);
    if ("attrs" in $$props2) $$invalidate(1, attrs = $$props2.attrs);
    if ("header" in $$props2) $$invalidate(2, header = $$props2.header);
    if ("closeOnClickMask" in $$props2) $$invalidate(10, closeOnClickMask = $$props2.closeOnClickMask);
    if ("$$scope" in $$props2) $$invalidate(14, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*cls*/
    512) {
      $$invalidate(11, cnames = clsx(cls));
    }
    if ($$self.$$.dirty & /*placement*/
    256) {
      $$invalidate(3, isRight = placement === "right");
    }
    if ($$self.$$.dirty & /*isRight, cnames*/
    2056) {
      $$invalidate(5, maskCls = clsx("k-drawer--base k-drawer--base__dark", isRight ? "right-0" : "left-0", cnames));
    }
    if ($$self.$$.dirty & /*isRight*/
    8) {
      $$invalidate(4, headerCls = clsx("k-drawer--op", isRight ? "justify-start" : "justify-end"));
    }
  };
  return [
    value,
    attrs,
    header,
    isRight,
    headerCls,
    maskCls,
    toggleClose,
    onClickMask,
    placement,
    cls,
    closeOnClickMask,
    cnames,
    slots,
    click_handler,
    $$scope
  ];
}
let Dist$7 = class Dist6 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$h, create_fragment$k, safe_not_equal, {
      placement: 8,
      value: 0,
      cls: 9,
      attrs: 1,
      header: 2,
      closeOnClickMask: 10
    });
  }
};
let hiddenTextarea;
const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
`;
const CONTEXT_STYLE = [
  "letter-spacing",
  "line-height",
  "padding-top",
  "padding-bottom",
  "font-family",
  "font-weight",
  "font-size",
  "text-rendering",
  "text-transform",
  "width",
  "text-indent",
  "padding-left",
  "padding-right",
  "border-width",
  "box-sizing"
];
function computeNodeStyling(targetElement) {
  const style = window.getComputedStyle(targetElement);
  const boxSizing = style.getPropertyValue("box-sizing");
  const paddingSize = parseFloat(style.getPropertyValue("padding-bottom")) + parseFloat(style.getPropertyValue("padding-top"));
  const borderSize = parseFloat(style.getPropertyValue("border-bottom-width")) + parseFloat(style.getPropertyValue("border-top-width"));
  const contextStyle = CONTEXT_STYLE.map((name) => `${name}:${style.getPropertyValue(name)}`).join(";");
  return { contextStyle, paddingSize, borderSize, boxSizing };
}
function computeSingleRowH(scrollHeight, paddingSize) {
  return scrollHeight - paddingSize;
}
function computeMinRowH(height, singleRowHeight, minRows, boxSizing, paddingSize, borderSize) {
  let minHeight = singleRowHeight * minRows;
  if (boxSizing === "border-box")
    minHeight = minHeight + paddingSize + borderSize;
  return minHeight;
}
function computeMaxRowH(height, singleRowHeight, maxRows, boxSizing, paddingSize, borderSize) {
  if (!maxRows)
    return;
  let maxHeight = singleRowHeight * maxRows;
  if (boxSizing === "border-box")
    maxHeight = maxHeight + paddingSize + borderSize;
  return Math.min(maxHeight, height);
}
function compTextareaH(targetElement, minRows = 3, maxRows = null) {
  var _a;
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement("textarea");
    document.body.appendChild(hiddenTextarea);
  }
  const { paddingSize, borderSize, boxSizing, contextStyle } = computeNodeStyling(targetElement);
  hiddenTextarea.setAttribute("style", `${contextStyle};${HIDDEN_STYLE}`);
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || "";
  let height = hiddenTextarea.scrollHeight;
  const result = {};
  if (boxSizing === "border-box")
    height = height + borderSize;
  else if (boxSizing === "content-box")
    height = height - paddingSize;
  hiddenTextarea.value = "";
  const singleRowHeight = computeSingleRowH(hiddenTextarea.scrollHeight, paddingSize);
  if (minRows !== null) {
    const minHeight = computeMinRowH(height, singleRowHeight, minRows, boxSizing, paddingSize, borderSize);
    result.minHeight = `${minHeight}px`;
  }
  if (maxRows !== null) {
    height = computeMaxRowH(height, singleRowHeight, maxRows, boxSizing, paddingSize, borderSize) || height;
  }
  result.height = `${height}px`;
  (_a = hiddenTextarea.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(hiddenTextarea);
  hiddenTextarea = null;
  return result;
}
const get_append_slot_changes = (dirty) => ({});
const get_append_slot_context = (ctx) => ({});
const get_suffix_slot_changes$1 = (dirty) => ({});
const get_suffix_slot_context$1 = (ctx) => ({});
const get_prefix_slot_changes$1 = (dirty) => ({});
const get_prefix_slot_context$1 = (ctx) => ({});
const get_prepend_slot_changes = (dirty) => ({});
const get_prepend_slot_context = (ctx) => ({});
function create_if_block_1$4(ctx) {
  let div1;
  let t0;
  let div0;
  let t1;
  let input;
  let t2;
  let t3;
  let t4;
  let t5;
  let t6;
  let current;
  let mounted;
  let dispose;
  let if_block0 = (
    /*$$slots*/
    (ctx[32].prepend || /*prepend*/
    ctx[5]) && create_if_block_9$1(ctx)
  );
  const prefix_slot_template = (
    /*#slots*/
    ctx[49].prefix
  );
  const prefix_slot = create_slot(
    prefix_slot_template,
    ctx,
    /*$$scope*/
    ctx[54],
    get_prefix_slot_context$1
  );
  const prefix_slot_or_fallback = prefix_slot || fallback_block_1$2(ctx);
  let input_levels = [
    { class: (
      /*inputCls*/
      ctx[20]
    ) },
    { value: (
      /*value*/
      ctx[0]
    ) },
    { disabled: (
      /*disabledInner*/
      ctx[11]
    ) },
    { type: (
      /*isPassword*/
      ctx[23]
    ) },
    { placeholder: (
      /*placeholder*/
      ctx[1]
    ) },
    /*attrs*/
    ctx[6]
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  let if_block1 = (
    /*clearable*/
    ctx[9] && !/*disabledInner*/
    ctx[11] && /*value*/
    ctx[0] && create_if_block_7$2(ctx)
  );
  let if_block2 = (
    /*isPassword*/
    ctx[23] === "password" && /*type*/
    ctx[7] === "password" && create_if_block_6$2(ctx)
  );
  let if_block3 = (
    /*isPassword*/
    ctx[23] === "text" && /*type*/
    ctx[7] === "password" && create_if_block_5$2(ctx)
  );
  const suffix_slot_template = (
    /*#slots*/
    ctx[49].suffix
  );
  const suffix_slot = create_slot(
    suffix_slot_template,
    ctx,
    /*$$scope*/
    ctx[54],
    get_suffix_slot_context$1
  );
  const suffix_slot_or_fallback = suffix_slot || fallback_block$3(ctx);
  let if_block4 = (
    /*$$slots*/
    (ctx[32].append || /*append*/
    ctx[4]) && create_if_block_2$3(ctx)
  );
  return {
    c() {
      div1 = element("div");
      if (if_block0) if_block0.c();
      t0 = space();
      div0 = element("div");
      if (prefix_slot_or_fallback) prefix_slot_or_fallback.c();
      t1 = space();
      input = element("input");
      t2 = space();
      if (if_block1) if_block1.c();
      t3 = space();
      if (if_block2) if_block2.c();
      t4 = space();
      if (if_block3) if_block3.c();
      t5 = space();
      if (suffix_slot_or_fallback) suffix_slot_or_fallback.c();
      t6 = space();
      if (if_block4) if_block4.c();
      set_attributes(input, input_data);
      set_style(
        input,
        "text-align",
        /*center*/
        ctx[8] ? "center" : void 0
      );
      attr(
        div0,
        "class",
        /*inputWrapperCls*/
        ctx[21]
      );
      attr(
        div1,
        "class",
        /*baseCls*/
        ctx[22]
      );
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      if (if_block0) if_block0.m(div1, null);
      append(div1, t0);
      append(div1, div0);
      if (prefix_slot_or_fallback) {
        prefix_slot_or_fallback.m(div0, null);
      }
      append(div0, t1);
      append(div0, input);
      if ("value" in input_data) {
        input.value = input_data.value;
      }
      if (input.autofocus) input.focus();
      ctx[50](input);
      append(div0, t2);
      if (if_block1) if_block1.m(div0, null);
      append(div0, t3);
      if (if_block2) if_block2.m(div0, null);
      append(div0, t4);
      if (if_block3) if_block3.m(div0, null);
      append(div0, t5);
      if (suffix_slot_or_fallback) {
        suffix_slot_or_fallback.m(div0, null);
      }
      append(div1, t6);
      if (if_block4) if_block4.m(div1, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            input,
            "input",
            /*onInput*/
            ctx[24]
          ),
          listen(
            input,
            "change",
            /*onChange*/
            ctx[25]
          ),
          listen(
            input,
            "keydown",
            /*onEnter*/
            ctx[27]
          ),
          listen(
            input,
            "compositionstart",
            /*onCompositionStart*/
            ctx[28]
          ),
          listen(
            input,
            "compositionend",
            /*onCompositionEnd*/
            ctx[29]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (
        /*$$slots*/
        ctx2[32].prepend || /*prepend*/
        ctx2[5]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty[0] & /*prepend*/
          32 | dirty[1] & /*$$slots*/
          2) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_9$1(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div1, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (prefix_slot) {
        if (prefix_slot.p && (!current || dirty[1] & /*$$scope*/
        8388608)) {
          update_slot_base(
            prefix_slot,
            prefix_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[54],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[54]
            ) : get_slot_changes(
              prefix_slot_template,
              /*$$scope*/
              ctx2[54],
              dirty,
              get_prefix_slot_changes$1
            ),
            get_prefix_slot_context$1
          );
        }
      } else {
        if (prefix_slot_or_fallback && prefix_slot_or_fallback.p && (!current || dirty[0] & /*prefixIconCls, iconPrefix*/
        524292)) {
          prefix_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      set_attributes(input, input_data = get_spread_update(input_levels, [
        (!current || dirty[0] & /*inputCls*/
        1048576) && { class: (
          /*inputCls*/
          ctx2[20]
        ) },
        (!current || dirty[0] & /*value*/
        1 && input.value !== /*value*/
        ctx2[0]) && { value: (
          /*value*/
          ctx2[0]
        ) },
        (!current || dirty[0] & /*disabledInner*/
        2048) && { disabled: (
          /*disabledInner*/
          ctx2[11]
        ) },
        (!current || dirty[0] & /*isPassword*/
        8388608) && { type: (
          /*isPassword*/
          ctx2[23]
        ) },
        (!current || dirty[0] & /*placeholder*/
        2) && { placeholder: (
          /*placeholder*/
          ctx2[1]
        ) },
        dirty[0] & /*attrs*/
        64 && /*attrs*/
        ctx2[6]
      ]));
      if ("value" in input_data) {
        input.value = input_data.value;
      }
      set_style(
        input,
        "text-align",
        /*center*/
        ctx2[8] ? "center" : void 0
      );
      if (
        /*clearable*/
        ctx2[9] && !/*disabledInner*/
        ctx2[11] && /*value*/
        ctx2[0]
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & /*clearable, disabledInner, value*/
          2561) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_7$2(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div0, t3);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (
        /*isPassword*/
        ctx2[23] === "password" && /*type*/
        ctx2[7] === "password"
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
          if (dirty[0] & /*isPassword, type*/
          8388736) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block_6$2(ctx2);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(div0, t4);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
      if (
        /*isPassword*/
        ctx2[23] === "text" && /*type*/
        ctx2[7] === "password"
      ) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
          if (dirty[0] & /*isPassword, type*/
          8388736) {
            transition_in(if_block3, 1);
          }
        } else {
          if_block3 = create_if_block_5$2(ctx2);
          if_block3.c();
          transition_in(if_block3, 1);
          if_block3.m(div0, t5);
        }
      } else if (if_block3) {
        group_outros();
        transition_out(if_block3, 1, 1, () => {
          if_block3 = null;
        });
        check_outros();
      }
      if (suffix_slot) {
        if (suffix_slot.p && (!current || dirty[1] & /*$$scope*/
        8388608)) {
          update_slot_base(
            suffix_slot,
            suffix_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[54],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[54]
            ) : get_slot_changes(
              suffix_slot_template,
              /*$$scope*/
              ctx2[54],
              dirty,
              get_suffix_slot_changes$1
            ),
            get_suffix_slot_context$1
          );
        }
      } else {
        if (suffix_slot_or_fallback && suffix_slot_or_fallback.p && (!current || dirty[0] & /*suffixIconCls, iconSuffix*/
        262152)) {
          suffix_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (!current || dirty[0] & /*inputWrapperCls*/
      2097152) {
        attr(
          div0,
          "class",
          /*inputWrapperCls*/
          ctx2[21]
        );
      }
      if (
        /*$$slots*/
        ctx2[32].append || /*append*/
        ctx2[4]
      ) {
        if (if_block4) {
          if_block4.p(ctx2, dirty);
          if (dirty[0] & /*append*/
          16 | dirty[1] & /*$$slots*/
          2) {
            transition_in(if_block4, 1);
          }
        } else {
          if_block4 = create_if_block_2$3(ctx2);
          if_block4.c();
          transition_in(if_block4, 1);
          if_block4.m(div1, null);
        }
      } else if (if_block4) {
        group_outros();
        transition_out(if_block4, 1, 1, () => {
          if_block4 = null;
        });
        check_outros();
      }
      if (!current || dirty[0] & /*baseCls*/
      4194304) {
        attr(
          div1,
          "class",
          /*baseCls*/
          ctx2[22]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block0);
      transition_in(prefix_slot_or_fallback, local);
      transition_in(if_block1);
      transition_in(if_block2);
      transition_in(if_block3);
      transition_in(suffix_slot_or_fallback, local);
      transition_in(if_block4);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(prefix_slot_or_fallback, local);
      transition_out(if_block1);
      transition_out(if_block2);
      transition_out(if_block3);
      transition_out(suffix_slot_or_fallback, local);
      transition_out(if_block4);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (if_block0) if_block0.d();
      if (prefix_slot_or_fallback) prefix_slot_or_fallback.d(detaching);
      ctx[50](null);
      if (if_block1) if_block1.d();
      if (if_block2) if_block2.d();
      if (if_block3) if_block3.d();
      if (suffix_slot_or_fallback) suffix_slot_or_fallback.d(detaching);
      if (if_block4) if_block4.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_9$1(ctx) {
  let kbutton;
  let current;
  kbutton = new Dist$a({
    props: {
      cls: (
        /*prependCls*/
        ctx[17]
      ),
      hiddenSlot: true,
      type: "main",
      icon: (
        /*prepend*/
        ctx[5]
      ),
      disabled: (
        /*disabledInner*/
        ctx[11]
      ),
      $$slots: { default: [create_default_slot_1$4] },
      $$scope: { ctx }
    }
  });
  kbutton.$on(
    "click",
    /*handlePrependClick*/
    ctx[30]
  );
  return {
    c() {
      create_component(kbutton.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kbutton, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kbutton_changes = {};
      if (dirty[0] & /*prependCls*/
      131072) kbutton_changes.cls = /*prependCls*/
      ctx2[17];
      if (dirty[0] & /*prepend*/
      32) kbutton_changes.icon = /*prepend*/
      ctx2[5];
      if (dirty[0] & /*disabledInner*/
      2048) kbutton_changes.disabled = /*disabledInner*/
      ctx2[11];
      if (dirty[1] & /*$$scope, $$slots*/
      8388610) {
        kbutton_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kbutton.$set(kbutton_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kbutton.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kbutton.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kbutton, detaching);
    }
  };
}
function create_if_block_10$1(ctx) {
  let current;
  const prepend_slot_template = (
    /*#slots*/
    ctx[49].prepend
  );
  const prepend_slot = create_slot(
    prepend_slot_template,
    ctx,
    /*$$scope*/
    ctx[54],
    get_prepend_slot_context
  );
  return {
    c() {
      if (prepend_slot) prepend_slot.c();
    },
    m(target, anchor) {
      if (prepend_slot) {
        prepend_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (prepend_slot) {
        if (prepend_slot.p && (!current || dirty[1] & /*$$scope*/
        8388608)) {
          update_slot_base(
            prepend_slot,
            prepend_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[54],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[54]
            ) : get_slot_changes(
              prepend_slot_template,
              /*$$scope*/
              ctx2[54],
              dirty,
              get_prepend_slot_changes
            ),
            get_prepend_slot_context
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(prepend_slot, local);
      current = true;
    },
    o(local) {
      transition_out(prepend_slot, local);
      current = false;
    },
    d(detaching) {
      if (prepend_slot) prepend_slot.d(detaching);
    }
  };
}
function create_default_slot_1$4(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*$$slots*/
    ctx[32].prepend && create_if_block_10$1(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*$$slots*/
        ctx2[32].prepend
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[1] & /*$$slots*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_10$1(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_if_block_8$1(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      cls: (
        /*prefixIconCls*/
        ctx[19]
      ),
      icon: (
        /*iconPrefix*/
        ctx[2]
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*prefixIconCls*/
      524288) kicon_changes.cls = /*prefixIconCls*/
      ctx2[19];
      if (dirty[0] & /*iconPrefix*/
      4) kicon_changes.icon = /*iconPrefix*/
      ctx2[2];
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_1$2(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*iconPrefix*/
    ctx[2] && create_if_block_8$1(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*iconPrefix*/
        ctx2[2]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*iconPrefix*/
          4) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_8$1(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_if_block_7$2(ctx) {
  let button;
  let kicon;
  let current;
  let mounted;
  let dispose;
  kicon = new Dist$c({
    props: {
      btn: true,
      icon: "i-carbon:close-outline",
      cls: (
        /*iconCls*/
        ctx[10] + " ml-1"
      )
    }
  });
  return {
    c() {
      button = element("button");
      create_component(kicon.$$.fragment);
      attr(
        button,
        "class",
        /*clearCls*/
        ctx[15]
      );
    },
    m(target, anchor) {
      insert(target, button, anchor);
      mount_component(kicon, button, null);
      current = true;
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*onClear*/
          ctx[26]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*iconCls*/
      1024) kicon_changes.cls = /*iconCls*/
      ctx2[10] + " ml-1";
      kicon.$set(kicon_changes);
      if (!current || dirty[0] & /*clearCls*/
      32768) {
        attr(
          button,
          "class",
          /*clearCls*/
          ctx2[15]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      destroy_component(kicon);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_6$2(ctx) {
  let button;
  let kicon;
  let current;
  let mounted;
  let dispose;
  kicon = new Dist$c({
    props: {
      btn: true,
      icon: "i-carbon-view-off",
      cls: (
        /*iconCls*/
        ctx[10] + " ml-1"
      )
    }
  });
  return {
    c() {
      button = element("button");
      create_component(kicon.$$.fragment);
      attr(
        button,
        "class",
        /*btnCls*/
        ctx[14]
      );
    },
    m(target, anchor) {
      insert(target, button, anchor);
      mount_component(kicon, button, null);
      current = true;
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*click_handler*/
          ctx[51]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*iconCls*/
      1024) kicon_changes.cls = /*iconCls*/
      ctx2[10] + " ml-1";
      kicon.$set(kicon_changes);
      if (!current || dirty[0] & /*btnCls*/
      16384) {
        attr(
          button,
          "class",
          /*btnCls*/
          ctx2[14]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      destroy_component(kicon);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_5$2(ctx) {
  let button;
  let kicon;
  let current;
  let mounted;
  let dispose;
  kicon = new Dist$c({
    props: {
      btn: true,
      icon: "i-carbon-view",
      cls: (
        /*iconCls*/
        ctx[10] + " ml-1"
      )
    }
  });
  return {
    c() {
      button = element("button");
      create_component(kicon.$$.fragment);
      attr(
        button,
        "class",
        /*btnCls*/
        ctx[14]
      );
    },
    m(target, anchor) {
      insert(target, button, anchor);
      mount_component(kicon, button, null);
      current = true;
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*click_handler_1*/
          ctx[52]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*iconCls*/
      1024) kicon_changes.cls = /*iconCls*/
      ctx2[10] + " ml-1";
      kicon.$set(kicon_changes);
      if (!current || dirty[0] & /*btnCls*/
      16384) {
        attr(
          button,
          "class",
          /*btnCls*/
          ctx2[14]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      destroy_component(kicon);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_4$3(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      cls: (
        /*suffixIconCls*/
        ctx[18]
      ),
      icon: (
        /*iconSuffix*/
        ctx[3]
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*suffixIconCls*/
      262144) kicon_changes.cls = /*suffixIconCls*/
      ctx2[18];
      if (dirty[0] & /*iconSuffix*/
      8) kicon_changes.icon = /*iconSuffix*/
      ctx2[3];
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block$3(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*iconSuffix*/
    ctx[3] && create_if_block_4$3(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*iconSuffix*/
        ctx2[3]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*iconSuffix*/
          8) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_4$3(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_if_block_2$3(ctx) {
  let kbutton;
  let current;
  kbutton = new Dist$a({
    props: {
      cls: (
        /*appendgCls*/
        ctx[16]
      ),
      hiddenSlot: true,
      type: "main",
      icon: (
        /*append*/
        ctx[4]
      ),
      disabled: (
        /*disabledInner*/
        ctx[11]
      ),
      $$slots: { default: [create_default_slot$5] },
      $$scope: { ctx }
    }
  });
  kbutton.$on(
    "click",
    /*handleAppendClick*/
    ctx[31]
  );
  return {
    c() {
      create_component(kbutton.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kbutton, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kbutton_changes = {};
      if (dirty[0] & /*appendgCls*/
      65536) kbutton_changes.cls = /*appendgCls*/
      ctx2[16];
      if (dirty[0] & /*append*/
      16) kbutton_changes.icon = /*append*/
      ctx2[4];
      if (dirty[0] & /*disabledInner*/
      2048) kbutton_changes.disabled = /*disabledInner*/
      ctx2[11];
      if (dirty[1] & /*$$scope, $$slots*/
      8388610) {
        kbutton_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kbutton.$set(kbutton_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kbutton.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kbutton.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kbutton, detaching);
    }
  };
}
function create_if_block_3$3(ctx) {
  let current;
  const append_slot_template = (
    /*#slots*/
    ctx[49].append
  );
  const append_slot = create_slot(
    append_slot_template,
    ctx,
    /*$$scope*/
    ctx[54],
    get_append_slot_context
  );
  return {
    c() {
      if (append_slot) append_slot.c();
    },
    m(target, anchor) {
      if (append_slot) {
        append_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (append_slot) {
        if (append_slot.p && (!current || dirty[1] & /*$$scope*/
        8388608)) {
          update_slot_base(
            append_slot,
            append_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[54],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[54]
            ) : get_slot_changes(
              append_slot_template,
              /*$$scope*/
              ctx2[54],
              dirty,
              get_append_slot_changes
            ),
            get_append_slot_context
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(append_slot, local);
      current = true;
    },
    o(local) {
      transition_out(append_slot, local);
      current = false;
    },
    d(detaching) {
      if (append_slot) append_slot.d(detaching);
    }
  };
}
function create_default_slot$5(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*$$slots*/
    ctx[32].append && create_if_block_3$3(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*$$slots*/
        ctx2[32].append
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[1] & /*$$slots*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_3$3(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_if_block$7(ctx) {
  let div1;
  let div0;
  let textarea;
  let mounted;
  let dispose;
  let textarea_levels = [
    { class: (
      /*inputCls*/
      ctx[20]
    ) },
    { value: (
      /*value*/
      ctx[0]
    ) },
    { disabled: (
      /*disabledInner*/
      ctx[11]
    ) },
    { placeholder: (
      /*placeholder*/
      ctx[1]
    ) },
    /*attrs*/
    ctx[6]
  ];
  let textarea_data = {};
  for (let i = 0; i < textarea_levels.length; i += 1) {
    textarea_data = assign(textarea_data, textarea_levels[i]);
  }
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      textarea = element("textarea");
      set_attributes(textarea, textarea_data);
      set_style(
        textarea,
        "min-height",
        /*areaStyle*/
        ctx[13].minHeight
      );
      set_style(
        textarea,
        "height",
        /*areaStyle*/
        ctx[13].height
      );
      attr(
        div0,
        "class",
        /*inputWrapperCls*/
        ctx[21]
      );
      attr(
        div1,
        "class",
        /*baseCls*/
        ctx[22]
      );
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, textarea);
      if (textarea.autofocus) textarea.focus();
      ctx[53](textarea);
      if (!mounted) {
        dispose = [
          listen(
            textarea,
            "input",
            /*onInput*/
            ctx[24]
          ),
          listen(
            textarea,
            "change",
            /*onChange*/
            ctx[25]
          ),
          listen(
            textarea,
            "keydown",
            /*onEnter*/
            ctx[27]
          ),
          listen(
            textarea,
            "compositionstart",
            /*onCompositionStart*/
            ctx[28]
          ),
          listen(
            textarea,
            "compositionend",
            /*onCompositionEnd*/
            ctx[29]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
        dirty[0] & /*inputCls*/
        1048576 && { class: (
          /*inputCls*/
          ctx2[20]
        ) },
        dirty[0] & /*value*/
        1 && { value: (
          /*value*/
          ctx2[0]
        ) },
        dirty[0] & /*disabledInner*/
        2048 && { disabled: (
          /*disabledInner*/
          ctx2[11]
        ) },
        dirty[0] & /*placeholder*/
        2 && { placeholder: (
          /*placeholder*/
          ctx2[1]
        ) },
        dirty[0] & /*attrs*/
        64 && /*attrs*/
        ctx2[6]
      ]));
      set_style(
        textarea,
        "min-height",
        /*areaStyle*/
        ctx2[13].minHeight
      );
      set_style(
        textarea,
        "height",
        /*areaStyle*/
        ctx2[13].height
      );
      if (dirty[0] & /*inputWrapperCls*/
      2097152) {
        attr(
          div0,
          "class",
          /*inputWrapperCls*/
          ctx2[21]
        );
      }
      if (dirty[0] & /*baseCls*/
      4194304) {
        attr(
          div1,
          "class",
          /*baseCls*/
          ctx2[22]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      ctx[53](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$j(ctx) {
  let t;
  let if_block1_anchor;
  let current;
  let if_block0 = (
    /*type*/
    ctx[7] !== "textarea" && create_if_block_1$4(ctx)
  );
  let if_block1 = (
    /*type*/
    ctx[7] === "textarea" && create_if_block$7(ctx)
  );
  return {
    c() {
      if (if_block0) if_block0.c();
      t = space();
      if (if_block1) if_block1.c();
      if_block1_anchor = empty();
    },
    m(target, anchor) {
      if (if_block0) if_block0.m(target, anchor);
      insert(target, t, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*type*/
        ctx2[7] !== "textarea"
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty[0] & /*type*/
          128) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$4(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(t.parentNode, t);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (
        /*type*/
        ctx2[7] === "textarea"
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block$7(ctx2);
          if_block1.c();
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block0);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t);
        detach(if_block1_anchor);
      }
      if (if_block0) if_block0.d(detaching);
      if (if_block1) if_block1.d(detaching);
    }
  };
}
function instance$g($$self, $$props, $$invalidate) {
  let disabledInner;
  let sizeInner;
  let isErrorInner;
  let isPassword;
  let baseCls;
  let inputWrapperCls;
  let inputCls;
  let iconCls;
  let prefixIconCls;
  let suffixIconCls;
  let prependCls;
  let appendgCls;
  let clearCls;
  let btnCls;
  let { $$slots: slots = {}, $$scope } = $$props;
  const $$slots = compute_slots(slots);
  let { size = "md" } = $$props;
  let { value = "" } = $$props;
  let { placeholder = "" } = $$props;
  let { disabled = false } = $$props;
  let { iconPrefix = "" } = $$props;
  let { iconSuffix = "" } = $$props;
  let { append: append2 = "" } = $$props;
  let { prepend = "" } = $$props;
  let { cls = void 0 } = $$props;
  let { ignoreForm = false } = $$props;
  let { attrs = {} } = $$props;
  let { useCompositionInput = false } = $$props;
  let { type: type3 = "text" } = $$props;
  let { search = false } = $$props;
  let { rows = 3 } = $$props;
  let { autosize = false } = $$props;
  let { isError = false } = $$props;
  let { center = false } = $$props;
  let { clearable = false } = $$props;
  let disabledFrom = false;
  let sizeFrom = "";
  let isErrorForm = false;
  const formContext = getContext(formItemKey);
  const formInstance = getContext(formKey);
  let field = "";
  function formUpdateField(init2 = false) {
    field = formContext.split("&").pop();
    $$invalidate(0, value = formInstance.getValueByPath(field, init2 ? formInstance.__default_value : formInstance.__value));
  }
  function formPropsChangeCb(props) {
    $$invalidate(43, disabledFrom = props.disabled);
    $$invalidate(44, sizeFrom = props.size);
  }
  function fromFieldError(error2) {
    $$invalidate(45, isErrorForm = error2);
  }
  if (formContext && formInstance && !ignoreForm) {
    formUpdateField(true);
    formPropsChangeCb(formInstance.__dynamicProps);
    formInstance.__itemCompMap[field] = { update: formUpdateField, type: "input" };
    formInstance.__errorCompEvtMap[field] = fromFieldError;
    formInstance.__propHandleEvtMap.push(formPropsChangeCb);
  }
  const dispatch2 = createEventDispatcher();
  const onInput = (e) => {
    if (disabledInner) return;
    const { value: inputValue } = e.target;
    dispatch2("input", inputValue, e);
    doUpdateFormField(inputValue);
    if (!useCompositionInput || !isComposing) {
      $$invalidate(0, value = inputValue);
      if (useCompositionInput && !isComposing) {
        dispatch2("compositionInput", inputValue, e);
      }
    }
  };
  const onChange = (e) => {
    var _a;
    if (disabledInner) return;
    dispatch2("change", e);
    doUpdateFormField((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value);
  };
  function doUpdateFormField(value2) {
    formInstance && (formInstance == null ? void 0 : formInstance.updateField(field, value2, !formInstance.__manual_validate));
  }
  const onClear = () => {
    if (disabledInner) return;
    $$invalidate(0, value = "");
    dispatch2("updateValue", value);
  };
  const onEnter = (e) => {
    if (disabledInner) return;
    if (e.key === "Enter") {
      if (search) {
        dispatch2("search", e.target.value);
      } else {
        dispatch2("enter", e);
      }
    } else dispatch2("keydown", e);
  };
  let isComposing = false;
  const onCompositionStart = (e) => {
    if (disabledInner) return;
    dispatch2("compositionstart", e);
    isComposing = true;
  };
  const onCompositionEnd = (e) => {
    var _a;
    if (disabledInner) return;
    dispatch2("compositionend", e);
    if (!isComposing) {
      return;
    }
    isComposing = false;
    if (useCompositionInput) {
      (_a = e.target) == null ? void 0 : _a.dispatchEvent(new Event("input"));
    }
  };
  let inputRef = null;
  const handlePrependClick = () => {
    if (disabledInner) return;
    if (search) {
      inputRef && dispatch2("search", inputRef.value);
    } else {
      inputRef && dispatch2("triggerPrepend", inputRef.value);
    }
  };
  const handleAppendClick = () => {
    if (disabledInner) return;
    if (search) {
      inputRef && dispatch2("search", inputRef.value);
    } else {
      inputRef && dispatch2("triggerAppend", inputRef.value);
    }
  };
  let areaStyle = {};
  const resizeTextarea = () => {
    if (type3 !== "textarea" || !inputRef) return;
    if (autosize) {
      if (isObject(autosize)) {
        const minRows = autosize.minRows || void 0;
        const maxRows = autosize.maxRows || void 0;
        $$invalidate(13, areaStyle = {
          ...compTextareaH(inputRef, minRows, maxRows)
        });
      }
    } else {
      $$invalidate(13, areaStyle = {
        minHeight: compTextareaH(inputRef, rows).minHeight
      });
    }
  };
  let valueInner = value;
  onMount(async () => {
    await tick();
    resizeTextarea();
  });
  const prefixCls = getPrefixCls("input");
  function input_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inputRef = $$value;
      $$invalidate(12, inputRef);
    });
  }
  const click_handler = () => {
    $$invalidate(23, isPassword = "text");
  };
  const click_handler_1 = () => {
    $$invalidate(23, isPassword = "password");
  };
  function textarea_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inputRef = $$value;
      $$invalidate(12, inputRef);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("size" in $$props2) $$invalidate(33, size = $$props2.size);
    if ("value" in $$props2) $$invalidate(0, value = $$props2.value);
    if ("placeholder" in $$props2) $$invalidate(1, placeholder = $$props2.placeholder);
    if ("disabled" in $$props2) $$invalidate(34, disabled = $$props2.disabled);
    if ("iconPrefix" in $$props2) $$invalidate(2, iconPrefix = $$props2.iconPrefix);
    if ("iconSuffix" in $$props2) $$invalidate(3, iconSuffix = $$props2.iconSuffix);
    if ("append" in $$props2) $$invalidate(4, append2 = $$props2.append);
    if ("prepend" in $$props2) $$invalidate(5, prepend = $$props2.prepend);
    if ("cls" in $$props2) $$invalidate(35, cls = $$props2.cls);
    if ("ignoreForm" in $$props2) $$invalidate(36, ignoreForm = $$props2.ignoreForm);
    if ("attrs" in $$props2) $$invalidate(6, attrs = $$props2.attrs);
    if ("useCompositionInput" in $$props2) $$invalidate(37, useCompositionInput = $$props2.useCompositionInput);
    if ("type" in $$props2) $$invalidate(7, type3 = $$props2.type);
    if ("search" in $$props2) $$invalidate(38, search = $$props2.search);
    if ("rows" in $$props2) $$invalidate(39, rows = $$props2.rows);
    if ("autosize" in $$props2) $$invalidate(40, autosize = $$props2.autosize);
    if ("isError" in $$props2) $$invalidate(41, isError = $$props2.isError);
    if ("center" in $$props2) $$invalidate(8, center = $$props2.center);
    if ("clearable" in $$props2) $$invalidate(9, clearable = $$props2.clearable);
    if ("$$scope" in $$props2) $$invalidate(54, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[1] & /*disabledFrom, disabled*/
    4104) {
      $$invalidate(11, disabledInner = disabledFrom || disabled);
    }
    if ($$self.$$.dirty[1] & /*sizeFrom, size*/
    8196) {
      $$invalidate(47, sizeInner = sizeFrom || size);
    }
    if ($$self.$$.dirty[1] & /*isErrorForm, isError*/
    17408) {
      $$invalidate(48, isErrorInner = isErrorForm || isError);
    }
    if ($$self.$$.dirty[0] & /*value*/
    1 | $$self.$$.dirty[1] & /*valueInner*/
    32768) {
      if (value !== valueInner) {
        $$invalidate(46, valueInner = value);
        resizeTextarea();
      }
    }
    if ($$self.$$.dirty[0] & /*type*/
    128) {
      $$invalidate(23, isPassword = type3);
    }
    if ($$self.$$.dirty[1] & /*cls*/
    16) {
      $$invalidate(22, baseCls = clsx(prefixCls, cls));
    }
    if ($$self.$$.dirty[0] & /*type, disabledInner, append, prepend*/
    2224 | $$self.$$.dirty[1] & /*sizeInner, isErrorInner*/
    196608) {
      $$invalidate(21, inputWrapperCls = clsx(
        `${prefixCls}--base`,
        {
          [`${prefixCls}__${sizeInner}`]: !(type3 === "textarea")
        },
        `${prefixCls}__dark`,
        {
          [`${prefixCls}__disabled`]: disabledInner,
          [`${prefixCls}__disabled__dark`]: disabledInner
        },
        {
          [`${prefixCls}__error`]: isErrorInner,
          [`${prefixCls}__hover`]: !isErrorInner,
          [`${prefixCls}__focus`]: !isErrorInner
        },
        {
          [`${prefixCls}__rounded`]: !$$slots.append && !append2 && !$$slots.prepend && !prepend,
          [`${prefixCls}__rounded__left`]: ($$slots.append || append2) && !$$slots.prepend && !prepend,
          [`${prefixCls}__rounded__right`]: !$$slots.append && !append2 && ($$slots.prepend || prepend)
        }
      ));
    }
    if ($$self.$$.dirty[0] & /*type, disabledInner*/
    2176) {
      $$invalidate(20, inputCls = clsx(
        `${prefixCls}--inner`,
        {
          [`${prefixCls}--inner__textarea`]: type3 === "textarea"
        },
        {
          [`${prefixCls}--inner__dark`]: !disabledInner,
          [`${prefixCls}__disabled`]: disabledInner,
          [`${prefixCls}__disabled__dark`]: disabledInner
        }
      ));
    }
    if ($$self.$$.dirty[1] & /*sizeInner*/
    65536) {
      $$invalidate(10, iconCls = clsx(`${prefixCls}--icon`, `${prefixCls}--icon__${sizeInner}`));
    }
    if ($$self.$$.dirty[0] & /*iconCls*/
    1024) {
      $$invalidate(19, prefixIconCls = clsx(iconCls, `${prefixCls}--prefix-icon`));
    }
    if ($$self.$$.dirty[0] & /*iconCls*/
    1024) {
      $$invalidate(18, suffixIconCls = clsx(iconCls, `${prefixCls}--suffix-icon`));
    }
    if ($$self.$$.dirty[1] & /*sizeInner*/
    65536) {
      $$invalidate(17, prependCls = clsx(`${prefixCls}--prepend`, `${prefixCls}--prepend__${sizeInner}`));
    }
    if ($$self.$$.dirty[1] & /*sizeInner*/
    65536) {
      $$invalidate(16, appendgCls = clsx(`${prefixCls}--append`, `${prefixCls}--append__${sizeInner}`));
    }
  };
  $$invalidate(15, clearCls = clsx(`${prefixCls}--clear-icon`));
  $$invalidate(14, btnCls = clsx(`${prefixCls}--btn`));
  return [
    value,
    placeholder,
    iconPrefix,
    iconSuffix,
    append2,
    prepend,
    attrs,
    type3,
    center,
    clearable,
    iconCls,
    disabledInner,
    inputRef,
    areaStyle,
    btnCls,
    clearCls,
    appendgCls,
    prependCls,
    suffixIconCls,
    prefixIconCls,
    inputCls,
    inputWrapperCls,
    baseCls,
    isPassword,
    onInput,
    onChange,
    onClear,
    onEnter,
    onCompositionStart,
    onCompositionEnd,
    handlePrependClick,
    handleAppendClick,
    $$slots,
    size,
    disabled,
    cls,
    ignoreForm,
    useCompositionInput,
    search,
    rows,
    autosize,
    isError,
    doUpdateFormField,
    disabledFrom,
    sizeFrom,
    isErrorForm,
    valueInner,
    sizeInner,
    isErrorInner,
    slots,
    input_binding,
    click_handler,
    click_handler_1,
    textarea_binding,
    $$scope
  ];
}
let Dist$6 = class Dist7 extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$g,
      create_fragment$j,
      safe_not_equal,
      {
        size: 33,
        value: 0,
        placeholder: 1,
        disabled: 34,
        iconPrefix: 2,
        iconSuffix: 3,
        append: 4,
        prepend: 5,
        cls: 35,
        ignoreForm: 36,
        attrs: 6,
        useCompositionInput: 37,
        type: 7,
        search: 38,
        rows: 39,
        autosize: 40,
        isError: 41,
        center: 8,
        clearable: 9,
        doUpdateFormField: 42
      },
      null,
      [-1, -1, -1]
    );
  }
  get doUpdateFormField() {
    return this.$$.ctx[42];
  }
};
function create_if_block$6(ctx) {
  let div1;
  let div0;
  let show_if;
  let show_if_1;
  let current_block_type_index;
  let if_block0;
  let t0;
  let t1;
  let div1_style_value;
  let div1_intro;
  let div1_outro;
  let current;
  const if_block_creators = [create_if_block_5$1, create_if_block_7$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (dirty & /*title*/
    16) show_if = null;
    if (dirty & /*title*/
    16) show_if_1 = null;
    if (show_if == null) show_if = !!/*title*/
    (ctx2[4] && isString(
      /*title*/
      ctx2[4]
    ));
    if (show_if) return 0;
    if (show_if_1 == null) show_if_1 = !!/*title*/
    (ctx2[4] && isFunction$1(
      /*title*/
      ctx2[4]
    ));
    if (show_if_1) return 1;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx, -1))) {
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  let if_block1 = (
    /*close*/
    ctx[1] && create_if_block_4$2(ctx)
  );
  let if_block2 = (
    /*content*/
    ctx[5] && create_if_block_1$3(ctx)
  );
  let div1_levels = [
    { class: (
      /*cnames*/
      ctx[10]
    ) },
    /*attrs*/
    ctx[0],
    {
      style: div1_style_value = "top: " + /*y*/
      ctx[8] + "; left: " + /*x*/
      ctx[7]
    }
  ];
  let div_data_1 = {};
  for (let i = 0; i < div1_levels.length; i += 1) {
    div_data_1 = assign(div_data_1, div1_levels[i]);
  }
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (if_block0) if_block0.c();
      t0 = space();
      if (if_block1) if_block1.c();
      t1 = space();
      if (if_block2) if_block2.c();
      attr(div0, "class", "k-notification--body");
      set_attributes(div1, div_data_1);
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(div0, null);
      }
      append(div0, t0);
      if (if_block1) if_block1.m(div0, null);
      append(div1, t1);
      if (if_block2) if_block2.m(div1, null);
      ctx[18](div1);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx, dirty);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        }
      } else {
        if (if_block0) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
            if_block0.c();
          } else {
            if_block0.p(ctx, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(div0, t0);
        } else {
          if_block0 = null;
        }
      }
      if (
        /*close*/
        ctx[1]
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
          if (dirty & /*close*/
          2) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_4$2(ctx);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div0, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (
        /*content*/
        ctx[5]
      ) {
        if (if_block2) {
          if_block2.p(ctx, dirty);
          if (dirty & /*content*/
          32) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block_1$3(ctx);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(div1, null);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
      set_attributes(div1, div_data_1 = get_spread_update(div1_levels, [
        (!current || dirty & /*cnames*/
        1024) && { class: (
          /*cnames*/
          ctx[10]
        ) },
        dirty & /*attrs*/
        1 && /*attrs*/
        ctx[0],
        (!current || dirty & /*y, x*/
        384 && div1_style_value !== (div1_style_value = "top: " + /*y*/
        ctx[8] + "; left: " + /*x*/
        ctx[7])) && { style: div1_style_value }
      ]));
    },
    i(local) {
      if (current) return;
      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(if_block2);
      if (local) {
        add_render_callback(() => {
          if (!current) return;
          if (div1_outro) div1_outro.end(1);
          div1_intro = create_in_transition(
            div1,
            fly,
            /*flyAnimate*/
            ctx[9].in
          );
          div1_intro.start();
        });
      }
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      transition_out(if_block2);
      if (div1_intro) div1_intro.invalidate();
      if (local) {
        div1_outro = create_out_transition(
          div1,
          fly,
          /*flyAnimate*/
          ctx[9].in
        );
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
      if (if_block1) if_block1.d();
      if (if_block2) if_block2.d();
      ctx[18](null);
      if (detaching && div1_outro) div1_outro.end();
    }
  };
}
function create_if_block_7$1(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  var switch_value = (
    /*title*/
    ctx[4]
  );
  function switch_props(ctx2, dirty) {
    return {};
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props());
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*title*/
      16 && switch_value !== (switch_value = /*title*/
      ctx2[4])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props());
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      }
    },
    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_if_block_5$1(ctx) {
  let h1;
  let t;
  let html_tag;
  let current;
  let if_block = (
    /*type*/
    ctx[2] && create_if_block_6$1(ctx)
  );
  return {
    c() {
      h1 = element("h1");
      if (if_block) if_block.c();
      t = space();
      html_tag = new HtmlTag(false);
      html_tag.a = null;
      attr(h1, "class", "k-notification--title k-notification--title__dark");
    },
    m(target, anchor) {
      insert(target, h1, anchor);
      if (if_block) if_block.m(h1, null);
      append(h1, t);
      html_tag.m(
        /*title*/
        ctx[4],
        h1
      );
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*type*/
        ctx2[2]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*type*/
          4) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_6$1(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(h1, t);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (!current || dirty & /*title*/
      16) html_tag.p(
        /*title*/
        ctx2[4]
      );
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(h1);
      }
      if (if_block) if_block.d();
    }
  };
}
function create_if_block_6$1(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      icon: "k-notification--icon--" + /*type*/
      ctx[2],
      cls: "k-notification--type--icon",
      color: "k-notification--" + /*type*/
      ctx[2]
    }
  });
  kicon.$on(
    "click",
    /*handleClose*/
    ctx[11]
  );
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty & /*type*/
      4) kicon_changes.icon = "k-notification--icon--" + /*type*/
      ctx2[2];
      if (dirty & /*type*/
      4) kicon_changes.color = "k-notification--" + /*type*/
      ctx2[2];
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function create_if_block_4$2(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      icon: "i-carbon-close",
      btn: true,
      color: "k-notification--close--icon"
    }
  });
  kicon.$on(
    "click",
    /*handleClose*/
    ctx[11]
  );
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function create_if_block_1$3(ctx) {
  let div2;
  let show_if;
  let show_if_1;
  let current_block_type_index;
  let if_block;
  let current;
  const if_block_creators = [create_if_block_2$2, create_if_block_3$2];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (dirty & /*content*/
    32) show_if = null;
    if (dirty & /*content*/
    32) show_if_1 = null;
    if (show_if == null) show_if = !!isString(
      /*content*/
      ctx2[5]
    );
    if (show_if) return 0;
    if (show_if_1 == null) show_if_1 = !!isFunction$1(
      /*content*/
      ctx2[5]
    );
    if (show_if_1) return 1;
    return -1;
  }
  if (~(current_block_type_index = select_block_type_1(ctx, -1))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  return {
    c() {
      div2 = element("div");
      if (if_block) if_block.c();
      attr(div2, "class", "k-notification--content");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(div2, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_1(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(div2, null);
        } else {
          if_block = null;
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
    }
  };
}
function create_if_block_3$2(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  var switch_value = (
    /*content*/
    ctx[5]
  );
  function switch_props(ctx2, dirty) {
    return {};
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props());
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*content*/
      32 && switch_value !== (switch_value = /*content*/
      ctx2[5])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props());
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      }
    },
    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_if_block_2$2(ctx) {
  let html_tag;
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m(target, anchor) {
      html_tag.m(
        /*content*/
        ctx[5],
        target,
        anchor
      );
      insert(target, html_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*content*/
      32) html_tag.p(
        /*content*/
        ctx2[5]
      );
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(html_anchor);
        html_tag.d();
      }
    }
  };
}
function create_fragment$i(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*show*/
    ctx[3] && create_if_block$6(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*show*/
        ctx2[3]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*show*/
          8) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$6(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function instance$f($$self, $$props, $$invalidate) {
  let cnames;
  let { placement = "right-top" } = $$props;
  let { attrs = {} } = $$props;
  let { cls = void 0 } = $$props;
  let { close = false } = $$props;
  let { type: type3 = null } = $$props;
  let { onClose = null } = $$props;
  let { offset: offset2 = 0 } = $$props;
  let { show = false } = $$props;
  let { index = 0 } = $$props;
  let { title = "" } = $$props;
  let { content = "" } = $$props;
  let notificationRef = null;
  let x = "0";
  const resolveX = () => {
    if (placement.startsWith("left")) {
      $$invalidate(7, x = "20px");
    }
    if (placement.startsWith("right")) {
      $$invalidate(7, x = `calc(100% - ${notificationRef.getBoundingClientRect().width + 20}px)`);
    }
    if (placement === "center") {
      $$invalidate(7, x = `calc(50% - ${notificationRef.getBoundingClientRect().width / 2}px)`);
    }
  };
  let y = "0";
  const resolveY = () => {
    const domHeight = notificationRef.getBoundingClientRect().height;
    if (placement.endsWith("top") || placement === "center") {
      $$invalidate(8, y = `${20 * (index + 1) + domHeight * index + offset2}px`);
    }
    if (placement.endsWith("bottom")) {
      $$invalidate(8, y = `calc(100% - ${(20 + domHeight) * (index + 1) + offset2}px)`);
    }
  };
  let oldIndex = index;
  let flyAnimate = { in: { x: 100, duration: 300 } };
  const resolveFlyX = () => {
    if (placement.startsWith("left")) {
      $$invalidate(9, flyAnimate.in.x = -100, flyAnimate);
      return;
    }
    if (placement.startsWith("right")) {
      $$invalidate(9, flyAnimate.in.x = 100, flyAnimate);
      return;
    }
    if (placement === "center") {
      $$invalidate(9, flyAnimate = { in: { y: -100, duration: 300 } });
      return;
    }
  };
  async function resolvePosition() {
    resolveFlyX();
    await tick();
    resolveY();
    resolveX();
  }
  const handleClose = () => {
    onClose && onClose();
  };
  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      notificationRef = $$value;
      $$invalidate(6, notificationRef);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("placement" in $$props2) $$invalidate(12, placement = $$props2.placement);
    if ("attrs" in $$props2) $$invalidate(0, attrs = $$props2.attrs);
    if ("cls" in $$props2) $$invalidate(13, cls = $$props2.cls);
    if ("close" in $$props2) $$invalidate(1, close = $$props2.close);
    if ("type" in $$props2) $$invalidate(2, type3 = $$props2.type);
    if ("onClose" in $$props2) $$invalidate(14, onClose = $$props2.onClose);
    if ("offset" in $$props2) $$invalidate(15, offset2 = $$props2.offset);
    if ("show" in $$props2) $$invalidate(3, show = $$props2.show);
    if ("index" in $$props2) $$invalidate(16, index = $$props2.index);
    if ("title" in $$props2) $$invalidate(4, title = $$props2.title);
    if ("content" in $$props2) $$invalidate(5, content = $$props2.content);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*index, oldIndex*/
    196608) {
      if (index !== oldIndex) {
        $$invalidate(17, oldIndex = index);
        resolveY();
      }
    }
    if ($$self.$$.dirty & /*show*/
    8) {
      if (show) {
        resolvePosition();
      }
    }
    if ($$self.$$.dirty & /*cls*/
    8192) {
      $$invalidate(10, cnames = clsx("k-notification--base k-notification--base__dark", cls));
    }
  };
  return [
    attrs,
    close,
    type3,
    show,
    title,
    content,
    notificationRef,
    x,
    y,
    flyAnimate,
    cnames,
    handleClose,
    placement,
    cls,
    onClose,
    offset2,
    index,
    oldIndex,
    div1_binding
  ];
}
let Dist$5 = class Dist8 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$f, create_fragment$i, safe_not_equal, {
      placement: 12,
      attrs: 0,
      cls: 13,
      close: 1,
      type: 2,
      onClose: 14,
      offset: 15,
      show: 3,
      index: 16,
      title: 4,
      content: 5
    });
  }
};
const ANIMATION_DURATION = 300;
const defaultNotifyOptions = {
  placement: "right-top",
  close: true,
  duration: 3e3,
  autoClose: true,
  offset: 0
};
let nid = 0;
const notifyMap = {
  "right-top": [],
  center: [],
  "left-bottom": [],
  "right-bottom": [],
  "left-top": []
};
const resolveNotifyOptions = (options) => {
  const evt = {
    onClose: options.onClose
  };
  const finalOptions = Object.assign(Object.assign({}, defaultNotifyOptions), options);
  Reflect.deleteProperty(finalOptions, "onClose");
  return {
    finalOptions,
    evt
  };
};
function mountNotify(options, evt) {
  const notifyArray = notifyMap[options.placement || "right-top"];
  if (!notifyArray) {
    console.error("Notify Component Options Error: placement =  'right-top' | 'left-top' | 'right-bottom' | 'left-bottom' | 'center'");
    return;
  }
  const finalProps = jsonClone(options);
  Reflect.deleteProperty(finalProps, "duration");
  Reflect.deleteProperty(finalProps, "autoClose");
  Reflect.deleteProperty(finalProps, "target");
  const NotificationInst = new Dist$5({
    target: options.target || document.body,
    props: Object.assign(Object.assign({}, finalProps), { attrs: options.attrs, title: options.title, content: options.content, show: false, index: notifyArray.length, onClose() {
      NotifyFn.clear(NotificationInst);
    } })
  });
  NotificationInst.__notify_index = nid++;
  NotificationInst.__notify_placement = options.placement;
  NotificationInst.__notify_evt = evt;
  NotificationInst.$set({ show: true });
  autoUnmountNotify(options, NotificationInst);
  notifyArray.push(NotificationInst);
  return NotificationInst;
}
async function autoUnmountNotify(options, inst) {
  if (options.autoClose) {
    await durationUnmountNotify(inst, options.duration || 0);
  }
}
async function durationUnmountNotify(inst, duration) {
  inst.__notify_durationUnmountTimer = setTimeout(() => {
    NotifyFn.clear(inst);
  }, duration);
}
function unmountNotify(inst, duration) {
  clearTimeout(inst.__notify_durationUnmountTimer);
  inst.$set({ show: false });
  inst.__notify_evt.onClose && inst.__notify_evt.onClose();
  setTimeout(() => {
    inst.$destroy();
  }, duration);
}
function updatedNotifyByIndex(placement) {
  notifyMap[placement].forEach((inst, index) => {
    inst && inst.$set({ index });
  });
}
function NotifyFn(options) {
  const { finalOptions, evt } = resolveNotifyOptions(options);
  return mountNotify(finalOptions, evt);
}
NotifyFn.info = (options = {}) => {
  options.type = "info";
  const { finalOptions, evt } = resolveNotifyOptions(options);
  return mountNotify(finalOptions, evt);
};
NotifyFn.warning = (options = {}) => {
  options.type = "warning";
  const { finalOptions, evt } = resolveNotifyOptions(options);
  return mountNotify(finalOptions, evt);
};
NotifyFn.error = (options = {}) => {
  options.type = "error";
  const { finalOptions, evt } = resolveNotifyOptions(options);
  return mountNotify(finalOptions, evt);
};
NotifyFn.success = (options = {}) => {
  options.type = "success";
  const { finalOptions, evt } = resolveNotifyOptions(options);
  return mountNotify(finalOptions, evt);
};
NotifyFn.clear = (inst) => {
  const index = notifyMap[inst.__notify_placement].findIndex((notify) => notify.__notify_index === inst.__notify_index);
  if (index !== -1) {
    notifyMap[inst.__notify_placement].splice(index, 1);
    updatedNotifyByIndex(inst.__notify_placement);
    unmountNotify(inst, ANIMATION_DURATION);
  }
};
NotifyFn.clearAll = () => {
  Object.keys(notifyMap).forEach((instArr) => {
    notifyMap[instArr].forEach((inst) => {
      if (inst) {
        unmountNotify(inst, ANIMATION_DURATION);
      }
    });
    notifyMap[instArr].length = 0;
  });
};
NotifyFn.update = async (inst, options = {}) => {
  inst.$set(Object.assign({}, options));
};
const KNotify = NotifyFn;
const resolveMessageOptions = (options) => {
  const OptionsRes = Object.assign({}, options);
  OptionsRes.title = options.content;
  OptionsRes.placement = "center";
  Reflect.deleteProperty(OptionsRes, "content");
  return OptionsRes;
};
function MsgFn(options = {}) {
  return KNotify(resolveMessageOptions(options));
}
MsgFn.info = (options = {}) => {
  return KNotify.info(resolveMessageOptions(options));
};
MsgFn.warning = (options = {}) => {
  return KNotify.warning(resolveMessageOptions(options));
};
MsgFn.error = (options = {}) => {
  return KNotify.error(resolveMessageOptions(options));
};
MsgFn.success = (options = {}) => {
  return KNotify.success(resolveMessageOptions(options));
};
MsgFn.clear = KNotify.clear;
MsgFn.clearAll = KNotify.clearAll;
MsgFn.update = async (inst, options = {}) => {
  KNotify.update(inst, resolveMessageOptions(options));
};
const KMessage = MsgFn;
const DIRECTION_TYPE = {
  FRONT: "FRONT",
  // scroll up or left
  BEHIND: "BEHIND"
  // scroll down or right
};
const CALC_TYPE = {
  INIT: "INIT",
  FIXED: "FIXED",
  DYNAMIC: "DYNAMIC"
};
const LEADING_BUFFER = 2;
class Virtual {
  constructor(param, callUpdate) {
    this.param = null;
    this.callUpdate = null;
    this.firstRangeTotalSize = 0;
    this.firstRangeAverageSize = 0;
    this.lastCalcIndex = 0;
    this.fixedSizeValue = 0;
    this.calcType = CALC_TYPE.INIT;
    this.offset = 0;
    this.direction = "";
    this.sizes = /* @__PURE__ */ new Map();
    this.range = null;
    this.init(param, callUpdate);
  }
  init(param, callUpdate) {
    this.param = param;
    this.callUpdate = callUpdate;
    this.sizes = /* @__PURE__ */ new Map();
    this.firstRangeTotalSize = 0;
    this.firstRangeAverageSize = 0;
    this.fixedSizeValue = 0;
    this.calcType = CALC_TYPE.INIT;
    this.offset = 0;
    this.direction = "";
    this.range = /* @__PURE__ */ Object.create(null);
    if (param) {
      this.checkRange(0, param.keeps - 1);
    }
  }
  destroy() {
    this.init(null, null);
  }
  // return current render range
  getRange() {
    const range = /* @__PURE__ */ Object.create(null);
    if (this.range) {
      range.start = this.range.start;
      range.end = this.range.end;
      range.padFront = this.range.padFront;
      range.padBehind = this.range.padBehind;
    }
    return range;
  }
  isBehind() {
    return this.direction === DIRECTION_TYPE.BEHIND;
  }
  isFront() {
    return this.direction === DIRECTION_TYPE.FRONT;
  }
  // return start index offset
  getOffset(start2) {
    return (start2 < 1 ? 0 : this.getIndexOffset(start2)) + this.param.slotHeaderSize;
  }
  updateParam(key, value) {
    if (this.param && key in this.param) {
      if (key === "uniqueIds") {
        this.sizes.forEach((v, key2) => {
          if (!value.includes(key2)) {
            this.sizes.delete(key2);
          }
        });
      }
      this.param[key] = value;
    }
  }
  // save each size map by id
  saveSize(id, size) {
    this.sizes.set(id, size);
    if (this.calcType === CALC_TYPE.INIT) {
      this.fixedSizeValue = size;
      this.calcType = CALC_TYPE.FIXED;
    } else if (this.calcType === CALC_TYPE.FIXED && this.fixedSizeValue !== size) {
      this.calcType = CALC_TYPE.DYNAMIC;
      delete this.fixedSizeValue;
    }
    if (this.calcType !== CALC_TYPE.FIXED && this.firstRangeTotalSize !== void 0) {
      if (this.sizes.size < Math.min(this.param.keeps, this.param.uniqueIds.length)) {
        this.firstRangeTotalSize = [...this.sizes.values()].reduce((acc, val) => acc + val, 0);
        this.firstRangeAverageSize = Math.round(this.firstRangeTotalSize / this.sizes.size);
      } else {
        delete this.firstRangeTotalSize;
      }
    }
  }
  // in some special situation (e.g. length change) we need to update in a row
  // try going to render next range by a leading buffer according to current direction
  handleDataSourcesChange() {
    if (this.range) {
      let start2 = this.range.start;
      if (this.isFront()) {
        start2 = start2 - LEADING_BUFFER;
      } else if (this.isBehind()) {
        start2 = start2 + LEADING_BUFFER;
      }
      start2 = Math.max(start2, 0);
      this.updateRange(this.range.start, this.getEndByStart(start2));
    }
  }
  // when slot size change, we also need force update
  handleSlotSizeChange() {
    this.handleDataSourcesChange();
  }
  // calculating range on scroll
  handleScroll(offset2) {
    this.direction = offset2 < this.offset ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND;
    this.offset = offset2;
    if (!this.param) {
      return;
    }
    if (this.direction === DIRECTION_TYPE.FRONT) {
      this.handleFront();
    } else if (this.direction === DIRECTION_TYPE.BEHIND) {
      this.handleBehind();
    }
  }
  // ----------- public method end -----------
  handleFront() {
    if (this.range) {
      const overs = this.getScrollOvers();
      if (overs > this.range.start) {
        return;
      }
      const start2 = Math.max(overs - this.param.buffer, 0);
      this.checkRange(start2, this.getEndByStart(start2));
    }
  }
  handleBehind() {
    if (this.range) {
      const overs = this.getScrollOvers();
      if (overs < this.range.start + this.param.buffer) {
        return;
      }
      this.checkRange(overs, this.getEndByStart(overs));
    }
  }
  // return the pass overs according to current scroll offset
  getScrollOvers() {
    const offset2 = this.offset - this.param.slotHeaderSize;
    if (offset2 <= 0) {
      return 0;
    }
    if (this.isFixedType() && this.fixedSizeValue !== void 0) {
      return Math.floor(offset2 / this.fixedSizeValue);
    }
    let low = 0;
    let middle = 0;
    let middleOffset = 0;
    let high = this.param.uniqueIds.length;
    while (low <= high) {
      middle = low + Math.floor((high - low) / 2);
      middleOffset = this.getIndexOffset(middle);
      if (middleOffset === offset2) {
        return middle;
      } else if (middleOffset < offset2) {
        low = middle + 1;
      } else if (middleOffset > offset2) {
        high = middle - 1;
      }
    }
    return low > 0 ? --low : 0;
  }
  // return a scroll offset from given index, can efficiency be improved more here?
  // although the call frequency is very high, its only a superposition of numbers
  getIndexOffset(givenIndex) {
    if (!givenIndex) {
      return 0;
    }
    let offset2 = 0;
    let indexSize = 0;
    for (let index = 0; index < givenIndex; index++) {
      indexSize = this.sizes.get(this.param.uniqueIds[index]);
      offset2 = offset2 + (indexSize !== void 0 ? indexSize : this.getEstimateSize());
    }
    this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1);
    this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getLastIndex());
    return offset2;
  }
  // is fixed size type
  isFixedType() {
    return this.calcType === CALC_TYPE.FIXED;
  }
  // return the real last index
  getLastIndex() {
    return this.param.uniqueIds.length - 1;
  }
  // in some conditions range is broke, we need correct it
  // and then decide whether need update to next range
  checkRange(start2, end) {
    const keeps = this.param.keeps;
    const total = this.param.uniqueIds.length;
    if (total <= keeps) {
      start2 = 0;
      end = this.getLastIndex();
    } else if (end - start2 < keeps - 1) {
      start2 = end - keeps + 1;
    }
    if (this.range && this.range.start !== start2) {
      this.updateRange(start2, end);
    }
  }
  // setting to a new range and rerender
  updateRange(start2, end) {
    if (this.range) {
      this.range.start = start2;
      this.range.end = end;
      this.range.padFront = this.getPadFront();
      this.range.padBehind = this.getPadBehind();
      this.callUpdate && this.callUpdate(this.getRange());
    }
  }
  // return end base on start
  getEndByStart(start2) {
    const theoryEnd = start2 + this.param.keeps - 1;
    return Math.min(theoryEnd, this.getLastIndex());
  }
  // return total front offset
  getPadFront() {
    if (this.range) {
      if (this.isFixedType() && this.fixedSizeValue !== void 0) {
        return this.fixedSizeValue * this.range.start;
      } else {
        return this.getIndexOffset(this.range.start);
      }
    } else {
      return 0;
    }
  }
  // return total behind offset
  getPadBehind() {
    const end = this.range ? this.range.end : 0;
    const lastIndex = this.getLastIndex();
    if (this.isFixedType() && this.fixedSizeValue !== void 0) {
      return (lastIndex - end) * this.fixedSizeValue;
    }
    if (this.lastCalcIndex === lastIndex) {
      return this.getIndexOffset(lastIndex) - this.getIndexOffset(end);
    } else {
      return (lastIndex - end) * this.getEstimateSize();
    }
  }
  // get the item estimate size
  getEstimateSize() {
    return this.isFixedType() && this.fixedSizeValue !== void 0 ? this.fixedSizeValue : this.firstRangeAverageSize || this.param.estimateSize;
  }
}
function isBrowser() {
  return typeof document !== "undefined";
}
function create_fragment$h(ctx) {
  let div2;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[6].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[5],
    null
  );
  return {
    c() {
      div2 = element("div");
      if (default_slot) default_slot.c();
      attr(
        div2,
        "class",
        /*prefixCls*/
        ctx[2]
      );
      attr(
        div2,
        "data-kv-key",
        /*uniqueKey*/
        ctx[0]
      );
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if (default_slot) {
        default_slot.m(div2, null);
      }
      ctx[7](div2);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        32)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[5],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[5]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[5],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*uniqueKey*/
      1) {
        attr(
          div2,
          "data-kv-key",
          /*uniqueKey*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (default_slot) default_slot.d(detaching);
      ctx[7](null);
    }
  };
}
function instance$e($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { horizontal = false } = $$props;
  let { uniqueKey = "" } = $$props;
  let { type: type3 = "item" } = $$props;
  let resizeObserver = null;
  let itemDiv = null;
  let previousSize;
  const dispatch2 = createEventDispatcher();
  const shapeKey = horizontal ? "offsetWidth" : "offsetHeight";
  onMount(() => {
    if (typeof ResizeObserver !== "undefined" && itemDiv) {
      resizeObserver = new ResizeObserver(dispatchSizeChange);
      resizeObserver.observe(itemDiv);
    }
  });
  afterUpdate(dispatchSizeChange);
  onDestroy(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  });
  function dispatchSizeChange() {
    const size = itemDiv ? itemDiv[shapeKey] : 0;
    if (size === previousSize) return;
    previousSize = size;
    dispatch2("resize", { id: uniqueKey, size, type: type3 });
  }
  const prefixCls = getPrefixCls("virtual-list--item");
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      itemDiv = $$value;
      $$invalidate(1, itemDiv);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("horizontal" in $$props2) $$invalidate(3, horizontal = $$props2.horizontal);
    if ("uniqueKey" in $$props2) $$invalidate(0, uniqueKey = $$props2.uniqueKey);
    if ("type" in $$props2) $$invalidate(4, type3 = $$props2.type);
    if ("$$scope" in $$props2) $$invalidate(5, $$scope = $$props2.$$scope);
  };
  return [uniqueKey, itemDiv, prefixCls, horizontal, type3, $$scope, slots, div_binding];
}
let Item$1 = class Item extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$e, create_fragment$h, safe_not_equal, { horizontal: 3, uniqueKey: 0, type: 4 });
  }
};
const get_footer_slot_changes = (dirty) => ({});
const get_footer_slot_context = (ctx) => ({});
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[46] = list[i];
  child_ctx[48] = i;
  return child_ctx;
}
const get_default_slot_changes$1 = (dirty) => ({
  data: dirty[0] & /*displayItems*/
  8,
  index: dirty[0] & /*displayItems*/
  8
});
const get_default_slot_context$1 = (ctx) => ({
  data: (
    /*dataItem*/
    ctx[46]
  ),
  index: (
    /*dataIndex*/
    ctx[48]
  )
});
const get_header_slot_changes = (dirty) => ({});
const get_header_slot_context = (ctx) => ({});
function create_if_block_1$2(ctx) {
  let item;
  let current;
  item = new Item$1({
    props: {
      type: "slot",
      uniqueKey: "header",
      $$slots: { default: [create_default_slot_2$3] },
      $$scope: { ctx }
    }
  });
  item.$on(
    "resize",
    /*onItemResized*/
    ctx[9]
  );
  return {
    c() {
      create_component(item.$$.fragment);
    },
    m(target, anchor) {
      mount_component(item, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const item_changes = {};
      if (dirty[1] & /*$$scope*/
      16) {
        item_changes.$$scope = { dirty, ctx: ctx2 };
      }
      item.$set(item_changes);
    },
    i(local) {
      if (current) return;
      transition_in(item.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(item.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(item, detaching);
    }
  };
}
function create_default_slot_2$3(ctx) {
  let current;
  const header_slot_template = (
    /*#slots*/
    ctx[32].header
  );
  const header_slot = create_slot(
    header_slot_template,
    ctx,
    /*$$scope*/
    ctx[35],
    get_header_slot_context
  );
  return {
    c() {
      if (header_slot) header_slot.c();
    },
    m(target, anchor) {
      if (header_slot) {
        header_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (header_slot) {
        if (header_slot.p && (!current || dirty[1] & /*$$scope*/
        16)) {
          update_slot_base(
            header_slot,
            header_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[35],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[35]
            ) : get_slot_changes(
              header_slot_template,
              /*$$scope*/
              ctx2[35],
              dirty,
              get_header_slot_changes
            ),
            get_header_slot_context
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(header_slot, local);
      current = true;
    },
    o(local) {
      transition_out(header_slot, local);
      current = false;
    },
    d(detaching) {
      if (header_slot) header_slot.d(detaching);
    }
  };
}
function create_default_slot_1$3(ctx) {
  let t;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[32].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[35],
    get_default_slot_context$1
  );
  return {
    c() {
      if (default_slot) default_slot.c();
      t = space();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      insert(target, t, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty[0] & /*displayItems*/
        8 | dirty[1] & /*$$scope*/
        16)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[35],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[35]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[35],
              dirty,
              get_default_slot_changes$1
            ),
            get_default_slot_context$1
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function create_each_block$1(key_2, ctx) {
  let first;
  let item;
  let current;
  item = new Item$1({
    props: {
      uniqueKey: (
        /*dataItem*/
        ctx[46][
          /*key*/
          ctx[1]
        ]
      ),
      horizontal: (
        /*isHorizontal*/
        ctx[2]
      ),
      type: "item",
      $$slots: { default: [create_default_slot_1$3] },
      $$scope: { ctx }
    }
  });
  item.$on(
    "resize",
    /*onItemResized*/
    ctx[9]
  );
  return {
    key: key_2,
    first: null,
    c() {
      first = empty();
      create_component(item.$$.fragment);
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      mount_component(item, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const item_changes = {};
      if (dirty[0] & /*displayItems, key*/
      10) item_changes.uniqueKey = /*dataItem*/
      ctx[46][
        /*key*/
        ctx[1]
      ];
      if (dirty[0] & /*isHorizontal*/
      4) item_changes.horizontal = /*isHorizontal*/
      ctx[2];
      if (dirty[0] & /*displayItems*/
      8 | dirty[1] & /*$$scope*/
      16) {
        item_changes.$$scope = { dirty, ctx };
      }
      item.$set(item_changes);
    },
    i(local) {
      if (current) return;
      transition_in(item.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(item.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(first);
      }
      destroy_component(item, detaching);
    }
  };
}
function create_if_block$5(ctx) {
  let item;
  let current;
  item = new Item$1({
    props: {
      type: "slot",
      uniqueKey: "footer",
      $$slots: { default: [create_default_slot$4] },
      $$scope: { ctx }
    }
  });
  item.$on(
    "resize",
    /*onItemResized*/
    ctx[9]
  );
  return {
    c() {
      create_component(item.$$.fragment);
    },
    m(target, anchor) {
      mount_component(item, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const item_changes = {};
      if (dirty[1] & /*$$scope*/
      16) {
        item_changes.$$scope = { dirty, ctx: ctx2 };
      }
      item.$set(item_changes);
    },
    i(local) {
      if (current) return;
      transition_in(item.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(item.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(item, detaching);
    }
  };
}
function create_default_slot$4(ctx) {
  let current;
  const footer_slot_template = (
    /*#slots*/
    ctx[32].footer
  );
  const footer_slot = create_slot(
    footer_slot_template,
    ctx,
    /*$$scope*/
    ctx[35],
    get_footer_slot_context
  );
  return {
    c() {
      if (footer_slot) footer_slot.c();
    },
    m(target, anchor) {
      if (footer_slot) {
        footer_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (footer_slot) {
        if (footer_slot.p && (!current || dirty[1] & /*$$scope*/
        16)) {
          update_slot_base(
            footer_slot,
            footer_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[35],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[35]
            ) : get_slot_changes(
              footer_slot_template,
              /*$$scope*/
              ctx2[35],
              dirty,
              get_footer_slot_changes
            ),
            get_footer_slot_context
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(footer_slot, local);
      current = true;
    },
    o(local) {
      transition_out(footer_slot, local);
      current = false;
    },
    d(detaching) {
      if (footer_slot) footer_slot.d(detaching);
    }
  };
}
function create_fragment$g(ctx) {
  let div2;
  let t0;
  let div0;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t1;
  let t2;
  let div1;
  let current;
  let mounted;
  let dispose;
  let if_block0 = (
    /*$$slots*/
    ctx[13].header && create_if_block_1$2(ctx)
  );
  let each_value = ensure_array_like(
    /*displayItems*/
    ctx[3]
  );
  const get_key = (ctx2) => (
    /*dataItem*/
    ctx2[46][
      /*key*/
      ctx2[1]
    ]
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$1(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
  }
  let if_block1 = (
    /*$$slots*/
    ctx[13].footer && create_if_block$5(ctx)
  );
  let div2_levels = [
    { class: (
      /*cnames*/
      ctx[8]
    ) },
    /*$$restProps*/
    ctx[12],
    /*attrs*/
    ctx[0],
    { style: (
      /*containerStyle*/
      ctx[11]
    ) }
  ];
  let div_data_2 = {};
  for (let i = 0; i < div2_levels.length; i += 1) {
    div_data_2 = assign(div_data_2, div2_levels[i]);
  }
  return {
    c() {
      div2 = element("div");
      if (if_block0) if_block0.c();
      t0 = space();
      div0 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t1 = space();
      if (if_block1) if_block1.c();
      t2 = space();
      div1 = element("div");
      attr(
        div0,
        "class",
        /*wrapperCls*/
        ctx[7]
      );
      set_style(
        div0,
        "padding",
        /*paddingStyle*/
        ctx[4]
      );
      attr(div1, "class", "shepherd");
      set_style(
        div1,
        "width",
        /*isHorizontal*/
        ctx[2] ? "0px" : "100%"
      );
      set_style(
        div1,
        "height",
        /*isHorizontal*/
        ctx[2] ? "100%" : "0px"
      );
      set_attributes(div2, div_data_2);
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if (if_block0) if_block0.m(div2, null);
      append(div2, t0);
      append(div2, div0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div0, null);
        }
      }
      append(div2, t1);
      if (if_block1) if_block1.m(div2, null);
      append(div2, t2);
      append(div2, div1);
      ctx[33](div1);
      ctx[34](div2);
      current = true;
      if (!mounted) {
        dispose = listen(
          div2,
          "scroll",
          /*onScroll*/
          ctx[10]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (
        /*$$slots*/
        ctx2[13].header
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty[0] & /*$$slots*/
          8192) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$2(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div2, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (dirty[0] & /*displayItems, key, isHorizontal, onItemResized*/
      526 | dirty[1] & /*$$scope*/
      16) {
        each_value = ensure_array_like(
          /*displayItems*/
          ctx2[3]
        );
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
        check_outros();
      }
      if (!current || dirty[0] & /*wrapperCls*/
      128) {
        attr(
          div0,
          "class",
          /*wrapperCls*/
          ctx2[7]
        );
      }
      if (dirty[0] & /*paddingStyle*/
      16) {
        set_style(
          div0,
          "padding",
          /*paddingStyle*/
          ctx2[4]
        );
      }
      if (
        /*$$slots*/
        ctx2[13].footer
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & /*$$slots*/
          8192) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$5(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div2, t2);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (dirty[0] & /*isHorizontal*/
      4) {
        set_style(
          div1,
          "width",
          /*isHorizontal*/
          ctx2[2] ? "0px" : "100%"
        );
      }
      if (dirty[0] & /*isHorizontal*/
      4) {
        set_style(
          div1,
          "height",
          /*isHorizontal*/
          ctx2[2] ? "100%" : "0px"
        );
      }
      set_attributes(div2, div_data_2 = get_spread_update(div2_levels, [
        (!current || dirty[0] & /*cnames*/
        256) && { class: (
          /*cnames*/
          ctx2[8]
        ) },
        dirty[0] & /*$$restProps*/
        4096 && /*$$restProps*/
        ctx2[12],
        dirty[0] & /*attrs*/
        1 && /*attrs*/
        ctx2[0],
        { style: (
          /*containerStyle*/
          ctx2[11]
        ) }
      ]));
    },
    i(local) {
      if (current) return;
      transition_in(if_block0);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (if_block0) if_block0.d();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      if (if_block1) if_block1.d();
      ctx[33](null);
      ctx[34](null);
      mounted = false;
      dispose();
    }
  };
}
function instance$d($$self, $$props, $$invalidate) {
  let cnames;
  let wrapperCls;
  const omit_props_names = [
    "cls",
    "attrs",
    "key",
    "data",
    "keeps",
    "estimateSize",
    "isHorizontal",
    "start",
    "offset",
    "topThreshold",
    "bottomThreshold",
    "getSize",
    "getSizes",
    "getOffset",
    "getClientSize",
    "getScrollSize",
    "updatePageModeFront",
    "scrollToOffset",
    "scrollToIndex",
    "scrollToBottom"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const $$slots = compute_slots(slots);
  let { cls = void 0 } = $$props;
  let { attrs = {} } = $$props;
  let { key = "id" } = $$props;
  let { data } = $$props;
  let { keeps = 30 } = $$props;
  let { estimateSize = 10 } = $$props;
  let { isHorizontal = false } = $$props;
  let { start: start2 = 0 } = $$props;
  let { offset: offset2 = 0 } = $$props;
  let { topThreshold = 0 } = $$props;
  let { bottomThreshold = 0 } = $$props;
  let displayItems = [];
  let paddingStyle = void 0;
  let directionKey = isHorizontal ? "scrollLeft" : "scrollTop";
  let range = null;
  let virtual = new Virtual(
    {
      slotHeaderSize: 0,
      slotFooterSize: 0,
      keeps,
      estimateSize,
      buffer: Math.round(keeps / 3),
      // recommend for a third of keeps
      uniqueIds: getUniqueIdFromDataSources()
    },
    onRangeChanged
  );
  let root = null;
  let shepherd = null;
  const dispatch2 = createEventDispatcher();
  function getSize(id) {
    return virtual.sizes.get(id);
  }
  function getSizes() {
    return virtual.sizes.size;
  }
  function getOffset() {
    return root ? Math.ceil(root[directionKey]) : 0;
  }
  function getClientSize() {
    const key2 = isHorizontal ? "clientWidth" : "clientHeight";
    return root ? Math.ceil(root[key2]) : 0;
  }
  function getScrollSize() {
    const key2 = isHorizontal ? "scrollWidth" : "scrollHeight";
    return root ? Math.ceil(root[key2]) : 0;
  }
  function updatePageModeFront() {
    if (root && isBrowser()) {
      const rect = root.getBoundingClientRect();
      const { defaultView } = root.ownerDocument;
      if (defaultView) {
        const offsetFront = isHorizontal ? rect.left + defaultView.pageXOffset : rect.top + defaultView.pageYOffset;
        virtual.updateParam("slotHeaderSize", offsetFront);
      }
    }
  }
  function scrollToOffset(offset22) {
    if (!isBrowser()) return;
    if (root) {
      $$invalidate(5, root[directionKey] = offset22, root);
    }
  }
  function scrollToIndex(index) {
    if (index >= data.length - 1) {
      scrollToBottom();
    } else {
      const offset22 = virtual.getOffset(index);
      scrollToOffset(offset22);
    }
  }
  function scrollToBottom() {
    if (shepherd) {
      const offset22 = shepherd[isHorizontal ? "offsetLeft" : "offsetTop"];
      scrollToOffset(offset22);
      setTimeout(
        () => {
          if (getOffset() + getClientSize() + 1 < getScrollSize()) {
            scrollToBottom();
          }
        },
        3
      );
    }
  }
  onMount(async () => {
    await tick();
    if (start2) {
      scrollToIndex(start2);
    } else if (offset2) {
      scrollToOffset(offset2);
    }
  });
  onDestroy(() => {
    virtual.destroy();
  });
  function getUniqueIdFromDataSources() {
    return data.map((dataSource) => dataSource[key]);
  }
  function onItemResized(event) {
    const { id, size, type: type3 } = event.detail;
    if (type3 === "item") virtual.saveSize(id, size);
    else if (type3 === "slot") {
      if (id === "header") virtual.updateParam("slotHeaderSize", size);
      else if (id === "footer") virtual.updateParam("slotFooterSize", size);
    }
  }
  function onRangeChanged(_range) {
    range = _range;
    $$invalidate(4, paddingStyle = $$invalidate(4, paddingStyle = isHorizontal ? `0px ${range.padBehind}px 0px ${range.padFront}px` : `${range.padFront}px 0px ${range.padBehind}px`));
    $$invalidate(3, displayItems = data.slice(range.start, range.end + 1));
  }
  function onScroll(event) {
    const offset22 = getOffset();
    const clientSize = getClientSize();
    const scrollSize = getScrollSize();
    if (offset22 < 0 || offset22 + clientSize > scrollSize || !scrollSize) {
      return;
    }
    virtual.handleScroll(offset22);
    emitEvent(offset22, clientSize, scrollSize, event);
  }
  function emitEvent(offset22, clientSize, scrollSize, event) {
    dispatch2("scroll", { event, range: virtual.getRange() });
    if (virtual.isFront() && !!data.length && offset22 - topThreshold <= 0) {
      dispatch2("top");
    } else if (virtual.isBehind() && offset22 + clientSize + bottomThreshold >= scrollSize) {
      dispatch2("bottom");
    }
  }
  function handleKeepsChange(keeps2) {
    virtual.updateParam("keeps", keeps2);
    virtual.handleSlotSizeChange();
  }
  let oData = data;
  async function handleDataSourcesChange() {
    virtual.updateParam("uniqueIds", getUniqueIdFromDataSources());
    virtual.handleDataSourcesChange();
  }
  const prefixCls = getPrefixCls("virtual-list");
  const containerStyle = `overflow-y: auto; height: inherit; ${genCSSVariable(scrollDefaultProps)}`;
  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      shepherd = $$value;
      $$invalidate(6, shepherd);
    });
  }
  function div2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      root = $$value;
      $$invalidate(5, root);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("cls" in $$new_props) $$invalidate(14, cls = $$new_props.cls);
    if ("attrs" in $$new_props) $$invalidate(0, attrs = $$new_props.attrs);
    if ("key" in $$new_props) $$invalidate(1, key = $$new_props.key);
    if ("data" in $$new_props) $$invalidate(15, data = $$new_props.data);
    if ("keeps" in $$new_props) $$invalidate(16, keeps = $$new_props.keeps);
    if ("estimateSize" in $$new_props) $$invalidate(17, estimateSize = $$new_props.estimateSize);
    if ("isHorizontal" in $$new_props) $$invalidate(2, isHorizontal = $$new_props.isHorizontal);
    if ("start" in $$new_props) $$invalidate(18, start2 = $$new_props.start);
    if ("offset" in $$new_props) $$invalidate(19, offset2 = $$new_props.offset);
    if ("topThreshold" in $$new_props) $$invalidate(20, topThreshold = $$new_props.topThreshold);
    if ("bottomThreshold" in $$new_props) $$invalidate(21, bottomThreshold = $$new_props.bottomThreshold);
    if ("$$scope" in $$new_props) $$invalidate(35, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*offset*/
    524288) {
      scrollToOffset(offset2);
    }
    if ($$self.$$.dirty[0] & /*start*/
    262144) {
      scrollToIndex(start2);
    }
    if ($$self.$$.dirty[0] & /*keeps*/
    65536) {
      handleKeepsChange(keeps);
    }
    if ($$self.$$.dirty[0] & /*data*/
    32768 | $$self.$$.dirty[1] & /*oData*/
    1) {
      if (oData !== data) {
        handleDataSourcesChange();
        $$invalidate(31, oData = data);
      }
    }
    if ($$self.$$.dirty[0] & /*isHorizontal, cls*/
    16388) {
      $$invalidate(8, cnames = clsx(prefixCls, { [`${prefixCls}--base`]: isHorizontal }, "k-scrollbar", cls));
    }
    if ($$self.$$.dirty[0] & /*isHorizontal*/
    4) {
      $$invalidate(7, wrapperCls = clsx({ [`${prefixCls}--wrapper`]: isHorizontal }));
    }
  };
  handleDataSourcesChange();
  return [
    attrs,
    key,
    isHorizontal,
    displayItems,
    paddingStyle,
    root,
    shepherd,
    wrapperCls,
    cnames,
    onItemResized,
    onScroll,
    containerStyle,
    $$restProps,
    $$slots,
    cls,
    data,
    keeps,
    estimateSize,
    start2,
    offset2,
    topThreshold,
    bottomThreshold,
    getSize,
    getSizes,
    getOffset,
    getClientSize,
    getScrollSize,
    updatePageModeFront,
    scrollToOffset,
    scrollToIndex,
    scrollToBottom,
    oData,
    slots,
    div1_binding,
    div2_binding,
    $$scope
  ];
}
let Dist$4 = class Dist9 extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$d,
      create_fragment$g,
      safe_not_equal,
      {
        cls: 14,
        attrs: 0,
        key: 1,
        data: 15,
        keeps: 16,
        estimateSize: 17,
        isHorizontal: 2,
        start: 18,
        offset: 19,
        topThreshold: 20,
        bottomThreshold: 21,
        getSize: 22,
        getSizes: 23,
        getOffset: 24,
        getClientSize: 25,
        getScrollSize: 26,
        updatePageModeFront: 27,
        scrollToOffset: 28,
        scrollToIndex: 29,
        scrollToBottom: 30
      },
      null,
      [-1, -1]
    );
  }
  get getSize() {
    return this.$$.ctx[22];
  }
  get getSizes() {
    return this.$$.ctx[23];
  }
  get getOffset() {
    return this.$$.ctx[24];
  }
  get getClientSize() {
    return this.$$.ctx[25];
  }
  get getScrollSize() {
    return this.$$.ctx[26];
  }
  get updatePageModeFront() {
    return this.$$.ctx[27];
  }
  get scrollToOffset() {
    return this.$$.ctx[28];
  }
  get scrollToIndex() {
    return this.$$.ctx[29];
  }
  get scrollToBottom() {
    return this.$$.ctx[30];
  }
};
function fallback_block$2(ctx) {
  let option;
  let t;
  let option_class_value;
  let option_value_value;
  let mounted;
  let dispose;
  let option_levels = [
    {
      class: option_class_value = `${/*cnames*/
      ctx[3]} ${/*activeCls*/
      ctx[2]}`
    },
    /*$$restProps*/
    ctx[5],
    /*attrs*/
    ctx[1],
    {
      __value: option_value_value = "\n		" + /*label*/
      ctx[0] + "\n	"
    }
  ];
  let option_data = {};
  for (let i = 0; i < option_levels.length; i += 1) {
    option_data = assign(option_data, option_levels[i]);
  }
  return {
    c() {
      option = element("option");
      t = text(
        /*label*/
        ctx[0]
      );
      set_attributes(option, option_data);
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
      if (!mounted) {
        dispose = listen(
          option,
          "click",
          /*handleClick*/
          ctx[4]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*label*/
      1) set_data_maybe_contenteditable(
        t,
        /*label*/
        ctx2[0],
        option_data["contenteditable"]
      );
      set_attributes(option, option_data = get_spread_update(option_levels, [
        dirty & /*cnames, activeCls*/
        12 && option_class_value !== (option_class_value = `${/*cnames*/
        ctx2[3]} ${/*activeCls*/
        ctx2[2]}`) && { class: option_class_value },
        dirty & /*$$restProps*/
        32 && /*$$restProps*/
        ctx2[5],
        dirty & /*attrs*/
        2 && /*attrs*/
        ctx2[1],
        dirty & /*label*/
        1 && option_value_value !== (option_value_value = "\n		" + /*label*/
        ctx2[0] + "\n	") && { __value: option_value_value }
      ]));
    },
    d(detaching) {
      if (detaching) {
        detach(option);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$f(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[11].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[10],
    null
  );
  const default_slot_or_fallback = default_slot || fallback_block$2(ctx);
  return {
    c() {
      if (default_slot_or_fallback) default_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (default_slot_or_fallback) {
        default_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        1024)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[10],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[10]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[10],
              dirty,
              null
            ),
            null
          );
        }
      } else {
        if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*cnames, activeCls, $$restProps, attrs, label*/
        47)) {
          default_slot_or_fallback.p(ctx2, !current ? -1 : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    }
  };
}
function instance$c($$self, $$props, $$invalidate) {
  let cnames;
  let activeCls;
  const omit_props_names = ["label", "cls", "disabled", "isActive", "attrs", "fitInputWidth"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { label = "" } = $$props;
  let { cls = void 0 } = $$props;
  let { disabled = false } = $$props;
  let { isActive = false } = $$props;
  let { attrs = {} } = $$props;
  let { fitInputWidth = false } = $$props;
  const dispatch2 = createEventDispatcher();
  const handleClick = () => {
    if (disabled) return;
    dispatch2("click");
  };
  const prefixCls = getPrefixCls("select--option");
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("label" in $$new_props) $$invalidate(0, label = $$new_props.label);
    if ("cls" in $$new_props) $$invalidate(6, cls = $$new_props.cls);
    if ("disabled" in $$new_props) $$invalidate(7, disabled = $$new_props.disabled);
    if ("isActive" in $$new_props) $$invalidate(8, isActive = $$new_props.isActive);
    if ("attrs" in $$new_props) $$invalidate(1, attrs = $$new_props.attrs);
    if ("fitInputWidth" in $$new_props) $$invalidate(9, fitInputWidth = $$new_props.fitInputWidth);
    if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*disabled, fitInputWidth, cls*/
    704) {
      $$invalidate(3, cnames = clsx(
        `${prefixCls}`,
        `${prefixCls}__dark`,
        `${prefixCls}__hover`,
        {
          [`${prefixCls}--base__disabled__dark`]: disabled,
          [`${prefixCls}__fit`]: fitInputWidth
        },
        cls
      ));
    }
    if ($$self.$$.dirty & /*isActive*/
    256) {
      $$invalidate(2, activeCls = isActive ? `${prefixCls}__active` : "");
    }
  };
  return [
    label,
    attrs,
    activeCls,
    cnames,
    handleClick,
    $$restProps,
    cls,
    disabled,
    isActive,
    fitInputWidth,
    $$scope,
    slots
  ];
}
class Option extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$c, create_fragment$f, safe_not_equal, {
      label: 0,
      cls: 6,
      disabled: 7,
      isActive: 8,
      attrs: 1,
      fitInputWidth: 9
    });
  }
}
const get_suffix_slot_changes = (dirty) => ({});
const get_suffix_slot_context = (ctx) => ({});
const get_prefix_slot_changes = (dirty) => ({});
const get_prefix_slot_context = (ctx) => ({});
const get_default_slot_changes = (dirty) => ({
  data: dirty[2] & /*data*/
  2048,
  label: dirty[2] & /*data*/
  2048,
  isActive: dirty[2] & /*data*/
  2048
});
const get_default_slot_context = (ctx) => ({
  data: (
    /*data*/
    ctx[73]
  ),
  onSelect: (
    /*handleSelect*/
    ctx[26]
  ),
  label: (
    /*getLabel*/
    ctx[28](
      /*data*/
      ctx[73]
    )
  ),
  isActive: (
    /*isActive*/
    ctx[29](
      /*data*/
      ctx[73]
    )
  )
});
function create_if_block_4$1(ctx) {
  let i;
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      icon: (
        /*iconPrefix*/
        ctx[1]
      ),
      cls: (
        /*prefixIconCls*/
        ctx[35]
      ),
      width: "auto",
      height: "auto"
    }
  });
  return {
    c() {
      i = element("i");
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      insert(target, i, anchor);
      mount_component(kicon, i, null);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*iconPrefix*/
      2) kicon_changes.icon = /*iconPrefix*/
      ctx2[1];
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(i);
      }
      destroy_component(kicon);
    }
  };
}
function fallback_block_1$1(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*iconPrefix*/
    ctx[1] && create_if_block_4$1(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*iconPrefix*/
        ctx2[1]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*iconPrefix*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_4$1(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_if_block_3$1(ctx) {
  let i;
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      icon: (
        /*iconSuffix*/
        ctx[2]
      ),
      cls: (
        /*suffixIconCls*/
        ctx[36]
      ),
      width: "auto",
      height: "auto"
    }
  });
  return {
    c() {
      i = element("i");
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      insert(target, i, anchor);
      mount_component(kicon, i, null);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*iconSuffix*/
      4) kicon_changes.icon = /*iconSuffix*/
      ctx2[2];
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(i);
      }
      destroy_component(kicon);
    }
  };
}
function fallback_block$1(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*iconSuffix*/
    ctx[2] && create_if_block_3$1(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*iconSuffix*/
        ctx2[2]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*iconSuffix*/
          4) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_3$1(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_else_block_2$1(ctx) {
  let i;
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      icon: (
        /*expendIcon*/
        ctx[19]
      ),
      cls: (
        /*selectIconCls*/
        ctx[37]
      ),
      width: "auto",
      height: "auto"
    }
  });
  return {
    c() {
      i = element("i");
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      insert(target, i, anchor);
      mount_component(kicon, i, null);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*expendIcon*/
      524288) kicon_changes.icon = /*expendIcon*/
      ctx2[19];
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(i);
      }
      destroy_component(kicon);
    }
  };
}
function create_if_block_2$1(ctx) {
  let button;
  let kicon;
  let current;
  let mounted;
  let dispose;
  kicon = new Dist$c({
    props: {
      icon: "i-carbon-close-outline",
      cls: (
        /*selectIconCls*/
        ctx[37]
      ),
      width: "auto",
      height: "auto"
    }
  });
  return {
    c() {
      button = element("button");
      create_component(kicon.$$.fragment);
      attr(button, "data-k-select-clear", "");
      attr(
        button,
        "class",
        /*clearIconCls*/
        ctx[34]
      );
    },
    m(target, anchor) {
      insert(target, button, anchor);
      mount_component(kicon, button, null);
      current = true;
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*handleClear*/
          ctx[31]
        );
        mounted = true;
      }
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      destroy_component(kicon);
      mounted = false;
      dispose();
    }
  };
}
function create_triggerEl_slot$2(ctx) {
  let div2;
  let t0;
  let input;
  let input_readonly_value;
  let input_value_value;
  let t1;
  let t2;
  let current_block_type_index;
  let if_block;
  let current;
  let mounted;
  let dispose;
  const prefix_slot_template = (
    /*#slots*/
    ctx[51].prefix
  );
  const prefix_slot = create_slot(
    prefix_slot_template,
    ctx,
    /*$$scope*/
    ctx[59],
    get_prefix_slot_context
  );
  const prefix_slot_or_fallback = prefix_slot || fallback_block_1$1(ctx);
  const suffix_slot_template = (
    /*#slots*/
    ctx[51].suffix
  );
  const suffix_slot = create_slot(
    suffix_slot_template,
    ctx,
    /*$$scope*/
    ctx[59],
    get_suffix_slot_context
  );
  const suffix_slot_or_fallback = suffix_slot || fallback_block$1(ctx);
  const if_block_creators = [create_if_block_2$1, create_else_block_2$1];
  const if_blocks = [];
  function select_block_type_2(ctx2, dirty) {
    if (
      /*clearable*/
      ctx2[9] && /*isShowClear*/
      ctx2[17]
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type_2(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let div_levels = [
    /*attrs*/
    ctx[5],
    { class: (
      /*cnames*/
      ctx[25]
    ) },
    { slot: "triggerEl" },
    { role: "button" },
    { tabindex: "-1" }
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div2 = element("div");
      if (prefix_slot_or_fallback) prefix_slot_or_fallback.c();
      t0 = space();
      input = element("input");
      t1 = space();
      if (suffix_slot_or_fallback) suffix_slot_or_fallback.c();
      t2 = space();
      if_block.c();
      attr(
        input,
        "class",
        /*selectCls*/
        ctx[24]
      );
      input.readOnly = input_readonly_value = !/*remote*/
      ctx[10];
      input.value = input_value_value = /*getLabel*/
      ctx[28](
        /*value*/
        ctx[0]
      );
      input.disabled = /*disabledInner*/
      ctx[11];
      attr(
        input,
        "placeholder",
        /*placeholder*/
        ctx[4]
      );
      set_attributes(div2, div_data);
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if (prefix_slot_or_fallback) {
        prefix_slot_or_fallback.m(div2, null);
      }
      append(div2, t0);
      append(div2, input);
      append(div2, t1);
      if (suffix_slot_or_fallback) {
        suffix_slot_or_fallback.m(div2, null);
      }
      append(div2, t2);
      if_blocks[current_block_type_index].m(div2, null);
      ctx[57](div2);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            input,
            "input",
            /*remoteSearch*/
            ctx[33]
          ),
          listen(
            div2,
            "mouseenter",
            /*mouseenter_handler*/
            ctx[55]
          ),
          listen(
            div2,
            "mouseleave",
            /*mouseleave_handler*/
            ctx[56]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (prefix_slot) {
        if (prefix_slot.p && (!current || dirty[1] & /*$$scope*/
        268435456)) {
          update_slot_base(
            prefix_slot,
            prefix_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[59],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[59]
            ) : get_slot_changes(
              prefix_slot_template,
              /*$$scope*/
              ctx2[59],
              dirty,
              get_prefix_slot_changes
            ),
            get_prefix_slot_context
          );
        }
      } else {
        if (prefix_slot_or_fallback && prefix_slot_or_fallback.p && (!current || dirty[0] & /*iconPrefix*/
        2)) {
          prefix_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (!current || dirty[0] & /*selectCls*/
      16777216) {
        attr(
          input,
          "class",
          /*selectCls*/
          ctx2[24]
        );
      }
      if (!current || dirty[0] & /*remote*/
      1024 && input_readonly_value !== (input_readonly_value = !/*remote*/
      ctx2[10])) {
        input.readOnly = input_readonly_value;
      }
      if (!current || dirty[0] & /*value*/
      1 && input_value_value !== (input_value_value = /*getLabel*/
      ctx2[28](
        /*value*/
        ctx2[0]
      )) && input.value !== input_value_value) {
        input.value = input_value_value;
      }
      if (!current || dirty[0] & /*disabledInner*/
      2048) {
        input.disabled = /*disabledInner*/
        ctx2[11];
      }
      if (!current || dirty[0] & /*placeholder*/
      16) {
        attr(
          input,
          "placeholder",
          /*placeholder*/
          ctx2[4]
        );
      }
      if (suffix_slot) {
        if (suffix_slot.p && (!current || dirty[1] & /*$$scope*/
        268435456)) {
          update_slot_base(
            suffix_slot,
            suffix_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[59],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[59]
            ) : get_slot_changes(
              suffix_slot_template,
              /*$$scope*/
              ctx2[59],
              dirty,
              get_suffix_slot_changes
            ),
            get_suffix_slot_context
          );
        }
      } else {
        if (suffix_slot_or_fallback && suffix_slot_or_fallback.p && (!current || dirty[0] & /*iconSuffix*/
        4)) {
          suffix_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_2(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div2, null);
      }
      set_attributes(div2, div_data = get_spread_update(div_levels, [
        dirty[0] & /*attrs*/
        32 && /*attrs*/
        ctx2[5],
        (!current || dirty[0] & /*cnames*/
        33554432) && { class: (
          /*cnames*/
          ctx2[25]
        ) },
        { slot: "triggerEl" },
        { role: "button" },
        { tabindex: "-1" }
      ]));
    },
    i(local) {
      if (current) return;
      transition_in(prefix_slot_or_fallback, local);
      transition_in(suffix_slot_or_fallback, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(prefix_slot_or_fallback, local);
      transition_out(suffix_slot_or_fallback, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (prefix_slot_or_fallback) prefix_slot_or_fallback.d(detaching);
      if (suffix_slot_or_fallback) suffix_slot_or_fallback.d(detaching);
      if_blocks[current_block_type_index].d();
      ctx[57](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_else_block_1$1(ctx) {
  let p;
  let t;
  return {
    c() {
      p = element("p");
      t = text(
        /*text*/
        ctx[23]
      );
      attr(
        p,
        "class",
        /*noDataCls*/
        ctx[38]
      );
    },
    m(target, anchor) {
      insert(target, p, anchor);
      append(p, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*text*/
      8388608) set_data(
        t,
        /*text*/
        ctx2[23]
      );
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(p);
      }
    }
  };
}
function create_if_block$4(ctx) {
  let kvirtuallist;
  let current;
  let kvirtuallist_props = {
    data: (
      /*dataListInner*/
      ctx[12]
    ),
    key: (
      /*key*/
      ctx[6]
    ),
    estimateSize: (
      /*dataListInner*/
      ctx[12].length
    ),
    $$slots: {
      default: [
        create_default_slot$3,
        ({ data }) => ({ 73: data }),
        ({ data }) => [0, 0, data ? 2048 : 0]
      ]
    },
    $$scope: { ctx }
  };
  kvirtuallist = new Dist$4({ props: kvirtuallist_props });
  ctx[53](kvirtuallist);
  return {
    c() {
      create_component(kvirtuallist.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kvirtuallist, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kvirtuallist_changes = {};
      if (dirty[0] & /*dataListInner*/
      4096) kvirtuallist_changes.data = /*dataListInner*/
      ctx2[12];
      if (dirty[0] & /*key*/
      64) kvirtuallist_changes.key = /*key*/
      ctx2[6];
      if (dirty[0] & /*dataListInner*/
      4096) kvirtuallist_changes.estimateSize = /*dataListInner*/
      ctx2[12].length;
      if (dirty[0] & /*fitInputWidth*/
      128 | dirty[1] & /*$$scope, $$slots*/
      268435712 | dirty[2] & /*data*/
      2048) {
        kvirtuallist_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kvirtuallist.$set(kvirtuallist_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kvirtuallist.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kvirtuallist.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[53](null);
      destroy_component(kvirtuallist, detaching);
    }
  };
}
function create_else_block$2(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[51].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[59],
    get_default_slot_context
  );
  return {
    c() {
      if (default_slot) default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & /*$$scope*/
        268435456 | dirty[2] & /*data*/
        2048)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[59],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[59]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[59],
              dirty,
              get_default_slot_changes
            ),
            get_default_slot_context
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function create_if_block_1$1(ctx) {
  let koption;
  let current;
  function click_handler() {
    return (
      /*click_handler*/
      ctx[52](
        /*data*/
        ctx[73]
      )
    );
  }
  koption = new Option({
    props: {
      fitInputWidth: (
        /*fitInputWidth*/
        ctx[7]
      ),
      label: (
        /*getLabel*/
        ctx[28](
          /*data*/
          ctx[73]
        )
      ),
      isActive: (
        /*isActive*/
        ctx[29](
          /*data*/
          ctx[73]
        )
      )
    }
  });
  koption.$on("click", click_handler);
  return {
    c() {
      create_component(koption.$$.fragment);
    },
    m(target, anchor) {
      mount_component(koption, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const koption_changes = {};
      if (dirty[0] & /*fitInputWidth*/
      128) koption_changes.fitInputWidth = /*fitInputWidth*/
      ctx[7];
      if (dirty[2] & /*data*/
      2048) koption_changes.label = /*getLabel*/
      ctx[28](
        /*data*/
        ctx[73]
      );
      if (dirty[2] & /*data*/
      2048) koption_changes.isActive = /*isActive*/
      ctx[29](
        /*data*/
        ctx[73]
      );
      koption.$set(koption_changes);
    },
    i(local) {
      if (current) return;
      transition_in(koption.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(koption.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(koption, detaching);
    }
  };
}
function create_default_slot$3(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_1$1, create_else_block$2];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (!/*$$slots*/
    ctx2[39].default) return 0;
    return 1;
  }
  current_block_type_index = select_block_type_1(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_1(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function create_contentEl_slot$2(ctx) {
  let div2;
  let current_block_type_index;
  let if_block;
  let current;
  const if_block_creators = [create_if_block$4, create_else_block_1$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*dataListInner*/
      ctx2[12].length > 0
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      div2 = element("div");
      if_block.c();
      attr(div2, "slot", "contentEl");
      set_style(div2, "overflow-y", `auto`);
      set_style(
        div2,
        "width",
        /*popoverWidth*/
        ctx[15]
      );
      set_style(
        div2,
        "min-width",
        /*triggerWidth*/
        ctx[16]
      );
      set_style(
        div2,
        "height",
        /*heightInner*/
        ctx[22]
      );
      set_style(div2, "max-height", `${/*maxHeight*/
      ctx[8]}px`);
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if_blocks[current_block_type_index].m(div2, null);
      ctx[54](div2);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div2, null);
      }
      if (dirty[0] & /*popoverWidth*/
      32768) {
        set_style(
          div2,
          "width",
          /*popoverWidth*/
          ctx2[15]
        );
      }
      if (dirty[0] & /*triggerWidth*/
      65536) {
        set_style(
          div2,
          "min-width",
          /*triggerWidth*/
          ctx2[16]
        );
      }
      if (dirty[0] & /*heightInner*/
      4194304) {
        set_style(
          div2,
          "height",
          /*heightInner*/
          ctx2[22]
        );
      }
      if (dirty[0] & /*maxHeight*/
      256) {
        set_style(div2, "max-height", `${/*maxHeight*/
        ctx2[8]}px`);
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if_blocks[current_block_type_index].d();
      ctx[54](null);
    }
  };
}
function create_fragment$e(ctx) {
  let kpopover;
  let current;
  let mounted;
  let dispose;
  let kpopover_props = {
    trigger: "click",
    disabled: (
      /*isDisabledPopover*/
      ctx[18]
    ),
    clsTrigger: (
      /*cls*/
      ctx[3]
    ),
    cls: "px-0",
    arrow: false,
    width: (
      /*triggerWidth*/
      ctx[16]
    ),
    placement: "bottom",
    $$slots: {
      contentEl: [create_contentEl_slot$2],
      triggerEl: [create_triggerEl_slot$2]
    },
    $$scope: { ctx }
  };
  kpopover = new Dist$b({ props: kpopover_props });
  ctx[58](kpopover);
  kpopover.$on(
    "change",
    /*onOpen*/
    ctx[32]
  );
  return {
    c() {
      create_component(kpopover.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kpopover, target, anchor);
      current = true;
      if (!mounted) {
        dispose = listen(
          window,
          "resize",
          /*setPopoverW*/
          ctx[27]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      const kpopover_changes = {};
      if (dirty[0] & /*isDisabledPopover*/
      262144) kpopover_changes.disabled = /*isDisabledPopover*/
      ctx2[18];
      if (dirty[0] & /*cls*/
      8) kpopover_changes.clsTrigger = /*cls*/
      ctx2[3];
      if (dirty[0] & /*triggerWidth*/
      65536) kpopover_changes.width = /*triggerWidth*/
      ctx2[16];
      if (dirty[0] & /*popoverModalRef, popoverWidth, triggerWidth, heightInner, maxHeight, dataListInner, key, vListRef, fitInputWidth, text, attrs, cnames, inputSelectRef, clearable, isShowClear, expendIcon, iconSuffix, selectCls, remote, value, disabledInner, placeholder, iconPrefix*/
      66838519 | dirty[1] & /*$$scope, $$slots*/
      268435712) {
        kpopover_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kpopover.$set(kpopover_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kpopover.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kpopover.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[58](null);
      destroy_component(kpopover, detaching);
      mounted = false;
      dispose();
    }
  };
}
function instance$b($$self, $$props, $$invalidate) {
  let disabledInner;
  let sizeInner;
  let isErrorInner;
  let cnames;
  let selectCls;
  let { $$slots: slots = {}, $$scope } = $$props;
  const $$slots = compute_slots(slots);
  let { iconPrefix = "" } = $$props;
  let { iconSuffix = "" } = $$props;
  let { value = "" } = $$props;
  let { cls = void 0 } = $$props;
  let { clsSelect = void 0 } = $$props;
  let { placeholder = "Please select value" } = $$props;
  let { disabled = false } = $$props;
  let { attrs = {} } = $$props;
  let { labelKey = "label" } = $$props;
  let { valueKey = "value" } = $$props;
  let { key = "id" } = $$props;
  let { fitInputWidth = true } = $$props;
  let { dataList = [] } = $$props;
  let { maxHeight = 250 } = $$props;
  let { clearable = false } = $$props;
  let { remote = void 0 } = $$props;
  let { size = "md" } = $$props;
  let disabledFrom = false;
  let sizeFrom = "";
  let isErrorForm = false;
  const formContext = getContext(formItemKey);
  const formInstance = getContext(formKey);
  let field = "";
  function formUpdateField(init2 = false) {
    field = formContext.split("&").pop();
    $$invalidate(0, value = formInstance.getValueByPath(field, init2 ? formInstance.__default_value : formInstance.__value) || "");
  }
  function formPropsChangeCb(props) {
    $$invalidate(46, disabledFrom = props.disabled);
    $$invalidate(47, sizeFrom = props.size);
  }
  function fromFieldError(error2) {
    $$invalidate(48, isErrorForm = error2);
  }
  if (formContext && formInstance) {
    formUpdateField(true);
    formPropsChangeCb(formInstance.__dynamicProps);
    formInstance.__itemCompMap[field] = { update: formUpdateField, type: "select" };
    formInstance.__errorCompEvtMap[field] = fromFieldError;
    formInstance.__propHandleEvtMap.push(formPropsChangeCb);
  }
  let valueType = "o";
  const wrapperData = (v) => {
    if (isString(v)) {
      valueType = "s";
      return { [labelKey]: v, [valueKey]: v, [key]: v };
    }
    if (isNumber(v)) {
      valueType = "n";
      return { [labelKey]: v, [valueKey]: v, [key]: v };
    }
    return v;
  };
  let dataListInner = dataList.map(wrapperData);
  const dispatch2 = createEventDispatcher();
  let popoverRef = null;
  const handleSelect = async (data) => {
    if (disabledInner) return;
    if (data && (valueType === "n" || valueType === "s")) {
      const finalData = data[valueKey];
      dispatch2("updateValue", finalData);
      formInstance && (formInstance == null ? void 0 : formInstance.updateField(field, finalData, !formInstance.__manual_validate));
      formInstance && $$invalidate(0, value = finalData);
      await tick();
    } else if (!data && (valueType === "n" || valueType === "s") || valueType === "o" && isObject(data)) {
      dispatch2("updateValue", data);
      formInstance && (formInstance == null ? void 0 : formInstance.updateField(field, data, !formInstance.__manual_validate));
      await tick();
      formInstance && $$invalidate(0, value = data);
    }
    popoverRef.updateShow(false);
  };
  let inputSelectRef = null;
  let popoverWidth = void 0;
  let triggerWidth = "initial";
  const setPopoverW = () => {
    if (inputSelectRef) {
      const { width: inputSelectRefWidth } = inputSelectRef.getBoundingClientRect();
      $$invalidate(16, triggerWidth = `${inputSelectRefWidth}px`);
      $$invalidate(15, popoverWidth = fitInputWidth ? `${inputSelectRefWidth}px` : void 0);
    }
  };
  onMount(() => {
    setPopoverW();
  });
  const getLabel = (item) => {
    if (isObject(item)) {
      const label = item[labelKey] || "";
      return label.toString();
    }
    return item;
  };
  const isActive = (item) => {
    if (valueType === "o") {
      return item[valueKey] === value[valueKey];
    }
    return item[valueKey] === value;
  };
  let isShowClear = false;
  const showClearIcon = (show) => {
    if (disabledInner) return;
    if (show) {
      getLabel(value) && $$invalidate(17, isShowClear = show);
    } else {
      $$invalidate(17, isShowClear = show);
    }
  };
  const handleClear = (e) => {
    e.stopPropagation();
    if (valueType === "o") {
      handleSelect({});
    } else if (valueType === "s") {
      handleSelect("");
    } else {
      handleSelect(null);
    }
  };
  let isDisabledPopover = disabledInner || !!remote;
  async function onOpen(e) {
    await tick();
    handleExpend(e);
    if (e.detail && dataListInner.length > 0) {
      setTimeout(setVList, 200);
    } else if (!e.detail && remote) {
      $$invalidate(18, isDisabledPopover = true);
    }
  }
  let expendIcon = "i-carbon-chevron-down ";
  function handleExpend(e) {
    $$invalidate(19, expendIcon = e.detail ? "i-carbon-chevron-down rotate-180" : "i-carbon-chevron-down");
  }
  let popoverModalRef = null;
  let vListRef = null;
  let heightInner = "initial";
  async function setVList() {
    if (popoverModalRef) {
      const container = popoverModalRef.childNodes[0];
      if (container) {
        const el = container.children[0];
        if (el) {
          const { height } = container.children[0].getBoundingClientRect();
          if (height > maxHeight) {
            $$invalidate(22, heightInner = `${maxHeight}px`);
            await tick();
            vListRef && locateItem();
          }
        }
      }
    }
  }
  async function locateItem() {
    for (let i = 0; i < dataListInner.length; i++) {
      if (isActive(dataListInner[i])) {
        vListRef && vListRef.scrollToIndex(i - 3);
        break;
      }
    }
  }
  let text2 = "no data";
  const remoteSearch = debounce(
    async (e) => {
      $$invalidate(12, dataListInner = []);
      $$invalidate(18, isDisabledPopover = false);
      $$invalidate(22, heightInner = "initial");
      await tick();
      popoverRef.updateShow(true);
      $$invalidate(23, text2 = "loading");
      try {
        if (remote) {
          remote(e.target.value, (data) => {
            $$invalidate(12, dataListInner = data.map(wrapperData));
            $$invalidate(23, text2 = "no data");
            dataListInner.length > 0 && setVList();
          });
        }
      } catch (e2) {
        $$invalidate(23, text2 = "no data");
      }
    },
    300
  );
  const prefixCls = getPrefixCls("select");
  const clearIconCls = clsx(`${prefixCls}--clear`);
  const prefixIconCls = clsx(`${prefixCls}--prefix`, `${prefixCls}--icon__${sizeInner || size}`);
  const suffixIconCls = clsx(`${prefixCls}--suffix`, `${prefixCls}--icon__${sizeInner || size}`);
  const selectIconCls = clsx(`${prefixCls}--icon`, `${prefixCls}--icon__${sizeInner || size}`);
  const noDataCls = clsx(`${prefixCls}--tx__empty`);
  const click_handler = (data) => handleSelect(data);
  function kvirtuallist_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      vListRef = $$value;
      $$invalidate(21, vListRef);
    });
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      popoverModalRef = $$value;
      $$invalidate(20, popoverModalRef);
    });
  }
  const mouseenter_handler = () => showClearIcon(true);
  const mouseleave_handler = () => showClearIcon(false);
  function div_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inputSelectRef = $$value;
      $$invalidate(14, inputSelectRef);
    });
  }
  function kpopover_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      popoverRef = $$value;
      $$invalidate(13, popoverRef);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("iconPrefix" in $$props2) $$invalidate(1, iconPrefix = $$props2.iconPrefix);
    if ("iconSuffix" in $$props2) $$invalidate(2, iconSuffix = $$props2.iconSuffix);
    if ("value" in $$props2) $$invalidate(0, value = $$props2.value);
    if ("cls" in $$props2) $$invalidate(3, cls = $$props2.cls);
    if ("clsSelect" in $$props2) $$invalidate(40, clsSelect = $$props2.clsSelect);
    if ("placeholder" in $$props2) $$invalidate(4, placeholder = $$props2.placeholder);
    if ("disabled" in $$props2) $$invalidate(41, disabled = $$props2.disabled);
    if ("attrs" in $$props2) $$invalidate(5, attrs = $$props2.attrs);
    if ("labelKey" in $$props2) $$invalidate(42, labelKey = $$props2.labelKey);
    if ("valueKey" in $$props2) $$invalidate(43, valueKey = $$props2.valueKey);
    if ("key" in $$props2) $$invalidate(6, key = $$props2.key);
    if ("fitInputWidth" in $$props2) $$invalidate(7, fitInputWidth = $$props2.fitInputWidth);
    if ("dataList" in $$props2) $$invalidate(44, dataList = $$props2.dataList);
    if ("maxHeight" in $$props2) $$invalidate(8, maxHeight = $$props2.maxHeight);
    if ("clearable" in $$props2) $$invalidate(9, clearable = $$props2.clearable);
    if ("remote" in $$props2) $$invalidate(10, remote = $$props2.remote);
    if ("size" in $$props2) $$invalidate(45, size = $$props2.size);
    if ("$$scope" in $$props2) $$invalidate(59, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[1] & /*disabledFrom, disabled*/
    33792) {
      $$invalidate(11, disabledInner = disabledFrom || disabled);
    }
    if ($$self.$$.dirty[1] & /*sizeFrom, size*/
    81920) {
      $$invalidate(49, sizeInner = sizeFrom || size);
    }
    if ($$self.$$.dirty[1] & /*isErrorForm*/
    131072) {
      $$invalidate(50, isErrorInner = isErrorForm);
    }
    if ($$self.$$.dirty[1] & /*dataList*/
    8192) {
      {
        $$invalidate(12, dataListInner = dataList.map(wrapperData));
      }
    }
    if ($$self.$$.dirty[0] & /*disabledInner, remote*/
    3072) {
      {
        $$invalidate(18, isDisabledPopover = disabledInner || !!remote);
      }
    }
    if ($$self.$$.dirty[0] & /*disabledInner*/
    2048 | $$self.$$.dirty[1] & /*sizeInner, size, isErrorInner, clsSelect*/
    803328) {
      $$invalidate(25, cnames = clsx(
        `${prefixCls}--base`,
        `${prefixCls}__${sizeInner || size}`,
        {
          [`${prefixCls}--base__disabled`]: disabledInner,
          [`${prefixCls}--base__dark`]: !disabledInner,
          [`${prefixCls}--base__disabled__dark`]: disabledInner
        },
        {
          [`${prefixCls}__error`]: isErrorInner,
          [`${prefixCls}__hover`]: !isErrorInner,
          [`${prefixCls}__focus`]: !isErrorInner
        },
        clsSelect
      ));
    }
    if ($$self.$$.dirty[0] & /*disabledInner*/
    2048 | $$self.$$.dirty[1] & /*sizeInner, size*/
    278528) {
      $$invalidate(24, selectCls = clsx(`${prefixCls}--inner`, `${prefixCls}--inner__${sizeInner || size}`, {
        [`${prefixCls}--inner__dark`]: !disabledInner,
        [`${prefixCls}--base__disabled`]: disabledInner,
        [`${prefixCls}--base__disabled__dark`]: disabledInner,
        [`${prefixCls}--inner__disabled__dark`]: disabledInner
      }));
    }
  };
  return [
    value,
    iconPrefix,
    iconSuffix,
    cls,
    placeholder,
    attrs,
    key,
    fitInputWidth,
    maxHeight,
    clearable,
    remote,
    disabledInner,
    dataListInner,
    popoverRef,
    inputSelectRef,
    popoverWidth,
    triggerWidth,
    isShowClear,
    isDisabledPopover,
    expendIcon,
    popoverModalRef,
    vListRef,
    heightInner,
    text2,
    selectCls,
    cnames,
    handleSelect,
    setPopoverW,
    getLabel,
    isActive,
    showClearIcon,
    handleClear,
    onOpen,
    remoteSearch,
    clearIconCls,
    prefixIconCls,
    suffixIconCls,
    selectIconCls,
    noDataCls,
    $$slots,
    clsSelect,
    disabled,
    labelKey,
    valueKey,
    dataList,
    size,
    disabledFrom,
    sizeFrom,
    isErrorForm,
    sizeInner,
    isErrorInner,
    slots,
    click_handler,
    kvirtuallist_binding,
    div_binding,
    mouseenter_handler,
    mouseleave_handler,
    div_binding_1,
    kpopover_binding,
    $$scope
  ];
}
let Dist$3 = class Dist10 extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$b,
      create_fragment$e,
      safe_not_equal,
      {
        iconPrefix: 1,
        iconSuffix: 2,
        value: 0,
        cls: 3,
        clsSelect: 40,
        placeholder: 4,
        disabled: 41,
        attrs: 5,
        labelKey: 42,
        valueKey: 43,
        key: 6,
        fitInputWidth: 7,
        dataList: 44,
        maxHeight: 8,
        clearable: 9,
        remote: 10,
        size: 45
      },
      null,
      [-1, -1, -1]
    );
  }
};
const get_triggerEl_slot_changes = (dirty) => ({});
const get_triggerEl_slot_context = (ctx) => ({ slot: "triggerEl" });
function create_contentEl_slot$1(ctx) {
  let span;
  let t;
  return {
    c() {
      span = element("span");
      t = text(
        /*content*/
        ctx[3]
      );
      attr(span, "slot", "contentEl");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*content*/
      8) set_data(
        t,
        /*content*/
        ctx2[3]
      );
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_triggerEl_slot$1(ctx) {
  let current;
  const triggerEl_slot_template = (
    /*#slots*/
    ctx[12].triggerEl
  );
  const triggerEl_slot = create_slot(
    triggerEl_slot_template,
    ctx,
    /*$$scope*/
    ctx[13],
    get_triggerEl_slot_context
  );
  return {
    c() {
      if (triggerEl_slot) triggerEl_slot.c();
    },
    m(target, anchor) {
      if (triggerEl_slot) {
        triggerEl_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (triggerEl_slot) {
        if (triggerEl_slot.p && (!current || dirty & /*$$scope*/
        8192)) {
          update_slot_base(
            triggerEl_slot,
            triggerEl_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[13],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[13]
            ) : get_slot_changes(
              triggerEl_slot_template,
              /*$$scope*/
              ctx2[13],
              dirty,
              get_triggerEl_slot_changes
            ),
            get_triggerEl_slot_context
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(triggerEl_slot, local);
      current = true;
    },
    o(local) {
      transition_out(triggerEl_slot, local);
      current = false;
    },
    d(detaching) {
      if (triggerEl_slot) triggerEl_slot.d(detaching);
    }
  };
}
function create_fragment$d(ctx) {
  let kpopover;
  let current;
  kpopover = new Dist$b({
    props: {
      cls: (
        /*cnames*/
        ctx[10]
      ),
      disabled: (
        /*disabled*/
        ctx[4]
      ),
      trigger: (
        /*trigger*/
        ctx[1]
      ),
      theme: (
        /*theme*/
        ctx[9]
      ),
      mouseEnterDelay: (
        /*mouseEnterDelay*/
        ctx[5]
      ),
      mouseLeaveDelay: (
        /*mouseLeaveDelay*/
        ctx[6]
      ),
      placement: (
        /*placement*/
        ctx[0]
      ),
      width: (
        /*width*/
        ctx[8]
      ),
      attrs: (
        /*attrs*/
        ctx[2]
      ),
      defaultOpen: (
        /*defaultOpen*/
        ctx[7]
      ),
      $$slots: {
        triggerEl: [create_triggerEl_slot$1],
        contentEl: [create_contentEl_slot$1]
      },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(kpopover.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kpopover, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const kpopover_changes = {};
      if (dirty & /*cnames*/
      1024) kpopover_changes.cls = /*cnames*/
      ctx2[10];
      if (dirty & /*disabled*/
      16) kpopover_changes.disabled = /*disabled*/
      ctx2[4];
      if (dirty & /*trigger*/
      2) kpopover_changes.trigger = /*trigger*/
      ctx2[1];
      if (dirty & /*theme*/
      512) kpopover_changes.theme = /*theme*/
      ctx2[9];
      if (dirty & /*mouseEnterDelay*/
      32) kpopover_changes.mouseEnterDelay = /*mouseEnterDelay*/
      ctx2[5];
      if (dirty & /*mouseLeaveDelay*/
      64) kpopover_changes.mouseLeaveDelay = /*mouseLeaveDelay*/
      ctx2[6];
      if (dirty & /*placement*/
      1) kpopover_changes.placement = /*placement*/
      ctx2[0];
      if (dirty & /*width*/
      256) kpopover_changes.width = /*width*/
      ctx2[8];
      if (dirty & /*attrs*/
      4) kpopover_changes.attrs = /*attrs*/
      ctx2[2];
      if (dirty & /*defaultOpen*/
      128) kpopover_changes.defaultOpen = /*defaultOpen*/
      ctx2[7];
      if (dirty & /*$$scope, content*/
      8200) {
        kpopover_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kpopover.$set(kpopover_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kpopover.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kpopover.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kpopover, detaching);
    }
  };
}
function instance$a($$self, $$props, $$invalidate) {
  let cnames;
  let { $$slots: slots = {}, $$scope } = $$props;
  let { placement = "top" } = $$props;
  let { trigger = "hover" } = $$props;
  let { cls = void 0 } = $$props;
  let { attrs = {} } = $$props;
  let { content = "" } = $$props;
  let { disabled = false } = $$props;
  let { mouseEnterDelay = 200 } = $$props;
  let { mouseLeaveDelay = 200 } = $$props;
  let { defaultOpen = void 0 } = $$props;
  let { width = "fit-content" } = $$props;
  let { theme = void 0 } = $$props;
  $$self.$$set = ($$props2) => {
    if ("placement" in $$props2) $$invalidate(0, placement = $$props2.placement);
    if ("trigger" in $$props2) $$invalidate(1, trigger = $$props2.trigger);
    if ("cls" in $$props2) $$invalidate(11, cls = $$props2.cls);
    if ("attrs" in $$props2) $$invalidate(2, attrs = $$props2.attrs);
    if ("content" in $$props2) $$invalidate(3, content = $$props2.content);
    if ("disabled" in $$props2) $$invalidate(4, disabled = $$props2.disabled);
    if ("mouseEnterDelay" in $$props2) $$invalidate(5, mouseEnterDelay = $$props2.mouseEnterDelay);
    if ("mouseLeaveDelay" in $$props2) $$invalidate(6, mouseLeaveDelay = $$props2.mouseLeaveDelay);
    if ("defaultOpen" in $$props2) $$invalidate(7, defaultOpen = $$props2.defaultOpen);
    if ("width" in $$props2) $$invalidate(8, width = $$props2.width);
    if ("theme" in $$props2) $$invalidate(9, theme = $$props2.theme);
    if ("$$scope" in $$props2) $$invalidate(13, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*cls*/
    2048) {
      $$invalidate(10, cnames = clsx(cls));
    }
  };
  return [
    placement,
    trigger,
    attrs,
    content,
    disabled,
    mouseEnterDelay,
    mouseLeaveDelay,
    defaultOpen,
    width,
    theme,
    cnames,
    cls,
    slots,
    $$scope
  ];
}
let Dist$2 = class Dist11 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$d, safe_not_equal, {
      placement: 0,
      trigger: 1,
      cls: 11,
      attrs: 2,
      content: 3,
      disabled: 4,
      mouseEnterDelay: 5,
      mouseLeaveDelay: 6,
      defaultOpen: 7,
      width: 8,
      theme: 9
    });
  }
};
function create_if_block$3(ctx) {
  let span;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[11].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[10],
    null
  );
  return {
    c() {
      span = element("span");
      if (default_slot) default_slot.c();
      attr(
        span,
        "class",
        /*contentCls*/
        ctx[2]
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (default_slot) {
        default_slot.m(span, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        1024)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[10],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[10]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[10],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*contentCls*/
      4) {
        attr(
          span,
          "class",
          /*contentCls*/
          ctx2[2]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function create_fragment$c(ctx) {
  let div2;
  let current;
  let if_block = (
    /*direction*/
    ctx[0] === "horizontal" && /*$$slots*/
    ctx[5].default && create_if_block$3(ctx)
  );
  let div_levels = [
    { class: (
      /*dividerCls*/
      ctx[3]
    ) },
    /*$$restProps*/
    ctx[4],
    /*attrs*/
    ctx[1],
    { "data-divider": "k-divider" }
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div2 = element("div");
      if (if_block) if_block.c();
      set_attributes(div2, div_data);
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if (if_block) if_block.m(div2, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*direction*/
        ctx2[0] === "horizontal" && /*$$slots*/
        ctx2[5].default
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*direction, $$slots*/
          33) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$3(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div2, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      set_attributes(div2, div_data = get_spread_update(div_levels, [
        (!current || dirty & /*dividerCls*/
        8) && { class: (
          /*dividerCls*/
          ctx2[3]
        ) },
        dirty & /*$$restProps*/
        16 && /*$$restProps*/
        ctx2[4],
        dirty & /*attrs*/
        2 && /*attrs*/
        ctx2[1],
        { "data-divider": "k-divider" }
      ]));
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (if_block) if_block.d();
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let dividerCls;
  let contentCls;
  const omit_props_names = ["direction", "borderColor", "borderStyle", "contentPosition", "cls", "attrs"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const $$slots = compute_slots(slots);
  let { direction = "horizontal" } = $$props;
  let { borderColor = "b-ikun-bd-base" } = $$props;
  let { borderStyle = "solid" } = $$props;
  let { contentPosition = "center" } = $$props;
  let { cls = void 0 } = $$props;
  let { attrs = {} } = $$props;
  const prefixCls = getPrefixCls("divider");
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("direction" in $$new_props) $$invalidate(0, direction = $$new_props.direction);
    if ("borderColor" in $$new_props) $$invalidate(6, borderColor = $$new_props.borderColor);
    if ("borderStyle" in $$new_props) $$invalidate(7, borderStyle = $$new_props.borderStyle);
    if ("contentPosition" in $$new_props) $$invalidate(8, contentPosition = $$new_props.contentPosition);
    if ("cls" in $$new_props) $$invalidate(9, cls = $$new_props.cls);
    if ("attrs" in $$new_props) $$invalidate(1, attrs = $$new_props.attrs);
    if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*direction, borderStyle, contentPosition, borderColor, cls*/
    961) {
      $$invalidate(3, dividerCls = clsx(prefixCls, `${prefixCls}--${direction}`, `${prefixCls}--${direction}__${borderStyle}`, `${prefixCls}--content-${contentPosition}`, borderColor, cls));
    }
  };
  $$invalidate(2, contentCls = clsx(`${prefixCls}--content`));
  return [
    direction,
    attrs,
    contentCls,
    dividerCls,
    $$restProps,
    $$slots,
    borderColor,
    borderStyle,
    contentPosition,
    cls,
    $$scope,
    slots
  ];
}
let Dist$1 = class Dist12 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$c, safe_not_equal, {
      direction: 0,
      borderColor: 6,
      borderStyle: 7,
      contentPosition: 8,
      cls: 9,
      attrs: 1
    });
  }
};
/*!
 *  decimal.js v10.5.0
 *  An arbitrary-precision Decimal type for JavaScript.
 *  https://github.com/MikeMcl/decimal.js
 *  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
 *  MIT Licence
 */
var EXP_LIMIT = 9e15, MAX_DIGITS = 1e9, NUMERALS = "0123456789abcdef", LN10 = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058", PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789", DEFAULTS = {
  // These values must be integers within the stated ranges (inclusive).
  // Most of these values can be changed at run-time using the `Decimal.config` method.
  // The maximum number of significant digits of the result of a calculation or base conversion.
  // E.g. `Decimal.config({ precision: 20 });`
  precision: 20,
  // 1 to MAX_DIGITS
  // The rounding mode used when rounding to `precision`.
  //
  // ROUND_UP         0 Away from zero.
  // ROUND_DOWN       1 Towards zero.
  // ROUND_CEIL       2 Towards +Infinity.
  // ROUND_FLOOR      3 Towards -Infinity.
  // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
  // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
  // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
  // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
  // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
  //
  // E.g.
  // `Decimal.rounding = 4;`
  // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
  rounding: 4,
  // 0 to 8
  // The modulo mode used when calculating the modulus: a mod n.
  // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
  // The remainder (r) is calculated as: r = a - n * q.
  //
  // UP         0 The remainder is positive if the dividend is negative, else is negative.
  // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
  // FLOOR      3 The remainder has the same sign as the divisor (Python %).
  // HALF_EVEN  6 The IEEE 754 remainder function.
  // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
  //
  // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
  // division (9) are commonly used for the modulus operation. The other rounding modes can also
  // be used, but they may not give useful results.
  modulo: 1,
  // 0 to 9
  // The exponent value at and beneath which `toString` returns exponential notation.
  // JavaScript numbers: -7
  toExpNeg: -7,
  // 0 to -EXP_LIMIT
  // The exponent value at and above which `toString` returns exponential notation.
  // JavaScript numbers: 21
  toExpPos: 21,
  // 0 to EXP_LIMIT
  // The minimum exponent value, beneath which underflow to zero occurs.
  // JavaScript numbers: -324  (5e-324)
  minE: -9e15,
  // -1 to -EXP_LIMIT
  // The maximum exponent value, above which overflow to Infinity occurs.
  // JavaScript numbers: 308  (1.7976931348623157e+308)
  maxE: EXP_LIMIT,
  // 1 to EXP_LIMIT
  // Whether to use cryptographically-secure random number generation, if available.
  crypto: false
  // true/false
}, inexact, quadrant, external = true, decimalError = "[DecimalError] ", invalidArgument = decimalError + "Invalid argument: ", precisionLimitExceeded = decimalError + "Precision limit exceeded", cryptoUnavailable = decimalError + "crypto unavailable", tag = "[object Decimal]", mathfloor = Math.floor, mathpow = Math.pow, isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i, isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i, isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i, isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, BASE = 1e7, LOG_BASE = 7, MAX_SAFE_INTEGER = 9007199254740991, LN10_PRECISION = LN10.length - 1, PI_PRECISION = PI.length - 1, P = { toStringTag: tag };
P.absoluteValue = P.abs = function() {
  var x = new this.constructor(this);
  if (x.s < 0) x.s = 1;
  return finalise(x);
};
P.ceil = function() {
  return finalise(new this.constructor(this), this.e + 1, 2);
};
P.clampedTo = P.clamp = function(min2, max3) {
  var k, x = this, Ctor = x.constructor;
  min2 = new Ctor(min2);
  max3 = new Ctor(max3);
  if (!min2.s || !max3.s) return new Ctor(NaN);
  if (min2.gt(max3)) throw Error(invalidArgument + max3);
  k = x.cmp(min2);
  return k < 0 ? min2 : x.cmp(max3) > 0 ? max3 : new Ctor(x);
};
P.comparedTo = P.cmp = function(y) {
  var i, j, xdL, ydL, x = this, xd = x.d, yd = (y = new x.constructor(y)).d, xs = x.s, ys = y.s;
  if (!xd || !yd) {
    return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
  }
  if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;
  if (xs !== ys) return xs;
  if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;
  xdL = xd.length;
  ydL = yd.length;
  for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
    if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
  }
  return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
};
P.cosine = P.cos = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.d) return new Ctor(NaN);
  if (!x.d[0]) return new Ctor(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = cosine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
};
P.cubeRoot = P.cbrt = function() {
  var e, m, n, r2, rep, s, sd, t, t3, t3plusx, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  external = false;
  s = x.s * mathpow(x.s * x, 1 / 3);
  if (!s || Math.abs(s) == 1 / 0) {
    n = digitsToString(x.d);
    e = x.e;
    if (s = (e - n.length + 1) % 3) n += s == 1 || s == -2 ? "0" : "00";
    s = mathpow(n, 1 / 3);
    e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));
    if (s == 1 / 0) {
      n = "5e" + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf("e") + 1) + e;
    }
    r2 = new Ctor(n);
    r2.s = x.s;
  } else {
    r2 = new Ctor(s.toString());
  }
  sd = (e = Ctor.precision) + 3;
  for (; ; ) {
    t = r2;
    t3 = t.times(t).times(t);
    t3plusx = t3.plus(x);
    r2 = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r2.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);
      if (n == "9999" || !rep && n == "4999") {
        if (!rep) {
          finalise(t, e + 1, 0);
          if (t.times(t).times(t).eq(x)) {
            r2 = t;
            break;
          }
        }
        sd += 4;
        rep = 1;
      } else {
        if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
          finalise(r2, e + 1, 1);
          m = !r2.times(r2).times(r2).eq(x);
        }
        break;
      }
    }
  }
  external = true;
  return finalise(r2, e, Ctor.rounding, m);
};
P.decimalPlaces = P.dp = function() {
  var w, d = this.d, n = NaN;
  if (d) {
    w = d.length - 1;
    n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
    w = d[w];
    if (w) for (; w % 10 == 0; w /= 10) n--;
    if (n < 0) n = 0;
  }
  return n;
};
P.dividedBy = P.div = function(y) {
  return divide(this, new this.constructor(y));
};
P.dividedToIntegerBy = P.divToInt = function(y) {
  var x = this, Ctor = x.constructor;
  return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
};
P.equals = P.eq = function(y) {
  return this.cmp(y) === 0;
};
P.floor = function() {
  return finalise(new this.constructor(this), this.e + 1, 3);
};
P.greaterThan = P.gt = function(y) {
  return this.cmp(y) > 0;
};
P.greaterThanOrEqualTo = P.gte = function(y) {
  var k = this.cmp(y);
  return k == 1 || k === 0;
};
P.hyperbolicCosine = P.cosh = function() {
  var k, n, pr, rm, len, x = this, Ctor = x.constructor, one = new Ctor(1);
  if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
  if (x.isZero()) return one;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;
  if (len < 32) {
    k = Math.ceil(len / 3);
    n = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    n = "2.3283064365386962890625e-10";
  }
  x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);
  var cosh2_x, i = k, d8 = new Ctor(8);
  for (; i--; ) {
    cosh2_x = x.times(x);
    x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
  }
  return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.hyperbolicSine = P.sinh = function() {
  var k, pr, rm, len, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;
  if (len < 3) {
    x = taylorSeries(Ctor, 2, x, x, true);
  } else {
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;
    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x, true);
    var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
    for (; k--; ) {
      sinh2_x = x.times(x);
      x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
    }
  }
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(x, pr, rm, true);
};
P.hyperbolicTangent = P.tanh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(x.s);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 7;
  Ctor.rounding = 1;
  return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
};
P.inverseCosine = P.acos = function() {
  var x = this, Ctor = x.constructor, k = x.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
  if (k !== -1) {
    return k === 0 ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
  }
  if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(0.5);
  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = new Ctor(1).minus(x).div(x.plus(1)).sqrt().atan();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(2);
};
P.inverseHyperbolicCosine = P.acosh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
  if (!x.isFinite()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).minus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
P.inverseHyperbolicSine = P.asinh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).plus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
P.inverseHyperbolicTangent = P.atanh = function() {
  var pr, rm, wpr, xsd, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  xsd = x.sd();
  if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);
  Ctor.precision = wpr = xsd - x.e;
  x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);
  Ctor.precision = pr + 4;
  Ctor.rounding = 1;
  x = x.ln();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(0.5);
};
P.inverseSine = P.asin = function() {
  var halfPi, k, pr, rm, x = this, Ctor = x.constructor;
  if (x.isZero()) return new Ctor(x);
  k = x.abs().cmp(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (k !== -1) {
    if (k === 0) {
      halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
      halfPi.s = x.s;
      return halfPi;
    }
    return new Ctor(NaN);
  }
  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(2);
};
P.inverseTangent = P.atan = function() {
  var i, j, k, n, px, t, r2, wpr, x2, x = this, Ctor = x.constructor, pr = Ctor.precision, rm = Ctor.rounding;
  if (!x.isFinite()) {
    if (!x.s) return new Ctor(NaN);
    if (pr + 4 <= PI_PRECISION) {
      r2 = getPi(Ctor, pr + 4, rm).times(0.5);
      r2.s = x.s;
      return r2;
    }
  } else if (x.isZero()) {
    return new Ctor(x);
  } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
    r2 = getPi(Ctor, pr + 4, rm).times(0.25);
    r2.s = x.s;
    return r2;
  }
  Ctor.precision = wpr = pr + 10;
  Ctor.rounding = 1;
  k = Math.min(28, wpr / LOG_BASE + 2 | 0);
  for (i = k; i; --i) x = x.div(x.times(x).plus(1).sqrt().plus(1));
  external = false;
  j = Math.ceil(wpr / LOG_BASE);
  n = 1;
  x2 = x.times(x);
  r2 = new Ctor(x);
  px = x;
  for (; i !== -1; ) {
    px = px.times(x2);
    t = r2.minus(px.div(n += 2));
    px = px.times(x2);
    r2 = t.plus(px.div(n += 2));
    if (r2.d[j] !== void 0) for (i = j; r2.d[i] === t.d[i] && i--; ) ;
  }
  if (k) r2 = r2.times(2 << k - 1);
  external = true;
  return finalise(r2, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.isFinite = function() {
  return !!this.d;
};
P.isInteger = P.isInt = function() {
  return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
};
P.isNaN = function() {
  return !this.s;
};
P.isNegative = P.isNeg = function() {
  return this.s < 0;
};
P.isPositive = P.isPos = function() {
  return this.s > 0;
};
P.isZero = function() {
  return !!this.d && this.d[0] === 0;
};
P.lessThan = P.lt = function(y) {
  return this.cmp(y) < 0;
};
P.lessThanOrEqualTo = P.lte = function(y) {
  return this.cmp(y) < 1;
};
P.logarithm = P.log = function(base) {
  var isBase10, d, denominator, k, inf, num, sd, r2, arg = this, Ctor = arg.constructor, pr = Ctor.precision, rm = Ctor.rounding, guard = 5;
  if (base == null) {
    base = new Ctor(10);
    isBase10 = true;
  } else {
    base = new Ctor(base);
    d = base.d;
    if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);
    isBase10 = base.eq(10);
  }
  d = arg.d;
  if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
    return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
  }
  if (isBase10) {
    if (d.length > 1) {
      inf = true;
    } else {
      for (k = d[0]; k % 10 === 0; ) k /= 10;
      inf = k !== 1;
    }
  }
  external = false;
  sd = pr + guard;
  num = naturalLogarithm(arg, sd);
  denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
  r2 = divide(num, denominator, sd, 1);
  if (checkRoundingDigits(r2.d, k = pr, rm)) {
    do {
      sd += 10;
      num = naturalLogarithm(arg, sd);
      denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
      r2 = divide(num, denominator, sd, 1);
      if (!inf) {
        if (+digitsToString(r2.d).slice(k + 1, k + 15) + 1 == 1e14) {
          r2 = finalise(r2, pr + 1, 0);
        }
        break;
      }
    } while (checkRoundingDigits(r2.d, k += 10, rm));
  }
  external = true;
  return finalise(r2, pr, rm);
};
P.minus = P.sub = function(y) {
  var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.d) {
    if (!x.s || !y.s) y = new Ctor(NaN);
    else if (x.d) y.s = -y.s;
    else y = new Ctor(y.d || x.s !== y.s ? x : NaN);
    return y;
  }
  if (x.s != y.s) {
    y.s = -y.s;
    return x.plus(y);
  }
  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (!xd[0] || !yd[0]) {
    if (yd[0]) y.s = -y.s;
    else if (xd[0]) y = new Ctor(x);
    else return new Ctor(rm === 3 ? -0 : 0);
    return external ? finalise(y, pr, rm) : y;
  }
  e = mathfloor(y.e / LOG_BASE);
  xe = mathfloor(x.e / LOG_BASE);
  xd = xd.slice();
  k = xe - e;
  if (k) {
    xLTy = k < 0;
    if (xLTy) {
      d = xd;
      k = -k;
      len = yd.length;
    } else {
      d = yd;
      e = xe;
      len = xd.length;
    }
    i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;
    if (k > i) {
      k = i;
      d.length = 1;
    }
    d.reverse();
    for (i = k; i--; ) d.push(0);
    d.reverse();
  } else {
    i = xd.length;
    len = yd.length;
    xLTy = i < len;
    if (xLTy) len = i;
    for (i = 0; i < len; i++) {
      if (xd[i] != yd[i]) {
        xLTy = xd[i] < yd[i];
        break;
      }
    }
    k = 0;
  }
  if (xLTy) {
    d = xd;
    xd = yd;
    yd = d;
    y.s = -y.s;
  }
  len = xd.length;
  for (i = yd.length - len; i > 0; --i) xd[len++] = 0;
  for (i = yd.length; i > k; ) {
    if (xd[--i] < yd[i]) {
      for (j = i; j && xd[--j] === 0; ) xd[j] = BASE - 1;
      --xd[j];
      xd[i] += BASE;
    }
    xd[i] -= yd[i];
  }
  for (; xd[--len] === 0; ) xd.pop();
  for (; xd[0] === 0; xd.shift()) --e;
  if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);
  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
P.modulo = P.mod = function(y) {
  var q, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);
  if (!y.d || x.d && !x.d[0]) {
    return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
  }
  external = false;
  if (Ctor.modulo == 9) {
    q = divide(x, y.abs(), 0, 3, 1);
    q.s *= y.s;
  } else {
    q = divide(x, y, 0, Ctor.modulo, 1);
  }
  q = q.times(y);
  external = true;
  return x.minus(q);
};
P.naturalExponential = P.exp = function() {
  return naturalExponential(this);
};
P.naturalLogarithm = P.ln = function() {
  return naturalLogarithm(this);
};
P.negated = P.neg = function() {
  var x = new this.constructor(this);
  x.s = -x.s;
  return finalise(x);
};
P.plus = P.add = function(y) {
  var carry, d, e, i, k, len, pr, rm, xd, yd, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.d) {
    if (!x.s || !y.s) y = new Ctor(NaN);
    else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);
    return y;
  }
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }
  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (!xd[0] || !yd[0]) {
    if (!yd[0]) y = new Ctor(x);
    return external ? finalise(y, pr, rm) : y;
  }
  k = mathfloor(x.e / LOG_BASE);
  e = mathfloor(y.e / LOG_BASE);
  xd = xd.slice();
  i = k - e;
  if (i) {
    if (i < 0) {
      d = xd;
      i = -i;
      len = yd.length;
    } else {
      d = yd;
      e = k;
      len = xd.length;
    }
    k = Math.ceil(pr / LOG_BASE);
    len = k > len ? k + 1 : len + 1;
    if (i > len) {
      i = len;
      d.length = 1;
    }
    d.reverse();
    for (; i--; ) d.push(0);
    d.reverse();
  }
  len = xd.length;
  i = yd.length;
  if (len - i < 0) {
    i = len;
    d = yd;
    yd = xd;
    xd = d;
  }
  for (carry = 0; i; ) {
    carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
    xd[i] %= BASE;
  }
  if (carry) {
    xd.unshift(carry);
    ++e;
  }
  for (len = xd.length; xd[--len] == 0; ) xd.pop();
  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
P.precision = P.sd = function(z) {
  var k, x = this;
  if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);
  if (x.d) {
    k = getPrecision(x.d);
    if (z && x.e + 1 > k) k = x.e + 1;
  } else {
    k = NaN;
  }
  return k;
};
P.round = function() {
  var x = this, Ctor = x.constructor;
  return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
};
P.sine = P.sin = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = sine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
};
P.squareRoot = P.sqrt = function() {
  var m, n, sd, r2, rep, t, x = this, d = x.d, e = x.e, s = x.s, Ctor = x.constructor;
  if (s !== 1 || !d || !d[0]) {
    return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
  }
  external = false;
  s = Math.sqrt(+x);
  if (s == 0 || s == 1 / 0) {
    n = digitsToString(d);
    if ((n.length + e) % 2 == 0) n += "0";
    s = Math.sqrt(n);
    e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);
    if (s == 1 / 0) {
      n = "5e" + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf("e") + 1) + e;
    }
    r2 = new Ctor(n);
  } else {
    r2 = new Ctor(s.toString());
  }
  sd = (e = Ctor.precision) + 3;
  for (; ; ) {
    t = r2;
    r2 = t.plus(divide(x, t, sd + 2, 1)).times(0.5);
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r2.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);
      if (n == "9999" || !rep && n == "4999") {
        if (!rep) {
          finalise(t, e + 1, 0);
          if (t.times(t).eq(x)) {
            r2 = t;
            break;
          }
        }
        sd += 4;
        rep = 1;
      } else {
        if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
          finalise(r2, e + 1, 1);
          m = !r2.times(r2).eq(x);
        }
        break;
      }
    }
  }
  external = true;
  return finalise(r2, e, Ctor.rounding, m);
};
P.tangent = P.tan = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 10;
  Ctor.rounding = 1;
  x = x.sin();
  x.s = 1;
  x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
};
P.times = P.mul = function(y) {
  var carry, e, i, k, r2, rL, t, xdL, ydL, x = this, Ctor = x.constructor, xd = x.d, yd = (y = new Ctor(y)).d;
  y.s *= x.s;
  if (!xd || !xd[0] || !yd || !yd[0]) {
    return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y.s / 0 : y.s * 0);
  }
  e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
  xdL = xd.length;
  ydL = yd.length;
  if (xdL < ydL) {
    r2 = xd;
    xd = yd;
    yd = r2;
    rL = xdL;
    xdL = ydL;
    ydL = rL;
  }
  r2 = [];
  rL = xdL + ydL;
  for (i = rL; i--; ) r2.push(0);
  for (i = ydL; --i >= 0; ) {
    carry = 0;
    for (k = xdL + i; k > i; ) {
      t = r2[k] + yd[i] * xd[k - i - 1] + carry;
      r2[k--] = t % BASE | 0;
      carry = t / BASE | 0;
    }
    r2[k] = (r2[k] + carry) % BASE | 0;
  }
  for (; !r2[--rL]; ) r2.pop();
  if (carry) ++e;
  else r2.shift();
  y.d = r2;
  y.e = getBase10Exponent(r2, e);
  return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
};
P.toBinary = function(sd, rm) {
  return toStringBinary(this, 2, sd, rm);
};
P.toDecimalPlaces = P.toDP = function(dp, rm) {
  var x = this, Ctor = x.constructor;
  x = new Ctor(x);
  if (dp === void 0) return x;
  checkInt32(dp, 0, MAX_DIGITS);
  if (rm === void 0) rm = Ctor.rounding;
  else checkInt32(rm, 0, 8);
  return finalise(x, dp + x.e + 1, rm);
};
P.toExponential = function(dp, rm) {
  var str, x = this, Ctor = x.constructor;
  if (dp === void 0) {
    str = finiteToString(x, true);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), dp + 1, rm);
    str = finiteToString(x, true, dp + 1);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFixed = function(dp, rm) {
  var str, y, x = this, Ctor = x.constructor;
  if (dp === void 0) {
    str = finiteToString(x);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
    y = finalise(new Ctor(x), dp + x.e + 1, rm);
    str = finiteToString(y, false, dp + y.e + 1);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFraction = function(maxD) {
  var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r2, x = this, xd = x.d, Ctor = x.constructor;
  if (!xd) return new Ctor(x);
  n1 = d0 = new Ctor(1);
  d1 = n0 = new Ctor(0);
  d = new Ctor(d1);
  e = d.e = getPrecision(xd) - x.e - 1;
  k = e % LOG_BASE;
  d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);
  if (maxD == null) {
    maxD = e > 0 ? d : n1;
  } else {
    n = new Ctor(maxD);
    if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
    maxD = n.gt(d) ? e > 0 ? d : n1 : n;
  }
  external = false;
  n = new Ctor(digitsToString(xd));
  pr = Ctor.precision;
  Ctor.precision = e = xd.length * LOG_BASE * 2;
  for (; ; ) {
    q = divide(n, d, 0, 1, 1);
    d2 = d0.plus(q.times(d1));
    if (d2.cmp(maxD) == 1) break;
    d0 = d1;
    d1 = d2;
    d2 = n1;
    n1 = n0.plus(q.times(d2));
    n0 = d2;
    d2 = d;
    d = n.minus(q.times(d2));
    n = d2;
  }
  d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
  n0 = n0.plus(d2.times(n1));
  d0 = d0.plus(d2.times(d1));
  n0.s = n1.s = x.s;
  r2 = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
  Ctor.precision = pr;
  external = true;
  return r2;
};
P.toHexadecimal = P.toHex = function(sd, rm) {
  return toStringBinary(this, 16, sd, rm);
};
P.toNearest = function(y, rm) {
  var x = this, Ctor = x.constructor;
  x = new Ctor(x);
  if (y == null) {
    if (!x.d) return x;
    y = new Ctor(1);
    rm = Ctor.rounding;
  } else {
    y = new Ctor(y);
    if (rm === void 0) {
      rm = Ctor.rounding;
    } else {
      checkInt32(rm, 0, 8);
    }
    if (!x.d) return y.s ? x : y;
    if (!y.d) {
      if (y.s) y.s = x.s;
      return y;
    }
  }
  if (y.d[0]) {
    external = false;
    x = divide(x, y, 0, rm, 1).times(y);
    external = true;
    finalise(x);
  } else {
    y.s = x.s;
    x = y;
  }
  return x;
};
P.toNumber = function() {
  return +this;
};
P.toOctal = function(sd, rm) {
  return toStringBinary(this, 8, sd, rm);
};
P.toPower = P.pow = function(y) {
  var e, k, pr, r2, rm, s, x = this, Ctor = x.constructor, yn = +(y = new Ctor(y));
  if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));
  x = new Ctor(x);
  if (x.eq(1)) return x;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (y.eq(1)) return finalise(x, pr, rm);
  e = mathfloor(y.e / LOG_BASE);
  if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
    r2 = intPow(Ctor, x, k, pr);
    return y.s < 0 ? new Ctor(1).div(r2) : finalise(r2, pr, rm);
  }
  s = x.s;
  if (s < 0) {
    if (e < y.d.length - 1) return new Ctor(NaN);
    if ((y.d[e] & 1) == 0) s = 1;
    if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
      x.s = s;
      return x;
    }
  }
  k = mathpow(+x, yn);
  e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + "").e;
  if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);
  external = false;
  Ctor.rounding = x.s = 1;
  k = Math.min(12, (e + "").length);
  r2 = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);
  if (r2.d) {
    r2 = finalise(r2, pr + 5, 1);
    if (checkRoundingDigits(r2.d, pr, rm)) {
      e = pr + 10;
      r2 = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);
      if (+digitsToString(r2.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
        r2 = finalise(r2, pr + 1, 0);
      }
    }
  }
  r2.s = s;
  external = true;
  Ctor.rounding = rm;
  return finalise(r2, pr, rm);
};
P.toPrecision = function(sd, rm) {
  var str, x = this, Ctor = x.constructor;
  if (sd === void 0) {
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), sd, rm);
    str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toSignificantDigits = P.toSD = function(sd, rm) {
  var x = this, Ctor = x.constructor;
  if (sd === void 0) {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
  }
  return finalise(new Ctor(x), sd, rm);
};
P.toString = function() {
  var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.truncated = P.trunc = function() {
  return finalise(new this.constructor(this), this.e + 1, 1);
};
P.valueOf = P.toJSON = function() {
  var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() ? "-" + str : str;
};
function digitsToString(d) {
  var i, k, ws, indexOfLastWord = d.length - 1, str = "", w = d[0];
  if (indexOfLastWord > 0) {
    str += w;
    for (i = 1; i < indexOfLastWord; i++) {
      ws = d[i] + "";
      k = LOG_BASE - ws.length;
      if (k) str += getZeroString(k);
      str += ws;
    }
    w = d[i];
    ws = w + "";
    k = LOG_BASE - ws.length;
    if (k) str += getZeroString(k);
  } else if (w === 0) {
    return "0";
  }
  for (; w % 10 === 0; ) w /= 10;
  return str + w;
}
function checkInt32(i, min2, max3) {
  if (i !== ~~i || i < min2 || i > max3) {
    throw Error(invalidArgument + i);
  }
}
function checkRoundingDigits(d, i, rm, repeating) {
  var di, k, r2, rd;
  for (k = d[0]; k >= 10; k /= 10) --i;
  if (--i < 0) {
    i += LOG_BASE;
    di = 0;
  } else {
    di = Math.ceil((i + 1) / LOG_BASE);
    i %= LOG_BASE;
  }
  k = mathpow(10, LOG_BASE - i);
  rd = d[di] % k | 0;
  if (repeating == null) {
    if (i < 3) {
      if (i == 0) rd = rd / 100 | 0;
      else if (i == 1) rd = rd / 10 | 0;
      r2 = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 5e4 || rd == 0;
    } else {
      r2 = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
    }
  } else {
    if (i < 4) {
      if (i == 0) rd = rd / 1e3 | 0;
      else if (i == 1) rd = rd / 100 | 0;
      else if (i == 2) rd = rd / 10 | 0;
      r2 = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
    } else {
      r2 = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1e3 | 0) == mathpow(10, i - 3) - 1;
    }
  }
  return r2;
}
function convertBase(str, baseIn, baseOut) {
  var j, arr = [0], arrL, i = 0, strL = str.length;
  for (; i < strL; ) {
    for (arrL = arr.length; arrL--; ) arr[arrL] *= baseIn;
    arr[0] += NUMERALS.indexOf(str.charAt(i++));
    for (j = 0; j < arr.length; j++) {
      if (arr[j] > baseOut - 1) {
        if (arr[j + 1] === void 0) arr[j + 1] = 0;
        arr[j + 1] += arr[j] / baseOut | 0;
        arr[j] %= baseOut;
      }
    }
  }
  return arr.reverse();
}
function cosine(Ctor, x) {
  var k, len, y;
  if (x.isZero()) return x;
  len = x.d.length;
  if (len < 32) {
    k = Math.ceil(len / 3);
    y = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    y = "2.3283064365386962890625e-10";
  }
  Ctor.precision += k;
  x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));
  for (var i = k; i--; ) {
    var cos2x = x.times(x);
    x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
  }
  Ctor.precision -= k;
  return x;
}
var divide = /* @__PURE__ */ function() {
  function multiplyInteger(x, k, base) {
    var temp, carry = 0, i = x.length;
    for (x = x.slice(); i--; ) {
      temp = x[i] * k + carry;
      x[i] = temp % base | 0;
      carry = temp / base | 0;
    }
    if (carry) x.unshift(carry);
    return x;
  }
  function compare(a, b, aL, bL) {
    var i, r2;
    if (aL != bL) {
      r2 = aL > bL ? 1 : -1;
    } else {
      for (i = r2 = 0; i < aL; i++) {
        if (a[i] != b[i]) {
          r2 = a[i] > b[i] ? 1 : -1;
          break;
        }
      }
    }
    return r2;
  }
  function subtract(a, b, aL, base) {
    var i = 0;
    for (; aL--; ) {
      a[aL] -= i;
      i = a[aL] < b[aL] ? 1 : 0;
      a[aL] = i * base + a[aL] - b[aL];
    }
    for (; !a[0] && a.length > 1; ) a.shift();
  }
  return function(x, y, pr, rm, dp, base) {
    var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x.constructor, sign2 = x.s == y.s ? 1 : -1, xd = x.d, yd = y.d;
    if (!xd || !xd[0] || !yd || !yd[0]) {
      return new Ctor(
        // Return NaN if either NaN, or both Infinity or 0.
        !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : (
          // Return ±0 if x is 0 or y is ±Infinity, or return ±Infinity as y is 0.
          xd && xd[0] == 0 || !yd ? sign2 * 0 : sign2 / 0
        )
      );
    }
    if (base) {
      logBase = 1;
      e = x.e - y.e;
    } else {
      base = BASE;
      logBase = LOG_BASE;
      e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
    }
    yL = yd.length;
    xL = xd.length;
    q = new Ctor(sign2);
    qd = q.d = [];
    for (i = 0; yd[i] == (xd[i] || 0); i++) ;
    if (yd[i] > (xd[i] || 0)) e--;
    if (pr == null) {
      sd = pr = Ctor.precision;
      rm = Ctor.rounding;
    } else if (dp) {
      sd = pr + (x.e - y.e) + 1;
    } else {
      sd = pr;
    }
    if (sd < 0) {
      qd.push(1);
      more = true;
    } else {
      sd = sd / logBase + 2 | 0;
      i = 0;
      if (yL == 1) {
        k = 0;
        yd = yd[0];
        sd++;
        for (; (i < xL || k) && sd--; i++) {
          t = k * base + (xd[i] || 0);
          qd[i] = t / yd | 0;
          k = t % yd | 0;
        }
        more = k || i < xL;
      } else {
        k = base / (yd[0] + 1) | 0;
        if (k > 1) {
          yd = multiplyInteger(yd, k, base);
          xd = multiplyInteger(xd, k, base);
          yL = yd.length;
          xL = xd.length;
        }
        xi = yL;
        rem = xd.slice(0, yL);
        remL = rem.length;
        for (; remL < yL; ) rem[remL++] = 0;
        yz = yd.slice();
        yz.unshift(0);
        yd0 = yd[0];
        if (yd[1] >= base / 2) ++yd0;
        do {
          k = 0;
          cmp = compare(yd, rem, yL, remL);
          if (cmp < 0) {
            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
            k = rem0 / yd0 | 0;
            if (k > 1) {
              if (k >= base) k = base - 1;
              prod = multiplyInteger(yd, k, base);
              prodL = prod.length;
              remL = rem.length;
              cmp = compare(prod, rem, prodL, remL);
              if (cmp == 1) {
                k--;
                subtract(prod, yL < prodL ? yz : yd, prodL, base);
              }
            } else {
              if (k == 0) cmp = k = 1;
              prod = yd.slice();
            }
            prodL = prod.length;
            if (prodL < remL) prod.unshift(0);
            subtract(rem, prod, remL, base);
            if (cmp == -1) {
              remL = rem.length;
              cmp = compare(yd, rem, yL, remL);
              if (cmp < 1) {
                k++;
                subtract(rem, yL < remL ? yz : yd, remL, base);
              }
            }
            remL = rem.length;
          } else if (cmp === 0) {
            k++;
            rem = [0];
          }
          qd[i++] = k;
          if (cmp && rem[0]) {
            rem[remL++] = xd[xi] || 0;
          } else {
            rem = [xd[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] !== void 0) && sd--);
        more = rem[0] !== void 0;
      }
      if (!qd[0]) qd.shift();
    }
    if (logBase == 1) {
      q.e = e;
      inexact = more;
    } else {
      for (i = 1, k = qd[0]; k >= 10; k /= 10) i++;
      q.e = i + e * logBase - 1;
      finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
    }
    return q;
  };
}();
function finalise(x, sd, rm, isTruncated) {
  var digits, i, j, k, rd, roundUp, w, xd, xdi, Ctor = x.constructor;
  out: if (sd != null) {
    xd = x.d;
    if (!xd) return x;
    for (digits = 1, k = xd[0]; k >= 10; k /= 10) digits++;
    i = sd - digits;
    if (i < 0) {
      i += LOG_BASE;
      j = sd;
      w = xd[xdi = 0];
      rd = w / mathpow(10, digits - j - 1) % 10 | 0;
    } else {
      xdi = Math.ceil((i + 1) / LOG_BASE);
      k = xd.length;
      if (xdi >= k) {
        if (isTruncated) {
          for (; k++ <= xdi; ) xd.push(0);
          w = rd = 0;
          digits = 1;
          i %= LOG_BASE;
          j = i - LOG_BASE + 1;
        } else {
          break out;
        }
      } else {
        w = k = xd[xdi];
        for (digits = 1; k >= 10; k /= 10) digits++;
        i %= LOG_BASE;
        j = i - LOG_BASE + digits;
        rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
      }
    }
    isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));
    roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
    (i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
    if (sd < 1 || !xd[0]) {
      xd.length = 0;
      if (roundUp) {
        sd -= x.e + 1;
        xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
        x.e = -sd || 0;
      } else {
        xd[0] = x.e = 0;
      }
      return x;
    }
    if (i == 0) {
      xd.length = xdi;
      k = 1;
      xdi--;
    } else {
      xd.length = xdi + 1;
      k = mathpow(10, LOG_BASE - i);
      xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
    }
    if (roundUp) {
      for (; ; ) {
        if (xdi == 0) {
          for (i = 1, j = xd[0]; j >= 10; j /= 10) i++;
          j = xd[0] += k;
          for (k = 1; j >= 10; j /= 10) k++;
          if (i != k) {
            x.e++;
            if (xd[0] == BASE) xd[0] = 1;
          }
          break;
        } else {
          xd[xdi] += k;
          if (xd[xdi] != BASE) break;
          xd[xdi--] = 0;
          k = 1;
        }
      }
    }
    for (i = xd.length; xd[--i] === 0; ) xd.pop();
  }
  if (external) {
    if (x.e > Ctor.maxE) {
      x.d = null;
      x.e = NaN;
    } else if (x.e < Ctor.minE) {
      x.e = 0;
      x.d = [0];
    }
  }
  return x;
}
function finiteToString(x, isExp, sd) {
  if (!x.isFinite()) return nonFiniteToString(x);
  var k, e = x.e, str = digitsToString(x.d), len = str.length;
  if (isExp) {
    if (sd && (k = sd - len) > 0) {
      str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
    } else if (len > 1) {
      str = str.charAt(0) + "." + str.slice(1);
    }
    str = str + (x.e < 0 ? "e" : "e+") + x.e;
  } else if (e < 0) {
    str = "0." + getZeroString(-e - 1) + str;
    if (sd && (k = sd - len) > 0) str += getZeroString(k);
  } else if (e >= len) {
    str += getZeroString(e + 1 - len);
    if (sd && (k = sd - e - 1) > 0) str = str + "." + getZeroString(k);
  } else {
    if ((k = e + 1) < len) str = str.slice(0, k) + "." + str.slice(k);
    if (sd && (k = sd - len) > 0) {
      if (e + 1 === len) str += ".";
      str += getZeroString(k);
    }
  }
  return str;
}
function getBase10Exponent(digits, e) {
  var w = digits[0];
  for (e *= LOG_BASE; w >= 10; w /= 10) e++;
  return e;
}
function getLn10(Ctor, sd, pr) {
  if (sd > LN10_PRECISION) {
    external = true;
    if (pr) Ctor.precision = pr;
    throw Error(precisionLimitExceeded);
  }
  return finalise(new Ctor(LN10), sd, 1, true);
}
function getPi(Ctor, sd, rm) {
  if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
  return finalise(new Ctor(PI), sd, rm, true);
}
function getPrecision(digits) {
  var w = digits.length - 1, len = w * LOG_BASE + 1;
  w = digits[w];
  if (w) {
    for (; w % 10 == 0; w /= 10) len--;
    for (w = digits[0]; w >= 10; w /= 10) len++;
  }
  return len;
}
function getZeroString(k) {
  var zs = "";
  for (; k--; ) zs += "0";
  return zs;
}
function intPow(Ctor, x, n, pr) {
  var isTruncated, r2 = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
  external = false;
  for (; ; ) {
    if (n % 2) {
      r2 = r2.times(x);
      if (truncate(r2.d, k)) isTruncated = true;
    }
    n = mathfloor(n / 2);
    if (n === 0) {
      n = r2.d.length - 1;
      if (isTruncated && r2.d[n] === 0) ++r2.d[n];
      break;
    }
    x = x.times(x);
    truncate(x.d, k);
  }
  external = true;
  return r2;
}
function isOdd(n) {
  return n.d[n.d.length - 1] & 1;
}
function maxOrMin(Ctor, args, n) {
  var k, y, x = new Ctor(args[0]), i = 0;
  for (; ++i < args.length; ) {
    y = new Ctor(args[i]);
    if (!y.s) {
      x = y;
      break;
    }
    k = x.cmp(y);
    if (k === n || k === 0 && x.s === n) {
      x = y;
    }
  }
  return x;
}
function naturalExponential(x, sd) {
  var denominator, guard, j, pow2, sum2, t, wpr, rep = 0, i = 0, k = 0, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
  if (!x.d || !x.d[0] || x.e > 17) {
    return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0 : x.s ? x.s < 0 ? 0 : x : 0 / 0);
  }
  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }
  t = new Ctor(0.03125);
  while (x.e > -2) {
    x = x.times(t);
    k += 5;
  }
  guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
  wpr += guard;
  denominator = pow2 = sum2 = new Ctor(1);
  Ctor.precision = wpr;
  for (; ; ) {
    pow2 = finalise(pow2.times(x), wpr, 1);
    denominator = denominator.times(++i);
    t = sum2.plus(divide(pow2, denominator, wpr, 1));
    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
      j = k;
      while (j--) sum2 = finalise(sum2.times(sum2), wpr, 1);
      if (sd == null) {
        if (rep < 3 && checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += 10;
          denominator = pow2 = t = new Ctor(1);
          i = 0;
          rep++;
        } else {
          return finalise(sum2, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum2;
      }
    }
    sum2 = t;
  }
}
function naturalLogarithm(y, sd) {
  var c, c0, denominator, e, numerator, rep, sum2, t, wpr, x1, x2, n = 1, guard = 10, x = y, xd = x.d, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
  if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
    return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
  }
  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }
  Ctor.precision = wpr += guard;
  c = digitsToString(xd);
  c0 = c.charAt(0);
  if (Math.abs(e = x.e) < 15e14) {
    while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
      x = x.times(y);
      c = digitsToString(x.d);
      c0 = c.charAt(0);
      n++;
    }
    e = x.e;
    if (c0 > 1) {
      x = new Ctor("0." + c);
      e++;
    } else {
      x = new Ctor(c0 + "." + c.slice(1));
    }
  } else {
    t = getLn10(Ctor, wpr + 2, pr).times(e + "");
    x = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
    Ctor.precision = pr;
    return sd == null ? finalise(x, pr, rm, external = true) : x;
  }
  x1 = x;
  sum2 = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
  x2 = finalise(x.times(x), wpr, 1);
  denominator = 3;
  for (; ; ) {
    numerator = finalise(numerator.times(x2), wpr, 1);
    t = sum2.plus(divide(numerator, new Ctor(denominator), wpr, 1));
    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
      sum2 = sum2.times(2);
      if (e !== 0) sum2 = sum2.plus(getLn10(Ctor, wpr + 2, pr).times(e + ""));
      sum2 = divide(sum2, new Ctor(n), wpr, 1);
      if (sd == null) {
        if (checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += guard;
          t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
          x2 = finalise(x.times(x), wpr, 1);
          denominator = rep = 1;
        } else {
          return finalise(sum2, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum2;
      }
    }
    sum2 = t;
    denominator += 2;
  }
}
function nonFiniteToString(x) {
  return String(x.s * x.s / 0);
}
function parseDecimal(x, str) {
  var e, i, len;
  if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
  if ((i = str.search(/e/i)) > 0) {
    if (e < 0) e = i;
    e += +str.slice(i + 1);
    str = str.substring(0, i);
  } else if (e < 0) {
    e = str.length;
  }
  for (i = 0; str.charCodeAt(i) === 48; i++) ;
  for (len = str.length; str.charCodeAt(len - 1) === 48; --len) ;
  str = str.slice(i, len);
  if (str) {
    len -= i;
    x.e = e = e - i - 1;
    x.d = [];
    i = (e + 1) % LOG_BASE;
    if (e < 0) i += LOG_BASE;
    if (i < len) {
      if (i) x.d.push(+str.slice(0, i));
      for (len -= LOG_BASE; i < len; ) x.d.push(+str.slice(i, i += LOG_BASE));
      str = str.slice(i);
      i = LOG_BASE - str.length;
    } else {
      i -= len;
    }
    for (; i--; ) str += "0";
    x.d.push(+str);
    if (external) {
      if (x.e > x.constructor.maxE) {
        x.d = null;
        x.e = NaN;
      } else if (x.e < x.constructor.minE) {
        x.e = 0;
        x.d = [0];
      }
    }
  } else {
    x.e = 0;
    x.d = [0];
  }
  return x;
}
function parseOther(x, str) {
  var base, Ctor, divisor, i, isFloat, len, p, xd, xe;
  if (str.indexOf("_") > -1) {
    str = str.replace(/(\d)_(?=\d)/g, "$1");
    if (isDecimal.test(str)) return parseDecimal(x, str);
  } else if (str === "Infinity" || str === "NaN") {
    if (!+str) x.s = NaN;
    x.e = NaN;
    x.d = null;
    return x;
  }
  if (isHex.test(str)) {
    base = 16;
    str = str.toLowerCase();
  } else if (isBinary.test(str)) {
    base = 2;
  } else if (isOctal.test(str)) {
    base = 8;
  } else {
    throw Error(invalidArgument + str);
  }
  i = str.search(/p/i);
  if (i > 0) {
    p = +str.slice(i + 1);
    str = str.substring(2, i);
  } else {
    str = str.slice(2);
  }
  i = str.indexOf(".");
  isFloat = i >= 0;
  Ctor = x.constructor;
  if (isFloat) {
    str = str.replace(".", "");
    len = str.length;
    i = len - i;
    divisor = intPow(Ctor, new Ctor(base), i, i * 2);
  }
  xd = convertBase(str, base, BASE);
  xe = xd.length - 1;
  for (i = xe; xd[i] === 0; --i) xd.pop();
  if (i < 0) return new Ctor(x.s * 0);
  x.e = getBase10Exponent(xd, xe);
  x.d = xd;
  external = false;
  if (isFloat) x = divide(x, divisor, len * 4);
  if (p) x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
  external = true;
  return x;
}
function sine(Ctor, x) {
  var k, len = x.d.length;
  if (len < 3) {
    return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
  }
  k = 1.4 * Math.sqrt(len);
  k = k > 16 ? 16 : k | 0;
  x = x.times(1 / tinyPow(5, k));
  x = taylorSeries(Ctor, 2, x, x);
  var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
  for (; k--; ) {
    sin2_x = x.times(x);
    x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
  }
  return x;
}
function taylorSeries(Ctor, n, x, y, isHyperbolic) {
  var j, t, u, x2, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
  external = false;
  x2 = x.times(x);
  u = new Ctor(y);
  for (; ; ) {
    t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
    u = isHyperbolic ? y.plus(t) : y.minus(t);
    y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
    t = u.plus(y);
    if (t.d[k] !== void 0) {
      for (j = k; t.d[j] === u.d[j] && j--; ) ;
      if (j == -1) break;
    }
    j = u;
    u = y;
    y = t;
    t = j;
  }
  external = true;
  t.d.length = k + 1;
  return t;
}
function tinyPow(b, e) {
  var n = b;
  while (--e) n *= b;
  return n;
}
function toLessThanHalfPi(Ctor, x) {
  var t, isNeg = x.s < 0, pi = getPi(Ctor, Ctor.precision, 1), halfPi = pi.times(0.5);
  x = x.abs();
  if (x.lte(halfPi)) {
    quadrant = isNeg ? 4 : 1;
    return x;
  }
  t = x.divToInt(pi);
  if (t.isZero()) {
    quadrant = isNeg ? 3 : 2;
  } else {
    x = x.minus(t.times(pi));
    if (x.lte(halfPi)) {
      quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
      return x;
    }
    quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
  }
  return x.minus(pi).abs();
}
function toStringBinary(x, baseOut, sd, rm) {
  var base, e, i, k, len, roundUp, str, xd, y, Ctor = x.constructor, isExp = sd !== void 0;
  if (isExp) {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
  } else {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  }
  if (!x.isFinite()) {
    str = nonFiniteToString(x);
  } else {
    str = finiteToString(x);
    i = str.indexOf(".");
    if (isExp) {
      base = 2;
      if (baseOut == 16) {
        sd = sd * 4 - 3;
      } else if (baseOut == 8) {
        sd = sd * 3 - 2;
      }
    } else {
      base = baseOut;
    }
    if (i >= 0) {
      str = str.replace(".", "");
      y = new Ctor(1);
      y.e = str.length - i;
      y.d = convertBase(finiteToString(y), 10, base);
      y.e = y.d.length;
    }
    xd = convertBase(str, 10, base);
    e = len = xd.length;
    for (; xd[--len] == 0; ) xd.pop();
    if (!xd[0]) {
      str = isExp ? "0p+0" : "0";
    } else {
      if (i < 0) {
        e--;
      } else {
        x = new Ctor(x);
        x.d = xd;
        x.e = e;
        x = divide(x, y, sd, rm, 0, base);
        xd = x.d;
        e = x.e;
        roundUp = inexact;
      }
      i = xd[sd];
      k = base / 2;
      roundUp = roundUp || xd[sd + 1] !== void 0;
      roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
      xd.length = sd;
      if (roundUp) {
        for (; ++xd[--sd] > base - 1; ) {
          xd[sd] = 0;
          if (!sd) {
            ++e;
            xd.unshift(1);
          }
        }
      }
      for (len = xd.length; !xd[len - 1]; --len) ;
      for (i = 0, str = ""; i < len; i++) str += NUMERALS.charAt(xd[i]);
      if (isExp) {
        if (len > 1) {
          if (baseOut == 16 || baseOut == 8) {
            i = baseOut == 16 ? 4 : 3;
            for (--len; len % i; len++) str += "0";
            xd = convertBase(str, base, baseOut);
            for (len = xd.length; !xd[len - 1]; --len) ;
            for (i = 1, str = "1."; i < len; i++) str += NUMERALS.charAt(xd[i]);
          } else {
            str = str.charAt(0) + "." + str.slice(1);
          }
        }
        str = str + (e < 0 ? "p" : "p+") + e;
      } else if (e < 0) {
        for (; ++e; ) str = "0" + str;
        str = "0." + str;
      } else {
        if (++e > len) for (e -= len; e--; ) str += "0";
        else if (e < len) str = str.slice(0, e) + "." + str.slice(e);
      }
    }
    str = (baseOut == 16 ? "0x" : baseOut == 2 ? "0b" : baseOut == 8 ? "0o" : "") + str;
  }
  return x.s < 0 ? "-" + str : str;
}
function truncate(arr, len) {
  if (arr.length > len) {
    arr.length = len;
    return true;
  }
}
function abs(x) {
  return new this(x).abs();
}
function acos(x) {
  return new this(x).acos();
}
function acosh(x) {
  return new this(x).acosh();
}
function add$1(x, y) {
  return new this(x).plus(y);
}
function asin(x) {
  return new this(x).asin();
}
function asinh(x) {
  return new this(x).asinh();
}
function atan(x) {
  return new this(x).atan();
}
function atanh(x) {
  return new this(x).atanh();
}
function atan2(y, x) {
  y = new this(y);
  x = new this(x);
  var r2, pr = this.precision, rm = this.rounding, wpr = pr + 4;
  if (!y.s || !x.s) {
    r2 = new this(NaN);
  } else if (!y.d && !x.d) {
    r2 = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
    r2.s = y.s;
  } else if (!x.d || y.isZero()) {
    r2 = x.s < 0 ? getPi(this, pr, rm) : new this(0);
    r2.s = y.s;
  } else if (!y.d || x.isZero()) {
    r2 = getPi(this, wpr, 1).times(0.5);
    r2.s = y.s;
  } else if (x.s < 0) {
    this.precision = wpr;
    this.rounding = 1;
    r2 = this.atan(divide(y, x, wpr, 1));
    x = getPi(this, wpr, 1);
    this.precision = pr;
    this.rounding = rm;
    r2 = y.s < 0 ? r2.minus(x) : r2.plus(x);
  } else {
    r2 = this.atan(divide(y, x, wpr, 1));
  }
  return r2;
}
function cbrt(x) {
  return new this(x).cbrt();
}
function ceil(x) {
  return finalise(x = new this(x), x.e + 1, 2);
}
function clamp(x, min2, max3) {
  return new this(x).clamp(min2, max3);
}
function config(obj) {
  if (!obj || typeof obj !== "object") throw Error(decimalError + "Object expected");
  var i, p, v, useDefaults = obj.defaults === true, ps = [
    "precision",
    1,
    MAX_DIGITS,
    "rounding",
    0,
    8,
    "toExpNeg",
    -9e15,
    0,
    "toExpPos",
    0,
    EXP_LIMIT,
    "maxE",
    0,
    EXP_LIMIT,
    "minE",
    -9e15,
    0,
    "modulo",
    0,
    9
  ];
  for (i = 0; i < ps.length; i += 3) {
    if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
      else throw Error(invalidArgument + p + ": " + v);
    }
  }
  if (p = "crypto", useDefaults) this[p] = DEFAULTS[p];
  if ((v = obj[p]) !== void 0) {
    if (v === true || v === false || v === 0 || v === 1) {
      if (v) {
        if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
          this[p] = true;
        } else {
          throw Error(cryptoUnavailable);
        }
      } else {
        this[p] = false;
      }
    } else {
      throw Error(invalidArgument + p + ": " + v);
    }
  }
  return this;
}
function cos(x) {
  return new this(x).cos();
}
function cosh(x) {
  return new this(x).cosh();
}
function clone(obj) {
  var i, p, ps;
  function Decimal2(v) {
    var e, i2, t, x = this;
    if (!(x instanceof Decimal2)) return new Decimal2(v);
    x.constructor = Decimal2;
    if (isDecimalInstance(v)) {
      x.s = v.s;
      if (external) {
        if (!v.d || v.e > Decimal2.maxE) {
          x.e = NaN;
          x.d = null;
        } else if (v.e < Decimal2.minE) {
          x.e = 0;
          x.d = [0];
        } else {
          x.e = v.e;
          x.d = v.d.slice();
        }
      } else {
        x.e = v.e;
        x.d = v.d ? v.d.slice() : v.d;
      }
      return;
    }
    t = typeof v;
    if (t === "number") {
      if (v === 0) {
        x.s = 1 / v < 0 ? -1 : 1;
        x.e = 0;
        x.d = [0];
        return;
      }
      if (v < 0) {
        v = -v;
        x.s = -1;
      } else {
        x.s = 1;
      }
      if (v === ~~v && v < 1e7) {
        for (e = 0, i2 = v; i2 >= 10; i2 /= 10) e++;
        if (external) {
          if (e > Decimal2.maxE) {
            x.e = NaN;
            x.d = null;
          } else if (e < Decimal2.minE) {
            x.e = 0;
            x.d = [0];
          } else {
            x.e = e;
            x.d = [v];
          }
        } else {
          x.e = e;
          x.d = [v];
        }
        return;
      }
      if (v * 0 !== 0) {
        if (!v) x.s = NaN;
        x.e = NaN;
        x.d = null;
        return;
      }
      return parseDecimal(x, v.toString());
    }
    if (t === "string") {
      if ((i2 = v.charCodeAt(0)) === 45) {
        v = v.slice(1);
        x.s = -1;
      } else {
        if (i2 === 43) v = v.slice(1);
        x.s = 1;
      }
      return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
    }
    if (t === "bigint") {
      if (v < 0) {
        v = -v;
        x.s = -1;
      } else {
        x.s = 1;
      }
      return parseDecimal(x, v.toString());
    }
    throw Error(invalidArgument + v);
  }
  Decimal2.prototype = P;
  Decimal2.ROUND_UP = 0;
  Decimal2.ROUND_DOWN = 1;
  Decimal2.ROUND_CEIL = 2;
  Decimal2.ROUND_FLOOR = 3;
  Decimal2.ROUND_HALF_UP = 4;
  Decimal2.ROUND_HALF_DOWN = 5;
  Decimal2.ROUND_HALF_EVEN = 6;
  Decimal2.ROUND_HALF_CEIL = 7;
  Decimal2.ROUND_HALF_FLOOR = 8;
  Decimal2.EUCLID = 9;
  Decimal2.config = Decimal2.set = config;
  Decimal2.clone = clone;
  Decimal2.isDecimal = isDecimalInstance;
  Decimal2.abs = abs;
  Decimal2.acos = acos;
  Decimal2.acosh = acosh;
  Decimal2.add = add$1;
  Decimal2.asin = asin;
  Decimal2.asinh = asinh;
  Decimal2.atan = atan;
  Decimal2.atanh = atanh;
  Decimal2.atan2 = atan2;
  Decimal2.cbrt = cbrt;
  Decimal2.ceil = ceil;
  Decimal2.clamp = clamp;
  Decimal2.cos = cos;
  Decimal2.cosh = cosh;
  Decimal2.div = div;
  Decimal2.exp = exp;
  Decimal2.floor = floor;
  Decimal2.hypot = hypot;
  Decimal2.ln = ln;
  Decimal2.log = log;
  Decimal2.log10 = log10;
  Decimal2.log2 = log2;
  Decimal2.max = max$1;
  Decimal2.min = min;
  Decimal2.mod = mod;
  Decimal2.mul = mul;
  Decimal2.pow = pow;
  Decimal2.random = random;
  Decimal2.round = round;
  Decimal2.sign = sign;
  Decimal2.sin = sin;
  Decimal2.sinh = sinh;
  Decimal2.sqrt = sqrt;
  Decimal2.sub = sub;
  Decimal2.sum = sum;
  Decimal2.tan = tan;
  Decimal2.tanh = tanh;
  Decimal2.trunc = trunc;
  if (obj === void 0) obj = {};
  if (obj) {
    if (obj.defaults !== true) {
      ps = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"];
      for (i = 0; i < ps.length; ) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }
  }
  Decimal2.config(obj);
  return Decimal2;
}
function div(x, y) {
  return new this(x).div(y);
}
function exp(x) {
  return new this(x).exp();
}
function floor(x) {
  return finalise(x = new this(x), x.e + 1, 3);
}
function hypot() {
  var i, n, t = new this(0);
  external = false;
  for (i = 0; i < arguments.length; ) {
    n = new this(arguments[i++]);
    if (!n.d) {
      if (n.s) {
        external = true;
        return new this(1 / 0);
      }
      t = n;
    } else if (t.d) {
      t = t.plus(n.times(n));
    }
  }
  external = true;
  return t.sqrt();
}
function isDecimalInstance(obj) {
  return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
}
function ln(x) {
  return new this(x).ln();
}
function log(x, y) {
  return new this(x).log(y);
}
function log2(x) {
  return new this(x).log(2);
}
function log10(x) {
  return new this(x).log(10);
}
function max$1() {
  return maxOrMin(this, arguments, -1);
}
function min() {
  return maxOrMin(this, arguments, 1);
}
function mod(x, y) {
  return new this(x).mod(y);
}
function mul(x, y) {
  return new this(x).mul(y);
}
function pow(x, y) {
  return new this(x).pow(y);
}
function random(sd) {
  var d, e, k, n, i = 0, r2 = new this(1), rd = [];
  if (sd === void 0) sd = this.precision;
  else checkInt32(sd, 1, MAX_DIGITS);
  k = Math.ceil(sd / LOG_BASE);
  if (!this.crypto) {
    for (; i < k; ) rd[i++] = Math.random() * 1e7 | 0;
  } else if (crypto.getRandomValues) {
    d = crypto.getRandomValues(new Uint32Array(k));
    for (; i < k; ) {
      n = d[i];
      if (n >= 429e7) {
        d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
      } else {
        rd[i++] = n % 1e7;
      }
    }
  } else if (crypto.randomBytes) {
    d = crypto.randomBytes(k *= 4);
    for (; i < k; ) {
      n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 127) << 24);
      if (n >= 214e7) {
        crypto.randomBytes(4).copy(d, i);
      } else {
        rd.push(n % 1e7);
        i += 4;
      }
    }
    i = k / 4;
  } else {
    throw Error(cryptoUnavailable);
  }
  k = rd[--i];
  sd %= LOG_BASE;
  if (k && sd) {
    n = mathpow(10, LOG_BASE - sd);
    rd[i] = (k / n | 0) * n;
  }
  for (; rd[i] === 0; i--) rd.pop();
  if (i < 0) {
    e = 0;
    rd = [0];
  } else {
    e = -1;
    for (; rd[0] === 0; e -= LOG_BASE) rd.shift();
    for (k = 1, n = rd[0]; n >= 10; n /= 10) k++;
    if (k < LOG_BASE) e -= LOG_BASE - k;
  }
  r2.e = e;
  r2.d = rd;
  return r2;
}
function round(x) {
  return finalise(x = new this(x), x.e + 1, this.rounding);
}
function sign(x) {
  x = new this(x);
  return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
}
function sin(x) {
  return new this(x).sin();
}
function sinh(x) {
  return new this(x).sinh();
}
function sqrt(x) {
  return new this(x).sqrt();
}
function sub(x, y) {
  return new this(x).sub(y);
}
function sum() {
  var i = 0, args = arguments, x = new this(args[i]);
  external = false;
  for (; x.s && ++i < args.length; ) x = x.plus(args[i]);
  external = true;
  return finalise(x, this.precision, this.rounding);
}
function tan(x) {
  return new this(x).tan();
}
function tanh(x) {
  return new this(x).tanh();
}
function trunc(x) {
  return finalise(x = new this(x), x.e + 1, 1);
}
P[Symbol.for("nodejs.util.inspect.custom")] = P.toString;
P[Symbol.toStringTag] = "Decimal";
var Decimal = P.constructor = clone(DEFAULTS);
LN10 = new Decimal(LN10);
PI = new Decimal(PI);
var names = {
  aliceblue: "f0f8ff",
  antiquewhite: "faebd7",
  aqua: "0ff",
  aquamarine: "7fffd4",
  azure: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "000",
  blanchedalmond: "ffebcd",
  blue: "00f",
  blueviolet: "8a2be2",
  brown: "a52a2a",
  burlywood: "deb887",
  burntsienna: "ea7e5d",
  cadetblue: "5f9ea0",
  chartreuse: "7fff00",
  chocolate: "d2691e",
  coral: "ff7f50",
  cornflowerblue: "6495ed",
  cornsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "0ff",
  darkblue: "00008b",
  darkcyan: "008b8b",
  darkgoldenrod: "b8860b",
  darkgray: "a9a9a9",
  darkgreen: "006400",
  darkgrey: "a9a9a9",
  darkkhaki: "bdb76b",
  darkmagenta: "8b008b",
  darkolivegreen: "556b2f",
  darkorange: "ff8c00",
  darkorchid: "9932cc",
  darkred: "8b0000",
  darksalmon: "e9967a",
  darkseagreen: "8fbc8f",
  darkslateblue: "483d8b",
  darkslategray: "2f4f4f",
  darkslategrey: "2f4f4f",
  darkturquoise: "00ced1",
  darkviolet: "9400d3",
  deeppink: "ff1493",
  deepskyblue: "00bfff",
  dimgray: "696969",
  dimgrey: "696969",
  dodgerblue: "1e90ff",
  firebrick: "b22222",
  floralwhite: "fffaf0",
  forestgreen: "228b22",
  fuchsia: "f0f",
  gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff",
  gold: "ffd700",
  goldenrod: "daa520",
  gray: "808080",
  green: "008000",
  greenyellow: "adff2f",
  grey: "808080",
  honeydew: "f0fff0",
  hotpink: "ff69b4",
  indianred: "cd5c5c",
  indigo: "4b0082",
  ivory: "fffff0",
  khaki: "f0e68c",
  lavender: "e6e6fa",
  lavenderblush: "fff0f5",
  lawngreen: "7cfc00",
  lemonchiffon: "fffacd",
  lightblue: "add8e6",
  lightcoral: "f08080",
  lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2",
  lightgray: "d3d3d3",
  lightgreen: "90ee90",
  lightgrey: "d3d3d3",
  lightpink: "ffb6c1",
  lightsalmon: "ffa07a",
  lightseagreen: "20b2aa",
  lightskyblue: "87cefa",
  lightslategray: "789",
  lightslategrey: "789",
  lightsteelblue: "b0c4de",
  lightyellow: "ffffe0",
  lime: "0f0",
  limegreen: "32cd32",
  linen: "faf0e6",
  magenta: "f0f",
  maroon: "800000",
  mediumaquamarine: "66cdaa",
  mediumblue: "0000cd",
  mediumorchid: "ba55d3",
  mediumpurple: "9370db",
  mediumseagreen: "3cb371",
  mediumslateblue: "7b68ee",
  mediumspringgreen: "00fa9a",
  mediumturquoise: "48d1cc",
  mediumvioletred: "c71585",
  midnightblue: "191970",
  mintcream: "f5fffa",
  mistyrose: "ffe4e1",
  moccasin: "ffe4b5",
  navajowhite: "ffdead",
  navy: "000080",
  oldlace: "fdf5e6",
  olive: "808000",
  olivedrab: "6b8e23",
  orange: "ffa500",
  orangered: "ff4500",
  orchid: "da70d6",
  palegoldenrod: "eee8aa",
  palegreen: "98fb98",
  paleturquoise: "afeeee",
  palevioletred: "db7093",
  papayawhip: "ffefd5",
  peachpuff: "ffdab9",
  peru: "cd853f",
  pink: "ffc0cb",
  plum: "dda0dd",
  powderblue: "b0e0e6",
  purple: "800080",
  rebeccapurple: "663399",
  red: "f00",
  rosybrown: "bc8f8f",
  royalblue: "4169e1",
  saddlebrown: "8b4513",
  salmon: "fa8072",
  sandybrown: "f4a460",
  seagreen: "2e8b57",
  seashell: "fff5ee",
  sienna: "a0522d",
  silver: "c0c0c0",
  skyblue: "87ceeb",
  slateblue: "6a5acd",
  slategray: "708090",
  slategrey: "708090",
  snow: "fffafa",
  springgreen: "00ff7f",
  steelblue: "4682b4",
  tan: "d2b48c",
  teal: "008080",
  thistle: "d8bfd8",
  tomato: "ff6347",
  turquoise: "40e0d0",
  violet: "ee82ee",
  wheat: "f5deb3",
  white: "fff",
  whitesmoke: "f5f5f5",
  yellow: "ff0",
  yellowgreen: "9acd32"
};
flip$1(names);
function flip$1(o) {
  var flipped = {};
  for (var i in o) {
    if (o.hasOwnProperty(i)) {
      flipped[o[i]] = i;
    }
  }
  return flipped;
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var dayjs_min = { exports: {} };
(function(module, exports) {
  !function(t, e) {
    module.exports = e();
  }(commonjsGlobal, function() {
    var t = 1e3, e = 6e4, n = 36e5, r2 = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
      var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
      return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
    } }, m = function(t2, e2, n2) {
      var r3 = String(t2);
      return !r3 || r3.length >= e2 ? t2 : "" + Array(e2 + 1 - r3.length).join(n2) + t2;
    }, v = { s: m, z: function(t2) {
      var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r3 = Math.floor(n2 / 60), i2 = n2 % 60;
      return (e2 <= 0 ? "+" : "-") + m(r3, 2, "0") + ":" + m(i2, 2, "0");
    }, m: function t2(e2, n2) {
      if (e2.date() < n2.date()) return -t2(n2, e2);
      var r3 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r3, c), s2 = n2 - i2 < 0, u2 = e2.clone().add(r3 + (s2 ? -1 : 1), c);
      return +(-(r3 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
    }, a: function(t2) {
      return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
    }, p: function(t2) {
      return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r2, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
    }, u: function(t2) {
      return void 0 === t2;
    } }, g = "en", D = {};
    D[g] = M;
    var p = "$isDayjsObject", S = function(t2) {
      return t2 instanceof _ || !(!t2 || !t2[p]);
    }, w = function t2(e2, n2, r3) {
      var i2;
      if (!e2) return g;
      if ("string" == typeof e2) {
        var s2 = e2.toLowerCase();
        D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
        var u2 = e2.split("-");
        if (!i2 && u2.length > 1) return t2(u2[0]);
      } else {
        var a2 = e2.name;
        D[a2] = e2, i2 = a2;
      }
      return !r3 && i2 && (g = i2), i2 || !r3 && g;
    }, O = function(t2, e2) {
      if (S(t2)) return t2.clone();
      var n2 = "object" == typeof e2 ? e2 : {};
      return n2.date = t2, n2.args = arguments, new _(n2);
    }, b = v;
    b.l = w, b.i = S, b.w = function(t2, e2) {
      return O(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
    };
    var _ = function() {
      function M2(t2) {
        this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
      }
      var m2 = M2.prototype;
      return m2.parse = function(t2) {
        this.$d = function(t3) {
          var e2 = t3.date, n2 = t3.utc;
          if (null === e2) return /* @__PURE__ */ new Date(NaN);
          if (b.u(e2)) return /* @__PURE__ */ new Date();
          if (e2 instanceof Date) return new Date(e2);
          if ("string" == typeof e2 && !/Z$/i.test(e2)) {
            var r3 = e2.match($);
            if (r3) {
              var i2 = r3[2] - 1 || 0, s2 = (r3[7] || "0").substring(0, 3);
              return n2 ? new Date(Date.UTC(r3[1], i2, r3[3] || 1, r3[4] || 0, r3[5] || 0, r3[6] || 0, s2)) : new Date(r3[1], i2, r3[3] || 1, r3[4] || 0, r3[5] || 0, r3[6] || 0, s2);
            }
          }
          return new Date(e2);
        }(t2), this.init();
      }, m2.init = function() {
        var t2 = this.$d;
        this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
      }, m2.$utils = function() {
        return b;
      }, m2.isValid = function() {
        return !(this.$d.toString() === l);
      }, m2.isSame = function(t2, e2) {
        var n2 = O(t2);
        return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
      }, m2.isAfter = function(t2, e2) {
        return O(t2) < this.startOf(e2);
      }, m2.isBefore = function(t2, e2) {
        return this.endOf(e2) < O(t2);
      }, m2.$g = function(t2, e2, n2) {
        return b.u(t2) ? this[e2] : this.set(n2, t2);
      }, m2.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, m2.valueOf = function() {
        return this.$d.getTime();
      }, m2.startOf = function(t2, e2) {
        var n2 = this, r3 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
          var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
          return r3 ? i2 : i2.endOf(a);
        }, $2 = function(t3, e3) {
          return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r3 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
        }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
        switch (f2) {
          case h:
            return r3 ? l2(1, 0) : l2(31, 11);
          case c:
            return r3 ? l2(1, M3) : l2(0, M3 + 1);
          case o:
            var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
            return l2(r3 ? m3 - D2 : m3 + (6 - D2), M3);
          case a:
          case d:
            return $2(v2 + "Hours", 0);
          case u:
            return $2(v2 + "Minutes", 1);
          case s:
            return $2(v2 + "Seconds", 2);
          case i:
            return $2(v2 + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, m2.endOf = function(t2) {
        return this.startOf(t2, false);
      }, m2.$set = function(t2, e2) {
        var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r2] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
        if (o2 === c || o2 === h) {
          var y2 = this.clone().set(d, 1);
          y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
        } else l2 && this.$d[l2]($2);
        return this.init(), this;
      }, m2.set = function(t2, e2) {
        return this.clone().$set(t2, e2);
      }, m2.get = function(t2) {
        return this[b.p(t2)]();
      }, m2.add = function(r3, f2) {
        var d2, l2 = this;
        r3 = Number(r3);
        var $2 = b.p(f2), y2 = function(t2) {
          var e2 = O(l2);
          return b.w(e2.date(e2.date() + Math.round(t2 * r3)), l2);
        };
        if ($2 === c) return this.set(c, this.$M + r3);
        if ($2 === h) return this.set(h, this.$y + r3);
        if ($2 === a) return y2(1);
        if ($2 === o) return y2(7);
        var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r3 * M3;
        return b.w(m3, this);
      }, m2.subtract = function(t2, e2) {
        return this.add(-1 * t2, e2);
      }, m2.format = function(t2) {
        var e2 = this, n2 = this.$locale();
        if (!this.isValid()) return n2.invalidDate || l;
        var r3 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s3) {
          return t3 && (t3[n3] || t3(e2, r3)) || i3[n3].slice(0, s3);
        }, d2 = function(t3) {
          return b.s(s2 % 12 || 12, t3, "0");
        }, $2 = f2 || function(t3, e3, n3) {
          var r4 = t3 < 12 ? "AM" : "PM";
          return n3 ? r4.toLowerCase() : r4;
        };
        return r3.replace(y, function(t3, r4) {
          return r4 || function(t4) {
            switch (t4) {
              case "YY":
                return String(e2.$y).slice(-2);
              case "YYYY":
                return b.s(e2.$y, 4, "0");
              case "M":
                return a2 + 1;
              case "MM":
                return b.s(a2 + 1, 2, "0");
              case "MMM":
                return h2(n2.monthsShort, a2, c2, 3);
              case "MMMM":
                return h2(c2, a2);
              case "D":
                return e2.$D;
              case "DD":
                return b.s(e2.$D, 2, "0");
              case "d":
                return String(e2.$W);
              case "dd":
                return h2(n2.weekdaysMin, e2.$W, o2, 2);
              case "ddd":
                return h2(n2.weekdaysShort, e2.$W, o2, 3);
              case "dddd":
                return o2[e2.$W];
              case "H":
                return String(s2);
              case "HH":
                return b.s(s2, 2, "0");
              case "h":
                return d2(1);
              case "hh":
                return d2(2);
              case "a":
                return $2(s2, u2, true);
              case "A":
                return $2(s2, u2, false);
              case "m":
                return String(u2);
              case "mm":
                return b.s(u2, 2, "0");
              case "s":
                return String(e2.$s);
              case "ss":
                return b.s(e2.$s, 2, "0");
              case "SSS":
                return b.s(e2.$ms, 3, "0");
              case "Z":
                return i2;
            }
            return null;
          }(t3) || i2.replace(":", "");
        });
      }, m2.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, m2.diff = function(r3, d2, l2) {
        var $2, y2 = this, M3 = b.p(d2), m3 = O(r3), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
          return b.m(y2, m3);
        };
        switch (M3) {
          case h:
            $2 = D2() / 12;
            break;
          case c:
            $2 = D2();
            break;
          case f:
            $2 = D2() / 3;
            break;
          case o:
            $2 = (g2 - v2) / 6048e5;
            break;
          case a:
            $2 = (g2 - v2) / 864e5;
            break;
          case u:
            $2 = g2 / n;
            break;
          case s:
            $2 = g2 / e;
            break;
          case i:
            $2 = g2 / t;
            break;
          default:
            $2 = g2;
        }
        return l2 ? $2 : b.a($2);
      }, m2.daysInMonth = function() {
        return this.endOf(c).$D;
      }, m2.$locale = function() {
        return D[this.$L];
      }, m2.locale = function(t2, e2) {
        if (!t2) return this.$L;
        var n2 = this.clone(), r3 = w(t2, e2, true);
        return r3 && (n2.$L = r3), n2;
      }, m2.clone = function() {
        return b.w(this.$d, this);
      }, m2.toDate = function() {
        return new Date(this.valueOf());
      }, m2.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, m2.toISOString = function() {
        return this.$d.toISOString();
      }, m2.toString = function() {
        return this.$d.toUTCString();
      }, M2;
    }(), k = _.prototype;
    return O.prototype = k, [["$ms", r2], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t2) {
      k[t2[1]] = function(e2) {
        return this.$g(e2, t2[0], t2[1]);
      };
    }), O.extend = function(t2, e2) {
      return t2.$i || (t2(e2, _, O), t2.$i = true), O;
    }, O.locale = w, O.isDayjs = S, O.unix = function(t2) {
      return O(1e3 * t2);
    }, O.en = D[g], O.Ls = D, O.p = {}, O;
  });
})(dayjs_min);
var isBetween = { exports: {} };
(function(module, exports) {
  !function(e, i) {
    module.exports = i();
  }(commonjsGlobal, function() {
    return function(e, i, t) {
      i.prototype.isBetween = function(e2, i2, s, f) {
        var n = t(e2), o = t(i2), r2 = "(" === (f = f || "()")[0], u = ")" === f[1];
        return (r2 ? this.isAfter(n, s) : !this.isBefore(n, s)) && (u ? this.isBefore(o, s) : !this.isAfter(o, s)) || (r2 ? this.isBefore(n, s) : !this.isAfter(n, s)) && (u ? this.isAfter(o, s) : !this.isBefore(o, s));
      };
    };
  });
})(isBetween);
const createKMenu = (options, onOpenChange, onSelect, onClick, onDeSelect, removeBorderStyleBg, getParentDom) => {
  return {
    /**
     * @internal
     */
    __propHandleEvtMap: [],
    __dynamicProps: Object.assign({}, options),
    __openUids: new Set(options.openUids),
    __selectedUids: new Set(options.selectedUids),
    __selectedItems: /* @__PURE__ */ new Map(),
    syncUids(uid, type3, opType = "add") {
      let uids = uid;
      if (isString(uid)) {
        uids = [uid];
      }
      if (isArray(uids)) {
        uids.forEach((id) => {
          type3 === "open" ? this.__openUids[opType](id) : this.__selectedUids[opType](id);
        });
      }
    },
    syncSelectedItems(item, opType = "set") {
      var _a, _b;
      const { uid } = item;
      if (opType === "set") {
        (_a = this.__selectedItems) === null || _a === void 0 ? void 0 : _a.set(uid, item);
      }
      if (opType === "delete") {
        (_b = this.__selectedItems) === null || _b === void 0 ? void 0 : _b.delete(uid);
      }
    },
    onOpenChange,
    onSelect,
    onClick,
    onDeSelect,
    removeBorderStyleBg,
    getParentDom
  };
};
function transitionIn(node) {
  return {
    duration: 300,
    tick: (t) => {
      if (t === 0) {
        node.style.height = "0";
      } else if (t === 1) {
        node.style.removeProperty("height");
      } else {
        node.style.height = node.scrollHeight + "px";
      }
    }
  };
}
function transitionOut(node) {
  const orgHeight = node.scrollHeight;
  return {
    duration: 300,
    tick: (t) => {
      if (t <= 1 && t >= 0.9) {
        node.style.height = orgHeight + "px";
      } else if (t === 0) {
        node.style.removeProperty("height");
      } else {
        node.style.height = "0";
      }
    }
  };
}
function getUidPath(uid, list, path = []) {
  for (const node of list) {
    if (node.uid === uid) {
      return path.concat(uid);
    }
    if (node.children && node.children.length > 0) {
      const newPath = path.concat(node.uid);
      const result = getUidPath(uid, node.children, newPath);
      if (result) {
        return result;
      }
    }
  }
  return null;
}
function create_if_block$2(ctx) {
  let div2;
  let ul;
  let ul_intro;
  let ul_outro;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[24].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[23],
    null
  );
  let ul_levels = [
    { class: (
      /*cnames*/
      ctx[5]
    ) },
    /*$$restProps*/
    ctx[6],
    /*attrs*/
    ctx[0]
  ];
  let ul_data = {};
  for (let i = 0; i < ul_levels.length; i += 1) {
    ul_data = assign(ul_data, ul_levels[i]);
  }
  return {
    c() {
      div2 = element("div");
      ul = element("ul");
      if (default_slot) default_slot.c();
      set_attributes(ul, ul_data);
      set_style(
        ul,
        "border-color",
        /*bdBg*/
        ctx[2]
      );
      set_style(ul, "transition", `height 0.3s`);
      attr(
        div2,
        "class",
        /*darkCls*/
        ctx[4]
      );
      attr(div2, "role", "menu");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, ul);
      if (default_slot) {
        default_slot.m(ul, null);
      }
      ctx[25](div2);
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty[0] & /*$$scope*/
        8388608)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[23],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[23]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[23],
              dirty,
              null
            ),
            null
          );
        }
      }
      set_attributes(ul, ul_data = get_spread_update(ul_levels, [
        (!current || dirty[0] & /*cnames*/
        32) && { class: (
          /*cnames*/
          ctx2[5]
        ) },
        dirty[0] & /*$$restProps*/
        64 && /*$$restProps*/
        ctx2[6],
        dirty[0] & /*attrs*/
        1 && /*attrs*/
        ctx2[0]
      ]));
      set_style(
        ul,
        "border-color",
        /*bdBg*/
        ctx2[2]
      );
      set_style(ul, "transition", `height 0.3s`);
      if (!current || dirty[0] & /*darkCls*/
      16) {
        attr(
          div2,
          "class",
          /*darkCls*/
          ctx2[4]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      if (local) {
        add_render_callback(() => {
          if (!current) return;
          if (ul_outro) ul_outro.end(1);
          ul_intro = create_in_transition(ul, transitionIn, {});
          ul_intro.start();
        });
      }
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      if (ul_intro) ul_intro.invalidate();
      if (local) {
        ul_outro = create_out_transition(ul, transitionOut, {});
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (default_slot) default_slot.d(detaching);
      if (detaching && ul_outro) ul_outro.end();
      ctx[25](null);
    }
  };
}
function create_fragment$b(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*show*/
    ctx[1] && create_if_block$2(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*show*/
        ctx2[1]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*show*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let cnames;
  let darkCls;
  const omit_props_names = [
    "triggerSubMenuAction",
    "subMenuCloseDelay",
    "subMenuOpenDelay",
    "inlineIndent",
    "expandIcon",
    "mode",
    "cls",
    "attrs",
    "selectedUids",
    "openUids",
    "show",
    "multiple",
    "selectable",
    "inlineCollapsed",
    "ctxKey",
    "theme"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { triggerSubMenuAction = "hover" } = $$props;
  let { subMenuCloseDelay = 100 } = $$props;
  let { subMenuOpenDelay = 0 } = $$props;
  let { inlineIndent = 24 } = $$props;
  let { expandIcon = "" } = $$props;
  let { mode = "vertical" } = $$props;
  let { cls = void 0 } = $$props;
  let { attrs = {} } = $$props;
  let { selectedUids = [] } = $$props;
  let { openUids = [] } = $$props;
  let { show = true } = $$props;
  let { multiple = false } = $$props;
  let { selectable = true } = $$props;
  let { inlineCollapsed = false } = $$props;
  let { ctxKey = "" } = $$props;
  let { theme = void 0 } = $$props;
  const dispatch2 = createEventDispatcher();
  function onOpenChange(openUids2) {
    dispatch2("openChange", openUids2);
  }
  function onSelect(data) {
    dispatch2("select", data);
  }
  function onClick(data) {
    dispatch2("click", data);
  }
  function onDeSelect(data) {
    dispatch2("deSelect", data);
  }
  let bdBg = "transparent";
  function removeBorderStyleBg() {
    $$invalidate(2, bdBg = "");
  }
  let menuRef = null;
  function getParentDom() {
    if (menuRef) {
      return menuRef.parentElement;
    }
  }
  let resolveMode = mode;
  const menuInst = createKMenu(
    {
      inlineCollapsed,
      triggerSubMenuAction,
      subMenuCloseDelay,
      subMenuOpenDelay,
      expandIcon,
      mode: inlineCollapsed && mode !== "horizontal" ? "vertical" : mode,
      inlineIndent,
      openUids,
      selectedUids,
      multiple,
      theme,
      selectable,
      attrs,
      ctxKey
    },
    onOpenChange,
    onSelect,
    onClick,
    onDeSelect,
    removeBorderStyleBg,
    getParentDom
  );
  const setContextFn = () => {
    if (!getContext(ctxKey || menuKey)) {
      setContext(ctxKey || menuKey, menuInst);
    }
  };
  setContextFn();
  const prefixCls = getPrefixCls("menu");
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      menuRef = $$value;
      $$invalidate(3, menuRef);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("triggerSubMenuAction" in $$new_props) $$invalidate(7, triggerSubMenuAction = $$new_props.triggerSubMenuAction);
    if ("subMenuCloseDelay" in $$new_props) $$invalidate(8, subMenuCloseDelay = $$new_props.subMenuCloseDelay);
    if ("subMenuOpenDelay" in $$new_props) $$invalidate(9, subMenuOpenDelay = $$new_props.subMenuOpenDelay);
    if ("inlineIndent" in $$new_props) $$invalidate(10, inlineIndent = $$new_props.inlineIndent);
    if ("expandIcon" in $$new_props) $$invalidate(11, expandIcon = $$new_props.expandIcon);
    if ("mode" in $$new_props) $$invalidate(12, mode = $$new_props.mode);
    if ("cls" in $$new_props) $$invalidate(13, cls = $$new_props.cls);
    if ("attrs" in $$new_props) $$invalidate(0, attrs = $$new_props.attrs);
    if ("selectedUids" in $$new_props) $$invalidate(14, selectedUids = $$new_props.selectedUids);
    if ("openUids" in $$new_props) $$invalidate(15, openUids = $$new_props.openUids);
    if ("show" in $$new_props) $$invalidate(1, show = $$new_props.show);
    if ("multiple" in $$new_props) $$invalidate(16, multiple = $$new_props.multiple);
    if ("selectable" in $$new_props) $$invalidate(17, selectable = $$new_props.selectable);
    if ("inlineCollapsed" in $$new_props) $$invalidate(18, inlineCollapsed = $$new_props.inlineCollapsed);
    if ("ctxKey" in $$new_props) $$invalidate(19, ctxKey = $$new_props.ctxKey);
    if ("theme" in $$new_props) $$invalidate(20, theme = $$new_props.theme);
    if ("$$scope" in $$new_props) $$invalidate(23, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*inlineCollapsed, mode*/
    266240) {
      {
        $$invalidate(21, resolveMode = inlineCollapsed && mode !== "horizontal" ? "vertical" : mode);
      }
    }
    if ($$self.$$.dirty[0] & /*menuInst, inlineCollapsed, triggerSubMenuAction, subMenuCloseDelay, subMenuOpenDelay, expandIcon, resolveMode, inlineIndent, openUids, theme, multiple, selectedUids, selectable, attrs, ctxKey*/
    8376193) {
      {
        menuInst.__propHandleEvtMap.forEach((cb) => {
          const props = {
            inlineCollapsed,
            triggerSubMenuAction,
            subMenuCloseDelay,
            subMenuOpenDelay,
            expandIcon,
            mode: resolveMode,
            inlineIndent,
            openUids,
            theme,
            multiple,
            selectedUids,
            selectable,
            attrs,
            ctxKey
          };
          $$invalidate(22, menuInst.__dynamicProps = props, menuInst);
          setContextFn();
          cb(props);
        });
      }
    }
    if ($$self.$$.dirty[0] & /*mode, theme, cls*/
    1060864) {
      $$invalidate(5, cnames = clsx(
        prefixCls,
        `${prefixCls}-${mode}`,
        {
          [`${prefixCls}__dark`]: theme === "dark" || theme === void 0,
          [`${prefixCls}-${mode}__dark`]: theme === "dark" || theme === void 0
        },
        cls
      ));
    }
    if ($$self.$$.dirty[0] & /*theme*/
    1048576) {
      $$invalidate(4, darkCls = clsx("overflow-hidden", { dark: theme === "dark" }));
    }
  };
  return [
    attrs,
    show,
    bdBg,
    menuRef,
    darkCls,
    cnames,
    $$restProps,
    triggerSubMenuAction,
    subMenuCloseDelay,
    subMenuOpenDelay,
    inlineIndent,
    expandIcon,
    mode,
    cls,
    selectedUids,
    openUids,
    multiple,
    selectable,
    inlineCollapsed,
    ctxKey,
    theme,
    resolveMode,
    menuInst,
    $$scope,
    slots,
    div_binding
  ];
}
class Dist13 extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$8,
      create_fragment$b,
      safe_not_equal,
      {
        triggerSubMenuAction: 7,
        subMenuCloseDelay: 8,
        subMenuOpenDelay: 9,
        inlineIndent: 10,
        expandIcon: 11,
        mode: 12,
        cls: 13,
        attrs: 0,
        selectedUids: 14,
        openUids: 15,
        show: 1,
        multiple: 16,
        selectable: 17,
        inlineCollapsed: 18,
        ctxKey: 19,
        theme: 20
      },
      null,
      [-1, -1]
    );
  }
}
const get_expandIcon_slot_changes_6 = (dirty) => ({
  item: dirty[2] & /*item*/
  262144,
  cls: dirty[0] & /*iconCls*/
  8192 | dirty[2] & /*item*/
  262144
});
const get_expandIcon_slot_context_6 = (ctx) => ({
  item: (
    /*item*/
    ctx[80]
  ),
  cls: (
    /*iconCls*/
    ctx[13](
      /*item*/
      ctx[80]
    )
  )
});
const get_label_slot_changes_6 = (dirty) => ({
  item: dirty[2] & /*item*/
  262144,
  cls: dirty[2] & /*item*/
  262144
});
const get_label_slot_context_6 = (ctx) => ({
  item: (
    /*item*/
    ctx[80]
  ),
  cls: (
    /*titleContentCls*/
    ctx[25](!!/*item*/
    ctx[80].icon)
  )
});
const get_icon_slot_changes_6 = (dirty) => ({ item: dirty[2] & /*item*/
262144 });
const get_icon_slot_context_6 = (ctx) => ({ item: (
  /*item*/
  ctx[80]
) });
const get_item_slot_changes_6 = (dirty) => ({ item: dirty[2] & /*item*/
262144 });
const get_item_slot_context_6 = (ctx) => ({ item: (
  /*item*/
  ctx[80]
) });
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[81] = list[i];
  child_ctx[82] = list;
  child_ctx[83] = i;
  return child_ctx;
}
const get_expandIcon_slot_changes_5 = (dirty) => ({
  item: dirty[0] & /*itemsList*/
  16,
  cls: dirty[0] & /*iconCls, itemsList*/
  8208
});
const get_expandIcon_slot_context_5 = (ctx) => ({
  item: (
    /*it*/
    ctx[81]
  ),
  cls: (
    /*iconCls*/
    ctx[13](
      /*it*/
      ctx[81]
    )
  )
});
const get_label_slot_changes_5 = (dirty) => ({
  item: dirty[0] & /*itemsList*/
  16,
  cls: dirty[0] & /*itemsList*/
  16
});
const get_label_slot_context_5 = (ctx) => ({
  item: (
    /*it*/
    ctx[81]
  ),
  cls: (
    /*titleContentCls*/
    ctx[25](!!/*it*/
    ctx[81].icon)
  )
});
const get_icon_slot_changes_5 = (dirty) => ({
  item: dirty[0] & /*itemsList*/
  16,
  cls: dirty[0] & /*iconCls, itemsList*/
  8208
});
const get_icon_slot_context_5 = (ctx) => ({
  item: (
    /*it*/
    ctx[81]
  ),
  cls: (
    /*iconCls*/
    ctx[13](
      /*it*/
      ctx[81]
    )
  )
});
const get_item_slot_changes_5 = (dirty) => ({ item: dirty[0] & /*itemsList*/
16 });
const get_item_slot_context_5 = (ctx) => ({ item: (
  /*it*/
  ctx[81]
) });
const get_expandIcon_slot_changes_4 = (dirty) => ({
  item: dirty[2] & /*item*/
  262144,
  cls: dirty[0] & /*iconCls*/
  8192 | dirty[2] & /*item*/
  262144
});
const get_expandIcon_slot_context_4 = (ctx) => ({
  item: (
    /*item*/
    ctx[80]
  ),
  cls: (
    /*iconCls*/
    ctx[13](
      /*item*/
      ctx[80]
    )
  )
});
const get_label_slot_changes_4 = (dirty) => ({
  item: dirty[2] & /*item*/
  262144,
  cls: dirty[2] & /*item*/
  262144
});
const get_label_slot_context_4 = (ctx) => ({
  item: (
    /*item*/
    ctx[80]
  ),
  cls: (
    /*titleContentCls*/
    ctx[25](!!/*item*/
    ctx[80].icon)
  )
});
const get_icon_slot_changes_4 = (dirty) => ({ item: dirty[2] & /*item*/
262144 });
const get_icon_slot_context_4 = (ctx) => ({ item: (
  /*item*/
  ctx[80]
) });
const get_item_slot_changes_4 = (dirty) => ({ item: dirty[2] & /*item*/
262144 });
const get_item_slot_context_4 = (ctx) => ({ item: (
  /*item*/
  ctx[80]
) });
const get_expandIcon_slot_changes_3 = (dirty) => ({
  item: dirty[0] & /*itemsList*/
  16,
  cls: dirty[0] & /*iconCls, itemsList*/
  8208
});
const get_expandIcon_slot_context_3 = (ctx) => ({
  item: (
    /*it*/
    ctx[81]
  ),
  cls: (
    /*iconCls*/
    ctx[13](
      /*it*/
      ctx[81]
    )
  )
});
const get_label_slot_changes_3 = (dirty) => ({
  item: dirty[0] & /*itemsList*/
  16,
  cls: dirty[0] & /*itemsList*/
  16
});
const get_label_slot_context_3 = (ctx) => ({
  item: (
    /*it*/
    ctx[81]
  ),
  cls: (
    /*titleContentCls*/
    ctx[25](!!/*it*/
    ctx[81].icon)
  )
});
const get_icon_slot_changes_3 = (dirty) => ({
  item: dirty[0] & /*itemsList*/
  16,
  cls: dirty[0] & /*iconCls, itemsList*/
  8208
});
const get_icon_slot_context_3 = (ctx) => ({
  item: (
    /*it*/
    ctx[81]
  ),
  cls: (
    /*iconCls*/
    ctx[13](
      /*it*/
      ctx[81]
    )
  )
});
const get_item_slot_changes_3 = (dirty) => ({ item: dirty[0] & /*itemsList*/
16 });
const get_item_slot_context_3 = (ctx) => ({ item: (
  /*it*/
  ctx[81]
) });
const get_expandIcon_slot_changes_2 = (dirty) => ({
  item: dirty[2] & /*item*/
  262144,
  cls: dirty[0] & /*iconCls*/
  8192 | dirty[2] & /*item*/
  262144
});
const get_expandIcon_slot_context_2 = (ctx) => ({
  item: (
    /*item*/
    ctx[80]
  ),
  cls: (
    /*iconCls*/
    ctx[13](
      /*item*/
      ctx[80]
    )
  )
});
const get_label_slot_changes_2 = (dirty) => ({
  item: dirty[2] & /*item*/
  262144,
  cls: dirty[2] & /*item*/
  262144
});
const get_label_slot_context_2 = (ctx) => ({
  item: (
    /*item*/
    ctx[80]
  ),
  cls: (
    /*titleContentCls*/
    ctx[25](!!/*item*/
    ctx[80].icon)
  )
});
const get_icon_slot_changes_2 = (dirty) => ({ item: dirty[2] & /*item*/
262144 });
const get_icon_slot_context_2 = (ctx) => ({ item: (
  /*item*/
  ctx[80]
) });
const get_item_slot_changes_2 = (dirty) => ({ item: dirty[2] & /*item*/
262144 });
const get_item_slot_context_2 = (ctx) => ({ item: (
  /*item*/
  ctx[80]
) });
const get_expandIcon_slot_changes_1 = (dirty) => ({
  item: dirty[2] & /*item*/
  262144,
  cls: dirty[0] & /*iconCls*/
  8192 | dirty[2] & /*item*/
  262144
});
const get_expandIcon_slot_context_1 = (ctx) => ({
  item: (
    /*item*/
    ctx[80]
  ),
  cls: (
    /*iconCls*/
    ctx[13](
      /*item*/
      ctx[80]
    )
  )
});
const get_label_slot_changes_1 = (dirty) => ({
  item: dirty[2] & /*item*/
  262144,
  cls: dirty[2] & /*item*/
  262144
});
const get_label_slot_context_1 = (ctx) => ({
  item: (
    /*item*/
    ctx[80]
  ),
  cls: (
    /*titleContentCls*/
    ctx[25](!!/*item*/
    ctx[80].icon)
  )
});
const get_icon_slot_changes_1 = (dirty) => ({ item: dirty[2] & /*item*/
262144 });
const get_icon_slot_context_1 = (ctx) => ({ item: (
  /*item*/
  ctx[80]
) });
const get_item_slot_changes_1 = (dirty) => ({ item: dirty[2] & /*item*/
262144 });
const get_item_slot_context_1 = (ctx) => ({ item: (
  /*item*/
  ctx[80]
) });
const get_expandIcon_slot_changes = (dirty) => ({
  item: dirty[0] & /*itemsList*/
  16,
  cls: dirty[0] & /*iconCls, itemsList*/
  8208
});
const get_expandIcon_slot_context = (ctx) => ({
  item: (
    /*it*/
    ctx[81]
  ),
  cls: (
    /*iconCls*/
    ctx[13](
      /*it*/
      ctx[81]
    )
  )
});
const get_label_slot_changes = (dirty) => ({
  item: dirty[0] & /*itemsList*/
  16,
  cls: dirty[0] & /*itemsList*/
  16
});
const get_label_slot_context = (ctx) => ({
  item: (
    /*it*/
    ctx[81]
  ),
  cls: (
    /*titleContentCls*/
    ctx[25](!!/*it*/
    ctx[81].icon)
  )
});
const get_icon_slot_changes = (dirty) => ({
  item: dirty[0] & /*itemsList*/
  16,
  cls: dirty[0] & /*iconCls, itemsList*/
  8208
});
const get_icon_slot_context = (ctx) => ({
  item: (
    /*it*/
    ctx[81]
  ),
  cls: (
    /*iconCls*/
    ctx[13](
      /*it*/
      ctx[81]
    )
  )
});
const get_item_slot_changes = (dirty) => ({ item: dirty[0] & /*itemsList*/
16 });
const get_item_slot_context = (ctx) => ({ item: (
  /*it*/
  ctx[81]
) });
function create_if_block_16(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_17, create_else_block_2];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*it*/
      ctx2[81].type !== "divider"
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function create_else_block_2(ctx) {
  let kdivider;
  let current;
  kdivider = new Dist$1({ props: { cls: (
    /*dividerCls*/
    ctx[26]
  ) } });
  return {
    c() {
      create_component(kdivider.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kdivider, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(kdivider.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kdivider.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kdivider, detaching);
    }
  };
}
function create_if_block_17(ctx) {
  let ktooltip;
  let t;
  let kmenu;
  let current;
  ktooltip = new Dist$2({
    props: {
      placement: "right",
      trigger: "hover",
      width: "100%",
      theme: (
        /*themeValue*/
        ctx[15](
          /*it*/
          ctx[81]
        )
      ),
      content: (
        /*resolveTitle*/
        ctx[33](
          /*it*/
          ctx[81],
          /*ctxProps*/
          ctx[3].inlineCollapsed,
          true
        )
      ),
      disabled: (
        /*resolveDisabledTooltip*/
        ctx[32](
          /*it*/
          ctx[81],
          /*ctxProps*/
          ctx[3].inlineCollapsed
        )
      ),
      $$slots: { triggerEl: [create_triggerEl_slot_4] },
      $$scope: { ctx }
    }
  });
  const kmenu_spread_levels = [
    /*ctxProps*/
    ctx[3],
    { ctxKey: (
      /*ctxKey*/
      ctx[2]
    ) },
    {
      show: (
        /*hasSub*/
        ctx[17](
          /*it*/
          ctx[81]
        ) && /*it*/
        ctx[81].open || /*isGroup*/
        ctx[18](
          /*it*/
          ctx[81]
        )
      )
    },
    {
      cls: (
        /*subMenuCls*/
        ctx[27](
          /*isGroup*/
          ctx[18](
            /*it*/
            ctx[81]
          )
        )
      )
    }
  ];
  let kmenu_props = {
    $$slots: { default: [create_default_slot_3$1] },
    $$scope: { ctx }
  };
  for (let i = 0; i < kmenu_spread_levels.length; i += 1) {
    kmenu_props = assign(kmenu_props, kmenu_spread_levels[i]);
  }
  kmenu = new Dist13({ props: kmenu_props });
  return {
    c() {
      create_component(ktooltip.$$.fragment);
      t = space();
      create_component(kmenu.$$.fragment);
    },
    m(target, anchor) {
      mount_component(ktooltip, target, anchor);
      insert(target, t, anchor);
      mount_component(kmenu, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const ktooltip_changes = {};
      if (dirty[0] & /*themeValue, itemsList*/
      32784) ktooltip_changes.theme = /*themeValue*/
      ctx2[15](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*itemsList, ctxProps*/
      24) ktooltip_changes.content = /*resolveTitle*/
      ctx2[33](
        /*it*/
        ctx2[81],
        /*ctxProps*/
        ctx2[3].inlineCollapsed,
        true
      );
      if (dirty[0] & /*itemsList, ctxProps*/
      24) ktooltip_changes.disabled = /*resolveDisabledTooltip*/
      ctx2[32](
        /*it*/
        ctx2[81],
        /*ctxProps*/
        ctx2[3].inlineCollapsed
      );
      if (dirty[0] & /*cnames, itemsList, ctxProps, attrs, getIndent, themeValue, iconCls, expendIconCls*/
      62489 | dirty[1] & /*$$scope, $$restProps*/
      1073741840) {
        ktooltip_changes.$$scope = { dirty, ctx: ctx2 };
      }
      ktooltip.$set(ktooltip_changes);
      const kmenu_changes = dirty[0] & /*ctxProps, ctxKey, hasSub, itemsList, isGroup, subMenuCls*/
      134610972 ? get_spread_update(kmenu_spread_levels, [
        dirty[0] & /*ctxProps*/
        8 && get_spread_object(
          /*ctxProps*/
          ctx2[3]
        ),
        dirty[0] & /*ctxKey*/
        4 && { ctxKey: (
          /*ctxKey*/
          ctx2[2]
        ) },
        dirty[0] & /*hasSub, itemsList, isGroup*/
        393232 && {
          show: (
            /*hasSub*/
            ctx2[17](
              /*it*/
              ctx2[81]
            ) && /*it*/
            ctx2[81].open || /*isGroup*/
            ctx2[18](
              /*it*/
              ctx2[81]
            )
          )
        },
        dirty[0] & /*subMenuCls, isGroup, itemsList*/
        134479888 && {
          cls: (
            /*subMenuCls*/
            ctx2[27](
              /*isGroup*/
              ctx2[18](
                /*it*/
                ctx2[81]
              )
            )
          )
        }
      ]) : {};
      if (dirty[0] & /*itemsList, ctxKey, level, themeValue, iconCls, expendIconCls*/
      45078 | dirty[1] & /*$$scope*/
      1073741824) {
        kmenu_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kmenu.$set(kmenu_changes);
    },
    i(local) {
      if (current) return;
      transition_in(ktooltip.$$.fragment, local);
      transition_in(kmenu.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(ktooltip.$$.fragment, local);
      transition_out(kmenu.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
      destroy_component(ktooltip, detaching);
      destroy_component(kmenu, detaching);
    }
  };
}
function create_if_block_21(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*it*/
          ctx[81]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*it*/
          ctx[81]
        )
      ),
      height: "14px",
      icon: (
        /*it*/
        ctx[81].icon
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue, itemsList*/
      32784) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*iconCls, itemsList*/
      8208) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*itemsList*/
      16) kicon_changes.icon = /*it*/
      ctx2[81].icon;
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_27(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*it*/
    ctx[81].icon && create_if_block_21(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*it*/
        ctx2[81].icon
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*itemsList*/
          16) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_21(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function fallback_block_26(ctx) {
  let span;
  let t_value = (
    /*it*/
    ctx[81].label + ""
  );
  let t;
  let span_class_value;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", span_class_value = /*titleContentCls*/
      ctx[25](!!/*it*/
      ctx[81].icon));
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*itemsList*/
      16 && t_value !== (t_value = /*it*/
      ctx2[81].label + "")) set_data(t, t_value);
      if (dirty[0] & /*itemsList*/
      16 && span_class_value !== (span_class_value = /*titleContentCls*/
      ctx2[25](!!/*it*/
      ctx2[81].icon))) {
        attr(span, "class", span_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_20(ctx) {
  let current;
  const expandIcon_slot_template = (
    /*#slots*/
    ctx[41].expandIcon
  );
  const expandIcon_slot = create_slot(
    expandIcon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_expandIcon_slot_context
  );
  const expandIcon_slot_or_fallback = expandIcon_slot || fallback_block_25(ctx);
  return {
    c() {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (expandIcon_slot_or_fallback) {
        expandIcon_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (expandIcon_slot) {
        if (expandIcon_slot.p && (!current || dirty[0] & /*itemsList, iconCls*/
        8208 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            expandIcon_slot,
            expandIcon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              expandIcon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_expandIcon_slot_changes
            ),
            get_expandIcon_slot_context
          );
        }
      } else {
        if (expandIcon_slot_or_fallback && expandIcon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, itemsList, iconCls, expendIconCls*/
        45072)) {
          expandIcon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(expandIcon_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(expandIcon_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block_25(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*it*/
          ctx[81]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*it*/
          ctx[81]
        )
      ),
      height: "14px",
      icon: (
        /*expendIconCls*/
        ctx[12](
          /*it*/
          ctx[81]
        )
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue, itemsList*/
      32784) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*iconCls, itemsList*/
      8208) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*expendIconCls, itemsList*/
      4112) kicon_changes.icon = /*expendIconCls*/
      ctx2[12](
        /*it*/
        ctx2[81]
      );
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_24(ctx) {
  let span;
  let t0;
  let t1;
  let show_if = (
    /*hasSub*/
    ctx[17](
      /*it*/
      ctx[81]
    ) && !/*isGroup*/
    ctx[18](
      /*it*/
      ctx[81]
    )
  );
  let if_block_anchor;
  let current;
  const icon_slot_template = (
    /*#slots*/
    ctx[41].icon
  );
  const icon_slot = create_slot(
    icon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_icon_slot_context
  );
  const icon_slot_or_fallback = icon_slot || fallback_block_27(ctx);
  const label_slot_template = (
    /*#slots*/
    ctx[41].label
  );
  const label_slot = create_slot(
    label_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_label_slot_context
  );
  const label_slot_or_fallback = label_slot || fallback_block_26(ctx);
  let if_block = show_if && create_if_block_20(ctx);
  return {
    c() {
      span = element("span");
      if (icon_slot_or_fallback) icon_slot_or_fallback.c();
      t0 = space();
      if (label_slot_or_fallback) label_slot_or_fallback.c();
      t1 = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
      attr(
        span,
        "class",
        /*iconRootCls*/
        ctx[24]()
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (icon_slot_or_fallback) {
        icon_slot_or_fallback.m(span, null);
      }
      append(span, t0);
      if (label_slot_or_fallback) {
        label_slot_or_fallback.m(span, null);
      }
      insert(target, t1, anchor);
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (icon_slot) {
        if (icon_slot.p && (!current || dirty[0] & /*itemsList, iconCls*/
        8208 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            icon_slot,
            icon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              icon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_icon_slot_changes
            ),
            get_icon_slot_context
          );
        }
      } else {
        if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, itemsList, iconCls*/
        40976)) {
          icon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (label_slot) {
        if (label_slot.p && (!current || dirty[0] & /*itemsList*/
        16 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            label_slot,
            label_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              label_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_label_slot_changes
            ),
            get_label_slot_context
          );
        }
      } else {
        if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[0] & /*itemsList*/
        16)) {
          label_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (dirty[0] & /*itemsList*/
      16) show_if = /*hasSub*/
      ctx2[17](
        /*it*/
        ctx2[81]
      ) && !/*isGroup*/
      ctx2[18](
        /*it*/
        ctx2[81]
      );
      if (show_if) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*itemsList*/
          16) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_20(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(icon_slot_or_fallback, local);
      transition_in(label_slot_or_fallback, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(icon_slot_or_fallback, local);
      transition_out(label_slot_or_fallback, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
        detach(t1);
        detach(if_block_anchor);
      }
      if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
      if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_triggerEl_slot_4(ctx) {
  let li;
  let li_class_value;
  let li_title_value;
  let current;
  let mounted;
  let dispose;
  const item_slot_template = (
    /*#slots*/
    ctx[41].item
  );
  const item_slot = create_slot(
    item_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_item_slot_context
  );
  const item_slot_or_fallback = item_slot || fallback_block_24(ctx);
  let li_levels = [
    { slot: "triggerEl" },
    { role: "menuitem" },
    {
      class: li_class_value = /*cnames*/
      ctx[14](
        /*it*/
        ctx[81]
      )
    },
    {
      title: li_title_value = /*resolveTitle*/
      ctx[33](
        /*it*/
        ctx[81],
        /*ctxProps*/
        ctx[3].inlineCollapsed,
        false
      )
    },
    /*$$restProps*/
    ctx[35],
    /*attrs*/
    ctx[0]
  ];
  let li_data = {};
  for (let i = 0; i < li_levels.length; i += 1) {
    li_data = assign(li_data, li_levels[i]);
  }
  function click_handler(...args) {
    return (
      /*click_handler*/
      ctx[42](
        /*it*/
        ctx[81],
        ...args
      )
    );
  }
  return {
    c() {
      li = element("li");
      if (item_slot_or_fallback) item_slot_or_fallback.c();
      set_attributes(li, li_data);
      set_style(li, "padding-left", `${/*getIndent*/
      ctx[10](
        /*it*/
        ctx[81]
      )}`);
    },
    m(target, anchor) {
      insert(target, li, anchor);
      if (item_slot_or_fallback) {
        item_slot_or_fallback.m(li, null);
      }
      current = true;
      if (!mounted) {
        dispose = listen(li, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (item_slot) {
        if (item_slot.p && (!current || dirty[0] & /*itemsList*/
        16 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            item_slot,
            item_slot_template,
            ctx,
            /*$$scope*/
            ctx[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx[61]
            ) : get_slot_changes(
              item_slot_template,
              /*$$scope*/
              ctx[61],
              dirty,
              get_item_slot_changes
            ),
            get_item_slot_context
          );
        }
      } else {
        if (item_slot_or_fallback && item_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, itemsList, iconCls, expendIconCls*/
        45072 | dirty[1] & /*$$scope*/
        1073741824)) {
          item_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
        }
      }
      set_attributes(li, li_data = get_spread_update(li_levels, [
        { slot: "triggerEl" },
        { role: "menuitem" },
        (!current || dirty[0] & /*cnames, itemsList*/
        16400 && li_class_value !== (li_class_value = /*cnames*/
        ctx[14](
          /*it*/
          ctx[81]
        ))) && { class: li_class_value },
        (!current || dirty[0] & /*itemsList, ctxProps*/
        24 && li_title_value !== (li_title_value = /*resolveTitle*/
        ctx[33](
          /*it*/
          ctx[81],
          /*ctxProps*/
          ctx[3].inlineCollapsed,
          false
        ))) && { title: li_title_value },
        dirty[1] & /*$$restProps*/
        16 && /*$$restProps*/
        ctx[35],
        dirty[0] & /*attrs*/
        1 && /*attrs*/
        ctx[0]
      ]));
      set_style(li, "padding-left", `${/*getIndent*/
      ctx[10](
        /*it*/
        ctx[81]
      )}`);
    },
    i(local) {
      if (current) return;
      transition_in(item_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(item_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(li);
      }
      if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_19(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*item*/
          ctx[80]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*item*/
          ctx[80]
        )
      ),
      height: "14px",
      icon: (
        /*item*/
        ctx[80].icon
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue*/
      32768 | dirty[2] & /*item*/
      262144) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*iconCls*/
      8192 | dirty[2] & /*item*/
      262144) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*item*/
        ctx2[80]
      );
      if (dirty[2] & /*item*/
      262144) kicon_changes.icon = /*item*/
      ctx2[80].icon;
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_23(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*item*/
    ctx[80].icon && create_if_block_19(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*item*/
        ctx2[80].icon
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[2] & /*item*/
          262144) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_19(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function fallback_block_22(ctx) {
  let span;
  let t_value = (
    /*item*/
    ctx[80].label + ""
  );
  let t;
  let span_class_value;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", span_class_value = /*titleContentCls*/
      ctx[25](!!/*item*/
      ctx[80].icon));
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty[2] & /*item*/
      262144 && t_value !== (t_value = /*item*/
      ctx2[80].label + "")) set_data(t, t_value);
      if (dirty[2] & /*item*/
      262144 && span_class_value !== (span_class_value = /*titleContentCls*/
      ctx2[25](!!/*item*/
      ctx2[80].icon))) {
        attr(span, "class", span_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_18(ctx) {
  let current;
  const expandIcon_slot_template = (
    /*#slots*/
    ctx[41].expandIcon
  );
  const expandIcon_slot = create_slot(
    expandIcon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_expandIcon_slot_context_1
  );
  const expandIcon_slot_or_fallback = expandIcon_slot || fallback_block_21(ctx);
  return {
    c() {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (expandIcon_slot_or_fallback) {
        expandIcon_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (expandIcon_slot) {
        if (expandIcon_slot.p && (!current || dirty[0] & /*iconCls*/
        8192 | dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            expandIcon_slot,
            expandIcon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              expandIcon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_expandIcon_slot_changes_1
            ),
            get_expandIcon_slot_context_1
          );
        }
      } else {
        if (expandIcon_slot_or_fallback && expandIcon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls, expendIconCls*/
        45056 | dirty[2] & /*item*/
        262144)) {
          expandIcon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(expandIcon_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(expandIcon_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block_21(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*item*/
          ctx[80]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*item*/
          ctx[80]
        )
      ),
      height: "14px",
      icon: (
        /*expendIconCls*/
        ctx[12](
          /*item*/
          ctx[80]
        )
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue*/
      32768 | dirty[2] & /*item*/
      262144) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*iconCls*/
      8192 | dirty[2] & /*item*/
      262144) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*expendIconCls*/
      4096 | dirty[2] & /*item*/
      262144) kicon_changes.icon = /*expendIconCls*/
      ctx2[12](
        /*item*/
        ctx2[80]
      );
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_20(ctx) {
  let span;
  let t0;
  let t1;
  let show_if = (
    /*hasSub*/
    ctx[17](
      /*item*/
      ctx[80]
    ) && !/*isGroup*/
    ctx[18](
      /*item*/
      ctx[80]
    )
  );
  let if_block_anchor;
  let current;
  const icon_slot_template = (
    /*#slots*/
    ctx[41].icon
  );
  const icon_slot = create_slot(
    icon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_icon_slot_context_1
  );
  const icon_slot_or_fallback = icon_slot || fallback_block_23(ctx);
  const label_slot_template = (
    /*#slots*/
    ctx[41].label
  );
  const label_slot = create_slot(
    label_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_label_slot_context_1
  );
  const label_slot_or_fallback = label_slot || fallback_block_22(ctx);
  let if_block = show_if && create_if_block_18(ctx);
  return {
    c() {
      span = element("span");
      if (icon_slot_or_fallback) icon_slot_or_fallback.c();
      t0 = space();
      if (label_slot_or_fallback) label_slot_or_fallback.c();
      t1 = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
      attr(
        span,
        "class",
        /*iconRootCls*/
        ctx[24]()
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (icon_slot_or_fallback) {
        icon_slot_or_fallback.m(span, null);
      }
      append(span, t0);
      if (label_slot_or_fallback) {
        label_slot_or_fallback.m(span, null);
      }
      insert(target, t1, anchor);
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (icon_slot) {
        if (icon_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            icon_slot,
            icon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              icon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_icon_slot_changes_1
            ),
            get_icon_slot_context_1
          );
        }
      } else {
        if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls*/
        40960 | dirty[2] & /*item*/
        262144)) {
          icon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (label_slot) {
        if (label_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            label_slot,
            label_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              label_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_label_slot_changes_1
            ),
            get_label_slot_context_1
          );
        }
      } else {
        if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[2] & /*item*/
        262144)) {
          label_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (dirty[2] & /*item*/
      262144) show_if = /*hasSub*/
      ctx2[17](
        /*item*/
        ctx2[80]
      ) && !/*isGroup*/
      ctx2[18](
        /*item*/
        ctx2[80]
      );
      if (show_if) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[2] & /*item*/
          262144) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_18(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(icon_slot_or_fallback, local);
      transition_in(label_slot_or_fallback, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(icon_slot_or_fallback, local);
      transition_out(label_slot_or_fallback, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
        detach(t1);
        detach(if_block_anchor);
      }
      if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
      if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_item_slot_3(ctx) {
  let current;
  const item_slot_template = (
    /*#slots*/
    ctx[41].item
  );
  const item_slot = create_slot(
    item_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_item_slot_context_1
  );
  const item_slot_or_fallback = item_slot || fallback_block_20(ctx);
  return {
    c() {
      if (item_slot_or_fallback) item_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (item_slot_or_fallback) {
        item_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (item_slot) {
        if (item_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            item_slot,
            item_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              item_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_item_slot_changes_1
            ),
            get_item_slot_context_1
          );
        }
      } else {
        if (item_slot_or_fallback && item_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls, expendIconCls*/
        45056 | dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          item_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(item_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(item_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
    }
  };
}
function create_default_slot_3$1(ctx) {
  let item;
  let current;
  function selectedRecursion_handler(...args) {
    return (
      /*selectedRecursion_handler*/
      ctx[43](
        /*index*/
        ctx[83],
        ...args
      )
    );
  }
  item = new Item2({
    props: {
      uid: (
        /*it*/
        ctx[81].uid
      ),
      ctxKey: (
        /*ctxKey*/
        ctx[2]
      ),
      items: (
        /*it*/
        ctx[81].children
      ),
      level: (
        /*getLevel*/
        ctx[19](
          /*it*/
          ctx[81],
          /*level*/
          ctx[1]
        ) + 1
      ),
      $$slots: {
        item: [
          create_item_slot_3,
          ({ item: item2 }) => ({ 80: item2 }),
          ({ item: item2 }) => [0, 0, item2 ? 262144 : 0]
        ]
      },
      $$scope: { ctx }
    }
  });
  item.$on("selectedRecursion", selectedRecursion_handler);
  item.$on(
    "titleClick",
    /*titleClick_handler*/
    ctx[44]
  );
  return {
    c() {
      create_component(item.$$.fragment);
    },
    m(target, anchor) {
      mount_component(item, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const item_changes = {};
      if (dirty[0] & /*itemsList*/
      16) item_changes.uid = /*it*/
      ctx[81].uid;
      if (dirty[0] & /*ctxKey*/
      4) item_changes.ctxKey = /*ctxKey*/
      ctx[2];
      if (dirty[0] & /*itemsList*/
      16) item_changes.items = /*it*/
      ctx[81].children;
      if (dirty[0] & /*itemsList, level*/
      18) item_changes.level = /*getLevel*/
      ctx[19](
        /*it*/
        ctx[81],
        /*level*/
        ctx[1]
      ) + 1;
      if (dirty[0] & /*themeValue, iconCls, expendIconCls*/
      45056 | dirty[1] & /*$$scope*/
      1073741824 | dirty[2] & /*item*/
      262144) {
        item_changes.$$scope = { dirty, ctx };
      }
      item.$set(item_changes);
    },
    i(local) {
      if (current) return;
      transition_in(item.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(item.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(item, detaching);
    }
  };
}
function create_if_block_9(ctx) {
  let kpopover;
  let index = (
    /*index*/
    ctx[83]
  );
  let current;
  const assign_kpopover = () => (
    /*kpopover_binding*/
    ctx[49](kpopover, index)
  );
  const unassign_kpopover = () => (
    /*kpopover_binding*/
    ctx[49](null, index)
  );
  function change_handler(...args) {
    return (
      /*change_handler*/
      ctx[50](
        /*it*/
        ctx[81],
        ...args
      )
    );
  }
  let kpopover_props = {
    arrow: false,
    theme: (
      /*themeValue*/
      ctx[15](
        /*it*/
        ctx[81]
      )
    ),
    width: (
      /*level*/
      ctx[1] === 1 ? "auto" : "100%"
    ),
    placement: "right",
    offsetComputed: (
      /*setPopoverOffset*/
      ctx[29]
    ),
    fallbackPlacements: ["right", "left"],
    mouseEnterDelay: (
      /*ctxProps*/
      ctx[3].subMenuOpenDelay
    ),
    mouseLeaveDelay: (
      /*ctxProps*/
      ctx[3].subMenuCloseDelay
    ),
    trigger: (
      /*ctxProps*/
      ctx[3].triggerSubMenuAction
    ),
    cls: (
      /*popoverContentCls*/
      ctx[11](
        /*it*/
        ctx[81]
      )
    ),
    clsTrigger: (
      /*popoverTriggerCls*/
      ctx[28](false)
    ),
    disabled: !/*hasSub*/
    (ctx[17](
      /*it*/
      ctx[81]
    ) || /*isGroup*/
    ctx[18](
      /*it*/
      ctx[81]
    )),
    $$slots: {
      contentEl: [create_contentEl_slot_2],
      triggerEl: [create_triggerEl_slot_2]
    },
    $$scope: { ctx }
  };
  kpopover = new Dist$b({ props: kpopover_props });
  assign_kpopover();
  kpopover.$on("change", change_handler);
  kpopover.$on(
    "animateStart",
    /*showSubMenuPopover*/
    ctx[23]
  );
  return {
    c() {
      create_component(kpopover.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kpopover, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (index !== /*index*/
      ctx[83]) {
        unassign_kpopover();
        index = /*index*/
        ctx[83];
        assign_kpopover();
      }
      const kpopover_changes = {};
      if (dirty[0] & /*themeValue, itemsList*/
      32784) kpopover_changes.theme = /*themeValue*/
      ctx[15](
        /*it*/
        ctx[81]
      );
      if (dirty[0] & /*level*/
      2) kpopover_changes.width = /*level*/
      ctx[1] === 1 ? "auto" : "100%";
      if (dirty[0] & /*ctxProps*/
      8) kpopover_changes.mouseEnterDelay = /*ctxProps*/
      ctx[3].subMenuOpenDelay;
      if (dirty[0] & /*ctxProps*/
      8) kpopover_changes.mouseLeaveDelay = /*ctxProps*/
      ctx[3].subMenuCloseDelay;
      if (dirty[0] & /*ctxProps*/
      8) kpopover_changes.trigger = /*ctxProps*/
      ctx[3].triggerSubMenuAction;
      if (dirty[0] & /*popoverContentCls, itemsList*/
      2064) kpopover_changes.cls = /*popoverContentCls*/
      ctx[11](
        /*it*/
        ctx[81]
      );
      if (dirty[0] & /*itemsList*/
      16) kpopover_changes.disabled = !/*hasSub*/
      (ctx[17](
        /*it*/
        ctx[81]
      ) || /*isGroup*/
      ctx[18](
        /*it*/
        ctx[81]
      ));
      if (dirty[0] & /*ctxProps, ctxKey, itemsList, level, subMenuRef, themeValue, iconCls, expendIconCls, cnames, attrs, getIndent*/
      62559 | dirty[1] & /*$$scope, $$restProps*/
      1073741840) {
        kpopover_changes.$$scope = { dirty, ctx };
      }
      kpopover.$set(kpopover_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kpopover.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kpopover.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      unassign_kpopover();
      destroy_component(kpopover, detaching);
    }
  };
}
function create_else_block_1(ctx) {
  let kdivider;
  let current;
  kdivider = new Dist$1({ props: { cls: (
    /*dividerCls*/
    ctx[26]
  ) } });
  return {
    c() {
      create_component(kdivider.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kdivider, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(kdivider.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kdivider.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kdivider, detaching);
    }
  };
}
function create_if_block_12(ctx) {
  let ktooltip;
  let current;
  ktooltip = new Dist$2({
    props: {
      placement: "right",
      trigger: "hover",
      width: "100%",
      theme: (
        /*themeValue*/
        ctx[15](
          /*it*/
          ctx[81]
        )
      ),
      disabled: (
        /*resolveDisabledTooltip*/
        ctx[32](
          /*it*/
          ctx[81],
          /*ctxProps*/
          ctx[3].inlineCollapsed
        )
      ),
      content: (
        /*resolveTitle*/
        ctx[33](
          /*it*/
          ctx[81],
          /*ctxProps*/
          ctx[3].inlineCollapsed,
          true
        )
      ),
      $$slots: { triggerEl: [create_triggerEl_slot_3] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(ktooltip.$$.fragment);
    },
    m(target, anchor) {
      mount_component(ktooltip, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const ktooltip_changes = {};
      if (dirty[0] & /*themeValue, itemsList*/
      32784) ktooltip_changes.theme = /*themeValue*/
      ctx2[15](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*itemsList, ctxProps*/
      24) ktooltip_changes.disabled = /*resolveDisabledTooltip*/
      ctx2[32](
        /*it*/
        ctx2[81],
        /*ctxProps*/
        ctx2[3].inlineCollapsed
      );
      if (dirty[0] & /*itemsList, ctxProps*/
      24) ktooltip_changes.content = /*resolveTitle*/
      ctx2[33](
        /*it*/
        ctx2[81],
        /*ctxProps*/
        ctx2[3].inlineCollapsed,
        true
      );
      if (dirty[0] & /*cnames, itemsList, ctxProps, attrs, getIndent, themeValue, iconCls, expendIconCls*/
      62489 | dirty[1] & /*$$scope, $$restProps*/
      1073741840) {
        ktooltip_changes.$$scope = { dirty, ctx: ctx2 };
      }
      ktooltip.$set(ktooltip_changes);
    },
    i(local) {
      if (current) return;
      transition_in(ktooltip.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(ktooltip.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(ktooltip, detaching);
    }
  };
}
function create_if_block_15(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*it*/
          ctx[81]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*it*/
          ctx[81]
        )
      ),
      height: "14px",
      icon: (
        /*it*/
        ctx[81].icon
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue, itemsList*/
      32784) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*iconCls, itemsList*/
      8208) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*itemsList*/
      16) kicon_changes.icon = /*it*/
      ctx2[81].icon;
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_19(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*it*/
    ctx[81].icon && create_if_block_15(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*it*/
        ctx2[81].icon
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*itemsList*/
          16) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_15(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_if_block_14(ctx) {
  let span;
  let t_value = (
    /*resolveLabel*/
    ctx[31](
      /*it*/
      ctx[81],
      /*ctxProps*/
      ctx[3].inlineCollapsed
    ) + ""
  );
  let t;
  let span_class_value;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", span_class_value = /*titleContentCls*/
      ctx[25](!!/*it*/
      ctx[81].icon));
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*itemsList, ctxProps*/
      24 && t_value !== (t_value = /*resolveLabel*/
      ctx2[31](
        /*it*/
        ctx2[81],
        /*ctxProps*/
        ctx2[3].inlineCollapsed
      ) + "")) set_data(t, t_value);
      if (dirty[0] & /*itemsList*/
      16 && span_class_value !== (span_class_value = /*titleContentCls*/
      ctx2[25](!!/*it*/
      ctx2[81].icon))) {
        attr(span, "class", span_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function fallback_block_18(ctx) {
  let if_block_anchor;
  let if_block = (!/*ctxProps*/
  ctx[3].inlineCollapsed || /*ctxProps*/
  ctx[3].inlineCollapsed && /*it*/
  ctx[81].label && !/*it*/
  ctx[81].icon) && create_if_block_14(ctx);
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (!/*ctxProps*/
      ctx2[3].inlineCollapsed || /*ctxProps*/
      ctx2[3].inlineCollapsed && /*it*/
      ctx2[81].label && !/*it*/
      ctx2[81].icon) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_14(ctx2);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_if_block_13(ctx) {
  let current;
  const expandIcon_slot_template = (
    /*#slots*/
    ctx[41].expandIcon
  );
  const expandIcon_slot = create_slot(
    expandIcon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_expandIcon_slot_context_3
  );
  const expandIcon_slot_or_fallback = expandIcon_slot || fallback_block_17(ctx);
  return {
    c() {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (expandIcon_slot_or_fallback) {
        expandIcon_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (expandIcon_slot) {
        if (expandIcon_slot.p && (!current || dirty[0] & /*itemsList, iconCls*/
        8208 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            expandIcon_slot,
            expandIcon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              expandIcon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_expandIcon_slot_changes_3
            ),
            get_expandIcon_slot_context_3
          );
        }
      } else {
        if (expandIcon_slot_or_fallback && expandIcon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, itemsList, iconCls, expendIconCls*/
        45072)) {
          expandIcon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(expandIcon_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(expandIcon_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block_17(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*it*/
          ctx[81]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*it*/
          ctx[81]
        )
      ),
      height: "14px",
      icon: (
        /*expendIconCls*/
        ctx[12](
          /*it*/
          ctx[81]
        )
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue, itemsList*/
      32784) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*iconCls, itemsList*/
      8208) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*expendIconCls, itemsList*/
      4112) kicon_changes.icon = /*expendIconCls*/
      ctx2[12](
        /*it*/
        ctx2[81]
      );
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_16(ctx) {
  let span;
  let t0;
  let span_class_value;
  let t1;
  let show_if = (
    /*hasSub*/
    ctx[17](
      /*it*/
      ctx[81]
    ) && !/*isGroup*/
    ctx[18](
      /*it*/
      ctx[81]
    ) && !/*ctxProps*/
    ctx[3].inlineCollapsed
  );
  let if_block_anchor;
  let current;
  const icon_slot_template = (
    /*#slots*/
    ctx[41].icon
  );
  const icon_slot = create_slot(
    icon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_icon_slot_context_3
  );
  const icon_slot_or_fallback = icon_slot || fallback_block_19(ctx);
  const label_slot_template = (
    /*#slots*/
    ctx[41].label
  );
  const label_slot = create_slot(
    label_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_label_slot_context_3
  );
  const label_slot_or_fallback = label_slot || fallback_block_18(ctx);
  let if_block = show_if && create_if_block_13(ctx);
  return {
    c() {
      span = element("span");
      if (icon_slot_or_fallback) icon_slot_or_fallback.c();
      t0 = space();
      if (label_slot_or_fallback) label_slot_or_fallback.c();
      t1 = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
      attr(span, "class", span_class_value = /*iconRootCls*/
      ctx[24](
        /*ctxProps*/
        ctx[3].inlineCollapsed
      ));
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (icon_slot_or_fallback) {
        icon_slot_or_fallback.m(span, null);
      }
      append(span, t0);
      if (label_slot_or_fallback) {
        label_slot_or_fallback.m(span, null);
      }
      insert(target, t1, anchor);
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (icon_slot) {
        if (icon_slot.p && (!current || dirty[0] & /*itemsList, iconCls*/
        8208 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            icon_slot,
            icon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              icon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_icon_slot_changes_3
            ),
            get_icon_slot_context_3
          );
        }
      } else {
        if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, itemsList, iconCls*/
        40976)) {
          icon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (label_slot) {
        if (label_slot.p && (!current || dirty[0] & /*itemsList*/
        16 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            label_slot,
            label_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              label_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_label_slot_changes_3
            ),
            get_label_slot_context_3
          );
        }
      } else {
        if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[0] & /*itemsList, ctxProps*/
        24)) {
          label_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (!current || dirty[0] & /*ctxProps*/
      8 && span_class_value !== (span_class_value = /*iconRootCls*/
      ctx2[24](
        /*ctxProps*/
        ctx2[3].inlineCollapsed
      ))) {
        attr(span, "class", span_class_value);
      }
      if (dirty[0] & /*itemsList, ctxProps*/
      24) show_if = /*hasSub*/
      ctx2[17](
        /*it*/
        ctx2[81]
      ) && !/*isGroup*/
      ctx2[18](
        /*it*/
        ctx2[81]
      ) && !/*ctxProps*/
      ctx2[3].inlineCollapsed;
      if (show_if) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*itemsList, ctxProps*/
          24) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_13(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(icon_slot_or_fallback, local);
      transition_in(label_slot_or_fallback, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(icon_slot_or_fallback, local);
      transition_out(label_slot_or_fallback, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
        detach(t1);
        detach(if_block_anchor);
      }
      if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
      if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_triggerEl_slot_3(ctx) {
  let li;
  let li_class_value;
  let li_title_value;
  let current;
  let mounted;
  let dispose;
  const item_slot_template = (
    /*#slots*/
    ctx[41].item
  );
  const item_slot = create_slot(
    item_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_item_slot_context_3
  );
  const item_slot_or_fallback = item_slot || fallback_block_16(ctx);
  let li_levels = [
    { slot: "triggerEl" },
    { role: "menuitem" },
    {
      class: li_class_value = /*cnames*/
      ctx[14](
        /*it*/
        ctx[81]
      )
    },
    {
      title: li_title_value = /*resolveTitle*/
      ctx[33](
        /*it*/
        ctx[81],
        /*ctxProps*/
        ctx[3].inlineCollapsed,
        false
      )
    },
    /*$$restProps*/
    ctx[35],
    /*attrs*/
    ctx[0]
  ];
  let li_data = {};
  for (let i = 0; i < li_levels.length; i += 1) {
    li_data = assign(li_data, li_levels[i]);
  }
  function click_handler_1(...args) {
    return (
      /*click_handler_1*/
      ctx[48](
        /*it*/
        ctx[81],
        ...args
      )
    );
  }
  return {
    c() {
      li = element("li");
      if (item_slot_or_fallback) item_slot_or_fallback.c();
      set_attributes(li, li_data);
      set_style(li, "padding-left", `${/*getIndent*/
      ctx[10](
        /*it*/
        ctx[81],
        /*ctxProps*/
        ctx[3].inlineCollapsed
      )}`);
    },
    m(target, anchor) {
      insert(target, li, anchor);
      if (item_slot_or_fallback) {
        item_slot_or_fallback.m(li, null);
      }
      current = true;
      if (!mounted) {
        dispose = listen(li, "click", click_handler_1);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (item_slot) {
        if (item_slot.p && (!current || dirty[0] & /*itemsList*/
        16 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            item_slot,
            item_slot_template,
            ctx,
            /*$$scope*/
            ctx[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx[61]
            ) : get_slot_changes(
              item_slot_template,
              /*$$scope*/
              ctx[61],
              dirty,
              get_item_slot_changes_3
            ),
            get_item_slot_context_3
          );
        }
      } else {
        if (item_slot_or_fallback && item_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, itemsList, iconCls, expendIconCls, ctxProps*/
        45080 | dirty[1] & /*$$scope*/
        1073741824)) {
          item_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
        }
      }
      set_attributes(li, li_data = get_spread_update(li_levels, [
        { slot: "triggerEl" },
        { role: "menuitem" },
        (!current || dirty[0] & /*cnames, itemsList*/
        16400 && li_class_value !== (li_class_value = /*cnames*/
        ctx[14](
          /*it*/
          ctx[81]
        ))) && { class: li_class_value },
        (!current || dirty[0] & /*itemsList, ctxProps*/
        24 && li_title_value !== (li_title_value = /*resolveTitle*/
        ctx[33](
          /*it*/
          ctx[81],
          /*ctxProps*/
          ctx[3].inlineCollapsed,
          false
        ))) && { title: li_title_value },
        dirty[1] & /*$$restProps*/
        16 && /*$$restProps*/
        ctx[35],
        dirty[0] & /*attrs*/
        1 && /*attrs*/
        ctx[0]
      ]));
      set_style(li, "padding-left", `${/*getIndent*/
      ctx[10](
        /*it*/
        ctx[81],
        /*ctxProps*/
        ctx[3].inlineCollapsed
      )}`);
    },
    i(local) {
      if (current) return;
      transition_in(item_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(item_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(li);
      }
      if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function create_triggerEl_slot_2(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_12, create_else_block_1];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (
      /*it*/
      ctx2[81].type !== "divider"
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type_1(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_1(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function create_if_block_11(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*item*/
          ctx[80]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*item*/
          ctx[80]
        )
      ),
      height: "14px",
      icon: (
        /*item*/
        ctx[80].icon
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue*/
      32768 | dirty[2] & /*item*/
      262144) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*iconCls*/
      8192 | dirty[2] & /*item*/
      262144) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*item*/
        ctx2[80]
      );
      if (dirty[2] & /*item*/
      262144) kicon_changes.icon = /*item*/
      ctx2[80].icon;
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_15(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*item*/
    ctx[80].icon && create_if_block_11(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*item*/
        ctx2[80].icon
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[2] & /*item*/
          262144) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_11(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function fallback_block_14(ctx) {
  let span;
  let t_value = (
    /*item*/
    ctx[80].label + ""
  );
  let t;
  let span_class_value;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", span_class_value = /*titleContentCls*/
      ctx[25](!!/*item*/
      ctx[80].icon));
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty[2] & /*item*/
      262144 && t_value !== (t_value = /*item*/
      ctx2[80].label + "")) set_data(t, t_value);
      if (dirty[2] & /*item*/
      262144 && span_class_value !== (span_class_value = /*titleContentCls*/
      ctx2[25](!!/*item*/
      ctx2[80].icon))) {
        attr(span, "class", span_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_10(ctx) {
  let current;
  const expandIcon_slot_template = (
    /*#slots*/
    ctx[41].expandIcon
  );
  const expandIcon_slot = create_slot(
    expandIcon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_expandIcon_slot_context_2
  );
  const expandIcon_slot_or_fallback = expandIcon_slot || fallback_block_13(ctx);
  return {
    c() {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (expandIcon_slot_or_fallback) {
        expandIcon_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (expandIcon_slot) {
        if (expandIcon_slot.p && (!current || dirty[0] & /*iconCls*/
        8192 | dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            expandIcon_slot,
            expandIcon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              expandIcon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_expandIcon_slot_changes_2
            ),
            get_expandIcon_slot_context_2
          );
        }
      } else {
        if (expandIcon_slot_or_fallback && expandIcon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls, expendIconCls*/
        45056 | dirty[2] & /*item*/
        262144)) {
          expandIcon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(expandIcon_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(expandIcon_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block_13(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*item*/
          ctx[80]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*item*/
          ctx[80]
        )
      ),
      height: "14px",
      icon: (
        /*expendIconCls*/
        ctx[12](
          /*item*/
          ctx[80]
        )
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue*/
      32768 | dirty[2] & /*item*/
      262144) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*iconCls*/
      8192 | dirty[2] & /*item*/
      262144) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*expendIconCls*/
      4096 | dirty[2] & /*item*/
      262144) kicon_changes.icon = /*expendIconCls*/
      ctx2[12](
        /*item*/
        ctx2[80]
      );
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_12(ctx) {
  let span;
  let t0;
  let t1;
  let show_if = (
    /*hasSub*/
    ctx[17](
      /*item*/
      ctx[80]
    )
  );
  let if_block_anchor;
  let current;
  const icon_slot_template = (
    /*#slots*/
    ctx[41].icon
  );
  const icon_slot = create_slot(
    icon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_icon_slot_context_2
  );
  const icon_slot_or_fallback = icon_slot || fallback_block_15(ctx);
  const label_slot_template = (
    /*#slots*/
    ctx[41].label
  );
  const label_slot = create_slot(
    label_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_label_slot_context_2
  );
  const label_slot_or_fallback = label_slot || fallback_block_14(ctx);
  let if_block = show_if && create_if_block_10(ctx);
  return {
    c() {
      span = element("span");
      if (icon_slot_or_fallback) icon_slot_or_fallback.c();
      t0 = space();
      if (label_slot_or_fallback) label_slot_or_fallback.c();
      t1 = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
      attr(
        span,
        "class",
        /*iconRootCls*/
        ctx[24]()
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (icon_slot_or_fallback) {
        icon_slot_or_fallback.m(span, null);
      }
      append(span, t0);
      if (label_slot_or_fallback) {
        label_slot_or_fallback.m(span, null);
      }
      insert(target, t1, anchor);
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (icon_slot) {
        if (icon_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            icon_slot,
            icon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              icon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_icon_slot_changes_2
            ),
            get_icon_slot_context_2
          );
        }
      } else {
        if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls*/
        40960 | dirty[2] & /*item*/
        262144)) {
          icon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (label_slot) {
        if (label_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            label_slot,
            label_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              label_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_label_slot_changes_2
            ),
            get_label_slot_context_2
          );
        }
      } else {
        if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[2] & /*item*/
        262144)) {
          label_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (dirty[2] & /*item*/
      262144) show_if = /*hasSub*/
      ctx2[17](
        /*item*/
        ctx2[80]
      );
      if (show_if) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[2] & /*item*/
          262144) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_10(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(icon_slot_or_fallback, local);
      transition_in(label_slot_or_fallback, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(icon_slot_or_fallback, local);
      transition_out(label_slot_or_fallback, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
        detach(t1);
        detach(if_block_anchor);
      }
      if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
      if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_item_slot_2(ctx) {
  let current;
  const item_slot_template = (
    /*#slots*/
    ctx[41].item
  );
  const item_slot = create_slot(
    item_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_item_slot_context_2
  );
  const item_slot_or_fallback = item_slot || fallback_block_12(ctx);
  return {
    c() {
      if (item_slot_or_fallback) item_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (item_slot_or_fallback) {
        item_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (item_slot) {
        if (item_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            item_slot,
            item_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              item_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_item_slot_changes_2
            ),
            get_item_slot_context_2
          );
        }
      } else {
        if (item_slot_or_fallback && item_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls, expendIconCls*/
        45056 | dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          item_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(item_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(item_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
    }
  };
}
function create_default_slot_2$2(ctx) {
  let item;
  let index = (
    /*index*/
    ctx[83]
  );
  let current;
  const assign_item = () => (
    /*item_binding*/
    ctx[45](item, index)
  );
  const unassign_item = () => (
    /*item_binding*/
    ctx[45](null, index)
  );
  function selectedRecursion_handler_1(...args) {
    return (
      /*selectedRecursion_handler_1*/
      ctx[46](
        /*index*/
        ctx[83],
        ...args
      )
    );
  }
  let item_props = {
    uid: (
      /*it*/
      ctx[81].uid
    ),
    ctxKey: (
      /*ctxKey*/
      ctx[2]
    ),
    items: (
      /*it*/
      ctx[81].children
    ),
    level: (
      /*getLevel*/
      ctx[19](
        /*it*/
        ctx[81],
        /*level*/
        ctx[1]
      ) + 1
    ),
    $$slots: {
      item: [
        create_item_slot_2,
        ({ item: item2 }) => ({ 80: item2 }),
        ({ item: item2 }) => [0, 0, item2 ? 262144 : 0]
      ]
    },
    $$scope: { ctx }
  };
  item = new Item2({ props: item_props });
  assign_item();
  item.$on("selectedRecursion", selectedRecursion_handler_1);
  item.$on(
    "titleClick",
    /*titleClick_handler_1*/
    ctx[47]
  );
  return {
    c() {
      create_component(item.$$.fragment);
    },
    m(target, anchor) {
      mount_component(item, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (index !== /*index*/
      ctx[83]) {
        unassign_item();
        index = /*index*/
        ctx[83];
        assign_item();
      }
      const item_changes = {};
      if (dirty[0] & /*itemsList*/
      16) item_changes.uid = /*it*/
      ctx[81].uid;
      if (dirty[0] & /*ctxKey*/
      4) item_changes.ctxKey = /*ctxKey*/
      ctx[2];
      if (dirty[0] & /*itemsList*/
      16) item_changes.items = /*it*/
      ctx[81].children;
      if (dirty[0] & /*itemsList, level*/
      18) item_changes.level = /*getLevel*/
      ctx[19](
        /*it*/
        ctx[81],
        /*level*/
        ctx[1]
      ) + 1;
      if (dirty[0] & /*themeValue, iconCls, expendIconCls*/
      45056 | dirty[1] & /*$$scope*/
      1073741824 | dirty[2] & /*item*/
      262144) {
        item_changes.$$scope = { dirty, ctx };
      }
      item.$set(item_changes);
    },
    i(local) {
      if (current) return;
      transition_in(item.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(item.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      unassign_item();
      destroy_component(item, detaching);
    }
  };
}
function create_contentEl_slot_2(ctx) {
  let div2;
  let kmenu;
  let current;
  const kmenu_spread_levels = [
    /*ctxProps*/
    ctx[3],
    { ctxKey: (
      /*ctxKey*/
      ctx[2]
    ) },
    {
      show: (
        /*hasSub*/
        ctx[17](
          /*it*/
          ctx[81]
        ) && !/*isGroup*/
        ctx[18](
          /*it*/
          ctx[81]
        )
      )
    },
    { cls: (
      /*subMenuCls*/
      ctx[27](false)
    ) }
  ];
  let kmenu_props = {
    $$slots: { default: [create_default_slot_2$2] },
    $$scope: { ctx }
  };
  for (let i = 0; i < kmenu_spread_levels.length; i += 1) {
    kmenu_props = assign(kmenu_props, kmenu_spread_levels[i]);
  }
  kmenu = new Dist13({ props: kmenu_props });
  return {
    c() {
      div2 = element("div");
      create_component(kmenu.$$.fragment);
      attr(div2, "slot", "contentEl");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      mount_component(kmenu, div2, null);
      current = true;
    },
    p(ctx2, dirty) {
      const kmenu_changes = dirty[0] & /*ctxProps, ctxKey, hasSub, itemsList, isGroup, subMenuCls*/
      134610972 ? get_spread_update(kmenu_spread_levels, [
        dirty[0] & /*ctxProps*/
        8 && get_spread_object(
          /*ctxProps*/
          ctx2[3]
        ),
        dirty[0] & /*ctxKey*/
        4 && { ctxKey: (
          /*ctxKey*/
          ctx2[2]
        ) },
        dirty[0] & /*hasSub, itemsList, isGroup*/
        393232 && {
          show: (
            /*hasSub*/
            ctx2[17](
              /*it*/
              ctx2[81]
            ) && !/*isGroup*/
            ctx2[18](
              /*it*/
              ctx2[81]
            )
          )
        },
        dirty[0] & /*subMenuCls*/
        134217728 && { cls: (
          /*subMenuCls*/
          ctx2[27](false)
        ) }
      ]) : {};
      if (dirty[0] & /*itemsList, ctxKey, level, subMenuRef, themeValue, iconCls, expendIconCls*/
      45142 | dirty[1] & /*$$scope*/
      1073741824) {
        kmenu_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kmenu.$set(kmenu_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kmenu.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kmenu.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      destroy_component(kmenu);
    }
  };
}
function create_if_block_3(ctx) {
  let kpopover;
  let index = (
    /*index*/
    ctx[83]
  );
  let current;
  const assign_kpopover = () => (
    /*kpopover_binding_1*/
    ctx[55](kpopover, index)
  );
  const unassign_kpopover = () => (
    /*kpopover_binding_1*/
    ctx[55](null, index)
  );
  function change_handler_1(...args) {
    return (
      /*change_handler_1*/
      ctx[56](
        /*it*/
        ctx[81],
        ...args
      )
    );
  }
  let kpopover_props = {
    width: (
      /*widths*/
      ctx[8][
        /*index*/
        ctx[83]
      ]
    ),
    order: (
      /*index*/
      ctx[83]
    ),
    theme: (
      /*themeValue*/
      ctx[15](
        /*it*/
        ctx[81]
      )
    ),
    opacity: (
      /*ops*/
      ctx[7][
        /*index*/
        ctx[83]
      ]
    ),
    attrsTrigger: { "data-k-menu-h": `${/*level*/
    ctx[1]}` },
    arrow: false,
    placement: (
      /*level*/
      ctx[1] === 1 ? "bottom" : "right"
    ),
    offsetComputed: (
      /*setPopoverOffset*/
      ctx[29]
    ),
    fallbackPlacements: (
      /*level*/
      ctx[1] === 1 ? ["bottom", "top"] : ["right", "left"]
    ),
    mouseEnterDelay: (
      /*ctxProps*/
      ctx[3].subMenuOpenDelay
    ),
    mouseLeaveDelay: (
      /*ctxProps*/
      ctx[3].subMenuCloseDelay
    ),
    trigger: (
      /*ctxProps*/
      ctx[3].triggerSubMenuAction
    ),
    cls: (
      /*popoverContentCls*/
      ctx[11](
        /*it*/
        ctx[81]
      )
    ),
    clsTrigger: (
      /*popoverTriggerCls*/
      ctx[28](
        /*it*/
        ctx[81].type === "divider"
      )
    ),
    disabled: !/*hasSub*/
    (ctx[17](
      /*it*/
      ctx[81]
    ) || /*isGroup*/
    ctx[18](
      /*it*/
      ctx[81]
    )),
    $$slots: {
      contentEl: [create_contentEl_slot_1],
      triggerEl: [create_triggerEl_slot_1]
    },
    $$scope: { ctx }
  };
  kpopover = new Dist$b({ props: kpopover_props });
  assign_kpopover();
  kpopover.$on("change", change_handler_1);
  kpopover.$on(
    "animateStart",
    /*showSubMenuPopover*/
    ctx[23]
  );
  return {
    c() {
      create_component(kpopover.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kpopover, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (index !== /*index*/
      ctx[83]) {
        unassign_kpopover();
        index = /*index*/
        ctx[83];
        assign_kpopover();
      }
      const kpopover_changes = {};
      if (dirty[0] & /*widths, itemsList*/
      272) kpopover_changes.width = /*widths*/
      ctx[8][
        /*index*/
        ctx[83]
      ];
      if (dirty[0] & /*itemsList*/
      16) kpopover_changes.order = /*index*/
      ctx[83];
      if (dirty[0] & /*themeValue, itemsList*/
      32784) kpopover_changes.theme = /*themeValue*/
      ctx[15](
        /*it*/
        ctx[81]
      );
      if (dirty[0] & /*ops, itemsList*/
      144) kpopover_changes.opacity = /*ops*/
      ctx[7][
        /*index*/
        ctx[83]
      ];
      if (dirty[0] & /*level*/
      2) kpopover_changes.attrsTrigger = { "data-k-menu-h": `${/*level*/
      ctx[1]}` };
      if (dirty[0] & /*level*/
      2) kpopover_changes.placement = /*level*/
      ctx[1] === 1 ? "bottom" : "right";
      if (dirty[0] & /*level*/
      2) kpopover_changes.fallbackPlacements = /*level*/
      ctx[1] === 1 ? ["bottom", "top"] : ["right", "left"];
      if (dirty[0] & /*ctxProps*/
      8) kpopover_changes.mouseEnterDelay = /*ctxProps*/
      ctx[3].subMenuOpenDelay;
      if (dirty[0] & /*ctxProps*/
      8) kpopover_changes.mouseLeaveDelay = /*ctxProps*/
      ctx[3].subMenuCloseDelay;
      if (dirty[0] & /*ctxProps*/
      8) kpopover_changes.trigger = /*ctxProps*/
      ctx[3].triggerSubMenuAction;
      if (dirty[0] & /*popoverContentCls, itemsList*/
      2064) kpopover_changes.cls = /*popoverContentCls*/
      ctx[11](
        /*it*/
        ctx[81]
      );
      if (dirty[0] & /*itemsList*/
      16) kpopover_changes.clsTrigger = /*popoverTriggerCls*/
      ctx[28](
        /*it*/
        ctx[81].type === "divider"
      );
      if (dirty[0] & /*itemsList*/
      16) kpopover_changes.disabled = !/*hasSub*/
      (ctx[17](
        /*it*/
        ctx[81]
      ) || /*isGroup*/
      ctx[18](
        /*it*/
        ctx[81]
      ));
      if (dirty[0] & /*itemsList, ctxProps, ctxKey, level, subMenuRef, themeValue, iconCls, expendIconCls, cnames, attrs, getIndent*/
      62559 | dirty[1] & /*$$scope, $$restProps*/
      1073741840) {
        kpopover_changes.$$scope = { dirty, ctx };
      }
      kpopover.$set(kpopover_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kpopover.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kpopover.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      unassign_kpopover();
      destroy_component(kpopover, detaching);
    }
  };
}
function create_else_block$1(ctx) {
  let kdivider;
  let current;
  kdivider = new Dist$1({
    props: {
      cls: (
        /*dividerCls*/
        ctx[26]
      ),
      direction: (
        /*level*/
        ctx[1] === 1 ? "vertical" : "horizontal"
      )
    }
  });
  return {
    c() {
      create_component(kdivider.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kdivider, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kdivider_changes = {};
      if (dirty[0] & /*level*/
      2) kdivider_changes.direction = /*level*/
      ctx2[1] === 1 ? "vertical" : "horizontal";
      kdivider.$set(kdivider_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kdivider.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kdivider.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kdivider, detaching);
    }
  };
}
function create_if_block_6(ctx) {
  let li;
  let li_class_value;
  let li_title_value;
  let current;
  let mounted;
  let dispose;
  const item_slot_template = (
    /*#slots*/
    ctx[41].item
  );
  const item_slot = create_slot(
    item_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_item_slot_context_5
  );
  const item_slot_or_fallback = item_slot || fallback_block_8(ctx);
  let li_levels = [
    { role: "menuitem" },
    {
      class: li_class_value = /*cnames*/
      ctx[14](
        /*it*/
        ctx[81]
      )
    },
    {
      title: li_title_value = /*resolveTitle*/
      ctx[33](
        /*it*/
        ctx[81],
        /*ctxProps*/
        ctx[3].inlineCollapsed,
        false
      )
    },
    /*$$restProps*/
    ctx[35],
    /*attrs*/
    ctx[0]
  ];
  let li_data = {};
  for (let i = 0; i < li_levels.length; i += 1) {
    li_data = assign(li_data, li_levels[i]);
  }
  function click_handler_2(...args) {
    return (
      /*click_handler_2*/
      ctx[54](
        /*it*/
        ctx[81],
        ...args
      )
    );
  }
  return {
    c() {
      li = element("li");
      if (item_slot_or_fallback) item_slot_or_fallback.c();
      set_attributes(li, li_data);
      set_style(li, "padding-left", `${/*getIndent*/
      ctx[10](
        /*it*/
        ctx[81],
        /*ctxProps*/
        ctx[3].inlineCollapsed
      )}`);
    },
    m(target, anchor) {
      insert(target, li, anchor);
      if (item_slot_or_fallback) {
        item_slot_or_fallback.m(li, null);
      }
      current = true;
      if (!mounted) {
        dispose = listen(li, "click", click_handler_2);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (item_slot) {
        if (item_slot.p && (!current || dirty[0] & /*itemsList*/
        16 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            item_slot,
            item_slot_template,
            ctx,
            /*$$scope*/
            ctx[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx[61]
            ) : get_slot_changes(
              item_slot_template,
              /*$$scope*/
              ctx[61],
              dirty,
              get_item_slot_changes_5
            ),
            get_item_slot_context_5
          );
        }
      } else {
        if (item_slot_or_fallback && item_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, itemsList, iconCls, expendIconCls, level*/
        45074 | dirty[1] & /*$$scope*/
        1073741824)) {
          item_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
        }
      }
      set_attributes(li, li_data = get_spread_update(li_levels, [
        { role: "menuitem" },
        (!current || dirty[0] & /*cnames, itemsList*/
        16400 && li_class_value !== (li_class_value = /*cnames*/
        ctx[14](
          /*it*/
          ctx[81]
        ))) && { class: li_class_value },
        (!current || dirty[0] & /*itemsList, ctxProps*/
        24 && li_title_value !== (li_title_value = /*resolveTitle*/
        ctx[33](
          /*it*/
          ctx[81],
          /*ctxProps*/
          ctx[3].inlineCollapsed,
          false
        ))) && { title: li_title_value },
        dirty[1] & /*$$restProps*/
        16 && /*$$restProps*/
        ctx[35],
        dirty[0] & /*attrs*/
        1 && /*attrs*/
        ctx[0]
      ]));
      set_style(li, "padding-left", `${/*getIndent*/
      ctx[10](
        /*it*/
        ctx[81],
        /*ctxProps*/
        ctx[3].inlineCollapsed
      )}`);
    },
    i(local) {
      if (current) return;
      transition_in(item_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(item_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(li);
      }
      if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_8(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*it*/
          ctx[81]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*it*/
          ctx[81]
        )
      ),
      height: "14px",
      icon: (
        /*it*/
        ctx[81].icon
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue, itemsList*/
      32784) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*iconCls, itemsList*/
      8208) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*itemsList*/
      16) kicon_changes.icon = /*it*/
      ctx2[81].icon;
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_11(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*it*/
    ctx[81].icon && create_if_block_8(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*it*/
        ctx2[81].icon
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*itemsList*/
          16) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_8(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function fallback_block_10(ctx) {
  let span;
  let t_value = (
    /*it*/
    ctx[81].label + ""
  );
  let t;
  let span_class_value;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", span_class_value = /*titleContentCls*/
      ctx[25](!!/*it*/
      ctx[81].icon));
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*itemsList*/
      16 && t_value !== (t_value = /*it*/
      ctx2[81].label + "")) set_data(t, t_value);
      if (dirty[0] & /*itemsList*/
      16 && span_class_value !== (span_class_value = /*titleContentCls*/
      ctx2[25](!!/*it*/
      ctx2[81].icon))) {
        attr(span, "class", span_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_7(ctx) {
  let current;
  const expandIcon_slot_template = (
    /*#slots*/
    ctx[41].expandIcon
  );
  const expandIcon_slot = create_slot(
    expandIcon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_expandIcon_slot_context_5
  );
  const expandIcon_slot_or_fallback = expandIcon_slot || fallback_block_9(ctx);
  return {
    c() {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (expandIcon_slot_or_fallback) {
        expandIcon_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (expandIcon_slot) {
        if (expandIcon_slot.p && (!current || dirty[0] & /*itemsList, iconCls*/
        8208 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            expandIcon_slot,
            expandIcon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              expandIcon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_expandIcon_slot_changes_5
            ),
            get_expandIcon_slot_context_5
          );
        }
      } else {
        if (expandIcon_slot_or_fallback && expandIcon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, itemsList, iconCls, expendIconCls*/
        45072)) {
          expandIcon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(expandIcon_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(expandIcon_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block_9(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*it*/
          ctx[81]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*it*/
          ctx[81]
        )
      ),
      height: "14px",
      icon: (
        /*expendIconCls*/
        ctx[12](
          /*it*/
          ctx[81]
        )
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue, itemsList*/
      32784) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*iconCls, itemsList*/
      8208) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*it*/
        ctx2[81]
      );
      if (dirty[0] & /*expendIconCls, itemsList*/
      4112) kicon_changes.icon = /*expendIconCls*/
      ctx2[12](
        /*it*/
        ctx2[81]
      );
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_8(ctx) {
  let span;
  let t0;
  let t1;
  let show_if = (
    /*hasSub*/
    ctx[17](
      /*it*/
      ctx[81]
    ) && !/*isGroup*/
    ctx[18](
      /*it*/
      ctx[81]
    ) && /*level*/
    ctx[1] !== 1
  );
  let if_block_anchor;
  let current;
  const icon_slot_template = (
    /*#slots*/
    ctx[41].icon
  );
  const icon_slot = create_slot(
    icon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_icon_slot_context_5
  );
  const icon_slot_or_fallback = icon_slot || fallback_block_11(ctx);
  const label_slot_template = (
    /*#slots*/
    ctx[41].label
  );
  const label_slot = create_slot(
    label_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_label_slot_context_5
  );
  const label_slot_or_fallback = label_slot || fallback_block_10(ctx);
  let if_block = show_if && create_if_block_7(ctx);
  return {
    c() {
      span = element("span");
      if (icon_slot_or_fallback) icon_slot_or_fallback.c();
      t0 = space();
      if (label_slot_or_fallback) label_slot_or_fallback.c();
      t1 = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
      attr(
        span,
        "class",
        /*iconRootCls*/
        ctx[24]()
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (icon_slot_or_fallback) {
        icon_slot_or_fallback.m(span, null);
      }
      append(span, t0);
      if (label_slot_or_fallback) {
        label_slot_or_fallback.m(span, null);
      }
      insert(target, t1, anchor);
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (icon_slot) {
        if (icon_slot.p && (!current || dirty[0] & /*itemsList, iconCls*/
        8208 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            icon_slot,
            icon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              icon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_icon_slot_changes_5
            ),
            get_icon_slot_context_5
          );
        }
      } else {
        if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, itemsList, iconCls*/
        40976)) {
          icon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (label_slot) {
        if (label_slot.p && (!current || dirty[0] & /*itemsList*/
        16 | dirty[1] & /*$$scope*/
        1073741824)) {
          update_slot_base(
            label_slot,
            label_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              label_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_label_slot_changes_5
            ),
            get_label_slot_context_5
          );
        }
      } else {
        if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[0] & /*itemsList*/
        16)) {
          label_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (dirty[0] & /*itemsList, level*/
      18) show_if = /*hasSub*/
      ctx2[17](
        /*it*/
        ctx2[81]
      ) && !/*isGroup*/
      ctx2[18](
        /*it*/
        ctx2[81]
      ) && /*level*/
      ctx2[1] !== 1;
      if (show_if) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*itemsList, level*/
          18) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_7(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(icon_slot_or_fallback, local);
      transition_in(label_slot_or_fallback, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(icon_slot_or_fallback, local);
      transition_out(label_slot_or_fallback, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
        detach(t1);
        detach(if_block_anchor);
      }
      if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
      if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_triggerEl_slot_1(ctx) {
  let current_block_type_index;
  let if_block;
  let t;
  let current;
  const if_block_creators = [create_if_block_6, create_else_block$1];
  const if_blocks = [];
  function select_block_type_2(ctx2, dirty) {
    if (
      /*it*/
      ctx2[81].type !== "divider"
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type_2(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      t = space();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, t, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_2(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(t.parentNode, t);
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function create_if_block_5(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*item*/
          ctx[80]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*item*/
          ctx[80]
        )
      ),
      height: "14px",
      icon: (
        /*item*/
        ctx[80].icon
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue*/
      32768 | dirty[2] & /*item*/
      262144) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*iconCls*/
      8192 | dirty[2] & /*item*/
      262144) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*item*/
        ctx2[80]
      );
      if (dirty[2] & /*item*/
      262144) kicon_changes.icon = /*item*/
      ctx2[80].icon;
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_7(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*item*/
    ctx[80].icon && create_if_block_5(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*item*/
        ctx2[80].icon
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[2] & /*item*/
          262144) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_5(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function fallback_block_6(ctx) {
  let span;
  let t_value = (
    /*item*/
    ctx[80].label + ""
  );
  let t;
  let span_class_value;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", span_class_value = /*titleContentCls*/
      ctx[25](!!/*item*/
      ctx[80].icon));
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty[2] & /*item*/
      262144 && t_value !== (t_value = /*item*/
      ctx2[80].label + "")) set_data(t, t_value);
      if (dirty[2] & /*item*/
      262144 && span_class_value !== (span_class_value = /*titleContentCls*/
      ctx2[25](!!/*item*/
      ctx2[80].icon))) {
        attr(span, "class", span_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_4(ctx) {
  let current;
  const expandIcon_slot_template = (
    /*#slots*/
    ctx[41].expandIcon
  );
  const expandIcon_slot = create_slot(
    expandIcon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_expandIcon_slot_context_4
  );
  const expandIcon_slot_or_fallback = expandIcon_slot || fallback_block_5(ctx);
  return {
    c() {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (expandIcon_slot_or_fallback) {
        expandIcon_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (expandIcon_slot) {
        if (expandIcon_slot.p && (!current || dirty[0] & /*iconCls*/
        8192 | dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            expandIcon_slot,
            expandIcon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              expandIcon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_expandIcon_slot_changes_4
            ),
            get_expandIcon_slot_context_4
          );
        }
      } else {
        if (expandIcon_slot_or_fallback && expandIcon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls, expendIconCls*/
        45056 | dirty[2] & /*item*/
        262144)) {
          expandIcon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(expandIcon_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(expandIcon_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block_5(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*item*/
          ctx[80]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*item*/
          ctx[80]
        )
      ),
      height: "14px",
      icon: (
        /*expendIconCls*/
        ctx[12](
          /*item*/
          ctx[80]
        )
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue*/
      32768 | dirty[2] & /*item*/
      262144) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*iconCls*/
      8192 | dirty[2] & /*item*/
      262144) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*expendIconCls*/
      4096 | dirty[2] & /*item*/
      262144) kicon_changes.icon = /*expendIconCls*/
      ctx2[12](
        /*item*/
        ctx2[80]
      );
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_4(ctx) {
  let span;
  let t0;
  let t1;
  let show_if = (
    /*hasSub*/
    ctx[17](
      /*item*/
      ctx[80]
    )
  );
  let if_block_anchor;
  let current;
  const icon_slot_template = (
    /*#slots*/
    ctx[41].icon
  );
  const icon_slot = create_slot(
    icon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_icon_slot_context_4
  );
  const icon_slot_or_fallback = icon_slot || fallback_block_7(ctx);
  const label_slot_template = (
    /*#slots*/
    ctx[41].label
  );
  const label_slot = create_slot(
    label_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_label_slot_context_4
  );
  const label_slot_or_fallback = label_slot || fallback_block_6(ctx);
  let if_block = show_if && create_if_block_4(ctx);
  return {
    c() {
      span = element("span");
      if (icon_slot_or_fallback) icon_slot_or_fallback.c();
      t0 = space();
      if (label_slot_or_fallback) label_slot_or_fallback.c();
      t1 = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
      attr(
        span,
        "class",
        /*iconRootCls*/
        ctx[24]()
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (icon_slot_or_fallback) {
        icon_slot_or_fallback.m(span, null);
      }
      append(span, t0);
      if (label_slot_or_fallback) {
        label_slot_or_fallback.m(span, null);
      }
      insert(target, t1, anchor);
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (icon_slot) {
        if (icon_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            icon_slot,
            icon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              icon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_icon_slot_changes_4
            ),
            get_icon_slot_context_4
          );
        }
      } else {
        if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls*/
        40960 | dirty[2] & /*item*/
        262144)) {
          icon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (label_slot) {
        if (label_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            label_slot,
            label_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              label_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_label_slot_changes_4
            ),
            get_label_slot_context_4
          );
        }
      } else {
        if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[2] & /*item*/
        262144)) {
          label_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (dirty[2] & /*item*/
      262144) show_if = /*hasSub*/
      ctx2[17](
        /*item*/
        ctx2[80]
      );
      if (show_if) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[2] & /*item*/
          262144) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_4(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(icon_slot_or_fallback, local);
      transition_in(label_slot_or_fallback, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(icon_slot_or_fallback, local);
      transition_out(label_slot_or_fallback, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
        detach(t1);
        detach(if_block_anchor);
      }
      if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
      if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_item_slot_1(ctx) {
  let current;
  const item_slot_template = (
    /*#slots*/
    ctx[41].item
  );
  const item_slot = create_slot(
    item_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_item_slot_context_4
  );
  const item_slot_or_fallback = item_slot || fallback_block_4(ctx);
  return {
    c() {
      if (item_slot_or_fallback) item_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (item_slot_or_fallback) {
        item_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (item_slot) {
        if (item_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            item_slot,
            item_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              item_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_item_slot_changes_4
            ),
            get_item_slot_context_4
          );
        }
      } else {
        if (item_slot_or_fallback && item_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls, expendIconCls*/
        45056 | dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          item_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(item_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(item_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
    }
  };
}
function create_default_slot_1$2(ctx) {
  let item;
  let index = (
    /*index*/
    ctx[83]
  );
  let current;
  const assign_item = () => (
    /*item_binding_1*/
    ctx[51](item, index)
  );
  const unassign_item = () => (
    /*item_binding_1*/
    ctx[51](null, index)
  );
  function selectedRecursion_handler_2(...args) {
    return (
      /*selectedRecursion_handler_2*/
      ctx[52](
        /*index*/
        ctx[83],
        ...args
      )
    );
  }
  let item_props = {
    uid: (
      /*it*/
      ctx[81].uid
    ),
    ctxKey: (
      /*ctxKey*/
      ctx[2]
    ),
    items: (
      /*it*/
      ctx[81].children
    ),
    level: (
      /*getLevel*/
      ctx[19](
        /*it*/
        ctx[81],
        /*level*/
        ctx[1]
      ) + 1
    ),
    $$slots: {
      item: [
        create_item_slot_1,
        ({ item: item2 }) => ({ 80: item2 }),
        ({ item: item2 }) => [0, 0, item2 ? 262144 : 0]
      ]
    },
    $$scope: { ctx }
  };
  item = new Item2({ props: item_props });
  assign_item();
  item.$on("selectedRecursion", selectedRecursion_handler_2);
  item.$on(
    "titleClick",
    /*titleClick_handler_2*/
    ctx[53]
  );
  return {
    c() {
      create_component(item.$$.fragment);
    },
    m(target, anchor) {
      mount_component(item, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (index !== /*index*/
      ctx[83]) {
        unassign_item();
        index = /*index*/
        ctx[83];
        assign_item();
      }
      const item_changes = {};
      if (dirty[0] & /*itemsList*/
      16) item_changes.uid = /*it*/
      ctx[81].uid;
      if (dirty[0] & /*ctxKey*/
      4) item_changes.ctxKey = /*ctxKey*/
      ctx[2];
      if (dirty[0] & /*itemsList*/
      16) item_changes.items = /*it*/
      ctx[81].children;
      if (dirty[0] & /*itemsList, level*/
      18) item_changes.level = /*getLevel*/
      ctx[19](
        /*it*/
        ctx[81],
        /*level*/
        ctx[1]
      ) + 1;
      if (dirty[0] & /*themeValue, iconCls, expendIconCls*/
      45056 | dirty[1] & /*$$scope*/
      1073741824 | dirty[2] & /*item*/
      262144) {
        item_changes.$$scope = { dirty, ctx };
      }
      item.$set(item_changes);
    },
    i(local) {
      if (current) return;
      transition_in(item.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(item.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      unassign_item();
      destroy_component(item, detaching);
    }
  };
}
function create_contentEl_slot_1(ctx) {
  let div2;
  let kmenu;
  let t;
  let current;
  const kmenu_spread_levels = [
    /*ctxProps*/
    ctx[3],
    { ctxKey: (
      /*ctxKey*/
      ctx[2]
    ) },
    {
      show: (
        /*hasSub*/
        ctx[17](
          /*it*/
          ctx[81]
        ) && !/*isGroup*/
        ctx[18](
          /*it*/
          ctx[81]
        )
      )
    },
    { cls: (
      /*subMenuCls*/
      ctx[27](false)
    ) }
  ];
  let kmenu_props = {
    $$slots: { default: [create_default_slot_1$2] },
    $$scope: { ctx }
  };
  for (let i = 0; i < kmenu_spread_levels.length; i += 1) {
    kmenu_props = assign(kmenu_props, kmenu_spread_levels[i]);
  }
  kmenu = new Dist13({ props: kmenu_props });
  return {
    c() {
      div2 = element("div");
      create_component(kmenu.$$.fragment);
      t = space();
      attr(div2, "slot", "contentEl");
      set_style(
        div2,
        "min-width",
        /*popoverContentWidth*/
        ctx[30](
          /*index*/
          ctx[83]
        )
      );
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      mount_component(kmenu, div2, null);
      append(div2, t);
      current = true;
    },
    p(ctx2, dirty) {
      const kmenu_changes = dirty[0] & /*ctxProps, ctxKey, hasSub, itemsList, isGroup, subMenuCls*/
      134610972 ? get_spread_update(kmenu_spread_levels, [
        dirty[0] & /*ctxProps*/
        8 && get_spread_object(
          /*ctxProps*/
          ctx2[3]
        ),
        dirty[0] & /*ctxKey*/
        4 && { ctxKey: (
          /*ctxKey*/
          ctx2[2]
        ) },
        dirty[0] & /*hasSub, itemsList, isGroup*/
        393232 && {
          show: (
            /*hasSub*/
            ctx2[17](
              /*it*/
              ctx2[81]
            ) && !/*isGroup*/
            ctx2[18](
              /*it*/
              ctx2[81]
            )
          )
        },
        dirty[0] & /*subMenuCls*/
        134217728 && { cls: (
          /*subMenuCls*/
          ctx2[27](false)
        ) }
      ]) : {};
      if (dirty[0] & /*itemsList, ctxKey, level, subMenuRef, themeValue, iconCls, expendIconCls*/
      45142 | dirty[1] & /*$$scope*/
      1073741824) {
        kmenu_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kmenu.$set(kmenu_changes);
      if (dirty[0] & /*itemsList*/
      16) {
        set_style(
          div2,
          "min-width",
          /*popoverContentWidth*/
          ctx2[30](
            /*index*/
            ctx2[83]
          )
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(kmenu.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kmenu.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      destroy_component(kmenu);
    }
  };
}
function create_each_block(key_1, ctx) {
  let first;
  let t0;
  let t1;
  let if_block2_anchor;
  let current;
  let if_block0 = (
    /*ctxProps*/
    ctx[3].mode === "inline" && create_if_block_16(ctx)
  );
  let if_block1 = (
    /*ctxProps*/
    ctx[3].mode === "vertical" && create_if_block_9(ctx)
  );
  let if_block2 = (
    /*ctxProps*/
    ctx[3].mode === "horizontal" && create_if_block_3(ctx)
  );
  return {
    key: key_1,
    first: null,
    c() {
      first = empty();
      if (if_block0) if_block0.c();
      t0 = space();
      if (if_block1) if_block1.c();
      t1 = space();
      if (if_block2) if_block2.c();
      if_block2_anchor = empty();
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      if (if_block0) if_block0.m(target, anchor);
      insert(target, t0, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, t1, anchor);
      if (if_block2) if_block2.m(target, anchor);
      insert(target, if_block2_anchor, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (
        /*ctxProps*/
        ctx[3].mode === "inline"
      ) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
          if (dirty[0] & /*ctxProps*/
          8) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_16(ctx);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (
        /*ctxProps*/
        ctx[3].mode === "vertical"
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
          if (dirty[0] & /*ctxProps*/
          8) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_9(ctx);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(t1.parentNode, t1);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (
        /*ctxProps*/
        ctx[3].mode === "horizontal"
      ) {
        if (if_block2) {
          if_block2.p(ctx, dirty);
          if (dirty[0] & /*ctxProps*/
          8) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block_3(ctx);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(if_block2);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      transition_out(if_block2);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(first);
        detach(t0);
        detach(t1);
        detach(if_block2_anchor);
      }
      if (if_block0) if_block0.d(detaching);
      if (if_block1) if_block1.d(detaching);
      if (if_block2) if_block2.d(detaching);
    }
  };
}
function create_if_block$1(ctx) {
  let kpopover;
  let current;
  let kpopover_props = {
    arrow: false,
    placement: (
      /*level*/
      ctx[1] === 1 ? "bottom" : "right"
    ),
    fallbackPlacements: ["bottom", "top"],
    mouseEnterDelay: (
      /*ctxProps*/
      ctx[3].subMenuOpenDelay
    ),
    mouseLeaveDelay: (
      /*ctxProps*/
      ctx[3].subMenuCloseDelay
    ),
    trigger: (
      /*ctxProps*/
      ctx[3].triggerSubMenuAction
    ),
    theme: (
      /*themeValue*/
      ctx[15](
        /*moreItem*/
        ctx[9]
      )
    ),
    cls: (
      /*popoverContentCls*/
      ctx[11]()
    ),
    width: (
      /*widths*/
      ctx[8][
        /*itemsList*/
        ctx[4].length
      ]
    ),
    opacity: (
      /*ops*/
      ctx[7][
        /*itemsList*/
        ctx[4].length
      ]
    ),
    order: (
      /*itemsList*/
      ctx[4].length
    ),
    $$slots: {
      contentEl: [create_contentEl_slot],
      triggerEl: [create_triggerEl_slot]
    },
    $$scope: { ctx }
  };
  kpopover = new Dist$b({ props: kpopover_props });
  ctx[60](kpopover);
  kpopover.$on(
    "animateStart",
    /*showSubMenuPopover*/
    ctx[23]
  );
  return {
    c() {
      create_component(kpopover.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kpopover, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kpopover_changes = {};
      if (dirty[0] & /*level*/
      2) kpopover_changes.placement = /*level*/
      ctx2[1] === 1 ? "bottom" : "right";
      if (dirty[0] & /*ctxProps*/
      8) kpopover_changes.mouseEnterDelay = /*ctxProps*/
      ctx2[3].subMenuOpenDelay;
      if (dirty[0] & /*ctxProps*/
      8) kpopover_changes.mouseLeaveDelay = /*ctxProps*/
      ctx2[3].subMenuCloseDelay;
      if (dirty[0] & /*ctxProps*/
      8) kpopover_changes.trigger = /*ctxProps*/
      ctx2[3].triggerSubMenuAction;
      if (dirty[0] & /*themeValue, moreItem*/
      33280) kpopover_changes.theme = /*themeValue*/
      ctx2[15](
        /*moreItem*/
        ctx2[9]
      );
      if (dirty[0] & /*popoverContentCls*/
      2048) kpopover_changes.cls = /*popoverContentCls*/
      ctx2[11]();
      if (dirty[0] & /*widths, itemsList*/
      272) kpopover_changes.width = /*widths*/
      ctx2[8][
        /*itemsList*/
        ctx2[4].length
      ];
      if (dirty[0] & /*ops, itemsList*/
      144) kpopover_changes.opacity = /*ops*/
      ctx2[7][
        /*itemsList*/
        ctx2[4].length
      ];
      if (dirty[0] & /*itemsList*/
      16) kpopover_changes.order = /*itemsList*/
      ctx2[4].length;
      if (dirty[0] & /*ctxProps, ctxKey, moreItem, level, subMenuRef, itemsList, themeValue, iconCls, expendIconCls, cnames, attrs*/
      62047 | dirty[1] & /*$$scope, $$restProps*/
      1073741840) {
        kpopover_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kpopover.$set(kpopover_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kpopover.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kpopover.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[60](null);
      destroy_component(kpopover, detaching);
    }
  };
}
function create_triggerEl_slot(ctx) {
  let li;
  let t;
  let li_class_value;
  let li_levels = [
    { slot: "triggerEl" },
    {
      class: li_class_value = /*cnames*/
      ctx[14](
        /*moreItem*/
        ctx[9]
      )
    },
    /*$$restProps*/
    ctx[35],
    /*attrs*/
    ctx[0]
  ];
  let li_data = {};
  for (let i = 0; i < li_levels.length; i += 1) {
    li_data = assign(li_data, li_levels[i]);
  }
  return {
    c() {
      li = element("li");
      t = text("...");
      set_attributes(li, li_data);
    },
    m(target, anchor) {
      insert(target, li, anchor);
      append(li, t);
    },
    p(ctx2, dirty) {
      set_attributes(li, li_data = get_spread_update(li_levels, [
        { slot: "triggerEl" },
        dirty[0] & /*cnames, moreItem*/
        16896 && li_class_value !== (li_class_value = /*cnames*/
        ctx2[14](
          /*moreItem*/
          ctx2[9]
        )) && { class: li_class_value },
        dirty[1] & /*$$restProps*/
        16 && /*$$restProps*/
        ctx2[35],
        dirty[0] & /*attrs*/
        1 && /*attrs*/
        ctx2[0]
      ]));
    },
    d(detaching) {
      if (detaching) {
        detach(li);
      }
    }
  };
}
function create_if_block_2(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*item*/
          ctx[80]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*item*/
          ctx[80]
        )
      ),
      height: "14px",
      icon: (
        /*item*/
        ctx[80].icon
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue*/
      32768 | dirty[2] & /*item*/
      262144) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*iconCls*/
      8192 | dirty[2] & /*item*/
      262144) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*item*/
        ctx2[80]
      );
      if (dirty[2] & /*item*/
      262144) kicon_changes.icon = /*item*/
      ctx2[80].icon;
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block_3(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*item*/
    ctx[80].icon && create_if_block_2(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*item*/
        ctx2[80].icon
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[2] & /*item*/
          262144) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function fallback_block_2(ctx) {
  let span;
  let t_value = (
    /*item*/
    ctx[80].label + ""
  );
  let t;
  let span_class_value;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", span_class_value = /*titleContentCls*/
      ctx[25](!!/*item*/
      ctx[80].icon));
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty[2] & /*item*/
      262144 && t_value !== (t_value = /*item*/
      ctx2[80].label + "")) set_data(t, t_value);
      if (dirty[2] & /*item*/
      262144 && span_class_value !== (span_class_value = /*titleContentCls*/
      ctx2[25](!!/*item*/
      ctx2[80].icon))) {
        attr(span, "class", span_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_1(ctx) {
  let current;
  const expandIcon_slot_template = (
    /*#slots*/
    ctx[41].expandIcon
  );
  const expandIcon_slot = create_slot(
    expandIcon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_expandIcon_slot_context_6
  );
  const expandIcon_slot_or_fallback = expandIcon_slot || fallback_block_1(ctx);
  return {
    c() {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (expandIcon_slot_or_fallback) {
        expandIcon_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (expandIcon_slot) {
        if (expandIcon_slot.p && (!current || dirty[0] & /*iconCls*/
        8192 | dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            expandIcon_slot,
            expandIcon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              expandIcon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_expandIcon_slot_changes_6
            ),
            get_expandIcon_slot_context_6
          );
        }
      } else {
        if (expandIcon_slot_or_fallback && expandIcon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls, expendIconCls*/
        45056 | dirty[2] & /*item*/
        262144)) {
          expandIcon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(expandIcon_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(expandIcon_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (expandIcon_slot_or_fallback) expandIcon_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block_1(ctx) {
  let kicon;
  let current;
  kicon = new Dist$c({
    props: {
      theme: (
        /*themeValue*/
        ctx[15](
          /*item*/
          ctx[80]
        )
      ),
      width: "14px",
      cls: (
        /*iconCls*/
        ctx[13](
          /*item*/
          ctx[80]
        )
      ),
      height: "14px",
      icon: (
        /*expendIconCls*/
        ctx[12](
          /*item*/
          ctx[80]
        )
      )
    }
  });
  return {
    c() {
      create_component(kicon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kicon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kicon_changes = {};
      if (dirty[0] & /*themeValue*/
      32768 | dirty[2] & /*item*/
      262144) kicon_changes.theme = /*themeValue*/
      ctx2[15](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*iconCls*/
      8192 | dirty[2] & /*item*/
      262144) kicon_changes.cls = /*iconCls*/
      ctx2[13](
        /*item*/
        ctx2[80]
      );
      if (dirty[0] & /*expendIconCls*/
      4096 | dirty[2] & /*item*/
      262144) kicon_changes.icon = /*expendIconCls*/
      ctx2[12](
        /*item*/
        ctx2[80]
      );
      kicon.$set(kicon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kicon, detaching);
    }
  };
}
function fallback_block(ctx) {
  let span;
  let t0;
  let t1;
  let show_if = (
    /*hasSub*/
    ctx[17](
      /*item*/
      ctx[80]
    )
  );
  let if_block_anchor;
  let current;
  const icon_slot_template = (
    /*#slots*/
    ctx[41].icon
  );
  const icon_slot = create_slot(
    icon_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_icon_slot_context_6
  );
  const icon_slot_or_fallback = icon_slot || fallback_block_3(ctx);
  const label_slot_template = (
    /*#slots*/
    ctx[41].label
  );
  const label_slot = create_slot(
    label_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_label_slot_context_6
  );
  const label_slot_or_fallback = label_slot || fallback_block_2(ctx);
  let if_block = show_if && create_if_block_1(ctx);
  return {
    c() {
      span = element("span");
      if (icon_slot_or_fallback) icon_slot_or_fallback.c();
      t0 = space();
      if (label_slot_or_fallback) label_slot_or_fallback.c();
      t1 = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
      attr(
        span,
        "class",
        /*iconRootCls*/
        ctx[24]()
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (icon_slot_or_fallback) {
        icon_slot_or_fallback.m(span, null);
      }
      append(span, t0);
      if (label_slot_or_fallback) {
        label_slot_or_fallback.m(span, null);
      }
      insert(target, t1, anchor);
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (icon_slot) {
        if (icon_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            icon_slot,
            icon_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              icon_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_icon_slot_changes_6
            ),
            get_icon_slot_context_6
          );
        }
      } else {
        if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls*/
        40960 | dirty[2] & /*item*/
        262144)) {
          icon_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (label_slot) {
        if (label_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            label_slot,
            label_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              label_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_label_slot_changes_6
            ),
            get_label_slot_context_6
          );
        }
      } else {
        if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[2] & /*item*/
        262144)) {
          label_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
      if (dirty[2] & /*item*/
      262144) show_if = /*hasSub*/
      ctx2[17](
        /*item*/
        ctx2[80]
      );
      if (show_if) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[2] & /*item*/
          262144) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_1(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(icon_slot_or_fallback, local);
      transition_in(label_slot_or_fallback, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(icon_slot_or_fallback, local);
      transition_out(label_slot_or_fallback, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
        detach(t1);
        detach(if_block_anchor);
      }
      if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
      if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_item_slot(ctx) {
  let current;
  const item_slot_template = (
    /*#slots*/
    ctx[41].item
  );
  const item_slot = create_slot(
    item_slot_template,
    ctx,
    /*$$scope*/
    ctx[61],
    get_item_slot_context_6
  );
  const item_slot_or_fallback = item_slot || fallback_block(ctx);
  return {
    c() {
      if (item_slot_or_fallback) item_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (item_slot_or_fallback) {
        item_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (item_slot) {
        if (item_slot.p && (!current || dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          update_slot_base(
            item_slot,
            item_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[61],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[61]
            ) : get_slot_changes(
              item_slot_template,
              /*$$scope*/
              ctx2[61],
              dirty,
              get_item_slot_changes_6
            ),
            get_item_slot_context_6
          );
        }
      } else {
        if (item_slot_or_fallback && item_slot_or_fallback.p && (!current || dirty[0] & /*themeValue, iconCls, expendIconCls*/
        45056 | dirty[1] & /*$$scope*/
        1073741824 | dirty[2] & /*item*/
        262144)) {
          item_slot_or_fallback.p(ctx2, !current ? [-1, -1, -1] : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(item_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(item_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
    }
  };
}
function create_default_slot$2(ctx) {
  let item;
  let current;
  let item_props = {
    uid: (
      /*moreItem*/
      ctx[9].uid
    ),
    ctxKey: (
      /*ctxKey*/
      ctx[2]
    ),
    items: (
      /*moreItem*/
      ctx[9].children
    ),
    level: (
      /*getLevel*/
      ctx[19](
        /*moreItem*/
        ctx[9],
        /*level*/
        ctx[1]
      ) + 1
    ),
    $$slots: {
      item: [
        create_item_slot,
        ({ item: item2 }) => ({ 80: item2 }),
        ({ item: item2 }) => [0, 0, item2 ? 262144 : 0]
      ]
    },
    $$scope: { ctx }
  };
  item = new Item2({ props: item_props });
  ctx[57](item);
  item.$on(
    "selectedRecursion",
    /*selectedRecursion_handler_3*/
    ctx[58]
  );
  item.$on(
    "titleClick",
    /*titleClick_handler_3*/
    ctx[59]
  );
  return {
    c() {
      create_component(item.$$.fragment);
    },
    m(target, anchor) {
      mount_component(item, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const item_changes = {};
      if (dirty[0] & /*moreItem*/
      512) item_changes.uid = /*moreItem*/
      ctx2[9].uid;
      if (dirty[0] & /*ctxKey*/
      4) item_changes.ctxKey = /*ctxKey*/
      ctx2[2];
      if (dirty[0] & /*moreItem*/
      512) item_changes.items = /*moreItem*/
      ctx2[9].children;
      if (dirty[0] & /*moreItem, level*/
      514) item_changes.level = /*getLevel*/
      ctx2[19](
        /*moreItem*/
        ctx2[9],
        /*level*/
        ctx2[1]
      ) + 1;
      if (dirty[0] & /*themeValue, iconCls, expendIconCls*/
      45056 | dirty[1] & /*$$scope*/
      1073741824 | dirty[2] & /*item*/
      262144) {
        item_changes.$$scope = { dirty, ctx: ctx2 };
      }
      item.$set(item_changes);
    },
    i(local) {
      if (current) return;
      transition_in(item.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(item.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[57](null);
      destroy_component(item, detaching);
    }
  };
}
function create_contentEl_slot(ctx) {
  let div2;
  let kmenu;
  let current;
  const kmenu_spread_levels = [
    /*ctxProps*/
    ctx[3],
    { ctxKey: (
      /*ctxKey*/
      ctx[2]
    ) },
    {
      show: (
        /*hasSub*/
        ctx[17](
          /*moreItem*/
          ctx[9]
        )
      )
    },
    { cls: (
      /*subMenuCls*/
      ctx[27](false)
    ) }
  ];
  let kmenu_props = {
    $$slots: { default: [create_default_slot$2] },
    $$scope: { ctx }
  };
  for (let i = 0; i < kmenu_spread_levels.length; i += 1) {
    kmenu_props = assign(kmenu_props, kmenu_spread_levels[i]);
  }
  kmenu = new Dist13({ props: kmenu_props });
  return {
    c() {
      div2 = element("div");
      create_component(kmenu.$$.fragment);
      attr(div2, "slot", "contentEl");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      mount_component(kmenu, div2, null);
      current = true;
    },
    p(ctx2, dirty) {
      const kmenu_changes = dirty[0] & /*ctxProps, ctxKey, hasSub, moreItem, subMenuCls*/
      134349324 ? get_spread_update(kmenu_spread_levels, [
        dirty[0] & /*ctxProps*/
        8 && get_spread_object(
          /*ctxProps*/
          ctx2[3]
        ),
        dirty[0] & /*ctxKey*/
        4 && { ctxKey: (
          /*ctxKey*/
          ctx2[2]
        ) },
        dirty[0] & /*hasSub, moreItem*/
        131584 && {
          show: (
            /*hasSub*/
            ctx2[17](
              /*moreItem*/
              ctx2[9]
            )
          )
        },
        dirty[0] & /*subMenuCls*/
        134217728 && { cls: (
          /*subMenuCls*/
          ctx2[27](false)
        ) }
      ]) : {};
      if (dirty[0] & /*moreItem, ctxKey, level, subMenuRef, itemsList, themeValue, iconCls, expendIconCls*/
      45654 | dirty[1] & /*$$scope*/
      1073741824) {
        kmenu_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kmenu.$set(kmenu_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kmenu.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kmenu.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      destroy_component(kmenu);
    }
  };
}
function create_fragment$a(ctx) {
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t;
  let if_block_anchor;
  let current;
  let each_value = ensure_array_like(
    /*itemsList*/
    ctx[4]
  );
  const get_key = (ctx2) => (
    /*it*/
    ctx2[81].uid
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  }
  let if_block = (
    /*ctxProps*/
    ctx[3].mode === "horizontal" && /*showMoreItems*/
    ctx[16] && /*level*/
    ctx[1] === 1 && create_if_block$1(ctx)
  );
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, t, anchor);
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*widths, itemsList, themeValue, ops, level, setPopoverOffset, ctxProps, popoverContentCls, popoverTriggerCls, hasSub, isGroup, popoverRef, showSubMenuPopover, popoverContentWidth, ctxKey, subMenuCls, getLevel, subMenuRef, handleSelectedRecursion, dispatchTitleClick, iconCls, expendIconCls, iconRootCls, titleContentCls, cnames, attrs, getIndent, handleSelect, dividerCls*/
      2147417599 | dirty[1] & /*onVerticalPopoverChange, $$scope, resolveTitle, $$restProps, resolveDisabledTooltip, resolveLabel*/
      1073741855 | dirty[2] & /*item*/
      262144) {
        each_value = ensure_array_like(
          /*itemsList*/
          ctx2[4]
        );
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, t.parentNode, outro_and_destroy_block, create_each_block, t, get_each_context);
        check_outros();
      }
      if (
        /*ctxProps*/
        ctx2[3].mode === "horizontal" && /*showMoreItems*/
        ctx2[16] && /*level*/
        ctx2[1] === 1
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*ctxProps, showMoreItems, level*/
          65546) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$1(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      transition_in(if_block);
      current = true;
    },
    o(local) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t);
        detach(if_block_anchor);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d(detaching);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  let showMoreItems;
  let isDark;
  let themeValue;
  let cnames;
  let iconCls;
  let expendIconCls;
  let popoverContentCls;
  let getIndent;
  const omit_props_names = ["items", "cls", "attrs", "level", "ctxKey", "showPopoverManual"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { items = [] } = $$props;
  let { cls = void 0 } = $$props;
  let { attrs = {} } = $$props;
  let { level = 1 } = $$props;
  let { ctxKey = "" } = $$props;
  const dispatch2 = createEventDispatcher();
  const hasSub = (it) => !!(it.children && it.children.length);
  const isNotHorizontalTop = () => {
    if (ctxProps.mode === "horizontal") {
      return level > 1;
    }
    return true;
  };
  const isGroup = (it) => it.type === "group";
  const getLevel = (it, lv) => {
    if (isGroup(it)) {
      return Math.max(lv - 1, 1);
    }
    return lv;
  };
  let itemsList = level === 1 ? jsonClone(items) : items;
  function initOpenSelectedStatus(list = itemsList, inGroup = false) {
    let res = [];
    let deps = [];
    list.forEach((value) => {
      var _a, _b;
      const defaultSelected = (_a = menuCtx.__selectedUids) == null ? void 0 : _a.has(value.uid || "");
      const defaultOpen = (_b = menuCtx.__openUids) == null ? void 0 : _b.has(value.uid || "");
      value.selected = defaultSelected;
      value.inGroup = inGroup;
      menuCtx.syncSelectedItems(value, value.selected ? "set" : "delete");
      value.open = defaultOpen;
      if (defaultSelected) {
        deps.push(value.uid);
      }
      if (hasSub(value) && ctxProps.mode === "inline") {
        const recRes = initOpenSelectedStatus(value.children);
        value.children = recRes.children;
        if (!isGroup(value)) {
          !value.selectedDeps && (value.selectedDeps = /* @__PURE__ */ new Set());
          recRes.deps.forEach((d) => {
            value.selectedDeps.add(d);
          });
          value.selected = !!value.selectedDeps.size;
          if (value.selected) {
            deps.push(value.uid);
          }
        } else {
          deps = recRes.deps;
        }
      }
      if (hasSub(value) && ctxProps.mode !== "inline") {
        const recRes = initOpenSelectedStatus(value.children, isGroup(value));
        if (!isGroup(value)) {
          value.children = recRes.children;
          !value.selectedDeps && (value.selectedDeps = /* @__PURE__ */ new Set());
          recRes.deps.forEach((d) => {
            value.selectedDeps.add(d);
          });
          value.selected = !!value.selectedDeps.size;
          if (value.selected) {
            deps.push(value.uid);
          }
        } else {
          const { children: children2 } = value;
          value.children = [];
          res.push({ ...value });
          res = res.concat(children2);
          deps = recRes.deps;
          return;
        }
      }
      res.push({ ...value });
    });
    return { children: res, deps };
  }
  const menuCtx = getContext(ctxKey || menuKey);
  let ctxProps = {};
  function updatedCtxProps(props) {
    $$invalidate(3, ctxProps = { ...props });
    menuCtx.syncUids(ctxProps.openUids || [], "open");
    menuCtx.syncUids(ctxProps.selectedUids || [], "selected");
    $$invalidate(4, itemsList = initOpenSelectedStatus().children);
  }
  if (menuCtx) {
    ctxProps = { ...menuCtx.__dynamicProps };
    menuCtx.__propHandleEvtMap.push(updatedCtxProps);
    if (level === 1) {
      menuCtx.__org_items = items;
    }
  }
  function handleSelectedRecursion(e, index) {
    const { selected, uid } = e.detail;
    const it = itemsList[index] || moreItem;
    if (!isGroup(it)) {
      !it.selectedDeps && (it.selectedDeps = /* @__PURE__ */ new Set());
      if (selected) {
        it.selectedDeps.add(uid);
      } else if (it.selectedDeps.has(uid)) {
        it.selectedDeps.delete(uid);
      }
      it.selected = !!it.selectedDeps.size;
      if (!ctxProps.multiple && e.detail.isLeaf) {
        if (it.selected && itemsList[index]) {
          $$invalidate(4, itemsList = cancelSelected(itemsList, it));
          if (hasSub(it)) {
            it.children = cancelSelected(it.children, e.detail.item);
          }
        }
        if (level === 1) {
          if (itemsList[index]) {
            $$invalidate(4, itemsList = cancelSelected(itemsList, it));
          } else {
            $$invalidate(4, itemsList = cancelSelected(itemsList, e.detail.item));
          }
        }
      }
      if (itemsList[index]) {
        $$invalidate(4, itemsList[index] = it, itemsList);
      } else {
        $$invalidate(9, moreItem = it);
      }
      dispatch2("selectedRecursion", {
        selected: it.selected,
        uid: it.uid,
        isLeaf: e.detail.isLeaf,
        item: it
      });
    } else {
      dispatch2("selectedRecursion", e.detail);
    }
    e.detail.isLeaf && onSubItemSelect(index);
  }
  function cancelSelected(list, it) {
    return list.map((value) => {
      if (!ctxProps.multiple && value.uid !== it.uid && !isGroup(it)) {
        value.selected = false;
        value.selectedDeps && value.selectedDeps.clear();
        menuCtx.syncUids(value.uid, "selected", "delete");
        menuCtx.syncSelectedItems(value, "delete");
        if (hasSub(value)) {
          value.children = cancelSelected(value.children, it);
        }
      }
      return value;
    });
  }
  function setOpenAndSelectStatus(it, list = itemsList, parentOpen) {
    return list.map((value) => {
      if (value.uid === it.uid && !isGroup(it)) {
        const resolveSelected = !value.selected;
        if (ctxProps.selectable && !hasSub(it)) {
          if (!ctxProps.multiple && resolveSelected) {
            list = cancelSelected(list, it);
            if (moreItem.children && moreItem.children.length > 0) {
              $$invalidate(9, moreItem.children = cancelSelected(moreItem.children, it), moreItem);
              $$invalidate(9, moreItem.selected = false, moreItem);
              moreItem.selectedDeps && moreItem.selectedDeps.clear();
            }
          }
          value.selected = resolveSelected;
        }
        if (hasSub(it)) {
          const orgOpen = value.open;
          if (value.selectedDeps && ctxProps.selectable) {
            value.selected = !!value.selectedDeps.size;
          }
          if (menuCtx) {
            if (ctxProps.mode === "vertical" && !orgOpen || ctxProps.mode !== "vertical") {
              value.open = !value.open;
              menuCtx.syncUids(value.uid, "open", value.open ? "add" : "delete");
              menuCtx.onOpenChange([...menuCtx.__openUids]);
            }
          }
        }
        if (ctxProps.selectable) {
          dispatch2("selectedRecursion", {
            selected: value.selected,
            uid: value.uid,
            isLeaf: !hasSub(value),
            item: value
          });
        }
      }
      if (ctxProps.mode !== "inline" && parentOpen !== void 0 && hasSub(it) && !isGroup(it)) {
        value.open = false;
        if (menuCtx) {
          menuCtx.syncUids(value.uid, "open", "delete");
        }
      }
      if (hasSub(value)) {
        value.children = setOpenAndSelectStatus(it, value.children, value.open);
      }
      return value;
    });
  }
  async function handleSelect(it, e) {
    if (it.disabled || it.disabledParent) return;
    $$invalidate(4, itemsList = setOpenAndSelectStatus(it));
    if (menuCtx) {
      const uidPath = getUidPath(it.uid, menuCtx.__org_items) || [];
      menuCtx.onClick({ item: it, uid: it.uid, uidPath, e });
      if (!hasSub(it) && !isGroup(it) && ctxProps.selectable) {
        menuCtx.syncUids(it.uid, "selected", it.selected ? "add" : "delete");
        menuCtx.syncSelectedItems(it, it.selected ? "set" : "delete");
        const params2 = {
          item: it,
          uid: it.uid,
          uidPath,
          selectedUids: [...menuCtx.__selectedUids],
          selectedItems: Array.from(menuCtx.__selectedItems.values()),
          selectedUidPaths: Array.from(menuCtx.__selectedItems.keys()).map((uid) => getUidPath(uid, menuCtx.__org_items) || []),
          e
        };
        if (it.selected) {
          menuCtx.onSelect(params2);
        } else {
          menuCtx.onDeSelect(params2);
        }
      } else if (hasSub(it) || isGroup(it)) {
        dispatchTitleClick(it, e, uidPath);
      }
    }
  }
  function dispatchTitleClick(it, e, uidPath) {
    dispatch2("titleClick", { it, e, uidPath });
  }
  let popoverRef = [];
  let subMenuRef = [];
  let isDirty = true;
  async function showSubMenuPopover() {
    ctxProps.mode !== "inline" && isDirty && subMenuRef.forEach((ref) => {
      ref && ref.showPopoverManual && ref.showPopoverManual();
    });
    isDirty = false;
  }
  let hiddenIndex = /* @__PURE__ */ new Set();
  function showPopoverManual() {
    if (level === 1) {
      popoverRef.forEach((ref, index) => {
        if (hiddenIndex.has(index)) return;
        const it = itemsList[index] || moreItem;
        if (it.open) {
          ref && ref.updateShow && ref.updateShow(it.open);
        }
      });
    } else {
      setTimeout(
        () => {
          popoverRef.forEach((ref, index) => {
            const it = itemsList[index] || moreItem;
            if (it.open) {
              ref && ref.updateShow && ref.updateShow(it.open);
            }
          });
        },
        300
      );
    }
  }
  let parentDom = null;
  let itemEls = null;
  let prevParentDomWidth = -1;
  let ops = Array(items.length).fill(level === 1 ? "0" : "1");
  let widths = Array(items.length).fill(level === 1 ? "auto" : "100%");
  let moreItems = [];
  let moreItem = {};
  function genMoreItem(mIt) {
    const open = mIt.some((it) => {
      return it.item.open;
    });
    const selected = mIt.some((it) => {
      return it.item.selected;
    });
    $$invalidate(9, moreItem = {
      children: mIt.map((it) => it.item),
      selected,
      uid: "more-item",
      open
    });
    if (popoverRef[itemsList.length]) {
      isDirty = true;
      showPopoverManual();
    }
  }
  function adjustLayout() {
    if (parentDom && level === 1) {
      let resolvedMoreItems = moreItems;
      const parentWidth = parentDom.offsetWidth;
      let toS = false;
      let init2 = false;
      if (prevParentDomWidth === -1) {
        init2 = true;
        prevParentDomWidth = parentWidth;
      }
      if (prevParentDomWidth < parentWidth) {
        toS = false;
      }
      if (prevParentDomWidth > parentWidth) {
        toS = true;
      }
      prevParentDomWidth = parentWidth;
      let totalWidth = 0;
      itemEls.forEach((child, index) => {
        const offsetWidth = child.offsetWidth;
        totalWidth += offsetWidth;
        if (totalWidth > parentWidth && (toS || init2)) {
          child.style.opacity = "0";
          child.style.height = "0";
          child.style.overflowY = "hidden";
          child.style.position = "absolute";
          child.style.pointerEvents = "none";
          $$invalidate(8, widths[index] = "0", widths);
          if (popoverRef[index] && itemsList[index].open) {
            popoverRef[index] && popoverRef[index].updateShow && popoverRef[index].updateShow(false);
          }
          const has = resolvedMoreItems.some((it) => it.index === index);
          if (!has) {
            resolvedMoreItems.push({
              index,
              item: itemsList[index],
              width: offsetWidth
            });
            $$invalidate(39, moreItems = [...resolvedMoreItems]);
          }
          hiddenIndex.add(index);
          init2 && $$invalidate(39, moreItems = [
            ...resolvedMoreItems.sort((a, b) => {
              return b.index - a.index;
            })
          ]);
        } else {
          $$invalidate(7, ops[index] = "1", ops);
        }
      });
      if (toS === false && !init2) {
        let spaceAvailable = Math.abs(totalWidth - parentWidth);
        const moreItemsLen = resolvedMoreItems.length;
        const lastItem = resolvedMoreItems[moreItemsLen - 1];
        if (lastItem) {
          const lastItemWidth = lastItem.width;
          if (resolvedMoreItems.length > 0 && spaceAvailable >= lastItemWidth) {
            const index = resolvedMoreItems.pop().index;
            $$invalidate(39, moreItems = [...resolvedMoreItems]);
            const dom = itemEls[index];
            if (dom) {
              dom.style.opacity = "1";
              dom.style.removeProperty("height");
              dom.style.removeProperty("overflow-y");
              dom.style.removeProperty("position");
              dom.style.removeProperty("pointer-events");
              $$invalidate(8, widths[index] = "auto", widths);
              hiddenIndex.delete(index);
              if (popoverRef[index] && itemsList[index].open) {
                isDirty = true;
                popoverRef[index] && popoverRef[index].updateShow && popoverRef[index].updateShow(true);
              }
            }
          }
        }
      }
    }
  }
  onMount(async () => {
    if (level === 1 && ctxProps.mode === "vertical") {
      showPopoverManual();
    }
    if (level === 1 && ctxProps.mode == "horizontal") {
      parentDom = menuCtx.getParentDom();
      if (parentDom) {
        itemEls = Array.from(parentDom.querySelectorAll('[data-k-menu-h="1"]'));
      }
      adjustLayout();
      await tick();
      window.addEventListener("resize", adjustLayout);
      showPopoverManual();
    }
    menuCtx.removeBorderStyleBg();
  });
  onDestroy(() => {
    {
      window.removeEventListener("resize", adjustLayout);
    }
  });
  const menuPrefixCls = getPrefixCls("menu");
  const prefixCls = getPrefixCls("menu-item");
  const iconRootCls = (isInlineCollapsed) => {
    return clsx({
      [`${prefixCls}-icon-root`]: !isInlineCollapsed,
      [`${prefixCls}-icon-root--collapsed`]: isInlineCollapsed
    });
  };
  const titleContentCls = (hasIcon) => {
    return clsx({
      [`${menuPrefixCls}-title-content`]: !hasIcon,
      [`${menuPrefixCls}-title-content-i`]: hasIcon
    });
  };
  const dividerCls = clsx({
    [`${prefixCls}-divider`]: isNotHorizontalTop(),
    [`${prefixCls}-divider-horizontal`]: !isNotHorizontalTop()
  });
  const subMenuCls = (isGroup2) => {
    return clsx(`${menuPrefixCls}-sub`, `${menuPrefixCls}-sub-${ctxProps.mode}`, { [`${menuPrefixCls}-sub-bg`]: !isGroup2 });
  };
  const popoverTriggerCls = (isDivider = false) => {
    return clsx({
      [`${prefixCls}-popover-trigger-${ctxProps.mode}`]: !isDivider && isNotHorizontalTop(),
      [`${prefixCls}-popover-trigger-${ctxProps.mode}-divider`]: isDivider && !isNotHorizontalTop()
    });
  };
  const setPopoverOffset = ({ popper, reference }) => {
    if (ctxProps.mode === "horizontal" && level === 1) {
      return { mainAxis: 4, crossAxis: 0 };
    }
    const { height: pHeight } = popper.getBoundingClientRect();
    const { height: rHeight } = reference.getBoundingClientRect();
    return {
      mainAxis: 4,
      crossAxis: rHeight / 2 - pHeight / 2
    };
  };
  const popoverContentWidth = (index) => {
    const ref = popoverRef[index];
    if (ref) {
      const triggerEl = ref.getPopoverContainerRef();
      const { width } = triggerEl.getBoundingClientRect();
      return `${width}px`;
    }
    return "100%";
  };
  const resolveLabel = (it, isInlineCollapsed) => {
    if (!it.label) return "";
    if (!isInlineCollapsed) return it.label;
    return isInlineCollapsed && !it.icon ? it.label[0] : it.label;
  };
  const resolveDisabledTooltip = (it, isInlineCollapsed) => {
    if (it.children && it.children.length > 0 && it.type !== "group" || !isInlineCollapsed) {
      return true;
    } else {
      return false;
    }
  };
  const resolveTitle = (it, isInlineCollapsed, isTooltip) => {
    let res = "";
    if (it.children && it.children.length > 0 && it.type !== "group") {
      res = "";
    } else if (isInlineCollapsed && ctxProps.mode !== "horizontal") {
      res = it.title || it.label || "";
      if (!isTooltip) {
        res = "";
      }
    } else if (!isInlineCollapsed || ctxProps.mode === "horizontal") {
      res = it.title || "";
    }
    return res;
  };
  function clearVerticalOpenStatus(it, list = itemsList) {
    return list.map((value) => {
      if (value.uid === it.uid && !isGroup(it)) {
        if (hasSub(it)) {
          value.open = false;
          if (menuCtx) {
            menuCtx.syncUids(value.uid, "open", "delete");
            menuCtx.onOpenChange([...menuCtx.__openUids]);
          }
        }
      }
      if (hasSub(value)) {
        value.children = clearVerticalOpenStatus(it, value.children);
      }
      return value;
    });
  }
  function onVerticalPopoverChange(it, e) {
    if (it.disabled || it.disabledParent || e.detail) return;
    $$invalidate(4, itemsList = clearVerticalOpenStatus(it));
  }
  function onSubItemSelect(index) {
    if (level == 1 && !ctxProps.multiple) {
      popoverRef[index] && popoverRef[index].updateShow && popoverRef[index].updateShow(false);
    }
  }
  const click_handler = (it, e) => handleSelect(it, e);
  const selectedRecursion_handler = (index, e) => handleSelectedRecursion(e, index);
  const titleClick_handler = (e) => {
    dispatchTitleClick(e.detail.it, e.detail.e, e.detail.uidPath);
  };
  function item_binding($$value, index) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      subMenuRef[index] = $$value;
      $$invalidate(6, subMenuRef);
    });
  }
  const selectedRecursion_handler_1 = (index, e) => handleSelectedRecursion(e, index);
  const titleClick_handler_1 = (e) => {
    dispatchTitleClick(e.detail.it, e.detail.e, e.detail.uidPath);
  };
  const click_handler_1 = (it, e) => handleSelect(it, e);
  function kpopover_binding($$value, index) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      popoverRef[index] = $$value;
      $$invalidate(5, popoverRef);
    });
  }
  const change_handler = (it, e) => {
    onVerticalPopoverChange(it, e);
  };
  function item_binding_1($$value, index) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      subMenuRef[index] = $$value;
      $$invalidate(6, subMenuRef);
    });
  }
  const selectedRecursion_handler_2 = (index, e) => handleSelectedRecursion(e, index);
  const titleClick_handler_2 = (e) => {
    dispatchTitleClick(e.detail.it, e.detail.e, e.detail.uidPath);
  };
  const click_handler_2 = (it, e) => handleSelect(it, e);
  function kpopover_binding_1($$value, index) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      popoverRef[index] = $$value;
      $$invalidate(5, popoverRef);
    });
  }
  const change_handler_1 = (it, e) => {
    onVerticalPopoverChange(it, e);
  };
  function item_binding_2($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      subMenuRef[itemsList.length] = $$value;
      $$invalidate(6, subMenuRef);
    });
  }
  const selectedRecursion_handler_3 = (e) => handleSelectedRecursion(e, itemsList.length);
  const titleClick_handler_3 = (e) => {
    dispatchTitleClick(e.detail.it, e.detail.e, e.detail.uidPath);
  };
  function kpopover_binding_2($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      popoverRef[itemsList.length] = $$value;
      $$invalidate(5, popoverRef);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(35, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("items" in $$new_props) $$invalidate(36, items = $$new_props.items);
    if ("cls" in $$new_props) $$invalidate(37, cls = $$new_props.cls);
    if ("attrs" in $$new_props) $$invalidate(0, attrs = $$new_props.attrs);
    if ("level" in $$new_props) $$invalidate(1, level = $$new_props.level);
    if ("ctxKey" in $$new_props) $$invalidate(2, ctxKey = $$new_props.ctxKey);
    if ("$$scope" in $$new_props) $$invalidate(61, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*level*/
    2 | $$self.$$.dirty[1] & /*items*/
    32) {
      {
        $$invalidate(4, itemsList = level === 1 ? jsonClone(items) : items);
        if (level === 1) {
          $$invalidate(4, itemsList = initOpenSelectedStatus().children);
        }
      }
    }
    if ($$self.$$.dirty[1] & /*moreItems*/
    256) {
      $$invalidate(16, showMoreItems = moreItems.length);
    }
    if ($$self.$$.dirty[1] & /*moreItems*/
    256) {
      {
        genMoreItem(moreItems);
      }
    }
    if ($$self.$$.dirty[0] & /*ctxProps*/
    8) {
      $$invalidate(40, isDark = (it) => (it.theme || ctxProps.theme) === "dark" || (it.theme || ctxProps.theme) === void 0);
    }
    if ($$self.$$.dirty[0] & /*ctxProps*/
    8) {
      $$invalidate(15, themeValue = (it) => it.theme || ctxProps.theme);
    }
    if ($$self.$$.dirty[0] & /*ctxProps, level*/
    10 | $$self.$$.dirty[1] & /*isDark, cls*/
    576) {
      $$invalidate(14, cnames = (it) => {
        let basicCls = {
          [`${prefixCls}-active`]: !isGroup(it) && isNotHorizontalTop() || ctxProps.mode === "inline",
          [`${prefixCls}__dark`]: isGroup(it) && isDark(it),
          [`${prefixCls}-selected-danger`]: !isGroup(it) && !hasSub(it) && isNotHorizontalTop() && it.selected && it.danger,
          [`${prefixCls}-selected-danger__dark`]: !isGroup(it) && !hasSub(it) && isNotHorizontalTop() && it.selected && it.danger && isDark(it),
          [`${prefixCls}-danger`]: it.danger,
          [`${prefixCls}-selected`]: !isGroup(it) && !hasSub(it) && isNotHorizontalTop() && it.selected && !it.danger,
          [` ${prefixCls}-selected__dark`]: !isGroup(it) && !hasSub(it) && isNotHorizontalTop() && it.selected && !it.danger && isDark(it),
          [`${prefixCls}-selected-group`]: !isGroup(it) && hasSub(it) && isNotHorizontalTop() && it.selected,
          [`${prefixCls}-hover`]: !isGroup(it) && isNotHorizontalTop() && !it.selected,
          [`${prefixCls}-selected-h`]: !isGroup(it) && !hasSub(it) && !isNotHorizontalTop() && it.selected,
          [`${prefixCls}-selected-group-h`]: !isGroup(it) && hasSub(it) && !isNotHorizontalTop() && it.selected,
          [`${prefixCls}-hover-h`]: !isGroup(it) && !isNotHorizontalTop() && !it.selected
        };
        if (it.disabled || it.disabledParent) {
          basicCls = {
            [`${prefixCls}-disabled`]: level !== 1,
            [`${prefixCls}-disabled__dark`]: isDark(it),
            [`${prefixCls}-disabled-l1`]: level === 1
          };
          if (hasSub(it)) {
            it.children = it.children.map((item) => {
              return { ...item, disabledParent: true };
            });
          }
        }
        return clsx(
          prefixCls,
          {
            [`${prefixCls}-${ctxProps.mode}-group`]: isGroup(it),
            [`${prefixCls}-${ctxProps.mode}`]: !isGroup(it) || ctxProps.mode === "horizontal" && level === 1,
            [`${prefixCls}-${ctxProps.mode}-not-top`]: !isGroup(it) && isNotHorizontalTop(),
            ...basicCls,
            [`${prefixCls}-child`]: !isGroup(it) && hasSub(it)
          },
          cls
        );
      });
    }
    if ($$self.$$.dirty[1] & /*isDark*/
    512) {
      $$invalidate(13, iconCls = (it) => {
        return clsx(`${prefixCls}-icon`, { [`${prefixCls}-icon__dark`]: isDark(it) });
      });
    }
    if ($$self.$$.dirty[0] & /*ctxProps*/
    8) {
      $$invalidate(12, expendIconCls = (it) => {
        const icon = ctxProps.expandIcon || "i-carbon-chevron-down ";
        if (ctxProps.mode !== "inline") {
          return `${icon} -rotate-90`;
        }
        return it.open ? `${icon} rotate-180 k-icon-transition` : `${icon} k-icon-transition`;
      });
    }
    if ($$self.$$.dirty[0] & /*ctxProps, level*/
    10) {
      $$invalidate(10, getIndent = (it, isInlineCollapsed) => {
        if (ctxProps.mode === "horizontal" && level === 1) return "16px";
        if (isInlineCollapsed) return "";
        if (ctxProps.mode !== "inline") {
          return `${it.inGroup ? (ctxProps.inlineIndent || 24) * 2 : ctxProps.inlineIndent}px`;
        }
        return `${(ctxProps.inlineIndent || 24) * getLevel(it, level)}px`;
      });
    }
  };
  $$invalidate(11, popoverContentCls = (it) => {
    return clsx(`${prefixCls}-popover-content`, it == null ? void 0 : it.popupClassName);
  });
  return [
    attrs,
    level,
    ctxKey,
    ctxProps,
    itemsList,
    popoverRef,
    subMenuRef,
    ops,
    widths,
    moreItem,
    getIndent,
    popoverContentCls,
    expendIconCls,
    iconCls,
    cnames,
    themeValue,
    showMoreItems,
    hasSub,
    isGroup,
    getLevel,
    handleSelectedRecursion,
    handleSelect,
    dispatchTitleClick,
    showSubMenuPopover,
    iconRootCls,
    titleContentCls,
    dividerCls,
    subMenuCls,
    popoverTriggerCls,
    setPopoverOffset,
    popoverContentWidth,
    resolveLabel,
    resolveDisabledTooltip,
    resolveTitle,
    onVerticalPopoverChange,
    $$restProps,
    items,
    cls,
    showPopoverManual,
    moreItems,
    isDark,
    slots,
    click_handler,
    selectedRecursion_handler,
    titleClick_handler,
    item_binding,
    selectedRecursion_handler_1,
    titleClick_handler_1,
    click_handler_1,
    kpopover_binding,
    change_handler,
    item_binding_1,
    selectedRecursion_handler_2,
    titleClick_handler_2,
    click_handler_2,
    kpopover_binding_1,
    change_handler_1,
    item_binding_2,
    selectedRecursion_handler_3,
    titleClick_handler_3,
    kpopover_binding_2,
    $$scope
  ];
}
class Item2 extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$7,
      create_fragment$a,
      safe_not_equal,
      {
        items: 36,
        cls: 37,
        attrs: 0,
        level: 1,
        ctxKey: 2,
        showPopoverManual: 38
      },
      null,
      [-1, -1, -1]
    );
  }
  get showPopoverManual() {
    return this.$$.ctx[38];
  }
}
const menuItems = [
  {
    label: "首页",
    uid: "首页",
    icon: "i-carbon-email",
    path: "/home"
  },
  {
    label: "人群智库",
    uid: "人群智库",
    icon: "i-carbon-cloud-satellite-config",
    children: [
      { label: "用户群体", uid: "用户群体", path: "/user-tower/tower" },
      { label: "人群洞察", uid: "人群洞察", path: "/user-tower/crowd-insight" }
    ]
  },
  {
    label: "标签管理",
    uid: "标签管理",
    icon: "i-carbon-cloud-satellite-config",
    children: [
      { label: "用户标签", uid: "用户标签", path: "/user-tower/label" }
    ]
  },
  {
    label: "ABTest",
    uid: "ABTest",
    icon: "i-carbon-cloud-satellite-config",
    children: [
      { label: "应用管理", uid: "应用管理", path: "/ab-test/app-manage" },
      { label: "实验列表", uid: "实验列表", path: "/ab-test/experiment" }
    ]
  }
];
function parse(str, loose) {
  if (str instanceof RegExp) return { keys: false, pattern: str };
  var c, o, tmp, ext, keys4 = [], pattern = "", arr = str.split("/");
  arr[0] || arr.shift();
  while (tmp = arr.shift()) {
    c = tmp[0];
    if (c === "*") {
      keys4.push("wild");
      pattern += "/(.*)";
    } else if (c === ":") {
      o = tmp.indexOf("?", 1);
      ext = tmp.indexOf(".", 1);
      keys4.push(tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length));
      pattern += !!~o && !~ext ? "(?:/([^/]+?))?" : "/([^/]+?)";
      if (!!~ext) pattern += (!!~o ? "?" : "") + "\\" + tmp.substring(ext);
    } else {
      pattern += "/" + tmp;
    }
  }
  return {
    keys: keys4,
    pattern: new RegExp("^" + pattern + "/?$", "i")
  };
}
function create_else_block(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    /*props*/
    ctx[2]
  ];
  var switch_value = (
    /*component*/
    ctx[0]
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    if (dirty !== void 0 && dirty & /*props*/
    4) {
      switch_instance_props = assign(switch_instance_props, get_spread_update(switch_instance_spread_levels, [get_spread_object(
        /*props*/
        ctx2[2]
      )]));
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    switch_instance.$on(
      "routeEvent",
      /*routeEvent_handler_1*/
      ctx[7]
    );
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*component*/
      1 && switch_value !== (switch_value = /*component*/
      ctx2[0])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          switch_instance.$on(
            "routeEvent",
            /*routeEvent_handler_1*/
            ctx2[7]
          );
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty & /*props*/
        4 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
          /*props*/
          ctx2[2]
        )]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_if_block(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    { params: (
      /*componentParams*/
      ctx[1]
    ) },
    /*props*/
    ctx[2]
  ];
  var switch_value = (
    /*component*/
    ctx[0]
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    if (dirty !== void 0 && dirty & /*componentParams, props*/
    6) {
      switch_instance_props = assign(switch_instance_props, get_spread_update(switch_instance_spread_levels, [
        dirty & /*componentParams*/
        2 && { params: (
          /*componentParams*/
          ctx2[1]
        ) },
        dirty & /*props*/
        4 && get_spread_object(
          /*props*/
          ctx2[2]
        )
      ]));
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    switch_instance.$on(
      "routeEvent",
      /*routeEvent_handler*/
      ctx[6]
    );
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*component*/
      1 && switch_value !== (switch_value = /*component*/
      ctx2[0])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          switch_instance.$on(
            "routeEvent",
            /*routeEvent_handler*/
            ctx2[6]
          );
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty & /*componentParams, props*/
        6 ? get_spread_update(switch_instance_spread_levels, [
          dirty & /*componentParams*/
          2 && { params: (
            /*componentParams*/
            ctx2[1]
          ) },
          dirty & /*props*/
          4 && get_spread_object(
            /*props*/
            ctx2[2]
          )
        ]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_fragment$9(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*componentParams*/
      ctx2[1]
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function getLocation() {
  const hashPosition = window.location.href.indexOf("#/");
  let location2 = hashPosition > -1 ? window.location.href.substr(hashPosition + 1) : "/";
  const qsPosition = location2.indexOf("?");
  let querystring = "";
  if (qsPosition > -1) {
    querystring = location2.substr(qsPosition + 1);
    location2 = location2.substr(0, qsPosition);
  }
  return { location: location2, querystring };
}
const loc = readable(
  null,
  // eslint-disable-next-line prefer-arrow-callback
  function start(set) {
    set(getLocation());
    const update2 = () => {
      set(getLocation());
    };
    window.addEventListener("hashchange", update2, false);
    return function stop() {
      window.removeEventListener("hashchange", update2, false);
    };
  }
);
derived(loc, (_loc) => _loc.location);
derived(loc, (_loc) => _loc.querystring);
const params = writable(void 0);
async function push(location2) {
  if (!location2 || location2.length < 1 || location2.charAt(0) != "/" && location2.indexOf("#/") !== 0) {
    throw Error("Invalid parameter location");
  }
  await tick();
  history.replaceState(
    {
      ...history.state,
      __svelte_spa_router_scrollX: window.scrollX,
      __svelte_spa_router_scrollY: window.scrollY
    },
    void 0
  );
  window.location.hash = (location2.charAt(0) == "#" ? "" : "#") + location2;
}
function restoreScroll(state) {
  if (state) {
    window.scrollTo(state.__svelte_spa_router_scrollX, state.__svelte_spa_router_scrollY);
  } else {
    window.scrollTo(0, 0);
  }
}
function instance$6($$self, $$props, $$invalidate) {
  let { routes = {} } = $$props;
  let { prefix = "" } = $$props;
  let { restoreScrollState = false } = $$props;
  class RouteItem {
    /**
    * Initializes the object and creates a regular expression from the path, using regexparam.
    *
    * @param {string} path - Path to the route (must start with '/' or '*')
    * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
    */
    constructor(path, component2) {
      if (!component2 || typeof component2 != "function" && (typeof component2 != "object" || component2._sveltesparouter !== true)) {
        throw Error("Invalid component object");
      }
      if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
        throw Error('Invalid value for "path" argument - strings must start with / or *');
      }
      const { pattern, keys: keys4 } = parse(path);
      this.path = path;
      if (typeof component2 == "object" && component2._sveltesparouter === true) {
        this.component = component2.component;
        this.conditions = component2.conditions || [];
        this.userData = component2.userData;
        this.props = component2.props || {};
      } else {
        this.component = () => Promise.resolve(component2);
        this.conditions = [];
        this.props = {};
      }
      this._pattern = pattern;
      this._keys = keys4;
    }
    /**
    * Checks if `path` matches the current route.
    * If there's a match, will return the list of parameters from the URL (if any).
    * In case of no match, the method will return `null`.
    *
    * @param {string} path - Path to test
    * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
    */
    match(path) {
      if (prefix) {
        if (typeof prefix == "string") {
          if (path.startsWith(prefix)) {
            path = path.substr(prefix.length) || "/";
          } else {
            return null;
          }
        } else if (prefix instanceof RegExp) {
          const match = path.match(prefix);
          if (match && match[0]) {
            path = path.substr(match[0].length) || "/";
          } else {
            return null;
          }
        }
      }
      const matches = this._pattern.exec(path);
      if (matches === null) {
        return null;
      }
      if (this._keys === false) {
        return matches;
      }
      const out = {};
      let i = 0;
      while (i < this._keys.length) {
        try {
          out[this._keys[i]] = decodeURIComponent(matches[i + 1] || "") || null;
        } catch (e) {
          out[this._keys[i]] = null;
        }
        i++;
      }
      return out;
    }
    /**
    * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
    * @typedef {Object} RouteDetail
    * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
    * @property {string} location - Location path
    * @property {string} querystring - Querystring from the hash
    * @property {object} [userData] - Custom data passed by the user
    * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
    * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
    */
    /**
    * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
    * 
    * @param {RouteDetail} detail - Route detail
    * @returns {boolean} Returns true if all the conditions succeeded
    */
    async checkConditions(detail) {
      for (let i = 0; i < this.conditions.length; i++) {
        if (!await this.conditions[i](detail)) {
          return false;
        }
      }
      return true;
    }
  }
  const routesList = [];
  if (routes instanceof Map) {
    routes.forEach((route, path) => {
      routesList.push(new RouteItem(path, route));
    });
  } else {
    Object.keys(routes).forEach((path) => {
      routesList.push(new RouteItem(path, routes[path]));
    });
  }
  let component = null;
  let componentParams = null;
  let props = {};
  const dispatch2 = createEventDispatcher();
  async function dispatchNextTick(name, detail) {
    await tick();
    dispatch2(name, detail);
  }
  let previousScrollState = null;
  let popStateChanged = null;
  if (restoreScrollState) {
    popStateChanged = (event) => {
      if (event.state && (event.state.__svelte_spa_router_scrollY || event.state.__svelte_spa_router_scrollX)) {
        previousScrollState = event.state;
      } else {
        previousScrollState = null;
      }
    };
    window.addEventListener("popstate", popStateChanged);
    afterUpdate(() => {
      restoreScroll(previousScrollState);
    });
  }
  let lastLoc = null;
  let componentObj = null;
  const unsubscribeLoc = loc.subscribe(async (newLoc) => {
    lastLoc = newLoc;
    let i = 0;
    while (i < routesList.length) {
      const match = routesList[i].match(newLoc.location);
      if (!match) {
        i++;
        continue;
      }
      const detail = {
        route: routesList[i].path,
        location: newLoc.location,
        querystring: newLoc.querystring,
        userData: routesList[i].userData,
        params: match && typeof match == "object" && Object.keys(match).length ? match : null
      };
      if (!await routesList[i].checkConditions(detail)) {
        $$invalidate(0, component = null);
        componentObj = null;
        dispatchNextTick("conditionsFailed", detail);
        return;
      }
      dispatchNextTick("routeLoading", Object.assign({}, detail));
      const obj = routesList[i].component;
      if (componentObj != obj) {
        if (obj.loading) {
          $$invalidate(0, component = obj.loading);
          componentObj = obj;
          $$invalidate(1, componentParams = obj.loadingParams);
          $$invalidate(2, props = {});
          dispatchNextTick("routeLoaded", Object.assign({}, detail, {
            component,
            name: component.name,
            params: componentParams
          }));
        } else {
          $$invalidate(0, component = null);
          componentObj = null;
        }
        const loaded = await obj();
        if (newLoc != lastLoc) {
          return;
        }
        $$invalidate(0, component = loaded && loaded.default || loaded);
        componentObj = obj;
      }
      if (match && typeof match == "object" && Object.keys(match).length) {
        $$invalidate(1, componentParams = match);
      } else {
        $$invalidate(1, componentParams = null);
      }
      $$invalidate(2, props = routesList[i].props);
      dispatchNextTick("routeLoaded", Object.assign({}, detail, {
        component,
        name: component.name,
        params: componentParams
      })).then(() => {
        params.set(componentParams);
      });
      return;
    }
    $$invalidate(0, component = null);
    componentObj = null;
    params.set(void 0);
  });
  onDestroy(() => {
    unsubscribeLoc();
    popStateChanged && window.removeEventListener("popstate", popStateChanged);
  });
  function routeEvent_handler(event) {
    bubble.call(this, $$self, event);
  }
  function routeEvent_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$props2) => {
    if ("routes" in $$props2) $$invalidate(3, routes = $$props2.routes);
    if ("prefix" in $$props2) $$invalidate(4, prefix = $$props2.prefix);
    if ("restoreScrollState" in $$props2) $$invalidate(5, restoreScrollState = $$props2.restoreScrollState);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*restoreScrollState*/
    32) {
      history.scrollRestoration = restoreScrollState ? "manual" : "auto";
    }
  };
  return [
    component,
    componentParams,
    props,
    routes,
    prefix,
    restoreScrollState,
    routeEvent_handler,
    routeEvent_handler_1
  ];
}
class Router extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$9, safe_not_equal, {
      routes: 3,
      prefix: 4,
      restoreScrollState: 5
    });
  }
}
function create_fragment$8(ctx) {
  let div2;
  return {
    c() {
      div2 = element("div");
      div2.textContent = "home";
    },
    m(target, anchor) {
      insert(target, div2, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
    }
  };
}
class Home extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment$8, safe_not_equal, {});
  }
}
function _typeof$1(o) {
  "@babel/helpers - typeof";
  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$1(o);
}
function toPrimitive(t, r2) {
  if ("object" != _typeof$1(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r2);
    if ("object" != _typeof$1(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof$1(i) ? i : i + "";
}
function _defineProperty(e, r2, t) {
  return (r2 = toPropertyKey(r2)) in e ? Object.defineProperty(e, r2, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r2] = t, e;
}
function asyncGeneratorStep(n, t, e, r2, o, a, c) {
  try {
    var i = n[a](c), u = i.value;
  } catch (n2) {
    return void e(n2);
  }
  i.done ? t(u) : Promise.resolve(u).then(r2, o);
}
function _asyncToGenerator(n) {
  return function() {
    var t = this, e = arguments;
    return new Promise(function(r2, o) {
      var a = n.apply(t, e);
      function _next(n2) {
        asyncGeneratorStep(a, r2, o, _next, _throw, "next", n2);
      }
      function _throw(n2) {
        asyncGeneratorStep(a, r2, o, _next, _throw, "throw", n2);
      }
      _next(void 0);
    });
  };
}
var regeneratorRuntime$1 = { exports: {} };
var _typeof = { exports: {} };
(function(module) {
  function _typeof2(o) {
    "@babel/helpers - typeof";
    return module.exports = _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof2(o);
  }
  module.exports = _typeof2, module.exports.__esModule = true, module.exports["default"] = module.exports;
})(_typeof);
var _typeofExports = _typeof.exports;
(function(module) {
  var _typeof2 = _typeofExports["default"];
  function _regeneratorRuntime2() {
    module.exports = _regeneratorRuntime2 = function _regeneratorRuntime3() {
      return e;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    var t, e = {}, r2 = Object.prototype, n = r2.hasOwnProperty, o = Object.defineProperty || function(t2, e2, r3) {
      t2[e2] = r3.value;
    }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag";
    function define2(t2, e2, r3) {
      return Object.defineProperty(t2, e2, {
        value: r3,
        enumerable: true,
        configurable: true,
        writable: true
      }), t2[e2];
    }
    try {
      define2({}, "");
    } catch (t2) {
      define2 = function define3(t3, e2, r3) {
        return t3[e2] = r3;
      };
    }
    function wrap(t2, e2, r3, n2) {
      var i2 = e2 && e2.prototype instanceof Generator ? e2 : Generator, a2 = Object.create(i2.prototype), c2 = new Context(n2 || []);
      return o(a2, "_invoke", {
        value: makeInvokeMethod(t2, r3, c2)
      }), a2;
    }
    function tryCatch(t2, e2, r3) {
      try {
        return {
          type: "normal",
          arg: t2.call(e2, r3)
        };
      } catch (t3) {
        return {
          type: "throw",
          arg: t3
        };
      }
    }
    e.wrap = wrap;
    var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {};
    function Generator() {
    }
    function GeneratorFunction() {
    }
    function GeneratorFunctionPrototype() {
    }
    var p = {};
    define2(p, a, function() {
      return this;
    });
    var d = Object.getPrototypeOf, v = d && d(d(values([])));
    v && v !== r2 && n.call(v, a) && (p = v);
    var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
    function defineIteratorMethods(t2) {
      ["next", "throw", "return"].forEach(function(e2) {
        define2(t2, e2, function(t3) {
          return this._invoke(e2, t3);
        });
      });
    }
    function AsyncIterator(t2, e2) {
      function invoke(r4, o2, i2, a2) {
        var c2 = tryCatch(t2[r4], t2, o2);
        if ("throw" !== c2.type) {
          var u2 = c2.arg, h2 = u2.value;
          return h2 && "object" == _typeof2(h2) && n.call(h2, "__await") ? e2.resolve(h2.__await).then(function(t3) {
            invoke("next", t3, i2, a2);
          }, function(t3) {
            invoke("throw", t3, i2, a2);
          }) : e2.resolve(h2).then(function(t3) {
            u2.value = t3, i2(u2);
          }, function(t3) {
            return invoke("throw", t3, i2, a2);
          });
        }
        a2(c2.arg);
      }
      var r3;
      o(this, "_invoke", {
        value: function value(t3, n2) {
          function callInvokeWithMethodAndArg() {
            return new e2(function(e3, r4) {
              invoke(t3, n2, e3, r4);
            });
          }
          return r3 = r3 ? r3.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(e2, r3, n2) {
      var o2 = h;
      return function(i2, a2) {
        if (o2 === f) throw Error("Generator is already running");
        if (o2 === s) {
          if ("throw" === i2) throw a2;
          return {
            value: t,
            done: true
          };
        }
        for (n2.method = i2, n2.arg = a2; ; ) {
          var c2 = n2.delegate;
          if (c2) {
            var u2 = maybeInvokeDelegate(c2, n2);
            if (u2) {
              if (u2 === y) continue;
              return u2;
            }
          }
          if ("next" === n2.method) n2.sent = n2._sent = n2.arg;
          else if ("throw" === n2.method) {
            if (o2 === h) throw o2 = s, n2.arg;
            n2.dispatchException(n2.arg);
          } else "return" === n2.method && n2.abrupt("return", n2.arg);
          o2 = f;
          var p2 = tryCatch(e2, r3, n2);
          if ("normal" === p2.type) {
            if (o2 = n2.done ? s : l, p2.arg === y) continue;
            return {
              value: p2.arg,
              done: n2.done
            };
          }
          "throw" === p2.type && (o2 = s, n2.method = "throw", n2.arg = p2.arg);
        }
      };
    }
    function maybeInvokeDelegate(e2, r3) {
      var n2 = r3.method, o2 = e2.iterator[n2];
      if (o2 === t) return r3.delegate = null, "throw" === n2 && e2.iterator["return"] && (r3.method = "return", r3.arg = t, maybeInvokeDelegate(e2, r3), "throw" === r3.method) || "return" !== n2 && (r3.method = "throw", r3.arg = new TypeError("The iterator does not provide a '" + n2 + "' method")), y;
      var i2 = tryCatch(o2, e2.iterator, r3.arg);
      if ("throw" === i2.type) return r3.method = "throw", r3.arg = i2.arg, r3.delegate = null, y;
      var a2 = i2.arg;
      return a2 ? a2.done ? (r3[e2.resultName] = a2.value, r3.next = e2.nextLoc, "return" !== r3.method && (r3.method = "next", r3.arg = t), r3.delegate = null, y) : a2 : (r3.method = "throw", r3.arg = new TypeError("iterator result is not an object"), r3.delegate = null, y);
    }
    function pushTryEntry(t2) {
      var e2 = {
        tryLoc: t2[0]
      };
      1 in t2 && (e2.catchLoc = t2[1]), 2 in t2 && (e2.finallyLoc = t2[2], e2.afterLoc = t2[3]), this.tryEntries.push(e2);
    }
    function resetTryEntry(t2) {
      var e2 = t2.completion || {};
      e2.type = "normal", delete e2.arg, t2.completion = e2;
    }
    function Context(t2) {
      this.tryEntries = [{
        tryLoc: "root"
      }], t2.forEach(pushTryEntry, this), this.reset(true);
    }
    function values(e2) {
      if (e2 || "" === e2) {
        var r3 = e2[a];
        if (r3) return r3.call(e2);
        if ("function" == typeof e2.next) return e2;
        if (!isNaN(e2.length)) {
          var o2 = -1, i2 = function next() {
            for (; ++o2 < e2.length; ) if (n.call(e2, o2)) return next.value = e2[o2], next.done = false, next;
            return next.value = t, next.done = true, next;
          };
          return i2.next = i2;
        }
      }
      throw new TypeError(_typeof2(e2) + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: true
    }), o(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: true
    }), GeneratorFunction.displayName = define2(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function(t2) {
      var e2 = "function" == typeof t2 && t2.constructor;
      return !!e2 && (e2 === GeneratorFunction || "GeneratorFunction" === (e2.displayName || e2.name));
    }, e.mark = function(t2) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(t2, GeneratorFunctionPrototype) : (t2.__proto__ = GeneratorFunctionPrototype, define2(t2, u, "GeneratorFunction")), t2.prototype = Object.create(g), t2;
    }, e.awrap = function(t2) {
      return {
        __await: t2
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define2(AsyncIterator.prototype, c, function() {
      return this;
    }), e.AsyncIterator = AsyncIterator, e.async = function(t2, r3, n2, o2, i2) {
      void 0 === i2 && (i2 = Promise);
      var a2 = new AsyncIterator(wrap(t2, r3, n2, o2), i2);
      return e.isGeneratorFunction(r3) ? a2 : a2.next().then(function(t3) {
        return t3.done ? t3.value : a2.next();
      });
    }, defineIteratorMethods(g), define2(g, u, "Generator"), define2(g, a, function() {
      return this;
    }), define2(g, "toString", function() {
      return "[object Generator]";
    }), e.keys = function(t2) {
      var e2 = Object(t2), r3 = [];
      for (var n2 in e2) r3.push(n2);
      return r3.reverse(), function next() {
        for (; r3.length; ) {
          var t3 = r3.pop();
          if (t3 in e2) return next.value = t3, next.done = false, next;
        }
        return next.done = true, next;
      };
    }, e.values = values, Context.prototype = {
      constructor: Context,
      reset: function reset(e2) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = false, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e2) for (var r3 in this) "t" === r3.charAt(0) && n.call(this, r3) && !isNaN(+r3.slice(1)) && (this[r3] = t);
      },
      stop: function stop() {
        this.done = true;
        var t2 = this.tryEntries[0].completion;
        if ("throw" === t2.type) throw t2.arg;
        return this.rval;
      },
      dispatchException: function dispatchException(e2) {
        if (this.done) throw e2;
        var r3 = this;
        function handle(n2, o3) {
          return a2.type = "throw", a2.arg = e2, r3.next = n2, o3 && (r3.method = "next", r3.arg = t), !!o3;
        }
        for (var o2 = this.tryEntries.length - 1; o2 >= 0; --o2) {
          var i2 = this.tryEntries[o2], a2 = i2.completion;
          if ("root" === i2.tryLoc) return handle("end");
          if (i2.tryLoc <= this.prev) {
            var c2 = n.call(i2, "catchLoc"), u2 = n.call(i2, "finallyLoc");
            if (c2 && u2) {
              if (this.prev < i2.catchLoc) return handle(i2.catchLoc, true);
              if (this.prev < i2.finallyLoc) return handle(i2.finallyLoc);
            } else if (c2) {
              if (this.prev < i2.catchLoc) return handle(i2.catchLoc, true);
            } else {
              if (!u2) throw Error("try statement without catch or finally");
              if (this.prev < i2.finallyLoc) return handle(i2.finallyLoc);
            }
          }
        }
      },
      abrupt: function abrupt(t2, e2) {
        for (var r3 = this.tryEntries.length - 1; r3 >= 0; --r3) {
          var o2 = this.tryEntries[r3];
          if (o2.tryLoc <= this.prev && n.call(o2, "finallyLoc") && this.prev < o2.finallyLoc) {
            var i2 = o2;
            break;
          }
        }
        i2 && ("break" === t2 || "continue" === t2) && i2.tryLoc <= e2 && e2 <= i2.finallyLoc && (i2 = null);
        var a2 = i2 ? i2.completion : {};
        return a2.type = t2, a2.arg = e2, i2 ? (this.method = "next", this.next = i2.finallyLoc, y) : this.complete(a2);
      },
      complete: function complete(t2, e2) {
        if ("throw" === t2.type) throw t2.arg;
        return "break" === t2.type || "continue" === t2.type ? this.next = t2.arg : "return" === t2.type ? (this.rval = this.arg = t2.arg, this.method = "return", this.next = "end") : "normal" === t2.type && e2 && (this.next = e2), y;
      },
      finish: function finish(t2) {
        for (var e2 = this.tryEntries.length - 1; e2 >= 0; --e2) {
          var r3 = this.tryEntries[e2];
          if (r3.finallyLoc === t2) return this.complete(r3.completion, r3.afterLoc), resetTryEntry(r3), y;
        }
      },
      "catch": function _catch(t2) {
        for (var e2 = this.tryEntries.length - 1; e2 >= 0; --e2) {
          var r3 = this.tryEntries[e2];
          if (r3.tryLoc === t2) {
            var n2 = r3.completion;
            if ("throw" === n2.type) {
              var o2 = n2.arg;
              resetTryEntry(r3);
            }
            return o2;
          }
        }
        throw Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(e2, r3, n2) {
        return this.delegate = {
          iterator: values(e2),
          resultName: r3,
          nextLoc: n2
        }, "next" === this.method && (this.arg = t), y;
      }
    }, e;
  }
  module.exports = _regeneratorRuntime2, module.exports.__esModule = true, module.exports["default"] = module.exports;
})(regeneratorRuntime$1);
var regeneratorRuntimeExports = regeneratorRuntime$1.exports;
var runtime = regeneratorRuntimeExports();
var regenerator = runtime;
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
const _regeneratorRuntime = /* @__PURE__ */ getDefaultExportFromCjs(regenerator);
function _arrayWithHoles(r2) {
  if (Array.isArray(r2)) return r2;
}
function _iterableToArrayLimit(r2, l) {
  var t = null == r2 ? null : "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r2)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = false;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
    } catch (r3) {
      o = true, n = r3;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayLikeToArray(r2, a) {
  (null == a || a > r2.length) && (a = r2.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r2[e];
  return n;
}
function _unsupportedIterableToArray(r2, a) {
  if (r2) {
    if ("string" == typeof r2) return _arrayLikeToArray(r2, a);
    var t = {}.toString.call(r2).slice(8, -1);
    return "Object" === t && r2.constructor && (t = r2.constructor.name), "Map" === t || "Set" === t ? Array.from(r2) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r2, a) : void 0;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r2, e) {
  return _arrayWithHoles(r2) || _iterableToArrayLimit(r2, e) || _unsupportedIterableToArray(r2, e) || _nonIterableRest();
}
var WUJIE_APP_ID = "data-wujie-id";
var WUJIE_SCRIPT_ID = "data-wujie-script-id";
var WUJIE_DATA_FLAG = "data-wujie-Flag";
var CONTAINER_POSITION_DATA_FLAG = "data-container-position-flag";
var CONTAINER_OVERFLOW_DATA_FLAG = "data-container-overflow-flag";
var LOADING_DATA_FLAG = "data-loading-flag";
var WUJIE_DATA_ATTACH_CSS_FLAG = "data-wujie-attach-css-flag";
var WUJIE_IFRAME_CLASS = "wujie_iframe";
var WUJIE_ALL_EVENT = "_wujie_all_event";
var WUJIE_SHADE_STYLE = "position: fixed; z-index: 2147483647; visibility: hidden; inset: 0px; backface-visibility: hidden;";
var WUJIE_LOADING_STYLE = "position: absolute; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index:1;";
var WUJIE_LOADING_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="30px" viewBox="0 0 24 30">\n<rect x="0" y="13" width="4" height="5" fill="#909090">\n  <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>\n  <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>\n</rect>\n<rect x="10" y="13" width="4" height="5" fill="#909090">\n  <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate>\n  <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate>\n</rect>\n<rect x="20" y="13" width="4" height="5" fill="#909090">\n  <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate>\n  <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate>\n</rect>\n</svg>';
var WUJIE_TIPS_NO_URL = "url参数为空";
var WUJIE_TIPS_RELOAD_DISABLED = "子应用调用reload无法生效";
var WUJIE_TIPS_STOP_APP = "此报错可以忽略，iframe主动中断主应用代码在子应用运行";
var WUJIE_TIPS_STOP_APP_DETAIL = WUJIE_TIPS_STOP_APP + "，详见：https://github.com/Tencent/wujie/issues/54";
var WUJIE_TIPS_NO_SUBJECT = "事件订阅数量为空";
var WUJIE_TIPS_NO_FETCH = "window上不存在fetch属性，需要自行polyfill";
var WUJIE_TIPS_NOT_SUPPORTED = "当前浏览器不支持无界，子应用将采用iframe方式渲染";
var WUJIE_TIPS_SCRIPT_ERROR_REQUESTED = "脚本请求出现错误";
var WUJIE_TIPS_CSS_ERROR_REQUESTED = "样式请求出现错误";
var WUJIE_TIPS_HTML_ERROR_REQUESTED = "html请求出现错误";
var WUJIE_TIPS_REPEAT_RENDER = "无界组件短时间重复渲染了两次，可能存在性能问题请检查代码";
var WUJIE_TIPS_NO_SCRIPT = "目标Script尚未准备好或已经被移除";
var WUJIE_TIPS_GET_ELEMENT_BY_ID = "不支持document.getElementById()传入特殊字符，请参考document.querySelector文档";
function isFunction(value) {
  return typeof value === "function";
}
function isHijackingTag(tagName) {
  return (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === "LINK" || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === "STYLE" || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === "SCRIPT" || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === "IFRAME";
}
var wujieSupport = window.Proxy && window.CustomElementRegistry;
var naughtySafari = typeof document.all === "function" && typeof document.all === "undefined";
var callableFnCacheMap = /* @__PURE__ */ new WeakMap();
var isCallable = function isCallable2(fn) {
  if (callableFnCacheMap.has(fn)) {
    return true;
  }
  var callable = naughtySafari ? typeof fn === "function" && typeof fn !== "undefined" : typeof fn === "function";
  if (callable) {
    callableFnCacheMap.set(fn, callable);
  }
  return callable;
};
var boundedMap = /* @__PURE__ */ new WeakMap();
function isBoundedFunction(fn) {
  if (boundedMap.has(fn)) {
    return boundedMap.get(fn);
  }
  var bounded = fn.name.indexOf("bound ") === 0 && !fn.hasOwnProperty("prototype");
  boundedMap.set(fn, bounded);
  return bounded;
}
var fnRegexCheckCacheMap = /* @__PURE__ */ new WeakMap();
function isConstructable(fn) {
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
var setFnCacheMap = /* @__PURE__ */ new WeakMap();
function checkProxyFunction(value) {
  if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value)) {
    if (!setFnCacheMap.has(value)) {
      setFnCacheMap.set(value, value);
    }
  }
}
function getTargetValue(target, p) {
  var value = target[p];
  if (setFnCacheMap.has(value)) {
    return setFnCacheMap.get(value);
  }
  if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value)) {
    var boundValue = Function.prototype.bind.call(value, target);
    setFnCacheMap.set(value, boundValue);
    for (var _key in value) {
      boundValue[_key] = value[_key];
    }
    if (value.hasOwnProperty("prototype") && !boundValue.hasOwnProperty("prototype")) {
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
function getDegradeIframe(id) {
  return window.document.querySelector("iframe[".concat(WUJIE_APP_ID, '="').concat(id, '"]'));
}
function setAttrsToElement(element2, attrs) {
  Object.keys(attrs).forEach(function(name) {
    element2.setAttribute(name, attrs[name]);
  });
}
function appRouteParse(url) {
  if (!url) {
    error(WUJIE_TIPS_NO_URL);
    throw new Error();
  }
  var urlElement = anchorElementGenerator(url);
  var appHostPath = urlElement.protocol + "//" + urlElement.host;
  var appRoutePath = urlElement.pathname + urlElement.search + urlElement.hash;
  if (!appRoutePath.startsWith("/")) appRoutePath = "/" + appRoutePath;
  return {
    urlElement,
    appHostPath,
    appRoutePath
  };
}
function anchorElementGenerator(url) {
  var element2 = window.document.createElement("a");
  element2.href = url;
  element2.href = element2.href;
  return element2;
}
function getAnchorElementQueryMap(anchorElement) {
  var queryList = anchorElement.search.replace("?", "").split("&");
  var queryMap = {};
  queryList.forEach(function(query) {
    var _query$split = query.split("="), _query$split2 = _slicedToArray(_query$split, 2), key = _query$split2[0], value = _query$split2[1];
    if (key && value) queryMap[key] = value;
  });
  return queryMap;
}
function isMatchSyncQueryById(id) {
  var queryMap = getAnchorElementQueryMap(anchorElementGenerator(window.location.href));
  return Object.keys(queryMap).includes(id);
}
function fixElementCtrSrcOrHref(iframeWindow, elementCtr, attr2) {
  var rawElementSetAttribute = iframeWindow.Element.prototype.setAttribute;
  elementCtr.prototype.setAttribute = function(name, value) {
    var targetValue = value;
    if (name === attr2) targetValue = getAbsolutePath(value, this.baseURI || "", true);
    rawElementSetAttribute.call(this, name, targetValue);
  };
  var rawAnchorElementHrefDescriptor = Object.getOwnPropertyDescriptor(elementCtr.prototype, attr2);
  var enumerable = rawAnchorElementHrefDescriptor.enumerable, configurable = rawAnchorElementHrefDescriptor.configurable, _get = rawAnchorElementHrefDescriptor.get, _set = rawAnchorElementHrefDescriptor.set;
  Object.defineProperty(elementCtr.prototype, attr2, {
    enumerable,
    configurable,
    get: function get() {
      return _get.call(this);
    },
    set: function set(href) {
      _set.call(this, getAbsolutePath(href, this.baseURI, true));
    }
  });
}
function getCurUrl(proxyLocation) {
  var location2 = proxyLocation;
  return location2.protocol + "//" + location2.host + location2.pathname;
}
function getAbsolutePath(url, base, hash2) {
  try {
    if (url) {
      if (hash2 && url.startsWith("#")) return url;
      return new URL(url, base).href;
    } else return url;
  } catch (_unused) {
    return url;
  }
}
function getSyncUrl(id, prefix) {
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
var requestIdleCallback = window.requestIdleCallback || function(cb) {
  return setTimeout(cb, 1);
};
function getContainer(container) {
  return typeof container === "string" ? document.querySelector(container) : container;
}
function warn(msg, data) {
  var _console;
  (_console = console) === null || _console === void 0 || _console.warn("[wujie warn]: ".concat(msg), data);
}
function error(msg, data) {
  var _console2;
  (_console2 = console) === null || _console2 === void 0 || _console2.error("[wujie error]: ".concat(msg), data);
}
function getInlineCode(match) {
  var start2 = match.indexOf(">") + 1;
  var end = match.lastIndexOf("<");
  return match.substring(start2, end);
}
function defaultGetPublicPath(entry) {
  if (_typeof$1(entry) === "object") {
    return "/";
  }
  try {
    var _URL = new URL(entry, location.href), origin = _URL.origin, pathname = _URL.pathname;
    var paths = pathname.split("/");
    paths.pop();
    return "".concat(origin).concat(paths.join("/"), "/");
  } catch (e) {
    console.warn(e);
    return "";
  }
}
function compose$1(fnList) {
  return function(code) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return fnList.reduce(function(newCode, fn) {
      return isFunction(fn) ? fn.apply(void 0, [newCode].concat(args)) : newCode;
    }, code || "");
  };
}
function nextTick(cb) {
  Promise.resolve().then(cb);
}
function execHooks(plugins, hookName) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key3 = 2; _key3 < _len2; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }
  try {
    if (plugins && plugins.length > 0) {
      plugins.map(function(plugin) {
        return plugin[hookName];
      }).filter(function(hook) {
        return isFunction(hook);
      }).forEach(function(hook) {
        return hook.apply(void 0, args);
      });
    }
  } catch (e) {
    error(e);
  }
}
function isScriptElement(element2) {
  var _element$tagName;
  return ((_element$tagName = element2.tagName) === null || _element$tagName === void 0 ? void 0 : _element$tagName.toUpperCase()) === "SCRIPT";
}
var count = 1;
function setTagToScript(element2, tag2) {
  if (isScriptElement(element2)) {
    var scriptTag = tag2 || String(count++);
    element2.setAttribute(WUJIE_SCRIPT_ID, scriptTag);
  }
}
function getTagFromScript(element2) {
  if (isScriptElement(element2)) {
    return element2.getAttribute(WUJIE_SCRIPT_ID);
  }
  return null;
}
function mergeOptions(options, cacheOptions) {
  return {
    name: options.name,
    el: options.el || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.el),
    url: options.url || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.url),
    html: options.html || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.html),
    exec: options.exec !== void 0 ? options.exec : cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.exec,
    replace: options.replace || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.replace),
    fetch: options.fetch || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.fetch),
    props: options.props || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.props),
    sync: options.sync !== void 0 ? options.sync : cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.sync,
    prefix: options.prefix || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.prefix),
    loading: options.loading || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.loading),
    // 默认 {}
    attrs: options.attrs !== void 0 ? options.attrs : (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.attrs) || {},
    degradeAttrs: options.degradeAttrs !== void 0 ? options.degradeAttrs : (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.degradeAttrs) || {},
    // 默认 true
    fiber: options.fiber !== void 0 ? options.fiber : (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.fiber) !== void 0 ? cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.fiber : true,
    alive: options.alive !== void 0 ? options.alive : cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.alive,
    degrade: options.degrade !== void 0 ? options.degrade : cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.degrade,
    plugins: options.plugins || (cacheOptions === null || cacheOptions === void 0 ? void 0 : cacheOptions.plugins),
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
function eventTrigger(el, eventName, detail) {
  var event;
  if (typeof window.CustomEvent === "function") {
    event = new CustomEvent(eventName, {
      detail
    });
  } else {
    event = document.createEvent("CustomEvent");
    event.initCustomEvent(eventName, true, false, detail);
  }
  el.dispatchEvent(event);
}
function stopMainAppRun() {
  warn(WUJIE_TIPS_STOP_APP_DETAIL);
  throw new Error(WUJIE_TIPS_STOP_APP);
}
var ALL_SCRIPT_REGEX = /(<script[\s\S]*?>)[\s\S]*?<\/script>/gi;
var SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|")text\/ng\x2Dtemplate\3)[\s\S])*?>[\s\S]*?<\/\1>/i;
var SCRIPT_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/;
var SCRIPT_TYPE_REGEX = /.*\stype=('|")?([^>'"\s]+)/;
var SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/;
var SCRIPT_ASYNC_REGEX = /.*\sasync\s*.*/;
var DEFER_ASYNC_REGEX = /.*\sdefer\s*.*/;
var SCRIPT_NO_MODULE_REGEX = /.*\snomodule\s*.*/;
var SCRIPT_MODULE_REGEX = /.*\stype=('|")?module('|")?\s*.*/;
var LINK_TAG_REGEX = /<(link)\s+[\s\S]*?>/gi;
var LINK_PRELOAD_OR_PREFETCH_REGEX = /\srel=('|")?(preload|prefetch|modulepreload)\1/;
var LINK_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var LINK_AS_FONT = /.*\sas=('|")?font\1.*/;
var STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi;
var STYLE_TYPE_REGEX = /\s+rel=('|")?stylesheet\1.*/;
var STYLE_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
var LINK_IGNORE_REGEX = /<link(\s+|\s+[\s\S]+\s+)ignore(\s*|\s+[\s\S]*|=[\s\S]*)>/i;
var STYLE_IGNORE_REGEX = /<style(\s+|\s+[\s\S]+\s+)ignore(\s*|\s+[\s\S]*|=[\s\S]*)>/i;
var SCRIPT_IGNORE_REGEX = /<script(\s+|\s+[\s\S]+\s+)ignore(\s*|\s+[\s\S]*|=[\s\S]*)>/i;
var CROSS_ORIGIN_REGEX = /.*\scrossorigin=?('|")?(use-credentials|anonymous)?('|")?/i;
function hasProtocol(url) {
  return url.startsWith("//") || url.startsWith("http://") || url.startsWith("https://");
}
function getEntirePath(path, baseURI) {
  return new URL(path, baseURI).toString();
}
function isValidJavaScriptType(type3) {
  var handleTypes = ["text/javascript", "module", "application/javascript", "text/ecmascript", "application/ecmascript"];
  return !type3 || handleTypes.indexOf(type3) !== -1;
}
function parseTagAttributes(TagOuterHTML) {
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
var genLinkReplaceSymbol = function genLinkReplaceSymbol2(linkHref) {
  var preloadOrPrefetch = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  return "<!-- ".concat(preloadOrPrefetch ? "prefetch/preload/modulepreload" : "", " link ").concat(linkHref, " replaced by wujie -->");
};
var getInlineStyleReplaceSymbol = function getInlineStyleReplaceSymbol2(index) {
  return "<!-- inline-style-".concat(index, " replaced by wujie -->");
};
var genScriptReplaceSymbol = function genScriptReplaceSymbol2(scriptSrc) {
  var type3 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  return "<!-- ".concat(type3, " script ").concat(scriptSrc, " replaced by wujie -->");
};
var inlineScriptReplaceSymbol = "<!-- inline scripts replaced by wujie -->";
var genIgnoreAssetReplaceSymbol = function genIgnoreAssetReplaceSymbol2(url) {
  return "<!-- ignore asset ".concat(url || "file", " replaced by wujie -->");
};
var genModuleScriptReplaceSymbol = function genModuleScriptReplaceSymbol2(scriptSrc, moduleSupport) {
  return "<!-- ".concat(moduleSupport ? "nomodule" : "module", " script ").concat(scriptSrc, " ignored by wujie -->");
};
function processTpl(tpl, baseURI, postProcessTemplate) {
  var scripts = [];
  var styles = [];
  var entry = null;
  var moduleSupport = isModuleScriptSupported();
  var template = tpl.replace(HTML_COMMENT_REGEX, "").replace(LINK_TAG_REGEX, function(match) {
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
      var _match$match = match.match(LINK_HREF_REGEX), _match$match2 = _slicedToArray(_match$match, 3), linkHref = _match$match2[2];
      return genLinkReplaceSymbol(linkHref, true);
    }
    return match;
  }).replace(STYLE_TAG_REGEX, function(match) {
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
  }).replace(ALL_SCRIPT_REGEX, function(match, scriptTag) {
    var scriptIgnore = scriptTag.match(SCRIPT_IGNORE_REGEX);
    var isModuleScript = !!scriptTag.match(SCRIPT_MODULE_REGEX);
    var isCrossOriginScript = scriptTag.match(CROSS_ORIGIN_REGEX);
    var crossOriginType = (isCrossOriginScript === null || isCrossOriginScript === void 0 ? void 0 : isCrossOriginScript[2]) || "";
    var moduleScriptIgnore = moduleSupport && !!scriptTag.match(SCRIPT_NO_MODULE_REGEX) || !moduleSupport && isModuleScript;
    var matchedScriptTypeMatch = scriptTag.match(SCRIPT_TYPE_REGEX);
    var matchedScriptType = matchedScriptTypeMatch && matchedScriptTypeMatch[2];
    if (!isValidJavaScriptType(matchedScriptType)) {
      return match;
    }
    if (SCRIPT_TAG_REGEX.test(match) && scriptTag.match(SCRIPT_SRC_REGEX)) {
      var matchedScriptEntry = scriptTag.match(SCRIPT_ENTRY_REGEX);
      var matchedScriptSrcMatch = scriptTag.match(SCRIPT_SRC_REGEX);
      var matchedScriptSrc = matchedScriptSrcMatch && matchedScriptSrcMatch[2];
      if (entry && matchedScriptEntry) {
        throw new SyntaxError("You should not set multiply entry script!");
      } else {
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
      var code = getInlineCode(match);
      var isPureCommentBlock = code.split(/[\r\n]+/).every(function(line) {
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
    template,
    scripts,
    styles,
    // set the last script as entry if have not set
    entry: entry || scripts[scripts.length - 1]
  };
  return tplResult;
}
function _arrayWithoutHoles(r2) {
  if (Array.isArray(r2)) return _arrayLikeToArray(r2);
}
function _iterableToArray(r2) {
  if ("undefined" != typeof Symbol && null != r2[Symbol.iterator] || null != r2["@@iterator"]) return Array.from(r2);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(r2) {
  return _arrayWithoutHoles(r2) || _iterableToArray(r2) || _unsupportedIterableToArray(r2) || _nonIterableSpread();
}
function getCssLoader(_ref) {
  var plugins = _ref.plugins, replace = _ref.replace;
  return function(code) {
    var src = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    var base = arguments.length > 2 ? arguments[2] : void 0;
    return compose$1(plugins.map(function(plugin) {
      return plugin.cssLoader;
    }))(replace ? replace(code) : code, src, base);
  };
}
function getJsLoader(_ref2) {
  var plugins = _ref2.plugins, replace = _ref2.replace;
  return function(code) {
    var src = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    var base = arguments.length > 2 ? arguments[2] : void 0;
    return compose$1(plugins.map(function(plugin) {
      return plugin.jsLoader;
    }))(replace ? replace(code) : code, src, base);
  };
}
function getPresetLoaders(loaderType, plugins) {
  var loaders = plugins.map(function(plugin) {
    return plugin[loaderType];
  }).filter(function(loaders2) {
    return loaders2 === null || loaders2 === void 0 ? void 0 : loaders2.length;
  });
  var res = loaders.reduce(function(preLoaders, curLoaders) {
    return preLoaders.concat(curLoaders);
  }, []);
  return loaderType === "cssBeforeLoaders" ? res.reverse() : res;
}
function getEffectLoaders(loaderType, plugins) {
  return plugins.map(function(plugin) {
    return plugin[loaderType];
  }).filter(function(loaders) {
    return loaders === null || loaders === void 0 ? void 0 : loaders.length;
  }).reduce(function(preLoaders, curLoaders) {
    return preLoaders.concat(curLoaders);
  }, []);
}
function isMatchUrl(url, effectLoaders) {
  return effectLoaders.some(function(loader) {
    return typeof loader === "string" ? url === loader : loader.test(url);
  });
}
function cssRelativePathResolve(code, src, base) {
  var baseUrl = src ? getAbsolutePath(src, base) : base;
  var urlReg = /(url\((?!['"]?(?:data):)['"]?)([^'")]*)(['"]?\))/g;
  return code.replace(urlReg, function(_m, pre, url, post) {
    var absoluteUrl = getAbsolutePath(url, baseUrl);
    return pre + absoluteUrl + post;
  });
}
var defaultPlugin = {
  cssLoader: cssRelativePathResolve,
  // fix https://github.com/Tencent/wujie/issues/455
  cssBeforeLoaders: [{
    content: "html {view-transition-name: none;}"
  }]
};
function getPlugins(plugins) {
  return Array.isArray(plugins) ? [defaultPlugin].concat(_toConsumableArray(plugins)) : [defaultPlugin];
}
function ownKeys$6(e, r2) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r2 && (o = o.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e, r3).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$6(e) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$6(Object(t), true).forEach(function(r3) {
      _defineProperty(e, r3, t[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$6(Object(t)).forEach(function(r3) {
      Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
    });
  }
  return e;
}
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
function processCssLoader(_x, _x2, _x3) {
  return _processCssLoader.apply(this, arguments);
}
function _processCssLoader() {
  _processCssLoader = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime.mark(function _callee(sandbox, template, getExternalStyleSheets) {
    var curUrl, composeCssLoader, processedCssList, embedHTML;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          curUrl = getCurUrl(sandbox.proxyLocation);
          composeCssLoader = compose$1(sandbox.plugins.map(function(plugin) {
            return plugin.cssLoader;
          }));
          processedCssList = getExternalStyleSheets().map(function(_ref2) {
            var src = _ref2.src, ignore = _ref2.ignore, contentPromise = _ref2.contentPromise;
            return {
              src,
              ignore,
              contentPromise: contentPromise.then(function(content) {
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
  _getEmbedHTML = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime.mark(function _callee2(template, styleResultList) {
    var embedHTML;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          embedHTML = template;
          return _context2.abrupt("return", Promise.all(styleResultList.map(function(styleResult, index) {
            return styleResult.contentPromise.then(function(content) {
              if (styleResult.src) {
                embedHTML = embedHTML.replace(genLinkReplaceSymbol(styleResult.src), styleResult.ignore ? '<link href="'.concat(styleResult.src, '" rel="stylesheet" type="text/css">') : "<style>/* ".concat(styleResult.src, " */").concat(content, "</style>"));
              } else if (content) {
                embedHTML = embedHTML.replace(getInlineStyleReplaceSymbol(index), "<style>/* inline-style-".concat(index, " */").concat(content, "</style>"));
              }
            });
          })).then(function() {
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
var isInlineCode = function isInlineCode2(code) {
  return code.startsWith("<");
};
var fetchAssets = function fetchAssets2(src, cache, fetch2, cssFlag, loadError) {
  return cache[src] || (cache[src] = fetch2(src).then(function(response) {
    if (response.status >= 400) {
      cache[src] = null;
      if (cssFlag) {
        error(WUJIE_TIPS_CSS_ERROR_REQUESTED, {
          src,
          response
        });
        loadError === null || loadError === void 0 || loadError(src, new Error(WUJIE_TIPS_CSS_ERROR_REQUESTED));
        return "";
      } else {
        error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED, {
          src,
          response
        });
        loadError === null || loadError === void 0 || loadError(src, new Error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED));
        throw new Error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED);
      }
    }
    return response.text();
  })["catch"](function(e) {
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
function _getExternalStyleSheets(styles) {
  var fetch2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : defaultFetch;
  var loadError = arguments.length > 2 ? arguments[2] : void 0;
  return styles.map(function(_ref) {
    var src = _ref.src, content = _ref.content, ignore = _ref.ignore;
    if (content) {
      return {
        src: "",
        contentPromise: Promise.resolve(content)
      };
    } else if (isInlineCode(src)) {
      return {
        src: "",
        contentPromise: Promise.resolve(getInlineCode(src))
      };
    } else {
      return {
        src,
        ignore,
        contentPromise: ignore ? Promise.resolve("") : fetchAssets(src, styleCache, fetch2, true, loadError)
      };
    }
  });
}
function _getExternalScripts(scripts) {
  var fetch2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : defaultFetch;
  var loadError = arguments.length > 2 ? arguments[2] : void 0;
  var fiber = arguments.length > 3 ? arguments[3] : void 0;
  return scripts.map(function(script) {
    var src = script.src, async = script.async, defer = script.defer, module = script.module, ignore = script.ignore;
    var contentPromise = null;
    if ((async || defer) && src && !module) {
      contentPromise = new Promise(function(resolve, reject3) {
        return fiber ? requestIdleCallback(function() {
          return fetchAssets(src, scriptCache, fetch2, false, loadError).then(resolve, reject3);
        }) : fetchAssets(src, scriptCache, fetch2, false, loadError).then(resolve, reject3);
      });
    } else if (module && src || ignore) {
      contentPromise = Promise.resolve("");
    } else if (!src) {
      contentPromise = Promise.resolve(script.content);
    } else {
      contentPromise = fetchAssets(src, scriptCache, fetch2, false, loadError);
    }
    if (module && !async) script.defer = true;
    return _objectSpread$6(_objectSpread$6({}, script), {}, {
      contentPromise
    });
  });
}
function importHTML(params2) {
  var _opts$fetch, _opts$fiber;
  var url = params2.url, opts = params2.opts, html = params2.html;
  var fetch2 = (_opts$fetch = opts.fetch) !== null && _opts$fetch !== void 0 ? _opts$fetch : defaultFetch;
  var fiber = (_opts$fiber = opts.fiber) !== null && _opts$fiber !== void 0 ? _opts$fiber : true;
  var plugins = opts.plugins, loadError = opts.loadError;
  var htmlLoader = plugins ? compose$1(plugins.map(function(plugin) {
    return plugin.htmlLoader;
  })) : defaultGetTemplate;
  var jsExcludes = getEffectLoaders("jsExcludes", plugins);
  var cssExcludes = getEffectLoaders("cssExcludes", plugins);
  var jsIgnores = getEffectLoaders("jsIgnores", plugins);
  var cssIgnores = getEffectLoaders("cssIgnores", plugins);
  var getPublicPath = defaultGetPublicPath;
  var getHtmlParseResult = function getHtmlParseResult2(url2, html2, htmlLoader2) {
    return (html2 ? Promise.resolve(html2) : fetch2(url2).then(function(response) {
      if (response.status >= 400) {
        error(WUJIE_TIPS_HTML_ERROR_REQUESTED, {
          url: url2,
          response
        });
        loadError === null || loadError === void 0 || loadError(url2, new Error(WUJIE_TIPS_HTML_ERROR_REQUESTED));
        return "";
      }
      return response.text();
    })["catch"](function(e) {
      embedHTMLCache[url2] = null;
      loadError === null || loadError === void 0 || loadError(url2, e);
      return Promise.reject(e);
    })).then(function(html3) {
      var assetPublicPath = getPublicPath(url2);
      var _processTpl = processTpl(htmlLoader2(html3), assetPublicPath), template = _processTpl.template, scripts = _processTpl.scripts, styles = _processTpl.styles;
      return {
        template,
        assetPublicPath,
        getExternalScripts: function getExternalScripts() {
          return _getExternalScripts(scripts.filter(function(script) {
            return !script.src || !isMatchUrl(script.src, jsExcludes);
          }).map(function(script) {
            return _objectSpread$6(_objectSpread$6({}, script), {}, {
              ignore: script.src && isMatchUrl(script.src, jsIgnores)
            });
          }), fetch2, loadError, fiber);
        },
        getExternalStyleSheets: function getExternalStyleSheets() {
          return _getExternalStyleSheets(styles.filter(function(style) {
            return !style.src || !isMatchUrl(style.src, cssExcludes);
          }).map(function(style) {
            return _objectSpread$6(_objectSpread$6({}, style), {}, {
              ignore: style.src && isMatchUrl(style.src, cssIgnores)
            });
          }), fetch2, loadError);
        }
      };
    });
  };
  if (opts !== null && opts !== void 0 && opts.plugins.some(function(plugin) {
    return plugin.htmlLoader;
  })) {
    return getHtmlParseResult(url, html, htmlLoader);
  } else {
    return embedHTMLCache[url] || (embedHTMLCache[url] = getHtmlParseResult(url, html, htmlLoader));
  }
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r2) {
  for (var t = 0; t < r2.length; t++) {
    var o = r2[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, toPropertyKey(o.key), o);
  }
}
function _createClass(e, r2, t) {
  return r2 && _defineProperties(e.prototype, r2), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
    return t2.__proto__ = e2, t2;
  }, _setPrototypeOf(t, e);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == _typeof$1(e) || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t2) {
    return t2.__proto__ || Object.getPrototypeOf(t2);
  }, _getPrototypeOf(t);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct$1() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct$1 = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
function _construct(t, e, r2) {
  if (_isNativeReflectConstruct$1()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r2 && _setPrototypeOf(p, r2.prototype), p;
}
function _wrapNativeSuper(t) {
  var r2 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
  return _wrapNativeSuper = function _wrapNativeSuper2(t2) {
    if (null === t2 || !_isNativeFunction(t2)) return t2;
    if ("function" != typeof t2) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r2) {
      if (r2.has(t2)) return r2.get(t2);
      r2.set(t2, Wrapper);
    }
    function Wrapper() {
      return _construct(t2, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    }), _setPrototypeOf(Wrapper, t2);
  }, _wrapNativeSuper(t);
}
function ownKeys$5(e, r2) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r2 && (o = o.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e, r3).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$5(e) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$5(Object(t), true).forEach(function(r3) {
      _defineProperty(e, r3, t[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$5(Object(t)).forEach(function(r3) {
      Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
    });
  }
  return e;
}
var idToSandboxCacheMap = window.__POWERED_BY_WUJIE__ ? window.__WUJIE.inject.idToSandboxMap : /* @__PURE__ */ new Map();
function getWujieById(id) {
  var _idToSandboxCacheMap$;
  return ((_idToSandboxCacheMap$ = idToSandboxCacheMap.get(id)) === null || _idToSandboxCacheMap$ === void 0 ? void 0 : _idToSandboxCacheMap$.wujie) || null;
}
function getOptionsById(id) {
  var _idToSandboxCacheMap$2;
  return ((_idToSandboxCacheMap$2 = idToSandboxCacheMap.get(id)) === null || _idToSandboxCacheMap$2 === void 0 ? void 0 : _idToSandboxCacheMap$2.options) || null;
}
function addSandboxCacheWithWujie(id, sandbox) {
  var wujieCache = idToSandboxCacheMap.get(id);
  if (wujieCache) idToSandboxCacheMap.set(id, _objectSpread$5(_objectSpread$5({}, wujieCache), {}, {
    wujie: sandbox
  }));
  else idToSandboxCacheMap.set(id, {
    wujie: sandbox
  });
}
function deleteWujieById(id) {
  var wujieCache = idToSandboxCacheMap.get(id);
  if (wujieCache !== null && wujieCache !== void 0 && wujieCache.options) idToSandboxCacheMap.set(id, {
    options: wujieCache.options
  });
  idToSandboxCacheMap["delete"](id);
}
function addSandboxCacheWithOptions(id, options) {
  var wujieCache = idToSandboxCacheMap.get(id);
  if (wujieCache) idToSandboxCacheMap.set(id, _objectSpread$5(_objectSpread$5({}, wujieCache), {}, {
    options
  }));
  else idToSandboxCacheMap.set(id, {
    options
  });
}
var documentProxyProperties = {
  // 降级场景下需要本地特殊处理的属性
  modifyLocalProperties: ["createElement", "createTextNode", "documentURI", "URL", "getElementsByTagName"],
  // 子应用需要手动修正的属性方法
  modifyProperties: ["createElement", "createTextNode", "documentURI", "URL", "getElementsByTagName", "getElementsByClassName", "getElementsByName", "getElementById", "querySelector", "querySelectorAll", "documentElement", "scrollingElement", "forms", "images", "links"],
  // 需要从shadowRoot中获取的属性
  shadowProperties: ["activeElement", "childElementCount", "children", "firstElementChild", "firstChild", "fullscreenElement", "lastElementChild", "pictureInPictureElement", "pointerLockElement", "styleSheets"],
  // 需要从shadowRoot中获取的方法
  shadowMethods: ["append", "contains", "getSelection", "elementFromPoint", "elementsFromPoint", "getAnimations", "replaceChildren"],
  // 需要从主应用document中获取的属性
  documentProperties: ["characterSet", "compatMode", "contentType", "designMode", "dir", "doctype", "embeds", "fullscreenEnabled", "hidden", "implementation", "lastModified", "pictureInPictureEnabled", "plugins", "readyState", "referrer", "visibilityState", "fonts"],
  // 需要从主应用document中获取的方法
  documentMethods: ["execCommand", "caretPositionFromPoint", "createRange", "exitFullscreen", "exitPictureInPicture", "getElementsByTagNameNS", "hasFocus", "prepend"],
  // 需要从主应用document中获取的事件
  documentEvents: ["onpointerlockchange", "onpointerlockerror", "onbeforecopy", "onbeforecut", "onbeforepaste", "onfreeze", "onresume", "onsearch", "onfullscreenchange", "onfullscreenerror", "onsecuritypolicyviolation", "onvisibilitychange"],
  // 无需修改原型的属性
  ownerProperties: ["head", "body"]
};
var appDocumentAddEventListenerEvents = ["DOMContentLoaded", "readystatechange"];
var appDocumentOnEvents = ["onreadystatechange"];
var mainDocumentAddEventListenerEvents = ["fullscreenchange", "fullscreenerror", "selectionchange", "visibilitychange", "wheel", "keydown", "keypress", "keyup"];
var mainAndAppAddEventListenerEvents = ["gotpointercapture", "lostpointercapture"];
var appWindowAddEventListenerEvents = ["hashchange", "popstate", "DOMContentLoaded", "load", "beforeunload", "unload", "message", "error", "unhandledrejection"];
var appWindowOnEvent = ["onload", "onbeforeunload", "onunload"];
var relativeElementTagAttrMap = {
  IMG: "src",
  A: "href",
  SOURCE: "src"
};
var windowProxyProperties = ["getComputedStyle", "visualViewport", "matchMedia", "DOMParser"];
var windowRegWhiteList = [/animationFrame$/i, /resizeObserver$|mutationObserver$|intersectionObserver$/i, /height$|width$|left$/i, /^screen/i, /X$|Y$/];
var rawElementAppendChild = HTMLElement.prototype.appendChild;
var rawElementRemoveChild = HTMLElement.prototype.removeChild;
var rawElementContains = HTMLElement.prototype.contains;
var rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
var rawBodyInsertBefore = HTMLBodyElement.prototype.insertBefore;
var rawAddEventListener = Node.prototype.addEventListener;
var rawRemoveEventListener = Node.prototype.removeEventListener;
var rawWindowAddEventListener = window.addEventListener;
var rawWindowRemoveEventListener = window.removeEventListener;
var rawAppendChild = Node.prototype.appendChild;
var rawDocumentQuerySelector = window.__POWERED_BY_WUJIE__ ? window.__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR__ : Document.prototype.querySelector;
function ownKeys$4(e, r2) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r2 && (o = o.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e, r3).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$4(e) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$4(Object(t), true).forEach(function(r3) {
      _defineProperty(e, r3, t[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function(r3) {
      Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
    });
  }
  return e;
}
function patchCustomEvent(e, elementGetter) {
  Object.defineProperties(e, {
    srcElement: {
      get: elementGetter
    },
    target: {
      get: elementGetter
    }
  });
  return e;
}
function manualInvokeElementEvent(element2, event) {
  var customEvent = new CustomEvent(event);
  var patchedEvent = patchCustomEvent(customEvent, function() {
    return element2;
  });
  if (isFunction(element2["on".concat(event)])) {
    element2["on".concat(event)](patchedEvent);
  } else {
    element2.dispatchEvent(patchedEvent);
  }
}
function handleStylesheetElementPatch(stylesheetElement, sandbox) {
  if (!stylesheetElement.innerHTML || sandbox.degrade) return;
  var patcher = function patcher2() {
    var _getPatchStyleElement = getPatchStyleElements([stylesheetElement.sheet]), _getPatchStyleElement2 = _slicedToArray(_getPatchStyleElement, 2), hostStyleSheetElement = _getPatchStyleElement2[0], fontStyleSheetElement = _getPatchStyleElement2[1];
    if (hostStyleSheetElement) {
      sandbox.shadowRoot.head.appendChild(hostStyleSheetElement);
    }
    if (fontStyleSheetElement) {
      sandbox.shadowRoot.host.appendChild(fontStyleSheetElement);
    }
    stylesheetElement._patcher = void 0;
  };
  if (stylesheetElement._patcher) {
    clearTimeout(stylesheetElement._patcher);
  }
  stylesheetElement._patcher = setTimeout(patcher, 50);
}
function patchStylesheetElement(stylesheetElement, cssLoader, sandbox, curUrl) {
  var _stylesheetElement$sh;
  if (stylesheetElement._hasPatchStyle) return;
  var innerHTMLDesc = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
  var innerTextDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerText");
  var textContentDesc = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");
  var RawInsertRule = (_stylesheetElement$sh = stylesheetElement.sheet) === null || _stylesheetElement$sh === void 0 ? void 0 : _stylesheetElement$sh.insertRule;
  function patchSheetInsertRule() {
    if (!RawInsertRule) return;
    stylesheetElement.sheet.insertRule = function(rule, index) {
      innerHTMLDesc ? stylesheetElement.innerHTML += rule : stylesheetElement.innerText += rule;
      return RawInsertRule.call(stylesheetElement.sheet, rule, index);
    };
  }
  patchSheetInsertRule();
  if (innerHTMLDesc) {
    Object.defineProperties(stylesheetElement, {
      innerHTML: {
        get: function get() {
          return innerHTMLDesc.get.call(stylesheetElement);
        },
        set: function set(code) {
          var _this = this;
          innerHTMLDesc.set.call(stylesheetElement, cssLoader(code, "", curUrl));
          nextTick(function() {
            return handleStylesheetElementPatch(_this, sandbox);
          });
        }
      }
    });
  }
  Object.defineProperties(stylesheetElement, {
    innerText: {
      get: function get() {
        return innerTextDesc.get.call(stylesheetElement);
      },
      set: function set(code) {
        var _this2 = this;
        innerTextDesc.set.call(stylesheetElement, cssLoader(code, "", curUrl));
        nextTick(function() {
          return handleStylesheetElementPatch(_this2, sandbox);
        });
      }
    },
    textContent: {
      get: function get() {
        return textContentDesc.get.call(stylesheetElement);
      },
      set: function set(code) {
        var _this3 = this;
        textContentDesc.set.call(stylesheetElement, cssLoader(code, "", curUrl));
        nextTick(function() {
          return handleStylesheetElementPatch(_this3, sandbox);
        });
      }
    },
    appendChild: {
      value: function value(node) {
        var _this4 = this;
        nextTick(function() {
          return handleStylesheetElementPatch(_this4, sandbox);
        });
        if (node.nodeType === Node.TEXT_NODE) {
          var res = rawAppendChild.call(stylesheetElement, stylesheetElement.ownerDocument.createTextNode(cssLoader(node.textContent, "", curUrl)));
          patchSheetInsertRule();
          return res;
        } else return rawAppendChild(node);
      }
    },
    _hasPatchStyle: {
      get: function get() {
        return true;
      }
    }
  });
}
var dynamicScriptExecStack = Promise.resolve();
function rewriteAppendOrInsertChild(opts) {
  return function appendChildOrInsertBefore(newChild, refChild) {
    var _this5 = this;
    var element2 = newChild;
    var rawDOMAppendOrInsertBefore = opts.rawDOMAppendOrInsertBefore, wujieId = opts.wujieId;
    var sandbox = getWujieById(wujieId);
    var styleSheetElements = sandbox.styleSheetElements, replace = sandbox.replace, fetch2 = sandbox.fetch, plugins = sandbox.plugins, iframe = sandbox.iframe, lifecycles = sandbox.lifecycles, proxyLocation = sandbox.proxyLocation, fiber = sandbox.fiber;
    if (!isHijackingTag(element2.tagName) || !wujieId) {
      var res = rawDOMAppendOrInsertBefore.call(this, element2, refChild);
      patchElementEffect(element2, iframe.contentWindow);
      execHooks(plugins, "appendOrInsertElementHook", element2, iframe.contentWindow);
      return res;
    }
    var iframeDocument = iframe.contentDocument;
    var curUrl = getCurUrl(proxyLocation);
    if (element2.tagName) {
      var _element$tagName;
      switch ((_element$tagName = element2.tagName) === null || _element$tagName === void 0 ? void 0 : _element$tagName.toUpperCase()) {
        case "LINK": {
          var _ref = element2, href = _ref.href, rel = _ref.rel, type3 = _ref.type;
          var styleFlag = rel === "stylesheet" || type3 === "text/css" || href.endsWith(".css");
          if (!styleFlag) {
            var _res = rawDOMAppendOrInsertBefore.call(this, element2, refChild);
            execHooks(plugins, "appendOrInsertElementHook", element2, iframe.contentWindow);
            return _res;
          }
          if (href && !isMatchUrl(href, getEffectLoaders("cssExcludes", plugins))) {
            _getExternalStyleSheets([{
              src: href,
              ignore: isMatchUrl(href, getEffectLoaders("cssIgnores", plugins))
            }], fetch2, lifecycles.loadError).forEach(function(_ref2) {
              var src2 = _ref2.src, ignore = _ref2.ignore, contentPromise = _ref2.contentPromise;
              return contentPromise.then(function(content2) {
                var rawAttrs = parseTagAttributes(element2.outerHTML);
                if (ignore && src2) {
                  rawDOMAppendOrInsertBefore.call(_this5, element2, refChild);
                } else {
                  var stylesheetElement2 = iframeDocument.createElement("style");
                  var cssLoader2 = getCssLoader({
                    plugins,
                    replace
                  });
                  stylesheetElement2.innerHTML = cssLoader2(content2, src2, curUrl);
                  styleSheetElements.push(stylesheetElement2);
                  setAttrsToElement(stylesheetElement2, rawAttrs);
                  rawDOMAppendOrInsertBefore.call(_this5, stylesheetElement2, refChild);
                  handleStylesheetElementPatch(stylesheetElement2, sandbox);
                  manualInvokeElementEvent(element2, "load");
                }
                element2 = null;
              }, function() {
                manualInvokeElementEvent(element2, "error");
                element2 = null;
              });
            });
          }
          var comment = iframeDocument.createComment("dynamic link ".concat(href, " replaced by wujie"));
          return rawDOMAppendOrInsertBefore.call(this, comment, refChild);
        }
        case "STYLE": {
          var stylesheetElement = newChild;
          styleSheetElements.push(stylesheetElement);
          var content = stylesheetElement.innerHTML;
          var cssLoader = getCssLoader({
            plugins,
            replace
          });
          content && (stylesheetElement.innerHTML = cssLoader(content, "", curUrl));
          var _res2 = rawDOMAppendOrInsertBefore.call(this, element2, refChild);
          patchStylesheetElement(stylesheetElement, cssLoader, sandbox, curUrl);
          handleStylesheetElementPatch(stylesheetElement, sandbox);
          execHooks(plugins, "appendOrInsertElementHook", element2, iframe.contentWindow);
          return _res2;
        }
        case "SCRIPT": {
          setTagToScript(element2);
          var _ref3 = element2, src = _ref3.src, text2 = _ref3.text, _type = _ref3.type, crossOrigin = _ref3.crossOrigin;
          if (src && !isMatchUrl(src, getEffectLoaders("jsExcludes", plugins))) {
            var execScript = function execScript2(scriptResult) {
              if (sandbox.iframe === null) return warn(WUJIE_TIPS_REPEAT_RENDER);
              var onload = function onload2() {
                manualInvokeElementEvent(element2, "load");
                element2 = null;
              };
              insertScriptToIframe(_objectSpread$4(_objectSpread$4({}, scriptResult), {}, {
                onload
              }), sandbox.iframe.contentWindow, element2);
            };
            var scriptOptions = {
              src,
              module: _type === "module",
              crossorigin: crossOrigin !== null,
              crossoriginType: crossOrigin || "",
              ignore: isMatchUrl(src, getEffectLoaders("jsIgnores", plugins)),
              attrs: parseTagAttributes(element2.outerHTML)
            };
            _getExternalScripts([scriptOptions], fetch2, lifecycles.loadError, fiber).forEach(function(scriptResult) {
              dynamicScriptExecStack = dynamicScriptExecStack.then(function() {
                return scriptResult.contentPromise.then(function(content2) {
                  var _sandbox$execQueue;
                  if (sandbox.execQueue === null) return warn(WUJIE_TIPS_REPEAT_RENDER);
                  var execQueueLength2 = (_sandbox$execQueue = sandbox.execQueue) === null || _sandbox$execQueue === void 0 ? void 0 : _sandbox$execQueue.length;
                  sandbox.execQueue.push(function() {
                    return fiber ? sandbox.requestIdleCallback(function() {
                      execScript(_objectSpread$4(_objectSpread$4({}, scriptResult), {}, {
                        content: content2
                      }));
                    }) : execScript(_objectSpread$4(_objectSpread$4({}, scriptResult), {}, {
                      content: content2
                    }));
                  });
                  if (!execQueueLength2) sandbox.execQueue.shift()();
                }, function() {
                  manualInvokeElementEvent(element2, "error");
                  element2 = null;
                });
              });
            });
          } else {
            var _sandbox$execQueue2;
            var execQueueLength = (_sandbox$execQueue2 = sandbox.execQueue) === null || _sandbox$execQueue2 === void 0 ? void 0 : _sandbox$execQueue2.length;
            sandbox.execQueue.push(function() {
              return fiber ? sandbox.requestIdleCallback(function() {
                insertScriptToIframe({
                  src: null,
                  content: text2,
                  attrs: parseTagAttributes(element2.outerHTML)
                }, sandbox.iframe.contentWindow, element2);
              }) : insertScriptToIframe({
                src: null,
                content: text2,
                attrs: parseTagAttributes(element2.outerHTML)
              }, sandbox.iframe.contentWindow, element2);
            });
            if (!execQueueLength) sandbox.execQueue.shift()();
          }
          var _comment = iframeDocument.createComment("dynamic script ".concat(src, " replaced by wujie"));
          return rawDOMAppendOrInsertBefore.call(this, _comment, refChild);
        }
        case "IFRAME": {
          if (element2.getAttribute(WUJIE_DATA_FLAG) === "") {
            return rawAppendChild.call(rawDocumentQuerySelector.call(this.ownerDocument, "html"), element2);
          }
          var _res3 = rawDOMAppendOrInsertBefore.call(this, element2, refChild);
          execHooks(plugins, "appendOrInsertElementHook", element2, iframe.contentWindow);
          return _res3;
        }
      }
    }
  };
}
function findScriptElementFromIframe(rawElement, wujieId) {
  var wujieTag = getTagFromScript(rawElement);
  var sandbox = getWujieById(wujieId);
  var iframe = sandbox.iframe;
  var targetScript = iframe.contentWindow.__WUJIE_RAW_DOCUMENT_HEAD__.querySelector("script[".concat(WUJIE_SCRIPT_ID, "='").concat(wujieTag, "']"));
  if (targetScript === null) {
    warn(WUJIE_TIPS_NO_SCRIPT, "<script ".concat(WUJIE_SCRIPT_ID, "='").concat(wujieTag, "'/>"));
  }
  return {
    targetScript,
    iframe
  };
}
function rewriteContains(opts) {
  return function contains3(other) {
    var element2 = other;
    var rawElementContains2 = opts.rawElementContains, wujieId = opts.wujieId;
    if (element2 && isScriptElement(element2)) {
      var _findScriptElementFro = findScriptElementFromIframe(element2, wujieId), targetScript = _findScriptElementFro.targetScript;
      return targetScript !== null;
    }
    return rawElementContains2(element2);
  };
}
function rewriteRemoveChild(opts) {
  return function removeChild(child) {
    var element2 = child;
    var rawElementRemoveChild2 = opts.rawElementRemoveChild, wujieId = opts.wujieId;
    if (element2 && isScriptElement(element2)) {
      var _findScriptElementFro2 = findScriptElementFromIframe(element2, wujieId), targetScript = _findScriptElementFro2.targetScript, iframe = _findScriptElementFro2.iframe;
      if (targetScript !== null) {
        return iframe.contentWindow.__WUJIE_RAW_DOCUMENT_HEAD__.removeChild(targetScript);
      }
      return null;
    }
    return rawElementRemoveChild2(element2);
  };
}
function patchEventListener(element2) {
  var listenerMap = /* @__PURE__ */ new Map();
  element2._cacheListeners = listenerMap;
  element2.addEventListener = function(type3, listener, options) {
    var listeners = listenerMap.get(type3) || [];
    listenerMap.set(type3, [].concat(_toConsumableArray(listeners), [listener]));
    return rawAddEventListener.call(element2, type3, listener, options);
  };
  element2.removeEventListener = function(type3, listener, options) {
    var typeListeners = listenerMap.get(type3);
    var index = typeListeners === null || typeListeners === void 0 ? void 0 : typeListeners.indexOf(listener);
    if (typeListeners !== null && typeListeners !== void 0 && typeListeners.length && index !== -1) {
      typeListeners.splice(index, 1);
    }
    return rawRemoveEventListener.call(element2, type3, listener, options);
  };
}
function removeEventListener(element2) {
  var listenerMap = element2._cacheListeners;
  _toConsumableArray(listenerMap.entries()).forEach(function(_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2), type3 = _ref5[0], listeners = _ref5[1];
    listeners.forEach(function(listener) {
      return rawRemoveEventListener.call(element2, type3, listener);
    });
  });
}
function patchRenderEffect(render, id, degrade) {
  if (!degrade) {
    patchEventListener(render.head);
    patchEventListener(render.body);
  }
  render.head.appendChild = rewriteAppendOrInsertChild({
    rawDOMAppendOrInsertBefore: rawAppendChild,
    wujieId: id
  });
  render.head.insertBefore = rewriteAppendOrInsertChild({
    rawDOMAppendOrInsertBefore: rawHeadInsertBefore,
    wujieId: id
  });
  render.head.removeChild = rewriteRemoveChild({
    rawElementRemoveChild: rawElementRemoveChild.bind(render.head),
    wujieId: id
  });
  render.head.contains = rewriteContains({
    rawElementContains: rawElementContains.bind(render.head),
    wujieId: id
  });
  render.contains = rewriteContains({
    rawElementContains: rawElementContains.bind(render),
    wujieId: id
  });
  render.body.appendChild = rewriteAppendOrInsertChild({
    rawDOMAppendOrInsertBefore: rawAppendChild,
    wujieId: id
  });
  render.body.insertBefore = rewriteAppendOrInsertChild({
    rawDOMAppendOrInsertBefore: rawBodyInsertBefore,
    wujieId: id
  });
}
function ownKeys$3(e, r2) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r2 && (o = o.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e, r3).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$3(e) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$3(Object(t), true).forEach(function(r3) {
      _defineProperty(e, r3, t[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r3) {
      Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
    });
  }
  return e;
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
var cssSelectorMap = {
  ":root": ":host"
};
function defineWujieWebComponent() {
  var customElements = window.customElements;
  if (customElements && !(customElements !== null && customElements !== void 0 && customElements.get("wujie-app"))) {
    var WujieApp = /* @__PURE__ */ function(_HTMLElement) {
      _inherits(WujieApp2, _HTMLElement);
      var _super = _createSuper(WujieApp2);
      function WujieApp2() {
        _classCallCheck(this, WujieApp2);
        return _super.apply(this, arguments);
      }
      _createClass(WujieApp2, [{
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
      return WujieApp2;
    }(/* @__PURE__ */ _wrapNativeSuper(HTMLElement));
    customElements === null || customElements === void 0 || customElements.define("wujie-app", WujieApp);
  }
}
function createWujieWebComponent(id) {
  var contentElement = window.document.createElement("wujie-app");
  contentElement.setAttribute(WUJIE_APP_ID, id);
  contentElement.classList.add(WUJIE_IFRAME_CLASS);
  return contentElement;
}
function renderElementToContainer(element2, selectorOrElement) {
  var container = getContainer(selectorOrElement);
  if (container && !container.contains(element2)) {
    if (!container.querySelector("div[".concat(LOADING_DATA_FLAG, "]"))) {
      clearChild(container);
    }
    if (element2) {
      rawElementAppendChild.call(container, element2);
    }
  }
  return container;
}
function initRenderIframeAndContainer(id, parent) {
  var degradeAttrs = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var iframe = createIframeContainer(id, degradeAttrs);
  var container = renderElementToContainer(iframe, parent);
  var contentDocument = iframe.contentWindow.document;
  contentDocument.open();
  contentDocument.write("<!DOCTYPE html><html><head></head><body></body></html>");
  contentDocument.close();
  return {
    iframe,
    container
  };
}
function processCssLoaderForTemplate(_x, _x2) {
  return _processCssLoaderForTemplate.apply(this, arguments);
}
function _processCssLoaderForTemplate() {
  _processCssLoaderForTemplate = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime.mark(function _callee(sandbox, html) {
    var document2, plugins, replace, proxyLocation, cssLoader, cssBeforeLoaders, cssAfterLoaders, curUrl;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          document2 = sandbox.iframe.contentDocument;
          plugins = sandbox.plugins, replace = sandbox.replace, proxyLocation = sandbox.proxyLocation;
          cssLoader = getCssLoader({
            plugins,
            replace
          });
          cssBeforeLoaders = getPresetLoaders("cssBeforeLoaders", plugins);
          cssAfterLoaders = getPresetLoaders("cssAfterLoaders", plugins);
          curUrl = getCurUrl(proxyLocation);
          _context.next = 8;
          return Promise.all([Promise.all(_getExternalStyleSheets(cssBeforeLoaders, sandbox.fetch, sandbox.lifecycles.loadError).map(function(_ref) {
            var src = _ref.src, contentPromise = _ref.contentPromise;
            return contentPromise.then(function(content) {
              return {
                src,
                content
              };
            });
          })).then(function(contentList) {
            contentList.forEach(function(_ref2) {
              var src = _ref2.src, content = _ref2.content;
              if (!content) return;
              var styleElement = document2.createElement("style");
              styleElement.setAttribute("type", "text/css");
              styleElement.appendChild(document2.createTextNode(content ? cssLoader(content, src, curUrl) : content));
              var head = html.querySelector("head");
              var body = html.querySelector("body");
              html.insertBefore(styleElement, head || body || html.firstChild);
            });
          }), Promise.all(_getExternalStyleSheets(cssAfterLoaders, sandbox.fetch, sandbox.lifecycles.loadError).map(function(_ref3) {
            var src = _ref3.src, contentPromise = _ref3.contentPromise;
            return contentPromise.then(function(content) {
              return {
                src,
                content
              };
            });
          })).then(function(contentList) {
            contentList.forEach(function(_ref4) {
              var src = _ref4.src, content = _ref4.content;
              if (!content) return;
              var styleElement = document2.createElement("style");
              styleElement.setAttribute("type", "text/css");
              styleElement.appendChild(document2.createTextNode(content ? cssLoader(content, src, curUrl) : content));
              html.appendChild(styleElement);
            });
          })]).then(function() {
            return html;
          }, function() {
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
function renderTemplateToHtml(iframeWindow, template) {
  var sandbox = iframeWindow.__WUJIE;
  var head = sandbox.head, body = sandbox.body, alive = sandbox.alive, execFlag = sandbox.execFlag;
  var document2 = iframeWindow.document;
  var html = document2.createElement("html");
  html.innerHTML = template;
  if (!alive && execFlag) {
    html = replaceHeadAndBody(html, head, body);
  } else {
    sandbox.head = html.querySelector("head");
    sandbox.body = html.querySelector("body");
  }
  var ElementIterator = document2.createTreeWalker(html, NodeFilter.SHOW_ELEMENT, null, false);
  var nextElement = ElementIterator.currentNode;
  while (nextElement) {
    patchElementEffect(nextElement, iframeWindow);
    var relativeAttr = relativeElementTagAttrMap[nextElement.tagName];
    var url = nextElement[relativeAttr];
    if (relativeAttr) nextElement.setAttribute(relativeAttr, getAbsolutePath(url, nextElement.baseURI || ""));
    nextElement = ElementIterator.nextNode();
  }
  if (!html.querySelector("head")) {
    var _head = document2.createElement("head");
    html.appendChild(_head);
  }
  if (!html.querySelector("body")) {
    var _body = document2.createElement("body");
    html.appendChild(_body);
  }
  return html;
}
function renderTemplateToShadowRoot(_x3, _x4, _x5) {
  return _renderTemplateToShadowRoot.apply(this, arguments);
}
function _renderTemplateToShadowRoot() {
  _renderTemplateToShadowRoot = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime.mark(function _callee2(shadowRoot, iframeWindow, template) {
    var html, processedHtml, shade;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          html = renderTemplateToHtml(iframeWindow, template);
          _context2.next = 3;
          return processCssLoaderForTemplate(iframeWindow.__WUJIE, html);
        case 3:
          processedHtml = _context2.sent;
          shadowRoot.appendChild(processedHtml);
          shade = document.createElement("div");
          shade.setAttribute("style", WUJIE_SHADE_STYLE);
          processedHtml.insertBefore(shade, processedHtml.firstChild);
          shadowRoot.head = shadowRoot.querySelector("head");
          shadowRoot.body = shadowRoot.querySelector("body");
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
function createIframeContainer(id) {
  var degradeAttrs = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var iframe = document.createElement("iframe");
  var defaultStyle = "height:100%;width:100%";
  setAttrsToElement(iframe, _objectSpread$3(_objectSpread$3({}, degradeAttrs), {}, _defineProperty({
    style: [defaultStyle, degradeAttrs.style].join(";")
  }, WUJIE_APP_ID, id)));
  return iframe;
}
function renderTemplateToIframe(_x6, _x7, _x8) {
  return _renderTemplateToIframe.apply(this, arguments);
}
function _renderTemplateToIframe() {
  _renderTemplateToIframe = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime.mark(function _callee3(renderDocument, iframeWindow, template) {
    var html, processedHtml;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          html = renderTemplateToHtml(iframeWindow, template);
          _context3.next = 3;
          return processCssLoaderForTemplate(iframeWindow.__WUJIE, html);
        case 3:
          processedHtml = _context3.sent;
          renderDocument.replaceChild(processedHtml, renderDocument.documentElement);
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
function clearChild(root) {
  while (root !== null && root !== void 0 && root.firstChild) {
    rawElementRemoveChild.call(root, root.firstChild);
  }
}
function addLoading(el, loading) {
  var container = getContainer(el);
  clearChild(container);
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
  if (loading) loadingContainer.appendChild(loading);
  else loadingContainer.innerHTML = WUJIE_LOADING_SVG;
  container.appendChild(loadingContainer);
}
function removeLoading(el) {
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
function getPatchStyleElements(rootStyleSheets) {
  var rootCssRules = [];
  var fontCssRules = [];
  var rootStyleReg = /:root/g;
  for (var i = 0; i < rootStyleSheets.length; i++) {
    var _rootStyleSheets$i$cs, _rootStyleSheets$i;
    var cssRules = (_rootStyleSheets$i$cs = (_rootStyleSheets$i = rootStyleSheets[i]) === null || _rootStyleSheets$i === void 0 ? void 0 : _rootStyleSheets$i.cssRules) !== null && _rootStyleSheets$i$cs !== void 0 ? _rootStyleSheets$i$cs : [];
    for (var j = 0; j < cssRules.length; j++) {
      var cssRuleText = cssRules[j].cssText;
      if (rootStyleReg.test(cssRuleText)) {
        rootCssRules.push(cssRuleText.replace(rootStyleReg, function(match) {
          return cssSelectorMap[match];
        }));
      }
      if (cssRules[j].type === CSSRule.FONT_FACE_RULE) {
        fontCssRules.push(cssRuleText);
      }
    }
  }
  var rootStyleSheetElement = null;
  var fontStyleSheetElement = null;
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
function syncUrlToWindow(iframeWindow) {
  var _iframeWindow$__WUJIE = iframeWindow.__WUJIE, sync = _iframeWindow$__WUJIE.sync, id = _iframeWindow$__WUJIE.id, prefix = _iframeWindow$__WUJIE.prefix;
  var winUrlElement = anchorElementGenerator(window.location.href);
  var queryMap = getAnchorElementQueryMap(winUrlElement);
  if (!sync && !queryMap[id]) return winUrlElement = null;
  var curUrl = iframeWindow.location.pathname + iframeWindow.location.search + iframeWindow.location.hash;
  var validShortPath = "";
  if (prefix) {
    Object.keys(prefix).forEach(function(shortPath) {
      var longPath = prefix[shortPath];
      if (curUrl.startsWith(longPath) && (!validShortPath || longPath.length > prefix[validShortPath].length)) {
        validShortPath = shortPath;
      }
    });
  }
  if (sync) {
    queryMap[id] = window.encodeURIComponent(validShortPath ? curUrl.replace(prefix[validShortPath], "{".concat(validShortPath, "}")) : curUrl);
  } else {
    delete queryMap[id];
  }
  var newQuery = "?" + Object.keys(queryMap).map(function(key) {
    return key + "=" + queryMap[key];
  }).join("&");
  winUrlElement.search = newQuery;
  if (winUrlElement.href !== window.location.href) {
    window.history.replaceState(null, "", winUrlElement.href);
  }
  winUrlElement = null;
}
function syncUrlToIframe(iframeWindow) {
  var _iframeWindow$locatio = iframeWindow.location, pathname = _iframeWindow$locatio.pathname, search = _iframeWindow$locatio.search, hash2 = _iframeWindow$locatio.hash;
  var _iframeWindow$__WUJIE2 = iframeWindow.__WUJIE, id = _iframeWindow$__WUJIE2.id, url = _iframeWindow$__WUJIE2.url, sync = _iframeWindow$__WUJIE2.sync, execFlag = _iframeWindow$__WUJIE2.execFlag, prefix = _iframeWindow$__WUJIE2.prefix, inject = _iframeWindow$__WUJIE2.inject;
  var idUrl = sync && !execFlag ? getSyncUrl(id, prefix) : url;
  var syncUrl = (/^http/.test(idUrl) ? null : idUrl) || url;
  var _appRouteParse = appRouteParse(syncUrl), appRoutePath = _appRouteParse.appRoutePath;
  var preAppRoutePath = pathname + search + hash2;
  if (preAppRoutePath !== appRoutePath) {
    iframeWindow.history.replaceState(null, "", inject.mainHostPath + appRoutePath);
  }
}
function clearInactiveAppUrl() {
  var winUrlElement = anchorElementGenerator(window.location.href);
  var queryMap = getAnchorElementQueryMap(winUrlElement);
  Object.keys(queryMap).forEach(function(id) {
    var sandbox = getWujieById(id);
    if (!sandbox) return;
    if (sandbox.execFlag && sandbox.sync && !sandbox.hrefFlag && !sandbox.activeFlag) {
      delete queryMap[id];
    }
  });
  var newQuery = "?" + Object.keys(queryMap).map(function(key) {
    return key + "=" + queryMap[key];
  }).join("&");
  winUrlElement.search = newQuery;
  if (winUrlElement.href !== window.location.href) {
    window.history.replaceState(null, "", winUrlElement.href);
  }
  winUrlElement = null;
}
function pushUrlToWindow(id, url) {
  var winUrlElement = anchorElementGenerator(window.location.href);
  var queryMap = getAnchorElementQueryMap(winUrlElement);
  queryMap[id] = window.encodeURIComponent(url);
  var newQuery = "?" + Object.keys(queryMap).map(function(key) {
    return key + "=" + queryMap[key];
  }).join("&");
  winUrlElement.search = newQuery;
  window.history.pushState(null, "", winUrlElement.href);
  winUrlElement = null;
}
function processAppForHrefJump() {
  window.addEventListener("popstate", function() {
    var winUrlElement = anchorElementGenerator(window.location.href);
    var queryMap = getAnchorElementQueryMap(winUrlElement);
    winUrlElement = null;
    Object.keys(queryMap).map(function(id) {
      return getWujieById(id);
    }).filter(function(sandbox) {
      return sandbox;
    }).forEach(function(sandbox) {
      var url = queryMap[sandbox.id];
      var iframeBody = rawDocumentQuerySelector.call(sandbox.iframe.contentDocument, "body");
      if (/http/.test(url)) {
        if (sandbox.degrade) {
          renderElementToContainer(sandbox.document.documentElement, iframeBody);
          renderIframeReplaceApp(window.decodeURIComponent(url), getDegradeIframe(sandbox.id).parentElement, sandbox.degradeAttrs);
        } else renderIframeReplaceApp(window.decodeURIComponent(url), sandbox.shadowRoot.host.parentElement, sandbox.degradeAttrs);
        sandbox.hrefFlag = true;
      } else if (sandbox.hrefFlag) {
        if (sandbox.degrade) {
          var _initRenderIframeAndC = initRenderIframeAndContainer(sandbox.id, sandbox.el, sandbox.degradeAttrs), iframe = _initRenderIframeAndC.iframe;
          patchEventTimeStamp(iframe.contentWindow, sandbox.iframe.contentWindow);
          iframe.contentWindow.onunload = function() {
            sandbox.unmount();
          };
          iframe.contentDocument.appendChild(iframeBody.firstElementChild);
          sandbox.document = iframe.contentDocument;
        } else renderElementToContainer(sandbox.shadowRoot.host, sandbox.el);
        sandbox.hrefFlag = false;
      }
    });
  });
}
function ownKeys$2(e, r2) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r2 && (o = o.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e, r3).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$2(e) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$2(Object(t), true).forEach(function(r3) {
      _defineProperty(e, r3, t[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r3) {
      Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
    });
  }
  return e;
}
function patchIframeEvents(iframeWindow) {
  iframeWindow.__WUJIE_EVENTLISTENER__ = iframeWindow.__WUJIE_EVENTLISTENER__ || /* @__PURE__ */ new Set();
  iframeWindow.addEventListener = function addEventListener(type3, listener, options) {
    execHooks(iframeWindow.__WUJIE.plugins, "windowAddEventListenerHook", iframeWindow, type3, listener, options);
    iframeWindow.__WUJIE_EVENTLISTENER__.add({
      type: type3,
      listener,
      options
    });
    if (appWindowAddEventListenerEvents.includes(type3) || _typeof$1(options) === "object" && options.targetWindow) {
      var targetWindow = _typeof$1(options) === "object" && options.targetWindow ? options === null || options === void 0 ? void 0 : options.targetWindow : iframeWindow;
      return rawWindowAddEventListener.call(targetWindow, type3, listener, options);
    }
    rawWindowAddEventListener.call(window.__WUJIE_RAW_WINDOW__ || window, type3, listener, options);
  };
  iframeWindow.removeEventListener = function removeEventListener2(type3, listener, options) {
    execHooks(iframeWindow.__WUJIE.plugins, "windowRemoveEventListenerHook", iframeWindow, type3, listener, options);
    iframeWindow.__WUJIE_EVENTLISTENER__.forEach(function(o) {
      if (o.listener === listener && o.type === type3 && options == o.options) {
        iframeWindow.__WUJIE_EVENTLISTENER__["delete"](o);
      }
    });
    if (appWindowAddEventListenerEvents.includes(type3) || _typeof$1(options) === "object" && options.targetWindow) {
      var targetWindow = _typeof$1(options) === "object" && options.targetWindow ? options === null || options === void 0 ? void 0 : options.targetWindow : iframeWindow;
      return rawWindowRemoveEventListener.call(targetWindow, type3, listener, options);
    }
    rawWindowRemoveEventListener.call(window.__WUJIE_RAW_WINDOW__ || window, type3, listener, options);
  };
}
function patchIframeVariable(iframeWindow, wujie, appHostPath) {
  iframeWindow.__WUJIE = wujie;
  iframeWindow.__WUJIE_PUBLIC_PATH__ = appHostPath + "/";
  iframeWindow.$wujie = wujie.provide;
  iframeWindow.__WUJIE_RAW_WINDOW__ = iframeWindow;
}
function patchIframeHistory(iframeWindow, appHostPath, mainHostPath) {
  var history2 = iframeWindow.history;
  var rawHistoryPushState = history2.pushState;
  var rawHistoryReplaceState = history2.replaceState;
  history2.pushState = function(data, title, url) {
    var baseUrl = mainHostPath + iframeWindow.location.pathname + iframeWindow.location.search + iframeWindow.location.hash;
    var mainUrl = getAbsolutePath(url === null || url === void 0 ? void 0 : url.replace(appHostPath, ""), baseUrl);
    var ignoreFlag = url === void 0;
    rawHistoryPushState.call(history2, data, title, ignoreFlag ? void 0 : mainUrl);
    if (ignoreFlag) return;
    updateBase(iframeWindow, appHostPath, mainHostPath);
    syncUrlToWindow(iframeWindow);
  };
  history2.replaceState = function(data, title, url) {
    var baseUrl = mainHostPath + iframeWindow.location.pathname + iframeWindow.location.search + iframeWindow.location.hash;
    var mainUrl = getAbsolutePath(url === null || url === void 0 ? void 0 : url.replace(appHostPath, ""), baseUrl);
    var ignoreFlag = url === void 0;
    rawHistoryReplaceState.call(history2, data, title, ignoreFlag ? void 0 : mainUrl);
    if (ignoreFlag) return;
    updateBase(iframeWindow, appHostPath, mainHostPath);
    syncUrlToWindow(iframeWindow);
  };
}
function updateBase(iframeWindow, appHostPath, mainHostPath) {
  var _iframeWindow$locatio;
  var baseUrl = new URL((_iframeWindow$locatio = iframeWindow.location.href) === null || _iframeWindow$locatio === void 0 ? void 0 : _iframeWindow$locatio.replace(mainHostPath, ""), appHostPath);
  var baseElement = rawDocumentQuerySelector.call(iframeWindow.document, "base");
  if (baseElement) baseElement.setAttribute("href", appHostPath + baseUrl.pathname);
}
function patchWindowEffect(iframeWindow) {
  function processWindowProperty(key) {
    var value = iframeWindow[key];
    try {
      if (typeof value === "function" && !isConstructable(value)) {
        iframeWindow[key] = window[key].bind(window);
      } else {
        iframeWindow[key] = window[key];
      }
      return true;
    } catch (e) {
      warn(e.message);
      return false;
    }
  }
  Object.getOwnPropertyNames(iframeWindow).forEach(function(key) {
    if (key === "getSelection") {
      Object.defineProperty(iframeWindow, key, {
        get: function get() {
          return iframeWindow.document[key];
        }
      });
      return;
    }
    if (windowProxyProperties.includes(key)) {
      processWindowProperty(key);
      return;
    }
    windowRegWhiteList.some(function(reg) {
      if (reg.test(key) && key in iframeWindow.parent) {
        return processWindowProperty(key);
      }
      return false;
    });
  });
  var windowOnEvents = Object.getOwnPropertyNames(window).filter(function(p) {
    return /^on/.test(p);
  }).filter(function(e) {
    return !appWindowOnEvent.includes(e);
  });
  windowOnEvents.forEach(function(e) {
    var descriptor = Object.getOwnPropertyDescriptor(iframeWindow, e) || {
      enumerable: true,
      writable: true
    };
    try {
      Object.defineProperty(iframeWindow, e, {
        enumerable: descriptor.enumerable,
        configurable: true,
        get: function get() {
          return window[e];
        },
        set: descriptor.writable || descriptor.set ? function(handler) {
          window[e] = typeof handler === "function" ? handler.bind(iframeWindow) : handler;
        } : void 0
      });
    } catch (e2) {
      warn(e2.message);
    }
  });
  execHooks(iframeWindow.__WUJIE.plugins, "windowPropertyOverride", iframeWindow);
}
function recordEventListeners(iframeWindow) {
  var sandbox = iframeWindow.__WUJIE;
  iframeWindow.Node.prototype.addEventListener = function(type3, handler, options) {
    var elementListenerList = sandbox.elementEventCacheMap.get(this);
    if (elementListenerList) {
      if (!elementListenerList.find(function(listener) {
        return listener.type === type3 && listener.handler === handler;
      })) {
        elementListenerList.push({
          type: type3,
          handler,
          options
        });
      }
    } else sandbox.elementEventCacheMap.set(this, [{
      type: type3,
      handler,
      options
    }]);
    return rawAddEventListener.call(this, type3, handler, options);
  };
  iframeWindow.Node.prototype.removeEventListener = function(type3, handler, options) {
    var elementListenerList = sandbox.elementEventCacheMap.get(this);
    if (elementListenerList) {
      var index = elementListenerList === null || elementListenerList === void 0 ? void 0 : elementListenerList.findIndex(function(ele) {
        return ele.type === type3 && ele.handler === handler;
      });
      elementListenerList.splice(index, 1);
    }
    if (!(elementListenerList !== null && elementListenerList !== void 0 && elementListenerList.length)) {
      sandbox.elementEventCacheMap["delete"](this);
    }
    return rawRemoveEventListener.call(this, type3, handler, options);
  };
}
function recoverEventListeners(rootElement, iframeWindow) {
  var sandbox = iframeWindow.__WUJIE;
  var elementEventCacheMap = /* @__PURE__ */ new WeakMap();
  var ElementIterator = document.createTreeWalker(rootElement, NodeFilter.SHOW_ELEMENT, null, false);
  var nextElement = ElementIterator.currentNode;
  while (nextElement) {
    var elementListenerList = sandbox.elementEventCacheMap.get(nextElement);
    if (elementListenerList !== null && elementListenerList !== void 0 && elementListenerList.length) {
      elementEventCacheMap.set(nextElement, elementListenerList);
      elementListenerList.forEach(function(listener) {
        nextElement.addEventListener(listener.type, listener.handler, listener.options);
      });
    }
    nextElement = ElementIterator.nextNode();
  }
  sandbox.elementEventCacheMap = elementEventCacheMap;
}
function recoverDocumentListeners(oldRootElement, newRootElement, iframeWindow) {
  var sandbox = iframeWindow.__WUJIE;
  var elementEventCacheMap = /* @__PURE__ */ new WeakMap();
  var elementListenerList = sandbox.elementEventCacheMap.get(oldRootElement);
  if (elementListenerList !== null && elementListenerList !== void 0 && elementListenerList.length) {
    elementEventCacheMap.set(newRootElement, elementListenerList);
    elementListenerList.forEach(function(listener) {
      newRootElement.addEventListener(listener.type, listener.handler, listener.options);
    });
  }
  sandbox.elementEventCacheMap = elementEventCacheMap;
}
function patchEventTimeStamp(targetWindow, iframeWindow) {
  Object.defineProperty(targetWindow.Event.prototype, "timeStamp", {
    get: function get() {
      return iframeWindow.document.createEvent("Event").timeStamp;
    }
  });
}
function patchDocumentEffect(iframeWindow) {
  var sandbox = iframeWindow.__WUJIE;
  var handlerCallbackMap = /* @__PURE__ */ new WeakMap();
  var handlerTypeMap = /* @__PURE__ */ new WeakMap();
  iframeWindow.Document.prototype.addEventListener = function(type3, handler, options) {
    if (!handler) return;
    var callback = handlerCallbackMap.get(handler);
    var typeList = handlerTypeMap.get(handler);
    if (!callback) {
      callback = typeof handler === "function" ? handler.bind(this) : handler;
      handlerCallbackMap.set(handler, callback);
    }
    if (typeList) {
      if (!typeList.includes(type3)) typeList.push(type3);
    } else {
      handlerTypeMap.set(handler, [type3]);
    }
    execHooks(iframeWindow.__WUJIE.plugins, "documentAddEventListenerHook", iframeWindow, type3, callback, options);
    if (appDocumentAddEventListenerEvents.includes(type3)) {
      return rawAddEventListener.call(this, type3, callback, options);
    }
    if (sandbox.degrade) return sandbox.document.addEventListener(type3, callback, options);
    if (mainDocumentAddEventListenerEvents.includes(type3)) return window.document.addEventListener(type3, callback, options);
    if (mainAndAppAddEventListenerEvents.includes(type3)) {
      window.document.addEventListener(type3, callback, options);
      sandbox.shadowRoot.addEventListener(type3, callback, options);
      return;
    }
    sandbox.shadowRoot.addEventListener(type3, callback, options);
  };
  iframeWindow.Document.prototype.removeEventListener = function(type3, handler, options) {
    var callback = handlerCallbackMap.get(handler);
    var typeList = handlerTypeMap.get(handler);
    if (callback) {
      if (typeList !== null && typeList !== void 0 && typeList.includes(type3)) {
        typeList.splice(typeList.indexOf(type3), 1);
        if (!typeList.length) {
          handlerCallbackMap["delete"](handler);
          handlerTypeMap["delete"](handler);
        }
      }
      execHooks(iframeWindow.__WUJIE.plugins, "documentRemoveEventListenerHook", iframeWindow, type3, callback, options);
      if (appDocumentAddEventListenerEvents.includes(type3)) {
        return rawRemoveEventListener.call(this, type3, callback, options);
      }
      if (sandbox.degrade) return sandbox.document.removeEventListener(type3, callback, options);
      if (mainDocumentAddEventListenerEvents.includes(type3)) {
        return window.document.removeEventListener(type3, callback, options);
      }
      if (mainAndAppAddEventListenerEvents.includes(type3)) {
        window.document.removeEventListener(type3, callback, options);
        sandbox.shadowRoot.removeEventListener(type3, callback, options);
        return;
      }
      sandbox.shadowRoot.removeEventListener(type3, callback, options);
    }
  };
  var elementOnEvents = Object.keys(iframeWindow.HTMLElement.prototype).filter(function(ele) {
    return /^on/.test(ele);
  });
  var documentOnEvent = Object.keys(iframeWindow.Document.prototype).filter(function(ele) {
    return /^on/.test(ele);
  }).filter(function(ele) {
    return !appDocumentOnEvents.includes(ele);
  });
  elementOnEvents.filter(function(e) {
    return documentOnEvent.includes(e);
  }).forEach(function(e) {
    var descriptor = Object.getOwnPropertyDescriptor(iframeWindow.Document.prototype, e) || {
      enumerable: true,
      writable: true
    };
    try {
      Object.defineProperty(iframeWindow.Document.prototype, e, {
        enumerable: descriptor.enumerable,
        configurable: true,
        get: function get() {
          return sandbox.degrade ? sandbox.document[e] : sandbox.shadowRoot.firstElementChild[e];
        },
        set: descriptor.writable || descriptor.set ? function(handler) {
          var val = typeof handler === "function" ? handler.bind(iframeWindow.document) : handler;
          sandbox.degrade ? sandbox.document[e] = val : sandbox.shadowRoot.firstElementChild[e] = val;
        } : void 0
      });
    } catch (e2) {
      warn(e2.message);
    }
  });
  var ownerProperties = documentProxyProperties.ownerProperties, modifyProperties = documentProxyProperties.modifyProperties, shadowProperties = documentProxyProperties.shadowProperties, shadowMethods = documentProxyProperties.shadowMethods, documentProperties = documentProxyProperties.documentProperties, documentMethods = documentProxyProperties.documentMethods, documentEvents = documentProxyProperties.documentEvents;
  modifyProperties.concat(shadowProperties, shadowMethods, documentProperties, documentMethods).forEach(function(propKey) {
    var descriptor = Object.getOwnPropertyDescriptor(iframeWindow.Document.prototype, propKey) || {
      enumerable: true,
      writable: true
    };
    try {
      Object.defineProperty(iframeWindow.Document.prototype, propKey, {
        enumerable: descriptor.enumerable,
        configurable: true,
        get: function get() {
          return sandbox.proxyDocument[propKey];
        },
        set: void 0
      });
    } catch (e) {
      warn(e.message);
    }
  });
  documentEvents.forEach(function(propKey) {
    var descriptor = Object.getOwnPropertyDescriptor(iframeWindow.Document.prototype, propKey) || {
      enumerable: true,
      writable: true
    };
    try {
      Object.defineProperty(iframeWindow.Document.prototype, propKey, {
        enumerable: descriptor.enumerable,
        configurable: true,
        get: function get() {
          return (sandbox.degrade ? sandbox : window).document[propKey];
        },
        set: descriptor.writable || descriptor.set ? function(handler) {
          (sandbox.degrade ? sandbox : window).document[propKey] = typeof handler === "function" ? handler.bind(iframeWindow.document) : handler;
        } : void 0
      });
    } catch (e) {
      warn(e.message);
    }
  });
  ownerProperties.forEach(function(propKey) {
    Object.defineProperty(iframeWindow.document, propKey, {
      enumerable: true,
      configurable: true,
      get: function get() {
        return sandbox.proxyDocument[propKey];
      },
      set: void 0
    });
  });
  execHooks(iframeWindow.__WUJIE.plugins, "documentPropertyOverride", iframeWindow);
}
function patchNodeEffect(iframeWindow) {
  var rawGetRootNode = iframeWindow.Node.prototype.getRootNode;
  var rawAppendChild2 = iframeWindow.Node.prototype.appendChild;
  var rawInsertRule = iframeWindow.Node.prototype.insertBefore;
  iframeWindow.Node.prototype.getRootNode = function(options) {
    var rootNode = rawGetRootNode.call(this, options);
    if (rootNode === iframeWindow.__WUJIE.shadowRoot) return iframeWindow.document;
    else return rootNode;
  };
  iframeWindow.Node.prototype.appendChild = function(node) {
    var res = rawAppendChild2.call(this, node);
    patchElementEffect(node, iframeWindow);
    return res;
  };
  iframeWindow.Node.prototype.insertBefore = function(node, child) {
    var res = rawInsertRule.call(this, node, child);
    patchElementEffect(node, iframeWindow);
    return res;
  };
}
function patchRelativeUrlEffect(iframeWindow) {
  fixElementCtrSrcOrHref(iframeWindow, iframeWindow.HTMLImageElement, "src");
  fixElementCtrSrcOrHref(iframeWindow, iframeWindow.HTMLAnchorElement, "href");
  fixElementCtrSrcOrHref(iframeWindow, iframeWindow.HTMLSourceElement, "src");
  fixElementCtrSrcOrHref(iframeWindow, iframeWindow.HTMLLinkElement, "href");
  fixElementCtrSrcOrHref(iframeWindow, iframeWindow.HTMLScriptElement, "src");
  fixElementCtrSrcOrHref(iframeWindow, iframeWindow.HTMLMediaElement, "src");
}
function initBase(iframeWindow, url) {
  var iframeDocument = iframeWindow.document;
  var baseElement = iframeDocument.createElement("base");
  var iframeUrlElement = anchorElementGenerator(iframeWindow.location.href);
  var appUrlElement = anchorElementGenerator(url);
  baseElement.setAttribute("href", appUrlElement.protocol + "//" + appUrlElement.host + iframeUrlElement.pathname);
  iframeDocument.head.appendChild(baseElement);
}
function initIframeDom(iframeWindow, wujie, mainHostPath, appHostPath) {
  var iframeDocument = iframeWindow.document;
  var newDoc = window.document.implementation.createHTMLDocument("");
  var newDocumentElement = iframeDocument.importNode(newDoc.documentElement, true);
  iframeDocument.documentElement ? iframeDocument.replaceChild(newDocumentElement, iframeDocument.documentElement) : iframeDocument.appendChild(newDocumentElement);
  iframeWindow.__WUJIE_RAW_DOCUMENT_HEAD__ = iframeDocument.head;
  iframeWindow.__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR__ = iframeWindow.Document.prototype.querySelector;
  iframeWindow.__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR_ALL__ = iframeWindow.Document.prototype.querySelectorAll;
  iframeWindow.__WUJIE_RAW_DOCUMENT_CREATE_ELEMENT__ = iframeWindow.Document.prototype.createElement;
  iframeWindow.__WUJIE_RAW_DOCUMENT_CREATE_TEXT_NODE__ = iframeWindow.Document.prototype.createTextNode;
  initBase(iframeWindow, wujie.url);
  patchIframeHistory(iframeWindow, appHostPath, mainHostPath);
  patchIframeEvents(iframeWindow);
  if (wujie.degrade) recordEventListeners(iframeWindow);
  syncIframeUrlToWindow(iframeWindow);
  patchWindowEffect(iframeWindow);
  patchDocumentEffect(iframeWindow);
  patchNodeEffect(iframeWindow);
  patchRelativeUrlEffect(iframeWindow);
}
function stopIframeLoading(iframeWindow) {
  var oldDoc = iframeWindow.document;
  return new Promise(function(resolve) {
    function loop2() {
      setTimeout(function() {
        var newDoc;
        try {
          newDoc = iframeWindow.document;
        } catch (err) {
          newDoc = null;
        }
        if (!newDoc || newDoc == oldDoc) {
          loop2();
        } else {
          iframeWindow.stop ? iframeWindow.stop() : iframeWindow.document.execCommand("Stop");
          resolve();
        }
      }, 1);
    }
    loop2();
  });
}
function patchElementEffect(element2, iframeWindow) {
  var proxyLocation = iframeWindow.__WUJIE.proxyLocation;
  if (element2._hasPatch) return;
  try {
    Object.defineProperties(element2, {
      baseURI: {
        configurable: true,
        get: function get() {
          return proxyLocation.protocol + "//" + proxyLocation.host + proxyLocation.pathname;
        },
        set: void 0
      },
      ownerDocument: {
        configurable: true,
        get: function get() {
          return iframeWindow.document;
        }
      },
      _hasPatch: {
        get: function get() {
          return true;
        }
      }
    });
  } catch (error2) {
    console.warn(error2);
  }
  execHooks(iframeWindow.__WUJIE.plugins, "patchElementHook", element2, iframeWindow);
}
function syncIframeUrlToWindow(iframeWindow) {
  iframeWindow.addEventListener("hashchange", function() {
    return syncUrlToWindow(iframeWindow);
  });
  iframeWindow.addEventListener("popstate", function() {
    syncUrlToWindow(iframeWindow);
  });
}
function insertScriptToIframe(scriptResult, iframeWindow, rawElement) {
  var _ref = scriptResult, src = _ref.src, module = _ref.module, content = _ref.content, crossorigin = _ref.crossorigin, crossoriginType = _ref.crossoriginType, async = _ref.async, attrs = _ref.attrs, callback = _ref.callback, onload = _ref.onload;
  var scriptElement = iframeWindow.document.createElement("script");
  var nextScriptElement = iframeWindow.document.createElement("script");
  var _iframeWindow$__WUJIE = iframeWindow.__WUJIE, replace = _iframeWindow$__WUJIE.replace, plugins = _iframeWindow$__WUJIE.plugins, proxyLocation = _iframeWindow$__WUJIE.proxyLocation;
  var jsLoader = getJsLoader({
    plugins,
    replace
  });
  var code = jsLoader(content, src, getCurUrl(proxyLocation));
  attrs && Object.keys(attrs).filter(function(key) {
    return !Object.keys(scriptResult).includes(key);
  }).forEach(function(key) {
    return scriptElement.setAttribute(key, String(attrs[key]));
  });
  if (content) {
    if (!iframeWindow.__WUJIE.degrade && !module) {
      code = "(function(window, self, global, location) {\n      ".concat(code, "\n}).bind(window.__WUJIE.proxy)(\n  window.__WUJIE.proxy,\n  window.__WUJIE.proxy,\n  window.__WUJIE.proxy,\n  window.__WUJIE.proxyLocation,\n);");
    }
    var descriptor = Object.getOwnPropertyDescriptor(scriptElement, "src");
    if (descriptor !== null && descriptor !== void 0 && descriptor.configurable || !descriptor) {
      try {
        Object.defineProperty(scriptElement, "src", {
          get: function get() {
            return src || "";
          }
        });
      } catch (error2) {
        console.warn(error2);
      }
    }
  } else {
    src && scriptElement.setAttribute("src", src);
    crossorigin && scriptElement.setAttribute("crossorigin", crossoriginType);
  }
  module && scriptElement.setAttribute("type", "module");
  scriptElement.textContent = code || "";
  nextScriptElement.textContent = "if(window.__WUJIE.execQueue && window.__WUJIE.execQueue.length){ window.__WUJIE.execQueue.shift()()}";
  var container = rawDocumentQuerySelector.call(iframeWindow.document, "head");
  var execNextScript = function execNextScript2() {
    return !async && container.appendChild(nextScriptElement);
  };
  var afterExecScript = function afterExecScript2() {
    onload === null || onload === void 0 || onload();
    execNextScript();
  };
  if (/^<!DOCTYPE html/i.test(code)) {
    error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED, scriptResult);
    return execNextScript();
  }
  if (rawElement) {
    setTagToScript(scriptElement, getTagFromScript(rawElement));
  }
  var isOutlineScript = !content && src;
  if (isOutlineScript) {
    scriptElement.onload = afterExecScript;
    scriptElement.onerror = afterExecScript;
  }
  container.appendChild(scriptElement);
  callback === null || callback === void 0 || callback(iframeWindow);
  execHooks(plugins, "appendOrInsertElementHook", scriptElement, iframeWindow, rawElement);
  !isOutlineScript && afterExecScript();
}
function renderIframeReplaceApp(src, element2) {
  var degradeAttrs = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var iframe = window.document.createElement("iframe");
  var defaultStyle = "height:100%;width:100%";
  setAttrsToElement(iframe, _objectSpread$2(_objectSpread$2({}, degradeAttrs), {}, {
    src,
    style: [defaultStyle, degradeAttrs.style].join(";")
  }));
  renderElementToContainer(iframe, element2);
}
function iframeGenerator(sandbox, attrs, mainHostPath, appHostPath, appRoutePath) {
  var iframe = window.document.createElement("iframe");
  var attrsMerge = _objectSpread$2(_objectSpread$2({
    src: mainHostPath,
    style: "display: none"
  }, attrs), {}, _defineProperty({
    name: sandbox.id
  }, WUJIE_DATA_FLAG, ""));
  setAttrsToElement(iframe, attrsMerge);
  window.document.body.appendChild(iframe);
  var iframeWindow = iframe.contentWindow;
  patchIframeVariable(iframeWindow, sandbox, appHostPath);
  sandbox.iframeReady = stopIframeLoading(iframeWindow).then(function() {
    if (!iframeWindow.__WUJIE) {
      patchIframeVariable(iframeWindow, sandbox, appHostPath);
    }
    initIframeDom(iframeWindow, sandbox, mainHostPath, appHostPath);
    if (!isMatchSyncQueryById(iframeWindow.__WUJIE.id)) {
      iframeWindow.history.replaceState(null, "", mainHostPath + appRoutePath);
    }
  });
  return iframe;
}
function locationHrefSet(iframe, value, appHostPath) {
  var _iframe$contentWindow = iframe.contentWindow.__WUJIE, shadowRoot = _iframe$contentWindow.shadowRoot, id = _iframe$contentWindow.id, degrade = _iframe$contentWindow.degrade, document2 = _iframe$contentWindow.document, degradeAttrs = _iframe$contentWindow.degradeAttrs;
  var url = value;
  if (!/^http/.test(url)) {
    var hrefElement = anchorElementGenerator(url);
    url = appHostPath + hrefElement.pathname + hrefElement.search + hrefElement.hash;
    hrefElement = null;
  }
  iframe.contentWindow.__WUJIE.hrefFlag = true;
  if (degrade) {
    var iframeBody = rawDocumentQuerySelector.call(iframe.contentDocument, "body");
    renderElementToContainer(document2.documentElement, iframeBody);
    renderIframeReplaceApp(window.decodeURIComponent(url), getDegradeIframe(id).parentElement, degradeAttrs);
  } else renderIframeReplaceApp(url, shadowRoot.host.parentElement, degradeAttrs);
  pushUrlToWindow(id, url);
  return true;
}
function proxyGenerator(iframe, urlElement, mainHostPath, appHostPath) {
  var proxyWindow = new Proxy(iframe.contentWindow, {
    get: function get(target, p) {
      if (p === "location") {
        return target.__WUJIE.proxyLocation;
      }
      if (p === "self" || p === "window" && Object.getOwnPropertyDescriptor(window, "window").get) {
        return target.__WUJIE.proxy;
      }
      if (p === "__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR__" || p === "__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR_ALL__") {
        return target[p];
      }
      var descriptor = Object.getOwnPropertyDescriptor(target, p);
      if ((descriptor === null || descriptor === void 0 ? void 0 : descriptor.configurable) === false && (descriptor === null || descriptor === void 0 ? void 0 : descriptor.writable) === false) {
        return target[p];
      }
      return getTargetValue(target, p);
    },
    set: function set(target, p, value) {
      checkProxyFunction(value);
      target[p] = value;
      return true;
    },
    has: function has(target, p) {
      return p in target;
    }
  });
  var proxyDocument = new Proxy({}, {
    get: function get(_fakeDocument, propKey) {
      var document2 = window.document;
      var _iframe$contentWindow2 = iframe.contentWindow.__WUJIE, shadowRoot = _iframe$contentWindow2.shadowRoot, proxyLocation2 = _iframe$contentWindow2.proxyLocation;
      if (!shadowRoot) stopMainAppRun();
      var rawCreateElement = iframe.contentWindow.__WUJIE_RAW_DOCUMENT_CREATE_ELEMENT__;
      var rawCreateTextNode = iframe.contentWindow.__WUJIE_RAW_DOCUMENT_CREATE_TEXT_NODE__;
      if (propKey === "createElement" || propKey === "createTextNode") {
        return new Proxy(document2[propKey], {
          apply: function apply(_createElement, _ctx, args) {
            var rawCreateMethod = propKey === "createElement" ? rawCreateElement : rawCreateTextNode;
            var element2 = rawCreateMethod.apply(iframe.contentDocument, args);
            patchElementEffect(element2, iframe.contentWindow);
            return element2;
          }
        });
      }
      if (propKey === "documentURI" || propKey === "URL") {
        return proxyLocation2.href;
      }
      if (propKey === "getElementsByTagName" || propKey === "getElementsByClassName" || propKey === "getElementsByName") {
        return new Proxy(shadowRoot.querySelectorAll, {
          apply: function apply(querySelectorAll, _ctx, args) {
            var arg = args[0];
            if (_ctx !== iframe.contentDocument) {
              return _ctx[propKey].apply(_ctx, args);
            }
            if (propKey === "getElementsByTagName" && arg === "script") {
              return iframe.contentDocument.scripts;
            }
            if (propKey === "getElementsByClassName") arg = "." + arg;
            if (propKey === "getElementsByName") arg = '[name="'.concat(arg, '"]');
            var res;
            try {
              res = querySelectorAll.call(shadowRoot, arg);
            } catch (error2) {
              res = [];
            }
            return res;
          }
        });
      }
      if (propKey === "getElementById") {
        return new Proxy(shadowRoot.querySelector, {
          // case document.querySelector.call
          apply: function apply(target, ctx, args) {
            if (ctx !== iframe.contentDocument) {
              var _ctx$propKey;
              return (_ctx$propKey = ctx[propKey]) === null || _ctx$propKey === void 0 ? void 0 : _ctx$propKey.apply(ctx, args);
            }
            try {
              return target.call(shadowRoot, '[id="'.concat(args[0], '"]')) || iframe.contentWindow.__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR__.call(iframe.contentWindow.document, "#".concat(args[0]));
            } catch (error2) {
              warn(WUJIE_TIPS_GET_ELEMENT_BY_ID);
              return null;
            }
          }
        });
      }
      if (propKey === "querySelector" || propKey === "querySelectorAll") {
        var rawPropMap = {
          querySelector: "__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR__",
          querySelectorAll: "__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR_ALL__"
        };
        return new Proxy(shadowRoot[propKey], {
          apply: function apply(target, ctx, args) {
            if (ctx !== iframe.contentDocument) {
              var _ctx$propKey2;
              return (_ctx$propKey2 = ctx[propKey]) === null || _ctx$propKey2 === void 0 ? void 0 : _ctx$propKey2.apply(ctx, args);
            }
            return target.apply(shadowRoot, args) || (args[0] === "base" ? null : iframe.contentWindow[rawPropMap[propKey]].call(iframe.contentWindow.document, args[0]));
          }
        });
      }
      if (propKey === "documentElement" || propKey === "scrollingElement") return shadowRoot.firstElementChild;
      if (propKey === "forms") return shadowRoot.querySelectorAll("form");
      if (propKey === "images") return shadowRoot.querySelectorAll("img");
      if (propKey === "links") return shadowRoot.querySelectorAll("a");
      var ownerProperties = documentProxyProperties.ownerProperties, shadowProperties = documentProxyProperties.shadowProperties, shadowMethods = documentProxyProperties.shadowMethods, documentProperties = documentProxyProperties.documentProperties, documentMethods = documentProxyProperties.documentMethods;
      if (ownerProperties.concat(shadowProperties).includes(propKey.toString())) {
        if (propKey === "activeElement" && shadowRoot.activeElement === null) return shadowRoot.body;
        return shadowRoot[propKey];
      }
      if (shadowMethods.includes(propKey.toString())) {
        var _getTargetValue;
        return (_getTargetValue = getTargetValue(shadowRoot, propKey)) !== null && _getTargetValue !== void 0 ? _getTargetValue : getTargetValue(document2, propKey);
      }
      if (documentProperties.includes(propKey.toString())) {
        return document2[propKey];
      }
      if (documentMethods.includes(propKey.toString())) {
        return getTargetValue(document2, propKey);
      }
    }
  });
  var proxyLocation = new Proxy({}, {
    get: function get(_fakeLocation, propKey) {
      var location2 = iframe.contentWindow.location;
      if (propKey === "host" || propKey === "hostname" || propKey === "protocol" || propKey === "port" || propKey === "origin") {
        return urlElement[propKey];
      }
      if (propKey === "href") {
        return location2[propKey].replace(mainHostPath, appHostPath);
      }
      if (propKey === "reload") {
        warn(WUJIE_TIPS_RELOAD_DISABLED);
        return function() {
          return null;
        };
      }
      if (propKey === "replace") {
        return new Proxy(location2[propKey], {
          apply: function apply(replace, _ctx, args) {
            var _args$;
            return replace.call(location2, (_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.replace(appHostPath, mainHostPath));
          }
        });
      }
      return getTargetValue(location2, propKey);
    },
    set: function set(_fakeLocation, propKey, value) {
      if (propKey === "href") {
        return locationHrefSet(iframe, value, appHostPath);
      }
      iframe.contentWindow.location[propKey] = value;
      return true;
    },
    ownKeys: function ownKeys2() {
      return Object.keys(iframe.contentWindow.location).filter(function(key) {
        return key !== "reload";
      });
    },
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(_target, key) {
      return {
        enumerable: true,
        configurable: true,
        value: this[key]
      };
    }
  });
  return {
    proxyWindow,
    proxyDocument,
    proxyLocation
  };
}
function localGenerator(iframe, urlElement, mainHostPath, appHostPath) {
  var proxyDocument = {};
  var sandbox = iframe.contentWindow.__WUJIE;
  Object.defineProperties(proxyDocument, {
    createElement: {
      get: function get() {
        return function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          var element2 = iframe.contentWindow.__WUJIE_RAW_DOCUMENT_CREATE_ELEMENT__.apply(iframe.contentDocument, args);
          patchElementEffect(element2, iframe.contentWindow);
          return element2;
        };
      }
    },
    createTextNode: {
      get: function get() {
        return function() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          var element2 = iframe.contentWindow.__WUJIE_RAW_DOCUMENT_CREATE_TEXT_NODE__.apply(iframe.contentDocument, args);
          patchElementEffect(element2, iframe.contentWindow);
          return element2;
        };
      }
    },
    documentURI: {
      get: function get() {
        return sandbox.proxyLocation.href;
      }
    },
    URL: {
      get: function get() {
        return sandbox.proxyLocation.href;
      }
    },
    getElementsByTagName: {
      get: function get() {
        return function() {
          var tagName = arguments.length <= 0 ? void 0 : arguments[0];
          if (tagName === "script") {
            return iframe.contentDocument.scripts;
          }
          return sandbox.document.getElementsByTagName(tagName);
        };
      }
    }
  });
  var modifyLocalProperties = documentProxyProperties.modifyLocalProperties, modifyProperties = documentProxyProperties.modifyProperties, ownerProperties = documentProxyProperties.ownerProperties, shadowProperties = documentProxyProperties.shadowProperties, shadowMethods = documentProxyProperties.shadowMethods, documentProperties = documentProxyProperties.documentProperties, documentMethods = documentProxyProperties.documentMethods;
  modifyProperties.filter(function(key) {
    return !modifyLocalProperties.includes(key);
  }).concat(ownerProperties, shadowProperties, shadowMethods, documentProperties, documentMethods).forEach(function(key) {
    Object.defineProperty(proxyDocument, key, {
      get: function get() {
        var _sandbox$document;
        var value = (_sandbox$document = sandbox.document) === null || _sandbox$document === void 0 ? void 0 : _sandbox$document[key];
        return isCallable(value) ? value.bind(sandbox.document) : value;
      }
    });
  });
  var proxyLocation = {};
  var location2 = iframe.contentWindow.location;
  var locationKeys = Object.keys(location2);
  var constantKey = ["host", "hostname", "port", "protocol", "port"];
  constantKey.forEach(function(key) {
    proxyLocation[key] = urlElement[key];
  });
  Object.defineProperties(proxyLocation, {
    href: {
      get: function get() {
        return location2.href.replace(mainHostPath, appHostPath);
      },
      set: function set(value) {
        locationHrefSet(iframe, value, appHostPath);
      }
    },
    reload: {
      get: function get() {
        warn(WUJIE_TIPS_RELOAD_DISABLED);
        return function() {
          return null;
        };
      }
    }
  });
  locationKeys.filter(function(key) {
    return !constantKey.concat(["href", "reload"]).includes(key);
  }).forEach(function(key) {
    Object.defineProperty(proxyLocation, key, {
      get: function get() {
        return isCallable(location2[key]) ? location2[key].bind(location2) : location2[key];
      }
    });
  });
  return {
    proxyDocument,
    proxyLocation
  };
}
var appEventObjMap = window.__POWERED_BY_WUJIE__ ? window.__WUJIE.inject.appEventObjMap : /* @__PURE__ */ new Map();
var EventBus = /* @__PURE__ */ function() {
  function EventBus2(id) {
    _classCallCheck(this, EventBus2);
    this.id = id;
    this.$clear();
    if (!appEventObjMap.get(this.id)) {
      appEventObjMap.set(this.id, {});
    }
    this.eventObj = appEventObjMap.get(this.id);
  }
  _createClass(EventBus2, [{
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
      var on = (function() {
        this.$off(event, on);
        fn.apply(void 0, arguments);
      }).bind(this);
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
      appEventObjMap.forEach(function(eventObj) {
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
      events.forEach(function(event) {
        return delete eventObj[event];
      });
      return this;
    }
  }]);
  return EventBus2;
}();
function ownKeys$1(e, r2) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r2 && (o = o.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e, r3).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$1(e) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys$1(Object(t), true).forEach(function(r3) {
      _defineProperty(e, r3, t[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r3) {
      Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
    });
  }
  return e;
}
var Wujie = /* @__PURE__ */ function() {
  function Wujie2(options) {
    _classCallCheck(this, Wujie2);
    _defineProperty(this, "elementEventCacheMap", /* @__PURE__ */ new WeakMap());
    if (window.__POWERED_BY_WUJIE__) this.inject = window.__WUJIE.inject;
    else {
      this.inject = {
        idToSandboxMap: idToSandboxCacheMap,
        appEventObjMap,
        mainHostPath: window.location.protocol + "//" + window.location.host
      };
    }
    var name = options.name, url = options.url, attrs = options.attrs, fiber = options.fiber, degradeAttrs = options.degradeAttrs, degrade = options.degrade, lifecycles = options.lifecycles, plugins = options.plugins;
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
    var _appRouteParse = appRouteParse(url), urlElement = _appRouteParse.urlElement, appHostPath = _appRouteParse.appHostPath, appRoutePath = _appRouteParse.appRoutePath;
    var mainHostPath = this.inject.mainHostPath;
    this.iframe = iframeGenerator(this, attrs, mainHostPath, appHostPath, appRoutePath);
    if (this.degrade) {
      var _localGenerator = localGenerator(this.iframe, urlElement, mainHostPath, appHostPath), proxyDocument = _localGenerator.proxyDocument, proxyLocation = _localGenerator.proxyLocation;
      this.proxyDocument = proxyDocument;
      this.proxyLocation = proxyLocation;
    } else {
      var _proxyGenerator = proxyGenerator(this.iframe, urlElement, mainHostPath, appHostPath), proxyWindow = _proxyGenerator.proxyWindow, _proxyDocument = _proxyGenerator.proxyDocument, _proxyLocation = _proxyGenerator.proxyLocation;
      this.proxy = proxyWindow;
      this.proxyDocument = _proxyDocument;
      this.proxyLocation = _proxyLocation;
    }
    this.provide.location = this.proxyLocation;
    addSandboxCacheWithWujie(this.id, this);
  }
  _createClass(Wujie2, [{
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
      function() {
        var _active = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime.mark(function _callee(options) {
          var _this = this;
          var sync, url, el, template, props, alive, prefix, fetch2, replace, iframeWindow, iframeFetch, iframeBody, _initRenderIframeAndC, iframe, container, _iframeBody;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                sync = options.sync, url = options.url, el = options.el, template = options.template, props = options.props, alive = options.alive, prefix = options.prefix, fetch2 = options.fetch, replace = options.replace;
                this.url = url;
                this.sync = sync;
                this.alive = alive;
                this.hrefFlag = false;
                this.prefix = prefix !== null && prefix !== void 0 ? prefix : this.prefix;
                this.replace = replace !== null && replace !== void 0 ? replace : this.replace;
                this.provide.props = props !== null && props !== void 0 ? props : this.provide.props;
                this.activeFlag = true;
                _context.next = 11;
                return this.iframeReady;
              case 11:
                iframeWindow = this.iframe.contentWindow;
                iframeFetch = fetch2 ? function(input, init2) {
                  return fetch2(typeof input === "string" ? getAbsolutePath(input, _this.proxyLocation.href) : input, init2);
                } : this.fetch;
                if (iframeFetch) {
                  iframeWindow.fetch = iframeFetch;
                  this.fetch = iframeFetch;
                }
                if (this.execFlag && this.alive) {
                  syncUrlToWindow(iframeWindow);
                } else {
                  syncUrlToIframe(iframeWindow);
                  syncUrlToWindow(iframeWindow);
                }
                this.template = template !== null && template !== void 0 ? template : this.template;
                if (!this.degrade) {
                  _context.next = 38;
                  break;
                }
                iframeBody = rawDocumentQuerySelector.call(iframeWindow.document, "body");
                _initRenderIframeAndC = initRenderIframeAndContainer(this.id, el !== null && el !== void 0 ? el : iframeBody, this.degradeAttrs), iframe = _initRenderIframeAndC.iframe, container = _initRenderIframeAndC.container;
                this.el = container;
                if (el) clearChild(iframeBody);
                patchEventTimeStamp(iframe.contentWindow, iframeWindow);
                iframe.contentWindow.onunload = function() {
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
                recoverEventListeners(iframe.contentDocument.documentElement, iframeWindow);
                _context.next = 32;
                break;
              case 29:
                _context.next = 31;
                return renderTemplateToIframe(iframe.contentDocument, this.iframe.contentWindow, this.template);
              case 31:
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
                _iframeBody = rawDocumentQuerySelector.call(iframeWindow.document, "body");
                this.el = renderElementToContainer(createWujieWebComponent(this.id), el !== null && el !== void 0 ? el : _iframeBody);
              case 46:
                _context.next = 48;
                return renderTemplateToShadowRoot(this.shadowRoot, iframeWindow, this.template);
              case 48:
                this.patchCssRules();
                this.provide.shadowRoot = this.shadowRoot;
              case 50:
              case "end":
                return _context.stop();
            }
          }, _callee, this);
        }));
        function active2(_x) {
          return _active.apply(this, arguments);
        }
        return active2;
      }()
    )
  }, {
    key: "requestIdleCallback",
    value: function requestIdleCallback$1(callback) {
      var _this2 = this;
      return requestIdleCallback(function() {
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
    value: function() {
      var _start = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime.mark(function _callee2(getExternalScripts) {
        var _this3 = this;
        var scriptResultList, iframeWindow, beforeScriptResultList, afterScriptResultList, syncScriptResultList, asyncScriptResultList, deferScriptResultList, domContentLoadedTrigger, domLoadedTrigger;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              this.execFlag = true;
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
              iframeWindow = this.iframe.contentWindow;
              iframeWindow.__POWERED_BY_WUJIE__ = true;
              beforeScriptResultList = getPresetLoaders("jsBeforeLoaders", this.plugins);
              afterScriptResultList = getPresetLoaders("jsAfterLoaders", this.plugins);
              syncScriptResultList = [];
              asyncScriptResultList = [];
              deferScriptResultList = [];
              scriptResultList.forEach(function(scriptResult) {
                if (scriptResult.defer) deferScriptResultList.push(scriptResult);
                else if (scriptResult.async) asyncScriptResultList.push(scriptResult);
                else syncScriptResultList.push(scriptResult);
              });
              beforeScriptResultList.forEach(function(beforeScriptResult) {
                _this3.execQueue.push(function() {
                  return _this3.fiber ? _this3.requestIdleCallback(function() {
                    return insertScriptToIframe(beforeScriptResult, iframeWindow);
                  }) : insertScriptToIframe(beforeScriptResult, iframeWindow);
                });
              });
              syncScriptResultList.concat(deferScriptResultList).forEach(function(scriptResult) {
                _this3.execQueue.push(function() {
                  return scriptResult.contentPromise.then(function(content) {
                    return _this3.fiber ? _this3.requestIdleCallback(function() {
                      return insertScriptToIframe(_objectSpread$1(_objectSpread$1({}, scriptResult), {}, {
                        content
                      }), iframeWindow);
                    }) : insertScriptToIframe(_objectSpread$1(_objectSpread$1({}, scriptResult), {}, {
                      content
                    }), iframeWindow);
                  });
                });
              });
              asyncScriptResultList.forEach(function(scriptResult) {
                scriptResult.contentPromise.then(function(content) {
                  _this3.fiber ? _this3.requestIdleCallback(function() {
                    return insertScriptToIframe(_objectSpread$1(_objectSpread$1({}, scriptResult), {}, {
                      content
                    }), iframeWindow);
                  }) : insertScriptToIframe(_objectSpread$1(_objectSpread$1({}, scriptResult), {}, {
                    content
                  }), iframeWindow);
                });
              });
              this.execQueue.push(this.fiber ? function() {
                return _this3.requestIdleCallback(function() {
                  return _this3.mount();
                });
              } : function() {
                return _this3.mount();
              });
              domContentLoadedTrigger = function domContentLoadedTrigger2() {
                var _this3$execQueue$shif;
                eventTrigger(iframeWindow.document, "DOMContentLoaded");
                eventTrigger(iframeWindow, "DOMContentLoaded");
                (_this3$execQueue$shif = _this3.execQueue.shift()) === null || _this3$execQueue$shif === void 0 || _this3$execQueue$shif();
              };
              this.execQueue.push(this.fiber ? function() {
                return _this3.requestIdleCallback(domContentLoadedTrigger);
              } : domContentLoadedTrigger);
              afterScriptResultList.forEach(function(afterScriptResult) {
                _this3.execQueue.push(function() {
                  return _this3.fiber ? _this3.requestIdleCallback(function() {
                    return insertScriptToIframe(afterScriptResult, iframeWindow);
                  }) : insertScriptToIframe(afterScriptResult, iframeWindow);
                });
              });
              domLoadedTrigger = function domLoadedTrigger2() {
                var _this3$execQueue$shif2;
                eventTrigger(iframeWindow.document, "readystatechange");
                eventTrigger(iframeWindow, "load");
                (_this3$execQueue$shif2 = _this3.execQueue.shift()) === null || _this3$execQueue$shif2 === void 0 || _this3$execQueue$shif2();
              };
              this.execQueue.push(this.fiber ? function() {
                return _this3.requestIdleCallback(domLoadedTrigger);
              } : domLoadedTrigger);
              if (this.alive || !isFunction(this.iframe.contentWindow.__WUJIE_UNMOUNT)) removeLoading(this.el);
              this.execQueue.shift()();
              return _context2.abrupt("return", new Promise(function(resolve) {
                _this3.execQueue.push(function() {
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
      function start2(_x2) {
        return _start.apply(this, arguments);
      }
      return start2;
    }()
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
      if (this.el) {
        clearChild(this.el);
        this.el = null;
      }
      if (this.iframe) {
        var _this$iframe$parentNo;
        var _iframeWindow = this.iframe.contentWindow;
        if (_iframeWindow !== null && _iframeWindow !== void 0 && _iframeWindow.__WUJIE_EVENTLISTENER__) {
          _iframeWindow.__WUJIE_EVENTLISTENER__.forEach(function(o) {
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
        this.styleSheetElements.forEach(function(styleSheetElement) {
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
      var _getPatchStyleElement = getPatchStyleElements(Array.from(this.iframe.contentDocument.querySelectorAll("style")).map(function(styleSheetElement) {
        return styleSheetElement.sheet;
      })), _getPatchStyleElement2 = _slicedToArray(_getPatchStyleElement, 2), hostStyleSheetElement = _getPatchStyleElement2[0], fontStyleSheetElement = _getPatchStyleElement2[1];
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
  return Wujie2;
}();
function ownKeys(e, r2) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r2 && (o = o.filter(function(r3) {
      return Object.getOwnPropertyDescriptor(e, r3).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r2 = 1; r2 < arguments.length; r2++) {
    var t = null != arguments[r2] ? arguments[r2] : {};
    r2 % 2 ? ownKeys(Object(t), true).forEach(function(r3) {
      _defineProperty(e, r3, t[r3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r3) {
      Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t, r3));
    });
  }
  return e;
}
var bus = new EventBus(Date.now().toString());
if (window.__WUJIE && !window.__POWERED_BY_WUJIE__) {
  stopMainAppRun();
}
processAppForHrefJump();
defineWujieWebComponent();
if (!wujieSupport) warn(WUJIE_TIPS_NOT_SUPPORTED);
function setupApp(options) {
  if (options.name) addSandboxCacheWithOptions(options.name, options);
}
function startApp(_x) {
  return _startApp.apply(this, arguments);
}
function _startApp() {
  _startApp = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime.mark(function _callee2(startOptions) {
    var _newSandbox$lifecycle, _newSandbox$lifecycle2;
    var sandbox, cacheOptions, options, name, url, html, replace, fetch2, props, attrs, degradeAttrs, fiber, alive, degrade, sync, prefix, el, loading, plugins, lifecycles, _iframeWindow, _sandbox$lifecycles3, _sandbox$lifecycles3$, _sandbox$lifecycles2, _sandbox$lifecycles2$, _yield$importHTML2, _getExternalScripts2, _sandbox$lifecycles4, _sandbox$lifecycles4$, _sandbox$lifecycles5, _sandbox$lifecycles5$, newSandbox, _yield$importHTML3, template, getExternalScripts, getExternalStyleSheets, processedHtml;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          sandbox = getWujieById(startOptions.name);
          cacheOptions = getOptionsById(startOptions.name);
          options = mergeOptions(startOptions, cacheOptions);
          name = options.name, url = options.url, html = options.html, replace = options.replace, fetch2 = options.fetch, props = options.props, attrs = options.attrs, degradeAttrs = options.degradeAttrs, fiber = options.fiber, alive = options.alive, degrade = options.degrade, sync = options.sync, prefix = options.prefix, el = options.el, loading = options.loading, plugins = options.plugins, lifecycles = options.lifecycles;
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
            url,
            sync,
            prefix,
            el,
            props,
            alive,
            fetch: fetch2,
            replace
          });
        case 14:
          if (sandbox.execFlag) {
            _context2.next = 22;
            break;
          }
          (_sandbox$lifecycles2 = sandbox.lifecycles) === null || _sandbox$lifecycles2 === void 0 || (_sandbox$lifecycles2$ = _sandbox$lifecycles2.beforeLoad) === null || _sandbox$lifecycles2$ === void 0 || _sandbox$lifecycles2$.call(_sandbox$lifecycles2, sandbox.iframe.contentWindow);
          _context2.next = 18;
          return importHTML({
            url,
            html,
            opts: {
              fetch: fetch2 || window.fetch,
              plugins: sandbox.plugins,
              loadError: sandbox.lifecycles.loadError,
              fiber
            }
          });
        case 18:
          _yield$importHTML2 = _context2.sent;
          _getExternalScripts2 = _yield$importHTML2.getExternalScripts;
          _context2.next = 22;
          return sandbox.start(_getExternalScripts2);
        case 22:
          (_sandbox$lifecycles3 = sandbox.lifecycles) === null || _sandbox$lifecycles3 === void 0 || (_sandbox$lifecycles3$ = _sandbox$lifecycles3.activated) === null || _sandbox$lifecycles3$ === void 0 || _sandbox$lifecycles3$.call(_sandbox$lifecycles3, sandbox.iframe.contentWindow);
          return _context2.abrupt("return", sandbox.destroy);
        case 26:
          if (!isFunction(_iframeWindow.__WUJIE_MOUNT)) {
            _context2.next = 38;
            break;
          }
          sandbox.unmount();
          _context2.next = 30;
          return sandbox.active({
            url,
            sync,
            prefix,
            el,
            props,
            alive,
            fetch: fetch2,
            replace
          });
        case 30:
          sandbox.rebuildStyleSheets();
          (_sandbox$lifecycles4 = sandbox.lifecycles) === null || _sandbox$lifecycles4 === void 0 || (_sandbox$lifecycles4$ = _sandbox$lifecycles4.beforeMount) === null || _sandbox$lifecycles4$ === void 0 || _sandbox$lifecycles4$.call(_sandbox$lifecycles4, sandbox.iframe.contentWindow);
          _iframeWindow.__WUJIE_MOUNT();
          (_sandbox$lifecycles5 = sandbox.lifecycles) === null || _sandbox$lifecycles5 === void 0 || (_sandbox$lifecycles5$ = _sandbox$lifecycles5.afterMount) === null || _sandbox$lifecycles5$ === void 0 || _sandbox$lifecycles5$.call(_sandbox$lifecycles5, sandbox.iframe.contentWindow);
          sandbox.mountFlag = true;
          return _context2.abrupt("return", sandbox.destroy);
        case 38:
          sandbox.destroy();
        case 39:
          addLoading(el, loading);
          newSandbox = new Wujie({
            name,
            url,
            attrs,
            degradeAttrs,
            fiber,
            degrade,
            plugins,
            lifecycles
          });
          (_newSandbox$lifecycle = newSandbox.lifecycles) === null || _newSandbox$lifecycle === void 0 || (_newSandbox$lifecycle2 = _newSandbox$lifecycle.beforeLoad) === null || _newSandbox$lifecycle2 === void 0 || _newSandbox$lifecycle2.call(_newSandbox$lifecycle, newSandbox.iframe.contentWindow);
          _context2.next = 44;
          return importHTML({
            url,
            html,
            opts: {
              fetch: fetch2 || window.fetch,
              plugins: newSandbox.plugins,
              loadError: newSandbox.lifecycles.loadError,
              fiber
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
            url,
            sync,
            prefix,
            template: processedHtml,
            el,
            props,
            alive,
            fetch: fetch2,
            replace
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
function preloadApp(preOptions) {
  requestIdleCallback(function() {
    if (getWujieById(preOptions.name) || isMatchSyncQueryById(preOptions.name)) return;
    var cacheOptions = getOptionsById(preOptions.name);
    var options = mergeOptions(_objectSpread({}, preOptions), cacheOptions);
    var name = options.name, url = options.url, html = options.html, props = options.props, alive = options.alive, replace = options.replace, fetch2 = options.fetch, exec = options.exec, attrs = options.attrs, degradeAttrs = options.degradeAttrs, fiber = options.fiber, degrade = options.degrade, prefix = options.prefix, plugins = options.plugins, lifecycles = options.lifecycles;
    var sandbox = new Wujie({
      name,
      url,
      attrs,
      degradeAttrs,
      fiber,
      degrade,
      plugins,
      lifecycles
    });
    if (sandbox.preload) return sandbox.preload;
    var runPreload = /* @__PURE__ */ function() {
      var _ref = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime.mark(function _callee() {
        var _sandbox$lifecycles, _sandbox$lifecycles$b;
        var _yield$importHTML, template, getExternalScripts, getExternalStyleSheets, processedHtml;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              (_sandbox$lifecycles = sandbox.lifecycles) === null || _sandbox$lifecycles === void 0 || (_sandbox$lifecycles$b = _sandbox$lifecycles.beforeLoad) === null || _sandbox$lifecycles$b === void 0 || _sandbox$lifecycles$b.call(_sandbox$lifecycles, sandbox.iframe.contentWindow);
              _context.next = 3;
              return importHTML({
                url,
                html,
                opts: {
                  fetch: fetch2 || window.fetch,
                  plugins: sandbox.plugins,
                  loadError: sandbox.lifecycles.loadError,
                  fiber
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
                url,
                props,
                prefix,
                alive,
                template: processedHtml,
                fetch: fetch2,
                replace
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
      return function runPreload2() {
        return _ref.apply(this, arguments);
      };
    }();
    sandbox.preload = runPreload();
  });
}
function destroyApp(id) {
  var sandbox = getWujieById(id);
  if (sandbox) {
    sandbox.destroy();
  }
}
function create_fragment$7(ctx) {
  let div2;
  return {
    c() {
      div2 = element("div");
      div2.innerHTML = ``;
      set_style(
        div2,
        "width",
        /*width*/
        ctx[0]
      );
      set_style(
        div2,
        "height",
        /*height*/
        ctx[1]
      );
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      ctx[25](div2);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*width*/
      1) {
        set_style(
          div2,
          "width",
          /*width*/
          ctx2[0]
        );
      }
      if (dirty & /*height*/
      2) {
        set_style(
          div2,
          "height",
          /*height*/
          ctx2[1]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      ctx[25](null);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let { width = "" } = $$props;
  let { height = "" } = $$props;
  let { name = "" } = $$props;
  let { loading = void 0 } = $$props;
  let { url = "" } = $$props;
  let { sync = false } = $$props;
  let { prefix = void 0 } = $$props;
  let { alive = false } = $$props;
  let { props = void 0 } = $$props;
  let { attrs = void 0 } = $$props;
  let { replace = void 0 } = $$props;
  let { fetch: fetch2 = void 0 } = $$props;
  let { fiber = false } = $$props;
  let { degrade = false } = $$props;
  let { plugins = [] } = $$props;
  let { beforeLoad = void 0 } = $$props;
  let { beforeMount = void 0 } = $$props;
  let { afterMount = void 0 } = $$props;
  let { beforeUnmount = void 0 } = $$props;
  let { afterUnmount = void 0 } = $$props;
  let { activated = void 0 } = $$props;
  let { deactivated = void 0 } = $$props;
  let { loadError = void 0 } = $$props;
  let startAppQueue = Promise.resolve();
  onMount(() => {
    bus.$onAll(handleEmit);
  });
  const dispatch2 = createEventDispatcher();
  function handleEmit(event, ...args) {
    dispatch2(event, ...args);
  }
  let wujie = "";
  async function startApp$1() {
    try {
      await startApp({
        name,
        url,
        el: wujie,
        loading,
        alive,
        fetch: fetch2,
        props,
        attrs,
        replace,
        sync,
        prefix,
        fiber,
        degrade,
        plugins,
        beforeLoad,
        beforeMount,
        afterMount,
        beforeUnmount,
        afterUnmount,
        activated,
        deactivated,
        loadError
      });
    } catch (error2) {
      console.log(error2);
    }
  }
  function execStartApp(name2, url2) {
    console.log("execStartApp", name2, url2);
    startAppQueue = startAppQueue.then(startApp$1);
  }
  onDestroy(() => {
    bus.$offAll(handleEmit);
    destroyApp(name);
  });
  function getWujie() {
    return { setupApp, preloadApp, bus, destroyApp };
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      wujie = $$value;
      $$invalidate(2, wujie);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("width" in $$props2) $$invalidate(0, width = $$props2.width);
    if ("height" in $$props2) $$invalidate(1, height = $$props2.height);
    if ("name" in $$props2) $$invalidate(3, name = $$props2.name);
    if ("loading" in $$props2) $$invalidate(4, loading = $$props2.loading);
    if ("url" in $$props2) $$invalidate(5, url = $$props2.url);
    if ("sync" in $$props2) $$invalidate(6, sync = $$props2.sync);
    if ("prefix" in $$props2) $$invalidate(7, prefix = $$props2.prefix);
    if ("alive" in $$props2) $$invalidate(8, alive = $$props2.alive);
    if ("props" in $$props2) $$invalidate(9, props = $$props2.props);
    if ("attrs" in $$props2) $$invalidate(10, attrs = $$props2.attrs);
    if ("replace" in $$props2) $$invalidate(11, replace = $$props2.replace);
    if ("fetch" in $$props2) $$invalidate(12, fetch2 = $$props2.fetch);
    if ("fiber" in $$props2) $$invalidate(13, fiber = $$props2.fiber);
    if ("degrade" in $$props2) $$invalidate(14, degrade = $$props2.degrade);
    if ("plugins" in $$props2) $$invalidate(15, plugins = $$props2.plugins);
    if ("beforeLoad" in $$props2) $$invalidate(16, beforeLoad = $$props2.beforeLoad);
    if ("beforeMount" in $$props2) $$invalidate(17, beforeMount = $$props2.beforeMount);
    if ("afterMount" in $$props2) $$invalidate(18, afterMount = $$props2.afterMount);
    if ("beforeUnmount" in $$props2) $$invalidate(19, beforeUnmount = $$props2.beforeUnmount);
    if ("afterUnmount" in $$props2) $$invalidate(20, afterUnmount = $$props2.afterUnmount);
    if ("activated" in $$props2) $$invalidate(21, activated = $$props2.activated);
    if ("deactivated" in $$props2) $$invalidate(22, deactivated = $$props2.deactivated);
    if ("loadError" in $$props2) $$invalidate(23, loadError = $$props2.loadError);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*name, url*/
    40) {
      {
        execStartApp(name, url);
      }
    }
  };
  return [
    width,
    height,
    wujie,
    name,
    loading,
    url,
    sync,
    prefix,
    alive,
    props,
    attrs,
    replace,
    fetch2,
    fiber,
    degrade,
    plugins,
    beforeLoad,
    beforeMount,
    afterMount,
    beforeUnmount,
    afterUnmount,
    activated,
    deactivated,
    loadError,
    getWujie,
    div_binding
  ];
}
class Wujie_svelte extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$7, safe_not_equal, {
      width: 0,
      height: 1,
      name: 3,
      loading: 4,
      url: 5,
      sync: 6,
      prefix: 7,
      alive: 8,
      props: 9,
      attrs: 10,
      replace: 11,
      fetch: 12,
      fiber: 13,
      degrade: 14,
      plugins: 15,
      beforeLoad: 16,
      beforeMount: 17,
      afterMount: 18,
      beforeUnmount: 19,
      afterUnmount: 20,
      activated: 21,
      deactivated: 22,
      loadError: 23,
      getWujie: 24
    });
  }
  get getWujie() {
    return this.$$.ctx[24];
  }
}
const simpleJsBeforeLoader = (callback) => {
  return {
    jsBeforeLoaders: [
      {
        callback
      }
    ]
  };
};
function _isPlaceholder(a) {
  return a != null && typeof a === "object" && a["@@functional/placeholder"] === true;
}
function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}
function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
          return fn(a, _b);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}
var add = _curry2(function add2(a, b) {
  return Number(a) + Number(b);
});
var add_default = add;
function _concat(set1, set22) {
  set1 = set1 || [];
  set22 = set22 || [];
  var idx;
  var len1 = set1.length;
  var len2 = set22.length;
  var result = [];
  idx = 0;
  while (idx < len1) {
    result[result.length] = set1[idx];
    idx += 1;
  }
  idx = 0;
  while (idx < len2) {
    result[result.length] = set22[idx];
    idx += 1;
  }
  return result;
}
function _arity(n, fn) {
  switch (n) {
    case 0:
      return function() {
        return fn.apply(this, arguments);
      };
    case 1:
      return function(a0) {
        return fn.apply(this, arguments);
      };
    case 2:
      return function(a0, a1) {
        return fn.apply(this, arguments);
      };
    case 3:
      return function(a0, a1, a2) {
        return fn.apply(this, arguments);
      };
    case 4:
      return function(a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };
    case 5:
      return function(a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };
    case 6:
      return function(a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };
    case 7:
      return function(a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };
    case 8:
      return function(a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };
    case 9:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };
    case 10:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };
    default:
      throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
  }
}
function _curryN(length3, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length3;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder(result)) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length3, combined, fn));
  };
}
var curryN = _curry2(function curryN2(length3, fn) {
  if (length3 === 1) {
    return _curry1(fn);
  }
  return _arity(length3, _curryN(length3, [], fn));
});
var curryN_default = curryN;
function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function(_c) {
          return fn(a, b, _c);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function(_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function(_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}
var isArray_default = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === "[object Array]";
};
function _isTransformer(obj) {
  return obj != null && typeof obj["@@transducer/step"] === "function";
}
function _dispatchable(methodNames, transducerCreator, fn) {
  return function() {
    if (arguments.length === 0) {
      return fn();
    }
    var obj = arguments[arguments.length - 1];
    if (!isArray_default(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === "function") {
          return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
        }
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
}
function _reduced(x) {
  return x && x["@@transducer/reduced"] ? x : {
    "@@transducer/value": x,
    "@@transducer/reduced": true
  };
}
var xfBase_default = {
  init: function() {
    return this.xf["@@transducer/init"]();
  },
  result: function(result) {
    return this.xf["@@transducer/result"](result);
  }
};
var max = _curry2(function max2(a, b) {
  return b > a ? b : a;
});
var max_default = max;
function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
}
function _isString(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}
var _isArrayLike = _curry1(function isArrayLike(x) {
  if (isArray_default(x)) {
    return true;
  }
  if (!x) {
    return false;
  }
  if (typeof x !== "object") {
    return false;
  }
  if (_isString(x)) {
    return false;
  }
  if (x.length === 0) {
    return true;
  }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});
var isArrayLike_default = _isArrayLike;
var XWrap = function() {
  function XWrap2(fn) {
    this.f = fn;
  }
  XWrap2.prototype["@@transducer/init"] = function() {
    throw new Error("init not implemented on XWrap");
  };
  XWrap2.prototype["@@transducer/result"] = function(acc) {
    return acc;
  };
  XWrap2.prototype["@@transducer/step"] = function(acc, x) {
    return this.f(acc, x);
  };
  return XWrap2;
}();
function _xwrap(fn) {
  return new XWrap(fn);
}
var bind = _curry2(function bind2(fn, thisObj) {
  return _arity(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
});
var bind_default = bind;
function _arrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    acc = xf["@@transducer/step"](acc, list[idx]);
    if (acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    idx += 1;
  }
  return xf["@@transducer/result"](acc);
}
function _iterableReduce(xf, acc, iter) {
  var step = iter.next();
  while (!step.done) {
    acc = xf["@@transducer/step"](acc, step.value);
    if (acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    step = iter.next();
  }
  return xf["@@transducer/result"](acc);
}
function _methodReduce(xf, acc, obj, methodName) {
  return xf["@@transducer/result"](obj[methodName](bind_default(xf["@@transducer/step"], xf), acc));
}
var symIterator = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
function _reduce(fn, acc, list) {
  if (typeof fn === "function") {
    fn = _xwrap(fn);
  }
  if (isArrayLike_default(list)) {
    return _arrayReduce(fn, acc, list);
  }
  if (typeof list["fantasy-land/reduce"] === "function") {
    return _methodReduce(fn, acc, list, "fantasy-land/reduce");
  }
  if (list[symIterator] != null) {
    return _iterableReduce(fn, acc, list[symIterator]());
  }
  if (typeof list.next === "function") {
    return _iterableReduce(fn, acc, list);
  }
  if (typeof list.reduce === "function") {
    return _methodReduce(fn, acc, list, "reduce");
  }
  throw new TypeError("reduce: list must be array or iterable");
}
var XMap = function() {
  function XMap2(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XMap2.prototype["@@transducer/init"] = xfBase_default.init;
  XMap2.prototype["@@transducer/result"] = xfBase_default.result;
  XMap2.prototype["@@transducer/step"] = function(result, input) {
    return this.xf["@@transducer/step"](result, this.f(input));
  };
  return XMap2;
}();
var _xmap = _curry2(function _xmap2(f, xf) {
  return new XMap(f, xf);
});
var xmap_default = _xmap;
function _has(prop3, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop3);
}
var toString$1 = Object.prototype.toString;
var _isArguments = function() {
  return toString$1.call(arguments) === "[object Arguments]" ? function _isArguments2(x) {
    return toString$1.call(x) === "[object Arguments]";
  } : function _isArguments2(x) {
    return _has("callee", x);
  };
}();
var isArguments_default = _isArguments;
var hasEnumBug = !{
  toString: null
}.propertyIsEnumerable("toString");
var nonEnumerableProps = ["constructor", "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
var hasArgsEnumBug = function() {
  return arguments.propertyIsEnumerable("length");
}();
var contains = function contains2(list, item) {
  var idx = 0;
  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }
    idx += 1;
  }
  return false;
};
var keys = typeof Object.keys === "function" && !hasArgsEnumBug ? _curry1(function keys2(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}) : _curry1(function keys3(obj) {
  if (Object(obj) !== obj) {
    return [];
  }
  var prop3, nIdx;
  var ks = [];
  var checkArgsLength = hasArgsEnumBug && isArguments_default(obj);
  for (prop3 in obj) {
    if (_has(prop3, obj) && (!checkArgsLength || prop3 !== "length")) {
      ks[ks.length] = prop3;
    }
  }
  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;
    while (nIdx >= 0) {
      prop3 = nonEnumerableProps[nIdx];
      if (_has(prop3, obj) && !contains(ks, prop3)) {
        ks[ks.length] = prop3;
      }
      nIdx -= 1;
    }
  }
  return ks;
});
var keys_default = keys;
var map = _curry2(
  _dispatchable(["fantasy-land/map", "map"], xmap_default, function map2(fn, functor) {
    switch (Object.prototype.toString.call(functor)) {
      case "[object Function]":
        return curryN_default(functor.length, function() {
          return fn.call(this, functor.apply(this, arguments));
        });
      case "[object Object]":
        return _reduce(function(acc, key) {
          acc[key] = fn(functor[key]);
          return acc;
        }, {}, keys_default(functor));
      default:
        return _map(fn, functor);
    }
  })
);
var map_default = map;
var isInteger_default = Number.isInteger || function _isInteger(n) {
  return n << 0 === n;
};
var nth = _curry2(function nth2(offset2, list) {
  var idx = offset2 < 0 ? list.length + offset2 : offset2;
  return _isString(list) ? list.charAt(idx) : list[idx];
});
var nth_default = nth;
var prop = _curry2(function prop2(p, obj) {
  if (obj == null) {
    return;
  }
  return isInteger_default(p) ? nth_default(p, obj) : obj[p];
});
var prop_default = prop;
var pluck = _curry2(function pluck2(p, list) {
  return map_default(prop_default(p), list);
});
var pluck_default = pluck;
var reduce = _curry3(_reduce);
var reduce_default = reduce;
var ap = _curry2(function ap2(applyF, applyX) {
  return typeof applyX["fantasy-land/ap"] === "function" ? applyX["fantasy-land/ap"](applyF) : typeof applyF.ap === "function" ? applyF.ap(applyX) : typeof applyF === "function" ? function(x) {
    return applyF(x)(applyX(x));
  } : _reduce(function(acc, f) {
    return _concat(acc, map_default(f, applyX));
  }, [], applyF);
});
var ap_default = ap;
function _isFunction(x) {
  var type3 = Object.prototype.toString.call(x);
  return type3 === "[object Function]" || type3 === "[object AsyncFunction]" || type3 === "[object GeneratorFunction]" || type3 === "[object AsyncGeneratorFunction]";
}
var liftN = _curry2(function liftN2(arity, fn) {
  var lifted = curryN_default(arity, fn);
  return curryN_default(arity, function() {
    return _reduce(ap_default, map_default(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
  });
});
var liftN_default = liftN;
var lift = _curry1(function lift2(fn) {
  return liftN_default(fn.length, fn);
});
var lift_default = lift;
function _makeFlat(recursive) {
  return function flatt(list) {
    var value, jlen, j;
    var result = [];
    var idx = 0;
    var ilen = list.length;
    while (idx < ilen) {
      if (isArrayLike_default(list[idx])) {
        value = list[idx];
        j = 0;
        jlen = value.length;
        while (j < jlen) {
          result[result.length] = value[j];
          j += 1;
        }
      } else {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
    return result;
  };
}
function _forceReduced(x) {
  return {
    "@@transducer/value": x,
    "@@transducer/reduced": true
  };
}
var preservingReduced = function(xf) {
  return {
    "@@transducer/init": xfBase_default.init,
    "@@transducer/result": function(result) {
      return xf["@@transducer/result"](result);
    },
    "@@transducer/step": function(result, input) {
      var ret = xf["@@transducer/step"](result, input);
      return ret["@@transducer/reduced"] ? _forceReduced(ret) : ret;
    }
  };
};
var _flatCat = function _xcat(xf) {
  var rxf = preservingReduced(xf);
  return {
    "@@transducer/init": xfBase_default.init,
    "@@transducer/result": function(result) {
      return rxf["@@transducer/result"](result);
    },
    "@@transducer/step": function(result, input) {
      return !isArrayLike_default(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
    }
  };
};
var flatCat_default = _flatCat;
var _xchain = _curry2(function _xchain2(f, xf) {
  return map_default(f, flatCat_default(xf));
});
var xchain_default = _xchain;
var chain = _curry2(
  _dispatchable(["fantasy-land/chain", "chain"], xchain_default, function chain2(fn, monad) {
    if (typeof monad === "function") {
      return function(x) {
        return fn(monad(x))(x);
      };
    }
    return _makeFlat()(map_default(fn, monad));
  })
);
var chain_default = chain;
function _cloneRegExp(pattern) {
  return new RegExp(pattern.source, (pattern.global ? "g" : "") + (pattern.ignoreCase ? "i" : "") + (pattern.multiline ? "m" : "") + (pattern.sticky ? "y" : "") + (pattern.unicode ? "u" : ""));
}
var type = _curry1(function type2(val) {
  return val === null ? "Null" : val === void 0 ? "Undefined" : Object.prototype.toString.call(val).slice(8, -1);
});
var type_default = type;
function _clone(value, refFrom, refTo, deep) {
  var copy = function copy2(copiedValue) {
    var len = refFrom.length;
    var idx = 0;
    while (idx < len) {
      if (value === refFrom[idx]) {
        return refTo[idx];
      }
      idx += 1;
    }
    refFrom[idx] = value;
    refTo[idx] = copiedValue;
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        copiedValue[key] = value[key];
      }
    }
    return copiedValue;
  };
  switch (type_default(value)) {
    case "Object":
      return copy(Object.create(Object.getPrototypeOf(value)));
    case "Array":
      return copy([]);
    case "Date":
      return new Date(value.valueOf());
    case "RegExp":
      return _cloneRegExp(value);
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "BigInt64Array":
    case "BigUint64Array":
      return value.slice();
    default:
      return value;
  }
}
var not = _curry1(function not2(a) {
  return !a;
});
var not_default = not;
lift_default(not_default);
function _pipe(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
}
function _checkForMethod(methodname, fn) {
  return function() {
    var length3 = arguments.length;
    if (length3 === 0) {
      return fn();
    }
    var obj = arguments[length3 - 1];
    return isArray_default(obj) || typeof obj[methodname] !== "function" ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length3 - 1));
  };
}
var slice = _curry3(
  _checkForMethod("slice", function slice2(fromIndex, toIndex, list) {
    return Array.prototype.slice.call(list, fromIndex, toIndex);
  })
);
var slice_default = slice;
var tail = _curry1(
  _checkForMethod(
    "tail",
    slice_default(1, Infinity)
  )
);
var tail_default = tail;
function pipe() {
  if (arguments.length === 0) {
    throw new Error("pipe requires at least one argument");
  }
  return _arity(arguments[0].length, reduce_default(_pipe, arguments[0], tail_default(arguments)));
}
var reverse = _curry1(function reverse2(list) {
  return _isString(list) ? list.split("").reverse().join("") : Array.prototype.slice.call(list, 0).reverse();
});
var reverse_default = reverse;
function compose() {
  if (arguments.length === 0) {
    throw new Error("compose requires at least one argument");
  }
  return pipe.apply(this, reverse_default(arguments));
}
nth_default(0);
function _identity(x) {
  return x;
}
var identity = _curry1(_identity);
var identity_default = identity;
function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
}
function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}
function _functionName(f) {
  var match3 = String(f).match(/^function (\w*)/);
  return match3 == null ? "" : match3[1];
}
function _objectIs(a, b) {
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  } else {
    return a !== a && b !== b;
  }
}
var objectIs_default = typeof Object.is === "function" ? Object.is : _objectIs;
function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a = _arrayFromIterator(aIterator);
  var b = _arrayFromIterator(bIterator);
  function eq(_a, _b) {
    return _equals(_a, _b, stackA.slice(), stackB.slice());
  }
  return !_includesWith(function(b2, aItem) {
    return !_includesWith(eq, aItem, b2);
  }, b, a);
}
function _equals(a, b, stackA, stackB) {
  if (objectIs_default(a, b)) {
    return true;
  }
  var typeA = type_default(a);
  if (typeA !== type_default(b)) {
    return false;
  }
  if (typeof a["fantasy-land/equals"] === "function" || typeof b["fantasy-land/equals"] === "function") {
    return typeof a["fantasy-land/equals"] === "function" && a["fantasy-land/equals"](b) && typeof b["fantasy-land/equals"] === "function" && b["fantasy-land/equals"](a);
  }
  if (typeof a.equals === "function" || typeof b.equals === "function") {
    return typeof a.equals === "function" && a.equals(b) && typeof b.equals === "function" && b.equals(a);
  }
  switch (typeA) {
    case "Arguments":
    case "Array":
    case "Object":
      if (typeof a.constructor === "function" && _functionName(a.constructor) === "Promise") {
        return a === b;
      }
      break;
    case "Boolean":
    case "Number":
    case "String":
      if (!(typeof a === typeof b && objectIs_default(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case "Date":
      if (!objectIs_default(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case "Error":
      return a.name === b.name && a.message === b.message;
    case "RegExp":
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }
      break;
  }
  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }
  switch (typeA) {
    case "Map":
      if (a.size !== b.size) {
        return false;
      }
      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
    case "Set":
      if (a.size !== b.size) {
        return false;
      }
      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
    case "Arguments":
    case "Array":
    case "Object":
    case "Boolean":
    case "Number":
    case "String":
    case "Date":
    case "Error":
    case "RegExp":
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "ArrayBuffer":
      break;
    default:
      return false;
  }
  var keysA = keys_default(a);
  if (keysA.length !== keys_default(b).length) {
    return false;
  }
  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);
  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }
    idx -= 1;
  }
  return true;
}
var equals = _curry2(function equals2(a, b) {
  return _equals(a, b, [], []);
});
var equals_default = equals;
function _indexOf(list, a, idx) {
  var inf, item;
  if (typeof list.indexOf === "function") {
    switch (typeof a) {
      case "number":
        if (a === 0) {
          inf = 1 / a;
          while (idx < list.length) {
            item = list[idx];
            if (item === 0 && 1 / item === inf) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        } else if (a !== a) {
          while (idx < list.length) {
            item = list[idx];
            if (typeof item === "number" && item !== item) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        }
        return list.indexOf(a, idx);
      case "string":
      case "boolean":
      case "function":
      case "undefined":
        return list.indexOf(a, idx);
      case "object":
        if (a === null) {
          return list.indexOf(a, idx);
        }
    }
  }
  while (idx < list.length) {
    if (equals_default(list[idx], a)) {
      return idx;
    }
    idx += 1;
  }
  return -1;
}
function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}
function _quote(s) {
  var escaped = s.replace(/\\/g, "\\\\").replace(/[\b]/g, "\\b").replace(/\f/g, "\\f").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\v/g, "\\v").replace(/\0/g, "\\0");
  return '"' + escaped.replace(/"/g, '\\"') + '"';
}
var pad = function pad2(n) {
  return (n < 10 ? "0" : "") + n;
};
var _toISOString = typeof Date.prototype.toISOString === "function" ? function _toISOString2(d) {
  return d.toISOString();
} : function _toISOString3(d) {
  return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "." + (d.getUTCMilliseconds() / 1e3).toFixed(3).slice(2, 5) + "Z";
};
var toISOString_default = _toISOString;
function _complement(f) {
  return function() {
    return !f.apply(this, arguments);
  };
}
function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }
    idx += 1;
  }
  return result;
}
function _isObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}
var XFilter = function() {
  function XFilter2(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XFilter2.prototype["@@transducer/init"] = xfBase_default.init;
  XFilter2.prototype["@@transducer/result"] = xfBase_default.result;
  XFilter2.prototype["@@transducer/step"] = function(result, input) {
    return this.f(input) ? this.xf["@@transducer/step"](result, input) : result;
  };
  return XFilter2;
}();
var _xfilter = _curry2(function _xfilter2(f, xf) {
  return new XFilter(f, xf);
});
var xfilter_default = _xfilter;
var filter = _curry2(
  _dispatchable(["fantasy-land/filter", "filter"], xfilter_default, function(pred, filterable) {
    return _isObject(filterable) ? _reduce(function(acc, key) {
      if (pred(filterable[key])) {
        acc[key] = filterable[key];
      }
      return acc;
    }, {}, keys_default(filterable)) : _filter(pred, filterable);
  })
);
var filter_default = filter;
var reject = _curry2(function reject2(pred, filterable) {
  return filter_default(_complement(pred), filterable);
});
var reject_default = reject;
function _toString(x, seen) {
  var recur = function recur2(y) {
    var xs = seen.concat([x]);
    return _includes(y, xs) ? "<Circular>" : _toString(y, xs);
  };
  var mapPairs = function(obj, keys4) {
    return _map(function(k) {
      return _quote(k) + ": " + recur(obj[k]);
    }, keys4.slice().sort());
  };
  switch (Object.prototype.toString.call(x)) {
    case "[object Arguments]":
      return "(function() { return arguments; }(" + _map(recur, x).join(", ") + "))";
    case "[object Array]":
      return "[" + _map(recur, x).concat(mapPairs(x, reject_default(function(k) {
        return /^\d+$/.test(k);
      }, keys_default(x)))).join(", ") + "]";
    case "[object Boolean]":
      return typeof x === "object" ? "new Boolean(" + recur(x.valueOf()) + ")" : x.toString();
    case "[object Date]":
      return "new Date(" + (isNaN(x.valueOf()) ? recur(NaN) : _quote(toISOString_default(x))) + ")";
    case "[object Null]":
      return "null";
    case "[object Number]":
      return typeof x === "object" ? "new Number(" + recur(x.valueOf()) + ")" : 1 / x === -Infinity ? "-0" : x.toString(10);
    case "[object String]":
      return typeof x === "object" ? "new String(" + recur(x.valueOf()) + ")" : _quote(x);
    case "[object Undefined]":
      return "undefined";
    default:
      if (typeof x.toString === "function") {
        var repr = x.toString();
        if (repr !== "[object Object]") {
          return repr;
        }
      }
      return "{" + mapPairs(x, keys_default(x)).join(", ") + "}";
  }
}
var toString2 = _curry1(function toString3(val) {
  return _toString(val, []);
});
var toString_default = toString2;
var curry = _curry1(function curry2(fn) {
  return curryN_default(fn.length, fn);
});
var curry_default = curry;
var converge = _curry2(function converge2(after, fns) {
  return curryN_default(reduce_default(max_default, 0, pluck_default("length", fns)), function() {
    var args = arguments;
    var context = this;
    return after.apply(context, _map(function(fn) {
      return fn.apply(context, args);
    }, fns));
  });
});
var converge_default = converge;
curry_default(function(pred, list) {
  return _reduce(function(a, e) {
    return pred(e) ? a + 1 : a;
  }, 0, list);
});
var XReduceBy = function() {
  function XReduceBy2(valueFn, valueAcc, keyFn, xf) {
    this.valueFn = valueFn;
    this.valueAcc = valueAcc;
    this.keyFn = keyFn;
    this.xf = xf;
    this.inputs = {};
  }
  XReduceBy2.prototype["@@transducer/init"] = xfBase_default.init;
  XReduceBy2.prototype["@@transducer/result"] = function(result) {
    var key;
    for (key in this.inputs) {
      if (_has(key, this.inputs)) {
        result = this.xf["@@transducer/step"](result, this.inputs[key]);
        if (result["@@transducer/reduced"]) {
          result = result["@@transducer/value"];
          break;
        }
      }
    }
    this.inputs = null;
    return this.xf["@@transducer/result"](result);
  };
  XReduceBy2.prototype["@@transducer/step"] = function(result, input) {
    var key = this.keyFn(input);
    this.inputs[key] = this.inputs[key] || [key, this.valueAcc];
    this.inputs[key][1] = this.valueFn(this.inputs[key][1], input);
    return result;
  };
  return XReduceBy2;
}();
var _xreduceBy = _curryN(4, [], function _xreduceBy2(valueFn, valueAcc, keyFn, xf) {
  return new XReduceBy(valueFn, valueAcc, keyFn, xf);
});
var xreduceBy_default = _xreduceBy;
var reduceBy = _curryN(
  4,
  [],
  _dispatchable([], xreduceBy_default, function reduceBy2(valueFn, valueAcc, keyFn, list) {
    return _reduce(function(acc, elt) {
      var key = keyFn(elt);
      var value = valueFn(_has(key, acc) ? acc[key] : _clone(valueAcc, [], []), elt);
      if (value && value["@@transducer/reduced"]) {
        return _reduced(acc);
      }
      acc[key] = value;
      return acc;
    }, {}, list);
  })
);
var reduceBy_default = reduceBy;
reduceBy_default(function(acc, elem) {
  return acc + 1;
}, 0);
add_default(-1);
var _Set = function() {
  function _Set2() {
    this._nativeSet = typeof Set === "function" ? /* @__PURE__ */ new Set() : null;
    this._items = {};
  }
  _Set2.prototype.add = function(item) {
    return !hasOrAdd(item, true, this);
  };
  _Set2.prototype.has = function(item) {
    return hasOrAdd(item, false, this);
  };
  return _Set2;
}();
function hasOrAdd(item, shouldAdd, set3) {
  var type3 = typeof item;
  var prevSize, newSize;
  switch (type3) {
    case "string":
    case "number":
      if (item === 0 && 1 / item === -Infinity) {
        if (set3._items["-0"]) {
          return true;
        } else {
          if (shouldAdd) {
            set3._items["-0"] = true;
          }
          return false;
        }
      }
      if (set3._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set3._nativeSet.size;
          set3._nativeSet.add(item);
          newSize = set3._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set3._nativeSet.has(item);
        }
      } else {
        if (!(type3 in set3._items)) {
          if (shouldAdd) {
            set3._items[type3] = {};
            set3._items[type3][item] = true;
          }
          return false;
        } else if (item in set3._items[type3]) {
          return true;
        } else {
          if (shouldAdd) {
            set3._items[type3][item] = true;
          }
          return false;
        }
      }
    case "boolean":
      if (type3 in set3._items) {
        var bIdx = item ? 1 : 0;
        if (set3._items[type3][bIdx]) {
          return true;
        } else {
          if (shouldAdd) {
            set3._items[type3][bIdx] = true;
          }
          return false;
        }
      } else {
        if (shouldAdd) {
          set3._items[type3] = item ? [false, true] : [true, false];
        }
        return false;
      }
    case "function":
      if (set3._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set3._nativeSet.size;
          set3._nativeSet.add(item);
          newSize = set3._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set3._nativeSet.has(item);
        }
      } else {
        if (!(type3 in set3._items)) {
          if (shouldAdd) {
            set3._items[type3] = [item];
          }
          return false;
        }
        if (!_includes(item, set3._items[type3])) {
          if (shouldAdd) {
            set3._items[type3].push(item);
          }
          return false;
        }
        return true;
      }
    case "undefined":
      if (set3._items[type3]) {
        return true;
      } else {
        if (shouldAdd) {
          set3._items[type3] = true;
        }
        return false;
      }
    case "object":
      if (item === null) {
        if (!set3._items["null"]) {
          if (shouldAdd) {
            set3._items["null"] = true;
          }
          return false;
        }
        return true;
      }
    default:
      type3 = Object.prototype.toString.call(item);
      if (!(type3 in set3._items)) {
        if (shouldAdd) {
          set3._items[type3] = [item];
        }
        return false;
      }
      if (!_includes(item, set3._items[type3])) {
        if (shouldAdd) {
          set3._items[type3].push(item);
        }
        return false;
      }
      return true;
  }
}
var Set_default = _Set;
var XDropRepeatsWith = function() {
  function XDropRepeatsWith2(pred, xf) {
    this.xf = xf;
    this.pred = pred;
    this.lastValue = void 0;
    this.seenFirstValue = false;
  }
  XDropRepeatsWith2.prototype["@@transducer/init"] = xfBase_default.init;
  XDropRepeatsWith2.prototype["@@transducer/result"] = xfBase_default.result;
  XDropRepeatsWith2.prototype["@@transducer/step"] = function(result, input) {
    var sameAsLast = false;
    if (!this.seenFirstValue) {
      this.seenFirstValue = true;
    } else if (this.pred(this.lastValue, input)) {
      sameAsLast = true;
    }
    this.lastValue = input;
    return sameAsLast ? result : this.xf["@@transducer/step"](result, input);
  };
  return XDropRepeatsWith2;
}();
var _xdropRepeatsWith = _curry2(function _xdropRepeatsWith2(pred, xf) {
  return new XDropRepeatsWith(pred, xf);
});
var xdropRepeatsWith_default = _xdropRepeatsWith;
var last = nth_default(-1);
var last_default = last;
var dropRepeatsWith = _curry2(
  _dispatchable([], xdropRepeatsWith_default, function dropRepeatsWith2(pred, list) {
    var result = [];
    var idx = 1;
    var len = list.length;
    if (len !== 0) {
      result[0] = list[0];
      while (idx < len) {
        if (!pred(last_default(result), list[idx])) {
          result[result.length] = list[idx];
        }
        idx += 1;
      }
    }
    return result;
  })
);
var dropRepeatsWith_default = dropRepeatsWith;
_curry1(
  _dispatchable(
    [],
    xdropRepeatsWith_default(equals_default),
    dropRepeatsWith_default(equals_default)
  )
);
var flip = _curry1(function flip2(fn) {
  return curryN_default(fn.length, function(a, b) {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = b;
    args[1] = a;
    return fn.apply(this, args);
  });
});
var flip_default = flip;
_curry2(
  _checkForMethod(
    "groupBy",
    reduceBy_default(function(acc, item) {
      acc.push(item);
      return acc;
    }, [])
  )
);
add_default(1);
reduceBy_default(function(acc, elem) {
  return elem;
}, null);
slice_default(0, -1);
var XUniqBy = function() {
  function XUniqBy2(f, xf) {
    this.xf = xf;
    this.f = f;
    this.set = new Set_default();
  }
  XUniqBy2.prototype["@@transducer/init"] = xfBase_default.init;
  XUniqBy2.prototype["@@transducer/result"] = xfBase_default.result;
  XUniqBy2.prototype["@@transducer/step"] = function(result, input) {
    return this.set.add(this.f(input)) ? this.xf["@@transducer/step"](result, input) : result;
  };
  return XUniqBy2;
}();
var _xuniqBy = _curry2(function _xuniqBy2(f, xf) {
  return new XUniqBy(f, xf);
});
var xuniqBy_default = _xuniqBy;
var uniqBy = _curry2(
  _dispatchable([], xuniqBy_default, function(fn, list) {
    var set3 = new Set_default();
    var result = [];
    var idx = 0;
    var appliedItem, item;
    while (idx < list.length) {
      item = list[idx];
      appliedItem = fn(item);
      if (set3.add(appliedItem)) {
        result.push(item);
      }
      idx += 1;
    }
    return result;
  })
);
var uniqBy_default = uniqBy;
var uniq = uniqBy_default(identity_default);
var uniq_default = uniq;
var invoker = _curry2(function invoker2(arity, method) {
  return curryN_default(arity + 1, function() {
    var target = arguments[arity];
    if (target != null && _isFunction(target[method])) {
      return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
    }
    throw new TypeError(toString_default(target) + ' does not have a method named "' + method + '"');
  });
});
var invoker_default = invoker;
invoker_default(1, "join");
var juxt = _curry1(function juxt2(fns) {
  return converge_default(function() {
    return Array.prototype.slice.call(arguments, 0);
  }, fns);
});
var juxt_default = juxt;
reduce_default(add_default, 0);
var multiply = _curry2(function multiply2(a, b) {
  return a * b;
});
var multiply_default = multiply;
function _createPartialApplicator(concat3) {
  return _curry2(function(fn, args) {
    return _arity(Math.max(0, fn.length - args.length), function() {
      return fn.apply(this, concat3(args, arguments));
    });
  });
}
_createPartialApplicator(
  flip_default(_concat)
);
juxt_default([filter_default, reject_default]);
var pickAll = _curry2(function pickAll2(names2, obj) {
  var result = {};
  var idx = 0;
  var len = names2.length;
  while (idx < len) {
    var name = names2[idx];
    result[name] = obj[name];
    idx += 1;
  }
  return result;
});
var pickAll_default = pickAll;
reduce_default(multiply_default, 1);
var useWith = _curry2(function useWith2(fn, transformers) {
  return curryN_default(transformers.length, function() {
    var args = [];
    var idx = 0;
    while (idx < transformers.length) {
      args.push(transformers[idx].call(this, arguments[idx]));
      idx += 1;
    }
    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, transformers.length)));
  });
});
var useWith_default = useWith;
useWith_default(_map, [pickAll_default, identity_default]);
invoker_default(1, "split");
invoker_default(0, "toLowerCase");
invoker_default(0, "toUpperCase");
curryN_default(4, function transduce2(xf, fn, acc, list) {
  return _reduce(xf(typeof fn === "function" ? _xwrap(fn) : fn), acc, list);
});
_curry2(
  compose(uniq_default, _concat)
);
chain_default(_identity);
const HTML_ELEMENT_CONSTRUCTORS = ["HTMLAnchorElement", "HTMLAreaElement", "HTMLAudioElement", "HTMLBaseElement", "HTMLBodyElement", "HTMLBRElement", "HTMLButtonElement", "HTMLCanvasElement", "HTMLContentElement", "HTMLDataElement", "HTMLDataListElement", "HTMLDialogElement", "HTMLDivElement", "HTMLDListElement", "HTMLElement", "HTMLEmbedElement", "HTMLFieldSetElement", "HTMLFormElement", "HTMLFrameSetElement", "HTMLHeadElement", "HTMLHeadingElement", "HTMLHRElement", "HTMLHtmlElement", "HTMLIFrameElement", "HTMLImageElement", "HTMLInputElement", "HTMLLabelElement", "HTMLLegendElement", "HTMLLIElement", "HTMLLinkElement", "HTMLMapElement", "HTMLMediaElement", "HTMLMetaElement", "HTMLMeterElement", "HTMLModElement", "HTMLObjectElement", "HTMLOListElement", "HTMLOptGroupElement", "HTMLOptionElement", "HTMLOutputElement", "HTMLParagraphElement", "HTMLPictureElement", "HTMLPreElement", "HTMLProgressElement", "HTMLQuoteElement", "HTMLScriptElement", "HTMLSelectElement", "HTMLShadowElement", "HTMLSourceElement", "HTMLSpanElement", "HTMLStyleElement", "HTMLTableCaptionElement", "HTMLTableCellElement", "HTMLTableColElement", "HTMLTableElement", "HTMLTableRowElement", "HTMLTableSectionElement", "HTMLTextAreaElement", "HTMLTemplateElement", "HTMLTimeElement", "HTMLTitleElement", "HTMLTrackElement", "HTMLUListElement", "HTMLUnknownElement", "HTMLVideoElement", "HTMLDetailsElement", "HTMLDirectoryElement", "HTMLMenuElement", "HTMLSlotElement", "HTMLMarqueeElement", "HTMLFontElement", "HTMLFrameElement", "HTMLIsIndexElement", "HTMLMenuItemElement"];
const DOCUMENT_OBJECT_CONSTRUCTORS = ["AbortController", "AbortSignal", "AbstractRange", "Attr", "CDATASection", "CharacterData", "Comment", "CustomEvent", "Document", "DocumentFragment", "DocumentType", "DOMError", "DOMException", "DOMImplementation", "DOMParser", "DOMPoint", "DOMPointReadOnly", "DOMRect", "DOMTokenList", "Element", "Event", "EventTarget", "HTMLCollection", "MutationObserver", "NamedNodeMap", "Node", "NodeIterator", "NodeList", "ProcessingInstruction", "Range", "StaticRange", "Text", "TextDecoder", "TextEncoder", "TimeRanges", "TreeWalker", "XMLDocument", "Selection", "ShadowRoot"];
const UIEVENT_OBJECT_CONSTRUCTORS = ["CompositionEvent", "FocusEvent", "InputEvent", "KeyboardEvent", "MouseEvent", "MouseScrollEvent", "MutationEvent", "UIEvent", "WheelEvent"];
const DefaultInstanceofPatchList = [...HTML_ELEMENT_CONSTRUCTORS, ...UIEVENT_OBJECT_CONSTRUCTORS, ...DOCUMENT_OBJECT_CONSTRUCTORS];
const InstanceofPlugin = (config2 = {}) => {
  const patchList = uniq_default([...DefaultInstanceofPatchList, ...config2.patchList || []]);
  return simpleJsBeforeLoader((appWindow) => {
    const global2 = appWindow.__WUJIE.proxy;
    const rawHasInstance = global2.Object[global2.Symbol.hasInstance];
    const patchInstanceof = (prop3, rawHasInstance2) => {
      var _a, _b;
      const target = global2[prop3];
      if (!target)
        return;
      global2[prop3] = new Proxy(target, {
        get(target2, p, receiver) {
          if (p === global2.Symbol.hasInstance) {
            return (element2) => {
              if (rawHasInstance2.call(target2, element2))
                return true;
              if (element2 instanceof global2.parent[prop3])
                return true;
              return false;
            };
          }
          return Reflect.get(target2, p, receiver);
        }
      });
      if ((_b = (_a = global2[prop3]) == null ? void 0 : _a.prototype) == null ? void 0 : _b.constructor)
        global2[prop3].prototype.constructor = global2[prop3];
    };
    patchList.forEach((prop3) => patchInstanceof(prop3, rawHasInstance));
  });
};
function create_fragment$6(ctx) {
  let wujiesvelte;
  let current;
  wujiesvelte = new Wujie_svelte({
    props: {
      width: "100%",
      height: "100%",
      name: "app-manage",
      url: (
        /*props*/
        ctx[0].url
      ),
      sync: true,
      alive: true,
      props: (
        /*props*/
        ctx[0]
      ),
      plugins: [InstanceofPlugin()]
    }
  });
  return {
    c() {
      create_component(wujiesvelte.$$.fragment);
    },
    m(target, anchor) {
      mount_component(wujiesvelte, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(wujiesvelte.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(wujiesvelte.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(wujiesvelte, detaching);
    }
  };
}
function instance$4($$self) {
  const cache = localStorage.getItem("wujie-test-config") || "{}";
  const params2 = JSON.parse(cache);
  if (!params2.env) {
    KMessage({
      content: "请点击设置，选择运行环境",
      type: "warning",
      target: document.body
    });
    params2.env = {};
  }
  const props = {
    ...JSON.parse(cache),
    groupId: "267356",
    brandId: params2.env.brandId,
    brandName: params2.env.brandName,
    token: params2.token,
    url: params2.env.abTestUrl,
    parentName: "comm",
    redirectUrl: "/app-manage"
  };
  return [props];
}
class App_manage extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$6, safe_not_equal, {});
  }
}
function create_fragment$5(ctx) {
  let wujiesvelte;
  let current;
  wujiesvelte = new Wujie_svelte({
    props: {
      width: "100%",
      height: "100%",
      name: "app-experiment",
      url: (
        /*props*/
        ctx[0].url
      ),
      alive: true,
      sync: true,
      props: (
        /*props*/
        ctx[0]
      ),
      plugins: [InstanceofPlugin()]
    }
  });
  return {
    c() {
      create_component(wujiesvelte.$$.fragment);
    },
    m(target, anchor) {
      mount_component(wujiesvelte, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(wujiesvelte.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(wujiesvelte.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(wujiesvelte, detaching);
    }
  };
}
function instance$3($$self) {
  const cache = localStorage.getItem("wujie-test-config") || "{}";
  const params2 = JSON.parse(cache);
  if (!params2.env) {
    KMessage({
      content: "请点击设置，选择运行环境",
      type: "warning",
      target: document.body
    });
    params2.env = {};
  }
  const props = {
    ...JSON.parse(cache),
    groupId: "267356",
    brandId: params2.env.brandId,
    brandName: params2.env.brandName,
    token: params2.token,
    url: params2.env.abTestUrl,
    parentName: "comm",
    redirectUrl: "/experiment-manage/list"
  };
  return [props];
}
class Layer extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$5, safe_not_equal, {});
  }
}
function create_fragment$4(ctx) {
  let div2;
  return {
    c() {
      div2 = element("div");
      div2.textContent = "user-label";
    },
    m(target, anchor) {
      insert(target, div2, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
    }
  };
}
class User_label extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment$4, safe_not_equal, {});
  }
}
function create_fragment$3(ctx) {
  let wujiesvelte;
  let current;
  wujiesvelte = new Wujie_svelte({
    props: {
      width: "100%",
      height: "100%",
      name: "user-tower",
      url: (
        /*props*/
        ctx[0].url
      ),
      props: (
        /*props*/
        ctx[0]
      ),
      plugins: [InstanceofPlugin()]
    }
  });
  return {
    c() {
      create_component(wujiesvelte.$$.fragment);
    },
    m(target, anchor) {
      mount_component(wujiesvelte, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(wujiesvelte.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(wujiesvelte.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(wujiesvelte, detaching);
    }
  };
}
function instance$2($$self) {
  const cache = localStorage.getItem("wujie-test-config") || "{}";
  const params2 = JSON.parse(cache);
  if (!params2.env) {
    KMessage({
      content: "请点击设置，选择运行环境",
      type: "warning",
      target: document.body
    });
    params2.env = {};
  }
  const props = {
    ...JSON.parse(cache),
    groupId: "267356",
    brandId: params2.env.brandId,
    brandName: params2.env.brandName,
    token: params2.token,
    url: params2.env.abTestUrl,
    parentName: "comm",
    redirectUrl: "/crowd"
  };
  console.log("props：", props);
  return [props];
}
class User_tower extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$3, safe_not_equal, {});
  }
}
function create_fragment$2(ctx) {
  let div2;
  return {
    c() {
      div2 = element("div");
      div2.textContent = "crowd-insight";
    },
    m(target, anchor) {
      insert(target, div2, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
    }
  };
}
class Crowd_insight extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment$2, safe_not_equal, {});
  }
}
const RouterConfig = {
  "/": Home,
  "/home": Home,
  "/ab-test/app-manage": App_manage,
  "/ab-test/experiment": Layer,
  "/user-tower/tower": User_tower,
  "/user-tower/label": User_label,
  "/user-tower/crowd-insight": Crowd_insight
};
const ENV_CONFIG = [
  {
    label: "本地",
    value: "http://192.168.125.241:3012/user-tower/auth-redirect",
    dataPortalUrl: "http://localhost:3014/transfer.html#",
    commRedirectUrl: "https://web-dev.shuxinyc.shop/#/",
    abTestUrl: "http://localhost:9100/abtest-web/transfer.html#/auth-redirect",
    brandId: 351503,
    brandName: "李与白"
  },
  {
    label: "开发",
    value: "https://cdp-dev.shuxinyc.shop/user-tower/auth-redirect",
    dataPortalUrl: "https://data-portal-dev.shuxinyc.shop/transfer.html#",
    commRedirectUrl: "https://web-dev.shuxinyc.shop/#/",
    abTestUrl: "https://abtest-mng-dev.shuxinyc.shop/abtest-web/transfer.html#/auth-redirect",
    brandId: 351503,
    brandName: "李与白"
  },
  {
    label: "测试",
    value: "https://cdp-qa.shuxinyc.shop/user-tower/auth-redirect",
    dataPortalUrl: "https://data-portal-qa.shuxinyc.shop/transfer.html#",
    commRedirectUrl: "https://web-test.shuxinyc.shop/#/",
    abTestUrl: "https://abtest-mng-qa.shuxinyc.shop/abtest-web/transfer.html#/auth-redirect",
    brandId: 351503,
    brandName: "李与白"
  },
  {
    label: "生产",
    value: "https://cdp.shuxinyc.shop/user-tower/auth-redirect",
    dataPortalUrl: "https://data-portal.shuxinyc.shop/transfer.html#",
    commRedirectUrl: "https://web.shuxinyc.shop/#/",
    abTestUrl: "https://abtest-mng.shuxinyc.shop/abtest-web/transfer.html#/auth-redirect",
    disabled: true,
    brandId: 351503,
    brandName: "李与白"
  }
];
function create_default_slot_5(ctx) {
  let kselect;
  let current;
  kselect = new Dist$3({
    props: {
      clearable: true,
      key: "value",
      dataList: ENV_CONFIG
    }
  });
  return {
    c() {
      create_component(kselect.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kselect, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(kselect.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kselect.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kselect, detaching);
    }
  };
}
function create_default_slot_4(ctx) {
  let kinput;
  let current;
  kinput = new Dist$6({
    props: { placeholder: "请输入集团ID", disabled: true }
  });
  return {
    c() {
      create_component(kinput.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kinput, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(kinput.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kinput.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kinput, detaching);
    }
  };
}
function create_default_slot_3(ctx) {
  let kinput;
  let current;
  kinput = new Dist$6({ props: { placeholder: "请输入平台token" } });
  return {
    c() {
      create_component(kinput.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kinput, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(kinput.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kinput.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kinput, detaching);
    }
  };
}
function create_default_slot_2$1(ctx) {
  let t;
  return {
    c() {
      t = text("确认");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_default_slot_1$1(ctx) {
  let kbutton;
  let current;
  kbutton = new Dist$a({
    props: {
      $$slots: { default: [create_default_slot_2$1] },
      $$scope: { ctx }
    }
  });
  kbutton.$on(
    "click",
    /*handleValidate*/
    ctx[2]
  );
  return {
    c() {
      create_component(kbutton.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kbutton, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kbutton_changes = {};
      if (dirty & /*$$scope*/
      32) {
        kbutton_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kbutton.$set(kbutton_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kbutton.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kbutton.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kbutton, detaching);
    }
  };
}
function create_default_slot$1(ctx) {
  let kformitem0;
  let t0;
  let kformitem1;
  let t1;
  let kformitem2;
  let t2;
  let kformitem3;
  let current;
  kformitem0 = new Form_item({
    props: {
      field: "env",
      label: "系统环境:",
      $$slots: { default: [create_default_slot_5] },
      $$scope: { ctx }
    }
  });
  kformitem1 = new Form_item({
    props: {
      field: "groupId",
      label: "集团ID:",
      $$slots: { default: [create_default_slot_4] },
      $$scope: { ctx }
    }
  });
  kformitem2 = new Form_item({
    props: {
      field: "token",
      label: "平台token:",
      $$slots: { default: [create_default_slot_3] },
      $$scope: { ctx }
    }
  });
  kformitem3 = new Form_item({
    props: {
      $$slots: { default: [create_default_slot_1$1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(kformitem0.$$.fragment);
      t0 = space();
      create_component(kformitem1.$$.fragment);
      t1 = space();
      create_component(kformitem2.$$.fragment);
      t2 = space();
      create_component(kformitem3.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kformitem0, target, anchor);
      insert(target, t0, anchor);
      mount_component(kformitem1, target, anchor);
      insert(target, t1, anchor);
      mount_component(kformitem2, target, anchor);
      insert(target, t2, anchor);
      mount_component(kformitem3, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const kformitem0_changes = {};
      if (dirty & /*$$scope*/
      32) {
        kformitem0_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kformitem0.$set(kformitem0_changes);
      const kformitem1_changes = {};
      if (dirty & /*$$scope*/
      32) {
        kformitem1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kformitem1.$set(kformitem1_changes);
      const kformitem2_changes = {};
      if (dirty & /*$$scope*/
      32) {
        kformitem2_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kformitem2.$set(kformitem2_changes);
      const kformitem3_changes = {};
      if (dirty & /*$$scope*/
      32) {
        kformitem3_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kformitem3.$set(kformitem3_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kformitem0.$$.fragment, local);
      transition_in(kformitem1.$$.fragment, local);
      transition_in(kformitem2.$$.fragment, local);
      transition_in(kformitem3.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kformitem0.$$.fragment, local);
      transition_out(kformitem1.$$.fragment, local);
      transition_out(kformitem2.$$.fragment, local);
      transition_out(kformitem3.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(t1);
        detach(t2);
      }
      destroy_component(kformitem0, detaching);
      destroy_component(kformitem1, detaching);
      destroy_component(kformitem2, detaching);
      destroy_component(kformitem3, detaching);
    }
  };
}
function create_fragment$1(ctx) {
  let div2;
  let kform;
  let current;
  let kform_props = {
    initValue: (
      /*initValue*/
      ctx[1]
    ),
    $$slots: { default: [create_default_slot$1] },
    $$scope: { ctx }
  };
  kform = new Form({ props: kform_props });
  ctx[3](kform);
  return {
    c() {
      div2 = element("div");
      create_component(kform.$$.fragment);
      attr(div2, "class", "fcc");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      mount_component(kform, div2, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      const kform_changes = {};
      if (dirty & /*$$scope*/
      32) {
        kform_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kform.$set(kform_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kform.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kform.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      ctx[3](null);
      destroy_component(kform);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  const cache = localStorage.getItem("wujie-test-config");
  const initValue = cache ? JSON.parse(cache) : { env: "", groupId: "267356", token: "" };
  let KFormInst = void 0;
  const handleValidate = () => {
    if (KFormInst) {
      KFormInst.validateForm((data, isValid) => {
        if (isValid) {
          localStorage.setItem("wujie-test-config", JSON.stringify(data));
          window.location.reload();
        }
      });
    }
  };
  function kform_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      KFormInst = $$value;
      $$invalidate(0, KFormInst);
    });
  }
  return [KFormInst, initValue, handleValidate, kform_binding];
}
class Config extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
  }
}
function create_default_slot_2(ctx) {
  let t;
  return {
    c() {
      t = text("设置");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_default_slot_1(ctx) {
  let kmenuitem;
  let current;
  kmenuitem = new Item2({
    props: { items: menuItems, ctxKey: "inline" }
  });
  return {
    c() {
      create_component(kmenuitem.$$.fragment);
    },
    m(target, anchor) {
      mount_component(kmenuitem, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(kmenuitem.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kmenuitem.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(kmenuitem, detaching);
    }
  };
}
function create_default_slot(ctx) {
  let config2;
  let current;
  config2 = new Config({});
  return {
    c() {
      create_component(config2.$$.fragment);
    },
    m(target, anchor) {
      mount_component(config2, target, anchor);
      current = true;
    },
    i(local) {
      if (current) return;
      transition_in(config2.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(config2.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(config2, detaching);
    }
  };
}
function create_fragment(ctx) {
  let div3;
  let div1;
  let div0;
  let kbutton;
  let t0;
  let kmenu;
  let t1;
  let div2;
  let router;
  let t2;
  let kdrawer;
  let current;
  kbutton = new Dist$a({
    props: {
      icon: "i-carbon-settings",
      type: "primary",
      cls: "m-2 w-full",
      $$slots: { default: [create_default_slot_2] },
      $$scope: { ctx }
    }
  });
  kbutton.$on(
    "click",
    /*open*/
    ctx[3]
  );
  kmenu = new Dist13({
    props: {
      mode: "inline",
      selectedUids: (
        /*selectedUidPaths*/
        ctx[2]
      ),
      openUids: (
        /*selectedUidPaths*/
        ctx[2]
      ),
      ctxKey: "inline",
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx }
    }
  });
  kmenu.$on(
    "select",
    /*handleMenuClick*/
    ctx[1]
  );
  router = new Router({ props: { routes: RouterConfig } });
  kdrawer = new Dist$7({
    props: {
      value: (
        /*show*/
        ctx[0]
      ),
      cls: "!w-[350px] !min-w-[300px]",
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  kdrawer.$on(
    "close",
    /*close*/
    ctx[4]
  );
  return {
    c() {
      div3 = element("div");
      div1 = element("div");
      div0 = element("div");
      create_component(kbutton.$$.fragment);
      t0 = space();
      create_component(kmenu.$$.fragment);
      t1 = space();
      div2 = element("div");
      create_component(router.$$.fragment);
      t2 = space();
      create_component(kdrawer.$$.fragment);
      attr(div0, "class", "w-full fcc");
      attr(div1, "class", "w-300px h-full border-0 border-r-1px border-gray-200 border-solid");
      attr(div2, "class", "h-full w-full");
      attr(div3, "class", "w-full h-full flex p-0");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div1);
      append(div1, div0);
      mount_component(kbutton, div0, null);
      append(div1, t0);
      mount_component(kmenu, div1, null);
      append(div3, t1);
      append(div3, div2);
      mount_component(router, div2, null);
      insert(target, t2, anchor);
      mount_component(kdrawer, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const kbutton_changes = {};
      if (dirty & /*$$scope*/
      64) {
        kbutton_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kbutton.$set(kbutton_changes);
      const kmenu_changes = {};
      if (dirty & /*$$scope*/
      64) {
        kmenu_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kmenu.$set(kmenu_changes);
      const kdrawer_changes = {};
      if (dirty & /*show*/
      1) kdrawer_changes.value = /*show*/
      ctx2[0];
      if (dirty & /*$$scope*/
      64) {
        kdrawer_changes.$$scope = { dirty, ctx: ctx2 };
      }
      kdrawer.$set(kdrawer_changes);
    },
    i(local) {
      if (current) return;
      transition_in(kbutton.$$.fragment, local);
      transition_in(kmenu.$$.fragment, local);
      transition_in(router.$$.fragment, local);
      transition_in(kdrawer.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(kbutton.$$.fragment, local);
      transition_out(kmenu.$$.fragment, local);
      transition_out(router.$$.fragment, local);
      transition_out(kdrawer.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div3);
        detach(t2);
      }
      destroy_component(kbutton);
      destroy_component(kmenu);
      destroy_component(router);
      destroy_component(kdrawer, detaching);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  const handleMenuClick = (item) => {
    localStorage.setItem("wujie-test-select", JSON.stringify(item.detail.uidPath));
    push(item.detail.item.path);
  };
  const selectedUidPathsCache = localStorage.getItem("wujie-test-select") || '["首页"]';
  const selectedUidPaths = JSON.parse(selectedUidPathsCache);
  localStorage.setItem("wujie-test-select", JSON.stringify(selectedUidPaths));
  let show = false;
  const open = () => $$invalidate(0, show = true);
  const close = () => $$invalidate(0, show = false);
  return [show, handleMenuClick, selectedUidPaths, open, close];
}
class App extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
new App({
  target: document.getElementById("app")
});
