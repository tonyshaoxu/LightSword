//-----------------------------------
// Copyright(c) 2015 猫王子
//-----------------------------------
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
require('kinq').enable();
require('async-node');
var localServer_1 = require('./socks5/localServer');
var connect_1 = require('./socks5/connect');
var dispatchQueue_1 = require('./lib/dispatchQueue');
var consts = require('./socks5/consts');
class App {
    constructor(options) {
        let defaultOptions = {
            addr: 'localhost',
            port: 1080,
            serverAddr: 'localhost',
            serverPort: 23333,
            cipherAlgorithm: 'aes-256-cfb',
            password: 'lightsword',
            socks5Username: '',
            socks5Password: '',
            timeout: 60
        };
        if (options)
            Object.getOwnPropertyNames(defaultOptions).forEach(n => options[n] = options[n] || defaultOptions[n]);
        dispatchQueue_1.defaultQueue.register(consts.REQUEST_CMD.CONNECT.toString(), this);
        let server = new localServer_1.LocalServer(options || defaultOptions);
        server.start();
    }
    receive(msg, args) {
        new connect_1.Socks5Connect(args);
    }
}
if (!module.parent) {
    new App();
}
module.exports = App;
//# sourceMappingURL=app.js.map