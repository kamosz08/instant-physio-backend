import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('user', (table) => {
    table.integer('credits').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('user', (table) => {
    table.dropColumn('credits')
  })
}
