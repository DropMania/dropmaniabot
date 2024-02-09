import { Kysely, PostgresDialect } from 'kysely'
import { DB } from 'kysely-codegen'
import pg from 'pg'
import RedisSync from './lib/redisSync.js'
import dotenv from 'dotenv'
import translate from 'translate'
dotenv.config()
/* @ts-ignore */
translate.engine = 'google'
/* @ts-ignore */
translate.key = process.env.TRANSLATE_KEY

export const redisSync = new RedisSync('dropmaniabot:')

export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new pg.Pool({
			connectionString: process.env.DATABASE_URL,
		}),
	}),
})
export const tr = translate
export const sleep = (time: number) =>
	new Promise((res) => {
		setTimeout(res, time)
	})
