export async function Moderator({ user }: CommandParams) {
	if (user.badges?.broadcaster || user.badges?.moderator) {
		return true
	}
}
export async function Subscriber({ user }: CommandParams) {
	if (user.badges?.subscriber) {
		return true
	}
}
export async function Follower({ user }: CommandParams) {
	if (user.badges?.follower) {
		return true
	}
}
export async function Vip({ user }: CommandParams) {
	if (user.badges?.vip) {
		return true
	}
}

export async function DropMania({ user }: CommandParams) {
	if (user.username === 'dropmaniagaming') {
		return true
	}
}
