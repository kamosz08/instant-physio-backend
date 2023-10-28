import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('user', (table) => {
      table.increments('id', { primaryKey: true })
      table.string('name').notNullable()
      table.string('email').notNullable().index()
      table
        .enum('type', ['specialist', 'user', 'admin'])
        .defaultTo('user')
        .notNullable()
      table
        .enum('status', ['active', 'inactive', 'waiting_approval', 'denied'])
        .notNullable()
      table.string('password').notNullable()
      table.timestamp('created_at').defaultTo(knex.raw('now()'))
    })
    .createTable('specialist', (table) => {
      table.integer('id')
      table.primary(['id'])
      table.foreign('id', 'user.id')
      table.string('description', 1020).notNullable()
      table.timestamp('start_work').defaultTo('2000-01-01 08:00:00')
      table.timestamp('end_work').defaultTo('2000-01-01 16:00:00')
    })
    .createTable('admin', (table) => {
      table.integer('id')
      table.primary(['id'])
      table.foreign('id', 'user.id')
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('specialist')
    .dropTable('admin')
    .dropTable('user')
}
