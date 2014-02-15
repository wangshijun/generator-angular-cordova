'use strict'

angular.module('<%= scriptAppName %>', [<%= angularModules %>])<% if (ngRoute) { %>
  .config ($routeProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'tpl/main.html'
        controller: 'MainCtrl'
      .otherwise
        redirectTo: '/'
<% } %>
