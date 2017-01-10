var net = require('net');
var qs = require('qs');
var Promise = require('es6-promise').Promise;

var Player = function(client, data) {
    this.client = client;
    this.pid = data.pid;
    this.name = data.name;
    this.model = data.model;
    this.version = data.version;
    this.ip = data.ip;
    this.lineout = data.lineout;
}

Player.prototype.getPlayState = function() {

    var command = 'player/get_play_state';
    var query = 'pid=' + this.pid;
    var self = this;

    var promise = new Promise(function(resolve, reject) {

        var listener = function(data) {
          //console.log(data)
            if (data.heos.message.indexOf(query) > -1) {
                var payload = qs.parse(data.heos.message);
                resolve(payload.state);
                self.client.emitter.removeListener(command, listener);
            }
        }

        self.client.emitter.on(command, listener);
        self.client.send(command + '?' + query);

    });

    return promise;

};

Player.prototype.setPlayState = function(state) {

  var command = 'player/set_play_state';
  var query = 'pid=' + this.pid+'&state='+state;
  var self = this;

    var self = this;

    var promise = new Promise(function(resolve, reject) {

        var listener = function(data) {
            //console.log(data);
            if (data.payload && data.heos.message === query) {
                resolve();
                self.client.emitter.removeListener(command, listener);
            }
        }

        self.client.emitter.on(command, listener);
        self.client.send(command + '?' + query);

    });

    return promise;

};


Player.prototype.getNowPlaying = function() {

    var command = 'player/get_now_playing_media';
    var query = 'pid=' + this.pid;
    var self = this;

    var promise = new Promise(function(resolve, reject) {

        var listener = function(data) {
            //console.log(data);
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

Player.prototype.playNext = function() {

    var command = 'player/play_next';
    var query = 'pid=' + this.pid;
    var self = this;

    var promise = new Promise(function(resolve, reject) {

        var listener = function(data) {
            //console.log(data);
            if (data.payload && data.heos.message === query) {
                resolve();
                self.client.emitter.removeListener(command, listener);
            }
        }

        self.client.emitter.on(command, listener);
        self.client.send(command + '?' + query);

    });

    return promise;

};

Player.prototype.playPrevious = function() {

    var command = 'player/play_previous';
    var query = 'pid=' + this.pid;
    var self = this;

    var promise = new Promise(function(resolve, reject) {

        var listener = function(data) {
            //console.log(data);
            if (data.payload && data.heos.message === query) {
                resolve();
                self.client.emitter.removeListener(command, listener);
            }
        }

        self.client.emitter.on(command, listener);
        self.client.send(command + '?' + query);

    });

    return promise;

};

Player.prototype.getMute = function() {

    var command = 'player/get_mute';
    var query = 'pid=' + this.pid;
    var self = this;

    var promise = new Promise(function(resolve, reject) {

        var listener = function(data) {
            //console.log(data);
            if (data.heos.message.indexOf(query) > -1) {
                var payload = qs.parse(data.heos.message);
                resolve(payload.state);
                self.client.emitter.removeListener(command, listener);
            }
        }

        self.client.emitter.on(command, listener);
        self.client.send(command + '?' + query);

    });

    return promise;

};

Player.prototype.setMute = function(state) {

    var command = 'player/set_mute';
    //heos://player/set_mute?pid=player_id&state=on_or_off
    var query = 'pid=' + this.pid+'&state='+state;
    var self = this;

    var promise = new Promise(function(resolve, reject) {

        var listener = function(data) {
            //console.log(data);
            if (data.heos.message.indexOf(query) > -1) {
                var payload = qs.parse(data.heos.message);
                resolve(payload.state);
                self.client.emitter.removeListener(command, listener);
            }
        }

        self.client.emitter.on(command, listener);
        self.client.send(command + '?' + query);

    });

    return promise;

};

Player.prototype.getVolume = function() {

    var command = 'player/get_volume';
    var query = 'pid=' + this.pid;
    var self = this;
    var promise = new Promise(function(resolve, reject) {

        var listener = function(data) {
            //console.log(data);
            if (data.heos.message.indexOf(query) > -1) {
                var payload = qs.parse(data.heos.message);
                resolve(payload.level);
                self.client.emitter.removeListener(command, listener);
            }
        }

        self.client.emitter.on(command, listener);
        self.client.send(command + '?' + query);

    });

    return promise;

};

Player.prototype.setVolume = function(level) {

    var command = 'player/set_volume';
    //heos://player/set_mute?pid=player_id&state=on_or_off
    var query = 'pid=' + this.pid+'&level='+level;
    var self = this;

    var promise = new Promise(function(resolve, reject) {

        var listener = function(data) {
            //console.log(data);
            if (data.heos.message.indexOf(query) > -1) {
                var payload = qs.parse(data.heos.message);
                resolve(payload.level);
                self.client.emitter.removeListener(command, listener);
            }
        }

        self.client.emitter.on(command, listener);
        self.client.send(command + '?' + query);

    });

    return promise;

};


module.exports = Player;
