import type { ComponentChild } from "preact";
import { html } from "htm/preact";

export function Layout(props: { children: ComponentChild }) {
  return html`
   <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div class="container">
        <a class="navbar-brand" href="/">Patente</a>
      </div>
    </nav> 
    ${props.children}
    `;
}
