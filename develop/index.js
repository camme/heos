var heos = require('../');

heos.connect()
    .then(function(client) {
        console.log('Connected');
        return client.getPlayers()
            .then(function(players) {
                console.log("Players", players);
                return players[0].getNowPlaying()
                    .then(function(playing) {
                        console.log('Now playing ', playing);
                    });
            });
    })
    .catch(function(err) {
        console.log(err);
    });
