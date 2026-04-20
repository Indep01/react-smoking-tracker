// app/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  loadSettings, saveSettings, DEFAULT_SETTINGS, Settings,
  exportCSV, loadData, getStorageSize
} from '@/hooks/useStorage'
import { today } from '@/lib/dates'
import styles from './settings.module.css'

export default function SettingsPage() {
  const router = useRouter()
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS)
  const [storageSize, setStorageSize] = useState('—')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setS(loadSettings())
    setStorageSize(getStorageSize())
  }, [])

  const update = (key: keyof Settings, val: unknown) => {
    setS(prev => ({ ...prev, [key]: val }))
  }

  const handleSave = () => {
    saveSettings(s)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const handleExport = () => {
    exportCSV(loadData())
  }

  const handleUnlockPremium = () => {
    // En production : ici tu intègres Google Play Billing ou Stripe
    // Pour la démo, on active directement
    const updated = { ...s, isPremium: true }
    setS(updated)
    saveSettings(updated)
    alert('Premium activé ! (mode démo)')
  }

  const handleReset = () => {
    if (confirm('Supprimer toutes les données ? Cette action est irréversible.')) {
      localStorage.clear()
      router.push('/')
    }
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => router.push('/')}>←</button>
        <h1 className={styles.title}>Paramètres</h1>
        <button className={styles.saveBtn} onClick={handleSave}>
          {saved ? '✓' : 'Sauver'}
        </button>
      </header>

      {/* Premium */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Compte</p>
        <div className={styles.card}>
          <div className={styles.row}>
            <div>
              <div className={styles.rowLabel}>Statut</div>
              <div className={styles.rowVal}>
                {s.isPremium ? '⭐ Premium' : '🔒 Gratuit'}
              </div>
            </div>
            {!s.isPremium && (
              <button className={styles.premiumBtn} onClick={handleUnlockPremium}>
                Passer Premium — 2,99€
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Objectif */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Plan de réduction</p>
        <div className={styles.card}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Consommation de départ (cig/jour)</label>
            <input
              type="number"
              className={styles.input}
              value={s.startCount}
              min={1}
              onChange={e => update('startCount', parseInt(e.target.value) || 1)}
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Objectif final (cig/jour)</label>
            <input
              type="number"
              className={styles.input}
              value={s.dailyGoal}
              min={0}
              onChange={e => update('dailyGoal', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Réduction par semaine (cig)</label>
            <input
              type="number"
              className={styles.input}
              value={s.reductionStep}
              min={1}
              onChange={e => update('reductionStep', parseInt(e.target.value) || 1)}
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Date de début du plan</label>
            <input
              type="date"
              className={styles.input}
              value={s.startDate}
              max={today()}
              onChange={e => update('startDate', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Prix */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Prix des cigarettes</p>
        <div className={styles.card}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Prix d'un paquet (€)</label>
            <input
              type="number"
              className={styles.input}
              value={s.pricePerPack}
              min={1}
              step={0.5}
              onChange={e => update('pricePerPack', parseFloat(e.target.value) || 11)}
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Cigarettes par paquet</label>
            <input
              type="number"
              className={styles.input}
              value={s.cigarettesPerPack}
              min={1}
              onChange={e => update('cigarettesPerPack', parseInt(e.target.value) || 20)}
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Notifications</p>
        <div className={styles.card}>
          <div className={styles.row}>
            <div className={styles.rowLabel}>Rappel quotidien</div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={s.notifEnabled}
                onChange={e => {
                  if (e.target.checked && 'Notification' in window) {
                    Notification.requestPermission()
                  }
                  update('notifEnabled', e.target.checked)
                }}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
          {s.notifEnabled && (
            <>
              <div className={styles.divider} />
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Heure du rappel</label>
                <input
                  type="time"
                  className={styles.input}
                  value={s.notifTime}
                  onChange={e => update('notifTime', e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Données */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Données</p>
        <div className={styles.card}>
          <div className={styles.row}>
            <div className={styles.rowLabel}>Espace utilisé</div>
            <div className={styles.rowVal}>{storageSize}</div>
          </div>
          <div className={styles.divider} />
          <button className={styles.actionBtn} onClick={handleExport}>
            📥 Exporter en CSV
          </button>
          <div className={styles.divider} />
          <button className={`${styles.actionBtn} ${styles.dangerBtn}`} onClick={handleReset}>
            🗑 Supprimer toutes les données
          </button>
        </div>
      </section>
    </main>
  )
}
