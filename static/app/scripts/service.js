'use strict';

angular.module('app').value('cgBusyDefaults',{
    message:'Loading',
    backdrop: false,
    templateUrl: 'templates/promise.html',
    delay: 0,
    minDuration: 700,
    wrapperClass: 'overlay'
});


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

                    var apiURL = "";

                    apiURL = "/api/";
                    //apiURL =  "http://hipstachat.tk/api/";

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
                    //else
                    //r.timeout = 4000;  // Reduce default 2mn-like timeout to 4 s if synchronous

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


                console.log("API: " + this.getOnlineStatusResulted().connectedToApiServer);
                console.log("------------------------------");
                console.log("STATIC: " + this.getOnlineStatusResulted().connectedToStaticServer);


            })


            .service('timeService', function (Restangular, localStorageService, $http) {
                this.getDayFromTime = function (time) {
                    return new Date(time).getDate();
                };

                this.getMonthFromTime = function (time) {
                    return new Date(time).getMonth() + 1;
                };

                this.getYearFromTime = function (time) {
                    return new Date(time).getFullYear();
                };

                this.getHoursFromTime = function (time) {
                    return new Date(time).getHours();
                };

                this.getMinutesFromTime = function (time) {
                    return new Date(time).getMinutes();
                };

                this.normalTime = function (time) {
                    return ( this.getDayFromTime(time) + "." + this.getMonthFromTime(time) + "." + this.getYearFromTime(time) + "  " + this.getHoursFromTime(time) + ":" + this.getMinutesFromTime(time)   )
                };

            })


            .service('chatService', function (Restangular, localStorageService, $http, configurationService) {

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


                this.addNewRoom = function (newSalesFunnel) {
                    var a = {};
                    a.name = newSalesFunnel;
                    return Restangular.one("room/").customPOST(a);
                };


                this.getUserById = function (userId) {
                    return Restangular.one("user/" + userId + "/");
                };

                this.getAccountListFull = function () {

                    return Restangular.one("contactListWithDetails/");

                };

            })






;