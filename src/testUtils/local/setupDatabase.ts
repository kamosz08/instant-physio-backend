import { knex } from 'knex'
import config from '../../../knexfile'
import { beforeAll } from '@jest/globals'
import { getDbConfigName } from '../../factories/createDatabaseConnection'

// Init connect knex with empty DB name so we can create DB
beforeAll(async () => {
  const configuration = config[getDbConfigName()]

  const testConfig = {
    ...configuration,
    connection: { ...(configuration.connection as any), database: null },
  }
  const knexInstance = knex(testConfig)

  await knexInstance.raw(`CREATE DATABASE ${process.env.DB_NAME};`)
  await knexInstance.destroy()
})
