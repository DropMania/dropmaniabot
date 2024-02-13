export async function quiz({ reply, getModule }: CommandParams) {
	const quizModule = getModule('Quiz')
	const text = await quizModule.startQuiz()
	reply(text)
}
export function a({ reply, user, getModule }: CommandParams) {
	const quizModule = getModule('Quiz')
	const check = quizModule.checkAnswer('a')
	reply(`${user['display-name']} ${check}`)
}
export function b({ reply, user, getModule }: CommandParams) {
	const quizModule = getModule('Quiz')
	const check = quizModule.checkAnswer('b')
	reply(`${user['display-name']} ${check}`)
}
export function c({ reply, user, getModule }: CommandParams) {
	const quizModule = getModule('Quiz')
	const check = quizModule.checkAnswer('c')
	reply(`${user['display-name']} ${check}`)
}
export function d({ reply, user, getModule }: CommandParams) {
	const quizModule = getModule('Quiz')
	const check = quizModule.checkAnswer('d')
	reply(`${user['display-name']} ${check}`)
}
