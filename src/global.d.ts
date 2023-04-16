import { User as DBUser } from './types/db'
// to make the file a module and avoid the TypeScript error

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends DBUser {}
  }
}

export {}
