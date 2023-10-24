import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user').del()

  // Inserts seed entries
  await knex('user').insert([
    {
      id: 1,
      name: 'Name One',
      email: 'test@test.test',
      password: '$2a$10$2jee7O1JZlcmJnBf.zNBbuhLbJsXVG0ThARusBtKYyThTktnQ62Vm',
      type: 'admin',
      status: 'active',
    },
    {
      id: 2,
      name: 'Name Two',
      email: 'test2@test.test',
      description: 'Some description',
      password: '$2y$10$6yLRDx79qvoxsR97tLzdnOXHEG1Lo5JrEBVNY7A2iu6c/WY27HROe',
      type: 'specialist',
      status: 'waiting_approval',
    },
  ])
}
