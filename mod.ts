import { join } from "https://deno.land/std@0.99.0/path/mod.ts";
import { BufReader } from "https://deno.land/std@0.99.0/io/bufio.ts";
import { parse } from "https://deno.land/std@0.99.0/encoding/csv.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

interface Plant {
  [key: string]: string;
}

async function loadPlanetsData() {
  const path = join(".", "kepler_exoplanets_nasa.csv");

  const file = await Deno.open(path);
  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    skipFirstRow: true,
    comment: "#",
  });
  Deno.close(file.rid);

  const plants = (result as Array<Plant>).filter((plant) => {
    const plantRadius = Number(plant["koi_prad"]);
    const stellarMass = Number(plant["koi_smass"]);
    const stellarRadius = Number(plant["koi_srad"]);

    return plant["koi_disposition"] === "CONFIRMED" && plantRadius > 0.5 &&
      plantRadius < 1.5 && stellarMass > 0.78 && stellarMass < 1.04 &&
      stellarRadius > 0.99 && stellarRadius < 1.01;
  });

  return plants.map((plant) => {
    return _.pick(plant, [
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "kepler_name",
    ]);
  });
}

const newEarths = await loadPlanetsData();
console.log(newEarths);
console.log(`It has ${newEarths.length} plant we can live in!`);
