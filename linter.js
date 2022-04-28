const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

// Function to cause a slight delay
function delay(time) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(time);
		}, time * 1000);
	});
}

// Run a bash command
async function runShellCmd(cmd) {
	return new Promise((resolve, reject) => {
		shell.exec(cmd, async (code, stdout, stderr) => {
			if (!code) {
				return resolve(stdout);
			}
			return reject(stderr);
		});
	});
}

async function lintAllFiles(directoryPath) {
	// Get all files in this directory
	const files = fs.readdirSync(directoryPath);
	// For each file
	for (let i in files) {
		const filePath = path.join(directoryPath, files[i]);
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			// Recursively lint
			await lintAllFiles(filePath);
		} else {
			if (filePath.endsWith('.js')) {
				// Lint the file
				console.log('\x1b[33m%s\x1b[0m', '\nLinting ' + filePath + '...');
				await runShellCmd('./node_modules/.bin/eslint ' + filePath + ' --fix');
				// Make sure the right output prints under the right lint
				await delay(0.1);
			}
		}
	}
	return new Promise((resolve, reject) => {
		return resolve();
	});
}

async function lint() {
	// Lint all the files
	console.log('\x1b[33m%s\x1b[0m', '\nLinting server.js...');
	await runShellCmd('./node_modules/.bin/eslint server.js --fix --env node');
	console.log('\x1b[33m%s\x1b[0m', '\nLinting linter.js...');
	await runShellCmd('./node_modules/.bin/eslint linter.js --fix --env node');
	lintAllFiles('./public/js');
}

lint();
