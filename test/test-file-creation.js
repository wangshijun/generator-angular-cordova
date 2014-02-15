/*global describe, before, it, beforeEach */
'use strict';
var fs = require('fs');
var assert = require('assert');
var path = require('path');
var util = require('util');
var generators = require('yeoman-generator');
var helpers = require('yeoman-generator').test;
var _ = require('underscore.string');

describe('Angular generator', function () {
  var angular;

  beforeEach(function (done) {
    var deps = [
      '../../app',
      '../../common',
      '../../controller',
      '../../main', [
        helpers.createDummyGenerator(),
        'karma:app'
      ]
    ];
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
      }
      angular = helpers.createGenerator('angular-cordova:app', deps);
      angular.options['skip-install'] = true;
      done();
    });
  });

  it('should generate dotfiles', function (done) {
    helpers.mockPrompt(angular, {
      compass: true,
      bootstrap: true,
      compassBootstrap: true,
      modules: []
    });

    angular.run({}, function () {
      helpers.assertFiles(['.bowerrc', '.gitignore', '.editorconfig', '.jshintrc']);
      done();
    });
  });

  it('creates expected files', function (done) {
    var expected = ['www/404.html',
                    'www/favicon.ico',
                    'www/css/main.scss',
                    'www/tpl/main.html',
                    ['.bowerrc', /"directory": "www\/vendor"/],
                    'Gruntfile.js',
                    'package.json',
                    ['bower.json', /"name":\s+"temp"/],
                    'www/js/app.js',
                    'www/index.html',
                    'www/js/controller/main.js',
                    'test/spec/controller/main.js'
                    ];
    helpers.mockPrompt(angular, {
      compass: true,
      bootstrap: true,
      compassBootstrap: true,
      modules: []
    });

    angular.run({}, function() {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('creates coffeescript files', function (done) {
    var expected = ['www/404.html',
                    'www/favicon.ico',
                    'www/css/main.scss',
                    'www/tpl/main.html',
                    ['.bowerrc', /"directory": "www\/vendor"/],
                    'Gruntfile.js',
                    'package.json',
                    ['bower.json', /"name":\s+"temp"/],
                    'www/js/app.coffee',
                    'www/index.html',
                    'www/js/controller/main.coffee',
                    'test/spec/controller/main.coffee'
                    ];
    helpers.mockPrompt(angular, {
      compass: true,
      bootstrap: true,
      compassBootstrap: true,
      modules: []
    });

    angular.env.options.coffee = true;
    angular.run([], function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  /**
   * Generic test function that can be used to cover the scenarios where a generator is creating both a source file
   * and a test file. The function will run the respective generator, and then check for the existence of the two
   * generated files. A RegExp check is done on each file, checking for the generated content with a pattern.
   *
   * The number of parameters is quite huge due to the many options in which the generated files differ,
   * e.g. Services start with an upper case letter, whereas filters, directives or constants start with a lower case
   * letter.
   *
   * The generated items all use the dummy name 'foo'.
   *
   * @param generatorType The type of generator to run, e.g. 'filter'.
   * @param specType The type of the generated spec file, e.g. 'service' - all service types (constant, value, ...)
   *    use the same Service spec template.
   * @param targetDirectory The directory into which the files are generated, e.g. 'directives' - this will be
   *    located under 'www/js' for the sources and 'test/spec' for the tests.
   * @param scriptNameFn The function used to create the name of the created item, e.g. _.classify to generate 'Foo',
   *    or _.camelize to generate 'foo'.
   * @param specNameFn Same as scriptNameFn, but for the describe text used in the Spec file. Some generators use
   *    _.classify, others use _.camelize.
   * @param suffix An optional suffix to be appended to the generated item name, e.g. 'Controller' for controller, which
   *    will generate 'FooController'.
   * @param done The done function.
   */
  function generatorTest(generatorType, specType, targetDirectory, scriptNameFn, specNameFn, suffix, done) {
    var angularGenerator;
    var name = 'foo';
    var deps = [path.join('../..', generatorType)];
    angularGenerator = helpers.createGenerator('angular-cordova:' + generatorType, deps, [name]);

    helpers.mockPrompt(angular, {
      compass: true,
      bootstrap: true,
      compassBootstrap: true,
      modules: []
    });
    angular.run([], function (){
      angularGenerator.run([], function () {
        helpers.assertFiles([
          [path.join('www/js', targetDirectory, name + '.js'), new RegExp(generatorType + '\\(\'' + scriptNameFn(name) + suffix + '\'', 'g')],
          [path.join('test/spec', targetDirectory, name + '.js'), new RegExp('describe\\(\'' + _.classify(specType) + ': ' + specNameFn(name) + suffix + '\'', 'g')]
        ]);
        done();
      });
    });
  }

  describe('Controller', function () {
    it('should generate a new controller', function (done) {
      generatorTest('controller', 'controller', 'controller', _.classify, _.classify, 'Controller', done);
    });
  });

  describe('Directive', function () {
    it('should generate a new directive', function (done) {
      generatorTest('directive', 'directive', 'directive', _.camelize, _.camelize, '', done);
    });
  });

  describe('Filter', function () {
    it('should generate a new filter', function (done) {
      generatorTest('filter', 'filter', 'filter', _.camelize, _.camelize, '', done);
    });
  });

  describe('Service', function () {
    function serviceTest (generatorType, nameFn, done) {
      generatorTest(generatorType, 'service', 'service', nameFn, nameFn, '', done);
    }

    it('should generate a new constant', function (done) {
      serviceTest('constant', _.camelize, done);
    });

    it('should generate a new service', function (done) {
      serviceTest('service', _.classify, done);
    });

    it('should generate a new factory', function (done) {
      serviceTest('factory', _.camelize, done);
    });

    it('should generate a new provider', function (done) {
      serviceTest('provider', _.camelize, done);
    });

    it('should generate a new value', function (done) {
      serviceTest('value', _.camelize, done);
    });
  });

  describe('View', function () {
    it('should generate a new view', function (done) {
      var angularView;
      var deps = ['../../view'];
      angularView = helpers.createGenerator('angular-cordova:view', deps, ['foo']);

      helpers.mockPrompt(angular, {
        compass: true,
        bootstrap: true,
        compassBootstrap: true,
        modules: []
      });
      angular.run([], function (){
        angularView.run([], function () {
          helpers.assertFile(
            ['www/tpl/foo.html']
          );
          done();
        });
      });
    });

    it('should generate a new view in subdirectories', function (done) {
      var angularView;
      var deps = ['../../view'];
      angularView = helpers.createGenerator('angular-cordova:view', deps, ['foo/bar']);

      helpers.mockPrompt(angular, {
        compass: true,
        ionic: true,
        compassIonic: true,
        modules: []
      });
      angular.run([], function (){
        angularView.run([], function () {
          helpers.assertFile(
            ['www/tpl/foo/bar.html']
          );
          done();
        });
      });
    });
  });
});
