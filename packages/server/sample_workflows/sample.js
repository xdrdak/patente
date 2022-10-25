import { patente } from "/public/workflow.js";

patente.run(async function* ({ ui, sleep }) {
  const x = yield* ui.input({ label: "Choose your pokemon" });
  console.log("you selected", x);
  yield* ui.spinner();
  await sleep(1000);
  const data = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  const json = await data.json();
  await sleep(1000);
  console.log(json);
  yield* ui.text({
    content: `${json.name} requires ${json.base_experience} experience to level-up`,
  });
});
