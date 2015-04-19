//(function () {
    'use strict';
    angular.module('app.controllers', [])

        .controller('AppCtrl', [
        '$scope', '$rootScope', 'userInfo', '$location','configurationService','localStorageService','$timeout','Restangular','chatService','$q','logger','$sce','ngToast','favicoService',
        function ($scope, $rootScope, userInfo, $location,configurationService ,localStorageService,$timeout,Restangular, chatService, $q, logger, $sce, ngToast, favicoService) {
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

            // scrollbar in chats messages
            $rootScope.useScrollable = true;


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



            $rootScope.allNotificationToasts = [];



///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
            $rootScope.allResolvedUsers = new Array ();

            $rootScope.resolveUser = function (id){
                if (!id) return;
                var stringed = id.toString();
                if (!$rootScope.allResolvedUsers[ stringed ]){
                    $rootScope.allResolvedUsers[ stringed ] = {};
                  var chatServicePromise = chatService.getUserById(id).get().then(function (e) {
                       $rootScope.allResolvedUsers[ stringed ] = e;
                      return e;
                   });

                }else{
                    return  $rootScope.allResolvedUsers[ stringed ] ;
                }


            };
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
            $rootScope.allRooms = [];
            chatService.getAllRooms().then(function (e) {
                $rootScope.allRooms =  e;
            });


            $scope.getRoomByRoomId = function (id) {
                if (!id) return;
                for (var i =0; i < $rootScope.allRooms.length; i++){
                    if ($rootScope.allRooms[i].id == id) return $rootScope.allRooms[i];
                }
                return;
            };
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

            $rootScope.getContactList = function () {
               chatService.getAccountListFull().get().then(function(e){
                    $rootScope.getAccountListFullResult = e.response;
                });
            };
            $rootScope.getContactList();



            $rootScope.isInContactList = function (id){
                for (var i=0; i < $rootScope.getAccountListFullResult.length; i++){
                    if ($rootScope.getAccountListFullResult[i].id == id) return true;
                }
                return false;
            };

            $rootScope.timeConverter =  function (UNIX_timestamp){
                var a = new Date(UNIX_timestamp*1000);
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var year = a.getFullYear();
                var month = months[a.getMonth()];
                var date = a.getDate();
                var hour = a.getHours();
                var min = a.getMinutes();
                var sec = a.getSeconds();
                var time = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
                return time;
            };


            $rootScope.printUser = function (user) {
                if (!user) return;
                if (user.firstName || user.lastName ) return user.firstName + " " + user.lastName;
                return user.nickName;
            };


//////////////// NOTIFICATIONS  /////////////////////
            $rootScope.allNotifications = [];

            $rootScope.getNotificationsFromServers = function () {
                chatService.getNotifications ().get().then(function (e) {

                    $rootScope.allNotifications = e.notifications;

                    favicoService.badge($rootScope.allNotifications.length);


                    for (var i=0; i < $rootScope.allNotifications.length; i++ ){
                        if ($rootScope.allNotifications[i].shown) continue;
                        var aToast = ngToast.create({
                            className: 'warning',
                            content:  $sce.trustAsHtml(' Уведомление <br/>  <button ng-click="deleteNotificationById(allNotifications[i].id)" class="btn btn-warning"> удалить  </button>' +
                            '  ' +
                            ''),
                            timeout :100000,
                            compileContent: true,
                            //dismissButton : true
                            dismissButtonHtml : " <button class='btn'> ОК </button>"

                        });
                        var id = $rootScope.allNotifications[i].id;
                        $rootScope.allNotificationToasts.push ( {id : id, obj: aToast } );
                    }

                    console.info("Взяты уведомления с сервера: " + $rootScope.allNotifications.length + " .шт");




                });
            };


            $rootScope.getNotificationsFromServers();

            $scope.interval = 3000;
            setInterval($scope.getNotificationsFromServers, $scope.interval);
//////////////// NOTIFICATIONS  /////////////////////



            $rootScope.getNotificationTypePretty = function (code) {
                switch (code) {

                    case 0:
                        return "новое сообщение";

                    case 1:
                        return "добавлен в комнату";

                    case 2:
                        return "удален из комнаты";

                    case 3:
                        return "какие-то изменения в комнате";

                    case 4:
                        return "добавлен в контакт лист";

                    case 5:
                        return "удалён из контакт листа";

                    case 6:
                        return "новое сообщение";

                    case 7:
                        return "добавление в контакт-лист отклонено";


                }
            };

            $rootScope.deleteNotificationById = function (id) {
              chatService.deleteNotificationById ( id).then(function (e) {
                  logger.logSuccess("Уведолмение удалено!");
                  $rootScope.getNotificationsFromServers ();
              })
            };




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
        'DashboardCtrl', ['$scope',  'Restangular', '$http', 'configurationService', '$rootScope',
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

                $rootScope.getAccountListFullResult = [];




                $scope.addToContactListfoo = function(c){
                    chatService.addToContactList (c).then(function(e){
                        logger.logSuccess("Добавлен новый в контакт лист");
                        $scope.getContactList();
                    })
                };


                $scope.addNewRoom = function(){
                  chatService.addNewRoom($scope.newRomName).then(function(e){
                      logger.logSuccess("Новая комната добавлена!");
                      /// обновить комнаты с сервера
                      $rootScope.allRooms = chatService.getAllRooms().$object;

                  })
                };


                $scope.changeEditModeOn = function(){
                      $scope.editProfileMode = true;
                };

                $scope.changeEditModeOff = function(){
                    $scope.editProfileMode = false;
                };


                $scope.leaveRoom = function (roomId) {
                    chatService.leaveRoom(roomId).then(function(e){
                        logger.logSuccess("Вы покинули комнату!");
                        $rootScope.allRooms = chatService.getAllRooms().$object;
                    })
                };




                $scope.deleteFromContactList = function (id) {
                    chatService.deleteFromContactList ( id).then(function (e) {
                        logger.logSuccess("Удален успешно из контакт-листа!");
                        $scope.getContactList();
                    });
                };










        }]);

