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
    description: 'Ein Abrisskalender für jeden Tag'
  },
  2: {
    description: 'Wohn-Silo'
  },
  3: {
    description: 'Wohn-Trafo'
  },
  4: {
    description: 'Ach wäre ich doch Schneewittchen'
  },
  5: {
    description: 'Thujen-Garde'
  },
  6: {
    description: 'Für alle Ewigkeit'
  },
  7: {
    description: 'Haus ohne Gesicht'
  },
  8: {
    description: 'Ohne Worte'
  },
  9: {
    description: 'Dachlandschaft'
  },
  10: {
    description: 'Einfügung in die Nachbarbebauung am Dorfrand'
  },
  11: {
    description: 'Ohne Worte'
  },
  12: {
    description: 'Noch ein Wohn-Trafo'
  },
  13: {
    description: 'Aus der BayWa'
  },
  14: {
    description: 'Sockelschutz-Verblendung'
  },
  15: {
    description: 'Hier war ein kreativer Garagist am Werk'
  },
  16: {
    description: 'Neues Heizkraftwerk – Pumpen als Empfangskomitee'
  },
  17: {
    description: 'Plastik-Ralleystreifen'
  },
  18: {
    description: 'Meine Burgbefestigung'
  },
  19: {
    description: 'Wohn-Trafo 10A'
  },
  20: {
    description: 'Des Guten zuviel'
  },
  21: {
    description: 'Oh wie schön ist Antrazit'
  },
  22: {
    description: 'Hangbefestigung monumental'
  },
  23: {
    description: 'Ohne Worte'
  },
  24: {
    description: 'Ohne Worte'
  },
  25: {
    description: 'Einfügung in die Nachbarbebauung'
  },
  26: {
    description: 'Insektenverbotszone'
  },
  27: {
    description: 'Kontrapunkt zu alten Hütten'
  },
  28: {
    description: 'Kontaktverbot'
  },
  29: {
    description: 'Neues Bauen landau(f) und landab'
  },
  30: {
    description: 'Holzverbund-Zaun'
  },
  31: {
    description: 'Liebhaber von Leitplanken'
  },
  32: {
    description: 'Ohne Worte'
  },
  33: {
    description: 'Barrierefreier Hang'
  },
  34: {
    description: 'Bauen mit dem Gelände'
  },
  35: {
    description: 'Gleiches Geschoß-Recht für Mandatsträger'
  },
  36: {
    description: 'Leben hinter Gittern'
  },
  37: {
    description: 'Ohne Worte'
  },
  38: {
    description: 'Ohne Worte'
  },
  39: {
    description: 'Ungeheuerlich'
  },
  40: {
    description: 'Barrierefreier Hang'
  },
  41: {
    description: 'Malerische Freiheit 1'
  },
  42: {
    description: 'Malerische Freiheit 2'
  },
  43: {
    description: 'Burg'
  },
  44: {
    description: 'Bilderrätsel (Wärmepumpe, Postkasten)'
  },
  45: {
    description: 'Vorgarten des Grauens'
  },
  46: {
    description: 'Ohne Worte'
  },
  47: {
    description: 'Gott mit dir, du Land der BayWa'
  },
  48: {
    description: 'Wohn-Trafo-Zwilling'
  },
  49: {
    description: 'Ohne Worte'
  },
  50: {
    description: 'Lichtorgie'
  },
  51: {
    description: 'Kratzbeton'
  },
  52: {
    description: 'Kanadischer Blockbau'
  },
  53: {
    description: 'Einfamilienhaus'
  },
  54: {
    description: 'Kreative Dachentwässerung'
  },
  55: {
    description: 'Einladend'
  },
  56: {
    description: 'Mattglas'
  },
  57: {
    description: 'Dorfeingang'
  },
  58: {
    description: 'Ohne Worte'
  },
  59: {
    description: 'Nett!'
  },
  60: {
    description: 'Ohne Worte'
  },
  61: {
    description: 'Ohne Worte'
  },
  62: {
    description: 'Einfach wär` zu einfach'
  },
  63: {
    description: 'Dörfliches Bauen'
  },
  64: {
    description: 'Ohne Worte'
  },
  65: {
    description: 'Ohne Worte'
  },
}

// Helper function to get day data with fallback
export function getDayData(day: number): DayData {
  return calendarData[day] || {
    description: ''
  }
}
