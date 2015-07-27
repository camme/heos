var heos = require('../');
var playerId = 683116648;
heos.connect()
    .then(function(client) {
        console.log('Connected');
        return client.getPlayer(playerId)
            .then(function(player1) {
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
