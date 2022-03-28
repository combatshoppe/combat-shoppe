/**
 * SinulatorCtrl.js
 * A controller for the simulator.html page
 */

/** Declare some global variables just so they don't go out of scope */
var globalMainWindow, globalSideWindow, globalGrid;

// Remove these later
var STOCK_IMAGE = 'https://i.pinimg.com/originals/7c/c7/aa/7cc7aa6b6fd0d30b2ab78eabcd44c94e.png';
var STOCK_SCHEMA = new CreatureSchema({name: 'Dwarven Warrior', dex: 12, src: STOCK_IMAGE});
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



		/* TESTING THE PATHFINDING HERE */

		// These tokens don't seem to be holding onto the positions correctly
		// token1 = globalGrid.addToken(1, 5, STOCK_SCHEMA);
		// token2 = globalGrid.addToken(7, 8, STOCK_SCHEMA);

		// Substituting null for deltas since those aren't implemented yet
		sim = new Simulator(globalGrid, null);
		console.log(sim);

		// This is commented out for when the tokens hold the row and column values
		// let positions = sim._pathfind(sim.currentDisplay.grid, new Position(token1.row, token1.column), new Position(token2.row, token2.column));

		let x1 = 1, y1 = 5, x2 = 7, y2 = 8;
		let positions = sim._pathfind(sim.currentDisplay.grid, new Position(x1, y1), new Position(x2, y2));
		console.log("Path from (", x1, ",", y1, ") to (", x2, ",", y2, ")");
		positions.forEach((position) => {console.log(position)});

	});

function onKeyPress(event) {
	globalMainWindow.onKeyPress(event)
	globalSideWindow.onKeyPress(event)
}

function Edit() {
	console.log("Edit");
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
