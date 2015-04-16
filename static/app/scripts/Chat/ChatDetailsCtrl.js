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


    $scope.messengesColumn = 12;
    $scope.membersColumn = 12;


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
        var elel = $scope.currentRoomMessages[ $scope.currentRoomMessages.length-1].id;
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