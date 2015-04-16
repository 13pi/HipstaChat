(function () {
    'use strict';
    angular.module('app', [
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',

        'textAngular',

        'app.controllers',
        'app.localization',
        'app.nav',
        'app.ui.ctrls',
        'app.ui.services',

        'mgcrea.ngStrap',

        'app.services',
        'ngToast',
        //'satellizer',

        'app.login',
        'cgBusy',

        'app.chat',
        'formstamp',

        'angular.filter',
        'ui.bootstrap.datetimepicker'


    ])


    .run((['$location', '$rootScope' ,function($location, $rootScope, editableOptions) {
            $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
                $rootScope.title = current.$$route.title;
            });

    }] ) )


        .config(['$routeProvider',  '$httpProvider', function ($routeProvider, $httpProvider) {
            $httpProvider.interceptors.push('authHttpResponseInterceptor');
            var routes, setRoutes;

            $httpProvider.defaults.withCredentials = true;

            routes = [
                'dashboard',
                'pages/404',
                'pages/403',
                'pages/500',
                'pages/503'
            ];


            setRoutes = function (route) {
                var config, url;
                url = '/' + route;
                config = {
                    templateUrl: 'views/' + route + '.html'
                };
                $routeProvider.when(url, config);
                return $routeProvider;
            };
            routes.forEach(function (route) {
                return setRoutes(route);
            });
            return $routeProvider.when('/', {
                redirectTo: '/dashboard'
            }).when('/404', {
                templateUrl: 'views/pages/404.html'
            }).otherwise({
                redirectTo: '/404'
            });
        }
        ])

    .filter('reverseCus', function() {
        return function(items, revBoolVal) {
            //console.log(revBoolVal.revBoolVal);
            if (revBoolVal.revBoolVal){
                return items.slice().reverse();
            }else{
                return items;

            }

        };
    })

        .directive('ngEnter', function() {
            return function(scope, element, attrs) {
                element.bind("keydown keypress", function(event) {
                    if(event.which === 13) {
                        scope.$apply(function(){
                            scope.$eval(attrs.ngEnter, {'event': event});
                        });

                        event.preventDefault();
                    }
                });
            };
        });


    

}).call(this)

;



