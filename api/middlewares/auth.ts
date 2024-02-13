import jwt from 'jsonwebtoken'
import { Twitch } from '../../types/responses.js'

export default async function auth(req, res, next) {
	const { channel } = req.params
	if (!req.headers.authorization) return res.status(401).json({ error: 'No Authorization header provided' })
	const [type, token] = req.headers.authorization.split(' ')
	if (channel && type === 'Bearer' && token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET) as Twitch.User
			if (decoded.login !== channel) return res.status(403).json({ error: 'Invalid channel' })
			return next()
		} catch (e) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
	}
	return res.status(401).json({ error: 'Unauthorized' })
}
