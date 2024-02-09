import { RedisClientType, createClient } from 'redis'

export default class RedisSync {
	private client: RedisClientType
	private prefix: string
	constructor(prefix: string) {
		this.client = createClient()
		this.client.on('error', (err) => {
			console.error('Redis error:', err)
		})
		this.client.connect()
		this.prefix = prefix
	}
	public createPrimitive<T>(key: string, defaultValue: string | number | boolean) {
		return new RedisPrimitive<T>(this.client, this.prefix + key, defaultValue)
	}
	public createList<T>(key: string, defaultValue: any[]) {
		return new RedisList<T>(this.client, this.prefix + key, defaultValue)
	}
	public createHash<T>(key: string, defaultValue: { [key: string]: any }) {
		return new RedisHash<T>(this.client, this.prefix + key, defaultValue)
	}
}

class RedisType<T> {
	protected client: RedisClientType
	protected key: string
	constructor(client: RedisClientType, key: string, defaultValue: any) {
		this.client = client
		this.key = key
		if (!this.client.isReady) {
			this.client.on('ready', () => {
				this.get().then((value) => {
					if (value === null) this.client.set(key, JSON.stringify(defaultValue))
				})
			})
		} else {
			this.get().then((value) => {
				if (value === null) this.client.set(key, JSON.stringify(defaultValue))
			})
		}
	}
	public async set(value: any) {
		await this.client.set(this.key, JSON.stringify(value))
	}
	public async get() {
		return (await JSON.parse(await this.client.get(this.key))) as T
	}
}
export class RedisPrimitive<T> extends RedisType<T> {
	constructor(client: RedisClientType, key: string, defaultValue: any) {
		super(client, key, defaultValue)
	}
}

export class RedisList<T> extends RedisType<T> {
	constructor(client: RedisClientType, key: string, defaultValue: Array<any>) {
		super(client, key, defaultValue)
	}
	public async push(value: any) {
		let values = (await this.get()) as any[]
		values.push(value)
		await this.set(values)
		return values
	}
	public async pop() {
		let values = (await this.get()) as any[]
		let value = values.pop()
		await this.set(values)
		return value
	}
	public async shift() {
		let values = (await this.get()) as any[]
		let value = values.shift()
		await this.set(values)
		return value
	}
	public async unshift(value: any) {
		let values = (await this.get()) as any[]
		values.unshift(value)
		await this.set(values)
		return values
	}
	public async remove(index: number) {
		let values = (await this.get()) as any[]
		let value = values.splice(index, 1)
		await this.set(values)
		return value
	}
	public async removeValue(value: any) {
		let values = (await this.get()) as any[]
		values = values.filter((v) => v !== value)
		await this.set(values)
		return values
	}
	public async insert(index: number, value: any) {
		let values = (await this.get()) as any[]
		values.splice(index, 0, value)
		await this.set(values)
		return values
	}
	public async clear() {
		await this.set([])
	}
	public async length() {
		return ((await this.get()) as any).length
	}
	public async getAt(index: number) {
		return (await this.get())[index]
	}
}

export class RedisHash<T> extends RedisType<T> {
	constructor(client: RedisClientType, key: string, defaultValue: any) {
		super(client, key, defaultValue)
	}
	public async setKey(key: string, value: any) {
		let values = await this.get()
		values[key] = value
		await this.set(values)
	}
	public async getKey(key: string) {
		let values = await this.get()
		return values[key]
	}
	public async deleteKey(key: string) {
		let values = await this.get()
		delete values[key]
		await this.set(values)
	}
}
