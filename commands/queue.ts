import Queue from '../modules/Queue.js'

export function list({ reply, getChannelModule }: CommandParams) {
	const queueModule = getChannelModule(Queue)
	reply(queueModule.list())
}

export async function add({ reply, user, getChannelModule }: CommandParams) {
	const queueModule = getChannelModule(Queue)
	const locked = await queueModule.locked.get()
	if (locked) {
		return reply('List ist locked!')
	}
	queueModule.add(user['display-name'])
	reply(`@${user.username}, you have been added to the queue!`)
}

export function leave({ reply, user, getChannelModule }: CommandParams) {
	const queueModule = getChannelModule(Queue)
	queueModule.remove(user['display-name'])
	reply(`@${user.username}, du hast die Liste verlassen!`)
}

export function clear({ reply, getChannelModule }: CommandParams) {
	const queueModule = getChannelModule(Queue)
	queueModule.clear()
	reply('Die Liste wurde geleert')
}

export function lock({ reply, getChannelModule }: CommandParams) {
	const queueModule = getChannelModule(Queue)
	queueModule.lock()
	reply('Die Liste ist jetzt locked!')
}

export function unlock({ reply, getChannelModule }: CommandParams) {
	const queueModule = getChannelModule(Queue)
	queueModule.unlock()
	reply('Die Liste ist jetzt unlocked!')
}

export function pick({ reply, getChannelModule }: CommandParams) {
	const queueModule = getChannelModule(Queue)
	const user = queueModule.pick()
	reply(`@${user} ist dran!`)
}

export function randomPick({ reply, getChannelModule }: CommandParams) {
	const queueModule = getChannelModule(Queue)
	const user = queueModule.randomPick()
	reply(`@${user} ist dran!`)
}
