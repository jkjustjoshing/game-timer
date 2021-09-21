import React, { useEffect, useRef } from 'react'
import { formatTime } from './formatTime'
import { useIsHere } from './useIsHere'
import { useRealtimeValue } from './useRealtimeValue'

export const Timer = ({ room }: { room: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [start, setStart, isInit] = useRealtimeValue<number>(room ? `rooms/${room}/start` : null)
  const [offset] = useRealtimeValue<number>('/.info/serverTimeOffset')
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
      if (start === null || offset === null || !toRun) {
        ref.current.textContent = ''
        return
      }
      const time = (new Date()).getTime() + offset
      const elapsed = time - start

      ref.current.textContent = formatTime(elapsed)

      requestAnimationFrame(run)
    }

    run()

    return () => { toRun = false }

  }, [start, isRunning])

  return <div style={{ fontVariantNumeric: 'tabular-nums' }} ref={ref} />
}
