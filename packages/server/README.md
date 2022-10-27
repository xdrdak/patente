# @patente/server

A simple stupid app to generate @patente/ui-engine workflows in a very opinionated way.

## Installing

```
npm i @patente/server
```

## Getting started

### Setup your server

Create a file that'll create and start your server. Where also going to
assume that your workflow directory will be created under the root of your repo
with the name `workflow`

```js
// server.js
import { createPatente } from "./src";

const port = 1337;
// Where within your repo will we add all the workflow files
// I recommend creating a "workflow" file at the root of
// the repo and just pointing it there
const workflowDir = `${__dinarme}/workflow`;
const patente = createPatente({ workflowDir });

patente.start({ port });
```

## Workflows structure

Files at the root of the worflow directory are treated as workflows.
`@patente/server` does not support nesting and requires all workflows be structured in a flat manner.

Workflows MUST be javascript files (not typescript). You can associate a readme to a workflow
by having the same name as the javascript file.

UI components must be registered within a subfolder called `components`.
Components must be structured in a flat structure.

e.g:

```
workflows/
|-- components/input.js
|-- components/checkboxes.js
|-- my-workflow.js
|-- my-workflow.md
```

## Anatomy of a component

Through the magic of dependency inject and server side string concatenation, all you need to
do to create a component is to add a js file into the `workflows/components` directory and export
a default function that returns a generator function.

The name of the file will be the name of the ui element you can use when building out your workflow.

```js
// inside our hypothetical input.js component...

// These are some injected helper methods
// html: is basically preact jsx, but as string templates
// hooks: is all preact hooks
// render: allows you to mount your component to the screen
// next: unpauses execution and forces the engine to go to the next screen
export default ({ html, hooks, render, next }) => {
    // This is the callback function that will be registered to our component name
    // Whenever we invoke `ui.input`, this is the callback function that will get executed
    return function* handler({ label }) {
        // State that we wish to return MUST reside outside the component context
        let data = null;

        // Define a component. You can create and use as many components as you wish
        // They behave exactly the same way as a preact component
        const Component = (props) => {
            const ref = hooks.useRef(null);

            const submit = () => {
                props.callback(ref.current!.value);
            };

            return html`<div>
            ${label || html`<label>${label}</label>`}
            <input ref=${ref} type="text" /><button onClick=${submit}>
                submit
            </button>
            </div>`;
        };

        // Render our component into the DOM
        render(
            html`<${Component}
            callback=${(s) => {
                data = s;
                next();
            }}
            />`,
        );

        // Adding a yield here will pause ui.
        // So long as `next()` is never called, we will keep showing
        // the previously rendered component
        yield;

        // If we called `next()`, we return the data
        return data;
    }
}
```

## Anatomy of a workflow

Same magic as previous, simply export an async generator function and you have workflow script.

```js
// inside our hypothetical my-workflow.js workflow...

export default async function* ({ ui }) {
    // The ui parameter contains all the components you've registered
    // Since it's a generator function, you can "pause" the ui until
    // the component decides that it's time to resume execution
    // In general, you always want to call a ui component using
    // the `yield*` syntax
    const name = yield* ui.input({ label: "What is your name" });
    alert("Hello" + name);
}
```
