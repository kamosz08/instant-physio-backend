import type { Knex } from 'knex'
import * as dotenv from 'dotenv'
dotenv.config()

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_URL,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: { directory: './data/seeds' },
  },

  local: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_URL,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: { directory: './data/seedsTest' },
  },

  ci: {
    client: 'mysql2',
    connection: {
      port: Number(process.env.DB_PORT),
      host: process.env.DB_URL,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: { directory: './data/seedsTest' },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_URL,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: { directory: './data/seeds' },
  },
}

export default config
