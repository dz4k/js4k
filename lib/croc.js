/* croc: a grab-bag of DOM utilities written in a terse style
 * By Deniz <https://dz4k.com> <https://dz4k.dev>
 * $ and $$: querySelector and [...querySelectorAll]
 * $x and $$x: XPath equivalents of $ and $$
 * root, head, body: document.documentElement, .head, .body
 * at: get or set an attribute
 * on: add an event listener
 * halt: prevent default, stop propagation, or both with a string
 *  e.g. halt(e, "default bubbling propagation")
 * dispatch: dispatch a custom event
 * mkid: make a random id
 * identify: ensure an element has an id, and return that id
 * htmlesc: escape HTML special characters
 * trustHtml: mark a string as trusted HTML, not to be escaped
 * html: a template literal tag to create HTML safely
 * h: a function to create an element with children and attributes
 * css: a template literal tag to create a CSSStyleSheet
 * style: a template literal tag to create a CSSStyleDeclaration
 * next, prev: get the next/previous (by DOM order) element matching a selector
 */
Object.assign(window, new class {
  $ = (sel, scope = document) => scope.querySelector(sel)
  $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)]
  $x = (xp, scope = document) => 
    document.evaluate(xp, scope, null, 9).singleNodeValue
  $$x = (xp, scope = document) => {
    const it = document.evaluate(xp, scope, null, 4), a = [];
    let el; while ((el = it.iterateNext())) a.push(el); return a }
  at = (el, name, value) => value === undefined ?
    el.getAttribute(name) : el.setAttribute(name, value)
  on = (el, type, f, options = {}) => el.addEventListener(type, f, options)
  dispatch = (el, ty, opts = {}) => el.dispatchEvent(new CustomEvent(ty, opts))
  mkid = () => Array.from({ length: 21 }, () =>
    'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
      .at((Math.random() * 64) | 0)).join("")
  identify = el => el.id ||= this.mkid()
  #trustedHtml = Symbol()
  trustHtml = s => Object.assign(new String(s), { [this.#trustedHtml]: true })
  htmlEscape = s => s[this.#trustedHtml] ? s :
    String(s).replace(/[&<>"'"]/g, m => `&#${m.charCodeAt(0)};`)
  html = (s, ...i) => this.trustHtml(String.raw(s, ...i.map(this.htmlEscape)))
  h = (tagName, ...children) => { const el = document.createElement(tagName)
    if (typeof children[0] !== 'string' && !(children[0] instanceof Node))
      Object.entries(children.shift()).forEach(([k, v]) => this.at(el, k, v))
    el.append.apply(el, children)
    return el }
  css = (s, ...i) => { const v = new CSSStyleSheet;
    v.replaceSync(String.raw(s, ...i)); return v }
  style = (s, ...i) => Object.assign(new CSSStyleDeclaration,
    { cssText: String.raw(s, ...i) })
  next = (...args) => this.#traverse("next", ...args)
  prev = (...args) => this.#traverse("previous", ...args)
  #traverse = (dir, sel, { from: cur, root = document, wrap = true }) => {
    const move = dir + "ElementSibling", wrapIt = () =>
      wrap ? (dir === "next" ? $(sel, root) : $$(sel, root).at(-1)) : null
    if (!cur) return wrapIt()
    for (;;) { while (cur[move] === null)
        if ((cur = cur.parentElement) === root) return wrapIt()
      cur = cur[move]; const found = cur.matches(sel) ? cur : $(sel, cur)
      if (found) return found } }
})
