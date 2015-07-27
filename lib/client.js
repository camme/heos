var net = require('net');
var qs = require('qs');
var Promise = require('es6-promise').Promise;
var EventEmitter = require('events').EventEmitter;
var Player = require('./player');
var log = { level: 'silent' };

exports.connect = function(address) {

    var promise = new Promise(function(resolve, reject) {

        var params = {
            host: address, 
            port: 1255,
            timeout: 5000,
        };

        var connection = net.connect(params.port, params.host);

        connection.on("connect", function (socket) {
            resolve(new HeosClient(connection));
        });

        connection.on("end", function () {
            // ITS OVER!
        });

        connection.on('timeout', function(err) {
            reject(err);
            console.log(err);
        });

    });

    return promise;

}

var HeosClient = function(connection) {

    this.connection = connection;
    this.queue = {};
    this.emitter = new EventEmitter();

    var self = this;

    connection.on("data", function (c) {
        var json = JSON.parse(c.toString());
        self.process(json);
    });

};

HeosClient.prototype.process = function(data) {
    if (log.level === 'verbose') {
        console.log('Received answer for "%s"', data.heos.command);
    }
    this.emitter.emit(data.heos.command, data);
};

HeosClient.prototype.send = function(command) {
    var commandMessage = 'heos://' + command;
    if (log.level === 'verbose') {
        console.log('Send', commandMessage);
    }
    this.connection.write(commandMessage + '\r\n');
};

HeosClient.prototype.getPlayers = function() {

    var self = this;

    var promise = new Promise(function(resolve, reject) {

        var command = 'player/get_players';

        var listener = function(data) {
            if (data.payload) {
                var players = data.payload.map(function(playerInfo) {
                    var player = new Player(self, playerInfo);
                    return player;
                });
                resolve(players);
                self.emitter.removeListener(command, listener);
            }
        }

        self.emitter.on(command, listener);
        self.send(command);

    });

    return promise;

}

HeosClient.prototype.getPlayer = function(pid) {

    return this.getPlayers()
        .then(function(players) {
            var player = players.filter(function(player) {
                return player.pid === pid;
            })[0];

            return player;
        });
 
}


