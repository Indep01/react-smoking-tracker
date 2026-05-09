'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadSettings, saveSettings } from '@/hooks/useStorage'
import styles from './success.module.css'

export default function SuccessPage() {
  const router = useRouter()
  useEffect(() => {
    const settings = loadSettings()
    saveSettings({ ...settings, isPremium: true })
    const timer = setTimeout(() => router.push('/'), 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.icon}>⭐</div>
        <h1 className={styles.title}>Premium activé !</h1>
        <p className={styles.sub}>Merci pour ton achat. Toutes les fonctionnalités sont débloquées.</p>
        <p className={styles.redirect}>Redirection dans 3 secondes...</p>
        <button className={styles.btn} onClick={() => router.push('/')}>Retourner à l'app</button>
      </div>
    </main>
  )
}