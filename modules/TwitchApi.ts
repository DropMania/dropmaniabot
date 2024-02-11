import {
	TwitchStreamRes,
	TwitchChannelRes,
	TwitchUserRes,
	TwitchClipRes,
	TwitchEmoteRes,
	TwitchUserData,
	TwitchCreateClipRes,
} from '../types/responses.js'
import axios from 'axios'
import Module from './_Module.js'
const helix = axios.create({
	baseURL: 'https://api.twitch.tv/helix/',
})
export default class TwitchApi extends Module {
	userId: string = ''
	userData: TwitchUserData
	constructor(channelName: string) {
		super(channelName)
	}
	async init(client: any, getAccessToken: () => string) {
		await super.init(client, getAccessToken)
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
		const { data } = await helix.get<TwitchUserRes>(`users?login=${this.channelName}`, {
			headers: this.getHeaders(),
		})
		return data.data[0]
	}
	async getStreamData() {
		const { data } = await helix.get<TwitchStreamRes>(`streams?user_id=${this.userId}`, {
			headers: this.getHeaders(),
		})
		return data.data[0]
	}
	async getChannelData() {
		const { data } = await helix.get<TwitchChannelRes>(`channels?broadcaster_id=${this.userId}`, {
			headers: this.getHeaders(),
		})
		return data.data[0]
	}
	async getRandomClip() {
		const { data } = await helix.get<TwitchClipRes>(`clips?broadcaster_id=${this.userId}&first=100`, {
			headers: this.getHeaders(),
		})
		const randomIndex = Math.floor(Math.random() * data.data.length)
		return data.data[randomIndex]
	}
	async createClip() {
		try {
			const { data, status } = await helix.post<TwitchCreateClipRes>(
				`clips?broadcaster_id=${this.userId}`,
				{},
				{
					headers: this.getHeaders(),
				}
			)
			if (status !== 202) {
				return null
			}
			return data.data[0]
		} catch (e) {
			console.log(e)
			return null
		}
	}
	async getClip(clipId: string) {
		const { data } = await helix.get<TwitchClipRes>(`clips?id=${clipId}`, {
			headers: this.getHeaders(),
		})
		return data.data[0]
	}
	async getEmotes() {
		const { data } = await helix.get<TwitchEmoteRes>(`chat/emotes?broadcaster_id=${this.userId}`, {
			headers: this.getHeaders(),
		})
		return data.data
	}
}
