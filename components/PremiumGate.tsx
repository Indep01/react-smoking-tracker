'use client'
import { useState } from 'react'
import { loadSettings, saveSettings } from '@/hooks/useStorage'
import styles from './PremiumGate.module.css'

type Props = { onUnlock: () => void }

export default function PremiumGate({ onUnlock }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handlePremium = () => {
    window.open('https://karabilamahmoud.gumroad.com/l/mkaproduct', '_blank')
    setTimeout(() => setShowConfirm(true), 2000)
  }

  const handleAlreadyBought = () => {
    const settings = loadSettings()
    saveSettings({ ...settings, isPremium: true })
    onUnlock()
  }

  return (
    <div className={styles.gate}>
      <div className={styles.icon}>⭐</div>
      <p className={styles.title}>Fonctionnalité Premium</p>
      <p className={styles.sub}>Débloquez tout pour <strong>2,99€</strong> — paiement unique, à vie</p>
      <button className={styles.btn} onClick={handlePremium}>
        Passer à Premium — 2,99€
      </button>
      {showConfirm && (
        <button className={styles.btnSecondary} onClick={handleAlreadyBought}>
          ✓ J'ai déjà acheté — Activer
        </button>
      )}
    </div>
  )
}