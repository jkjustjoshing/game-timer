import { User } from 'firebase/auth';
import { DatabaseReference, getDatabase, off, onValue, ref, child, get } from 'firebase/database';
import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useFirebaseApp, useUser } from './firebase';
import { useRealtimeValue } from './useRealtimeValue';

export function WhoIsHere({ room }: { room: string }) {
  const users = useIsHere(room)
  console.log({ users })

  return <ul>
    {
      users.map((u, i) => {
        return <li key={i}>{u.name}</li>
      })
    }
  </ul>
}

export const useIsHere = (room: string | null) => {
  const app = useFirebaseApp()
  const user = useUser()
  const [users, setUsers] = useState<{ name: string }[]>([])
  useEffect(() => {
    if (!user || room === null) {
      return
    }

    const database = getDatabase(app)
    const presenceRef = ref(database, `rooms/${room}/presence`)
    const usersRef = ref(database, `users`)
    onValue(presenceRef, s => {
      const val = s.val() || {}
      Promise.all(Object.keys(val).filter(uid => val[uid]).map(async uid => {
        const user = await get(child(usersRef, uid))
        return user.val()
      })).then(users => {
        setUsers(users)
      })
    })

    return () => {
      if (presenceRef) {
        off(presenceRef)
        setUsers([])
      }
    }

  }, [user, room])

  return users
}
