import { post } from "/static-assets/fetcher.js";

export default async function* ({ ui }) {
    const payload = yield* ui.form({
        schema: [
            { type: "input", props: { label: "Workflow Name", name: "name" } },
            {
                type: "input",
                props: { label: "Workflow Author", name: "author" },
            },
            {
                type: "textarea",
                props: { label: "Workflow Description", name: "description" },
            },
        ],
    });

    yield* ui.spinner();

    const json = await post("/api/create-workflow", payload);
    console.log(json);

    yield* ui.text({
        content: `done!`,
    });
}
