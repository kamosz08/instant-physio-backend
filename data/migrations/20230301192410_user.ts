import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', (table) => {
    table.increments('id', { primaryKey: true })
    table.string('name').notNullable()
    table.string('email').notNullable().index()
    table.string('password').notNullable()
    table.timestamp('created_at').defaultTo(knex.raw('now()'))
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user')
}
