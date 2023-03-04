import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_specialization', (table) => {
    table.integer('user_id')
    table.integer('specialization_id')
    table.primary(['user_id', 'specialization_id'])
    table.foreign('user_id', 'user.id')
    table.foreign('specialization_id', 'specialization.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_specialization')
}
