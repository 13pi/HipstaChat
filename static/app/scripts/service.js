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
    var allUsers = {};

    this.getCurrentUser = function ( ) {
        if (configurationService.getOnlineStatusResulted().connectedToApiServer){
                    if (myAccount.allInfo == undefined ){
                       var abc = myAccount.allInfo = Restangular.one('myaccount').get();

                                abc.then( function (c){
                                    localStorageService.set("cache.myaccount", c);
                                });

                            return abc;
                    }
        }else{
            myAccount.allInfo = localStorageService.get("cache.myaccount");
        }

        return myAccount.allInfo;
    };

    this.getAllUsers = function () {
        if (allUsers.all == undefined ){
            allUsers.all = Restangular.all('account/all').getList().$object;
        }
        return  allUsers.all;
    };

        this.getAllAccountsByRole = function (role) {
           return  Restangular.all('account/withRoles/'+role);
        };

    this.getUserById = function () {
        return privateVariable;
    };
    })


    .factory('authHttpResponseInterceptor', ['$q', '$location', function ($q, $location) {
        return {
            response: function (response) {
                // ERROR INTERCEPT
                if (response.status === 401) {
                    $location.path('login/login');
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
                    $location.path('login/login').search('returnTo', $location.path());
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

            function printSD (){
                window.apiServerDefined = true;

                window.loading_screen.finish() // убираем экран загрузки

                console.log ("------------------------------");
                console.log ("       API SERVER ADDRESS");
                console.log ("Address: " +  apiURL );
            };



            var apiURL = "";


                //if ($location.search().username && $location.search().password  ){
                //    localStorageService.set('userName', $location.search().username);
                //    localStorageService.set('userPassword', $location.search().password);
                //
                //    var basicAuth = "Basic " + Base64.encode(localStorageService.get('userName') + ":" + localStorageService.get('userPassword'));
                //    localStorageService.set('token', basicAuth);
                //}


            var date = new Date( new Date().getTime() + 60*1000 );
            //var cookie = "csrftoken=vSxk2mWmW5haUUhThSPI4x5O4Czp57an; sessionid=av5ir06em54f3q11abqnymxm7gc6w2f4";
            //document.cookie= cookie+" ; domain=.hbakaev.ru; path=/;   expires="+date.toUTCString();

            //$http.defaults.headers.common.Cookie =

            //if (localStorageService.get('useEnterprise') == "true"){
            //    apiURL = localStorageService.get('EnterpriseApiURL');
            //    printSD();
            //    return apiURL;
            //}

            //if (window.location.hostname == "localhost" || window.location.hostname == "hse.chk"  ) {
            //    apiURL =  "http://localhost:8080";
            //} else {
            //    if (window.location.hostname == "192.168.1.198" || window.location.hostname == "nikita-notebook.local")
            //    {
            //        printSD();
            //        apiURL = "http://192.168.1.198:8080";
            //        return apiURL ;
            //    }
            //
            //    apiURL =  "http://WEB_URL";
            //}


            apiURL = "http://chat.hbakaev.ru:8000/api/";

            printSD();
            return apiURL;



        };


        this.onlineStatus={
            "connectedToStaticServer":true,
            "connectedToApiServer":true
        };

        this.getOnlineStatusResulted = function (){
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
            catch(e) {}
            return r;
        }

        this.getOnlineStatus = function () {
            var returnAPIhost = this.returnAPIhost;

            //function isConnectedToStaticServer( onlineStatus  ) {
            //    var req = httpRequest("online.html", "GET",false);
            //
            //    if (   req.status == 200 ) onlineStatus.connectedToStaticServer = true; else{
            //        onlineStatus.connectedToStaticServer = false;
            //    }
            //    req.onload = function () {
            //        onlineStatus.connectedToStaticServer = true;
            //    };
            //    req.onerror = function () {
            //        onlineStatus.connectedToStaticServer = false;
            //    };
            //
            //}

            //function isConnectedToApiServer( onlineStatus ) {
            //
            //    //var  req = httpRequest( returnAPIhost()+"/testAuthenticated", "GET",false);
            //    //req.onload = function () {
            //    //    onlineStatus.connectedToApiServer = true;
            //    //};
            //    //req.onerror = function () {
            //    //    onlineStatus.connectedToApiServer = false;
            //    //};
            //    //
            //    //if (req.status == 401 || req.status == 403)    onlineStatus.connectedToApiServer = true;
            //
            //
            //}
            //onlineStatus.connectedToApiServer = true;
            //onlineStatus.connectedToStaticServer = true;

            //isConnectedToStaticServer(this.onlineStatus);
            //isConnectedToApiServer(  this.onlineStatus );
        };

        this.getOnlineStatus()  ;



        console.log ("API: " + this.getOnlineStatusResulted().connectedToApiServer);
        console.log ("------------------------------");
        console.log ("STATIC: " + this.getOnlineStatusResulted().connectedToStaticServer);


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

        this.normalTime = function(time){
            return ( this.getDayFromTime(time) + "." + this.getMonthFromTime(time) +"." +  this.getYearFromTime(time) +"  " + this.getHoursFromTime(time) +":" + this.getMinutesFromTime(time)   )
        };



    })


    .service('chatService', function (Restangular, localStorageService, $http, configurationService) {//


        this.getAllConversations = function () {
            return Restangular.all("conversation/all");
        };


        this.updateMyProfile = function (newSalesFunnel) {
            return Restangular.one("myaccount").customPUT(newSalesFunnel);
        };


        this.getConversationById = function (id ) {
            return Restangular.one("conversation/"+id);
        };

        this.addMessageToConversation = function (id, message) {
            var a = {};
            a.message = message;

            return Restangular.one("conversation/addMessageToConversation/"+id).customPOST(a);
        };


        this.getAuthToken = function (newSalesFunnel) {
            return Restangular.one("public/auth").customPOST(newSalesFunnel);
        };



        this.startNewByTelephoneNumber = function (newSalesFunnel) {
            return Restangular.one("conversation/startNewByTelephoneNumber/"+newSalesFunnel).customPOST();
        }

    })






    .service('userAccountService', function (Restangular, localStorageService, $http, configurationService) {//
        this.addAccount = function (customer) {
            var baseAccounts = Restangular.all('account');
            baseAccounts.post(customer);
        };
    })

    .service('addTokenService', function (Restangular, localStorageService, $http, configurationService) {//
        this.addToken = function (token) {
            var baseAccounts = Restangular.all('token/yandex/direct/' + token);
            var a = {};
            return baseAccounts.post(a);
        };
    })




;