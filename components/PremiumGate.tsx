'use client'
import { useState } from 'react'
import { loadSettings, saveSettings } from '@/hooks/useStorage'
import styles from './PremiumGate.module.css'

type Props = { onUnlock: () => void }

export default function PremiumGate({ onUnlock }: Props) {
  const [showCode, setShowCode] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handlePremium = () => {
    window.open('https://karabilamahmoud.gumroad.com/l/mkaproduct', '_blank')
    setShowCode(true)
  }

  const handleActivate = () => {
    if (code.trim().toUpperCase() === 'SUIVI-PRO') {
      const settings = loadSettings()
      saveSettings({ ...settings, isPremium: true })
      onUnlock()
    } else {
      setError('Code invalide. Vérifiez votre email de confirmation.')
    }
  }

  return (
    <div className={styles.gate}>
      <div className={styles.icon}>⭐</div>
      <p className={styles.title}>Fonctionnalité Premium</p>
      <p className={styles.sub}>Débloquez tout pour <strong>2,99€</strong> — paiement unique, à vie</p>

      <button className={styles.btn} onClick={handlePremium}>
        Passer à Premium — 2,99€
      </button>

      {showCode && (
        <div className={styles.codeWrap}>
          <p className={styles.codeInfo}>
            Après paiement, entrez le code reçu par email :
          </p>
          <input
            className={styles.codeInput}
            type="text"
            placeholder="Ex: SUIVI-PRO"
            value={code}
            onChange={e => { setCode(e.target.value); setError('') }}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btnActivate} onClick={handleActivate}>
            Activer le Premium
          </button>
        </div>
      )}
    </div>
  )
}