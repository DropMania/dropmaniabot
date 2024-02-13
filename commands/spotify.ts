export async function song({ reply, getModule }: CommandParams) {
	const spotifyModule = getModule('Spotify')
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

export async function play({ getModule }: CommandParams) {
	const spotifyModule = getModule('Spotify')
	spotifyModule.play()
}

export async function pause({ getModule }: CommandParams) {
	const spotifyModule = getModule('Spotify')
	spotifyModule.pause()
}

export async function next({ getModule }: CommandParams) {
	const spotifyModule = getModule('Spotify')
	spotifyModule.next()
}
