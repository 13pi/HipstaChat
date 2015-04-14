//(function () {
    'use strict';
    angular.module('app.controllers', [])

        .controller('AppCtrl', [
        '$scope', '$rootScope', 'userInfo', '$location','configurationService','localStorageService','$timeout','Restangular',
        function ($scope, $rootScope, userInfo, $location,configurationService ,localStorageService,$timeout,Restangular) {
            $scope.main = {
                brand: 'HipstaChat',
                name: 'Lisa Doe'
            };
            $scope.pageTransitionOpts = [
                {
                    name: 'Scale up',
                    "class": 'ainmate-scale-up'
                },
                {
                    name: 'Fade up',
                    "class": 'animate-fade-up'
                },
                {
                    name: 'Slide in from right',
                    "class": 'ainmate-slide-in-right'
                },
                {
                    name: 'Flip Y',
                    "class": 'animate-flip-y'
                }
            ];


            console.log("AppCtrl - header");


            function fireDigestEverySecond() {
                $scope.getDatetime = new Date;
                $timeout(fireDigestEverySecond , 1000);
            }
            fireDigestEverySecond();


            $scope.configuration = configurationService.getOnlineStatusResulted();


            if (configurationService.getOnlineStatusResulted().connectedToApiServer) {
                userInfo.getCurrentUser().then(function (myaccount) {
                    $rootScope.currentUser = myaccount;
                });
            }

////////////////////////////////////////////////////////////////////////////////
            $rootScope.isDebugMode = function () {
                return localStorageService.get('debugMode') == "true";
            };

            $rootScope.showObjectIDs
                = function () {
                return localStorageService.get('debugMode') == "true";
            };
////////////////////////////////////////////////////////////////////////////////

            $scope.admin = {
                layout: 'wide',
                menu: 'vertical',
                fixedHeader: true,
                fixedSidebar: false,
                pageTransition: $scope.pageTransitionOpts[0]
            };
            $scope.$watch('admin', function (newVal, oldVal) {
                if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
                    $rootScope.$broadcast('nav:reset');
                    return;
                }
                if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
                    if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                        $scope.admin.fixedHeader = true;
                        $scope.admin.fixedSidebar = true;
                    }
                    if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                        $scope.admin.fixedHeader = false;
                        $scope.admin.fixedSidebar = false;
                    }
                    return;
                }
                if (newVal.fixedSidebar === true) {
                    $scope.admin.fixedHeader = true;
                }
                if (newVal.fixedHeader === false) {
                    $scope.admin.fixedSidebar = false;
                }
            }, true);
            return $scope.color = {
                primary: '#248AAF',
                success: '#3CBC8D',
                info: '#29B7D3',
                infoAlt: '#666699',
                warning: '#FAC552',
                danger: '#E9422E'
            };
        }
    ])

        .controller('HeaderCtrl', ['$scope', function ($scope) {
    }])

        .controller('NavContainerCtrl', ['$scope', function ($scope) {
    }])

        .controller('NavCtrl', [
        '$scope', 'filterFilter', 'userInfo', function ($scope, filterFilter, userInfo) {
        }
    ])

        .controller(
        'DashboardCtrl', ['$scope', 'Restangular', '$http', 'configurationService', '$rootScope',
        '$compile','$injector','$timeout'  ,'logger','chatService',
            function ($scope, Restangular, $http, configurationService, $rootScope,
                      $compile, $injector, $timeout,   logger , chatService) {

 ///////////////////////////////////// WEATHER START /////////////////////////////////////
        console.log("----- Dashboard ctrl start");

                $scope.editProfileMode = false;

                $scope.myContactList=  [];

                $scope.searchDataEmail = "";
                $scope.searchResultEmail = {};
                $scope.searchResult = [];

                $scope.updateMyProfile = function(){
                    chatService.updateMyProfile ($rootScope.currentUser).then(function(e){
                        logger.logSuccess("обновлен");
                        $scope.editProfileMode = false;
                    })
                };


                $scope.searchUserByData = function (){
                    $scope.searchResult = [];
                    chatService.searchUserByNaveAndData($scope.searchData).then(function(e){
                      $scope.searchResult = e.response;
                  })
                };


                $scope.searchUserByEmail = function (){
                    $scope.searchResultEmail = {};
                    chatService.getUserById($scope.searchDataEmail).get().then(function(e){
                        $scope.searchResultEmail = e;
                    })
                };

                $scope.getAccountListFullResultPromise = chatService.getAccountListFull().get();
                $scope.getAccountListFullResultPromise.then(function(e){
                    $scope.getAccountListFullResult = e.response;
                });


                $scope.addToContactListfoo = function(c){
                    chatService.addToContactList (c).then(function(e){
                        logger.logSuccess("Добавлен новый в контакт лист");
                    })
                };


                $scope.addNewRoom = function(){
                  chatService.addNewRoom($scope.newRomName).then(function(e){
                      logger.logSuccess("Новая комната добавлена!");
                  })
                };


                $scope.changeEditModeOn = function(){
                      $scope.editProfileMode = true;
                };

                $scope.changeEditModeOff = function(){
                    $scope.editProfileMode = false;
                };



        }]);

