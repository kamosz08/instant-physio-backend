import { Knex } from 'knex'
import { Specialization } from '../../src/types/db'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('specialization').del()

  // Inserts seed entries
  const specializations: Specialization[] = [
    {
      id: 1,
      name: 'Some name',
      description: 'Some description',
      slug: 'some-name',
      benefits: 'Benefit number one;Benefit number two;Some other, with coma',
      mainPhoto: 'uploads/male-2.jpg',
      benefitsPhoto: 'uploads/male-2.jpg',
    },
    {
      id: 2,
      name: 'Some name2',
      description: 'Some description2',
      slug: 'some-name2',
      benefits: 'Benefit number one;Benefit number two;Some other, with coma',
      mainPhoto: 'uploads/male-2.jpg',
      benefitsPhoto: 'uploads/male-2.jpg',
    },
  ]
  await knex('specialization').insert(specializations)
}
