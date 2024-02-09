import Module from './_Module.js'
import { db } from '../utils.js'
export default class commandHandler extends Module {
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
	async isCommandDisabled(command: string) {
		const commandExists = await db
			.selectFrom('commands')
			.selectAll()
			.where('command', '=', command)
			.where('channel', '=', this.channelName)
			.execute()
		if (commandExists.length === 0) {
			return false
		}
		return commandExists[0].disabled
	}

	async getCustomCommands() {
		return await db.selectFrom('custom_commands').selectAll().where('channel', '=', this.channelName).execute()
	}

	runCommand(reply_text: string) {
		this.client.say(this.channelName, reply_text)
	}
	async customCommandExists(name: string) {
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
