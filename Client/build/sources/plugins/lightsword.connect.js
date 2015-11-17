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
var crypto = require('crypto');
var lightsword_1 = require('./lightsword');
class LightSwordConnect {
    constructor() {
        this.vNum = 0;
    }
    negotiate(options, callback) {
        return __awaiter(this, void 0, Promise, function* () {
            let result = yield lightsword_1.negotiateAsync(options);
            let success = result.success;
            let reason = result.reason;
            this.cipherKey = result.cipherKey;
            this.vNum = result.vNum;
            callback(success, reason);
        });
    }
    sendCommand(options, callback) {
        return __awaiter(this, void 0, Promise, function* () {
            let proxySocket = options.proxySocket;
            let connect = {
                dstAddr: options.dstAddr,
                dstPort: options.dstPort,
                vNum: this.vNum,
                type: 'connect'
            };
            let cipher = crypto.createCipher(options.cipherAlgorithm, this.cipherKey);
            let connectBuffer = cipher.update(new Buffer(JSON.stringify(connect)));
            yield proxySocket.writeAsync(connectBuffer);
            let data = yield proxySocket.readAsync();
            if (!data)
                return callback(false, 'Data not available.');
            let decipher = crypto.createDecipher(options.cipherAlgorithm, this.cipherKey);
            try {
                let connectOk = JSON.parse(decipher.update(data).toString());
                if (connectOk.vNum === connect.vNum + 1) {
                    return callback(true);
                }
                return callback(false, "Can't confirm verification number.");
            }
            catch (ex) {
                return callback(false, ex.message);
            }
        });
    }
    transportStream(options) {
        return __awaiter(this, void 0, Promise, function* () {
            let proxySocket = options.proxySocket;
            let clientSocket = options.clientSocket;
            let decipher = crypto.createDecipher(options.cipherAlgorithm, this.cipherKey);
            // proxySocket.on('data', data => clientSocket.write(decipher.update(data)));
            proxySocket.pipe(decipher).pipe(clientSocket);
            let cipher = crypto.createCipher(options.cipherAlgorithm, this.cipherKey);
            // clientSocket.on('data', (data) => proxySocket.write(cipher.update(data)));
            clientSocket.pipe(cipher).pipe(proxySocket);
        });
    }
}
module.exports = LightSwordConnect;
//# sourceMappingURL=lightsword.connect.js.map