import { Router } from 'express'
import { getModule } from '../../modules.js'
import vine from '@vinejs/vine'
import auth from '../middlewares/auth.js'

const commandRouter = Router()

commandRouter.use('/:channel/:command?', auth, async (req, res, next) => {
	const { channel, command } = req.params
	const commandHandler = getModule(channel, 'CommandHandler')
	if (!commandHandler) return res.status(404).json({ error: 'Channel not found' })
	if (command) {
		const exists = await commandHandler.commandExists(command)
		if (!exists) return res.status(404).json({ error: 'Command not found' })
	}
	next()
})

commandRouter.get('/:channel', async ({ params }, res) => {
	const { channel } = params
	const commandHandler = getModule(channel, 'CommandHandler')
	const commands = await commandHandler.getAllCommands()
	res.json(commands)
})

commandRouter.post('/:channel', async ({ params, body }, res) => {
	const { channel } = params
	const commandHandler = getModule(channel, 'CommandHandler')
	const schema = vine.object({
		command: vine.string().maxLength(16),
		replyText: vine.string().maxLength(100),
	})
	try {
		const { command, replyText } = await vine.validate({ schema, data: body })
		const exists = await commandHandler.commandExists(command)
		if (exists) return res.status(400).json({ error: `Command ${command} already exists` })
		await commandHandler.addCustomCommand(command, replyText)
		res.json({ success: true })
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
})

commandRouter.delete('/:channel/:command', async ({ params }, res) => {
	const { channel, command } = params
	const commandHandler = getModule(channel, 'CommandHandler')
	await commandHandler.removeCustomCommand(command)
	res.json({ success: true })
})

commandRouter.put('/:channel/:command', async (req, res) => {
	const { channel, command } = req.params
	const commandHandler = getModule(channel, 'CommandHandler')
	const schema = vine.object({
		replyText: vine.string().maxLength(100),
	})
	try {
		const { replyText } = await vine.validate({ schema, data: req.body })
		await commandHandler.editCustomCommand(command, replyText)
		res.json({ success: true })
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
})

commandRouter.put('/:channel/:command/enable', async ({ params }, res) => {
	const { channel, command } = params
	const commandHandler = getModule(channel, 'CommandHandler')
	await commandHandler.enableCommand(command)
	res.json({ success: true })
})

commandRouter.put('/:channel/:command/disable', async ({ params }, res) => {
	const { channel, command } = params
	const commandHandler = getModule(channel, 'CommandHandler')
	await commandHandler.disableCommand(command)
	res.json({ success: true })
})

commandRouter.put('/:channel/:command/cooldown', async (req, res) => {
	const { channel, command } = req.params
	const commandHandler = getModule(channel, 'CommandHandler')
	const schema = vine.object({
		cooldown: vine.number().min(0).max(300),
	})
	try {
		const { cooldown } = await vine.validate({ schema, data: req.body })
		await commandHandler.setCooldown(command, cooldown)
		res.json({ success: true })
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
})

export default commandRouter
