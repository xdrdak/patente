import { FormSchema } from "/static-assets/bs-components.js";

export default function component({ render, next, html }) {
    return function* ({ schema }) {
        let data = null;

        render(
            html`<${FormSchema}
                schema=${schema}
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
