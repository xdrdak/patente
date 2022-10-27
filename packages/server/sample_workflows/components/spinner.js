export default ({ html, render }) =>
    function* () {
        const Component = () =>
            html`
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            `;

        render(html`<${Component} />`);
    };
