import React, { useCallback, useEffect, useRef } from 'react'
import { useProvider } from './context'
import { formatTime } from './formatTime'
import { useIsHere } from './useIsHere'
import styles from './Timer.module.css'
import { getMinUser } from './getMinUser'

export const Timer = () => {
  const { room, roomData, serverTimeOffset } = useProvider()
  const start = roomData.start ?? null

  const ref = useRef<HTMLDivElement>(null)
  const users = useIsHere(room)

  const minUser = getMinUser(users)
  console.log(minUser)

  const getIsRunning = useCallback(() => {
    if (start == null) {
      return false
    }
    if (!users.length || minUser) {
      return false
    }
    return true
  }, [start, minUser, users])

  const getDurationToDisplay = useCallback((now: number) => {
    if (!users.length) {
      return null
    }
    if (start == null) {
      return 0
    }

    if (!minUser) {
      // Timer is running
      console.log({ now, start })
      return now - start + serverTimeOffset
    } else {
      // Someone pressed their buzzer
      return minUser.end! - start
    }
  }, [start, minUser, users, serverTimeOffset])

  useEffect(() => {
    let isRunning = getIsRunning()
    let rAF: number

    function run() {
      if (!ref.current) {
        return
      }

      const durationToDisplay = getDurationToDisplay(Date.now())
      console.log({ durationToDisplay })
      ref.current.textContent = (durationToDisplay == null ? '-' : formatTime(durationToDisplay))
      if (getIsRunning() && isRunning) {
        rAF = requestAnimationFrame(run)
      }
    }

    run()

    return () => {
      cancelAnimationFrame(rAF)
      isRunning = false
    }

  }, [getIsRunning, getDurationToDisplay])

  return <div>
    <div className={styles.label}>Timer</div>
    <div className={styles.time} style={{ fontVariantNumeric: 'tabular-nums' }} ref={ref} />
  </div>
}
