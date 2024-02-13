import { ChatUserstate, Client } from 'tmi.js'
export {}

declare global {
	type Middleware = (params: CommandParams) => Promise<boolean | undefined>
	type Command = string | ((params: CommandParams) => void)
	type CommandFunction = [Command, Middleware[]]
	type ICommand = {
		[key: string]: CommandFunction
	}
	type CooldownTracker = {
		[channel: string]: {
			[command: string]: number
		}
	}
	type Modules =
		| 'Chatters'
		| 'Spotify'
		| 'Emotes'
		| 'TwitchApi'
		| 'CommandHandler'
		| 'CheerThx'
		| 'Lobs'
		| 'Queue'
		| 'Quiz'

	type ModuleType<T> = T extends 'Chatters'
		? import('../modules/Chatters.js').default
		: T extends 'Spotify'
		? import('../modules/Spotify.js').default
		: T extends 'Emotes'
		? import('../modules/Emotes.js').default
		: T extends 'TwitchApi'
		? import('../modules/TwitchApi.js').default
		: T extends 'CommandHandler'
		? import('../modules/CommandHandler.js').default
		: T extends 'CheerThx'
		? import('../modules/CheerThx.js').default
		: T extends 'Lobs'
		? import('../modules/Lobs.js').default
		: T extends 'Queue'
		? import('../modules/Queue.js').default
		: T extends 'Quiz'
		? import('../modules/Quiz.js').default
		: never

	type CommandParams = {
		client: Client
		reply: (message: string) => Promise<void>
		channel: string
		user: ChatUserstate
		message: string
		getModule: <T extends Modules>(moduleName: T) => ModuleType<T>
		getGlobalModule: <T extends Modules>(moduleName: T) => ModuleType<T>
	}
}
