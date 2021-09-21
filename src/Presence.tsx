import { User } from 'firebase/auth';
import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useRealtimeValue } from './useRealtimeValue';

export function Presence({ room }: { room: string }) {
  const path = useCallback((user: User) => `rooms/${room}/presence/${user.uid}`, [room])
  const [here, setHere, isInit] = useRealtimeValue<boolean>(room ? path : null)

  useEffect(() => {
    if (isInit) {
      setHere(true)
      const beforeunload = () => { setHere(false) }
      window.addEventListener('beforeunload', beforeunload)
      return () => {
        setHere(false)
        window.removeEventListener('beforeunload', beforeunload)
      }
    }

  }, [isInit])

  return null
}
