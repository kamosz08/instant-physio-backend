import { knex } from 'knex'
import config from '../knexfile'

function createDatabaseConnection() {
  const knexInstance = knex(config[process.env.NODE_ENV || 'development'])

  return knexInstance
}

export default createDatabaseConnection
