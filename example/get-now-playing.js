var Heos = require('heos');

Heos.connect()
    .then(function(heos) {

        // Get all your players (speakers or groups)
        return heos.getPlayers();

    })
    .then(function(players) {

        console.log('Found %s players', players.length);
        
        // Pick the first and get what it is playing
        return players[0].getNowPlaying()
            .then(function(media) {
                console.log('Playing:', media);
            });

    })
    .catch(function(err) {
        console.log('Error', err);
    });

