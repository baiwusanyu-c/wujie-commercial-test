export function doHandleMonth(month: number) {
  let m = month as any
  if (month.toString().length === 1) m = `0${month}`
  return m
}

export function getYearMonthDate(day = 0, twoPeople = true) {
  const today = new Date()
  const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday_milliseconds)
  const year = today.getFullYear()
  let month = today.getMonth() + 1
  let date = today.getDate()
  let hour = today.getHours()
  let minute = today.getMinutes()
  let second = today.getSeconds()
  if (twoPeople) {
    month = doHandleMonth(month)
    date = doHandleMonth(date)
    hour = doHandleMonth(hour)
    minute = doHandleMonth(minute)
    second = doHandleMonth(second)
  }
  return { year, month, date, hour, minute, second }
}
