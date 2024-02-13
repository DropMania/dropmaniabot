import { Router } from 'express'
import commands from './routes/commands.js'
import queue from './routes/queue.js'
import auth from './routes/auth.js'

const api = Router()

api.use('/auth', auth)
api.use('/commands', commands)
api.use('/queue', queue)

export default api
