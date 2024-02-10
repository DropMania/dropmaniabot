import { Client } from 'tmi.js'
import Module from './_Module.js'
import axios from 'axios'
import type { _7TVemote } from '../types/responses.js'

export default class Emotes extends Module {
	_7tvEmotes: _7TVemote[]
	constructor(channelName: string) {
		super(channelName)
	}
	async init(client: Client, getAccessToken: () => string) {
		super.init(client, getAccessToken)
		let { data } = await axios.get(`https://7tv.io/v3/emote-sets/63224188e5c18a56c156b76b`)
		this._7tvEmotes = data.emotes
	}

	get7TvEmotes() {
		return this._7tvEmotes.map((emote) => emote.name)
	}
	get7TvEmote(name: string) {
		return this._7tvEmotes.find((emote) => emote.name === name)
	}
	getRand7TvEmote() {
		return this._7tvEmotes[Math.floor(Math.random() * this._7tvEmotes.length)].name
	}
}
