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

    

    $scope.updateMessagesData  = function () {
        chatService.getAllMessagesByRoomId($scope.currentRoomId).then(function (e) {
            $scope.currentRoomMessages = e.messages;
            //var myDiv = document.getElementById('messageConversationBox');
            //var myDiv = $("#messageConversationBox");
            //myDiv.scrollTop = myDiv.scrollHeight;

            if ( $scope.updatedMessagesTimes < 2){
                if (!$("#messageConversationBox")){
                    $scope.updatedMessagesTimes --;
                }

            //.scrollTop() - -current coll heidht
              console.warn (   $("#messageConversationBox").scrollTop($("#messageConversationBox")[0].scrollHeight) );
            }

            if ($scope.postsInHistory.length > 0){

                //if ($scope.appendDiffHistory().length > 0){
                //    logger.logSuccess("Новые сообщения из истории");
                //}

                $scope.currentRoomMessages = $scope.currentRoomMessages.concat (  $scope.appendDiffHistory () );
            }



            $scope.updatedMessagesTimes ++;
        })
    };

    $scope.messageToConversation = "";


    $scope.getHistoryMessageWhenScrolling = function () {
        //$("#messageConversationBox")[0].scrollHeight
        if ($scope.updatedMessagesTimes < 2) return;
        if ($("#messageConversationBox").scrollTop() == 0  ){

            $scope.prevScrollHeight = $("#messageConversationBox")[0].scrollHeight;
            $scope.getFromHistory();
            $("#messageConversationBox").scrollTop($scope.prevScrollHeight) ;
        }

    };

    //$scope.interval = 3000;
    $scope.refreshistoryMsg =  setInterval($scope.getHistoryMessageWhenScrolling, 1000);

    $scope.currentParticipants = $modal({scope: $scope, html:true,placement:"center ", show:false, contentTemplate: 'templates/chatMembers.html'});

    $scope.showCurrentParticipantsModal = function() {
        $scope.currentParticipants.$promise.then( $scope.currentParticipants.show);
    };

    var myOtherAside = $aside({scope: $scope, html:true,placement:"right", show:false, contentTemplate: 'templates/roomSettings.html'});
    // Show when some event occurs (use $promise property to ensure the template has been loaded)
    //myOtherAside.$promise.then(function() {
    //    myOtherAside.show();
    //});

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