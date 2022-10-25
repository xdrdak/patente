import { patente } from "/public/workflow.js";

patente.registerComponent(
    "input",
    ({ html, render, hooks, next }) =>
        function* ({ label }) {
            let data = null;
            const Component = (props) => {
                const ref = hooks.useRef(null);

                const submit = () => {
                    props.callback(ref.current.value);
                };

                return html`<div>
                    ${label ??
                    html`<label for="single-input" class="form-label"
                        >${label}</label
                    >`}
                    <input
                        ref=${ref}
                        id="sigle-input"
                        type="text"
                        class="form-text"
                    />
                    <button class="btn btn-primary" onClick=${submit}>Submit</button>
                </div>`;
            };

            render(
                html`<${Component}
                    callback=${(s) => {
                        data = s;
                        next();
                    }}
                />`,
            );

            yield;
            return data;
        },
);

patente.registerComponent(
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

patente.registerComponent(
    "text",
    ({ html, render }) =>
        function* (opt) {
            const Component = (props) => html`<p>${props.text}</p>`;

            render(html`<${Component} text=${opt.content} />`);
        },
);
