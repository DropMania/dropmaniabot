import CommandHandler from '../modules/CommandHandler.js'
import commands from '../commands.js'

export async function enable({ reply, message, getChannelModule }: CommandParams) {
	const commandHandlerModule = getChannelModule(CommandHandler)
	const command = message.split(' ')[0]
	if (!command) return reply('Please specify a command to enable!')
	await commandHandlerModule.enableCommand(command.toLowerCase())
	reply(`Command !${command} wurde aktiviert!`)
}

export async function disable({ reply, message, getChannelModule }: CommandParams) {
	const commandHandlerModule = getChannelModule(CommandHandler)
	const command = message.split(' ')[0]
	if (!command) return reply('Please specify a command to disable!')
	await commandHandlerModule.disableCommand(command.toLowerCase())
	reply(`Command !${command} wurde deaktiviert!`)
}

export async function addcom({ reply, getChannelModule, message }: CommandParams) {
	const commandHandlerModule = getChannelModule(CommandHandler)
	const [command, ...reply_text] = message.split(' ')
	if (!command) return reply('Please specify a command to add!')
	if (!reply_text.length) return reply('Please specify a reply text!')
	if (command in commands) return reply(`Command !${command} already exists!`)
	const exists = await commandHandlerModule.customCommandExists(command.toLowerCase())
	if (exists) return reply(`Command !${command} already exists!`)
	await commandHandlerModule.addCustomCommand(command.toLowerCase(), reply_text.join(' '))
	reply(`Command !${command} wurde hinzugefügt!`)
}

export async function delcom({ reply, getChannelModule, message }: CommandParams) {
	const commandHandlerModule = getChannelModule(CommandHandler)
	const command = message.split(' ')[0]
	if (!command) return reply('Please specify a command to delete!')
	const exists = await commandHandlerModule.customCommandExists(command.toLowerCase())
	if (!exists) return reply(`Command !${command} does not exist!`)
	await commandHandlerModule.removeCustomCommand(command.toLowerCase())
	reply(`Command !${command} wurde gelöscht!`)
}

export async function editcom({ reply, getChannelModule, message }: CommandParams) {
	const commandHandlerModule = getChannelModule(CommandHandler)
	const [command, ...reply_text] = message.split(' ')
	if (!command) return reply('Please specify a command to edit!')
	if (!reply_text.length) return reply('Please specify a reply text!')
	const exists = await commandHandlerModule.customCommandExists(command.toLowerCase())
	if (!exists) return reply(`Command !${command} does not exist!`)
	await commandHandlerModule.editCustomCommand(command.toLowerCase(), reply_text.join(' '))
	reply(`Command !${command} wurde bearbeitet!`)
}
