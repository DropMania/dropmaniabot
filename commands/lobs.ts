import Lobs from '../modules/Lobs.js'

export function deactivatelobs({ reply, getModule }: CommandParams) {
	const lobsModule = getModule(Lobs)
	lobsModule.deactivate()
	reply(`Lobs wurden deaktiviert!`)
}

export function activatelobs({ reply, getModule }: CommandParams) {
	const lobsModule = getModule(Lobs)
	lobsModule.activate()
	reply(`Lobs wurden aktiviert!`)
}
