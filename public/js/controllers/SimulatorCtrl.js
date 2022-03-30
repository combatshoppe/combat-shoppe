/**
 * SinulatorCtrl.js
 * A controller for the simulator.html page
 */

/** Declare some global variables just so they don't go out of scope */
var globalMainWindow, globalSideWindow, globalGrid;

// Remove these later
var STOCK_IMAGE = 'https://i.pinimg.com/originals/7c/c7/aa/7cc7aa6b6fd0d30b2ab78eabcd44c94e.png';


var ACTION_SCHEMA = new ActionSchema({name: 'Test Axe'});
var testAction = new Action(ACTION_SCHEMA);
var testActionList = [testAction];

var STOCK_SCHEMA = new CreatureSchema({name: 'Dwarven Warrior', dex: 12, src: STOCK_IMAGE, defaultBehavior: BehaviorType.Random, actions: testActionList});
var PLUS_IMAGE = 'https://cdn.onlinewebfonts.com/svg/img_45824.png';

console.log(STOCK_SCHEMA)

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

	/* TESTING THE SIMULATOR HERE */

	// Substituting null for deltas since those aren't implemented yet
	sim = new Simulator(globalGrid, null);
	console.log(sim);

	let initiative = [];
	globalSideWindow.displays.forEach((display) => {
		if (display.token !== undefined) {
			initiative.push(display.token);
		}
	});

	initiative[0].row = 0;
	initiative[0].column = 0;
	initiative[1].row = 1;
	initiative[1].column = 1;

	console.log(initiative)
	sim._forward(initiative);
	// console.log(initiative);
	sim.updateDisplay();
}

function onKeyPress(event) {
	globalMainWindow.onKeyPress(event)
	globalSideWindow.onKeyPress(event)
}

function LeftArrow() {
	console.log("LeftArrow");
}

function RightArrow() {
	console.log("RightArrow");
}

function DubLeftArrow() {
	console.log("DubLeftArrow");
}

function DubRightArrow() {
	console.log("DubRightArrow");
}
