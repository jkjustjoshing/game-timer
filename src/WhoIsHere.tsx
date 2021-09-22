import React from 'react'
import { formatTime } from './formatTime';
import { getMinUser } from './getMinUser';
import { useIsHere } from './useIsHere';
import { useRealtimeValue, useClearRealtimeValue } from './useRealtimeValue';

export function WhoIsHere({ room, admin, className }: { room: string, admin?: boolean, className: string }) {
  const users = useIsHere(room)
  const [start, setStart, isInit] = useRealtimeValue<number>(room ? `rooms/${room}/start` : null)
  const [, setTimeToBeat, isTTBInit] = useRealtimeValue<number>(room ? `rooms/${room}/timeToBeat` : null)
  const clearRoomEnd = useClearRealtimeValue(room ? `rooms/${room}/end` : null)

  // if (start === null) {
  //   return null
  // }

  type U = (typeof users)[0]
  const minUser = getMinUser(users)

  const persistTimeToBeat = () => {
    if (minUser && minUser.end !== null && start !== null) {
      setTimeToBeat(minUser.end - start)
      setStart(null)
      clearRoomEnd()
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    const aEnd = a.end
    const bEnd = b.end
    if (aEnd && bEnd) {
      return aEnd - bEnd
    }
    if (aEnd) {
      return -1
    } else if (bEnd) {
      return 1
    } else {
      // Neither finished - alphabetical order
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    }
  })

  return <div className={className}>
    <h2>Competitors</h2>
    <ul>
      {
        sortedUsers.map((u, i) => {
          const isMin = (u === minUser)
          return <li key={i}>
            {u.name}
            {u.end && start !== null ? (
                ` - ${formatTime(u.end - start)} seconds`
              )
              : ''
            }
            {isMin && admin && (
              <button onClick={persistTimeToBeat}>PersistTimeToBeat</button>
            )}
          </li>
        })
      }
    </ul>
  </div>
}
