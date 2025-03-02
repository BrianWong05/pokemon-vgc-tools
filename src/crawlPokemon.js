import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { Generations } from "@pkmn/data";
import { Dex } from "@pkmn/dex";

const SAVE_PATH = "./public/images/pokemons";
const gens = new Generations(Dex);
const pkms = Array.from(gens.get(9).species);
let loading = false;

const pkmNameMap = {
  "Pikachu-Original": "Pikachu-Original_Cap",
  "Pikachu-Hoenn": "Pikachu-Hoenn_Cap",
  "Pikachu-Sinnoh": "Pikachu-Sinnoh_Cap",
  "Pikachu-Unova": "Pikachu-Unova_Cap",
  "Pikachu-Kalos": "Pikachu-Kalos_Cap",
  "Pikachu-Alola": "Pikachu-Alola_Cap",
  "Pikachu-World": "Pikachu-World_Cap",
  "Pikachu-Alola": "Pikachu-Alola_Cap",
  "Tauros-Paldea-Combat": "Tauros-Paldea_Combat",
  "Tauros-Paldea-Blaze": "Tauros-Paldea_Blaze",
  "Tauros-Paldea-Aqua": "Tauros-Paldea_Aqua",
  Basculin: "Basculin-Red",
  "Basculin-Blue-Striped": "Basculin-Blue",
  "Basculin-White-Striped": "Basculin-White",
  "Arceus-Bug": "Arceus_Bug_Dream",
  "Arceus-Dark": "Arceus_Dark_Dream",
  "Arceus-Dragon": "Arceus_Dragon_Dream",
  "Arceus-Electric": "Arceus_Electric_Dream",
  "Arceus-Fairy": "Arceus_Fairy_Dream",
  "Arceus-Fighting": "Arceus_Fighting_Dream",
  "Arceus-Fire": "Arceus_Fire_Dream",
  "Arceus-Flying": "Arceus_Flying_Dream",
  "Arceus-Ghost": "Arceus_Ghost_Dream",
  "Arceus-Grass": "Arceus_Grass_Dream",
  "Arceus-Ground": "Arceus_Ground_Dream",
  "Arceus-Ice": "Arceus_Ice_Dream",
  "Arceus-Poison": "Arceus_Poison_Dream",
  "Arceus-Psychic": "Arceus_Psychic_Dream",
  "Arceus-Rock": "Arceus_Rock_Dream",
  "Arceus-Steel": "Arceus_Steel_Dream",
  "Arceus-Water": "Arceus_Water_Dream",
  Meowstic: "Meowstic-Male",
  "Meowstic-F": "Meowstic-Female",
  "Vivillon-Pokeball": "Vivillon-Poké_Ball",
  "Greninja-Bond": "Greninja-Ash",
  "Rockruff-Dusk": "Rockruff",
  "Minior-Meteor": "Minior",
  "Necrozma-Dusk-Mane": "Necrozma-Dusk_Mane",
  "Necrozma-Dawn-Wings": "Necrozma-Dawn_Wings",
  Indeedee: "Indeedee-Male",
  "Indeedee-F": "Indeedee-Female",
  Zacian: "Zacian-Hero",
  "Zacian-Crowned": "Zacian",
  Zamazenta: "Zamazenta-Hero",
  "Zamazenta-Crowned": "Zamazenta",
  "Urshifu-Rapid-Strike": "Urshifu-Rapid_Strike",
  Maushold: "Maushold-Three",
  Toxtricity: "Toxtricity-Amped",
  "Toxtricity-Low-Key": "Toxtricity-Low_Key",
  "Maushold-Four": "Maushold",
  "Dudunsparce-Three-Segment": "Dudunsparce-Three",
  Ogerpon: "Ogerpon-Teal_Mask",
  Basculegion: "Basculegion-Male",
  "Basculegion-F": "Basculegion-Female",
  Oinkologne: "Oinkologne-Male",
  "Oinkologne-F": "Oinkologne-Female",
  "Sinistea-Antique": "HOME0854A_b",
  "Polteageist-Antique": "HOME0855A_b",
  "Sinistcha-Masterpiece": "HOME1013M_b",
  "Poltchageist-Artisan": "HOME1012A_b",
  "Ogerpon-Teal-Tera": "Ogerpon-Teal_Terastal_Dream",
  "Ogerpon-Wellspring": "Ogerpon-Wellspring_Mask",
  "Ogerpon-Wellspring-Tera": "Ogerpon-Wellspring_Terastal_Dream",
  "Ogerpon-Hearthflame": "Ogerpon-Hearthflame_Mask",
  "Ogerpon-Hearthflame-Tera": "Ogerpon-Hearthflame_Terastal_Dream",
  "Ogerpon-Cornerstone": "Ogerpon-Cornerstone_Mask",
  "Ogerpon-Cornerstone-Tera": "Ogerpon-Cornerstone_Terastal_Dream",
  "Terapagos-Stellar": "HOME1024S",
};

