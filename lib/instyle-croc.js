/*
 * instyle: superpowers for inline styles
 * Usage:
 * <div style="
 *   background: steelblue;
 *   a { color: white; }
 *   &:hover { background: lightblue; }
 *   @media (max-width: 600px) { background: lightcoral; }
 * ">
 */
const initialized = new WeakSet()
new MutationObserver((muts) => muts.forEach(m => m.addedNodes.forEach(node =>
  $$("[style]", node).forEach(l => {
    if (!initialized.has(l)) {
      initialized.add(l)
      l.prepend(h(html`<style>@scope{:scope{${l.style.cssText}}}</style>`))
      l.removeAttribute("style")
    }
  })))).observe(document, { childList: true, subtree: true })
