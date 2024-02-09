import Quiz from '../modules/Quiz.js'

export async function quiz({ reply, getChannelModule }: CommandParams) {
	const quizModule = getChannelModule(Quiz)
	const text = await quizModule.startQuiz()
	reply(text)
}

export function a({ reply, user, getChannelModule }: CommandParams) {
	const quizModule = getChannelModule(Quiz)
	const check = quizModule.checkAnswer('a')
	reply(`${user['display-name']} ${check}`)
}
export function b({ reply, user, getChannelModule }: CommandParams) {
	const quizModule = getChannelModule(Quiz)
	const check = quizModule.checkAnswer('b')
	reply(`${user['display-name']} ${check}`)
}
export function c({ reply, user, getChannelModule }: CommandParams) {
	const quizModule = getChannelModule(Quiz)
	const check = quizModule.checkAnswer('c')
	reply(`${user['display-name']} ${check}`)
}
export function d({ reply, user, getChannelModule }: CommandParams) {
	const quizModule = getChannelModule(Quiz)
	const check = quizModule.checkAnswer('d')
	reply(`${user['display-name']} ${check}`)
}
