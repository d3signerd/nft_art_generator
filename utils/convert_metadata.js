// Constants
const basePath = process.cwd();
const fs = require("fs");
const metadataList = [];
const runArgs = process.argv.slice(2).reduce((args, val) => {
					if (val.includes("=")) {
						let [key, value] = val.split("=");
						args[key] = value;
					} else {
						args[val] = true;
					}	
					return args
				}, {});

// Paths
const buildDir = `${basePath}/build`;
const dataPath = `${buildDir}/json/_metadata.json`;
const convertedDir = `${buildDir}/converted_json`;

// Read the JSON file
let rawData = fs.readFileSync(dataPath);
let data = JSON.parse(rawData);


/**
 * Clean
 **/
const clean = () => {
	if (fs.existsSync(convertedDir)) {
		fs.rmSync(convertedDir, { recursive: true });
		console.info("Existing conversion cleared...");
	}
};
	

/**
 * Setup
 * 
 * Cleansing of old or existing conversions
 * 
 **/
const setup = () => {
	console.info("Conversion setup...");

	clean();

	/// Carry on otherwise
	fs.mkdirSync(convertedDir);

	// Check for existing metadata first, kinda need it
	if (!fs.existsSync(`${buildDir}/json/_metadata.json`)) {
		console.error("\n\n** Whoops! You need something to convert!!", "\n**********\n");
		throw("There is no metadata to convert... Please create it first, thanks!");
	}
};


/**
 * Start convertint
 * 
 * The morphing engine
 **/
const startConverting = () => {
	console.info("");
	console.info("Starting conversion");
	console.info("----------");

	// Convert items
	data.forEach((item) => { convertItem(item); });

	// Save the converted data
	console.assert(metadataList.length > 0, "\n\n** There was no saved data...", "\n**********\n");
	saveMetadata(metadataList)

	/// Copy file to upload directory
};


/**
 * Save metadata types
 * 
 * Stores the collection of metadata into one main file.
 * @param _data: The data to save.
 **/
const saveMetadata = (_data) => {
	// let nfts = { nft: _data, };
	// let json = JSON.stringify(nfts, null, 2);
	// fs.writeFileSync(`${convertedDir}/converted.json`, json);

	const converted = [];
	// const upload = [];
	// const sell = [];

	// Create typed items
	_data.forEach(item => {
		converted.push({
			file_path: item.file_path,
			nft_name: item.nft_name,
			external_link: item.external_link,
			description: item.description,
			collection: item.collection,
			properties: item.properties,
			levels: item.levels,
			stats: item.stats,
			unlockable_content: item.unlockable_content,
			explicit_and_sensitive_content: item.explicit_and_sensitive_content,
			supply: item.supply,
			blockchain: item.blockchain,
			sale_type: item.sale_type,
			price: item.price,
			method: item.method,
			duration: item.duration,
			specific_buyer: item.specific_buyer,
			quantity: item.quantity,
			nft_url: "",
		});

		// upload.push({
		// 	file_path: item.file_path,
		// 	nft_name: item.nft_name,
		// 	external_link: item.external_link,
		// 	description: item.description,
		// 	collection: item.collection,
		// 	properties: item.properties,
		// 	levels: item.levels,
		// 	stats: item.stats,
		// 	unlockable_content: item.unlockable_content,
		// 	explicit_and_sensitive_content: item.explicit_and_sensitive_content,
		// 	supply: item.supply,
		// 	blockchain: item.blockchain,
		// });

		// sell.push({
		// 	nft_url: "",
		// 	supply: item.supply,
		// 	blockchain: item.blockchain,
		// 	sale_type: item.sale_type,
		// 	price: item.price,
		// 	method: item.method,
		// 	duration: item.duration,
		// 	specific_buyer: item.specific_buyer,
		// 	quantity: item.quantity,
		// });
	});

	// Save
	saveTypedMetadata(converted, "converted");
	// saveTypedMetadata(upload, "upload");
	// saveTypedMetadata(sell, "sell");
};

/** 
 * Save typed metadata
 * 
 * Saves the meta data typed file.
 * @param _data: The data.
 * @param _type: The type of file to write.
 **/
const saveTypedMetadata = (_data, _type) => {
	let nfts = { nft: _data, };
	let json = JSON.stringify(nfts, null, 2);
	// fs.writeFileSync(`${convertedDir}/converted_${_type}.json`, json); 
	fs.writeFileSync(`${convertedDir}/${runArgs.name}.json`, json); 
}


// Conversions
// --------------------------

/**
 * Get blockchain
 **/
const getBlockchain = () => {
	if (runArgs.block.toLowerCase() == "poly" || runArgs.block.toLowerCase() == "polygon") {
		return "Polygon";
	} else {
		return "Ethereum";
	}
};

/**
 * Get sale type
 **/
const getSaleType = () => {
	if (!runArgs.sale_method || !runArgs.method_price) return "";

	if (runArgs.sale_type.toLowerCase() == "fixed" || runArgs.sale_type.toLowerCase() == "fix" || runArgs.sale_type.toLowerCase() == "fixed price") { 
		return "Fixed Price"; 
	} else { 
		return "Timed Auction"; 
	}
};

/**
 * Get sale method
 **/
const getSaleMethod = () => {
	if (!runArgs.sale_type || !runArgs.method_price) return "";
	
	if (runArgs.sale_method.toLowerCase() == "declining" || runArgs.sale_method.toLowerCase() == "dec") { 
		return "Sell with declining price"; 
	} else { 
		return "Sell to highest bidder"; 
	}
};

