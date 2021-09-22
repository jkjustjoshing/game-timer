import React, { MouseEventHandler } from 'react';
import { useProvider } from './context';
import { useClearRealtimeValue, useRealtimeValue } from './useRealtimeValue';
import styles from './Start.module.css'
import { useIsHere } from './useIsHere';
import { getMinUser } from './getMinUser';
import { formatTime } from './formatTime';

export function Start() {
  const { room } = useProvider()
  const [start, setStart, isInit] = useRealtimeValue<number>(room ? `rooms/${room}/start` : null)
  const [serverTimeOffset, , isTimeInit] = useRealtimeValue<number>('/.info/serverTimeOffset')

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const time = (new Date()).getTime()
    setStart(time + serverTimeOffset!)
  }

  if (!isInit || !isTimeInit || serverTimeOffset === null || start !== null) {
    return null
  }

  return <button
    onClick={onClick}
    className={styles.start}
  >Start</button>
}

export function PersistTimeToBeat() {
  const { room } = useProvider()
  const users = useIsHere(room)
  const [start, setStart, isInit] = useRealtimeValue<number>(room ? `rooms/${room}/start` : null)
  const [, setTimeToBeat, isTTBInit] = useRealtimeValue<number>(room ? `rooms/${room}/timeToBeat` : null)
  const clearRoomEnd = useClearRealtimeValue(room ? `rooms/${room}/end` : null)

  type U = (typeof users)[0]
  const minUser = getMinUser(users)

  if (!minUser || start === null) {
    return null
  }

  const ttb = minUser.end! - start

  const persistTimeToBeat = () => {
    if (minUser && minUser.end !== null && start !== null) {
      setTimeToBeat(minUser.end - start)
      setStart(null)
      clearRoomEnd()
    }
  }

  return <button className={styles.persist} onClick={persistTimeToBeat}>Set "time to beat" to {formatTime(ttb)} seconds</button>
}
