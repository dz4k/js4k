/*
 * instyle: superpowers for inline styles
 * Usage:
 * <div style="
 *   background: steelblue;
 *   a { color: white; }
 *   + .divider { margin: 1em; }
 *   &:hover { background: lightblue; }
 *   @media (max-width: 600px) { background: lightcoral; }
 * ">
 */
new MutationObserver((ms) => ms.forEach(m => [m.target, ...m.addedNodes]
    .forEach(node => (node?.matches?.(this) ? [node] : [])
        .concat(node?.querySelectorAll?.(this))
        .forEach(n => n?.style && (
          n.insertAdjacentHTML("afterbegin",
            `<style class=ins>@scope{:scope{${n.style.cssText}}}`),
          n.removeAttribute("style")
        )), "[style]:not(:has(>style.ins))")))
.observe(document, { childList: true, subtree: true, attributes: true })
