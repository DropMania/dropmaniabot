import axios from 'axios'
import { tr } from '../utils.js'
import UwUifier from 'uwuifier'
import Chatters from '../modules/Chatters.js'
const uwuifier = new UwUifier()

export async function witz({ reply }: CommandParams) {
	let url = 'https://witzapi.de/api/joke'
	let data = await axios.get(url)
	reply(`${data.data[0].text}`)
}

export function liebe({ reply, user, message }: CommandParams) {
	reply(`${Math.floor(Math.random() * (130 - 80) + 80)}% Liebe zwischen ${user['display-name']} und ${message}`)
}

export function ehre({ reply, user }: CommandParams) {
	reply(`${user.username} verfügt über ${Math.floor(Math.random() * 110)}% Ehre!`)
}

export async function chuck({ reply }: CommandParams) {
	let url = 'https://api.chucknorris.io/jokes/random'
	let data = await axios.get(url)
	console.log(data.data)
	let text = await tr(data.data.value, 'de')
	reply(`${text}`)
}

export async function ratschlag({ reply }: CommandParams) {
	let response = await axios.get(`https://api.adviceslip.com/advice`)
	let advi = response.data.slip.advice
	let text = await tr(advi, 'de')
	reply(text)
}

export async function fakt({ reply }: CommandParams) {
	try {
		let response = await axios({
			url: `https://api.api-ninjas.com/v1/facts?limit=1`,
			method: 'get',
			headers: {
				'X-Api-Key': process.env.X_API_KEY,
			},
		})
		let fact = response.data[0].fact
		let text = await tr(fact, 'de')
		reply(text)
	} catch (e) {
		console.log(e)
	}
}

export async function pickupline({ reply }: CommandParams) {
	let url = `https://vinuxd.vercel.app/api/pickup`
	let data = await axios.get(url)
	let text = await tr(data.data.pickup, 'de')
	reply(text)
}

export async function uwu({ reply, message }: CommandParams) {
	reply(uwuifier.uwuifySentence(message))
}

export async function rapuh({ reply, getChannelModule }: CommandParams) {
	const chatterModule = getChannelModule(Chatters)
	const rndChatter = await chatterModule.getRandomChatter()
	reply(`${rndChatter.displayName} Rapuh!`)
}

export async function kisscam({ reply, getChannelModule }: CommandParams) {
	const chatterModule = getChannelModule(Chatters)
	const chatterStore = await chatterModule.getChatters()
	let chatters = Object.values(chatterStore).sort(() => Math.random() - 0.5)
	if (chatters.length === 0) return
	reply(`Kisscam! ${chatters[0].displayName} und ${chatters[1].displayName} , ihr dürft euch küssen!`)
}
