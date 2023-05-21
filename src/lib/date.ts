export function getDateDiff(date1: Date, date2: Date) {
  const diff = date1.getTime() - date2.getTime()

  let totalSeconds = diff
  const hours = Math.floor(totalSeconds / (1000 * 60 * 60))
  totalSeconds -= hours * 1000 * 60 * 60
  const minutes = Math.floor(totalSeconds / (1000 * 60))
  totalSeconds -= minutes * 1000 * 60
  const seconds = Math.floor(totalSeconds / 1000)

  return { hours, minutes, seconds }
}
