import { DropMania, Moderator } from './middlewares.js'
function cmd(cmd: Command, middlewares: Middleware[] = []): CommandFunction {
	return [cmd, middlewares]
}
export default {
	enable: cmd('commands.enable', [Moderator]),
	disable: cmd('commands.disable', [Moderator]),
	addcom: cmd('commands.addcom', [Moderator]),
	delcom: cmd('commands.delcom', [Moderator]),
	editcom: cmd('commands.editcom', [Moderator]),

	hello: cmd('misc.hello'),

	wecker: cmd('useful.wecker', [Moderator]),
	birthday: cmd('useful.birthday'),
	tr: cmd('useful.tr'),

	list: cmd('queue.list'),
	join: cmd('queue.add'),
	leave: cmd('queue.leave'),
	clear: cmd('queue.clear', [Moderator]),
	lock: cmd('queue.lock', [Moderator]),
	unlock: cmd('queue.unlock', [Moderator]),
	pick: cmd('queue.pick', [Moderator]),
	randomPick: cmd('queue.randomPick', [Moderator]),

	rapuh: cmd('fun.rapuh'),
	kisscam: cmd('fun.kisscam'),
	witz: cmd('fun.witz'),
	liebe: cmd('fun.liebe'),
	ehre: cmd('fun.ehre'),
	chuck: cmd('fun.chuck'),
	ratschlag: cmd('fun.ratschlag'),
	fakt: cmd('fun.fakt'),
	pickupline: cmd('fun.pickupline'),
	uwu: cmd('fun.uwu'),

	quiz: cmd('quiz.quiz'),
	a: cmd('quiz.a'),
	b: cmd('quiz.b'),
	c: cmd('quiz.c'),
	d: cmd('quiz.d'),

	song: cmd('spotify.song'),
	play: cmd('spotify.play', [DropMania]),
	pause: cmd('spotify.pause', [DropMania]),
	next: cmd('spotify.next', [DropMania]),

	deactivatelobs: cmd('lobs.deactivatelobs', [Moderator]),
	activatelobs: cmd('lobs.activatelobs', [Moderator]),
} as ICommand
