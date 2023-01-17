import fs from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";
const fileName = fileURLToPath(import.meta.url);
const appDir = dirname(fileName);

const nav = fs.readFileSync(appDir + "/public/components/nav/nav.html", "utf8");
const footer = fs.readFileSync(appDir + "/public/components/footer/footer.html", "utf8");

function createPage(path, options = { title: "Nodefolio" }) {
    return (nav + fs.readFileSync(appDir + `/public/pages/${path}`, "utf8") + footer)
    .replace("%%DOCUMENT_TITLE%%", options.title)
    .replace("%%SCRIPT_PLACEHOLDER%%", options?.scriptTag || "");
}

export default createPage;