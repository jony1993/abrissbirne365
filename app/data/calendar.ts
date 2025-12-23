// Calendar data with descriptions for each day
// Add your descriptions here - key is day number (1-365)
// Day 1 is the cover page with index.png
export interface DayData {
  description: string
  title?: string
}

export const calendarData: Record<number, DayData> = {
  1: {
    title: 'Abriss-Kalender 2026',
    description: '365 Tage · 365 Häuser · Eine Reise durch das Jahr'
  },
  2: {
    description: 'Tag 2 - Beschreibung hier hinzufügen.'
  },
  3: {
    description: 'Tag 3 - Beschreibung hier hinzufügen.'
  },
}

// Helper function to get day data with fallback
export function getDayData(day: number): DayData {
  return calendarData[day] || {
    description: ''
  }
}
