/* onwhatever: universal `on-` event attributes, including custom events
 * Depends on croc.js
 * Plus: an `init` event is dispatched on every element with `on-` attributes
 * Usage:
 * <a on-click="alert('clicked')">click me</a>
 * <textarea on-init="new RichTextEditor(this).setValue(localStorage.content)"
 *    on-richtext-change="localStorage.content = event.detail.html">
 */
import { $$x, dispatch, on } from "./croc.js"
{
  const initialized = new WeakSet()
  new MutationObserver((ms) => ms.forEach(m => m.addedNodes.forEach(node =>
    $$x(`//@*[starts-with(name(),'on-')]`, node).forEach(at => {
      if (!initialized.has(at)) {
        initialized.add(at)
        const el = at.ownerElement
        on(el, at.name.slice(3), (e) => Function("event", at.value).call(el, e))
        dispatch(el, "init", { bubbles: false })
      }
    })))).observe(document, { childList: true, subtree: true })
}
