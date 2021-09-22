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
  const clearRoomEnd = useClearRealtimeValue(room ? `rooms/${room}/end` : null)

  const onStart = () => {
    const time = (new Date()).getTime()
    setStart(time + serverTimeOffset!)
  }
  const onWhoops = () => {
    setStart(null)
    clearRoomEnd()
  }

  if (!isInit || !isTimeInit || serverTimeOffset === null) {
    return null
  }

  if (start !== null) {
    return <button onClick={onWhoops} className={styles.whoops}>Whoops, start over</button>
  }

  return <button
    onClick={onStart}
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
    return <div className={styles.fill} />
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
