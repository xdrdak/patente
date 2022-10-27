export default function* workflowFunction(opt) {
    yield* opt.ui.sampler();
}
