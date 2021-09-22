import { User } from 'firebase/auth';
import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useProvider } from './context';
import { useRealtimeValue } from './useRealtimeValue';

export function Trigger() {
  const { room, roomData, serverTimeOffset } = useProvider()

  const path = useCallback((user: User) => `rooms/${room}/end/${user.uid}`, [room])
  const [end, setEnd, isInit] = useRealtimeValue<number>(room ? path : null)

  if (roomData.start == null) {
    return null
  }

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!isInit || serverTimeOffset === null) {
      return
    }
    const time = (new Date()).getTime() + serverTimeOffset
    setEnd(time)
  }

  return <>
    <button disabled={!isInit || end !== null} onClick={onClick}>End</button>
  </>
}
