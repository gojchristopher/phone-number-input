import axios from "axios";
import path from "path";
import fs from "fs";
import { format } from "prettier";

async function getCountry() {
  const { data } = await axios.get("https://restcountries.com/v2/all");

  const array = data.map(({ name, flag, callingCodes, alpha2Code }) => ({
    name,
    alpha2Code,
    callingCode: callingCodes.at(0),
    flag,
  }));

  fs.writeFileSync(
    path.join(process.cwd(), "src/constants/country.ts"),
    format(`export const country=${JSON.stringify(array)}`, {
      parser: "typescript",
    }),
    {
      encoding: "utf-8",
    }
  );
}

getCountry();
