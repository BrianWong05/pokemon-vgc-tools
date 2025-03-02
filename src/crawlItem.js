import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { Generations } from "@pkmn/data";
import { Dex } from "@pkmn/dex";

const SAVE_PATH = "./public/images/items";
const gens = new Generations(Dex);
const items = Array.from(gens.get(9).items);

export async function downloadItemImage(fileName, svaeName = "") {
  // Get the image filename
  const imgFilename = svaeName ? `${svaeName.replace(/\s+/g, "_")}_SV.png` : `${fileName.replace(/\s+/g, "_")}_SV.png`;
  // const imgFilename = `${fileName.replace(/\s+/g, "_")}_SV.png`;
  const savePath = path.join(SAVE_PATH, imgFilename);

  // **Check if file already exists**
  if (fs.existsSync(savePath)) {
    console.log(`✅ Image already exists: ${savePath}`);
    return savePath;
  }
  try {
    console.log(`✅ Downloading image: ${savePath}`);

    const item_URL = `https://bulbapedia.bulbagarden.net/wiki/${fileName.replace(/\s+/g, "_")}`;
    console.log(item_URL);
    // Fetch the HTML content
    const { data } = await axios.get(item_URL);
    const $ = cheerio.load(data);

    // Find the image (Bulbapedia images are inside `.infobox img`)
    const imgElement = $(`[title="${fileName}"]`).find("img");
    const imgUrl = `${imgElement.attr("src")}`; // Get the image URL

    if (!imgUrl) {
      console.log("Image not found.");
      return;
    }

    // Download and save the image
    const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(savePath, response.data);

    console.log(`✅ Image downloaded: ${savePath}`);
    return savePath;
  } catch (error) {
    try {
      const item_URL = `https://bulbapedia.bulbagarden.net/wiki/${fileName.replace(/\s+/g, "_")}_(item)`;
      console.log(item_URL);
      // Fetch the HTML content
      const { data } = await axios.get(item_URL);
      const $ = cheerio.load(data);

      // Find the image (Bulbapedia images are inside `.infobox img`)
      const imgElement = $(`[title="${fileName}"]`).find("img");
      const imgUrl = `${imgElement.attr("src")}`; // Get the image URL

      if (!imgUrl) {
        console.log("Image not found.");
        return;
      }

      // Download and save the image
      const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(savePath, response.data);

      console.log(`✅ Image downloaded: ${savePath}`);
      return savePath;
    } catch (alterror) {
      console.error("Alt Error:", alterror);
    }
  }
}

// console.log(items);
items.map((item) => {
  // console.log(item.name);
  if (item.name === "Up-Grade") {
    const svaeName = item.name;
    item.name = "Upgrade";
    downloadItemImage(item.name, svaeName);
  } else if (item.name === "Poke Ball") {
    const svaeName = item.name;
    item.name = "Poké Ball";
    downloadItemImage(item.name, svaeName);
  } else {
    downloadItemImage(item.name);
  }
});

// downloadItemImage("Black Belt");
