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
{
  const initialized = new WeakSet()
  new MutationObserver((ms) => ms.forEach(m => m.addedNodes.forEach(node =>
    node.querySelectorAll?.("[style]").forEach(l => initialized.has(l) || (
      initialized.add(l),
      l.insertAdjacentHtml("beforebegin",
        `<style>@scope{:scope{${l.style.cssText}}}`),
      l.removeAttribute("style")
    ))))).observe(document, { childList: true, subtree: true })
}
