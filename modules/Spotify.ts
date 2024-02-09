import Module from './_Module.js'
import channels from '../channels.js'
import SpotifyWebApi from 'spotify-web-api-node'
import { Client } from 'tmi.js'
export default class Spotify extends Module {
	SpotifyApi: SpotifyWebApi
	constructor(channelName: string) {
		super(channelName)
	}
	async init(client: Client) {
		await super.init(client)
		const channel = channels.find((channel) => channel.channel === this.channelName)
		if (!channel) return
		this.SpotifyApi = new SpotifyWebApi({
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
			redirectUri: process.env.SPOTIFY_REDIRECT,
			refreshToken: channel.spotify_refresh,
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
