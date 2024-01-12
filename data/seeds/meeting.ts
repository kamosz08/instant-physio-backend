import { Knex } from 'knex'
import { Meeting } from '../../src/types/db'
import { formatDateToDB } from '../../src/utils/formatDateToDB'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('meeting').del()

  const meetings: Meeting[] = [
    {
      id: 1,
      creator_id: 5,
      start_time: formatDateToDB(new Date(2023, 0, 1, 10, 0)),
      end_time: formatDateToDB(new Date(2023, 0, 1, 11, 0)),
    },
    {
      id: 2,
      creator_id: 5,
      start_time: formatDateToDB(new Date(2024, 0, 20, 10, 0)),
      end_time: formatDateToDB(new Date(2024, 0, 20, 11, 0)),
    },
  ]
  // Inserts seed entries
  await knex('meeting').insert(meetings)
}
