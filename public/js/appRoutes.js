angular.module('appRoutes', []).config(['$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
        // home page
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainController'
            })
            // simulator page that will use the SimulatorController
            .when('/simulator', {
                templateUrl: 'views/simulator.html',
                controller: 'StudentController'
            })
            // homebrew page that will use the HomebrewController
            .when('/homebrewBuilder', {
                templateUrl: 'views/homebrewBuilder.html',
                controller: 'HomebrewController'
            });
        $locationProvider.html5Mode(true);
    }
]);