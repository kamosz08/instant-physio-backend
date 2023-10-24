import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('user', (table) => {
    table.string('description')
  })

  return knex.raw(`
    ALTER TABLE user
    ADD CONSTRAINT specialist_description_is_not_null
    CHECK (
      type = 'specialist'
      AND description IS NOT NULL
    )
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE user
    DROP CHECK specialist_description_is_not_null
  `)

  return knex.schema.table('user', (table) => {
    table.dropColumn('description')
  })
}
