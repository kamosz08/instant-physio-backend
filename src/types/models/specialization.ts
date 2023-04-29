import { IsString } from 'class-validator'
import { Specialization } from '../db'

export class SpecializationCreateAPI implements Omit<Specialization, 'id'> {
  @IsString()
  name: string

  @IsString()
  description: string
}
