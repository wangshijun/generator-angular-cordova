'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var angularUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var wiredep = require('wiredep');
var cordova = require('cordova');
var plugman = require('plugman');
var _ = require('lodash');

var Generator = module.exports = function Generator(args, options) {
    yeoman.generators.Base.apply(this, arguments);

    args = ['index'];

    this.hookFor('angular-cordova:common', {
        args: args
    });

    this.hookFor('angular-cordova:main', {
        args: args
    });

    this.hookFor('angular-cordova:controller', {
        args: args
    });

    this.on('end', function () {
        this.installDependencies({
            skipInstall: this.options['skip-install'],
            callback: this._injectDependencies.bind(this)
        });

        var enabledComponents = [];

        if (this.resourceModule) {
            enabledComponents.push('angular-resource/angular-resource.js');
        }

        if (this.cookiesModule) {
            enabledComponents.push('angular-cookies/angular-cookies.js');
        }

        if (this.sanitizeModule) {
            enabledComponents.push('angular-sanitize/angular-sanitize.js');
        }

        this.invoke('karma:app', {
            options: {
                coffee: this.options.coffee,
                travis: true,
                'skip-install': this.options['skip-install'],
                components: [
                    'angular/angular.js',
                    'angular-mocks/angular-mocks.js'
                ].concat(enabledComponents)
            }
        });

    });

    this.pkg = require('../package.json');
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
    // welcome message
    if (!this.options['skip-welcome-message']) {
        console.log(this.yeoman);
        console.log(
            'Out of the box I include Ionic and some AngularJS recommended modules.\n'
        );

        // Removed notice for minsafe
        if (this.options.minsafe) {
            console.warn(
                '\n** The --minsafe flag has been removed. For more information, see ' +
                'https://github.com/yeoman/generator-angular#minification-safe. **\n'
            );
        }
    }
};

Generator.prototype.askForCordova = function askForCordova() {
    var cb = this.async();

    // We do some working directory hoping, so keep a track where we start
    this.cwd = process.cwd();

    var prompts = [
        {
            name: 'appname',
            message: 'What is the name of your app? (Spaces aren\'t allowed)',
            default: 'HelloCordova'
        },
        {
            name: 'packagename',
            message: 'What would you like the package to be?',
            default: 'io.cordova.hellocordova'
        },
        {
            type: 'checkbox',
            name: 'platforms',
            message: 'What platforms would you like to add support for?',
            choices: [
                {
                    name: 'Android',
                    value: 'android',
                    checked: true
                },
                {
                    name: 'iOS',
                    value: 'ios',
                    checked: true
                },
                {
                    name: 'Blackberry 10',
                    value: 'blackberry10',
                    checked: false
                },
                {
                    name: 'Windows Phone 7',
                    value: 'wp7',
                    checked: false
                },
                {
                    name: 'Windows Phone 8',
                    value: 'wp7',
                    checked: false
                }
            ]
        },
        {
            type: 'checkbox',
            name: 'plugins',
            message: 'What plugins would you like to include by default?',
            // Find these values using command 'plugman search <keyword>'
            // Find these values here: https://git-wip-us.apache.org/repos/asf
            choices: [
                {
                    name: 'Device Info',
                    value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git',
                    checked: false
                },
                {
                    name: 'Camera',
                    value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git',
                    checked: false
                },
                {
                    name: 'Contacts',
                    value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-contacts.git',
                    checked: false
                },
                {
                    name: 'Dialogs',
                    value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git',
                    checked: false
                },
                {
                    name: 'Geolocation',
                    value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git',
                    checked: false
                },
                {
                    name: 'In App Browser',
                    value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git',
                    checked: false
                },
                {
                    name: 'Audio Handler (a.k.a Media on Cordova Docs)',
                    value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-media.git',
                    checked: false
                },
                {
                    name: 'Media Capture',
                    value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-media-capture.git',
                    checked: false
                },
                {
                    name: 'Network Information',
                    value: 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git',
                    checked: false
                }
            ]
        }
    ];

    this.prompt(prompts, function (props) {
        for (var key in props) {
            this[key] = props[key];
        }

        this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));
        this.scriptAppName = this.appname;

        if (typeof this.env.options.appPath === 'undefined') {
            try {
                this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
            } catch (e) {}
            this.env.options.appPath = this.env.options.appPath || 'www';
        }

        this.appPath = this.env.options.appPath;

        if (typeof this.env.options.coffee === 'undefined') {
            this.option('coffee', {
                desc: 'Generate CoffeeScript instead of JavaScript'
            });

            // attempt to detect if user is using CS or not
            // if cml arg provided, use that; else look for the existence of cs
            if (!this.options.coffee && this.expandFiles(path.join(this.appPath, '/js/**/*.coffee'), {}).length > 0) {
                this.options.coffee = true;
            }

            this.env.options.coffee = this.options.coffee;
        }

        // TODO improve this
        // console.log('appname: ' + this.appname);
        // console.log('scriptAppName: ' + this.scriptAppName);
        // console.log('appPath: ' + this.appPath);

        cb();
    }.bind(this));
};

Generator.prototype.cordovaCreate = function cordovaCreate() {
    console.log("Creating cordova app: " + this.appname);
    var cb = this.async();
    try {
        cordova.create(process.cwd(), this.packagename, this.appname, cb);
    } catch (err) {
        console.error('Failed to create cordova proect: ' + err);
        process.exit(1);
    }
};

Generator.prototype.addPlatforms = function addPlatforms() {
    if (typeof this.platforms === 'undefined') {
        return;
    }

    console.log('Adding requested platforms to the Cordova project...');

    var cb = this.async();
    addPlatformsToCordova(0, this.platforms, cb);
};

