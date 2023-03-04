import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('specialization').del()

  // Inserts seed entries
  await knex('specialization').insert([
    { id: 1, name: 'Some name', description: 'Some description' },
  ])
}
