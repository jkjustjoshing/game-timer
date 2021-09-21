import React from 'react'
import { formatTime } from './formatTime';
import { useIsHere } from './useIsHere';
import { useRealtimeValue } from './useRealtimeValue';

export function WhoIsHere({ room }: { room: string }) {
  const [users, ends] = useIsHere(room)
  const [start, , isInit] = useRealtimeValue<number>(room ? `rooms/${room}/start` : null)

  if (start === null) {
    return null
  }

  return <ul>
    {
      users.map((u, i) => {
        return <li key={i}>{u.name}{ends[u.uid] ? `- ${formatTime(ends[u.uid] - start)}` : ''}</li>
      })
    }
  </ul>
}
