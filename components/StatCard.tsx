// components/StatCard.tsx
import styles from './StatCard.module.css'

type Props = {
  label: string
  value: string | number
  variant?: 'default' | 'danger' | 'ok'
}

export default function StatCard({ label, value, variant = 'default' }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={`${styles.value} ${styles[variant]}`}>{value}</div>
    </div>
  )
}
