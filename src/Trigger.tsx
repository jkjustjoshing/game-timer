import { User } from 'firebase/auth';
import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useRealtimeValue } from './useRealtimeValue';

export function Trigger({ room }: { room: string }) {
  const path = useCallback((user: User) => `rooms/${room}/end/${user.uid}`, [room])
  const [serverTimeOffset] = useRealtimeValue<number>('/.info/serverTimeOffset')

  const [end, setEnd, isInit] = useRealtimeValue<number>(room ? path : null)

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
