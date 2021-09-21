import { User } from 'firebase/auth';
import { DatabaseReference, getDatabase, off, onValue, ref, child, get } from 'firebase/database';
import { useEffect, useRef, useState } from 'react';
import { useFirebaseApp, useUser } from './firebase';

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
