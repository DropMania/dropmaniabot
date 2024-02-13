import { Router } from 'express'
import { getModule } from '../../modules.js'
import vine from '@vinejs/vine'
import auth from '../middlewares/auth.js'

const queueRouter = Router()

queueRouter.use('/:channel', auth, async (req, res, next) => {
	const { channel } = req.params
	if (channel) {
		const commandHandler = getModule(channel, 'Queue')
		if (!commandHandler) return res.status(404).json({ error: 'Channel not found' })
	}
	next()
})

queueRouter.get('/:channel', async ({ params }, res) => {
	const { channel } = params
	const queue = getModule(channel, 'Queue')
	const queueData = await queue.get()
	res.json(queueData)
})

queueRouter.post('/:channel', async ({ params, body }, res) => {
	const { channel } = params
	const queue = getModule(channel, 'Queue')
	const schema = vine.object({
		userName: vine.string().maxLength(100),
	})
	try {
		const { userName } = await vine.validate({ schema, data: body })
		await queue.add(userName)
		res.json({ success: true })
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
})

queueRouter.delete('/:channel/:userName', async ({ params }, res) => {
	const { channel, userName } = params
	const queue = getModule(channel, 'Queue')
	await queue.remove(userName)
	res.json({ success: true })
})

queueRouter.delete('/:channel', async ({ params }, res) => {
	const { channel } = params
	const queue = getModule(channel, 'Queue')
	await queue.clear()
	res.json({ success: true })
})

queueRouter.put('/:channel/lock', async ({ params }, res) => {
	const { channel } = params
	const queue = getModule(channel, 'Queue')
	await queue.lock()
	res.json({ success: true })
})

queueRouter.put('/:channel/unlock', async ({ params }, res) => {
	const { channel } = params
	const queue = getModule(channel, 'Queue')
	await queue.unlock()
	res.json({ success: true })
})
export default queueRouter
