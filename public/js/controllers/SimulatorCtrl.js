/**
 * SinulatorCtrl.js
 * A controller for the simulator.html page
 */

/** Declare some global variables just so they don't go out of scope */
var globalMainWindow, globalSideWindow, globalGrid;
var STOCK_IMAGE = 'https://i.pinimg.com/originals/7c/c7/aa/7cc7aa6b6fd0d30b2ab78eabcd44c94e.png'
var STOCK_SCHEMA = new CreatureSchema({name: 'Dwarven Warrior', dex: 12, src: STOCK_IMAGE});

console.log(STOCK_SCHEMA)

/** Create a new AngularJS module and attach a controller */
angular.module('SimulatorCtrl', ['WindowModule'])
	/** On page load */
	.controller('SimulatorController', function($scope, $window) {
		$scope.tagline = 'Welcome to Simulator section!';
		// Grab the DOM elements and create Windows with them
		globalMainWindow = document.querySelectorAll('[name="MainWindow"]')[0];
		globalSideWindow = document.querySelectorAll('[name="SideWindow"]')[0];
		globalMainWindow = new Window(globalMainWindow, new SinglePlacement());
		globalSideWindow = new Window(globalSideWindow, new SortedListPlacement(null, 100));
		// Make the grid
		globalGrid = new GridDisplay();
		globalMainWindow.addDisplay(globalGrid);
		// Add tokens to the grid
		let token;
		token = globalGrid.addToken(0, 0, STOCK_SCHEMA);
		globalSideWindow.addDisplay(new InitiativeDisplay().linkToken(token));
		token = globalGrid.addToken(0, 0, STOCK_SCHEMA);
		globalSideWindow.addDisplay(new InitiativeDisplay().linkToken(token));
		token = globalGrid.addToken(0, 0, STOCK_SCHEMA);
		globalSideWindow.addDisplay(new InitiativeDisplay().linkToken(token));
		token = globalGrid.addToken(0, 0, STOCK_SCHEMA);
		globalSideWindow.addDisplay(new InitiativeDisplay().linkToken(token));
		token = globalGrid.addToken(0, 0, STOCK_SCHEMA);
		globalSideWindow.addDisplay(new InitiativeDisplay().linkToken(token));
	});


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
