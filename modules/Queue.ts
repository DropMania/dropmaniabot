import { redisSync } from '../utils.js'
import { RedisPrimitive } from '../lib/redisSync.js'
import Module from './_Module.js'
export default class Queue extends Module {
	queue: string[]
	public locked: RedisPrimitive<boolean>
	constructor(channelName: string) {
		super(channelName)
		this.queue = []
		this.locked = redisSync.createPrimitive(`queue:${channelName}:queuelocked`, true)
	}
	list() {
		if (this.queue.length === 0) {
			return 'Liste ist leer!'
		}
		return this.queue.join(', ')
	}
	add(user: string) {
		this.queue.push(user)
	}
	remove(user: string) {
		this.queue = this.queue.filter((u) => u !== user)
	}
	clear() {
		this.queue = []
	}
	async lock() {
		await this.locked.set(true)
	}
	async unlock() {
		await this.locked.set(false)
	}
	pick() {
		return this.queue.shift()
	}
	randomPick() {
		return this.queue.splice(Math.floor(Math.random() * this.queue.length), 1)[0]
	}
}
