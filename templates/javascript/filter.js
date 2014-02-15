'use strict';

angular.module('<%= scriptAppName %>')
    .filter('<%= cameledName %>', function <%= cameledName %>() {
        return function (input) {
            return '<%= cameledName %> filter: ' + input;
        };
    });
