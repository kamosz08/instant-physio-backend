export interface User {
  id: number
  email: string
  name: string
  password: string
  type: 'specialist' | 'user' | 'admin'
  status: 'active' | 'waiting_approval' | 'denied' | 'inactive'
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
}

export interface Meeting {
  id: number
  creator_id: number
  start_time: string
  end_time: string
}
