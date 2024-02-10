export async function parseCommand(text: string, params: CommandParams, modules: CustomCommandModules) {
	const variables = text.match(/{{[{]?(.*?)[}]?}}/g)
	if (!variables) return text
	for (const variable of variables) {
		const variableName = variable.replace(/[{}]/g, '')
		const value = await getVariableValue(variableName, params, modules)
		console.log(variable, value)
		text = text.replace(variable, value)
	}
	return text
}

/**
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
-   `{{spotify.title}}` - the current song playing on the streamer's spotify
-   `{{spotify.artist}}` - the current artist playing on the streamer's spotify
-   `{{spotify.album}}` - the current album playing on the streamer's spotify
-   `{{spotify.url}}` - the current song's spotify url
-   `{{uptime}}` - the current uptime of the stream
-   `{{viewers}}` - the current viewer count of the stream
-   `{{game}}` - the current game being played
 */
async function getVariableValue(variable: string, params: CommandParams, modules: CustomCommandModules) {
	const {
		spotify: spotifyModule,
		chatters: chattersModule,
		emotes: emotesModule,
		twitchApi: twitchApiModule,
	} = modules
	const args = params.message.split(/\s+/g)
	if (variable === 'from') {
		return params.user['display-name']
	}
	if (variable === 'user') {
		return params.user['display-name']
	}
	if (variable === 'channel') {
		return params.channel.slice(1)
	}
	if (variable === 'to') {
		return args[0]
	}
	if (variable === 'args') {
		return params.message
	}
	if (variable.startsWith('args[')) {
		const index = parseInt(variable.match(/\d+/g)![0])
		return args[index] || ''
	}
	if (variable === 'random') {
		return Math.floor(Math.random() * 100)
	}
	if (variable.match(/random\[\d+\]/)) {
		const max = parseInt(variable.match(/\d+/g)![0])
		return Math.floor(Math.random() * max)
	}
	if (variable.match(/random\[\d+,\d+\]/)) {
		const [min, max] = variable.match(/\d+/g)!.map((n) => parseInt(n))
		return Math.floor(Math.random() * (max - min) + min)
	}
	if (variable.startsWith('random[')) {
		const options = variable.match(/\[(.*?)\]/)![1].split(',')
		return options[Math.floor(Math.random() * options.length)] || ''
	}
	if (variable === 'random.chatter') {
		const chatter = await chattersModule.getRandomChatter()
		return chatter.displayName || ''
	}
	if (variable === 'random.7tv') {
		return emotesModule.getRand7TvEmote()
	}
	if (variable.startsWith('spotify.')) {
		const spotifyVariable = variable.split('.')[1]
		const spotifyInfo = await spotifyModule.currentlyPlaying()
		if (!spotifyInfo.body.item) return ''
		if (spotifyVariable === 'title') {
			return spotifyInfo.body?.item?.name || ''
		}
		if (spotifyVariable === 'artist') {
			/*  @ts-ignore */
			return spotifyInfo.body?.item?.artists[0].name || ''
		}
		if (spotifyVariable === 'album') {
			/*  @ts-ignore */
			return spotifyInfo.body?.item?.album?.name || ''
		}
		if (spotifyVariable === 'url') {
			return spotifyInfo.body?.item?.external_urls?.spotify || ''
		}
	}
	if (variable === 'uptime') {
		const streamData = await twitchApiModule.getStreamData(params.user['user-id'])
		if (!streamData) return 'offline'
		const startTime = new Date(streamData.started_at)
		const currentTime = new Date()
		const diff = currentTime.getTime() - startTime.getTime()
		const hours = Math.floor(diff / 1000 / 60 / 60)
		const minutes = Math.floor(diff / 1000 / 60) % 60
		return `${hours} Stunden und ${minutes} Minuten`
	}
	if (variable === 'viewers') {
		const streamData = await twitchApiModule.getStreamData(params.user['user-id'])
		if (!streamData) return 'offline'
		return streamData.viewer_count
	}
	if (variable === 'game') {
		const streamData = await twitchApiModule.getStreamData(params.user['user-id'])
		if (!streamData) return 'offline'
		return streamData.game_name
	}
}
