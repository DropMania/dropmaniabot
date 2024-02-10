import { Client } from 'tmi.js'
import Module from './_Module.js'
import Chatters from './Chatters.js'
import Emotes from './Emotes.js'
import { db } from '../utils.js'

export default class Lobs extends Module {
	active: boolean = true
	constructor(channelName: string) {
		super(channelName)
	}
	async init(client: Client, getAccessToken: () => string) {
		await super.init(client, getAccessToken)
		const emoteModule = this.getModule(Emotes)
		const chatterModule = this.getModule(Chatters)
		const query = db.selectFrom('lobs').select('text').where('channel', 'in', [this.channelName, 'ALL'])
		setInterval(async () => {
			if (!this.active) return
			const chatter = await chatterModule.getRandomChatter()
			if (!chatter) return
			if (Math.random() > 0.5) return
			if (Math.random() > 0.5) {
				const lobset = await query.execute()
				const lob = lobset[Math.floor(Math.random() * lobset.length)]
				this.client.say(this.channelName, `${chatter.displayName} ${lob.text}`)
			} else {
				const emote = emoteModule.getRand7TvEmote()
				this.client.say(this.channelName, `${emote} ${emote} ${emote}`)
			}
		}, 1000 * 60 * 5)
	}
	activate() {
		this.active = true
	}
	deactivate() {
		this.active = false
	}
}
