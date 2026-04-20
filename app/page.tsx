// app/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import StatCard from '@/components/StatCard'
import HistoryList from '@/components/HistoryList'
import ReductionPlan from '@/components/ReductionPlan'
import AdvancedStats from '@/components/AdvancedStats'
import PremiumGate from '@/components/PremiumGate'
import {
  loadData, saveEntry, loadSettings, saveSettings,
  exportCSV, TrackerData, Settings, DEFAULT_SETTINGS
} from '@/hooks/useStorage'
import { today, getDaysArray, fmtTodayLabel } from '@/lib/dates'
import styles from './page.module.css'

const ConsumptionChart = dynamic(() => import('@/components/ConsumptionChart'), {
  ssr: false,
  loading: () => <div style={{ height: 180 }} />,
})

const PERIODS = [
  { label: '7 jours', value: 7 },
  { label: '14 jours', value: 14 },
  { label: '30 jours', value: 30 },
]

const TABS = ['Suivi', 'Statistiques', 'Historique']

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState<TrackerData>({})
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [count, setCount] = useState(0)
  const [note, setNote] = useState('')
  const [period, setPeriod] = useState(7)
  const [activeTab, setActiveTab] = useState(0)
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [todayLabel, setTodayLabel] = useState('')

  useEffect(() => {
    const loaded = loadData()
    const loadedSettings = loadSettings()
    setData(loaded)
    setSettings(loadedSettings)
    const t = today()
    if (loaded[t]) { setCount(loaded[t].count); setNote(loaded[t].note) }
    setTodayLabel(fmtTodayLabel())
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2200)
  }

  const handleSave = () => {
    const updated = saveEntry(today(), { count, note, ts: Date.now() })
    setData({ ...updated })
    showToast('Entrée enregistrée ✓')
  }

  const handleDelete = useCallback(() => {
    setData({ ...loadData() })
  }, [])

  const handleUnlockPremium = () => {
    // En production : intégrer Google Play Billing / Stripe ici
    const updated = { ...settings, isPremium: true }
    setSettings(updated)
    saveSettings(updated)
    showToast('⭐ Premium activé !')
  }

  // Stats
  const t = today()
  const todayVal = data[t]?.count ?? 0
  const d7 = getDaysArray(7).map(d => data[d]?.count).filter((v): v is number => v !== undefined)
  const avg7 = d7.length ? Math.round(d7.reduce((a, b) => a + b, 0) / d7.length) : null
  const weekTotal = getDaysArray(7).reduce((s, d) => s + (data[d]?.count ?? 0), 0)
  const allVals = Object.values(data).map(e => e.count).filter(v => v > 0)
  const bestDay = allVals.length ? Math.min(...allVals) : null

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <p className={styles.headerSub}>Suivi tabac</p>
          <h1 className={styles.headerDate}>{todayLabel}</h1>
        </div>
        <button className={styles.settingsBtn} onClick={() => router.push('/settings')} aria-label="Paramètres">
          ⚙️
        </button>
      </header>

      {/* Nav tabs */}
      <nav className={styles.nav}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`${styles.navTab} ${activeTab === i ? styles.navTabActive : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* ═══ TAB 0 : SUIVI ═══ */}
      {activeTab === 0 && (
        <>
          <section className={styles.statsGrid}>
            <StatCard label="Aujourd'hui" value={todayVal} />
            <StatCard label="Moy. 7 jours" value={avg7 !== null ? avg7 : '—'} />
            <StatCard label="Cette semaine" value={weekTotal} />
            <StatCard label="Record bas" value={bestDay !== null ? bestDay : '—'} variant="ok" />
          </section>

          {/* Plan de réduction */}
          <section className={styles.section}>
            <p className={styles.sectionLabel}>Plan de réduction</p>
            {settings.isPremium ? (
              <ReductionPlan settings={settings} todayCount={todayVal} />
            ) : (
              <PremiumGate onUnlock={handleUnlockPremium} />
            )}
          </section>

          {/* Saisie */}
          <section className={styles.section}>
            <p className={styles.sectionLabel}>Ajouter une entrée</p>
            <div className={styles.logCard}>
              <div className={styles.counter}>
                <button className={styles.countBtn} onClick={() => setCount(c => Math.max(0, c - 1))} aria-label="Diminuer">−</button>
                <div className={styles.countWrap}>
                  <span className={styles.countNum}>{count}</span>
                  <span className={styles.countLabel}>cigarettes</span>
                </div>
                <button className={styles.countBtn} onClick={() => setCount(c => c + 1)} aria-label="Augmenter">+</button>
              </div>
              <div className={styles.divider} />
              <textarea
                className={styles.noteInput}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Note (optionnel)..."
                rows={3}
              />
            </div>
            <button className={styles.saveBtn} onClick={handleSave}>
              Enregistrer pour aujourd'hui
            </button>
          </section>

          {/* Graphique */}
          <section className={styles.section}>
            <p className={styles.sectionLabel}>Visualisation</p>
            <div className={styles.tabs}>
              {PERIODS.map(p => (
                <button
                  key={p.value}
                  className={`${styles.tab} ${period === p.value ? styles.tabActive : ''}`}
                  onClick={() => setPeriod(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <ConsumptionChart data={data} period={period} />
          </section>
        </>
      )}

      {/* ═══ TAB 1 : STATISTIQUES ═══ */}
      {activeTab === 1 && (
        <section className={styles.section} style={{ paddingTop: '1.25rem' }}>
          <p className={styles.sectionLabel}>Statistiques avancées</p>
          {settings.isPremium ? (
            <AdvancedStats data={data} settings={settings} />
          ) : (
            <PremiumGate onUnlock={handleUnlockPremium} />
          )}

          <p className={styles.sectionLabel} style={{ marginTop: '1.5rem' }}>Export</p>
          {settings.isPremium ? (
            <button className={styles.exportBtn} onClick={() => exportCSV(data)}>
              📥 Exporter mes données en CSV
            </button>
          ) : (
            <PremiumGate onUnlock={handleUnlockPremium} />
          )}
        </section>
      )}

      {/* ═══ TAB 2 : HISTORIQUE ═══ */}
      {activeTab === 2 && (
        <section className={styles.section} style={{ paddingTop: '1.25rem' }}>
          <div className={styles.tabs} style={{ marginBottom: 16 }}>
            {PERIODS.map(p => (
              <button
                key={p.value}
                className={`${styles.tab} ${period === p.value ? styles.tabActive : ''}`}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <HistoryList data={data} period={period} onDelete={handleDelete} />
        </section>
      )}

      {/* Toast */}
      <div className={`${styles.toast} ${toastVisible ? styles.toastVisible : ''}`}>
        {toast}
      </div>
    </main>
  )
}
