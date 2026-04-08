/* croc: a grab-bag of DOM utilities written in a terse style
 * By Deniz <https://dz4k.com> <https://dz4k.dev>
 * set: Object.assign
 * $, $$: querySelector and [...querySelectorAll]
 * $x, $$x: XPath equivalents of $ and $$
 * on: add an event listener
 * dispatch: dispatch a custom event
 * root: get root node (document or shadow root) from a node
 * strify: stringify a value for use in templates
 * trustedHtml: symbol marking trusted HTML
 * htmlTrust: mark a string as trusted HTML
 * htmlEscape: escape HTML special characters
 * html: a template literal tag to create HTML safely
 * htmlParse: liven an HTML string into DOM nodes
 * css: a template literal tag to create a CSSStyleSheet
 * h: a function to create an element with attributes and children
 *    can also be used to update an existing element
 * next, prev: get the next/previous (by DOM order) element matching a selector
 */
export let
  set = Object.assign,
  d = document,
  is = (x, type) => x instanceof type,
  $ = (sel, scope = d) => scope.querySelector(sel),
  $$ = (sel, scope = d) => [...scope.querySelectorAll(sel)],
  $$1 = (sel, scope = d.documentElement) =>
    (scope.matches(sel) ? [scope] : []).concat(...scope.querySelectorAll(sel)),
  $x = (xp, scope = d) =>
  d.evaluate(xp, scope, null, 9).singleNodeValue,
  $$x = (xp, scope = d) => {
    let a = [], it = d.evaluate(xp, scope, null, 4), el
    while ((el = it.iterateNext())) a.push(el); return a },
  on = (el, t, f, opts = {}) =>
    (el.addEventListener(t, f, opts), [el, t, f, opts]),
  off = (el, t, f, opts = {}) =>
    (el.removeEventListener(t, f, opts), [el, t, f, opts]),
  dispatch = (el, t, opts = {}) => el.dispatchEvent(new CustomEvent(t, opts)),
  root = /** @type {(el:Element) => Document | ShadowRoot} */
    (el, r = el.getRootNode()) => is(r, Element) ? d : r,
  strify = s => s === null || s === undefined ? '' :
    typeof s === 'string' ? s :
    typeof s[Symbol.iterator] === 'function' ? [...s].join(', ') :
    String(s),
  trustedHtml = Symbol(),
  htmlTrust = s => set(new String(strify(s)), { [trustedHtml]: true }),
  htmlEscape = s => s?.[trustedHtml] ? s :
    htmlTrust(strify(s).replace(/[&<>"']/g, m => `&#${m.charCodeAt(0)};`)),
  html = (s, ...i) => htmlTrust(String.raw(s, ...i.map(htmlEscape))),
  htmlParse = s => set(h("template"), { innerHTML: s }).content,
  h = (t, ...c) => {
    let el = is(t, Element) ? t : d.createElement(t)
    if (c[0]?.constructor === Object) Object.entries(c.shift())
      .forEach(([k, v]) => el.setAttribute(k, v))
    el.append(...c)
    return el },
  css = (s, ...i) => { let v = new CSSStyleSheet;
    v.replaceSync(String.raw(s, ...i)); return v },
  next = (...args) => traverse("next", ...args),
  prev = (...args) => traverse("previous", ...args),
  traverse = (dir, sel, { from: c, root: r = root(c), wrap = true } = {}) => {
    let move = dir + "ElementSibling", wrapIt = () =>
      !wrap ? null : dir === "next" ? $(sel, r) : $$(sel, r).at(-1)
    if (!c) return wrapIt();
    for (;;) {
      while (c[move] === null)
        if ((c = c.parentElement ?? r) === r) return wrapIt()
      let found = (c = c[move]).matches(sel) ? c : $(sel, c)
      if (found) return found } }
