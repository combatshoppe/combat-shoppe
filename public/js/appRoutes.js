angular.module('appRoutes', []).config(['$routeProvider',
	'$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})
		// students page that will use the StudentController
		.when('/simulator', {
			templateUrl: 'views/simulator.html',
			controller: 'StudentController'
		});
	$locationProvider.html5Mode(true);
}]);
