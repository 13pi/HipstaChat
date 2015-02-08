'use strict';

angular.module('app.login', ['restangular', 'ngRoute', 'LocalStorageModule']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/login/login', {
                controller: LoginCtrl,
                templateUrl: 'views/login/login.html'
            })
            .when('/login/setLoginAndPassword/:login/:password', {
            controller: SetLoginAndPasswordCtrl,
            templateUrl: 'views/login/login.html'
        });

    });


        function LoginCtrl ($scope, Restangular, $http, localStorageService, configurationService, $location, $route, chatService) {

            $scope.userName = "";
            $scope.userPassword = "";

            $scope.firstStep = true;
            $scope.date2 = function(){
                return new Date();
            };

            $scope.toSecondStep = function(){
                $scope.firstStep = false;
                $scope.secondStep = true;

                var b = {};
                b.telephone = $scope.userName;
                chatService.getAuthToken(b);


            };


            $scope.update = function () {
                //$scope.master = angular.copy(user);



                localStorageService.set('userName', $scope.userName);
                localStorageService.set('userPassword', $scope.userPassword);

                var basicAuth = "Basic " + Base64.encode(localStorageService.get('userName') + ":" + localStorageService.get('userPassword'));
                localStorageService.set('token', basicAuth);

                window.location = window.location.pathname;
            };

            //$scope.reset = function () {
            //    $scope.user = angular.copy($scope.master);
            //};




            //$scope.reset();

        };

function SetLoginAndPasswordCtrl ($scope, Restangular, $http, localStorageService, roleService, configurationService, $location, $route) {

    //$scope.userName = $route.current.params.login;
    //$scope.userPassword = $route.current.params.password;
    //
    //
    //localStorageService.set('userName', $scope.userName);
    //localStorageService.set('userPassword', $scope.userPassword);
    //
    //var basicAuth = "Basic " + Base64.encode(localStorageService.get('userName') + ":" + localStorageService.get('userPassword'));
    //localStorageService.set('token', basicAuth);


}


