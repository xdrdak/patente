import { JSX, render, VNode } from "preact";
import * as hooks from "preact/hooks";
import { html } from "htm/preact";

type PatenteUiElements = Record<string, (opt?: any | any[]) => Generator>;

type PatenteGeneratorFn = (opt: {
  ui: PatenteUiElements;
  sleep: (ms: number) => Promise<unknown>;
}) => AsyncGenerator;

export default function Patente(opt: { mount?: Element } = {}) {
  const mountPoint = opt.mount || document.querySelector("#app")!;
  const ui: PatenteUiElements = {};
  let coreIterable: AsyncGenerator<unknown, any, unknown> | null = null;

  function generateKey() {
    return crypto.randomUUID();
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function renderEl(Node: VNode | JSX.Element) {
    Node.key = generateKey();
    render(Node, mountPoint);
  }

  function next() {
    if (!coreIterable) {
      throw new Error("Core iterable has not been set!");
    }
    coreIterable.next();
  }

  function registerComponent(
    name: string,
    cb: (builtins: {
      render: typeof renderEl;
      html: typeof html;
      hooks: typeof hooks;
      next: () => void;
    }) => (callbackOpt?: any | any[]) => Generator,
  ) {
    ui[name] = cb({
      render: renderEl,
      html,
      next,
      hooks,
    });
  }

  registerComponent("__error", ({ html, render }) => {
    return function* (opt: { errorMessage: string }) {
      const Component = (props: { message: string }) => {
        return html`<div>
          Could not execute the requested command!
          <div>${props.message}</div>
        </div>`;
      };

      render(html`<${Component} message=${opt.errorMessage} />`);
      yield;
    };
  });

  return {
    next,
    hooks,
    html,
    registerComponent,
    run(generatorFn: PatenteGeneratorFn) {
      const proxyUI = new Proxy(ui, {
        get(target, prop, receiver) {
          if (prop in target === false) {
            const fn = Reflect.get(target, "__error", receiver);
            return function* () {
              fn({
                errorMessage: `Trying to execute the following: "ui.${
                  String(
                    prop,
                  )
                }". Are you sure this element exists?`,
              }).next();
              yield;
            };
          }

          return Reflect.get(target, prop, receiver);
        },
      });

      // fuck off typescript
      coreIterable = generatorFn({
        ui: proxyUI,
        sleep,
      });
      coreIterable.next();
    },
  };
}

if (import.meta.env.DEV) {
  const instance = Patente({ mount: document.querySelector("#app")! });

  instance.registerComponent(
    "input",
    ({ html, render, hooks, next }) =>
      function* ({ label }) {
        let data = null;
        const Component = (props: { callback: (val: string) => void }) => {
          const ref = hooks.useRef<HTMLInputElement>(null);

          const submit = () => {
            props.callback(ref.current!.value);
          };

          return html`<div>
            ${label ?? html`<label>${label}</label>`}
            <input ref=${ref} type="text" /><button onClick=${submit}>
              submit
            </button>
          </div>`;
        };

        render(
          html`<${Component}
            callback=${(s: any) => {
            data = s;
            next();
          }}
          />`,
        );

        yield;
        return data;
      },
  );

  instance.registerComponent(
    "spinner",
    ({ html, render }) =>
      function* () {
        const Component = () =>
          html`
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        `;

        render(html`<${Component} />`);
      },
  );

  instance.registerComponent(
    "text",
    ({ html, render }) =>
      function* (opt: { content: string }) {
        const Component = (props: { text: string }) =>
          html`
          <p>${props.text}</p>
        `;

        render(html`<${Component} text=${opt.content} />`);
      },
  );

  instance.run(async function* ({ ui, sleep }) {
    const x = yield* ui.input({ label: "Choose your pokemon" });
    console.log("you selected", x);
    yield* ui.spinner();
    await sleep(1000);
    const data = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
    const json = (await data.json()) as {
      name: string;
      base_experience: number;
    };
    await sleep(1000);
    console.log(json);
    yield* ui.text({
      content:
        `${json.name} requires ${json.base_experience} experience to level-up`,
    });
  });
}
