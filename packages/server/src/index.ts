import express from "express";
import path from "path";

import { createWorkflowRepository } from "./workflow-repository";
import { html, render, renderRawHtml } from "./preact-renderer";
import { Layout } from "./components/Layout";

const curryPathJoin = (root: string) => (s?: string) =>
  path.join(root, s || "");

export function createPatente(config: {
  workflowDir: string;
  runtimeEndpoint?: string;
  workflowEndpoint?: string;
  staticAsset?: {
    endpoint: string;
    dir: string;
  };
}) {
  const app = express();

  const WORKFLOW_DIR = config.workflowDir;
  const RUNTIME_ENDPOINT = config.runtimeEndpoint || "/asset-runtime";
  const WORKFLOW_ENDPOINT = config.runtimeEndpoint || "/asset-workflow";

  const getRuntimeEndpoint = curryPathJoin(RUNTIME_ENDPOINT);
  const getWorkflowEndpoint = curryPathJoin(WORKFLOW_ENDPOINT);

  const workflowRepository = createWorkflowRepository(WORKFLOW_DIR);

  app.use(express.json());

  app.use(
    getRuntimeEndpoint(),
    express.static(path.join(__dirname, "..", "public")),
  );

  app.use(getWorkflowEndpoint(), express.static(WORKFLOW_DIR));

  if (config.staticAsset) {
    app.use(config.staticAsset.endpoint, express.static(config.staticAsset.dir));
  }

  app.get("/", async (_req, res) => {
    const workflows = await workflowRepository.listWorkflows();
    const nextWorkflows = workflows.map((w) => {
      return {
        ...w,
        href: `/workflow/${w.name}`,
      };
    });

    res.send(render(html`
    <${Layout}> 
    <main class="container">
    <h1>Workflows</h1>
    <div>
      ${
      nextWorkflows.map((w) => {
        return html`<div class="card p-3">
            <div class="fs-3">
              ${w.readme.title}
            </div>
            <div class="fs-6 text-muted">Created By: ${w.readme.author}</div>
            <div>${renderRawHtml(w.readme.contents)}</div>
            <div>
              <a class="btn btn-primary" href=${w.href}>Run Workflow</a>
            </div>
        </div>`;
      })
    }
    </div>
</main>
    <//>`));
  });

  app.get("/workflow/:name", async (req, res) => {
    const name = req.params.name;
    const { components } = await workflowRepository.listFiles();

    const scriptSrc = getWorkflowEndpoint(name);
    const runtimeSrc = getRuntimeEndpoint("runtime.js");
    const patenteUiEngineSrc = getRuntimeEndpoint("patente.min.js");

    const modComponentImports = components.map((c) =>
      `import ${c.split(".")[0]} from "${
        getWorkflowEndpoint(`/components/${c}`)
      }";`
    ).join("\n");

    const modComponentRegister = components.map((c) => {
      const componentName = c.split(".")[0];
      return `patente.registerComponent("${componentName}", ${componentName});`;
    }).join("\n");

    const modComponentScript = [
      `import { patente } from "${runtimeSrc}"`,
      modComponentImports,
      modComponentRegister,
    ].join("\n");

    const modRunScript = [
      `import { patente } from "${runtimeSrc}"`,
      `import run from "${scriptSrc}"`,
      `patente.run(run)`,
    ].join("\n");

    let output = render(html`
    <${Layout}> 
      <main class="container">
        <div id="app"></div>
        <script type="text/javascript" src="${patenteUiEngineSrc}"></script>
        <script type="module">/*__components__*/</script>
        <script type="module">/*__runscript__*/</script>
      </main>
    <//>
    `);

    output = output.replace("/*__components__*/", modComponentScript);
    output = output.replace("/*__runscript__*/", modRunScript);

    res.send(output);
  });

  return {
    express: app,
    start(opt: { port: number }) {
      app.listen(opt.port, () => {
        console.info(`Example app listening on port ${opt.port}`);
      });
    },
  };
}
