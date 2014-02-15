'use strict';

angular.module('<%= scriptAppName %>')
    .config(function ($provide) {
        $provide.decorator('<%= cameledName %>', function <%= cameledName %>($delegate) {
            // decorate the $delegate
            return $delegate;
        });
    });
