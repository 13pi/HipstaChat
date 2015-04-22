'use strict';

angular.module('app.services', ['restangular', 'LocalStorageModule'])
    .service('userInfo', function (Restangular, localStorageService, $http, configurationService,$q) {
        Restangular.setBaseUrl(configurationService.returnAPIhost());
        Restangular.setDefaultHeaders({"Accept": "application/json"});
        Restangular.setDefaultHeaders({"Content-Type": "application/json"});

        var myAccount = {};
        this.getCurrentUser = function () {
            var abc = myAccount.allInfo = Restangular.one('myaccount').get();
            abc.then(function (e) {
                abc = e;
            });

            return abc;
        }
    })

    .factory('favicoService', [
        function() {
            var favico = new Favico({
                animation : 'fade'
            });

            var badge = function(num) {
                favico.badge(num);
            };
            var reset = function() {
                favico.reset();
            };

            return {
                badge : badge,
                reset : reset
            };
        }])

            .factory('authHttpResponseInterceptor', ['$q', '$location', function ($q, $location) {
                return {
                    response: function (response) {
                        // ERROR INTERCEPT
                        if (response.status === 401) {
                            //$location.path('login/login');
                            window.location = "http://hipstachat.tk/accounts/login/";
                            console.log("Response 401");
                        }

                        if (response.status === 401) {
                            $location.path('pages/403');
                            console.log("Response 403");
                        }

                        if (response.status === 503) {
                            $location.path('pages/503');
                            console.log("Response 503");
                        }

                        return response || $q.when(response);
                    },
                    responseError: function (rejection) {
                        if (rejection.status === 401) {
                            console.log("Response Error 401", rejection);
                            window.location = "/accounts/login/";
                            //$location.path('login/login').search('returnTo', $location.path());
                        }

                        if (rejection.status === 403) {
                            console.log("Response Error 403", rejection);
                            $location.path('pages/403').search('returnTo', $location.path());
                        }

                        if (rejection.status === 503) {
                            console.log("Response Error 503", rejection);
                            $location.path('pages/503').search('returnTo', $location.path());
                        }
                        return $q.reject(rejection);
                    }
                }
            }])

            .service('configurationService', function (Restangular, localStorageService, $http, $location) {//
                this.returnAPIhost = function () {

                    function printSD() {
                        window.apiServerDefined = true;
                        window.loading_screen.finish(); // убираем экран загрузки

                        console.log("------------------------------");
                        console.log("       API SERVER ADDRESS");
                        console.log("Address: " + apiURL);
                    }

                    var apiURL = "/api/";

                    printSD();
                    return apiURL;
                };


                this.onlineStatus = {
                    "connectedToStaticServer": true,
                    "connectedToApiServer": true
                };

                this.getOnlineStatusResulted = function () {
                    return this.onlineStatus;
                };

                function httpRequest(address, reqType, asyncProc) {
                    var r = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
                    if (asyncProc)
                        r.onreadystatechange = function () {
                            if (this.readyState == 4) asyncProc(this);
                        };

                    r.open(reqType, address, !(!asyncProc));
                    r.onerror = function () {
                    };
                    try {
                        r.send();
                    }
                    catch (e) {
                    }
                    return r;
                }

                this.getOnlineStatus = function () {
                    var returnAPIhost = this.returnAPIhost;
                };

                this.getOnlineStatus();


                console.info("API: " + this.getOnlineStatusResulted().connectedToApiServer);
                console.info("------------------------------");
                console.info("STATIC: " + this.getOnlineStatusResulted().connectedToStaticServer);
            })


            .service('timeService', function (Restangular, localStorageService, $http) {
            })


            .service('chatService', function (Restangular, localStorageService, $http, configurationService, $rootScope, ngToast) {

                this.updateMyProfile = function (newSalesFunnel) {
                    return Restangular.one("myaccount").customPUT(newSalesFunnel);
                };

                this.addToContactList = function (a) {
                    var b = {};
                    b.userid = a;
                    return Restangular.one("contactList/").customPUT(b);
                };

                this.searchUserByNaveAndData = function (newSalesFunnel) {
                    var a = {};
                    a.text = newSalesFunnel;
                    return Restangular.one("searchUser/").customPOST(a);
                };


                 this.uploadAvatar = function (avatarBase64) {
                     var a = {};
                     a.data = avatarBase64;
                     return Restangular.one("searchUser/").customPOST(a);
                 };

                this.getUserById = function (userId) {
                    return Restangular.one("user/" + userId + "/");
                };


                this.getMessageById = function (id) {
                    return Restangular.one("messagesById/" + id );
                };

                this.getAccountListFull = function () {
                    return Restangular.one("contactListWithDetails/");
                };


                this.getNotifications = function () {
                    return Restangular.one("notifications/");
                };


                // Delete from server and delete Notification Toasts
                this.deleteNotificationById = function (id) {
                    console.log($rootScope.allNotificationToasts);
                    for (var i=0; i < $rootScope.allNotificationToasts.length; i++){
                        if ($rootScope.allNotificationToasts[i].id == id){
                            ngToast.dismiss (   $rootScope.allNotificationToasts[i].obj );
                            return Restangular.one("notifications/"+id).customDELETE();
                        }
                    }
                };

                this.getRoomById = function (id) {
                    return Restangular.one("room/"+id+"/").get();
                };

                this.addNewRoom = function (room) {
                    var a = {};
                    a.name = room;
                    return Restangular.one("room/").customPUT(a);
                };

                this.leaveRoom = function (room) {
                    return Restangular.one("room/"+room).customDELETE();
                };

                this.getAllMessagesByRoomId = function (id) {
                    return Restangular.one("messages/"+id+"/").get();
                };

                this.getAllMessagesByRoomIdInHistory = function (id, startId, how) {
                    return Restangular.one("messages/"+id+"/"+startId+"/"+how+"/").get();
                };


                this.addNewMessage = function (roomId, messageText) {
                    var a = {};
                    a.text = messageText;
                    return Restangular.one("messages/"+roomId+"/").customPUT(a);
                };

                this.deleteFromContactList = function (id) {
                    return Restangular.one("contactList/"+id).customDELETE();
                };

                this.getAllRooms = function () {
                    return Restangular.all("room/").getList();
                };


                this.deleteMemberFromChat = function (roomId, userId) {
                    var a = {};
                    a.dismissMembers = [userId];
                    return Restangular.one("room/"+roomId+"/").customPOST(a);
                };

                this.addMembeToChat = function (roomId, userId) {
                    var a = {};
                    a.addMembers = [userId];
                    return Restangular.one("room/"+roomId+"/").customPOST(a);
                };


                this.changeRoomName = function (roomId, newName) {
                    var a = {};
                    a.name = newName;
                    return Restangular.one("room/"+roomId+"/").customPOST(a);
                };




            })






;