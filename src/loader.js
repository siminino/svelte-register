import sourceMapSupport from "source-map-support";

import fs from "fs";
import { basename, extname } from "path";

import { compile } from "svelte";
const babel = require("babel-core");

const BabelConfig = {
  presets: [
    ["env", {
      targets: {
        node: "current"
      }
    }]
  ]
};

function sanitize(input) {
	return basename(input)
		.replace(extname(input), '')
		.replace(/[^a-zA-Z_$0-9]+/g, '_')
		.replace(/^_/, '')
		.replace(/_$/, '')
		.replace(/^(\d)/, '_$1');
}

function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}

export default function loader(m, filename) {
  const code = fs.readFileSync(filename, "utf8");
  const options = {};

  let svelteResult;
  let result;

  options.filename = filename;
  options.format = 'es';
  if (!options.name) options.name = capitalize(sanitize(options.filename));

  try {
      svelteResult = compile(code, options);
      result = babel.transform(svelteResult.code, BabelConfig);
  } catch (err) {
      throw Error(err.toString() + '\n' + err.frame);
  }

  m._compile(result.code, filename);
}
