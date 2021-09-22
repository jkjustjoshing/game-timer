import { User } from 'firebase/auth';
import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useProvider } from './context';
import { useRealtimeValue } from './useRealtimeValue';
import styles from './Trigger.module.css'

export function Trigger() {
  const { room, roomData, serverTimeOffset } = useProvider()

  const path = useCallback((user: User) => `rooms/${room}/end/${user.uid}`, [room])
  const [end, setEnd, isInit] = useRealtimeValue<number>(room ? path : null)

  if (roomData.start == null) {
    return <div className={styles.ready + ' button'}>Ready...</div>
  }

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!isInit || serverTimeOffset === null) {
      return
    }
    const time = (new Date()).getTime() + serverTimeOffset
    setEnd(time)
  }

  if (end !== null) {
    return <div className={styles.done + ' button'}>Done!</div>
  } else {
    return <button className={styles.endButton} disabled={!isInit || end !== null} onClick={onClick}>Go!!</button>
  }
}
