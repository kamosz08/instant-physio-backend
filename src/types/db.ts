export interface User {
  id: number
  email: string
  name: string
  password: string
  type: 'specialist' | 'user'
}

export interface Specialization {
  id: number
  name: string
  description: string
}
