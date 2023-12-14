import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('specialization', (table) => {
    table.string('benefits', 1020).notNullable()
    table.string('benefitsPhoto').notNullable()
    table.string('mainPhoto').notNullable()
    table.string('slug').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('specialization', (table) => {
    table.dropColumn('benefits')
    table.dropColumn('benefitsPhoto')
    table.dropColumn('mainPhoto')
    table.dropColumn('slug')
  })
}
