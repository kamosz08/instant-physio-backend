import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user_specialization').del()

  // Inserts seed entries
  await knex('user_specialization').insert([
    { user_id: 1, specialization_id: 1 },
    { user_id: 5, specialization_id: 1 },
    { user_id: 7, specialization_id: 1 },
    { user_id: 9, specialization_id: 1 },
    { user_id: 12, specialization_id: 2 },
    { user_id: 13, specialization_id: 2 },
    { user_id: 16, specialization_id: 2 },
    { user_id: 17, specialization_id: 2 },
    { user_id: 11, specialization_id: 3 },
    { user_id: 11, specialization_id: 2 },
    { user_id: 11, specialization_id: 1 },
    { user_id: 10, specialization_id: 3 },
    { user_id: 10, specialization_id: 2 },
    { user_id: 10, specialization_id: 1 },
    { user_id: 8, specialization_id: 3 },
    { user_id: 8, specialization_id: 2 },
    { user_id: 8, specialization_id: 1 },
    { user_id: 14, specialization_id: 3 },
    { user_id: 14, specialization_id: 2 },
    { user_id: 14, specialization_id: 1 },
    { user_id: 15, specialization_id: 3 },
    { user_id: 15, specialization_id: 2 },
    { user_id: 15, specialization_id: 1 },
  ])
}
