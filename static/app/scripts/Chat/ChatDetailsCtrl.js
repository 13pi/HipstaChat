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
    , chatService, $timeout) {
    $scope.currentUserId = $route.current.params.id;
}

function ChatDetailsCtrl($scope, $rootScope,  Restangular, $route, $http, localStorageService, configurationService,  $location,  logger
                        , chatService, $timeout, ngToast , $sce, $aside, $modal
) {
    $scope.currentRoomId = $route.current.params.id;

    $scope.currentRoomMessages = [];
    $scope.postsInHistory = [];

    $scope.messengesColumn = 12;
    $scope.membersColumn = 12;

    $scope.reverseBool = true;
    $scope.enterSendBtn = true;

    $scope.updatedMessagesTimes = 0;
    $scope.messageToConversation = "";

///////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////


    $scope.appendDiffHistory =  function(){
        var bIds = {};
        $scope.currentRoomMessages.forEach(function(obj){
            bIds[obj.id] = obj;
        });

        return $scope.postsInHistory.filter(function(obj){
            return !(obj.id in bIds);
        });

    };

    jQuery("#btnSendMsg").height(  jQuery("#textareaWithMsg").height()  );




    //max-height
    $scope.updateMessagesData  = function () {

        if ($scope.updatedMessagesTimes < 2){
            jQuery("#messageConversationBox").css("max-height",  jQuery("#content").height()-30+"px");
        }

        chatService.getAllMessagesByRoomId($scope.currentRoomId).then(function (e) {
            $scope.currentRoomMessages = e.messages;

            //jQuery("#messageConversationBox").css("max-height",  jQuery("#content").height()+"px");


            if ( $scope.updatedMessagesTimes < 2){
                if (!$("#messageConversationBox")){
                    $scope.updatedMessagesTimes --;
                }
              console.warn (   $("#messageConversationBox").scrollTop($("#messageConversationBox")[0].scrollHeight) );
            }

            if ($scope.postsInHistory.length > 0){
                $scope.currentRoomMessages = $scope.currentRoomMessages.concat (  $scope.appendDiffHistory () );
            }
            $scope.updatedMessagesTimes ++;
        })
        $scope.deleteNotificationsFromThisRoom();
    };



    $scope.getHistoryMessageWhenScrolling = function () {
        if ($scope.updatedMessagesTimes < 2 ) return;
        if ($("#messageConversationBox").scrollTop()  < 20  ){

            $scope.prevScrollHeight = $("#messageConversationBox")[0].scrollHeight;
            $scope.getFromHistory();

            console.log ($scope.prevScrollHeight);
            console.log ($("#messageConversationBox")[0].scrollHeight);

            //if ($scope.prevScrollHeight != $("#messageConversationBox")[0].scrollHeight){
                $("#messageConversationBox").scrollTop($scope.prevScrollHeight) ;
            //}

        }

    };

    $scope.refreshistoryMsg =  setInterval($scope.getHistoryMessageWhenScrolling, 1000);

    $scope.currentParticipants = $modal({scope: $scope, html:true,placement:"center ", title:'', show:false, contentTemplate: 'templates/chatMembers.html'});
    $scope.showCurrentParticipantsModal = function() {
        $scope.currentParticipants.$promise.then( $scope.currentParticipants.show);
    };


    $scope.currentRoomSettings  = $aside({scope: $scope, html:true,placement:"right", show:false, animation:"am-slide-right",  contentTemplate: 'templates/roomSettings.html'});
    $scope.showRoomSettings = function() {
        $scope.currentRoomSettings.$promise.then( $scope.currentRoomSettings.show);
    };



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
   $scope.refreshMessages =  setInterval($scope.updateMessagesData, $scope.interval);

    //// Убираем обновление после ухода со страницы
    $rootScope.$on("$locationChangeStart", function () {
        console.info("Уход из комнаты: " + $scope.currentRoom.name + " с ID: " + $scope.currentRoom.id)
        clearInterval($scope.refreshMessages);
    });

    $scope.updateMessagesData ();


    $scope.getFromHistory = function () {

        if (!$scope.currentRoomMessages[ $scope.currentRoomMessages.length-1]){
            return;
        }

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
        console.info($scope.newRoomName);
        chatService.changeRoomName($scope.currentRoomId, userId).then(function (e) {
            logger.logSuccess("Название изменено на: " + userId);
        } )
    };


};