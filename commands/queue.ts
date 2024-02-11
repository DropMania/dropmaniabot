import Queue from '../modules/Queue.js'

export async function list({ reply, getModule }: CommandParams) {
	const queueModule = getModule(Queue)
	reply(await queueModule.list())
}

export async function add({ reply, user, getModule }: CommandParams) {
	const queueModule = getModule(Queue)
	const locked = await queueModule.locked.get()
	if (locked) {
		return reply('List ist locked!')
	}
	await queueModule.add(user['display-name'])
	reply(`@${user.username}, you have been added to the queue!`)
}

export async function leave({ reply, user, getModule }: CommandParams) {
	const queueModule = getModule(Queue)
	await queueModule.remove(user['display-name'])
	reply(`@${user.username}, du hast die Liste verlassen!`)
}

export async function clear({ reply, getModule }: CommandParams) {
	const queueModule = getModule(Queue)
	await queueModule.clear()
	reply('Die Liste wurde geleert')
}

export async function lock({ reply, getModule }: CommandParams) {
	const queueModule = getModule(Queue)
	await queueModule.lock()
	reply('Die Liste ist jetzt locked!')
}

export async function unlock({ reply, getModule }: CommandParams) {
	const queueModule = getModule(Queue)
	await queueModule.unlock()
	reply('Die Liste ist jetzt unlocked!')
}

export async function pick({ reply, getModule }: CommandParams) {
	const queueModule = getModule(Queue)
	const user = await queueModule.pick()
	reply(`@${user} ist dran!`)
}

export async function randomPick({ reply, getModule }: CommandParams) {
	const queueModule = getModule(Queue)
	const user = await queueModule.randomPick()
	reply(`@${user} ist dran!`)
}
