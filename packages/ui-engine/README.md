# @patente/ui-engine

UI Engine for rendering a workflow like UI (aka: a wizard).

Through some silly abuse of generator functions, we can create a top down sequentially renderered app.

The flow feels very similar to writting a typical step by step CLI app, which is pretty neat for simple workflows.

The engine features everything you need to start writting your workflow, including Preact!

## Why in god's name would you ever use this?

```
¯\_(ツ)_/¯
```

I just got obsessed with the ideas that there HAS to be something you can do with generator functions
that would be neat. And the next thing you know, this is the monstrosity that came out.

I also wanted a way to quickly vomit out step-by-step wizard without having to setup a full frontend pipeline and
that would work on whatever server stack. 

Just import a script, write stuff into a `<script />` tag and have results appear on screen.

It's also easier to be consumed for folks not familiar with CLI interfaces which essentially do the same thing.

## Installing

```
npm i @patente/ui-engine
```

```html
<!-- Somewhere in your page, hopefully at the bottom of the document -->
<script type="text/javascript" src="node_modules/@patente/ui-engine/dist/patente.min.js">
```

## Useage

The engine has be built out as an IIFE, meaning you only need to load it up once to have it in the global
brower context.

From here, you'll need to instanciate your engine, define your ui components and finally define the task to run.

```js
// Instanciate the patente ui engine while specifying where the app should mount.
const instance = Patente({ mount: document.querySelector("#app")! });

// Register a component
// We'll go a bit in details on how this works a bit further down
instance.registerComponent(
    "input",
    // These are some injected helper methods
    // html: is basically preact jsx, but as string templates
    // hooks: is all preact hooks
    // render: allows you to mount your component to the screen
    // next: unpauses execution and forces the engine to go to the next screen
    ({ html, hooks, render, next }) => {
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
);

// Execute a script
instance.run(async function* ({ ui }) {
    // The ui parameter contains all the components you've registered
    // Since it's a generator function, you can "pause" the ui until
    // the component decides that it's time to resume execution
    // In general, you always want to call a ui component using
    // the `yield*` syntax
    const name = yield* ui.input({ label: "What is your name" });
    alert("Hello" + name)
});
```

## Component Rendering

Rendering a component, while very intimidating looking, is fairly straightforward.

Provided by the library is `preact` and `htm`. Let's check the anatomy of `registerComponent`

```js
instance.registerComponent("myInputName", ({ html, render, hooks, next }) => {
  return function* handler(generatorProps) {
    // snip
  };
});
```

At it's core, register component takes 2 parameters: the name of the component and a callback function.

The name of the component will be bound into our `ui` object when we run our ui-engine.
So if we name something `instance.registerComponent('myInputName', /* ... */)`, you can expect
to be able to use it in our run function as so:

```js
instance.run(async function* ({ ui })) {
    const _ = yield* ui.myInputName(/* ... */);
}
```

The callback function is somewhat tricker to read through. The callback function passes through some
ui rendering functions and expects a generator function in return. In other words, we're injecting some dependencies
to help out in creating the UI and the engine expects a handler function in return.

### What is dependecy injected?

#### html

`html` is a string template function that allows you to write JSX, but as a string. This gives you almost the full set
of features of JSX without having to setup anything. It uses the [htm](https://github.com/developit/htm) library.

Essentially, anytime you would write JSX, you MUST write it with `html`, or else the preact renderer will not render things properly.

#### hooks

hooks are all the preact hooks, but contained within a single object.

#### render

The render function output your preact component (written with `html` of course) into the browser view.

#### next

This function signals that you are done with this ui and can safely resume the execution of the currently running generator function.

### What's the handler function

The handler function MUST be a generator function.

Whenever we invoke your registered component via `ui.{insert-component-name-here}`, we bind that handler to that specific identifier.
So in the `myInputName` example, if we call `ui.myInputName`, we're actually calling our previously defined generator function.

## Running a workflow

Running a workflow is a simple as doing:

```js
instance.run(async function* ({ ui })) {
    // write your script here
}
```

The callback function passes through the `ui` object which contains all of our registered ui components.

When invoking a ui component, you MUST use the `yield*` syntax. This will delegate the pause/resume function to our component.

Please note that code written here is completely sequential, meaning you can easily chain multiple ui renders that feed into one another.

```js
instance.run(async function* ({ ui })) {
    const name = yield* ui.input({ label: 'what is your name'});
    const colour = yield* ui.input({ label: `what is ${name}'s favourite colour`});
    alert(`${name}'s favourite colour is ${colour}!`);
}
```

Because we're dealing with async generators, it becomes entire possible to fetch data and pass it through our ui.

```js
instance.run(async function* ({ ui })) {
    // No ui will be rendered until we fetch out data
    const data = await fetch('https://www.my-api.com/some-endpoint-which-returns-the-question-of-the-day');
    const json = await data.json()

    // Data will be fed to our ui element
    const answer = yield* ui.input({ label: json.questionOfTheDay });

    // Once our input has decided to "resume", we can pass in the returned value to something else.
    await fetch('https://www.my-api.com/some-endpoint-which-returns-the-question-of-the-day', {
        method: 'POST',
        body: JSON.stringify({answer})
    })

    // And there you have it!
    alert(`Answer sent!`);
}
```
