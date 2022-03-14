const basePath = process.cwd();
const fs = require("fs");
const layersDir = `${basePath}/layers`;

const config = process.argv.slice(2)[0] ?? "config";
const { 
  attributeSeperator,
  attributeSpace,
  layerConfigurations 
} = require(`${basePath}/src/${config}.js`);

const { getElements } = require("../src/main.js");

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);
let editionSize = data.length;

let rarityData = [];

// intialize layers to chart
layerConfigurations.forEach((config) => {

  let layers = config.layersOrder;
  layers.forEach((layer) => {

    // Get elements for each layer
    let elements = getElements(`${layersDir}/${layer.name}/`);
    elements.forEach((element) => {

      const attributes = element.name.split(" ").flatMap((attribute) => ({
        trait: (attribute.split(`${attributeSeperator}`)[1] ? attribute.split(`${attributeSeperator}`)[0] : _element.layer.name).replace(`${attributeSpace}`, " "),
        value: (attribute.split(`${attributeSeperator}`)[1] ?? selectedElement.name ).replace(`${attributeSpace}`, " "),
      }));

      attributes.forEach((attribute) => {

        let rarityDataElement = {
          trait: attribute.value,
          weight: element.weight.toFixed(0),
          occurrence: 0,
        };

        // Check to add trait
        if (!rarityData[attribute.trait]) {
          rarityData[attribute.trait] = [];
        }

        // Check to add value
        if (rarityData[attribute.trait].filter((element) => { return element.trait === rarityDataElement.trait }).length == 0) {
          rarityData[attribute.trait].push(rarityDataElement);
        }
      });
    });
  });
});

// fill up rarity chart with occurrences from metadata
data.forEach((element) => {
  let attributes = element.attributes;
  attributes.forEach((attribute) => {
    let traitType = attribute.trait_type;
    let value = attribute.value;

    let rarityDataTraits = rarityData[traitType];
    rarityDataTraits.forEach((rarityDataTrait) => {
      if (rarityDataTrait.trait == value) {
        // keep track of occurrences
        rarityDataTrait.occurrence++;
      }
    });
  });
});

// convert occurrences to occurence string
for (var layer in rarityData) {
  for (var attribute in rarityData[layer]) {
    // get chance
    let chance =
      ((rarityData[layer][attribute].occurrence / editionSize) * 100).toFixed(2);

    // show two decimal places in percent
    rarityData[layer][attribute].occurrence =
      `${rarityData[layer][attribute].occurrence} in ${editionSize} editions (${chance} %)`;
  }
}

// print out rarity data
for (var layer in rarityData) {
  console.log(`Trait type: ${layer}`);
  for (var trait in rarityData[layer]) {
    console.log(rarityData[layer][trait]);
  }
  console.log();
}
