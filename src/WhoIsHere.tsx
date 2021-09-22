import React from 'react'
import { useProvider } from './context';
import { formatTime } from './formatTime';
import { useIsHere } from './useIsHere';

export function WhoIsHere({ className }: { className?: string }) {
  const { room, roomData } = useProvider()
  const start = roomData?.start ?? null
  const users = useIsHere(room)

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
          return <li key={i}>
            {u.name}
            {u.end && start !== null ? (
                ` - ${formatTime(u.end - start)} seconds`
              )
              : ''
            }
          </li>
        })
      }
    </ul>
  </div>
}
