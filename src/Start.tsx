import React, { MouseEventHandler } from 'react';
import { useProvider } from './context';
import { useRealtimeValue } from './useRealtimeValue';

export function Start() {
  const { room } = useProvider()
  const [start, setStart, isInit] = useRealtimeValue<number>(room ? `rooms/${room}/start` : null)
  const [serverTimeOffset, , isTimeInit] = useRealtimeValue<number>('/.info/serverTimeOffset')

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const time = (new Date()).getTime()
    setStart(time + serverTimeOffset!)
  }

  console.log({ isInit,isTimeInit,serverTimeOffsetIsNull: serverTimeOffset === null, startIsNotNull: start !== null, start })

  return <>
    <button disabled={!isInit || !isTimeInit || serverTimeOffset === null || start !== null} onClick={onClick}>Start</button>
  </>
}
