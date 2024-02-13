import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { config } from 'dotenv'
import api from './router.js'
config()
const app = express()
app.use(helmet())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())

app.get('/', (req, res) => {
	res.send('Hello World!')
})
app.use('/api', api)
app.use(
	(error: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
		console.error(error)
		res.status(500).json({ error: error })
	}
)
app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`)
})
