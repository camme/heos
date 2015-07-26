var discover = require('./discover');
var client = require('./client');

exports.connect = function() {
    return discover()
        .then(function(rInfo) {
            return client.connect(rInfo.address); 
        });
};
