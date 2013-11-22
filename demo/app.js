angular
    .module('app', ['unsavedDev', 'ngRoute'])
    .config(['$routeProvider',
        function($routeProvider) {

            $routeProvider
                .when('/page1', {
                    templateUrl: 'page1.html'
                })
                .when('/page2', {
                    templateUrl: 'page2.html'
                })
                .otherwise({
                    redirectTo: '/page1'
                })

        }
    ])
    .controller('demoCtrl', function($scope) {
        $scope.user = {};
        $scope.demoFormSubmit = function() {
            $scope.message = 'Form Saved';
            $scope.user = {};
        }
        $scope.clearChanges = function() {
            $scope.user = {};
        }
    });
