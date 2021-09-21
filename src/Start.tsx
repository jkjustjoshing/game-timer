import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { formatTime } from './formatTime';
import { useRealtimeValue } from './useRealtimeValue';

export function Start({ room }: { room: string }) {
  const [start, setStart, isInit] = useRealtimeValue<number>(room ? `rooms/${room}/start` : null)
  const [serverTimeOffset, , isTimeInit] = useRealtimeValue<number>('/.info/serverTimeOffset')

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const time = (new Date()).getTime()
    setStart(time + serverTimeOffset!)
  }

  return <>
    <button disabled={!isInit || !isTimeInit || serverTimeOffset === null} onClick={onClick}>Start</button>
    <Timer start={start} offset={serverTimeOffset} />
  </>
}

const Timer = ({ start, offset }: { start: number | null, offset: number | null }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let toRun = true
    function run() {
      if (!ref.current) {
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

  }, [start])

  return <div style={{ fontVariantNumeric: 'tabular-nums' }} ref={ref} />
}
