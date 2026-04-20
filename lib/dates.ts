// lib/dates.ts

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getDaysArray(n: number): string[] {
  const days: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export function fmtShort(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${parseInt(d)}/${parseInt(m)}`
}

export function fmtFull(iso: string): string {
  const [, m, d] = iso.split('-')
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  return `${parseInt(d)} ${months[parseInt(m) - 1]}`
}

export function fmtTodayLabel(): string {
  const s = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}
