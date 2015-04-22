    'use strict';
    angular.module('app.controllers', [])
    // Main controller
        .controller('AppCtrl', [
        '$scope', '$rootScope', 'userInfo', '$location','configurationService','localStorageService','$timeout','Restangular','chatService','$q','logger','$sce','ngToast','favicoService',
        function ($scope, $rootScope, userInfo, $location,configurationService ,localStorageService,$timeout,Restangular, chatService, $q, logger, $sce, ngToast, favicoService) {
            $scope.main = {
                brand: 'HipstaChat'
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

            Restangular.setBaseUrl(configurationService.returnAPIhost());


            //START: some local variables
            $rootScope.allNotificationToasts = [];
            $rootScope.allResolvedUsers = new Array ();
            $rootScope.allRooms = [];
            $rootScope.getAccountListFullResult = [];
            $rootScope.allNotifications = [];
            // Interval, when we will pull notifications from the server
            $scope.interval = 3000;

            // scrollbar in chats messages
            $rootScope.useScrollable = true;
            //END: some local variables

            // return new time and thow in header it
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

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

            // Get user info from local cache (MAP) or if it not exist
            // get him from the server
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
            // Get all rooms of current user
            chatService.getAllRooms().then(function (e) {
                $rootScope.allRooms =  e;
            });


            $rootScope.getRoomByRoomId = function (id) {
                if (!id) return;
                for (var i =0; i < $rootScope.allRooms.length; i++){
                    if ($rootScope.allRooms[i].id == id) return $rootScope.allRooms[i];
                }
                return;
            };
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////


            // Return URL of user avatar
            $rootScope.getAvatarUrlByUser = function (user) {
                if (!user) return "images/no-avatar.png";
              if (user.avatarUrl != '' &&  typeof user.avatarUrl != "undefined" &&  user.avatarUrl !=null){
                  return user.avatarUrl;
              }

                return "images/no-avatar.png";
            };


///////////////////////////////////////////////////////////////////////////



            $rootScope.getLastDateUser = function ( date ) {
                // минут назад // minutes before
                    var res = Math.round(( new Date() - new Date(date))) / 1000 /60  ;
                    res = res.toFixed(3);
                    return  res;
            };

            $rootScope.getContactList = function () {
               chatService.getAccountListFull().get().then(function(e){
                    $rootScope.getAccountListFullResult = e.response;
                });
            };
            $rootScope.getContactList();
///////////////////////////////////////////////////////////////////////////

            // Return TRUE if requested user is in contact list o current user
            $rootScope.isInContactList = function (id){
                for (var i=0; i < $rootScope.getAccountListFullResult.length; i++){
                    if ($rootScope.getAccountListFullResult[i].id == id) return true;
                }
                return false;
            };

            // From unix time to JS
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


            // This function return printable name (view) of requested user object
            $rootScope.printUser = function (user) {
                if (!user) return;
                if (user.firstName || user.lastName ) return user.firstName + " " + user.lastName;
                return user.nickName;
            };



            // Get all notifications from the server
            $rootScope.getNotificationsFromServers = function () {
                chatService.getNotifications ().get().then(function (e) {
                    $rootScope.allNotifications = e.notifications;

                    ///////// START: Show count of notification on title and favicon
                    favicoService.badge($rootScope.allNotifications.length);

                    if ($rootScope.allNotifications.length == 0){
                        $rootScope.title = 'HipstaChat';
                    }else{
                        $rootScope.title = "( "+ $rootScope.allNotifications.length + " ) HipstaChat";
                    }
                    ///////// END: Show count of notification on title and favicon


                    for (var i=0; i < $rootScope.allNotifications.length; i++ ){
                        if ($rootScope.allNotifications[i].shown) continue;

                        switch ($rootScope.allNotifications[i].type){
                         /////////////////START: We have new message notification //////////////
                            case 0:
                                var more_details =   JSON.parse( $rootScope.allNotifications[i].more_details );
                                var text = more_details.text;
                                var messageId = more_details.message_id;

                                (function () {
                                    var notificationId = $rootScope.allNotifications[i].id;

                                    chatService.getMessageById(messageId).get().then(function (e) {
                                        var msg = e.message;

                                        var room =  $rootScope.getRoomByRoomId(msg.room);

                                        console.warn(e);
                                        var aToast = ngToast.create({
                                            className: 'warning',
                                            content:  $sce.trustAsHtml('' +
                                            ' <div class="row"> <div class="col-md-4"> <img class="  img-rounded" align="center" height="70" width="70"   src="'+$rootScope.getAvatarUrlByUser($rootScope.resolveUser(msg.sender)) +'" /> <br/> ' +
                                            '</div>' +
                                            ' <div class="col-md-8">' +
                                            ' Сообщение: '+ $rootScope.printUser( $rootScope.resolveUser(msg.sender) ) +'  <br/>' +
                                            '  <strong> '+ msg.text +' </strong> </div>  </div>' +
                                            ' <small class="text-muted pull-right ">   '+ $rootScope.timeConverter( msg.date ) +' </small> <br/>' +
                                            '  <div class="row"> <div class="col-md-6"> <a href="#/room/details/'+msg.room+'"> '+room.name+'  </a> ' +
                                            '</div> <div class="col-md-6"> <button ng-click="deleteNotificationById('+notificationId+')" class="btn btn-warning"> [ X ]  </button>' +
                                            '   ' +
                                            ''),
                                            timeout :1000000,
                                            compileContent: true,
                                            //dismissButton : true
                                            dismissButtonHtml : " <button class='btn'> ОК </button>"

                                        });
                                        $rootScope.allNotificationToasts.push ( {id : notificationId, obj: aToast } );
                                    });
                                })();

                                break;
                            /////////////////END: We have new message notification //////////////


                            default:

                                //aToast = ngToast.create({
                                //    className: 'warning',
                                //    content:  $sce.trustAsHtml(' Уведомление <br/>  <button ng-click="deleteNotificationById(allNotifications[i].id)" class="btn btn-warning"> удалить  </button>' +
                                //    '  ' +
                                //    ''),
                                //    timeout :100000,
                                //    compileContent: true,
                                //    //dismissButton : true
                                //    dismissButtonHtml : " <button class='btn'> ОК </button>"
                                //
                                //});

                        }

                        //$rootScope.allNotificationToasts.push ( {id : $rootScope.allNotifications[i].id, obj: aToast } );
                    }

                    console.info("Взяты уведомления с сервера: " + $rootScope.allNotifications.length + " .шт");
                });
            };

            $rootScope.getNotificationsFromServers();

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

                    case 4:
                        return "какие-то изменения в комнате";

                    case 5:
                        return "добавлен в контакт лист";

                    case 6:
                        return "удалён из контакт листа";

                    //case 6:
                    //    return "новое сообщение";
                    //
                    //case 7:
                    //    return "добавление в контакт-лист отклонено";


                }
            };

            $rootScope.deleteNotificationById = function (id) {
              chatService.deleteNotificationById ( id).then(function (e) {
                  logger.logSuccess("Уведолмение удалено!");
                  $rootScope.getNotificationsFromServers ();
              })
            };


            $rootScope.deleteAllNotifications = function () {

                for (var i=0; i < $rootScope.allNotifications.length; i++){
                    var id = $rootScope.allNotifications[i].id;
                    //chatService.deleteNotificationById (id).then(function (e) { });
                     Restangular.one("notifications/"+id).customDELETE();

                }
                    logger.logSuccess("Все уведомления удалены!");
                    $rootScope.getNotificationsFromServers ();
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

///////////////////// JUST SOME UI FEATURES BELOW  /////////////////////

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
        .controller(
        'DashboardCtrl', ['$scope',  'Restangular', '$http', 'configurationService', '$rootScope',
        '$compile','$injector','$timeout'  ,'logger','chatService',
            function ($scope, Restangular, $http, configurationService, $rootScope,
                      $compile, $injector, $timeout,   logger , chatService) {

 ///////////////////////////////////// WEATHER START /////////////////////////////////////
        console.info("Dashboard ctrl start");

                $scope.editProfileMode = false;
                $scope.myContactList=  [];
                $scope.searchDataEmail = "";
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


                // Are we editing current user?
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


                $scope.uploadAvatar = function () {
                  chatService.uploadAvatar ( $scope.myCroppedImage);
                };

////////////////////// Avatar cropper /////////////////////////
                $scope.myImage='';
                $scope.myCroppedImage='';

                var handleFileSelect=function(evt) {
                    var file=evt.currentTarget.files[0];
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        $scope.$apply(function($scope){
                            $scope.myImage=evt.target.result;
                        });
                    };
                    reader.readAsDataURL(file);
                };
                angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

        }])


        .controller('HeaderCtrl', ['$scope', function ($scope) {
        }])

        .controller('NavContainerCtrl', ['$scope', function ($scope) {
        }])

        .controller('NavCtrl', [
            '$scope', 'filterFilter', 'userInfo', function ($scope, filterFilter, userInfo) {
            }
        ])


    ;

