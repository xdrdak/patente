const patente = Patente({ mount: document.querySelector("#app") });

const html = patente.html;
const hooks = patente.hooks;
const Component = patente.Component;

export { patente, html, hooks, Component };
