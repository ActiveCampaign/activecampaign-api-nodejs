require('colors');
const rollup = require('rollup');
const watchOptions = require('./input.js');
watchOptions.output = require('./output.js');

const watcher = rollup.watch(watchOptions);

watcher.on('event', event => {
	switch (event.code) {
		case "START":
			process.stdout.write('\033c');
			console.log('STARTING...'.black.bgCyan);
			break;
		case "BUNDLE_START":
			process.stdout.write('\033c');
			console.log("WORKING...".black.bgCyan);
			break;
		case "BUNDLE_END":
			process.stdout.write('\033c');
			console.log("DONE".black.bgGreen);
			break;
		case "ERROR":
			process.stdout.write('\033c');
			var errorTitle = "Error in " +
				event.error.loc.file +
				" - line: " +
				event.error.loc.line +
				", column: " +
				event.error.loc.column;

			var errorCode = event.error.code + " - " + event.error.url;

			var errorFrame = event.error.frame;

			console.log("ERROR".black.bgRed);
			console.log("\n\n");
			console.log(errorTitle);
			console.log("\n");
			console.log(errorCode);
			console.log("\n\n");
			console.log(errorFrame);
			break;
	}
});
