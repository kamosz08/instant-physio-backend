import { Knex } from 'knex'
import { Admin, Specialist, User } from '../../src/types/db'
import { formatDateToDB } from '../../src/utils/formatDateToDB'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('specialist').del()
  await knex('admin').del()
  await knex('user').del()

  // Inserts seed entries
  const users: User[] = [
    {
      id: 1,
      name: 'Milo Harding',
      username: 'test@test.test',
      password: '$2a$10$2jee7O1JZlcmJnBf.zNBbuhLbJsXVG0ThARusBtKYyThTktnQ62Vm',
      type: 'admin',
      status: 'active',
      avatar: null,
      gender: 'male',
    },
    {
      id: 2,
      name: 'Markus Mack',
      username: 'test2@test.test',
      password: '$2y$10$6yLRDx79qvoxsR97tLzdnOXHEG1Lo5JrEBVNY7A2iu6c/WY27HROe',
      type: 'specialist',
      status: 'waiting_approval',
      avatar: null,
      gender: 'male',
    },
    {
      id: 3,
      name: 'Dillon Roy',
      username: 'test-user',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'user',
      status: 'active',
      avatar: null,
      gender: 'male',
    },
    {
      id: 4,
      name: 'Ehsan Harvey',
      username: 'testadmin@example.com',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'admin',
      status: 'active',
      avatar: null,
      gender: 'male',
    },
    {
      id: 5,
      name: 'Haris Winters',
      username: 'testspecialist@example.com',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/strength-1.png',
      gender: 'male',
    },
    {
      id: 6,
      name: 'Ajay Wiggins',
      username: 'test2@example.com',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'user',
      status: 'active',
      avatar: null,
      gender: 'male',
    },
    {
      id: 7,
      name: 'Adam Jarvis',
      username: 'test-specialist',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/strength-2.png',
      gender: 'male',
    },
    {
      id: 8,
      name: 'Eve Leach',
      username: 'test-specialist2',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/all-4.png',
      gender: 'female',
    },
    {
      id: 9,
      name: 'Kasey Mccarthy',
      username: 'test-specialist3',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/strength-3.png',
      gender: 'male',
    },
    {
      id: 10,
      name: 'Coral Hardy',
      username: 'test-specialist4',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/all-5.png',
      gender: 'female',
    },
    {
      id: 11,
      name: 'Harvey Sykes',
      username: 'test-specialist5',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/all-1.png',
      gender: 'male',
    },
    {
      id: 12,
      name: 'Tariq Crane',
      username: 'test-specialist6',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/yoga-1.png',
      gender: 'male',
    },
    {
      id: 13,
      name: 'Mikolaj Snow',
      username: 'test-specialist7',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/yoga-2.png',
      gender: 'male',
    },
    {
      id: 14,
      name: 'Oliwier Riddle',
      username: 'test-specialist8',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/all-2.png',
      gender: 'male',
    },
    {
      id: 15,
      name: 'Jakob Riley',
      username: 'test-specialist9',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/all-3.png',
      gender: 'male',
    },
    {
      id: 16,
      name: 'Felix Green',
      username: 'test-specialist10',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/yoga-3.png',
      gender: 'male',
    },
    {
      id: 17,
      name: 'Junaid Moreno',
      username: 'test-specialist11',
      password: '$2b$10$389oLIff5a9GpYpuCzL7CehUYYoE4x9sNLyFrnMYLZayzJjGMk0T2', //test
      type: 'specialist',
      status: 'active',
      avatar: 'uploads/yoga-4.png',
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
      description:
        'Hi, my name is Marcus, I was overweight and struggled with eating disorders for most of my life, but fitness has given me a purpose, helped me get in shape, and transformed my life. My mission is to share my knowledge and help others lead healthier and more fulfilling lives.',
      start_work: formatDateToDB(new Date(2020, 0, 1, 8, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
    {
      id: 5,
      description:
        'Hi, my name is Haris, As someone who struggled with weight loss for years, I’ve experienced most of the challenges first-hand. My experience allows me to develop simple and sustainable exercise plans that take my client’s goals, needs, preferences into consideration.',
      start_work: formatDateToDB(new Date(2020, 0, 1, 8, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
    {
      id: 7,
      description: 'I create simple and sustainable training programs',
      start_work: formatDateToDB(new Date(2020, 0, 1, 8, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
    {
      id: 8,
      description: 'My name is Eve and fitness is my passion',
      start_work: formatDateToDB(new Date(2020, 0, 1, 10, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 14, 0)),
    },
    {
      id: 9,
      description: 'My name is Kasey and fitness is my passion',
      start_work: formatDateToDB(new Date(2020, 0, 1, 14, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
    {
      id: 10,
      description: 'My name is Coral and fitness is my passion',
      start_work: formatDateToDB(new Date(2020, 0, 1, 8, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
    {
      id: 11,
      description: 'My name is Harvey and fitness is my passion',
      start_work: formatDateToDB(new Date(2020, 0, 1, 8, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
    {
      id: 12,
      description: 'My name is Tariq and fitness is my passion',
      start_work: formatDateToDB(new Date(2020, 0, 1, 8, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
    {
      id: 13,
      description: 'My name is Mikolaj and fitness is my passion',
      start_work: formatDateToDB(new Date(2020, 0, 1, 8, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
    {
      id: 14,
      description: 'My name is Oliwier and fitness is my passion',
      start_work: formatDateToDB(new Date(2020, 0, 1, 8, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
    {
      id: 15,
      description: 'My name is Jakob and fitness is my passion',
      start_work: formatDateToDB(new Date(2020, 0, 1, 8, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
    {
      id: 16,
      description: 'My name is Felix and fitness is my passion',
      start_work: formatDateToDB(new Date(2020, 0, 1, 8, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
    {
      id: 17,
      description: 'My name is Junaid and fitness is my passion',
      start_work: formatDateToDB(new Date(2020, 0, 1, 8, 0)),
      end_work: formatDateToDB(new Date(2020, 0, 1, 16, 0)),
    },
  ]

  await knex('specialist').insert(specialists)
}
