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

export type TwitchStreamRes = {
	data: Array<{
		id: string
		user_id: string
		user_login: string
		user_name: string
		game_id: string
		game_name: string
		type: string
		title: string
		tags: Array<string>
		viewer_count: number
		started_at: string
		language: string
		thumbnail_url: string
		tag_ids: Array<any>
		is_mature: boolean
	}>
	pagination: {
		cursor: string
	}
}

export type TwitchChannelRes = {
	data: Array<{
		broadcaster_id: string
		broadcaster_login: string
		broadcaster_name: string
		broadcaster_language: string
		game_id: string
		game_name: string
		title: string
		delay: number
		tags: Array<string>
		content_classification_labels: Array<string>
		is_branded_content: boolean
	}>
}
export type TwitchUserData = {
	id: string
	login: string
	display_name: string
	type: string
	broadcaster_type: string
	description: string
	profile_image_url: string
	offline_image_url: string
	view_count: number
	email: string
	created_at: string
}
export type TwitchUserRes = {
	data: Array<TwitchUserData>
}
export type TwitchClipRes = {
	data: Array<{
		id: string
		url: string
		embed_url: string
		broadcaster_id: string
		broadcaster_name: string
		creator_id: string
		creator_name: string
		video_id: string
		game_id: string
		language: string
		title: string
		view_count: number
		created_at: string
		thumbnail_url: string
		duration: number
		vod_offset: number
		is_featured: boolean
	}>
	pagination: {
		cursor: string
	}
}
export type TwitchCreateClipRes = {
	data: Array<{
		id: string
		edit_url: string
	}>
}

export type TwitchEmoteRes = {
	data: Array<{
		id: string
		name: string
		images: {
			url_1x: string
			url_2x: string
			url_4x: string
		}
		tier: string
		emote_type: string
		emote_set_id: string
		format: Array<string>
		scale: Array<string>
		theme_mode: Array<string>
	}>
	template: string
}
