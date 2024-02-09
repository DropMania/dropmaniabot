import Module from './_Module.js'

export default class CheerThx extends Module {
	constructor(channelName: string) {
		super(channelName)
	}
	onTwitchCheer({ user, reply }: CommandParams): void {
		if (Number(user.bits) < 10) return
		reply(`Danke für die ${user.bits} bits, @${user.username}!`)
	}
}
