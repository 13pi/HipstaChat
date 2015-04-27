(function () {
    'use strict';
    angular.module('app', [
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',

        'app.controllers',
        'app.localization',
        'app.nav',
        'app.ui.services',
        'app.chat',
        'app.services',

        'mgcrea.ngStrap',
        'ngToast',
        'ngImgCrop',
        //'app.services.mobile'
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
                'pages/503',
                'system/debug'
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

        /// Reverse elements in array filter
        .filter('reverseCus', function() {
            return function(items, revBoolVal) {
                if (revBoolVal.revBoolVal){
                    return items.slice().reverse();
                }else{
                    return items;
                }
            };
        })

        /// directive to do some action (function) by clicking enter on the page
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



