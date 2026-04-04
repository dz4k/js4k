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
import { $$ } from "./croc.js"
new MutationObserver((ms) => ms.forEach(m => [m.target, ...m.addedNodes]
  .forEach(node => (node?.matches?.(this) ? [node] : [])
      .concat($$(this, node))
      .forEach(n => n?.style && (
        n.append(html`<style class=ins>@scope{:scope{${n.style.cssText}}}`),
        n.removeAttribute("style")
      )), "[style]:not(:has(>style.ins))")))
.observe(document, { childList: true, subtree: true, attributes: true })
