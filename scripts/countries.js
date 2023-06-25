// @ts-check

import axios from "axios";
import fs from "fs";
import path from "path";
import prettier from "prettier";

/**
 *
 * @typedef Country
 * @property {string} name
 * @property {string} flag
 * @property {string} alpha2Code
 * @property {string[]} callingCodes
 *
 */

const countriesApi = "https://restcountries.com/v2/all";

async function main() {
	/** @type {import('axios').AxiosResponse<Country[]>} */
	const response = await axios.get(countriesApi);
	const countries = response.data.map(function normalize({
		name,
		flag,
		alpha2Code,
		callingCodes,
	}) {
		return {
			name,
			flag,
			code: alpha2Code,
			areaCode: callingCodes[0],
		};
	});

	const destination = path.join(process.cwd(), "src/PhoneNumberInput/countries.ts");
	const content = prettier.format(
		`export const countries = ${JSON.stringify(countries)}`,
		{
			parser: "typescript",
		},
	);

	fs.writeFileSync(destination, content, { encoding: "utf-8" });
}

main();
