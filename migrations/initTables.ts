import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('channels')
		.addColumn('channel', 'text', (col) => col.primaryKey().notNull())
		.addColumn('enabled', 'boolean', (col) => col.notNull().defaultTo(true))
		.addColumn('twitch_refresh', 'text')
		.addColumn('spotify_refresh', 'text')
		.addColumn('7tv_emoteset', 'text')
		.execute()
	await db.schema
		.createTable('commands')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('channel', 'text', (col) => col.notNull().references('channels.channel').onDelete('cascade'))
		.addColumn('command', 'text', (col) => col.notNull())
		.addColumn('disabled', 'boolean', (col) => col.notNull().defaultTo(false))
		.addColumn('cooldown', 'integer', (col) => col.notNull().defaultTo(3))
		.execute()
	await db.schema
		.createTable('custom_commands')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('channel', 'text', (col) => col.notNull().references('channels.channel').onDelete('cascade'))
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('reply_text', 'text', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
		.execute()
	await db.schema
		.createTable('lobs')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('channel', 'text', (col) => col.notNull().references('channels.channel').onDelete('cascade'))
		.addColumn('text', 'text', (col) => col.notNull())
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('lobs').execute()
	await db.schema.dropTable('custom_commands').execute()
	await db.schema.dropTable('commands').execute()
	await db.schema.dropTable('channels').execute()
}
