import Module from './_Module.js'
import { db } from '../utils.js'
import { parseCommand } from '../lib/customCommands.js'
import commands from '../commands.js'

export default class CommandHandler extends Module {
	constructor(channelName: string) {
		super(channelName)
	}
	async disableCommand(command: string) {
		const commandExists = await db
			.selectFrom('commands')
			.selectAll()
			.where('command', '=', command)
			.where('channel', '=', this.channelName)
			.execute()
		if (commandExists.length === 0) {
			await db.insertInto('commands').values({ command, channel: this.channelName, disabled: true }).execute()
		} else {
			await db
				.updateTable('commands')
				.set('disabled', true)
				.where('command', '=', command)
				.where('channel', '=', this.channelName)
				.execute()
		}
	}
	async enableCommand(command: string) {
		await db
			.updateTable('commands')
			.set('disabled', false)
			.where('command', '=', command)
			.where('channel', '=', this.channelName)
			.execute()
	}
	async getDisabledCommands() {
		return await db
			.selectFrom('commands')
			.where('disabled', '=', true)
			.where('channel', '=', this.channelName)
			.execute()
	}
	async getCommandConfig(command: string) {
		const commandExists = await db
			.selectFrom('commands')
			.selectAll()
			.where('command', '=', command)
			.where('channel', '=', this.channelName)
			.execute()
		if (commandExists.length === 0) {
			return {
				channel: this.channelName,
				command,
				cooldown: '3',
				disabled: false,
				id: 0,
			}
		}
		return commandExists[0]
	}

	async setCooldown(command: string, cooldown: number) {
		await db
			.updateTable('commands')
			.set('cooldown', cooldown)
			.where('command', '=', command)
			.where('channel', '=', this.channelName)
			.execute()
	}

	async getCustomCommands() {
		return await db.selectFrom('custom_commands').selectAll().where('channel', '=', this.channelName).execute()
	}
	async getAllCommands() {
		const customCommands = await this.getCustomCommands()
		const builtInCommands = Object.keys(commands).map((command) => ({
			name: command,
			reply_text: '',
			channel: 'BUILD_IN',
		}))
		return [...customCommands, ...builtInCommands]
	}

	async runCustomCommand(reply_text: string, params: CommandParams) {
		const replyText = await parseCommand(reply_text, params)
		this.client.say(this.channelName, replyText)
	}
	async commandExists(name: string) {
		if (name in commands) return true
		const commandExists = await db
			.selectFrom('custom_commands')
			.selectAll()
			.where('name', '=', name)
			.where('channel', '=', this.channelName)
			.execute()
		return commandExists.length > 0
	}

	async addCustomCommand(name: string, reply_text: string) {
		await db.insertInto('custom_commands').values({ name, reply_text, channel: this.channelName }).execute()
	}

	async removeCustomCommand(name: string) {
		await db
			.deleteFrom('custom_commands')
			.where('name', '=', name)
			.where('channel', '=', this.channelName)
			.execute()
	}

	async editCustomCommand(name: string, reply_text: string) {
		await db
			.updateTable('custom_commands')
			.set('reply_text', reply_text)
			.where('name', '=', name)
			.where('channel', '=', this.channelName)
			.execute()
	}
}
