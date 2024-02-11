import Module from './_Module.js'
import SpotifyWebApi from 'spotify-web-api-node'
export default class Spotify extends Module {
	private SpotifyApi: SpotifyWebApi
	constructor(channelName: string) {
		super(channelName)
	}
	async init() {
		await super.init()
		this.SpotifyApi = new SpotifyWebApi({
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
			redirectUri: process.env.SPOTIFY_REDIRECT,
			refreshToken: this.channelConfig.spotify_refresh,
		})
		this.refreshToken()
		setInterval(() => {
			this.refreshToken()
		}, 1000 * 60 * 59)
	}

	async refreshToken() {
		try {
			let refreshTokenResult = await this.SpotifyApi.refreshAccessToken()
			this.SpotifyApi.setAccessToken(refreshTokenResult.body.access_token)
		} catch (e) {
			console.log(`Spotify token refresh failed at: ${this.channelName}`, e)
		}
	}

	async currentlyPlaying() {
		return await this.SpotifyApi.getMyCurrentPlayingTrack()
	}
	async play() {
		return await this.SpotifyApi.play()
	}
	async pause() {
		return await this.SpotifyApi.pause()
	}
	async next() {
		return await this.SpotifyApi.skipToNext()
	}
}
