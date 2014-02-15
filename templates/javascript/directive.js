'use strict';

angular.module('<%= scriptAppName %>')
    .directive('<%= cameledName %>', function <%= cameledName %>() {
        return {
            template: '<div></div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                element.text('this is the <%= cameledName %> directive');
            }
        };
    });
