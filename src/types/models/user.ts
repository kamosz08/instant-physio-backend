import { IsIn, IsNumber, IsString, ValidateIf } from 'class-validator'
import { Specialist, User, UserSpecialization } from '../db'

export class UserCreateAPI implements Omit<User, 'id'> {
  @IsString()
  name: string

  @IsString()
  username: string

  @IsString()
  password: string

  @IsIn(['specialist', 'user', 'admin'])
  type: 'specialist' | 'user' | 'admin'

  @IsIn(['active', 'waiting_approval', 'denied', 'inactive'])
  status: 'active' | 'waiting_approval' | 'denied' | 'inactive'

  @IsString()
  @ValidateIf((object, value) => value !== null)
  avatar: string | null

  @IsIn(['male', 'female'])
  gender: 'male' | 'female'

  @IsNumber()
  credits: number
}

export class SpecialistCreateAPI implements Omit<Specialist & User, 'id'> {
  credits: number
  gender: 'male' | 'female'
  @IsString()
  name: string

  @IsString()
  username: string

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

  @IsString()
  @ValidateIf((object, value) => value !== null)
  avatar: string | null
}

export class UserLoginAPI implements Pick<User, 'username' | 'password'> {
  @IsString()
  username: string

  @IsString()
  password: string
}

export class UserApproveAPI implements Pick<User, 'id'> {
  @IsNumber()
  id: number
}

export class AssignSpecializationAPI implements UserSpecialization {
  @IsNumber()
  user_id: number

  @IsNumber()
  specialization_id: number
}

export class BuyCreditsAPI {
  @IsNumber()
  credits: number
}

export class RefreshTokenAPI {
  @IsString()
  refreshToken: number
}
