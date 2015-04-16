'use strict';

angular.module('app.chat', ['restangular', 'ngRoute', 'LocalStorageModule']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/room/details/:id', {
                controller: ChatDetailsCtrl,
                templateUrl: 'views/room/details.html'
            })

            .when('/chat/userSearch', {
            controller: 'DashboardCtrl',
            templateUrl: 'views/chat/userSearch.html'
        })

            .when('/user/details/:id', {
                controller: UserDetailsCtrl,
                templateUrl: 'views/user/details.html'
            })

        ;
    });


function UserDetailsCtrl($scope, $rootScope,  Restangular, $route, $http, localStorageService, configurationService,  $location,  logger
    , chatService, $timeout
) {
    $scope.currentUserId = $route.current.params.id;


}

function ChatDetailsCtrl($scope, $rootScope,  Restangular, $route, $http, localStorageService, configurationService,  $location,  logger
                        , chatService, $timeout, ngToast , $sce
) {
    $scope.currentRoomId = $route.current.params.id;

    $scope.currentRoomMessages = [];
    $scope.postsInHistory = [];


    $scope.deleteNotificationsFromThisRoom = function () {
        for (var i=0; i < $rootScope.allNotifications.length; i++){
            console.log($rootScope.allNotifications[i].type + " | " + $scope.currentRoomId);

            if ( ($rootScope.allNotifications[i].type == 0
                || $rootScope.allNotifications[i].type == 1
                || $rootScope.allNotifications[i].type == 2
                || $rootScope.allNotifications[i].type == 3
                || $rootScope.allNotifications[i].type == 4 )
                && $rootScope.allNotifications[i].details == $scope.currentRoomId ){
                console.log(1);
                chatService.deleteNotificationById ($rootScope.allNotifications[i].id)
            }
        }
    };

    $scope.deleteNotificationsFromThisRoom();

    $scope.messengesColumn = 12;
    $scope.membersColumn = 12;

    $scope.reverseBool = false;

    $scope.enterSendBtn = true;

    $scope.appendDiffHistory =  function(){
        var bIds = {};
        $scope.currentRoomMessages.forEach(function(obj){
            bIds[obj.id] = obj;
        });

        return $scope.postsInHistory.filter(function(obj){
            return !(obj.id in bIds);
        });

    };


    $scope.updateMessagesData  = function () {


        //var aToast = ngToast.create({
        //    className: 'warning',
        //    content:  $sce.trustAsHtml(' Another <br/> <button ng-click="addToContactListfoo(project.id)" class="btn btn-success"> В контакт лист </button>' +
        //    '   <button ng-click="addToContactListfoo(project.id)" class="btn btn-danger"> нахер </button> ' +
        //    ''),
        //    timeout :100000,
        //    compileContent: true,
        //    //dismissButton : true
        //    dismissButtonHtml : " <button class='btn'> 232 </button>"
        //
        //});

        //ngToast.create('a toast message...');



        $scope.currentRoomMessagesPromise   = chatService.getAllMessagesByRoomId($scope.currentRoomId).then(function (e) {
            $scope.currentRoomMessages = e.messages;
            if ($scope.postsInHistory.length > 0){
                $scope.currentRoomMessages = $scope.currentRoomMessages.concat (  $scope.appendDiffHistory () );
            }

        })
    };

    $scope.messageToConversation = "";



    $scope.updateRoom = function(){
        chatService.getRoomById ($scope.currentRoomId).then(function (e) {
            $scope.newRoomName = e.name;
            $scope.currentRoom = e;
        });
    };

    $scope.updateRoom();

    $scope.addMessageToConversation = function () {
        chatService.addNewMessage ( $scope.currentRoomId, $scope.messageToConversation).then(function (e) {
            logger.logSuccess("Сообщение отправлено!");
            $scope.updateMessagesData ();
            $scope.messageToConversation = "";
        } )
    };


    $scope.alreadyInChatFilter = function(obj){
        if (!$scope.currentRoom) return true;
        for (var i=0; i <  $scope.currentRoom.members.length ;i++){
            if (obj.id ==  $scope.currentRoom.members[i]) return false;
        }
        return true;

    };


    $scope.interval = 3000;
    setInterval($scope.updateMessagesData, $scope.interval);

    $scope.updateMessagesData ();


    $scope.getFromHistory = function () {
        if (!$scope.revBoolVal){
            var elel = $scope.currentRoomMessages[ $scope.currentRoomMessages.length-1].id;
        }else{
            var elel = $scope.currentRoomMessages[ $scope.currentRoomMessages.length-1].id;
        }
        chatService.getAllMessagesByRoomIdInHistory($scope.currentRoomId, elel, 20).then(function(e){
            $scope.currentRoomMessages =  $scope.currentRoomMessages.concat(e.messages);
            $scope.postsInHistory = $scope.postsInHistory.concat (e.messages);
        })
    };



    $scope.addMemberToChat = function (userId) {
        chatService.addMembeToChat($scope.currentRoomId, userId).then(function (e) {
            logger.logSuccess("Пользователь добавлен в чат!");
            $scope.updateRoom();

        } )
    };




    $scope.deleteMemberFromChat = function (userId) {
        chatService.deleteMemberFromChat($scope.currentRoomId, userId).then(function (e) {
            logger.logSuccess("Пользователь удален из чата!");
            $scope.updateRoom();

        } )
    };


    $scope.changeRoomName = function () {
        var userId = $scope.newRoomName;
        chatService.changeRoomName($scope.currentRoomId, userId).then(function (e) {
            logger.logSuccess("Название изменено на: " + userId);
        } )
    };


};