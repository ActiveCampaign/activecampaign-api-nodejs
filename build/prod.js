const rollup = require('rollup');
const inputOptions = require('./input.js');
const outputOptions = require('./output.js');

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  // generate code and a sourcemap
  await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);
}

build();
