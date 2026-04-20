// components/PremiumGate.tsx
import styles from './PremiumGate.module.css'

type Props = {
  onUnlock: () => void
}

export default function PremiumGate({ onUnlock }: Props) {
  return (
    <div className={styles.gate}>
      <div className={styles.icon}>⭐</div>
      <p className={styles.title}>Fonctionnalité Premium</p>
      <p className={styles.sub}>Débloquez toutes les fonctionnalités pour 2,99€ une seule fois</p>
      <button className={styles.btn} onClick={onUnlock}>
        Passer à Premium
      </button>
    </div>
  )
}
