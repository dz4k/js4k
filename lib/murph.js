/* μρφ: a dom-morph algo. built for leisure, not for speed.
 * fits in about 3 screenfuls on my laptop.
 * terminology: we mutate the _destination tree_ (`dst`)
 * to become like the _source tree_ (`src`)
 * preconditions: both trees must have elements as roots.
 * the destination tree must be connected to the document
 * or a shadow root.
 * both trees should have unique ids, both within themselves
 * and within the rest of the document/shadow root.
 * (the same id can occur within both trees, though.)
 * warning: this will remove the source node from the document
 * and mutate it in unspecified ways
 */

import { d, root } from "./croc.js"

const
  next = "nextSibling",
  tagName = "tagName",
  id = "id",
  nodeType = "nodeType",
  before = "insertBefore"

export const morph = (
  dst, src,
  focused = d.activeElement,
  r = root(dst),
  stash = Object.assign(d.createElement(next), { hidden: true })
) => {
  (r.body ?? r).append(stash)
  morphNode(stash, dst, src)
  stash.remove()
  focused?.focus()
}

/**
 * 
 * @param {Element} stash 
 * @param {Node} dst 
 * @param {Node} src 
 * @returns {Node}
 */
const morphNode = (
  stash, dst, src,
  d = dst.firstChild, s = src.firstChild, tmp, m
) => {
  if (!same(dst, src, nodeType)) { dst.parentNode.replaceChild(src, dst); return src }
  if (dst[nodeType] === 1) { // element
    // children
    while (s) {
      tmp = s.id ? root(stash).getElementById(s.id) : 0
      // [TODO] Possible to avoid making "find best dst node" O(n)?
      // This makes the overall match operation O(n^2).
      // Nanomorph seems not to worry about it.
      for (m = d; m && !tmp; m = m[next]) if (same(m, s, nodeType, tagName, id)) tmp = m
      if (tmp) d = morphNode(stash, dst[before](tmp, d), s)[next], s = s[next]
      else tmp = s[next], dst[before](s, d), s = tmp
    }
    while (d) tmp = d[next], stash.append(d), d = tmp

    // props and attrs
    if (same(dst, src, tagName, id)) {
      ["value", "checked", "selected", "disabled"].forEach(prop => dst[prop] = src[prop] ?? ''),
      [...dst.attributes].forEach(({ name }) =>
        src.hasAttribute(name) || dst.removeAttribute(name)),
      [...src.attributes].forEach(({ name, value }) =>
        dst.getAttribute(name) === value || dst.setAttribute(name, value))
      return dst
    }
    src.replaceChildren(...dst.children); dst.replaceWith(src); return src
  }
  // text and comments
  if (dst[nodeType] in { 3: 1, 8: 1 }) { dst.nodeValue = src.nodeValue; return dst }
}

const same = (a, b, ...props) => props.every(p => a[p] === b[p])
