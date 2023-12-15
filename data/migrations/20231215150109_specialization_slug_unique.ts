import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('specialization', (table) => {
    table.string('slug').unique().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('specialization', (table) => {
    table.string('slug').alter()
  })
}
