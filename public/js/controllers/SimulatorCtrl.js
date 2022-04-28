/**
 * SinulatorCtrl.js
 * A controller for the simulator.html page
 */

/** Declare some global variables just so they don't go out of scope **/
var globalMainWindow, globalSideWindow, globalGrid;

/** Create a new AngularJS module and attach a controller */
angular.module('SimulatorCtrl', ['WindowModule'])
/** On page load */
	.controller('SimulatorController', function($scope, $window) {
		$scope.tagline = 'Welcome to Simulator section!';
		// Attach the keydown event
		document.onkeydown = onKeyPress;
		// Grab the DOM elements and create Windows with them
		globalMainWindow = document.querySelectorAll('[name="MainWindow"]')[0];
		globalSideWindow = document.querySelectorAll('[name="SideWindow"]')[0];
		globalMainWindow = new Window(globalMainWindow, new SinglePlacement()); // eslint-disable-line no-undef
		globalSideWindow = new Window(globalSideWindow, new SortedListPlacement(null, 100)); // eslint-disable-line no-undef
		// Make the grid
		globalGrid = new GridDisplay(); // eslint-disable-line no-undef
		globalMainWindow.addDisplay(globalGrid);
		// Add the 'Add' button to the globalSideWindow
		globalSideWindow.addDisplay(new AddTokenDisplay()); // eslint-disable-line no-undef
	});

function onKeyPress(event) {
	globalMainWindow.onKeyPress(event);
	globalSideWindow.onKeyPress(event);
}

function Play() {
	document.getElementById('log').innerHTML += 'Play\n';
	console.log('Play');
	let sim = new Simulator(globalGrid, null); // eslint-disable-line no-undef
	console.log(sim);

	let initiative = [];
	globalSideWindow.displays.forEach((display) => {
		if (display.token !== undefined) {
			initiative.push(display.token);
		}
	});
	sim._forward(initiative);
	sim.updateDisplay();
}

/**
 * Called to acquire the user uploaded file and parse it to be added to the overall
 * creatures/action maps
 */
function Import() {

	console.log('Imported!');

	var importedFile = document.getElementById('file').files[0]; //grabs the uploaded file
	var reader = new FileReader();

	/**
     * when loaded onto the filereader, parse the json file to acquire each
     * creature the user uploaded
     */
	reader.onload = function() {
		var parser = new Parser(); // eslint-disable-line no-undef
		var fileContent = JSON.parse(reader.result);
		for (let i = 0; i < fileContent.length; i++) {
			parser._monsterJsonToSchema(fileContent[i]);
		}

	};
	reader.readAsText(importedFile);

}

function Log() {
	// Hide log button
	document.getElementById('log-button').style.display = 'none';
	document.getElementById('back-button').style.display = 'inline-block';
	document.getElementById('log').style.display = 'block';
	// Hide the initiative
	globalSideWindow.displays.forEach((display) => {
		globalSideWindow.placement.deactivateDisplay(display, globalSideWindow.displays);
	});
}

function Back() {
	// Hide log button
	document.getElementById('log-button').style.display = 'inline-block';
	document.getElementById('back-button').style.display = 'none';
	document.getElementById('log').style.display = 'none';
	// Show the initiative
	globalSideWindow.displays.forEach((display) => {
		globalSideWindow.placement.activateDisplay(globalSideWindow.dom, display, globalSideWindow.displays);
	});
}
