const { createPatente } = require("@patente/server");

const app = createPatente({
  workflowDir: "workflows",
});

app.start({ port: 1337 });
