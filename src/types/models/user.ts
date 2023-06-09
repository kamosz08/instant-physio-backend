import { IsEmail, IsIn, IsNumberString, IsString } from 'class-validator'
import { User } from '../db'

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
