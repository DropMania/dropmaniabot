import tmi from 'tmi.js'
import axios from 'axios'
import channels from './channels.js'
import { callAllModules } from './modules.js'

let access_token = ''
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
			access_token = token
			return `oauth:${token}`
		},
	},
	connection: {
		port: 80,
	},
	channels: channels.map((channel) => channel.channel),
})

export function getAccessToken() {
	return access_token
}

client.connect().catch(console.error)
client.on('connected', () => {
	callAllModules('init', client, getAccessToken)
})

export default client
