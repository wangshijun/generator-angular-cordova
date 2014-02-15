'use strict';

angular.module('<%= scriptAppName %>', [<%= angularModules %>])
    .config(function ($stateProvider, $urlRouterProvider) {
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "tpl/tabs.html"
            })

            // the pet tab has its own child nav-view and history
            .state('tab.index', {
                url: '/items',
                views: {
                    'index-tab': {
                        templateUrl: 'tpl/index.html',
                        controller: 'IndexController'
                    }
                }
            })

            .state('tab.detail', {
                url: '/item/:itemId',
                views: {
                    'index-tab': {
                        templateUrl: 'tpl/detail.html',
                        controller: 'IndexController'
                    }
                }
            })

            .state('tab.form', {
                url: '/form',
                views: {
                    'form-tab': {
                        templateUrl: 'tpl/form.html'
                    }
                }
            })

            .state('tab.about', {
                url: '/about',
                views: {
                    'about-tab': {
                        templateUrl: 'tpl/about.html'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/items');

    });
