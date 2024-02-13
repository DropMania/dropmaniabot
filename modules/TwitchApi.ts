import { Twitch } from '../types/responses.js'
import axios from 'axios'
import Module from './_Module.js'
const helix = axios.create({
	baseURL: 'https://api.twitch.tv/helix/',
})
const auth = axios.create({
	baseURL: 'https://id.twitch.tv/oauth2/',
})
export default class TwitchApi extends Module {
	public userId: string = ''
	public userData: Twitch.User
	private userAccessToken: string = ''
	public getBotAccessToken: () => string
	constructor(channelName: string) {
		super(channelName)
	}
	async init() {
		await super.init()
		const twitch = await import('../twitch.js')
		this.getBotAccessToken = () => {
			return twitch.getAccessToken()
		}
		const user = await this.getUserData()
		this.userId = user.id
		this.userData = user
		this.refreshToken()
		setInterval(() => {
			this.refreshToken()
		}, 1000 * 60 * 59)
	}
	setUserAccessToken(token: string) {
		this.userAccessToken = token
	}
	async refreshToken() {
		if (!this.channelConfig.twitch_refresh) return
		const { data } = await auth.post<Twitch.RefreshToken>('token', {
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token: this.channelConfig.twitch_refresh,
		})
		this.userAccessToken = data.access_token
	}
	getBotHeaders() {
		return {
			Authorization: `Bearer ${this.getBotAccessToken()}`,
			'Client-Id': process.env.CLIENT_ID,
		}
	}
	getUserHeaders() {
		return {
			Authorization: `Bearer ${this.userAccessToken}`,
			'Client-Id': process.env.CLIENT_ID,
		}
	}
	async getUserData() {
		const { data } = await helix.get<Twitch.Users>(`users?login=${this.channelName}`, {
			headers: this.getBotHeaders(),
		})
		return data.data[0]
	}
	async getStreamData() {
		const { data } = await helix.get<Twitch.Streams>(`streams?user_id=${this.userId}`, {
			headers: this.getBotHeaders(),
		})
		return data.data[0]
	}
	async getChannelData() {
		const { data } = await helix.get<Twitch.Channels>(`channels?broadcaster_id=${this.userId}`, {
			headers: this.getBotHeaders(),
		})
		return data.data[0]
	}
	async getRandomClip() {
		const { data } = await helix.get<Twitch.Clips>(`clips?broadcaster_id=${this.userId}&first=100`, {
			headers: this.getBotHeaders(),
		})
		const randomIndex = Math.floor(Math.random() * data.data.length)
		return data.data[randomIndex]
	}
	async createClip() {
		try {
			const { data } = await helix.post<Twitch.CreateClip>(
				`clips?broadcaster_id=${this.userId}`,
				{},
				{
					headers: this.getBotHeaders(),
				}
			)
			return data.data[0]
		} catch (e) {
			console.log(e)
			return null
		}
	}
	async getClip(clipId: string) {
		const { data } = await helix.get<Twitch.Clips>(`clips?id=${clipId}`, {
			headers: this.getBotHeaders(),
		})
		return data.data[0]
	}
	async getEmotes() {
		const { data } = await helix.get<Twitch.Emotes>(`chat/emotes?broadcaster_id=${this.userId}`, {
			headers: this.getBotHeaders(),
		})
		return data.data
	}
	async getFollowers() {
		const { data } = await helix.get<Twitch.Followers>(`channels/followers?broadcaster_id=${this.userId}&first=1`, {
			headers: this.getBotHeaders(),
		})
		return data.total
	}
	async getSubs() {
		if (!this.userAccessToken) return false
		const { data } = await helix.get<Twitch.Subs>(`subscriptions?broadcaster_id=${this.userId}&first=1`, {
			headers: this.getUserHeaders(),
		})
		return data.total
	}
}
