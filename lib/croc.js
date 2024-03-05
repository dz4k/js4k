/* croc: a grab-bag of DOM utilities written in a terse style
 * By Deniz <https://dz4k.com> <https://dz4k.dev>
 * $, $$: querySelector and [...querySelectorAll]
 * $x, $$x: XPath equivalents of $ and $$
 * root, head, body: document.documentElement, .head, .body
 * on: add an event listener
 * halt: prevent default, stop propagation, or both with a string
 *    e.g. halt(e, "default bubbling propagation")
 * dispatch: dispatch a custom event
 * htmlEscape: escape HTML special characters
 * html: a template literal tag to create HTML safely
 *    or call as normal function to mark a string as trusted HTML
 * h: a function to create an element with children and attributes
 *    can also be used to update an existing element
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
  on = (el, ty, f, opts = {}) => el.addEventListener(ty, f, opts)
  dispatch = (el, ty, opts = {}) => el.dispatchEvent(new CustomEvent(ty, opts))
  #trustedHtml = Symbol("Trusted HTML")
  htmlEscape = s => s?.[this.#trustedHtml] ? s :
    String(s).replace(/[&<>"'"]/g, m => `&#${m.charCodeAt(0)};`)
  html = (s, ...i) => Object.assign(
    new String(s?.raw ? String.raw(s, ...i.map(this.htmlEscape)) : s),
    { [this.#trustedHtml]: true })
  h = (tag, ...children) => {
    if (tag[this.#trustedHtml]) return Object.assign(h("template"),
      { innerHTML: tag }).content
    const el = tag instanceof Element ? tag : document.createElement(tag)
    if (children[0].constructor === Object) Object.entries(children.shift())
      .forEach(([k, v]) => el.setAttribute(k, v))
    el.append.apply(el, children)
    return el }
  css = (s, ...i) => { const v = new CSSStyleSheet;
    v.replaceSync(String.raw(s, ...i)); return v }
  next = (...args) => this.#traverse("next", ...args)
  prev = (...args) => this.#traverse("previous", ...args)
  #traverse = (dir, sel, { from: cur, root = document, wrap = true }) => {
    const move = dir + "ElementSibling", wrapIt = () =>
      wrap ? (dir === "next" ? $(sel, root) : $$(sel, root).at(-1)) : null
    if (!cur) return wrapIt()
    for (;;) {
      while (cur[move] === null)
        if ((cur = cur.parentElement) === root) return wrapIt()
      cur = cur[move]; const found = cur.matches(sel) ? cur : $(sel, cur)
      if (found) return found } }
})
