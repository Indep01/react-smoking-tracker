'use client'
import styles from './PremiumGate.module.css'

type Props = { onUnlock: () => void }

export default function PremiumGate({ onUnlock }: Props) {
  const handlePremium = () => {
    window.location.href = 'https://karabilamahmoud.gumroad.com/l/mkaproduct'
  }

  return (
    <div className={styles.gate}>
      <div className={styles.icon}>⭐</div>
      <p className={styles.title}>Fonctionnalité Premium</p>
      <p className={styles.sub}>Débloquez tout pour <strong>2,99€</strong> — paiement unique, à vie</p>
      <button className={styles.btn} onClick={handlePremium}>
        Passer à Premium — 2,99€
      </button>
    </div>
  )
}