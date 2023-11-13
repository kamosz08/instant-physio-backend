import { knex } from 'knex'
import config from '../knexfile'

export const getDbConfigName = () => {
  let configName = process.env.NODE_ENV || 'development'
  if (process.env.TEST_ENV) {
    configName = process.env.TEST_ENV
  }

  return configName
}

function createDatabaseConnection() {
  const knexInstance = knex(config[getDbConfigName()])

  return knexInstance
}

export default createDatabaseConnection
