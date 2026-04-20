// components/HistoryList.tsx
import { TrackerData, deleteEntry } from '@/hooks/useStorage'
import { getDaysArray, fmtFull } from '@/lib/dates'
import styles from './HistoryList.module.css'

type Props = {
  data: TrackerData
  period: number
  onDelete: (date: string) => void
}

export default function HistoryList({ data, period, onDelete }: Props) {
  const days = getDaysArray(period).reverse()
  const entries = days.filter((d) => data[d])

  if (!entries.length) {
    return <p className={styles.empty}>Aucune entrée sur cette période.</p>
  }

  const max = Math.max(...entries.map((d) => data[d].count), 1)

  const handleDelete = (date: string) => {
    if (confirm(`Supprimer l'entrée du ${fmtFull(date)} ?`)) {
      const updated = deleteEntry(date)
      onDelete(date)
    }
  }

  return (
    <div className={styles.list}>
      {entries.map((d) => {
        const pct = Math.round((data[d].count / max) * 100)
        return (
          <div key={d} className={styles.item}>
            <div className={styles.date}>{fmtFull(d)}</div>
            <div className={styles.barWrap}>
              <div className={styles.bar} style={{ width: `${pct}%` }} />
            </div>
            <div className={styles.count}>{data[d].count}</div>
            <button
              className={styles.del}
              onClick={() => handleDelete(d)}
              title="Supprimer"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
