import { format } from 'date-fns'

export const formatDateToDB = (date: Date) => {
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}
