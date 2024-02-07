/*
 * onwhatever: universal `on-` event attributes, including custom events
 * Plus: an `init` event is dispatched on every element with `on-` attributes
 * Usage:
 * <a on-click="alert('clicked')">click me</a>
 * <textarea on-init="new RichTextEditor(this).setValue(localStorage.content)"
 *    on-richtext-change="localStorage.content = event.detail.html">
 */
const initialized = new WeakSet()
const init = subtree => {
  if (initialized.has(subtree)) return; initialized.add(subtree)
  const it = document.evaluate(`//@*[starts-with(name(),'on-')]`, subtree,
    null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE)
  for (let i = 0; i < it.snapshotLength; i++) {
    const at = it.snapshotItem(i), el = at.ownerElement
    el.addEventListener(at.name.slice(3), (e) =>
      Function("event", at.value).call(el, e))
    el.dispatchEvent(new Event("init", { bubbles: false }))
  }
}
new MutationObserver((muts) => muts.forEach(m => m.addedNodes.forEach(init)))
  .observe(document, { childList: true, subtree: true })
init(document)
