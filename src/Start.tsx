import React, { MouseEventHandler } from 'react';
import { useRealtimeValue } from './useRealtimeValue';

export function Start({ room }: { room: string }) {
  const [start, setStart, isInit] = useRealtimeValue<number>(room ? `rooms/${room}/start` : null)
  const [serverTimeOffset, , isTimeInit] = useRealtimeValue<number>('/.info/serverTimeOffset')

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const time = (new Date()).getTime()
    setStart(time + serverTimeOffset!)
  }

  return <>
    <button disabled={!isInit || !isTimeInit || serverTimeOffset === null || start !== null} onClick={onClick}>Start</button>
  </>
}
