/* =============================================================================
 * core/dom.js — 极简 DOM helper（运行时 Agent 拥有）
 *
 * 公开 API：
 *   h(tag, props?, ...children) -> HTMLElement
 *   svg(tag, props?, ...children) -> SVGElement
 *   on(el, event, fn, opts?) -> () => void   （返回解绑函数）
 *   $(selector, root=document) -> Element|null
 *   $$(selector, root=document) -> Element[]  （返回真数组）
 *   frag(...children) -> DocumentFragment
 *
 * 约定：
 *   - props 为对象时处理：class/className、style(对象或字符串)、
 *     dataset(对象)、html、text、事件(onClick 等)、以及任意属性(含 aria-*、role)。
 *   - 若第二个参数是字符串，则视为文本内容（第一个 child）。
 *     例：h('p', 'hello') 等同于 h('p', null, 'hello')。
 *   - children 可混合：字符串 / 数字 / Node / 数组(会扁平化) / null / undefined / false。
 * ========================================================================== */

const SVG_NS = "http://www.w3.org/2000/svg";

function isNode(x) {
  return x != null && typeof x === "object" && typeof x.nodeType === "number";
}

function applyAttrs(el, attrs, isSvg) {
  if (!attrs) return;
  for (const key of Object.keys(attrs)) {
    const val = attrs[key];
    if (val == null || val === false) {
      // false / null / undefined：不设置（布尔属性为 false 时移除）
      if (val === false && !isSvg) {
        // 仅对已知布尔属性显式移除
        if (key === "disabled" || key === "checked" || key === "hidden") {
          el.removeAttribute(key);
        }
      }
      continue;
    }

    // 事件监听：onClick / onInput / onKeydown ...
    if (key.length > 2 && key.startsWith("on") && typeof val === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), val);
      continue;
    }

    if (key === "class" || key === "className") {
      el.setAttribute("class", val);
      continue;
    }
    if (key === "style") {
      if (typeof val === "string") {
        el.style.cssText = val;
      } else if (typeof val === "object") {
        for (const p of Object.keys(val)) {
          if (val[p] != null) el.style.setProperty(p, String(val[p]));
        }
      }
      continue;
    }
    if (key === "dataset" && typeof val === "object") {
      for (const d of Object.keys(val)) {
        if (val[d] != null) el.dataset[d] = String(val[d]);
      }
      continue;
    }
    if (key === "html") {
      el.innerHTML = val;
      continue;
    }
    if (key === "text") {
      el.textContent = val;
      continue;
    }

    // 布尔属性：true 时只写属性名
    if (val === true) {
      el.setAttribute(key, "");
      continue;
    }

    // 其余：普通属性（id, href, type, role, aria-*, viewBox, ...）
    if (isSvg) {
      el.setAttribute(key, String(val));
    } else {
      el.setAttribute(key, String(val));
    }
  }
}

function appendChildren(el, children) {
  const flat = [];
  const walk = (c) => {
    if (c == null || c === false || c === true) return;
    if (Array.isArray(c)) {
      c.forEach(walk);
    } else if (isNode(c)) {
      flat.push(c);
    } else {
      flat.push(document.createTextNode(String(c)));
    }
  };
  walk(children);
  flat.forEach((n) => el.appendChild(n));
}

/**
 * 判断第二个参数是不是"属性对象"。
 * 只有普通对象才算；数组、DOM 节点、字符串、数字都不是。
 * ★ 数组必须排除：h('tbody', rows.map(...)) 是很自然的写法，
 *   而 Array 的 typeof 也是 "object"，不排除就会被当成 attrs，
 *   结果是子节点全部丢失（元素上出现 0="[object HTMLTableRowElement]" 这种属性）。
 */
function isPropsObject(x) {
  return x != null && typeof x === "object" && !Array.isArray(x) && !isNode(x);
}

export function h(tag, props, ...rest) {
  const attrs = isPropsObject(props) ? props : null;
  const children = isPropsObject(props) ? rest : (props == null ? rest : [props, ...rest]);
  const el = document.createElement(tag);
  applyAttrs(el, attrs, false);
  appendChildren(el, children);
  return el;
}

export function svg(tag, props, ...rest) {
  const attrs = isPropsObject(props) ? props : null;
  const children = isPropsObject(props) ? rest : (props == null ? rest : [props, ...rest]);
  const el = document.createElementNS(SVG_NS, tag);
  applyAttrs(el, attrs, true);
  appendChildren(el, children);
  return el;
}

export function on(el, event, fn, opts) {
  el.addEventListener(event, fn, opts);
  return () => el.removeEventListener(event, fn, opts);
}

export function $(selector, root = document) {
  return root ? root.querySelector(selector) : null;
}

export function $$(selector, root = document) {
  return root ? Array.from(root.querySelectorAll(selector)) : [];
}

export function frag(...children) {
  const f = document.createDocumentFragment();
  appendChildren(f, children);
  return f;
}

export default { h, svg, on, $, $$, frag };
