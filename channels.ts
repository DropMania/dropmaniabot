import { db } from './utils.js'
const channels = await db.selectFrom('channels').selectAll().execute()
export default channels
