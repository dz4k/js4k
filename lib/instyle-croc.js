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
new MutationObserver((ms) => ms.forEach(m => m.addedNodes.forEach(node =>
  $$("[style]:not(:has(>style.instyle))", node).forEach(l => (
      l.after((html)`<style class=instyle>@scope{:scope{${l.style.cssText}}}`),
      l.removeAttribute("style")
    ))))).observe(document, { childList: true, subtree: true })
