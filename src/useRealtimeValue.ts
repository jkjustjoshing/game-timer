import { User } from 'firebase/auth'
import { DatabaseReference, getDatabase, off, onValue, ref, set } from 'firebase/database'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFirebaseApp, useUser } from './firebase'

export const useRealtimeValue = <T extends any>(path: null | string | ((user: User) => string)) => {
  const app = useFirebaseApp()
  const user = useUser()
  const nameRef = useRef<DatabaseReference>()

  const [val, setVal] = useState<T | null>(null)
  const [isInit, setIsInit] = useState(false)

  const onChange = (val: T | null) => {
    if (nameRef.current) {
      set(nameRef.current, val)
      setVal(val)
    }
  }

  useEffect(() => {
    if (!user || path === null) {
      return
    }

    const ppath = typeof path === 'function' ? path(user) : path
    console.log('effecting', ppath)
    const database = getDatabase(app)
    nameRef.current = ref(database, typeof path === 'function' ? path(user) : path)
    onValue(nameRef.current, s => {
      setVal(s.val())
      setIsInit(true)
    })

    return () => {
      if (nameRef.current) {
        off(nameRef.current)
        console.log('offValue', ppath)
        setIsInit(false)
        setVal(null)
      }
    }

  }, [user, path])

  return [isInit ? val : null, onChange, isInit] as const
}

export const useClearRealtimeValue = (path: null | string | ((user: User) => string)) => {
  const app = useFirebaseApp()
  const user = useUser()

  return useCallback(function clear() {
    if (!user || path === null) {
      return
    }
    const database = getDatabase(app)
    const pathRef = ref(database, typeof path === 'function' ? path(user) : path)
    set(pathRef, {})
  }, [])
}
