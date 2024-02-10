import { TwitchStreamRes } from '../types/responses.js'
import axios from 'axios'
import Module from './_Module.js'
const helix = axios.create({
	baseURL: 'https://api.twitch.tv/helix/',
})
export const scope = 'global'
export default class TwitchApi extends Module {
	constructor() {
		super('__global')
	}

	async getStreamData(userId: string) {
		console.log('getStreamData', userId)
		const { data } = await helix.get<TwitchStreamRes>(`streams?user_id=${userId}`, {
			headers: {
				Authorization: `Bearer ${this.getAccessToken()}`,
				'Client-Id': process.env.CLIENT_ID,
			},
		})
		return data.data[0]
	}
	async getUserData(userId: string) {
		const { data } = await helix.get(`users?id=${userId}`, {
			headers: {
				Authorization: `Bearer ${this.getAccessToken()}`,
				'Client-Id': process.env.CLIENT_ID,
			},
		})
		return data
	}
}
