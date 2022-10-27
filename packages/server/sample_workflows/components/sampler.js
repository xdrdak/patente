import { Component, html } from "/static-runtime/runtime.js";
import { FormSchema, Textarea } from "/static-assets/bs-components.js";

class Sampler extends Component {
    state = { schema: "", error: null };

    static getDerivedStateFromError(error) {
        return { error: error.message };
    }

    componentDidCatch(error) {
        this.setState({ error: error.message });
    }

    onInput = (evt) => {
        this.setState({ schema: evt.target.value, error: null });
    };

    render() {
        let schema = {};
        try {
            schema = JSON.parse(this.state.schema);
        } catch (e) {}

        if (this.state.error) {
            return html`<div>
                <${Textarea} label="Schema" onInput=${this.onInput}><//>
            </div>`;
        }

        return html`<div>
            <${Textarea} label="Schema" onInput=${this.onInput}><//>
            <div>${JSON.stringify(this.state)}</div>
            <${FormSchema} key=${JSON.stringify(schema)} schema=${schema}><//>
        </div>`;
    }
}

export default function component({ render, html }) {
    return function* () {
        render(html`<${Sampler}><//>`);

        yield;
        return null;
    };
}
