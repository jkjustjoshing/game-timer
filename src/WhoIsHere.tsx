import { User } from 'firebase/auth';
import { DatabaseReference, getDatabase, off, onValue, ref, child, get } from 'firebase/database';
import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useFirebaseApp, useUser } from './firebase';
import { formatTime } from './formatTime';
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

export const useIsHere = (room: string | null) => {
  const app = useFirebaseApp()
  const user = useUser()
  const [users, setUsers] = useState<{ name: string, uid: string }[]>([])
  const [ends, setEnds] = useState<{ [uid: string]: number }>({})

  useEffect(() => {
    if (!user || room === null) {
      return
    }

    const database = getDatabase(app)
    const presenceRef = ref(database, `rooms/${room}/presence`)
    const endRef = ref(database, `rooms/${room}/end`)
    const usersRef = ref(database, `users`)
    onValue(presenceRef, s => {
      const val = s.val() || {}
      Promise.all(Object.keys(val).filter(uid => val[uid]).map(async uid => {
        const user = await get(child(usersRef, uid))
        return { ...user.val(), uid }
      })).then(users => {
        setUsers(users)
      })
    })
    onValue(endRef, r => {
      const ends = r.val()
      if (ends) {
        setEnds(ends)
      }
    })

    return () => {
      if (presenceRef) {
        off(presenceRef)
        off(endRef)
        setUsers([])
        setEnds({})
      }
    }

  }, [user, room])

  return [users, ends] as const
}
