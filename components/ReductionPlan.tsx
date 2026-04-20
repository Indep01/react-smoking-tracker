// components/ReductionPlan.tsx
import { Settings } from '@/hooks/useStorage'
import { today, daysBetween } from '@/lib/dates'
import styles from './ReductionPlan.module.css'

type Props = { settings: Settings; todayCount: number }

export default function ReductionPlan({ settings, todayCount }: Props) {
  const { startCount, startDate, reductionStep, dailyGoal } = settings
  const weeksPassed = Math.floor(daysBetween(startDate, today()) / 7)
  const currentGoal = Math.max(dailyGoal, startCount - weeksPassed * reductionStep)
  const progress = Math.max(0, Math.min(100, (1 - todayCount / currentGoal) * 100))
  const underGoal = todayCount <= currentGoal

  const weeksToGoal = reductionStep > 0
    ? Math.ceil((currentGoal - dailyGoal) / reductionStep)
    : null

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <div className={styles.label}>Objectif aujourd'hui</div>
          <div className={`${styles.goal} ${underGoal ? styles.ok : styles.danger}`}>
            {todayCount} / {currentGoal} cigarettes
          </div>
        </div>
        <div className={`${styles.badge} ${underGoal ? styles.badgeOk : styles.badgeDanger}`}>
          {underGoal ? '✓ Objectif OK' : '⚠ Dépassé'}
        </div>
      </div>

      <div className={styles.barWrap}>
        <div
          className={`${styles.bar} ${underGoal ? styles.barOk : styles.barDanger}`}
          style={{ width: `${Math.min(100, (todayCount / currentGoal) * 100)}%` }}
        />
      </div>

      <div className={styles.footer}>
        <span>Semaine {weeksPassed + 1} · Palier : {currentGoal} cig/jour</span>
        {weeksToGoal !== null && weeksToGoal > 0 && (
          <span>Objectif final dans ~{weeksToGoal} semaine{weeksToGoal > 1 ? 's' : ''}</span>
        )}
        {weeksToGoal === 0 && <span className={styles.ok}>🎯 Objectif final atteint !</span>}
      </div>
    </div>
  )
}
