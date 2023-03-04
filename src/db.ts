import { knex } from 'knex'
import config from '../knexfile'

const knexInstance = knex(config[process.env.NODE_ENV || 'development'])

export const db = knexInstance
