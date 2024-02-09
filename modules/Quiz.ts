import Module from './_Module.js'
import { tr } from '../utils.js'
import axios from 'axios'
import type { QuizResponse } from '../types/responses.js'
export default class Quiz extends Module {
	quizAnswer: string = ''
	constructor(channelName: string) {
		super(channelName)
	}
	async startQuiz() {
		let response = await axios.get(`https://the-trivia-api.com/v2/questions?limit=1`)
		let quiz = response.data[0] as QuizResponse
		let question = await tr(quiz.question.text, 'de')

		let order = ['a', 'b', 'c', 'd']
		let answers = [
			{ correct: true, text: quiz.correctAnswer, l: order.shift() },
			...quiz.incorrectAnswers.map((a) => ({ correct: false, text: a, l: order.shift() })),
		].sort(() => Math.random() - 0.5)
		this.quizAnswer = answers.find((a) => a.correct).l
		return `${question} | ${answers.map((a) => a.l + ': ' + a.text).join(' | ')}`
	}
	checkAnswer(answer: string) {
		if (this.quizAnswer === '') return 'Es läuft gerade kein Quiz!'
		const correct = answer.toLowerCase() === this.quizAnswer
		if (correct) {
			this.quizAnswer = ''
			return 'Hat recht! 🎉'
		}
		return 'liegt leider falsch 😔'
	}
}
