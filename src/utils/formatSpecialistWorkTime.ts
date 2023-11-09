import { format } from 'date-fns'

export const formatSpecialistWorkTime = (date: Date) => {
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}
