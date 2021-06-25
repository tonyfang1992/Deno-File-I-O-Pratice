import { join } from "https://deno.land/std@0.99.0/path/mod.ts";
import { BufReader } from "https://deno.land/std@0.99.0/io/bufio.ts";
import { parse } from "https://deno.land/std@0.99.0/encoding/csv.ts";

async function loadPlanetsData() {
  const path = join(".", "kepler_exoplanets_nasa.csv");

  const file = await Deno.open(path);
  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    skipFirstRow: true,
    comment: "#",
  });
  Deno.close(file.rid);

  console.log(result);
}

await loadPlanetsData();
