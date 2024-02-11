import tmi from 'tmi.js'
import client from './twitch.js'
import commands from './commands.js'
import { getModule, getGlobalModule, callGlobalModules, callChannelModules } from './modules.js'
import CommandHandler from './modules/CommandHandler.js'
const coolDownTracker: CooldownTracker = {}
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
		const cmdConfig = await commandHandlerModule.getCommandConfig(command.toLowerCase())
		if (cmdConfig.disabled) return
		const lastUsed = coolDownTracker[channel]?.[command] || 0
		if (lastUsed && Date.now() - lastUsed < Number(cmdConfig.cooldown) * 1000) return
		coolDownTracker[channel] = coolDownTracker[channel] || {}
		coolDownTracker[channel][command] = Date.now()
		commandParams.message = args.join(' ')
		if (customCommand) {
			await commandHandlerModule.runCustomCommand(customCommand.reply_text, commandParams)
			return
		}
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
		getModule: getChannelModule,
		getGlobalModule,
	}
	return commandParams
}
