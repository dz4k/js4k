/* μρφ: a dom-morph algo. built for leisure, not for speed.
 * fits in about 4 screenfuls on my laptop.
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

import { h, root } from "./croc.js"

export const morph = (dst, src) => {
  const focused = document.activeElement,
  r = root(dst), stash = h('div', { hidden: true, class: 'murph-stash' })
  ;(r instanceof Document ? r.body : r).append(stash)
  src.remove()
  morphNode(stash, dst, src)
  focused?.focus()
  stash.remove()
}

/**
 * 
 * @param {Element} stash 
 * @param {Node} dst 
 * @param {Node} src 
 * @returns {Node}
 */
const morphNode = (stash, dst, src) => {
  if (dst.nodeType !== src.nodeType) { dst.parentNode.replaceChild(src, dst); return src }
  else if (dst.nodeType === 1) return morphElement(stash, dst, src)
  else if (dst.nodeType === 3 || dst.nodeType === 8) { dst.nodeValue = src.nodeValue; return dst }
}

/**
 * @param {Element} stash
 * @param {Element} dst 
 * @param {Element} src 
 */
const morphElement = (stash, dst, src) => {
  morphChildren(stash, dst, src)
  if (dst.tagName === src.tagName && dst.id === src.id) { morphAttributesAndProperties(dst, src); return dst }
  else { src.replaceChildren(...dst.children); dst.replaceWith(src); return src }
}

/**
 * @param {Element} dst 
 * @param {Element} src 
 */
const morphAttributesAndProperties = (dst, src) => {
  for (const defaultValueAttr of ["value"])
    if (dst.getAttribute(defaultValueAttr) != src.getAttribute(defaultValueAttr))
      dst[defaultValueAttr] = src.getAttribute(defaultValueAttr) ?? ''
  for (const defaultBoolAttr of ["checked", "selected"])
    if (dst.hasAttribute(defaultBoolAttr) != src.hasAttribute(defaultBoolAttr))
      dst[defaultBoolAttr] = src.hasAttribute(defaultBoolAttr)
  for (const { name } of [...dst.attributes])
    if (!src.hasAttribute(name)) dst.removeAttribute(name)
  for (const { name, value } of src.attributes)
    if (dst.getAttribute(name) !== value) dst.setAttribute(name, value)
}

/**
 * @param {Element} stash
 * @param {ParentNode} dst 
 * @param {ParentNode} src 
 */
const morphChildren = (stash, dst, src) => {
  let d = dst.firstChild, s = src.firstChild, match
  
  while (s) {
    let match = s.id && root(stash).getElementById(s.id)
    // [TODO] Possible to avoid making "find best dst node" O(n)?
    // This makes the overall match operation O(n^2).
    // Nanomorph seems not to worry about it.
    for (let m = d; m && !match; m = m.nextSibling) if (decentMatch(m, s)) match = m
    if (match) { d = morphNode(stash, dst.insertBefore(match, d), s).nextSibling; s = s.nextSibling }
    else { const next = s.nextSibling; dst.insertBefore(s, d); s = next }
  }
  while (d) { const next = d.nextSibling; stash.append(d); d = next }
}

const decentMatch = (a, b) => a.nodeType === b.nodeType &&
  (a.nodeType !== 1 || (a.tagName === b.tagName && a.id === b.id))
