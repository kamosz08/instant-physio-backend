import { Knex } from 'knex'
import { Admin, Specialist, User } from '../../src/types/db'
import { format } from 'date-fns'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('specialist').del()
  await knex('admin').del()
  await knex('user').del()

  // Inserts seed entries
  const users: User[] = [
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
      password: '$2y$10$6yLRDx79qvoxsR97tLzdnOXHEG1Lo5JrEBVNY7A2iu6c/WY27HROe',
      type: 'specialist',
      status: 'active',
    },
  ]
  await knex('user').insert(users)

  const admins: Admin[] = [
    {
      id: 1,
    },
  ]
  await knex('admin').insert(admins)

  const specialists: Specialist[] = [
    {
      id: 2,
      description: 'Some description',
      start_work: format(new Date(2020, 0, 0, 8, 0), 'yyyy-MM-dd HH:mm:ss'),
      end_work: format(new Date(2020, 0, 0, 16, 0), 'yyyy-MM-dd HH:mm:ss'),
    },
  ]

  await knex('specialist').insert(specialists)
}
