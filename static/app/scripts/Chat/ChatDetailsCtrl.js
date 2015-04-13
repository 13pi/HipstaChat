'use strict';

angular.module('app.chat', ['restangular', 'ngRoute', 'LocalStorageModule']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/chat/details/:id', {
                controller: ChatDetailsCtrl,
                templateUrl: 'views/chat/details.html'
            })

            .when('/chat/userSearch', {
            controller: 'DashboardCtrl',
            templateUrl: 'views/chat/userSearch.html'
        })

        ;
    });

function ChatDetailsCtrl($scope, $rootScope,  Restangular, $route, $http, localStorageService, configurationService,  $location,  logger
                        , chatService, $timeout
) {
    $scope.currentChatId = $route.current.params.id;
    $scope.currentConversation   = chatService.getConversationById ($scope.currentChatId).get().$object;
    $scope.messageToConversation = "";


///////////////////////////////
    $scope.diffDocs = function( obj3333 ) {
        var a = $scope.currentConversation.messages;
        var bIds = {};
        a.forEach(function (obj) {
            bIds[obj.id] = obj;
        });

        return obj3333.filter(function (obj) {
            return !(obj.id in bIds);
        });

    };
//////////////////

    $scope.updateMessages = function(){
        chatService.getConversationById ($scope.currentChatId).get().then(function (e) {

            var r = $scope.diffDocs(e.messages);

            if (r.length > 0){
                $("html, body").animate({ scrollTop: $(document).height() }, "slow");
            }

            for (var i=0; i < r.length; i++){
                logger.logSuccess("Новое сообщение! " + r[i].message)

            }

            $scope.currentConversation = e;

            $timeout($scope.updateMessages , 1000);
        })
    };

    $scope.updateMessages();

    $scope.addMessageToConversation = function(){
        chatService.addMessageToConversation ($scope.currentChatId , $scope.messageToConversation).then(function(e){
            $scope.currentConversation.messages.push(e);
        });
      logger.logSuccess("Отправлено");

    };

};