export const formatDate = (date: string) => {
  const { locale } = useI18n()
  return new Date(date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

