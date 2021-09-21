import { User } from 'firebase/auth';
import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useRealtimeValue } from './useRealtimeValue';

export function Trigger({ room }: { room: string }) {
  const path = useCallback((user: User) => `rooms/${room}/end/${user.uid}`, [room])

  const [end, setEnd, isInit] = useRealtimeValue<number>(room ? path : null)

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const time = (new Date()).getTime() + 0 /* offset */
    setEnd(time)
  }

  return <>
    <button disabled={!isInit} onClick={onClick}>End</button>
  </>
}
