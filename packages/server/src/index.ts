import express from "express";
import path from "path";
import { createWorkflowRepository } from "./workflow-repository";
import { html, render, renderRawHtml } from "./preact-renderer";
import { Layout } from "./components/Layout";

export function createPatente(config: {
  workflowDir: string;
}) {
  const app = express();

  const WORKFLOW_DIR = config.workflowDir;
  const workflowRepository = createWorkflowRepository(WORKFLOW_DIR);

  app.use("/public", express.static(path.join(__dirname, "..", "public")));
  app.use("/static-workflows", express.static(WORKFLOW_DIR));

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

    const scriptSrc = `/static-workflows/${name}`;

    res.send(render(html`
    <${Layout}> 
    <main class="container">
    <div id="app"></div>
    <script type="text/javascript" src="/public/patente.min.js"></script>
    ${
      components.map((c) =>
        html`<script type="module" src="/static-workflows/components/${c}"></script>`
      )
    }
    <script type="module" src="${scriptSrc}"></script></main>
    <//> 
    `));
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
