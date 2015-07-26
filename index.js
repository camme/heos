var Client = require('node-ssdp').Client;
var telnet = require('telnet-client');
var net = require('net');
var connection = new telnet();
var client = new Client();

var found = false;
client.on('response', function (headers, statusCode, rinfo) {

    if (headers.SERVER.indexOf('Denon') === -1) {
        return;
    }

    if (!found) {

        found = true;


        console.log('Got a response to an m-search.');
        //console.log(arguments);

        var params = {
            host: rinfo.address, //'128.0.0.1',
            port: 1255,
            //shellPrompt: '/ # ',
            timeout: 5000,
            // removeEcho: 4
        };

        var conn = net.connect(params.port,params.host);

        //console.log(conn);

        conn.on("connect", function (socket) {
            var cmd = 'heos://player/get_players\r\n';
            console.log("SEND");
            conn.write(cmd);
        });

        conn.on("data", function (c) {
            var json = JSON.parse(c.toString());
            if (json.payload) {
                //console.log(json); //c.toString());
                if (json.heos.command === 'player/get_players') {
                    console.log("Found players", json.payload);
                    var cmd = 'heos://player/get_play_state?pid=' + json.payload[0].pid;
                    //var cmd = 'heos://browse/get_music_sources';
                    console.log('send %s', cmd);
                    conn.write(cmd + '\r\n');
                } else {

                }
            } else {
                console.log('RECIEVED %s', c.toString());
            }
            // data coming in.  deal with it
            //socket.write("hello")
            //socket.end("send one last optional buffer and close the connection")
        });

        conn.on("end", function () {
            // ITS OVER!
        });

        conn.on('timeout', function(err) {
            console.log(err);
        });

        return;

        connection.on('ready', function(prompt) {
            console.log('READY');
            var cmd = 'heos://player/get_players';
            connection.exec(cmd, function(response) {
                console.log("RESPONSE");
                console.log(response);
            });
        });

        connection.on('timeout', function() {
            console.log('socket timeout!')
            connection.end();
        });

        connection.on('close', function() {
            console.log('connection closed');
            process.exit();
        });


        connection.connect(params);
        console.log('Try to connect to %s:%s', params.host, params.port);
        found = true;

    }


});

// search for a service type
client.search('urn:schemas-denon-com:device:ACT-Denon:1');

// Or get a list of all services on the network

//client.search('ssdp:all');