Generator.prototype.addPlugins = function addPlugins() {
    console.log('Installing the Cordova plugins...');

    var cb = this.async();
    if (this.plugins.length) {
        addPluginsToCordova(0, this.plugins, cb);
    } else {
        console.log(chalk.gray('no plugin selected'));
        cb();
    }
}

Generator.prototype.askForCompass = function askForCompass() {
    var cb = this.async();

    this.prompt([{
        type: 'confirm',
        name: 'compass',
        message: 'Would you like to use Sass (with Compass)?',
        default: false
    }], function (props) {
        this.compass = props.compass;

        cb();
    }.bind(this));
};

Generator.prototype.askForIonic = function askForIonic() {
    var compass = this.compass;
    var cb = this.async();

    this.prompt([{
        type: 'confirm',
        name: 'ionic',
        message: 'Would you like to include Ionic',
        default: true
    }, {
        type: 'confirm',
        name: 'compassIonic',
        message: 'Would you like to use the Sass version of Ionic',
        default: false,
        when: function (props) {
            return props.ionic && compass;
        }
    }], function (props) {
        this.ionic = props.ionic;
        this.compassIonic = props.compassIonic;

        cb();
    }.bind(this));
};

Generator.prototype.askForAngularModules = function askForAngularModules() {
    var cb = this.async();

    var prompts = [{
        type: 'checkbox',
            name: 'modules',
            message: 'Which modules would you like to include?',
            choices: [{
                value: 'resourceModule',
                name: 'angular-resource.js',
                checked: true
            }, {
                value: 'cookiesModule',
                name: 'angular-cookies.js',
                checked: true
            }, {
                value: 'sanitizeModule',
                name: 'angular-sanitize.js',
                checked: true
            }]
    }];

    this.prompt(prompts, function (props) {
        var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
        this.resourceModule = hasMod('resourceModule');
        this.cookiesModule = hasMod('cookiesModule');
        this.sanitizeModule = hasMod('sanitizeModule');

        var angMods = [];

        if (this.ionic) {
            angMods.push("'ionic'");
        }

        if (this.cookiesModule) {
            angMods.push("'ngCookies'");
        }

        if (this.resourceModule) {
            angMods.push("'ngResource'");
        }

        if (this.sanitizeModule) {
            angMods.push("'ngSanitize'");
        }

        if (angMods.length) {
            this.env.options.angularDeps = "\n  " + angMods.join(",\n  ") +"\n";
        }

        cb();
    }.bind(this));
};

Generator.prototype.readIndex = function readIndex() {
    this.indexFile = this.engine(this.read('../../templates/common/index.html'), this);
};

Generator.prototype.bootstrapFiles = function bootstrapFiles() {
    var sass = this.compass;
    var mainFile = 'main.' + (sass ? 's' : '') + 'css';

    this.copy('css/' + mainFile, 'www/css/' + mainFile);
};

Generator.prototype.appJs = function appJs() {
    this.indexFile = this.appendFiles({
        html: this.indexFile,
        fileType: 'js',
        optimizedPath: 'js/js.js',
        sourceFileList: [
            'js/app.js',
            'js/controller/index.js'
        ],
        searchPath: ['.tmp', 'www']
    });
};

Generator.prototype.createIndexHtml = function createIndexHtml() {
    this.indexFile = this.indexFile.replace(/&apos;/g, "'");
    this.write(path.join(this.appPath, 'index.html'), this.indexFile);
};

Generator.prototype.packageFiles = function () {
    this.coffee = this.env.options.coffee;
    this.template('../../templates/common/_bower.json', 'bower.json');
    this.template('../../templates/common/_package.json', 'package.json');
    this.template('../../templates/common/bowerrc', '.bowerrc');
    this.template('../../templates/common/jshintrc', '.jshintrc');
    this.template('../../templates/common/editorconfig', '.editorconfig');
    this.template('../../templates/common/Gruntfile.js', 'Gruntfile.js');
};

Generator.prototype.imageFiles = function () {
    this.sourceRoot(path.join(__dirname, 'templates'));
    this.directory('img', 'www/img', true);
};

Generator.prototype._injectDependencies = function _injectDependencies() {
    var howToInstall =
        '\nAfter running `npm install & bower install`, inject your front end dependencies into' +
        '\nyour HTML by running:' +
        '\n' +
        chalk.yellow.bold('\n  grunt bower-install');

    if (this.options['skip-install']) {
        console.log(howToInstall);
    } else {
        wiredep({
            directory: 'www/vendor',
            bowerJson: JSON.parse(fs.readFileSync('./bower.json')),
            ignorePath: 'www/',
            htmlFile: 'www/index.html',
            cssPattern: '<link rel="stylesheet" href="{{filePath}}">'
        });
    }
};

function addPlatformsToCordova(index, platforms, cb) {
    if (!(index < platforms.length)) {
        cb();
        return;
    }

    try {
        cordova.platform('add', platforms[index], function () {
            console.log(chalk.green('✔ ') + ' added ' + chalk.gray(platforms[index]));
            addPlatformsToCordova(index + 1, platforms, cb);
        });
    } catch (err) {
        console.error('Failed to add platform ' + platforms['index'] + ': ' + err);
        process.exit(1);
    }
}

function addPluginsToCordova(index, plugins, cb) {
    if (!(index < plugins.length)) {
        cb();
        return;
    }

    cordova.plugin('add', plugins[index], function () {
        console.log(chalk.green('✔ ') + ' added ' + chalk.gray(plugins[index]));
        addPluginsToCordova(index + 1, plugins, cb);
    });
}

