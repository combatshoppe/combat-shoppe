angular.module('SimulatorCtrl', ['WindowModule']).controller('SimulatorController', function($scope, $window) {
	//console.log(injector.get('jsInterface'))
	$scope.tagline = 'Welcome to Simulator section!';

	//import Player from "./../data-utils.js";
	let p = new Position(1,0);
	//alert("Angularjs call function on page load");
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
