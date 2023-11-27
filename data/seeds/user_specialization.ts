import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user_specialization').del()

  // Inserts seed entries
  await knex('user_specialization').insert([
    { user_id: 1, specialization_id: 1 },
    { user_id: 5, specialization_id: 1 },
  ])
}
