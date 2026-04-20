// components/AdvancedStats.tsx
import { TrackerData, Settings } from '@/hooks/useStorage'
import { getDaysArray, today, daysBetween } from '@/lib/dates'
import styles from './AdvancedStats.module.css'

type Props = { data: TrackerData; settings: Settings }

function computeStreak(data: TrackerData, goal: number): number {
  let streak = 0
  const days = getDaysArray(90).reverse()
  for (const d of days) {
    if (d === today() && !data[d]) continue // aujourd'hui pas encore saisi
    if (data[d] && data[d].count <= goal) streak++
    else break
  }
  return streak
}

function computeTrend(data: TrackerData): { value: number; label: string } {
  const last7 = getDaysArray(7).map(d => data[d]?.count ?? null).filter((v): v is number => v !== null)
  const prev7 = getDaysArray(14).slice(0, 7).map(d => data[d]?.count ?? null).filter((v): v is number => v !== null)
  if (!last7.length || !prev7.length) return { value: 0, label: 'Pas assez de données' }
  const avg7 = last7.reduce((a, b) => a + b, 0) / last7.length
  const avgPrev = prev7.reduce((a, b) => a + b, 0) / prev7.length
  const diff = Math.round(((avg7 - avgPrev) / avgPrev) * 100)
  if (diff < 0) return { value: diff, label: `${Math.abs(diff)}% de moins que la semaine passée 📉` }
  if (diff > 0) return { value: diff, label: `${diff}% de plus que la semaine passée 📈` }
  return { value: 0, label: 'Stable par rapport à la semaine passée' }
}

function computeSavings(data: TrackerData, settings: Settings): { money: number; cigs: number } {
  const { startCount, startDate, pricePerPack, cigarettesPerPack } = settings
  const pricePerCig = pricePerPack / cigarettesPerPack
  const days = getDaysArray(daysBetween(startDate, today()) + 1)
  let savedCigs = 0
  days.forEach(d => {
    const actual = data[d]?.count ?? startCount
    savedCigs += Math.max(0, startCount - actual)
  })
  return {
    cigs: savedCigs,
    money: Math.round(savedCigs * pricePerCig * 100) / 100,
  }
}

export default function AdvancedStats({ data, settings }: Props) {
  const streak = computeStreak(data, settings.dailyGoal)
  const trend = computeTrend(data)
  const savings = computeSavings(data, settings)

  const allCounts = Object.values(data).map(e => e.count)
  const totalDays = Object.keys(data).length
  const totalCigs = allCounts.reduce((a, b) => a + b, 0)
  const bestDay = allCounts.length ? Math.min(...allCounts) : null
  const worstDay = allCounts.length ? Math.max(...allCounts) : null

  return (
    <div className={styles.wrap}>
      {/* Streak */}
      <div className={styles.card}>
        <div className={styles.cardIcon}>🔥</div>
        <div>
          <div className={styles.cardVal}>{streak} jour{streak > 1 ? 's' : ''}</div>
          <div className={styles.cardLabel}>Objectif respecté d'affilée</div>
        </div>
      </div>

      {/* Tendance */}
      <div className={styles.card}>
        <div className={styles.cardIcon}>{trend.value <= 0 ? '📉' : '📈'}</div>
        <div>
          <div className={`${styles.cardVal} ${trend.value < 0 ? styles.ok : trend.value > 0 ? styles.danger : ''}`}>
            {trend.value === 0 ? 'Stable' : `${trend.value > 0 ? '+' : ''}${trend.value}%`}
          </div>
          <div className={styles.cardLabel}>{trend.label.replace(/📉|📈/g, '').trim()}</div>
        </div>
      </div>

      {/* Économies */}
      <div className={styles.card}>
        <div className={styles.cardIcon}>💰</div>
        <div>
          <div className={styles.cardVal}>{savings.money.toFixed(2)} €</div>
          <div className={styles.cardLabel}>{savings.cigs} cigarettes non fumées</div>
        </div>
      </div>

      {/* Total */}
      <div className={styles.card}>
        <div className={styles.cardIcon}>📊</div>
        <div>
          <div className={styles.cardVal}>{totalDays} jours</div>
          <div className={styles.cardLabel}>{totalCigs} cigarettes fumées au total</div>
        </div>
      </div>

      {/* Records */}
      <div className={styles.doubleCard}>
        <div className={styles.half}>
          <div className={styles.cardLabel}>Meilleur jour</div>
          <div className={`${styles.cardVal} ${styles.ok}`}>{bestDay !== null ? bestDay : '—'}</div>
        </div>
        <div className={styles.separator} />
        <div className={styles.half}>
          <div className={styles.cardLabel}>Pire jour</div>
          <div className={`${styles.cardVal} ${styles.danger}`}>{worstDay !== null ? worstDay : '—'}</div>
        </div>
      </div>
    </div>
  )
}
