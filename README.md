# DropManiaBot

## Twitch bot for DropMania and Friends

### Features

-   [x] custom commands
-   [x] custom commands with variables
-   [x] custom commands with scripting capabilities (javascript)
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

### Built-In Commands

-   `!enable [command]` - enable a command
-   `!disable [command]` - disable a command
-   `!addcom [comman] [replytext]` - add a custom command (with [variables](#Variables))
-   `!delcom [command]` - delete a custom command
-   `!editcom [command] [replytext]` - edit a custom command
-   `!setcooldown [command] [timeout in seconds]` - set a cooldown for a command

-   `!hello` - the bot says hello to you... lol

-   `!wecker [minutes]` - set a timer for the bot to remind you
-   `!birthday [mm.dd]` - the bot tells you how many days until your birthday
-   `!tr [text]` - translate text to german
-   `!clipit` - the bot clips the last 30 seconds of the stream

-   `!list` - lists all the people in the queue
-   `!join` - join the queue
-   `!leave` - leave the queue
-   `!clear` - clear the queue
-   `!lock` - lock the queue
-   `!unlock` - unlock the queue
-   `!pick` - pick the next person in the queue
-   `!randomPick` - pick a random person in the queue

-   `!rapuh` - the bot spits at a random chatter
-   `!kisscam` - the bot chooses two random chatters to kiss
-   `!witz` - the bot tells a joke
-   `!liebe` - the bot spreads love
-   `!ehre` - the bot gives you honor
-   `!chuck` - the bot tells a chuck norris joke
-   `!ratschlag` - the bot gives you advice
-   `!fakt` - the bot tells you a fact
-   `!pickupline` - the bot tells you a pickup line
-   `!uwu` - the bot uwuifies your text

-   `!quiz` - the bot starts a quiz
-   `!a` - answer the quiz
-   `!b` - answer the quiz
-   `!c` - answer the quiz
-   `!d` - answer the quiz

-   `!song` - the bot tells you the current song playing on the streamer's spotify
-   `!play` - the bot plays a song on the streamer's spotify
-   `!pause` - the bot pauses the song on the streamer's spotify
-   `!next` - the bot skips the song on the streamer's spotify

-   `!deactivatelobs` - deactivates the lobs
-   `!activatelobs` - activates the lobs

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
-   `{{random[a,b,c,...]}}` - a random element from the array
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
-   `{{eval JSCODE}}` - evaluate javascript code
