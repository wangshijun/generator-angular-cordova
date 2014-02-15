'use strict'

angular.module('<%= scriptAppName %>', [<%= angularModules %>])
  .config ($routeProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'tpl/main.html'
        controller: 'MainController'
      .otherwise
        redirectTo: '/'
