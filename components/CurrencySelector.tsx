'use client'

import { CURRENCIES } from '@/lib/currency'

export default function CurrencySelector({ 
  selected, 
  onChange 
}: { 
  selected: string, 
  onChange: (val: string) => void 
}) {
  return (
    <div className="inline-flex items-center gap-2 bg-ink-900 border border-ink-800 rounded-lg px-3 py-1.5">
      <span className="text-xs text-ink-500 hidden sm:inline">Currency:</span>
      <select 
        value={selected} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm text-ink-100 font-medium outline-none cursor-pointer"
      >
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code} className="bg-ink-900 text-ink-100">
            {c.code} ({c.symbol})
          </option>
        ))}
      </select>
    </div>
  )
}
