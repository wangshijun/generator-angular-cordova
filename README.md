# generator-angular-cordova [![Build Status](https://secure.travis-ci.org/wangshijun2010/generator-angular-cordova.png?branch=master)](https://travis-ci.org/wangshijun2010/generator-angular-cordova)

> [Yeoman](http://yeoman.io) generator for Angular + Ionic + Cordova, let you quickly setup a project with sensible default and best practices

## Getting started
- Make sure you have the following installed:
    - [yo](https://github.com/yeoman/yo): `npm install -g yo`
    - [grunt-cli](https://github.com/gruntjs/grunt): `npm install -g grunt-cli`
    - [cordova-cli](https://github.com/apache/cordova-cli): `npm install -g cordova`

- Install any SDKs you need for developing platform applications:
    - [iOS](https://developer.apple.com/xcode/)
    - [Android](http://developer.android.com/sdk/index.html#ExistingIDE)
    - etc...

- Install the generator: `npm install -g generator-angular-cordova`
- Run: `yo angular-cordova`


## Usage
Once you have ran `yo angular-cordova` and answered some questions, yeoman should now have scaffolded a cordova, ionic, angular skeleton for you.

### Serve to web browser
To deploy as local web server and watch for changes requires the installation of [LiveReload](http://livereload.com/) browser extension.

`grunt serve --platform=ios`: prepares and serves the application as a local web server at [http://localhost:9000/](http://localhost:9000/), watching for changes then preparing/redeploying the web server.

### Serve to emulator
`grunt emulate`: builds and emulates all installed platforms

`grunt live-emulate`: builds and emulates all installed platforms, watching for changes then building/redeploying the emulator.

### Serve to device
`grunt device`: builds and runs all installed platforms

`grunt live-device`: builds and runs all installed platforms, watching for changes then building/redeploying.


## Usage

Install `generator-angular-cordova`:
```
npm install -g generator-angular-cordova
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo angular-cordova`, optionally passing an app name:
```
yo angular-cordova [app-name]
```

Run `grunt` for building and `grunt serve` for preview


## Generators

Available generators:

* [angular-cordova](#app) (aka [angular-cordova:app](#app))
* [angular-cordova:controller](#controller)
* [angular-cordova:directive](#directive)
* [angular-cordova:filter](#filter)
* [angular-cordova:route](#route)
* [angular-cordova:service](#service)
* [angular-cordova:provider](#service)
* [angular-cordova:factory](#service)
* [angular-cordova:value](#service)
* [angular-cordova:constant](#service)
* [angular-cordova:decorator] (#decorator)
* [angular-cordova:view](#view)

**Note: Generators are to be run from the root directory of your app.**

### App
Sets up a new AngularJS app, generating all the boilerplate you need to get started. The app generator also optionally installs Twitter Bootstrap and additional AngularJS modules, such as angular-resource (installed by default).

Example:
```bash
yo angular-cordova
```

### Route
Generates a controller and view, and configures a route in `app/js/app.js` connecting them.

Example:
```bash
yo angular-cordova:route myroute
```

Produces `www/js/controller/myroute.js`:
```javascript
angular.module('myMod').controller('MyrouteCtrl', function ($scope) {
  // ...
});
```

Produces `www/views/myroute.html`:
```html
<p>This is the myroute view</p>
```

### Controller
Generates a controller in `www/js/controller`.

Example:
```bash
yo angular-cordova:controller user
```

Produces `www/js/controller/user.js`:
```javascript
angular.module('myMod').controller('UserController', function ($scope) {
  // ...
});
```
### Directive
Generates a directive in `www/js/directive`.

Example:
```bash
yo angular-cordova:directive myDirective
```

Produces `www/js/directive/myDirective.js`:
```javascript
angular.module('myMod').directive('myDirective', function () {
  return {
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      element.text('this is the myDirective directive');
    }
  };
});
```

### Filter
Generates a filter in `www/js/filter`.

Example:
```bash
yo angular-cordova:filter myFilter
```

Produces `www/js/filter/myFilter.js`:
```javascript
angular.module('myMod').filter('myFilter', function () {
  return function (input) {
    return 'myFilter filter:' + input;
  };
});
```

### View
Generates an HTML view file in `www/views`.

Example:
```bash
yo angular-cordova:view user
```

Produces `www/views/user.html`:
```html
<p>This is the user view</p>
```

### Service
Generates an AngularJS service.

Example:
```bash
yo angular-cordova:service myService
```

Produces `www/js/service/myService.js`:
```javascript
angular.module('myMod').service('myService', function () {
  // ...
});
```

You can also do `yo angular-cordova:factory`, `yo angular-cordova:provider`, `yo angular-cordova:value`, and `yo angular-cordova:constant` for other types of service.

### Decorator
Generates an AngularJS service decorator.

Example:
```bash
yo angular-cordova:decorator serviceName
```

Produces `www/js/decorators/serviceNameDecorator.js`:
```javascript
angular.module('myMod').config(function ($provide) {
    $provide.decorator('serviceName', function ($delegate) {
      // ...
      return $delegate;
    });
  });
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

MIT
