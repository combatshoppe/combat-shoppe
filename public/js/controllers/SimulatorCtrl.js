angular.module('SimulatorCtrl', ['WindowModule']).controller('SimulatorController', function($scope, $window) {
	$scope.tagline = 'Welcome to Simulator section!';
	let mainWindow = document.querySelectorAll('[name="MainWindow"]');
	let mainWindow = document.querySelectorAll('[name="SideWindow"]');
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
