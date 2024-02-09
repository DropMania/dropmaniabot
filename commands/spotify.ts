import Spotify from '../modules/Spotify.js'

export async function song({ reply, getChannelModule }: CommandParams) {
	const spotifyModule = getChannelModule(Spotify)
	const song = await spotifyModule.currentlyPlaying()
	if (song.body.item) {
		reply(
			/* @ts-ignore */
			`Der aktuelle Song: ${song.body.item.name} - ${song.body.item.artists.map((a) => a.name).join(', ')} ${
				song.body.item.external_urls.spotify
			}`
		)
	} else {
		reply('Es wird gerade kein Song abgespielt!')
	}
}

export async function play({ getChannelModule }: CommandParams) {
	const spotifyModule = getChannelModule(Spotify)
	spotifyModule.play()
}

export async function pause({ getChannelModule }: CommandParams) {
	const spotifyModule = getChannelModule(Spotify)
	spotifyModule.pause()
}

export async function next({ getChannelModule }: CommandParams) {
	const spotifyModule = getChannelModule(Spotify)
	spotifyModule.next()
}
