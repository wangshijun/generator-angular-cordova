'use strict';
var path = require('path'),
    util = require('util'),
    ScriptBase = require('../script-base.js'),
    angularUtils = require('../util.js');

var Generator = module.exports = function Generator() {
    ScriptBase.apply(this, arguments);
    this.hookFor('angular-cordova:controller');
    this.hookFor('angular-cordova:view');
};

util.inherits(Generator, ScriptBase);

Generator.prototype.rewriteAppJs = function () {
    var coffee = this.env.options.coffee;
    var config = {
        file: path.join(this.env.options.appPath, 'js/app.' + (coffee ? 'coffee' : 'js')),
        needle: '.otherwise',
        splicable: [
            "  templateUrl: 'tpl/" + this.name.toLowerCase() + ".html'" + (coffee ? "" : "," ),
            "  controller: '" + this.classedName + "Controller'"
        ]
    };

    if (coffee) {
        config.splicable.unshift(".when '/" + this.name + "',");
    } else {
        config.splicable.unshift(".when('/" + this.name + "', {");
        config.splicable.push("})");
    }

    angularUtils.rewriteFile(config);
};

