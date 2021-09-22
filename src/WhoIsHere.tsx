import React from 'react'
import { formatTime } from './formatTime';
import { useIsHere } from './useIsHere';
import { useRealtimeValue, useClearRealtimeValue } from './useRealtimeValue';

export function WhoIsHere({ room }: { room: string }) {
  const [users, ends] = useIsHere(room)
  const [start, setStart, isInit] = useRealtimeValue<number>(room ? `rooms/${room}/start` : null)
  const [, setTimeToBeat, isTTBInit] = useRealtimeValue<number>(room ? `rooms/${room}/timeToBeat` : null)
  const clearRoomEnd = useClearRealtimeValue(room ? `rooms/${room}/end` : null)

  if (start === null) {
    return null
  }

  type U = (typeof users)[0]
  const minUser = users.reduce((u1: U | null, u2: U | null): U | null => {
    const e1 = u1 && ends[u1.uid]
    const e2 = u2 && ends[u2.uid]

    if (!e1) {
      if (e2) {
        return u2
      } else {
        return null
      }
    }
    if (!e2) {
      if (e1) {
        return u1
      } else {
        return null
      }
    }
    if (ends[u1.uid] < ends[u2.uid]) {
      return u1
    } else if (ends[u1.uid] > ends[u2.uid]) {
      return u2
    } else {
      throw new Error('TIE! ' + u1.name + ', ' + u2.name)
    }
  }, null)

  const persistTimeToBeat = () => {
    if (minUser) {
      setTimeToBeat(ends[minUser.uid] - start)
      setStart(null)
      clearRoomEnd()
    }
  }

  return <ul>
    {
      users.map((u, i) => {
        const isMin = (u === minUser)
        return <li key={i}>
          {u.name}{ends[u.uid] ? `- ${formatTime(ends[u.uid] - start)}` : ''}
          {isMin && (
            <button onClick={persistTimeToBeat}>PersistTimeToBeat</button>
          )}
        </li>
      })
    }
  </ul>
}
