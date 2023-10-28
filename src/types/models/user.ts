import {
  IsEmail,
  IsIn,
  IsNumberString,
  IsString,
  ValidateIf,
} from 'class-validator'
import { Specialist, User } from '../db'

export class UserCreateAPI implements Omit<User, 'id'> {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsIn(['specialist', 'user', 'admin'])
  type: 'specialist' | 'user' | 'admin'

  @IsIn(['active', 'waiting_approval', 'denied', 'inactive'])
  status: 'active' | 'waiting_approval' | 'denied' | 'inactive'
}

export class SpecialistCreateAPI implements Omit<Specialist & User, 'id'> {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsIn(['specialist'])
  type: 'specialist'

  @IsIn(['active', 'waiting_approval', 'denied', 'inactive'])
  status: 'active' | 'waiting_approval' | 'denied' | 'inactive'

  @IsString()
  description: string

  @IsString()
  @ValidateIf((object, value) => value !== null)
  start_work: string | null

  @IsString()
  @ValidateIf((object, value) => value !== null)
  end_work: string | null
}

export class UserLoginAPI implements Pick<User, 'email' | 'password'> {
  @IsEmail()
  email: string

  @IsString()
  password: string
}

export class UserApproveAPI implements Pick<User, 'id'> {
  @IsNumberString()
  id: number
}
