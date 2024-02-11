# DropManiaBot

## Twitch bot for DropMania and Friends

### Features

-   [x] custom commands
-   [x] custom commands with variables
-   [ ] custom commands with scripting capabilities (maybe)
-   [x] variety of cool built in commands B)
-   [x] enable/disable commands
-   [x] spotify integration
-   [x] give random "lobs" to random chatter
-   [x] cheer thanker
-   [x] permission system with middleware-type functions
-   [x] modular features
-   [x] command cooldowns
-   [ ] configurable settings for modules

... and more!

### Variables

-   `{{from}}` - the user who triggered the command
-   `{{user}}` - the user who triggered the command
-   `{{channel}}` - the channel the command was triggered in
-   `{{to}}` - the first argument passed to the command
-   `{{args[x]}}` - the xth argument passed to the command
-   `{{args}}` - all arguments passed to the command
-   `{{random}}` - a random number between 0 and 100
-   `{{random[x]}}` - a random number between 0 and x
-   `{{random[x,y]}}` - a random number between x and y
-   `{{random[text1,bla,was geht,...]}}` - a random element from the array
-   `{{random.chatter}}` - a random chatter in the channel
-   `{{random.7tv}}` - a random 7tv emote
-   `{{random.emote}}` - a random Twitch emote
-   `{{random.clip}}` - a random clip url from the channel
-   `{{spotify.title}}` - the current song playing on the streamer's spotify
-   `{{spotify.artist}}` - the current artist playing on the streamer's spotify
-   `{{spotify.album}}` - the current album playing on the streamer's spotify
-   `{{spotify.url}}` - the current song's spotify url
-   `{{uptime}}` - the current uptime of the stream
-   `{{viewers}}` - the current viewer count of the stream
-   `{{game}}` - the current game being played
-   `{{title}}` - the current title of the stream
