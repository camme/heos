var net = require('net');
var qs = require('qs');
var Promise = require('es6-promise').Promise;
var Player = require('./player');

var Group = function(client, data) {
    this.client = client;
    this.gid = data.gid;
    this.name = data.name;
    this.players =  data.players.map(function(playerInfo) {
        var player = new Player(client, playerInfo);
        return player;
    });

}


Group.prototype.getMute = function() {

    var command = 'group/get_mute';
    var query = 'gid=' + this.gid;
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

Group.prototype.setMute = function(state) {

    var command = 'group/set_mute';
    //heos://group/set_mute?gid=group_id&state=on_or_off
    var query = 'gid=' + this.gid+'&state='+state;
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

Group.prototype.getVolume = function() {

    var command = 'group/get_volume';
    var query = 'gid=' + this.gid;
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

Group.prototype.setVolume = function(level) {

    var command = 'group/set_volume';
    //heos://group/set_mute?gid=group_id&state=on_or_off
    var query = 'gid=' + this.gid+'&level='+level;
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


module.exports = Group;
