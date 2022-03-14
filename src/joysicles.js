const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = "Joysicle";
const description = "Hello there! I am a chilled flavorful popsicle of the NFT (nifty) Joysicles. -A fun loving frozen flavor on a stick who loves long dips in the freezer followed by long hot summer days in the shade.\n\nCome Collect them all before they melt!";
const baseUri = "ipfs://NewUriToReplace";

const solanaMetadata = {
  symbol: "YC",
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://www.youtube.com/c/hashlipsnft",
  creators: [
    {
      address: "7fXNuer5sbZtaTEPhtJ5g5gNtuyRoKkvxdjEjEnPN4mC",
      share: 100,
    },
  ],
};



// Constants
// --------------------------- 

const attributeSeperator = "_";
const attributeSpace = "%";
const background = { generate: false, brightness: "80%", static: false, default: "#000000", };
const debugLogs = false;
const extraMetadata = {};
const gif = { export: false, repeat: 0, quality: 100, delay: 500, };
const format = { width: 3072, height: 3072, smoothing: false, };
const pixelFormat = { ratio: 2 / 128, };
const preview = { thumbPerRow: 30, thumbWidth: 200, imageRatio: format.height / format.width, imageName: "preview.png", };
const preview_gif = { numberOfImages: 5, order: "ASC", // ASC, DESC, MIXED
  repeat: 0, quality: 100, delay: 500, imageName: "preview.gif", };
const rarityDelimiter = "|";
const shuffleLayerConfigurations = true;
const text = { only: false, color: "#ffffff", size: 20, xGap: 40, yGap: 40, align: "left", baseline: "top", weight: "regular", family: "Courier", spacer: " => ", };
const uniqueDnaTorrance = 10000;


 
// Layer configurations
// --------------------------- 

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
  {
    growEditionSizeTo: 3,
    layersOrder: [
      { name: "Backgrounds" },
      { name: "Outlines Square" },
      { name: "Sticks" },
      { name: "Flavors Square" },
      { name: "Dimples", options: { blend: MODE.softLight, opacity: 0.4, }, },
      { name: "Lines Square" },
      { name: "Freckles" },
      { name: "Moods" },
    ],
  },
  {
    growEditionSizeTo: 6,
    layersOrder: [
      { name: "Backgrounds" },
      { name: "Outlines Angled" },
      { name: "Sticks" },
      { name: "Flavors Angled" },
      { name: "Dimples",  options: { blend: MODE.softLight, opacity: 0.4, }, },
      { name: "Lines Angled" },
      { name: "Freckles" },
      { name: "Moods" },
    ]
  },
];



// Export
// --------------------------- 

module.exports = {
  attributeSeperator,
  attributeSpace,
  background,
  baseUri,
  debugLogs,
  description,
  extraMetadata,
  format,
  gif,
  layerConfigurations,
  namePrefix,
  network,
  pixelFormat,
  preview,
  preview_gif,
  rarityDelimiter,
  shuffleLayerConfigurations,
  solanaMetadata,
  text,
  uniqueDnaTorrance,
};
