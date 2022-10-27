import fs from "fs";
import path from "path";
import { createPatente } from "./src";

const port = 1337;
const workflowDir = `${__dirname}/sample_workflows`;
const staticDir = `${__dirname}/sample_static`;

const patente = createPatente({
  workflowDir,
  runtimeEndpoint: "/static-runtime",
  staticAsset: {
    endpoint: "/static-assets",
    dir: staticDir,
  },
});

patente.express.post("/api/create-workflow", (req, res) => {
  const workflowName = req.body?.name;
  const author = req.body?.author ?? "<your_name>";
  const description = req.body?.description ??
    `This is a description for ${workflowName}`;

  fs.writeFileSync(
    path.join(workflowDir, `${workflowName}.js`),
    `export default function workflowFunction({ html, render }) {
  return function* (opt) {
     yield* opt.ui.text({
        content: "sample text",
    });
  };
};
`,
  );

  fs.writeFileSync(
    path.join(workflowDir, `${workflowName}.md`),
    `---
author: ${author}
title: ${workflowName}
---
${description}
`,
  );

  res.json({
    data: {
      ok: "ok",
    },
  });
});

patente.start({ port });
