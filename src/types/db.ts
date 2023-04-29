export interface User {
  id: number
  email: string
  name: string
  password: string
  type: 'specialist' | 'user' | 'admin'
  status: 'active' | 'waiting_approval' | 'denied' | 'inactive'
}

export interface Specialization {
  id: number
  name: string
  description: string
}
