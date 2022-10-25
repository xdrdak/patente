import { createPatente } from "./src";

const port = 1337;
const workflowDir = `${__dirname}/sample_workflows`;

const patente = createPatente({ workflowDir });

patente.start({ port });
