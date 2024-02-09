import Lobs from '../modules/Lobs.js'

export function deactivatelobs({ reply, getChannelModule }: CommandParams) {
	const lobsModule = getChannelModule(Lobs)
	lobsModule.deactivate()
	reply(`Lobs wurden deaktiviert!`)
}

export function activatelobs({ reply, getChannelModule }: CommandParams) {
	const lobsModule = getChannelModule(Lobs)
	lobsModule.activate()
	reply(`Lobs wurden aktiviert!`)
}
