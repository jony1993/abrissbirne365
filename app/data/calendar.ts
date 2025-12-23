// Calendar data with descriptions for each day
// Add your descriptions here - key is day number (1-365)
export interface DayData {
  description: string
  title?: string
}

export const calendarData: Record<number, DayData> = {
  1: {
    title: 'Neujahr',
    description: 'Ein neues Jahr beginnt mit diesem besonderen Abriss.'
  },
  2: {
    description: 'Tag 2 - Beschreibung hier hinzufügen.'
  },
  3: {
    description: 'Tag 3 - Beschreibung hier hinzufügen.'
  },
  // Add more days as needed...
  // Example:
  // 42: {
  //   title: 'Besonderer Tag',
  //   description: 'Eine interessante Geschichte zu diesem Haus.'
  // },
}

// Helper function to get day data with fallback
export function getDayData(day: number): DayData {
  return calendarData[day] || {
    description: ''
  }
}
