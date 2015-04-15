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
                        , chatService, $timeout
) {
    $scope.currentRoomId = $route.current.params.id;

    $scope.currentRoomMessages = [];

    $scope.updateMessagesData  = function () {
        $scope.currentRoomMessagesPromise   = chatService.getAllMessagesByRoomId($scope.currentRoomId).then(function (e) {
            $scope.currentRoomMessages = e.messages;
        })
    };

    $scope.messageToConversation = "";



    $scope.addMessageToConversation = function () {
        chatService.addNewMessage ( $scope.currentRoomId, $scope.messageToConversation).then(function (e) {
            logger.logSuccess("Сообщение отправлено!");
            $scope.updateMessagesData ();
        } )
    };

    $scope.updateMessagesData ();



    $scope.addMemberToChat = function (userId) {
        chatService.addMembeToChat($scope.currentRoomId, userId).then(function (e) {
            logger.logSuccess("Пользователь добавлен в чат!");
        } )
    };


    $scope.deleteMemberFromChat = function (userId) {
        chatService.deleteMemberFromChat($scope.currentRoomId, userId).then(function (e) {
            logger.logSuccess("Пользователь удален из чата!");
        } )
    };

    /////////////////////////////////
    //    $scope.diffDocs = function( obj3333 ) {
    //        var a = $scope.currentConversation.messages;
    //        var bIds = {};
    //        a.forEach(function (obj) {
    //            bIds[obj.id] = obj;
    //        });
    //
    //        return obj3333.filter(function (obj) {
    //            return !(obj.id in bIds);
    //        });
    //
    //    };
    ////////////////////


    //$scope.updateMessages = function(){
    //    chatService.getConversationById ($scope.currentChatId).get().then(function (e) {
    //
    //        var r = $scope.diffDocs(e.messages);
    //
    //        if (r.length > 0){
    //            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    //        }
    //
    //        for (var i=0; i < r.length; i++){
    //            logger.logSuccess("Новое сообщение! " + r[i].message)
    //
    //        }
    //
    //        $scope.currentConversation = e;
    //
    //        $timeout($scope.updateMessages , 1000);
    //    })
    //};
    //
    //$scope.updateMessages();
    //
    //$scope.addMessageToConversation = function(){
    //    chatService.addMessageToConversation ($scope.currentChatId , $scope.messageToConversation).then(function(e){
    //        $scope.currentConversation.messages.push(e);
    //    });
    //  logger.logSuccess("Отправлено");
    //
    //};


};