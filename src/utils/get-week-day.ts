interface GetWeekDaysParams {
  short?: boolean
}

export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat('pt-MZ', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => {
      return formatter.format(new Date(Date.UTC(2025, 8, day)))
    })
    .map((weekDay) => {
      if (short) {
        return weekDay.substring(0, 3).toUpperCase()
      }

      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
    })
}
