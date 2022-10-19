import { createPatente } from "./src";

const port = 1337;

const patente = createPatente();

patente.start({ port });
