import { Client } from 'tmi.js'
import channels from '../channels.js'
export default class Module {
	protected client: Client | null
	protected channelName: string
	protected channelConfig: (typeof channels)[number]
	private moduleApi: typeof import('../modules.js')
	constructor(channelName: string) {
		this.channelName = channelName
		const channel = channels.find((channel) => channel.channel === this.channelName)
		this.channelConfig = channel
	}
	async init() {
		const twitch = await import('../twitch.js')
		this.client = twitch.default
		this.moduleApi = await import(`../modules.js`)
	}
	getModule<T extends Modules>(module: T): ModuleType<T> {
		return this.moduleApi.getModule(this.channelName, module)
	}
	getGlobalModule<T extends Modules>(module: T): ModuleType<T> {
		return this.moduleApi.getGlobalModule(module)
	}
	onTwitchMessage({}: CommandParams) {}
	onTwitchCheer({}: CommandParams) {}
}
