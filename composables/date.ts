export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

