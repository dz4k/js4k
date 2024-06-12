/* A credit card sized htmx-like by Deniz <https://dz4k.dev>
 * Usage examples:
 * <a rel=swap href=/info target=info-section>link</a>
 * <form action=/add method=POST rel=swap-after data-target=.item:last-child>
 * <form action=/item/23 method=DELETE rel=swap-replaceWith target=item-23>
 */
const actuate = (e, el, mkReq) => {
  if (!el) return
  const rel = [...el.relList].find(r => /^swap/.test(r))
  if (!rel) return e.preventDefault()
  const s = el.dataset.target ?? "#" + el.target
  const target = s === "#" ? el : el.getRootNode().querySelector(s)
  const swapType = rel.slice("swap-".length) || "replaceChildren"
  const req = mkReq(el); req.headers.set("soiree", "1")
  fetch(req).then(res => res.text()).then(c => {
    target?.[swapType](document.createRange().createContextualFragment(c));
    el.dispatchEvent(new Event("soiree-swapped"))
  })
}
addEventListener("click", e => actuate(e, e.target.closest("a"), el =>
  new Request(el.href)))
addEventListener("submit", e => actuate(e, e.target, el => new Request(
  el.action, { ...el, body: new FormData(el, e.submitter) }
)))
