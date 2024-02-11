import { ChildProcess, exec } from 'child_process'
import terminate from 'terminate'
import { Duration } from 'luxon'
import Spotify from '../modules/Spotify.js'
import Chatters from '../modules/Chatters.js'
import Emotes from '../modules/Emotes.js'
import TwitchApi from '../modules/TwitchApi.js'
export async function parseCommand(text: string, params: CommandParams) {
	const variables = text.match(/{{[{]?(.*?)[}]?}}/g)
	if (!variables) return text
	for (const variable of variables) {
		const variableName = variable.replace(/[{}]/g, '')
		const value = await getVariableValue(variableName, params)
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
 */
function getVariableValue(variable: string, { getModule, user, message, channel, reply }: CommandParams) {
	return new Promise<string>(async (resolve, reject) => {
		const spotifyModule = getModule(Spotify)
		const chattersModule = getModule(Chatters)
		const emotesModule = getModule(Emotes)
		const twitchApiModule = getModule(TwitchApi)

		const args = message.split(/\s+/g)
		if (variable === 'from') {
			return resolve(user['display-name'])
		}
		if (variable === 'user') {
			return resolve(user['display-name'])
		}
		if (variable === 'channel') {
			return resolve(twitchApiModule.userData.display_name)
		}
		if (variable === 'to') {
			return resolve(args[0])
		}
		if (variable === 'args') {
			return resolve(message)
		}
		if (variable.startsWith('args[')) {
			const index = parseInt(variable.match(/\d+/g)![0])
			return resolve(args[index] || '')
		}
		if (variable === 'random') {
			return resolve(String(Math.floor(Math.random() * 100)))
		}
		if (variable.match(/random\[\d+\]/)) {
			const max = parseInt(variable.match(/\d+/g)![0])
			return resolve(String(Math.floor(Math.random() * max)))
		}
		if (variable.match(/random\[\d+,\d+\]/)) {
			const [min, max] = variable.match(/\d+/g)!.map((n) => parseInt(n))
			return resolve(String(Math.floor(Math.random() * (max - min) + min)))
		}
		if (variable.startsWith('random[')) {
			const options = variable.match(/\[(.*?)\]/)![1].split(',')
			return resolve(options[Math.floor(Math.random() * options.length)] || '')
		}
		if (variable === 'random.chatter') {
			const chatter = await chattersModule.getRandomChatter()
			return resolve(chatter.displayName || '')
		}
		if (variable === 'random.7tv') {
			return resolve(emotesModule.getRand7TvEmote())
		}
		if (variable === 'random.emote') {
			const emote = await emotesModule.getRandTwitchEmote()
			return resolve(emote?.name || '')
		}
		if (variable === 'random.clip') {
			const clip = await twitchApiModule.getRandomClip()
			return resolve(clip.url || '')
		}
		if (variable.startsWith('spotify.')) {
			const spotifyVariable = variable.split('.')[1]
			const spotifyInfo = await spotifyModule.currentlyPlaying()
			if (!spotifyInfo.body.item) return ''
			if (spotifyVariable === 'title') {
				return resolve(spotifyInfo.body?.item?.name || '')
			}
			if (spotifyVariable === 'artist') {
				/*  @ts-ignore */
				return resolve(spotifyInfo.body?.item?.artists[0].name || '')
			}
			if (spotifyVariable === 'album') {
				/*  @ts-ignore */
				return resolve(spotifyInfo.body?.item?.album?.name || '')
			}
			if (spotifyVariable === 'url') {
				return resolve(spotifyInfo.body?.item?.external_urls?.spotify || '')
			}
		}
		if (variable === 'uptime') {
			const streamData = await twitchApiModule.getStreamData()
			if (!streamData) return 'offline'
			const dur = Duration.fromMillis(new Date().getTime() - new Date(streamData.started_at).getTime())
			return resolve(dur.toHuman({ unitDisplay: 'narrow' }))
		}
		if (variable === 'viewers') {
			const streamData = await twitchApiModule.getStreamData()
			if (!streamData) return 'offline'
			return resolve(String(streamData.viewer_count))
		}
		if (variable === 'game') {
			const streamData = await twitchApiModule.getChannelData()
			return resolve(streamData.game_name)
		}
		if (variable === 'title') {
			const streamData = await twitchApiModule.getChannelData()
			return resolve(streamData.title)
		}
		if (variable.startsWith('eval')) {
			let [, ...s] = variable.split(' ')
			const code = s.join(' ')
			const process_args = {
				code,
				scope: { args, channel: twitchApiModule.userData.display_name },
			}
			let process: ChildProcess | undefined
			const timeout = setTimeout(() => {
				if (process) terminate(process.pid)
				resolve('Error: Timeout')
			}, 1000)
			const buffer = Buffer.from(JSON.stringify(process_args), 'utf-8').toString('base64')
			process = exec(`cd ./evalcmd/ && node execute.js ${buffer}`, (err, stdout, stderr) => {
				clearTimeout(timeout)
				if (err) {
					resolve(`Error: Command konnte nicht ausgeführt werden.`)
					return
				}
				resolve(stdout)
			})
		}
	})
}
