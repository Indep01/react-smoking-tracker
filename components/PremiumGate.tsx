'use client'
import { useState } from 'react'
import styles from './PremiumGate.module.css'

type Props = { onUnlock: () => void }

export default function PremiumGate({ onUnlock }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePremium = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Erreur lors de la création du paiement. Réessaie.')
      }
    } catch {
      setError('Erreur réseau. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.gate}>
      <div className={styles.icon}>⭐</div>
      <p className={styles.title}>Fonctionnalité Premium</p>
      <p className={styles.sub}>Débloquez tout pour <strong>2,99€</strong> — paiement unique, à vie</p>
      {error && <p className={styles.error}>{error}</p>}
      <button className={styles.btn} onClick={handlePremium} disabled={loading}>
        {loading ? 'Chargement...' : 'Passer à Premium — 2,99€'}
      </button>
    </div>
  )
}