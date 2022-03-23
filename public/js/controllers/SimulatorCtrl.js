/**
 * SinulatorCtrl.js
 * A controller for the simulator.html page
 */

/** Declare some global variables just so they don't go out of scope */
var mainWindow, sideWindow;

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
		sideWindow.addDisplay(new InitiativeDisplay().setImage("https://g.foolcdn.com/editorial/images/551757/young-man-looking-at-laptop-computer-with-expression-of-shock-investor-upset-surprised-frustrated-stock-market-crash.jpg").setInitiative(1));
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
