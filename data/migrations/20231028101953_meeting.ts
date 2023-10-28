import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('meeting', (table) => {
      table.increments('id', { primaryKey: true })
      table.integer('creator_id')
      table.foreign('creator_id', 'user.id')
      table.timestamp('start_time').notNullable()
      table.timestamp('end_time').notNullable()
    })
    .createTable('meeting_participation', (table) => {
      table.integer('user_id')
      table.integer('meeting_id')
      table.primary(['user_id', 'meeting_id'])
      table.foreign('user_id', 'user.id')
      table.foreign('meeting_id', 'meeting.id')
      table
        .enum('status', ['invited', 'accepted', 'denied'])
        .defaultTo('invited')
        .notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meeting_participation').dropTable('meeting')
}
