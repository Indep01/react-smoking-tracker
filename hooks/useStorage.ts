// hooks/useStorage.ts

export type Entry = {
  count: number
  note: string
  ts: number
}

export type Settings = {
  isPremium: boolean
  dailyGoal: number
  reductionStep: number
  pricePerPack: number
  cigarettesPerPack: number
  notifEnabled: boolean
  notifTime: string
  startCount: number
  startDate: string
}

export type TrackerData = Record<string, Entry>

const STORAGE_KEY = 'cig_tracker_v1'
const SETTINGS_KEY = 'cig_settings_v1'

export const DEFAULT_SETTINGS: Settings = {
  isPremium: false,
  dailyGoal: 10,
  reductionStep: 1,
  pricePerPack: 11,
  cigarettesPerPack: 20,
  notifEnabled: false,
  notifTime: '20:00',
  startCount: 20,
  startDate: new Date().toISOString().slice(0, 10),
}

export function loadData(): TrackerData {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function saveData(data: TrackerData): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
  catch (e) { console.error('localStorage write failed:', e) }
}

export function saveEntry(date: string, entry: Entry): TrackerData {
  const data = loadData()
  data[date] = entry
  saveData(data)
  return data
}

export function deleteEntry(date: string): TrackerData {
  const data = loadData()
  delete data[date]
  saveData(data)
  return data
}

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch { return DEFAULT_SETTINGS }
}

export function saveSettings(s: Settings): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)) }
  catch (e) { console.error('settings write failed:', e) }
}

export function getStorageSize(): string {
  if (typeof window === 'undefined') return '0 o'
  const d = localStorage.getItem(STORAGE_KEY) ?? ''
  const s = localStorage.getItem(SETTINGS_KEY) ?? ''
  const bytes = new Blob([d + s]).size
  return bytes < 1024 ? `${bytes} o` : `${(bytes / 1024).toFixed(1)} Ko`
}

export function exportCSV(data: TrackerData): void {
  const rows = [['Date', 'Cigarettes', 'Note']]
  Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([date, entry]) => {
      rows.push([date, String(entry.count), entry.note.replace(/,/g, ';')])
    })
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `suivi-tabac-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
