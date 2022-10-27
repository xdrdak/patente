/**
 * ./bs-components.js
 * Simple component building blocks using bootstrap & preact components
 */
import { html, hooks } from "/static-runtime/runtime.js";

function useId() {
    const id = hooks.useRef(crypto.randomUUID());
    return id;
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
