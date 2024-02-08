/* A credit card sized htmx-like by Deniz <https://dz4k.dev>
 * Usage examples:
 * <a rel=swap href=/info target=#info-section>link</a>
 * <form action=/add-item method=POST rel=swap-after target=.item:last-child>
 * <form action=/item/23 method=DELETE rel=swap-replaceWith target=#item-23>
 */
const actuate = (e, el, mkReq) => {
  if (!el) return
  const rel = [...el.relList].find(r => r.startsWith("swap")); if (!rel) return
  const target = el.target ? el.getRootNode().querySelector(el.target) : el
  const swapType = rel.slice("swap-".length) || "replaceChildren"
  e.preventDefault()
  fetch(mkReq(el), { headers: { soiree: 1 } }).then(res => res.text()).then(c =>
    target?.[swapType](document.createRange().createContextualFragment(c)))
}
addEventListener("click", e => actuate(e, e.target.closest("a"), el => el.href))
addEventListener("submit", e => actuate(e, e.target, el => new Request(el.action, {
  method: el.getAttribute("method") || "GET",
  body: new FormData(el),
})))
