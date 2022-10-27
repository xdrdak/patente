/**
 * ./bs-components.js
 * Simple component building blocks using bootstrap & preact components
 */
import { html, hooks } from "/static-runtime/runtime.js";

function useId() {
    const id = hooks.useRef(crypto.randomUUID());
    return id;
}

export function Stack(props) {
    const style = {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    };
    return html`<div style=${style}>${props.children}</div> `;
}

export function Button(props) {
    const { children, ...rest } = props;
    return html` <button class="btn btn-primary" ...${rest}>
        ${children}
    </button>`;
}

export function Input(props) {
    const id = useId();
    const { label, ...restProps } = props;

    return html`<div>
        <label for=${id} class="form-label">${label}</label>
        <input class="form-control" id=${id} ...${restProps} />
    </div>`;
}

export function Textarea(props) {
    const id = useId();
    const { label, ...restProps } = props;

    return html`<div>
        <label for=${id} class="form-label">${label}</label>
        <textarea class="form-control" id=${id} ...${restProps}></textarea>
    </div>`;
}

export function Select(props) {
    const { options, ...rest } = props;
    return html` <select class="form-select" ...${rest}>
        ${options.map(
            ({ content, ...restOptions }) =>
                html`<option ...${restOptions}>${option.content}</option>`,
        )}
    </select>`;
}

export function Checkbox(props) {
    const { children, ...rest } = props;
    const id = useId();

    return html`<div class="form-check">
        <input
            class="form-check-input"
            type="checkbox"
            value=""
            id=${id}
            ...${rest}
        />
        <label class="form-check-label" for=${id}> {childen} </label>
    </div>`;
}

export function Checkboxes(props) {
    const { options } = props;
    return html`<div>
        ${options.map((option) => {
            const { content, ...restOption } = option;
            return html`<${Chekcbox} ...${restOption}>${content}<//>`;
        })}
    </div>`;
}

export function Radio(props) {
    const { children, ...rest } = props;
    const id = useId();

    return html`<div class="form-check">
        <input
            class="form-check-input"
            type="radio"
            value=""
            id=${id}
            ...${rest}
        />
        <label class="form-check-label" for=${id}> {childen} </label>
    </div>`;
}

export function Radios(props) {
    const { options } = props;
    return html`<div>
        ${options.map((option) => {
            const { content, ...restOption } = option;
            return html`<${Radio} ...${restOption}>${content}<//>`;
        })}
    </div>`;
}

const componentDictionary = {
    textarea: Textarea,
    input: Input,
};

export function FormSchema(props) {
    const onSubmit = (evt) => {
        evt.preventDefault();
        const formData = new FormData(evt.target);
        const formJsonData = {};
        for (const [key, value] of formData.entries()) {
            formJsonData[key] = value;
        }

        props.callback(formJsonData);
    };

    return html`<form onSubmit=${onSubmit}>
        <${Stack}>
            ${props.schema.map((entry) => {
                const Component = componentDictionary[entry.type];
                const { content, ...rest } = entry.props;

                if (!Component) {
                    return html`<div>Could not find ${entry.type}</div>`;
                }

                return html`<${Component} ...${rest}>${content}<//>`;
            })}
            <div><${Button} type="submit">Submit<//></div>
        <//>
    </form>`;
}
