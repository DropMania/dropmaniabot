import tmi from 'tmi.js'
import axios from 'axios'
import commands from './commands.js'
import { callAllModules, getModule, getGlobalModule, callGlobalModules, callChannelModules } from './modules.js'
import './utils.js'
import channels from './channels.js'
import CommandHandler from './modules/CommandHandler.js'
const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: 'dropmaniabot',
		password: async () => {
			const {
				data: { access_token: token },
			} = await axios.post('https://id.twitch.tv/oauth2/token', {
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: process.env.REFRESH_TOKEN,
			})
			return `oauth:${token}`
		},
	},
	connection: {
		port: 80,
	},
	channels: channels.map((channel) => channel.channel),
})
client.connect().catch(console.error)
client.on('connected', () => {
	callAllModules('init', client)
})
client.on('message', async (channel, user, message, self) => {
	if (self) return
	const commandParams = getCommandParams(channel, user, message)
	callGlobalModules('onTwitchMessage', commandParams)
	callChannelModules('onTwitchMessage', channel, commandParams)
	if (message[0] === '!') {
		const [command, ...args] = message.slice(1).split(' ')
		const commandHandlerModule = getModule(channel, CommandHandler)
		const customCommands = await commandHandlerModule.getCustomCommands()
		const customCommand = customCommands.find((c) => c.name === command.toLowerCase())
		const disabled = await commandHandlerModule.isCommandDisabled(command.toLowerCase())
		if (disabled) return
		if (customCommand) {
			commandHandlerModule.runCommand(customCommand.reply_text)
			return
		}
		commandParams.message = args.join(' ')
		const commandFunction = commands[command.toLowerCase()]
		if (!commandFunction) return
		runCommand(commandFunction, commandParams)
	}
})

client.on('cheer', (channel, user, message) => {
	const commandParams = getCommandParams(channel, user, message)
	callGlobalModules('onTwitchCheer', commandParams)
	callChannelModules('onTwitchCheer', channel, commandParams)
})

async function runCommand(commandFunction: CommandFunction, commandParams: CommandParams) {
	const [fun, middlewares] = commandFunction
	let shouldRunCommand = true

	for (const middleware of middlewares) {
		const middlewareResult = await middleware(commandParams)
		if (!middlewareResult) {
			shouldRunCommand = false
			break
		}
	}

	if (shouldRunCommand) {
		if (typeof fun === 'string') {
			const [file, func] = fun.split('.')
			const importedFile = await import(`./commands/${file}.js`)
			importedFile[func](commandParams)
		} else {
			fun(commandParams)
		}
	}
}

function getCommandParams(channel: string, user: tmi.ChatUserstate, message: string): CommandParams {
	const reply = async (message: string) => {
		await client.say(channel, message)
	}
	const getChannelModule = <T>(moduleClass: new (channelName: string) => T) => {
		const module = getModule(channel, moduleClass)
		return module
	}
	const commandParams: CommandParams = {
		client,
		channel,
		user,
		message,
		reply,
		getChannelModule,
		getGlobalModule,
	}
	return commandParams
}
