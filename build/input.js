const json = require('rollup-plugin-json');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');

module.exports = {
	input: './lib/ActiveCampaign.js',
	plugins: [
		resolve({
			jsnext: true,
			browser: true,
			preferBuiltins: true
		}),
		json(),
		commonjs({
			include: "node_modules/**"
		}),
		builtins(),
		globals(),
		babel()
	]
}
