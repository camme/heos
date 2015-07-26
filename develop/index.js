var heos = require('../');

heos.connect()
    .then(function(client) {
        console.log('Connected');
        return client.getPlayers()
            .then(function(players) {
                console.log("Players:");
                players.forEach(function(player) {
                    console.log(player.name);
                });
                var player1 = players[0];
                return player1.getPlayState()
                    .then(function(state) {
                        console.log('State:', state);
                    })
                    .then(function() {
                        return player1.getNowPlaying()
                            .then(function(media) {
                                if (!media.song) {
                                    return player1.getNowPlaying();
                                }  
                                return media;
                            });
                    })
                    .then(function(playing) {
                        console.log('Now playing:', playing);
                        //return player1.playNext();
                    });
            });
    })
    .catch(function(err) {
        console.log(err);
    });
