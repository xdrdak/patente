import type { VNode } from "preact";
import renderToString from "preact-render-to-string";

import { html } from "htm/preact";

export { html };

export function renderRawHtml(s: string) {
  return html([s] as any);
}

export function render(node: VNode) {
  const body = renderToString(node);
  return `<!DOCTYPE html>
  <html>
    <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Patente Workflows</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
          crossorigin="anonymous">
    </head> 
    <body>${body}</body>
  </html>`;
}
