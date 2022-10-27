import { post } from '/static-assets/fetcher.js'

export default async function* ({ ui }) {
    const workflowName = yield* ui.input({ label: "Workflow Name" });

    yield* ui.spinner();

    const json = post('/api/create-workflow', { workflowName });

    console.log(json);

    yield* ui.text({
        content: `done!`,
    });
}
