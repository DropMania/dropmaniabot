import { Client } from 'tmi.js'
export default class Module {
	protected client: Client | null
	protected channelName: string
	protected getAccessToken: () => string
	private moduleApi: typeof import('../modules.js')
	constructor(channelName: string) {
		this.channelName = channelName
	}
	async init(client: Client, getAccessToken: () => string) {
		this.getAccessToken = getAccessToken
		this.client = client
		this.moduleApi = await import(`../modules.js`)
	}
	getModule<T>(module: new (channelName: string) => T): T {
		return this.moduleApi.getModule(this.channelName, module)
	}
	getGlobalModule<T>(module: new () => T): T {
		return this.moduleApi.getGlobalModule(module)
	}
	onTwitchMessage({}: CommandParams) {}
	onTwitchCheer({}: CommandParams) {}
}
