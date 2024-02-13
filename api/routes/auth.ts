import { Router } from 'express'
import axios from 'axios'
import { getModule } from '../../modules.js'
import { Twitch } from '../../types/responses.js'
import { db } from '../../utils.js'
import jwt from 'jsonwebtoken'
import { joinChannel } from '../../twitch.js'
const authRouter = Router()

authRouter.get('/twitch', async (req, res) => {
	const scopes = [
		'channel:read:polls',
		'channel:manage:polls',
		'channel:read:predictions',
		'channel:manage:predictions',
		'channel:read:subscriptions',
		'channel:manage:redemptions',
		'channel:read:redemptions',
		'moderator:read:followers',
		'moderator:manage:shoutouts',
	]
	const params = new URLSearchParams({
		client_id: process.env.CLIENT_ID,
		redirect_uri: process.env.REDIRECT_URI,
		response_type: 'code',
		scope: scopes.join(' '),
	})
	res.redirect(`https://id.twitch.tv/oauth2/authorize?${params}`)
})

authRouter.get('/twitch/callback', async (req, res) => {
	const { code } = req.query
	if (!code) return res.status(400).json({ error: 'No code provided' })
	const {
		data: { access_token, refresh_token },
	} = await axios.post('https://id.twitch.tv/oauth2/token', {
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		code,
		grant_type: 'authorization_code',
		redirect_uri: process.env.REDIRECT_URI,
	})
	const user = await getUser(access_token)
	if (!user) return res.status(400).json({ error: 'Invalid token' })
	const isNew = await insertChannel(user.login, refresh_token)
	if (!isNew) {
		joinChannel({
			channel: user.login,
			twitch_refresh: refresh_token,
			'7tv_emoteset': '',
			spotify_refresh: '',
		})
	}
	const twitchApi = getModule(user.login, 'TwitchApi')
	twitchApi.setUserAccessToken(access_token)
	const data = {
		id: user.id,
		login: user.login,
		display_name: user.display_name,
		profile_image_url: user.profile_image_url,
	} as Twitch.User
	const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '7d' })
	res.json({ jwt: token })
})

async function getUser(token: string) {
	const { data } = await axios.get<Twitch.Users>('https://api.twitch.tv/helix/users', {
		headers: {
			Authorization: `Bearer ${token}`,
			'Client-Id': process.env.CLIENT_ID,
		},
	})
	return data.data[0]
}
async function insertChannel(login: string, refresh_token: string) {
	const exists = await db.selectFrom('channels').selectAll().where('channel', '=', login).execute()
	if (exists.length > 0) {
		return false
	} else {
		await db.insertInto('channels').values({ channel: login, twitch_refresh: refresh_token }).execute()
		return true
	}
}
export default authRouter
