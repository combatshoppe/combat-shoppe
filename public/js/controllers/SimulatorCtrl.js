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
		globalMainWindow = new Window(globalMainWindow, new SinglePlacement());
		globalSideWindow = new Window(globalSideWindow, new SortedListPlacement(null, 100));
		// Make the grid
		globalGrid = new GridDisplay();
		globalMainWindow.addDisplay(globalGrid);
		// Add the 'Add' button to the globalSideWindow
		globalSideWindow.addDisplay(new AddTokenDisplay());
	});

function Edit() {
	console.log("Edit");
}

function onKeyPress(event) {
    globalMainWindow.onKeyPress(event)
    globalSideWindow.onKeyPress(event)
}

function Reset() {
    console.log("Reset");
}

function Back() {
    console.log("Back");
}

function Play() {
    console.log("Play");
	sim = new Simulator(globalGrid, null);
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

function Forward() {
    console.log("Forward");
}

function Settings() {
    console.log("Settings");
}

function Import() {
    console.log("Import");
	//document.getElementById('file').click();
	var myUploadedFile = document.getElementById("file").files[0];
	console.log(myUploadedFile);
	//console.log(document.getElementById('file').click());

	//document.querySelector('#fileUpload').addEventListener('change', handleFileUpload, false);
	//console.log('previous save: ', retrieveSave());


}
