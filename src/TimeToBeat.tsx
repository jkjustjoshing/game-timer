import React, { useEffect, useRef } from 'react'
import { useProvider } from './context'
import { formatTime } from './formatTime'
import { useIsHere } from './useIsHere'
import { useRealtimeValue } from './useRealtimeValue'

export const TimeToBeat = () => {
  const { roomData } = useProvider()
  const { timeToBeat } = roomData

  if (timeToBeat == null) {
    return null
  }

  return <div style={{ fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeToBeat)}</div>
}
