import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meeting_participation', (table) => {
    table
      .enum('status', ['invited', 'accepted', 'denied', 'canceled'])
      .defaultTo('invited')
      .notNullable()
      .alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meeting_participation', (table) => {
    table
      .enum('status', ['invited', 'accepted', 'denied'])
      .defaultTo('invited')
      .notNullable()
      .alter()
  })
}
