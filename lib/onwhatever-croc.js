/* onwhatever: universal `on-` event attributes, including custom events
 * Depends on croc.js
 * Plus: an `init` event is dispatched on every element with `on-` attributes
 * Usage:
 * <a on-click="alert('clicked')">click me</a>
 * <textarea on-init="new RichTextEditor(this).setValue(localStorage.content)"
 *    on-richtext-change="localStorage.content = event.detail.html">
 */
const initialized = new WeakSet()
const init = subtree => {
  if (initialized.has(subtree)) return; initialized.add(subtree)
  $$x(`//@*[starts-with(name(),'on-')]`, subtree).forEach(at => {
    const el = at.ownerElement
    on(el, at.name.slice(3), (e) => Function("event", at.value).call(el, e))
    dispatch(el, "init", { bubbles: false })
  })
}
new MutationObserver((muts) => muts.forEach(m => m.addedNodes.forEach(init)))
  .observe(document, { childList: true, subtree: true })
init(document)
