import express from "express";

export function createPatente() {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  return {
    express: app,
    start(opt: { port: number }) {
      app.listen(opt.port, () => {
        console.log(`Example app listening on port ${opt.port}`);
      });
    },
  };
}
