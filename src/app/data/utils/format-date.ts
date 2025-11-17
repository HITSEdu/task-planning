export const formatDateForInput = (date: Date | undefined): string => {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}