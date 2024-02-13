import Module from './_Module.js'
import axios from 'axios'
import type { _7TVemote } from '../types/responses.js'
import TwitchApi from './TwitchApi.js'

export default class Emotes extends Module {
	private _7tvEmotes: _7TVemote[]
	constructor(channelName: string) {
		super(channelName)
	}
	async init() {
		super.init()
		let { data } = await axios.get(`https://7tv.io/v3/emote-sets/${this.channelConfig['7tv_emoteset']}`)
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
	async getRandTwitchEmote() {
		const twitchApiModule = this.getModule('TwitchApi')
		const emotes = await twitchApiModule.getEmotes()
		return emotes[Math.floor(Math.random() * emotes.length)]
	}
}
