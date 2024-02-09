export function hello({ reply, user }: CommandParams) {
	reply(`Hello, @${user.username}!`)
}
