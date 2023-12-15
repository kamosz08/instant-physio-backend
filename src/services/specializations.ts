import { db } from '../db'
import { Specialization } from '../types/db'

const getAll = () =>
  db<Specialization>('specialization').select('id', 'slug', 'name')

const save = async (specialization: Omit<Specialization, 'id'>) => {
  await db<Specialization>('specialization').insert(specialization)
}

const findById = async ({ id }: { id: number }) => {
  return db<Specialization>('specialization').where('id', id).first()
}

const findBySlug = async ({ slug }: { slug: string }) => {
  return db<Specialization>('specialization').where('slug', slug).first()
}

export const specializationsService = {
  getAll,
  save,
  findById,
  findBySlug,
}
