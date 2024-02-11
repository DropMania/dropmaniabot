import TwitchApi from '../modules/TwitchApi.js'
import { sleep, tr as translate } from '../utils.js'

export async function birthday({ reply, message, user }: CommandParams) {
	const args = message.split(' ')
	let [day, mon] = args[0].split('.').map(Number)
	if (day && mon) {
		let now = new Date()
		let bday = new Date(now.getFullYear(), mon - 1, day)
		let diff = Math.floor((bday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
		if (diff < 0) {
			bday.setFullYear(bday.getFullYear() + 1)
			diff = Math.floor((bday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
		}
		reply(`@${user.username}, noch ${diff} Tage bis zum Geburtstag! FeelsBirthdayMan`)
	} else {
		reply(`@${user.username}, bitte in diesem Format: DD.MM`)
	}
}

export async function wecker({ reply, message }: CommandParams) {
	const args = message.split(' ')
	if (args.length !== 1) return reply('Bitte gib die Minuten an, nach denen der Wecker klingeln soll!')
	const minutes = parseInt(args[0])
	if (isNaN(minutes)) return reply('Bitte gib eine Zahl an!')
	reply(`Wecker für ${args[0]} Minuten gestellt!`)
	await sleep(minutes * 1000 * 60)
	reply(`HEEEEY DER ${minutes} MINUTEN WECKER IST ABGELAUFEN! INSANECAT INSANECAT INSANECAT`)
}

export async function tr({ reply, message }: CommandParams) {
	let text = await translate(message, 'de')
	reply(text)
}

export async function clipit({ reply, getChannelModule }: CommandParams) {
	const twitchApiModule = getChannelModule(TwitchApi)
	const clip = await twitchApiModule.createClip()
	if (!clip) return reply('Clip konnte nicht erstellt werden!')
	const interval = setInterval(async () => {
		const clipData = await twitchApiModule.getClip(clip.id)
		if (clipData) {
			reply(`Clip erstellt: ${clipData.url}`)
			clearInterval(interval)
		}
	}, 3000)
}
