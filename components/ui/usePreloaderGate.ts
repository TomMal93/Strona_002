import { useEffect, useState } from 'react'

const MIN_VISIBLE_MS = 600

type GateState = 'loading' | 'ready'

export function usePreloaderGate(active: boolean): GateState {
  const [state, setState] = useState<GateState>('loading')

  useEffect(() => {
    if (!active) {
      setState('ready')
      return
    }

    const timeoutId = window.setTimeout(() => {
      setState('ready')
    }, MIN_VISIBLE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [active])

  return state
}
