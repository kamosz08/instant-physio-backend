import { Knex } from 'knex'
import { Admin, Specialist, User } from '../../src/types/db'
import { format } from 'date-fns'
import { formatSpecialistWorkTime } from '../../src/utils/formatSpecialistWorkTime'

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
      username: 'test@test.test',
      password: '$2a$10$2jee7O1JZlcmJnBf.zNBbuhLbJsXVG0ThARusBtKYyThTktnQ62Vm',
      type: 'admin',
      status: 'active',
      avatar: null,
      gender: 'male',
    },
    {
      id: 2,
      name: 'Name Two',
      username: 'test2@test.test',
      password: '$2y$10$6yLRDx79qvoxsR97tLzdnOXHEG1Lo5JrEBVNY7A2iu6c/WY27HROe',
      type: 'specialist',
      status: 'waiting_approval',
      avatar: null,
      gender: 'male',
    },
    {
      id: 3,
      name: 'Name Three',
      username: 'test@example.com',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'user',
      status: 'active',
      avatar: null,
      gender: 'male',
    },
    {
      id: 4,
      name: 'Name Four',
      username: 'testadmin@example.com',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'admin',
      status: 'active',
      avatar: null,
      gender: 'male',
    },
    {
      id: 5,
      name: 'Name Five',
      username: 'testspecialist@example.com',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/male-1.jpg',
      gender: 'male',
    },
    {
      id: 6,
      name: 'Name Six',
      username: 'test2@example.com',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'user',
      status: 'active',
      avatar: null,
      gender: 'male',
    },
    {
      id: 7,
      name: 'Name Seven',
      username: 'test-specialist',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/male-2.jpg',
      gender: 'male',
    },
  ]
  await knex('user').insert(users)

  const admins: Admin[] = [
    {
      id: 1,
    },
    {
      id: 4,
    },
  ]
  await knex('admin').insert(admins)

  const specialists: Specialist[] = [
    {
      id: 2,
      description: 'Some description',
      start_work: formatSpecialistWorkTime(new Date(2020, 0, 0, 8, 0)),
      end_work: formatSpecialistWorkTime(new Date(2020, 0, 0, 16, 0)),
    },
    {
      id: 5,
      description: 'Some description',
      start_work: formatSpecialistWorkTime(new Date(2020, 0, 0, 8, 0)),
      end_work: formatSpecialistWorkTime(new Date(2020, 0, 0, 16, 0)),
    },
  ]

  await knex('specialist').insert(specialists)
}
