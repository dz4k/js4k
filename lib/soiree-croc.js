/* A credit card sized htmx-like by Deniz <https://dz4k.dev>
 * Depends on croc.js
 * Usage examples:
 * <a rel=swap href=/info target=#info-section>link</a>
 * <form action=/add-item method=POST rel=swap-after target=.item:last-child>
 * <form action=/item/23 method=DELETE rel=swap-replaceWith target=#item-23>
 */
const actuate = (el, mkReq) => {
  if (!el) return
  const rel = el.relList?.find(r => r.startsWith("swap")); if (!rel) return
  const target = el.target ? $(el.target, el.getRootNode()) : el
  const swapType = rel.slice("swap-".length) || "replaceChildren"
  fetch(mkReq(el)).then(res => res.text()).then(text => target?.[swapType](
    h(html(text))))
  return false
}
on(window, "click", e => actuate(e.target.closest("a"), el => el.href))
on(window, "submit", e => actuate(e.target, el => new Request(el.action, {
  method: el.getAttribute("method") || "GET",
  body: new FormData(el),
})))
