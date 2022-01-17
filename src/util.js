import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

function dirname(meta, ...paths) {
  if (typeof meta !== `string` && !meta.url) {
    throw new Error(`meta isn't a string nor meta.url is not defined`);
  }
  const __dirname = path.dirname(fileURLToPath(meta.url));

  if (paths.length) {
    return path.join(__dirname, ...paths);
  }
  return __dirname;
}

function loadJSON(filename) {
	return JSON.parse(fs.readFileSync(dirname(import.meta, filename), "utf8"));
}

function randomItem(arr) {
	if (arr instanceof Set) {
		// I don't give a shit about efficiency
		arr = [...arr];
	}
	return arr[Math.floor(Math.random() * arr.length)];
}

// This algorithm will break if u supply count that is greate than the length of the array
// :kekw:
function randomItems(arr, count = 1) {
	const res = [];
	while (res.length < count) {
		const item = randomItem(arr);
		if (!res.includes(item)) {
			res.push(item);
		}
	}
	return res;
}

export { loadJSON, randomItem, randomItems };
