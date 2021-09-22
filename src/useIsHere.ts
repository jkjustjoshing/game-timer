import { User } from 'firebase/auth';
import { DatabaseReference, getDatabase, off, onValue, ref, child, get } from 'firebase/database';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFirebaseApp, useUser } from './firebase';

export const useIsHere = (room: string | null) => {
  const app = useFirebaseApp()
  const user = useUser()
  const [users, setUsers] = useState<{ name: string, uid: string }[] | null>(null)
  const [ends, setEnds] = useState<Record<string, number | undefined> | null>(null)

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
      setEnds(ends || {})
    })

    return () => {
      if (presenceRef) {
        off(presenceRef)
        off(endRef)
        setUsers(null)
        setEnds(null)
      }
    }

  }, [user, room])

  return useMemo(() => {
    if (!users || !ends) {
      return []
    }

    return users.map(user => {
      return { ...user, end: ends[user.uid] ?? null }
    })
  }, [users, ends])
}
