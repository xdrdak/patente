export default ({ html, render }) =>
    function* (opt) {
        const Component = (props) => html`<p>${props.text}</p>`;

        render(html`<${Component} text=${opt.content} />`);
    };
