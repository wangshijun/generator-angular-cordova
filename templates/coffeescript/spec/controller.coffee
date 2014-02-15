'use strict'

describe 'Controller: <%= classedName %>Controller', ->

  # load the controller's module
  beforeEach module '<%= scriptAppName %>'

  <%= classedName %>Controller = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    <%= classedName %>Controller = $controller '<%= classedName %>Controller', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', ->
    expect(scope.awesomeThings.length).toBe 3
