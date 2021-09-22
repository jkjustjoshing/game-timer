import React, { useEffect, useRef } from 'react'
import { useProvider } from './context'
import { formatTime } from './formatTime'
import { useIsHere } from './useIsHere'
import { useRealtimeValue } from './useRealtimeValue'

export const Timer = () => {
  const { room, roomData, serverTimeOffset } = useProvider()
  const start = roomData.start ?? null

  const ref = useRef<HTMLDivElement>(null)
  const [users, ends] = useIsHere(room)
  let isRunning = true
  if (users && ends && users.every(u => ends[u.uid])) {
    isRunning = false
  }

  useEffect(() => {
    let toRun = true
    function run() {
      if (!ref.current || !isRunning) {
        return
      }
      if (start === null || serverTimeOffset === null || !toRun) {
        ref.current.textContent = ''
        return
      }
      const time = (new Date()).getTime() + serverTimeOffset
      const elapsed = time - start

      ref.current.textContent = formatTime(elapsed)

      requestAnimationFrame(run)
    }

    run()

    return () => { toRun = false }

  }, [start, isRunning])

  return <div style={{ fontVariantNumeric: 'tabular-nums' }} ref={ref} />
}
