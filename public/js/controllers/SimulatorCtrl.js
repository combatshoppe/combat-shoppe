/**
 * SinulatorCtrl.js
 * A controller for the simulator.html page
 */

/** Declare some global variables just so they don't go out of scope */
var mainWindow, sideWindow;
var STOCK_IMAGE = 'https://i.pinimg.com/originals/7c/c7/aa/7cc7aa6b6fd0d30b2ab78eabcd44c94e.png'
var STOCK_SCHEMA = new CreatureSchema({name: 'Dwarven Warrior', dex: 12, src: STOCK_IMAGE});

console.log(STOCK_SCHEMA)

/** Create a new AngularJS module and attach a controller */
angular.module('SimulatorCtrl', ['WindowModule'])
	/** On page load */
	.controller('SimulatorController', function($scope, $window) {
		$scope.tagline = 'Welcome to Simulator section!';
		// Grab the DOM elements and create Windows with them
		mainWindow = document.querySelectorAll('[name="MainWindow"]')[0];
		sideWindow = document.querySelectorAll('[name="SideWindow"]')[0];
		mainWindow = new Window(mainWindow, new SinglePlacement());
		sideWindow = new Window(sideWindow, new SortedListPlacement(null, 100));

		var dummyTokenA = new Token({x: 0, y: 0}, 0, 0).setSchema(STOCK_SCHEMA);
		var dummyTokenB = new Token({x: 0, y: 0}, 0, 0).setSchema(STOCK_SCHEMA);
		var dummyTokenC = new Token({x: 0, y: 0}, 0, 0).setSchema(STOCK_SCHEMA);

		// Add the Dispalys to the Windows
		mainWindow.addDisplay(new GridDisplay());
		sideWindow.addDisplay(new InitiativeDisplay().linkToken(dummyTokenA));
		sideWindow.addDisplay(new InitiativeDisplay().linkToken(dummyTokenB));
		sideWindow.addDisplay(new InitiativeDisplay().linkToken(dummyTokenC));
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
