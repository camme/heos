var net = require('net');
var Promise = require('es6-promise').Promise;
var EventEmitter = require('events').EventEmitter;

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
    //console.log('Emit %s', data.heos.command);
    this.emitter.emit(data.heos.command, data);
};

HeosClient.prototype.send = function(command) {
    var commandMessage = 'heos://' + command + '\r\n';
    this.connection.write(commandMessage);
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

var Player = function(client, data) {
    this.client = client;
    this.pid = data.pid;
    this.name = data.name;
    this.model = data.model;
    this.version = data.version;
    this.ip = data.ip;
    this.lineout = data.lineout;
}

Player.prototype.getNowPlaying = function() {

    var command = 'player/get_now_playing_media';
    var query = 'pid=' + this.pid;
    var self = this;

    var promise = new Promise(function(resolve, reject) {

        var listener = function(data) {
            if (data.payload && data.heos.message === query) {
                resolve(data.payload);
                self.client.emitter.removeListener(command, listener);
            }
        }

        self.client.emitter.on(command, listener);
        self.client.send(command + '?' + query);

    });

    return promise;

};
