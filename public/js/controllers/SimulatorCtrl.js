/**
 * SinulatorCtrl.js
 * A controller for the simulator.html page
 */

/** Declare some global variables just so they don't go out of scope */
var mainWindow, sideWindow;
var STOCK_IMAGE = 'https://i.pinimg.com/originals/7c/c7/aa/7cc7aa6b6fd0d30b2ab78eabcd44c94e.png'
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
		// Add the Dispalys to the Windows
		mainWindow.addDisplay(new GridDisplay());
		sideWindow.addDisplay(new InitiativeDisplay().setImage(STOCK_IMAGE).setInitiative(10));
		sideWindow.addDisplay(new InitiativeDisplay().setImage(STOCK_IMAGE).setInitiative(1));
		sideWindow.addDisplay(new InitiativeDisplay().setImage(STOCK_IMAGE).setInitiative(5));
		sideWindow.addDisplay(new InitiativeDisplay().setImage(STOCK_IMAGE).setInitiative(6));
		sideWindow.addDisplay(new InitiativeDisplay().setImage(STOCK_IMAGE).setInitiative(8));
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