/**
 * Gets sale method
 **/
const getSaleMethodDic = () =>  {
	if (!runArgs.sale_type || !runArgs.sale_method || !runArgs.method_price) return "";

	return [getSaleMethod(), Number(runArgs.method_price)];
};

/**
 * Convert items
 *
 * Transforms existing metadata 
 * @param item: The item to convert
 **/
const convertItem = (item) => {
	console.log(`Converting: ${item.name}`);

	let fileName = `${convertedDir}/${item.edition}.json`;

	let convertedData = {
		file_path: `${buildDir}/images/${item.edition}.png`,
		nft_name: `${item.name}`,
		external_link: "",
		description: `${item.description}`,
		collection: runArgs.name,
		
		properties: convertProperties(item.attributes),
		levels: "",
		stats: "",

		unlockable_content: runArgs.unlockable ?? false,
		explicit_and_sensitive_content: runArgs.explicit ?? false,
		supply: 1,
		blockchain: getBlockchain(),

		sale_type: getSaleType(),
		price: Number(runArgs.price),	
		method: getSaleMethodDic(),
		duration: runArgs.sale_dur,
		specific_buyer: false,
		quantity: 1,
	};

	fs.writeFileSync(fileName, JSON.stringify(convertedData, null, 2));
	metadataList.push(convertedData);
};


/**
 * Convert properties
 *
 * Transforms existing metadata properties 
 * @param attributes: The attributes to convert
 **/
const convertProperties = (attributes) => {
	let properties = [];

	attributes.forEach(item => {
		let converted = {
			"type": item.trait_type,
 			"name": item.value,
		};
		properties.push(converted);
	})

	return properties
}

/**
 * Copy files
 **/
const copyFiles = () => {
	const path = require("path");
	const copyPath = `${require("path").dirname(basePath)}/Uploader/data/${runArgs.name}`

	// Check to create directory
	if (!fs.existsSync(copyPath)) {
		fs.mkdirSync(copyPath);
	}

	fs.copyFileSync(`${convertedDir}/${runArgs.name}.json`, `${copyPath}/${runArgs.name}.json`)
	// fs.copyFileSync(`${convertedDir}/converted_all.json`, `${copyPath}/converted_all.json`)
	// fs.copyFileSync(`${convertedDir}/converted_sell.json`, `${copyPath}/converted_sell.json`)
	// fs.copyFileSync(`${convertedDir}/converted_upload.json`, `${copyPath}/converted_upload.json`)
}


// Check for help first
if (runArgs.help) {
	console.log("\n[Convert Metadata] Help\n")

	console.log("	clean_only 		: Cleans the conversion directory and metadata");
	console.log();

	console.log("	name  (req)		: The name of the target NFT collection.");
	console.log();

	console.log("	unlockable 		: Whether or not there is unlockable content. 	| Default: false");
	console.log("	explicit		: If the NFT contains explicit content. 	| Default: false");
	console.log("	block			: The blockchain to mint on. 			| Options: [eth, poly/polygon] - Default: eth");
	console.log();

	console.log("	sale_type		: The sale posting type. 			| Options: [timed, fixed/fix/fixed price] - Default: timed");
	console.log("	price  (req) 		: How much? 					| Suggest start is 0.025");
	console.log("	sale_method		: The sales strategy. 				| Options: [declining/dec, highest]");
	console.log("	method_price		: The sale strategy price.  			| Declining strategy decreases price.");
	console.log("	sale_dur		: The sale duration.				| Options:");
	console.log("										  [`from_date`, `to_date`]");
	console.log("										  [`days/weeks/months`] `days/weeks/months`");
	console.log("										  `days/weeks/months`");
	console.log("										  Examples:");
	console.log("										  [`01-01-2022 14:00`, `01-04-2022 15:00`]");
	console.log("										  [`1 week`]");
	console.log("										  `1 week`");
	console.log();
	console.log(`Example: name="Collection Name" block=eth sale_type=timed price=0.025 sale_method=highest method_price=0.002 sale_dur="1 week"`);

	console.log("\n")
	process.exit();
};

// Then, check to only clean
if (runArgs.clean_only) { 
	clean();
	console.log("This was clean only, exiting...\n"); 
	process.exit();
}

// Check for required run args
var shouldExit = false;
if (!runArgs.name) { console.error("name is REQUIRED"); shouldExit = true; }
if (runArgs.unlockable && !(runArgs.unlockable == "true" || runArgs.unlockable == "false")) { console.error("unlockable needs to be true | false") }
if (runArgs.explicit && !(runArgs.explicit == "true" || runArgs.explicit == "false")) { console.error("explicit needs to be true | false") }
if (!runArgs.price) { console.error("price is sadly REQUIRED"); shouldExit = true; }
if (runArgs.sale_method && !runArgs.method_price) { console.error("sale_method REQUIRES a method_price"); shouldExit = true; }
if (runArgs.method_price && !runArgs.sale_method) { console.error("method_price REQUIRES a sale_method"); shouldExit = true; }
if (runArgs.sale_method && !runArgs.sale_dur) { console.error("sale_method REQUIRES a sale_dur"); shouldExit = true; }
if (runArgs.sale_dur && !runArgs.sale_method) { console.error("sale_dur REQUIRES a sale_method"); shouldExit = true; }
if (shouldExit) { process.exit(); }

// Last, start all the things
setup();
startConverting();
copyFiles();
