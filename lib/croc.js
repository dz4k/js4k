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
 * style: ''                             a CSSStyleDeclaration
 * h: a function to create an element with attributes and children
 *    can also be used to update an existing element
 * next, prev: get the next/previous (by DOM order) element matching a selector
 */
export const
  set = Object.assign,
  $ = (sel, scope = document) => scope.querySelector(sel),
  $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)],
  $$1 = (sel, scope = document.documentElement) =>
    (scope.matches(sel) ? [scope] : []).concat(...scope.querySelectorAll(sel)),
  $x = (xp, scope = document) =>
    document.evaluate(xp, scope, null, 9).singleNodeValue,
  $$x = (xp, scope = document) => {
    let a = [], it = document.evaluate(xp, scope, null, 4), el
    while ((el = it.iterateNext())) a.push(el); return a },
  on = (el, t, f, opts = {}) =>
    (el.addEventListener(t, f, opts), [el, t, f, opts]),
  off = (el, t, f, opts = {}) =>
    (el.removeEventListener(t, f, opts), [el, t, f, opts]),
  dispatch = (el, t, opts = {}) => el.dispatchEvent(new CustomEvent(t, opts)),
  root = el => { let r = el.getRootNode();
    return r instanceof Element ? document : r },
  strify = s => s === null || s === undefined ? '' :
    typeof obj[Symbol.iterator] === 'function' ? [...obj].join(', ') :
    String(obj)
  trustedHtml = Symbol("Trusted HTML"),
  htmlTrust = s => set(new String(s), { [trustedHtml]: true })
  htmlEscape = s => s?.[trustedHtml] ? s :
    htmlTrust(strify(s).replace(/[&<>"']/g, m => `&#${m.charCodeAt(0)};`)),
  html = (s, ...i) => htmlTrust(String.raw(s, ...i.map(htmlEscape))),
  htmlParse = s => set(h("template"), { innerHTML: s }).content
  h = (t, ...c) => {
    const el = t instanceof Element ? t : document.createElement(t)
    if (c[0]?.constructor === Object) Object.entries(c.shift())
      .forEach(([k, v]) => el.setAttribute(k, v))
    el.append.apply(el, c)
    return el },
  css = (s, ...i) => { const v = new CSSStyleSheet;
    v.replaceSync(String.raw(s, ...i)); return v },
  style = (s, ...i) => set(new CSSStyleDeclaration(),
    { cssText: String.raw(s, ...i) }),
  next = (...args) => traverse("next", ...args),
  prev = (...args) => traverse("previous", ...args),
  traverse = (dir, sel, { from: c, root = root(c), wrap = true } = {}) => {
    const move = dir + "ElementSibling", wrapIt = () =>
      !wrap ? null : dir === "next" ? $(sel, root) : $$(sel, root).at(-1)
    if (!c) return wrapIt();
    for (;;) {
      while (c[move] === null)
        if ((c = c.parentElement ?? root) === root) return wrapIt()
      const found = (c = c[move]).matches(sel) ? c : $(sel, c)
      if (found) return found } }
