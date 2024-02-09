export type _7TVemote = {
	id: string
	name: string
	flags: number
	timestamp: number
	actor_id: string
	data: {
		id: string
		name: string
		flags: number
		lifecycle: number
		state: Array<string>
		listed: boolean
		animated: boolean
		owner: {
			id: string
			username: string
			display_name: string
			avatar_url?: string
			style: {
				color?: number
			}
			roles?: Array<string>
		}
		host: {
			url: string
			files: Array<{
				name: string
				static_name: string
				width: number
				height: number
				frame_count: number
				size: number
				format: string
			}>
		}
		tags?: Array<string>
	}
}

export type QuizResponse = {
	category: string
	id: string
	correctAnswer: string
	incorrectAnswers: Array<string>
	question: {
		text: string
	}
	tags: Array<string>
	type: string
	difficulty: string
	regions: Array<any>
	isNiche: boolean
}
