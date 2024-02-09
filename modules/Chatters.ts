import Module from './_Module.js'
import { Client } from 'tmi.js'
import { redisSync } from '../utils.js'
import { RedisHash } from '../lib/redisSync.js'
type ChatterStore = {
	[username: string]: {
		displayName: string
		lastMessage: number
	}
}
export default class Chatters extends Module {
	chatters: RedisHash<ChatterStore>
	constructor(channelName: string) {
		super(channelName)
		this.chatters = redisSync.createHash(`chatters:${channelName}`, {})
	}
	async init(client: Client) {
		super.init(client)
		setInterval(async () => {
			const chatterStore = await this.chatters.get()
			Object.entries(chatterStore).forEach(([chatter, data]) => {
				if (Date.now() - data.lastMessage > 1000 * 60 * 60) {
					this.chatters.deleteKey(chatter)
				}
			})
		}, 1000 * 30)
	}
	onTwitchMessage({ user }: CommandParams) {
		this.chatters.setKey(user.username, {
			displayName: user['display-name'],
			lastMessage: Date.now(),
		})
	}
	async getRandomChatter() {
		let chatterStore = await this.chatters.get()
		let chatters = Object.values(chatterStore)
		if (chatters.length === 0) return null
		return chatters[Math.floor(Math.random() * chatters.length)]
	}
	async getChatters() {
		return await this.chatters.get()
	}
}
