import { Button, Textarea, Stack } from "/static-assets/bs-components.js";

export default function component({ render, hooks, next, html }) {
    return function* ({ label }) {
        let data = null;
        const Component = (props) => {
            const ref = hooks.useRef(null);

            const submit = () => {
                props.callback(ref.current.value);
            };

            return html`<${Stack}>
                <${Textarea}
                    label=${props.label ?? "(no label set)"}
                    ref=${ref}
                ><//>
                <div><${Button} onClick=${submit}>Submit<//></div>
            <//>`;
        };

        render(
            html`<${Component}
                label=${label}
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
