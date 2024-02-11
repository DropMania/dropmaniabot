import { redisSync } from '../utils.js'
import { RedisList, RedisPrimitive } from '../lib/redisSync.js'
import Module from './_Module.js'
export default class Queue extends Module {
	private queue: RedisList<string[]>
	public locked: RedisPrimitive<boolean>
	constructor(channelName: string) {
		super(channelName)
		this.queue = redisSync.createList(`queue:${channelName}:queue`, [])
		this.locked = redisSync.createPrimitive(`queue:${channelName}:queuelocked`, true)
	}
	async list() {
		const queue = await this.queue.get()
		if (queue.length === 0) {
			return 'Liste ist leer!'
		}
		return queue.join(', ')
	}
	async add(user: string) {
		this.queue.push(user)
	}
	async remove(user: string) {
		this.queue.removeValue(user)
	}
	async clear() {
		this.queue.clear()
	}
	async lock() {
		await this.locked.set(true)
	}
	async unlock() {
		await this.locked.set(false)
	}
	async pick() {
		return this.queue.shift()
	}
	async randomPick() {
		const queue = await this.queue.get()
		if (queue.length === 0) {
			return null
		}
		return queue[Math.floor(Math.random() * queue.length)]
	}
}
