// components/ConsumptionChart.tsx
'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'
import { TrackerData } from '@/hooks/useStorage'
import { getDaysArray, fmtShort } from '@/lib/dates'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

type Props = {
  data: TrackerData
  period: number
}

function barColor(v: number | null): string {
  if (v === null || v === 0) return '#B4B2A9'
  if (v > 15) return '#E24B4A'
  if (v > 8) return '#EF9F27'
  return '#378ADD'
}

export default function ConsumptionChart({ data, period }: Props) {
  const days = getDaysArray(period)
  const labels = days.map(fmtShort)
  const values = days.map((d) => (data[d] ? data[d].count : 0))
  const colors = days.map((d) => barColor(data[d] ? data[d].count : null))

  return (
    <div style={{ position: 'relative', width: '100%', height: 180 }}>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'Cigarettes',
              data: values,
              backgroundColor: colors,
              borderRadius: 4,
              borderSkipped: false,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>{ const v = ctx.parsed.y ?? 0; return `${v} cigarette${v > 1 ? 's' : ''}` },
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { size: 11 },
                color: '#888780',
                maxRotation: 0,
                autoSkip: period > 14,
              },
            },
            y: {
              grid: { color: 'rgba(136,135,128,0.15)' },
              ticks: { font: { size: 11 }, color: '#888780', stepSize: 5 },
              beginAtZero: true,
              min: 0,
            },
          },
        }}
      />
    </div>
  )
}
