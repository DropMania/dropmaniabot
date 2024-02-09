import { ChatUserstate, Client } from 'tmi.js'

export {}

declare global {
	type CommandParams = {
		client: Client
		reply: (message: string) => Promise<void>
		channel: string
		user: ChatUserstate
		message: string
		getChannelModule: <T>(module: new (channelName: string) => T) => T
		getGlobalModule: <T>(module: new (channelName: string) => T) => T
	}
	type Middleware = (params: CommandParams) => Promise<boolean | undefined>
	type Command = string | ((params: CommandParams) => void)
	type CommandFunction = [Command, Middleware[]]
	type ICommand = {
		[key: string]: CommandFunction
	}
}
