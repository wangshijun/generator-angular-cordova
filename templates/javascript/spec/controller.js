'use strict';

/* jshint indent: false */
describe('Controller: <%= classedName %>Controller', function () {

    // load the controller's module
    beforeEach(module('<%= scriptAppName %>'));

    var <%= classedName %>Controller,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        <%= classedName %>Controller = $controller('<%= classedName %>Controller', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});
