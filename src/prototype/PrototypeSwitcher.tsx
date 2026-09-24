import { useCallback, useEffect, useState, type CSSProperties } from 'react'

const KEYS = ['A', 'B', 'C'] as const
export type PrototypeVariant = (typeof KEYS)[number]

export const VARIANT_META: Record<
  PrototypeVariant,
  { name: string; blurb: string }
> = {
  A: {
    name: 'Runway',
    blurb: 'Countdown hero · dual calendars on the rail',
  },
  B: {
    name: 'Spine',
    blurb: 'Interview journey spine · study nested in phases',
  },
  C: {
    name: 'Pulse',
    blurb: 'Anti-shame focus · calendar as full view',
  },
}

function readVariant(): PrototypeVariant {
  const v = new URLSearchParams(window.location.search).get('variant')
  if (v === 'A' || v === 'B' || v === 'C') return v
  return 'A'
}

export function usePrototypeVariant(): {
  variant: PrototypeVariant
  setVariant: (v: PrototypeVariant) => void
} {
  const [variant, setVariantState] = useState<PrototypeVariant>(readVariant)

  const setVariant = useCallback((v: PrototypeVariant) => {
    const url = new URL(window.location.href)
    url.searchParams.set('variant', v)
    window.history.replaceState({}, '', url)
    setVariantState(v)
  }, [])

  useEffect(() => {
    const onPop = () => setVariantState(readVariant())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return { variant, setVariant }
}

/** PROTOTYPE ONLY — floating switcher. Hidden in production builds. */
export function PrototypeSwitcher({
  variant,
  setVariant,
}: {
  variant: PrototypeVariant
  setVariant: (v: PrototypeVariant) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      ) {
        return
      }
      const i = KEYS.indexOf(variant)
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setVariant(KEYS[(i - 1 + KEYS.length) % KEYS.length]!)
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setVariant(KEYS[(i + 1) % KEYS.length]!)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [variant, setVariant])

  if (!import.meta.env.DEV) return null

  const i = KEYS.indexOf(variant)
  const meta = VARIANT_META[variant]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 999,
        background: '#111',
        color: '#f5f5f5',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
      }}
    >
      <button
        type="button"
        aria-label="Previous variant"
        onClick={() => setVariant(KEYS[(i - 1 + KEYS.length) % KEYS.length]!)}
        style={btnStyle}
      >
        ←
      </button>
      <span style={{ minWidth: 200, textAlign: 'center' }}>
        <strong>
          {variant} · {meta.name}
        </strong>
        <div style={{ opacity: 0.7, fontSize: 11 }}>{meta.blurb}</div>
      </span>
      <button
        type="button"
        aria-label="Next variant"
        onClick={() => setVariant(KEYS[(i + 1) % KEYS.length]!)}
        style={btnStyle}
      >
        →
      </button>
    </div>
  )
}

const btnStyle: CSSProperties = {
  background: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: 999,
  width: 36,
  height: 36,
  cursor: 'pointer',
  fontSize: 16,
}
