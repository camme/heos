HEOS
====

Thid module lets you control and communicate with your Denond Heos speakers.

Its super early beta test so you cant do much with it except get the current stateof your first speaker.

The current version can be tested with

    node develop/index.js

It will connect to your Heos system, get all speakers (players) and get the current playing media on the first player.


## How to use

First install the npm module:

    npm install heos

Then run your code in the same wifi as your Heos system. First you need to connect to the system. 
This heos module works primarely with promises so when you call connect, you recieve a promise:

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
 
### Current implementation

The current version suppors the folowing commands>

- Connect
- heos.getPlayers() - Get all players. Returns an array of player instances
- heos.getPlayer(pid) - Get single player (this calls getPlayers first though, since it bugged when calling the player directly. Returns a player instance.
- player.playNext() - Play the next track on the selected player.
- player.playPrevious() - Play the previous track on the selected player.
- player.getNowPlaying() - Get the current track that is playing on the selected player

### Known issues

Since this module is very alpha, there are some things that I havent figured out yet. These things behave oddly:

- For some reason, getNowPlaying doesnt always return the current played track.
- heos.getPlayer(1234) must be called after getPlayers. For some reason the Heos API won't let me get a player just by knowing its id without calling getPlayers first.

## How it works

The Heos speakers create their own telnet server, which this module connect to and tries to convert into something more 'node'. Each command to the telnet server is composed of a string and '\r\n'; 

[Read more about the Heos API here](http://www.eurostar-ostrava.cz/files/01.2015_HEOS---CLI_PROTOCOL_V01.pdf).


