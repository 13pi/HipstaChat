//(function () {
    'use strict';
    angular.module('app.controllers', [])

        .controller('AppCtrl', [
        '$scope', '$rootScope', 'userInfo', '$location','configurationService','localStorageService','$timeout','Restangular',
        function ($scope, $rootScope, userInfo, $location,configurationService ,localStorageService,$timeout,Restangular) {
            var $window;
            $window = $(window);
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

////////////////////////////////////////////////////////////////////////////////
            $rootScope.hasRole = function (role){
                if (typeof  $rootScope.currentUser == "undefined" ) return false;
                if ($rootScope.currentUser.roles == null || typeof $rootScope.currentUser.roles  == "undefined" ||typeof $rootScope.currentUser.roles == "undefined" ) return false;

                var arrayLength = $rootScope.currentUser.roles.length;
                for (var i = 0; i < arrayLength; i++) {
                    if ($rootScope.currentUser.roles[i].name == role) {
                        return true;
                    }
                }
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




                $scope.updateMyProfile = function(){

                    chatService.updateMyProfile ($rootScope.currentUser).then(function(e){

                        logger.logSuccess("обновлен");
                    })


                };


              //  $scope.startNewConversationTelephoneNumber = "7";
              //
              //  $scope.startNewConversation = function(){
              //      chatService.startNewByTelephoneNumber($scope.startNewConversationTelephoneNumber).then(function (e) {
              //          $scope.allConversations.push (e);
              //      });
              //
              //  logger.logSuccess("Добавлено");
              //
              //  };
              //
              //$scope.allConversations =   chatService.getAllConversations().getList().$object;




        }]);

//}).call(this);

