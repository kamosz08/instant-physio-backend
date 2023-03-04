import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('specialization', (table) => {
    table.increments('id', { primaryKey: true })
    table.string('name').notNullable()
    table.string('description', 1020).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('specialization')
}
