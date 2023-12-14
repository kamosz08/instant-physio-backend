export interface User {
  id: number
  username: string
  name: string
  password: string
  type: 'specialist' | 'user' | 'admin'
  status: 'active' | 'waiting_approval' | 'denied' | 'inactive'
  avatar: string | null
  gender: 'male' | 'female'
}

export interface Admin {
  id: number
}

export interface Specialist {
  id: number
  description: string
  start_work: string
  end_work: string
}

export interface Specialization {
  id: number
  name: string
  description: string
  slug: string
  benefits: string
  benefitsPhoto: string
  mainPhoto: string
}

export interface Meeting {
  id: number
  creator_id: number
  start_time: string
  end_time: string
}

export interface MeetingParticipation {
  user_id: number
  meeting_id: number
  status: 'invited' | 'accepted' | 'denied'
}

export interface UserSpecialization {
  user_id: number
  specialization_id: number
}
