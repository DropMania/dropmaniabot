import CommandHandler from '../modules/CommandHandler.js'

export async function enable({ reply, message, getModule }: CommandParams) {
	const commandHandlerModule = getModule(CommandHandler)
	const command = message.split(' ')[0]
	if (!command) return reply('Please specify a command to enable!')
	const exists = await commandHandlerModule.commandExists(command.toLowerCase())
	if (!exists) return reply(`Command !${command} does not exist!`)
	await commandHandlerModule.enableCommand(command.toLowerCase())
	reply(`Command !${command} wurde aktiviert!`)
}

export async function disable({ reply, message, getModule }: CommandParams) {
	const commandHandlerModule = getModule(CommandHandler)
	const command = message.split(' ')[0]
	if (!command) return reply('Please specify a command to disable!')
	const exists = await commandHandlerModule.commandExists(command.toLowerCase())
	if (!exists) return reply(`Command !${command} does not exist!`)
	await commandHandlerModule.disableCommand(command.toLowerCase())
	reply(`Command !${command} wurde deaktiviert!`)
}

export async function addcom({ reply, getModule, message }: CommandParams) {
	const commandHandlerModule = getModule(CommandHandler)
	const [command, ...reply_text] = message.split(' ')
	if (!command) return reply('Please specify a command to add!')
	if (!reply_text.length) return reply('Please specify a reply text!')
	const exists = await commandHandlerModule.commandExists(command.toLowerCase())
	if (exists) return reply(`Command !${command} already exists!`)
	await commandHandlerModule.addCustomCommand(command.toLowerCase(), reply_text.join(' '))
	reply(`Command !${command} wurde hinzugefügt!`)
}

export async function delcom({ reply, getModule, message }: CommandParams) {
	const commandHandlerModule = getModule(CommandHandler)
	const command = message.split(' ')[0]
	if (!command) return reply('Please specify a command to delete!')
	const exists = await commandHandlerModule.commandExists(command.toLowerCase())
	if (!exists) return reply(`Command !${command} does not exist!`)
	await commandHandlerModule.removeCustomCommand(command.toLowerCase())
	reply(`Command !${command} wurde gelöscht!`)
}

export async function editcom({ reply, getModule, message }: CommandParams) {
	const commandHandlerModule = getModule(CommandHandler)
	const [command, ...reply_text] = message.split(' ')
	if (!command) return reply('Please specify a command to edit!')
	if (!reply_text.length) return reply('Please specify a reply text!')
	const exists = await commandHandlerModule.commandExists(command.toLowerCase())
	if (!exists) return reply(`Command !${command} does not exist!`)
	await commandHandlerModule.editCustomCommand(command.toLowerCase(), reply_text.join(' '))
	reply(`Command !${command} wurde bearbeitet!`)
}

export async function cooldown({ reply, getModule, message }: CommandParams) {
	const commandHandlerModule = getModule(CommandHandler)
	const [command, cooldown] = message.split(' ')
	if (!command) return reply('Please specify a command!')
	if (!cooldown) return reply('Please specify a cooldown!')
	const exists = await commandHandlerModule.commandExists(command.toLowerCase())
	if (!exists) return reply(`Command !${command} does not exist!`)
	await commandHandlerModule.setCooldown(command.toLowerCase(), Number(cooldown))
	reply(`Cooldown für !${command} wurde auf ${cooldown} Sekunden gesetzt!`)
}
