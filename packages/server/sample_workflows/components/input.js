import { Button } from "/static-assets/bs-components.js";

export default function component({ render, hooks, next, html }) {
    return function* ({ label }) {
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
                <${Button} onClick=${submit}>Submit<//>
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
    };
}
