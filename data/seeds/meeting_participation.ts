import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('meeting_participation').del()

  // Inserts seed entries
  await knex('meeting_participation').insert([
    { user_id: 5, meeting_id: 1, status: 'accepted' },
  ])
}
