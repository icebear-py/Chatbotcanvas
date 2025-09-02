import React from 'react'

type Item<T extends string> = { value: T; label: string; icon?: React.ReactNode }
type Props<T extends string> = { value: T; onChange: (v: T) => void; items: Item<T>[] }

export default function SegmentedControl<T extends string>({ value, onChange, items }: Props<T>) {
  return (
    <div className="glass inline-flex rounded-2xl p-1">
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`group relative inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm transition
              ${active ? 'bg-white/10 text-white shadow-glow' : 'text-slate-300 hover:text-white hover:bg-white/5'}
            `}
            aria-pressed={active}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}