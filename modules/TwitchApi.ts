import { Twitch } from '../types/responses.js'
import axios from 'axios'
import Module from './_Module.js'
const helix = axios.create({
	baseURL: 'https://api.twitch.tv/helix/',
})
export default class TwitchApi extends Module {
	public userId: string = ''
	public userData: Twitch.User
	public getAccessToken: () => string
	constructor(channelName: string) {
		super(channelName)
	}
	async init() {
		await super.init()
		const twitch = await import('../twitch.js')
		this.getAccessToken = twitch.getAccessToken
		const user = await this.getUserData()
		this.userId = user.id
		this.userData = user
	}
	getHeaders() {
		return {
			Authorization: `Bearer ${this.getAccessToken()}`,
			'Client-Id': process.env.CLIENT_ID,
		}
	}
	async getUserData() {
		const { data } = await helix.get<Twitch.Users>(`users?login=${this.channelName}`, {
			headers: this.getHeaders(),
		})
		return data.data[0]
	}
	async getStreamData() {
		const { data } = await helix.get<Twitch.Streams>(`streams?user_id=${this.userId}`, {
			headers: this.getHeaders(),
		})
		return data.data[0]
	}
	async getChannelData() {
		const { data } = await helix.get<Twitch.Channels>(`channels?broadcaster_id=${this.userId}`, {
			headers: this.getHeaders(),
		})
		return data.data[0]
	}
	async getRandomClip() {
		const { data } = await helix.get<Twitch.Clips>(`clips?broadcaster_id=${this.userId}&first=100`, {
			headers: this.getHeaders(),
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
					headers: this.getHeaders(),
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
			headers: this.getHeaders(),
		})
		return data.data[0]
	}
	async getEmotes() {
		const { data } = await helix.get<Twitch.Emotes>(`chat/emotes?broadcaster_id=${this.userId}`, {
			headers: this.getHeaders(),
		})
		return data.data
	}
}
