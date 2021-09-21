import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useRealtimeValue } from './useRealtimeValue';

export function Start({ room }: { room: string }) {
  const [start, setStart, isInit] = useRealtimeValue<number>(room ? `rooms/${room}/start` : null)
  const [serverTimeOffset, , isTimeInit] = useRealtimeValue<number>('/.info/serverTimeOffset')

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const time = (new Date()).getTime()
    console.log({ serverTimeOffset })
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

const formatTime = (ms: number) => {
  let hundredths = Math.round(ms / 10)
  let seconds = hundredths / 100
  hundredths = (seconds - Math.floor(seconds)) * 100
  seconds = Math.floor(seconds)
  let minutes = seconds / 60
  seconds = (minutes - Math.floor(minutes)) * 60
  minutes = Math.floor(minutes)
  let hours = minutes / 60
  minutes = (hours - Math.floor(hours)) * 60
  hours = Math.floor(hours)
  const strs = [
    hours ? hours.toFixed(0) : null,
    minutes ? minutes.toFixed(0).padStart(2, '0') : null,
    seconds ? seconds.toFixed(0).padStart(2, '0') : '00'
  ]
  let nonEmpty = []
  for (let i of strs) {
    if (i || nonEmpty.length) {
      nonEmpty.push(i)
    }
  }
  return nonEmpty.join(':') + '.' + hundredths.toFixed(0).padStart(2, '0')
}
