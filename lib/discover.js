var Client = require('node-ssdp').Client;
var Promise = require('es6-promise').Promise;

module.exports = function() {

    var promise = new Promise(function(resolve, reject) {

        var client = new Client();

        var found = false;

        client.on('response', function (headers, statusCode, rinfo) {

            if (headers.SERVER.indexOf('Denon') === -1) {
                return;
            }

            if (!found) {
                resolve(rinfo);
                found = true;
            }

        });

        client.on('error', function(err) {
            client.close();
            reject(err);
        });

        // search for a service type
        client.search('urn:schemas-denon-com:device:ACT-Denon:1');

    });

    return promise;

}