export async function downloadPokemonImage(pkm, saveName = "") {
  // Get the image filename
  const imgFilename = saveName ? `${saveName}_SV.png` : `${pkm.name}_SV.png`;
  // const imgFilename = `${fileName.replace(/\s+/g, "_")}_SV.png`;
  const savePath = path.join(SAVE_PATH, imgFilename.replace(/\s+/g, "_"));

  // **Check if file already exists**
  if (fs.existsSync(savePath)) {
    console.log(`✅ Image already exists: ${savePath}`);
    loading = false;
    return savePath;
  }
  try {
    console.log(`✅ Preparing image: ${savePath}`);

    const pkmName = pkmNameMap[pkm.name] || pkm.name.replace(/\s+/g, "_");
    // console.log("pkmname", pkmName);

    let item_URL = `https://bulbapedia.bulbagarden.net/wiki/File:${String(pkm.num).padStart(4, "0")}${pkmName}.png`;
    if (pkmName.includes("HOME")) {
      item_URL = `https://bulbapedia.bulbagarden.net/wiki/File:${pkmName}.png`;
    }
    if (pkmName.includes("Arceus")) {
      item_URL = `https://bulbapedia.bulbagarden.net/wiki/File:${String(pkm.num).padStart(3, "0")}${pkmName}.png`;
    }
    console.log(item_URL);
    // Fetch the HTML content
    console.log(`loading website`);
    const { data } = await axios.get(item_URL);
    const $ = cheerio.load(data);
    console.log(`loaded website`);

    // Find the image (Bulbapedia images are inside `.infobox img`)
    // const imgElement = $(".mw-mmv-final-image");
    // const imgElement = $(`[alt=File:${String(pkm.num).padStart(4, "0")}${pkm.name}.png]`);
    const imgElement = $(`.fullImageLink`).find("img");
    const imgUrl = `${imgElement.attr("src")}`; // Get the image URL

    if (!imgUrl) {
      console.log("Image not found.");
      loading = false;
      return;
    }

    console.log(`✅ Downloading image: ${savePath}`);
    // Download and save the image
    const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(savePath, response.data);

    console.log(`✅ Image downloaded: ${savePath}`);
    loading = false;
    return savePath;
  } catch (error) {
    // console.log(item_URL, imgUrl);
    loading = false;
    console.error("Error:", error);
  }
}

// pkms.forEach((pkm) => {
//   // console.log(pkm.name, pkm.num, pkm.baseSpecies, typeof pkm.num);
//   while (!loading) {
//     downloadPokemonImage(pkm);
//     loading = true;
//   }
// });

for (let i = 0; i < pkms.length; i) {
  // console.log(i, loading);
  if (!loading) {
    loading = true;
    await downloadPokemonImage(pkms[i]);
  }
  if (loading) continue;
  if (!loading) i++;
}

// const pkmname = "Pikachu-Original";
// const pkmName = pkmNameMap[pkmname] || pkmname.replace(/\s+/g, "_");
// console.log(pkmName);

// downloadPokemonImage(pkms[0]);
// const savePath = "raichu.png";
// const imgUrl = "https://bulbapedia.bulbagarden.net/wiki/File:0026Raichu-Alola.png";
// // ("img.mw-mmv-final-image");
// const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
// fs.writeFileSync(savePath, response.data);

// downloadItemImage("Black Belt");
