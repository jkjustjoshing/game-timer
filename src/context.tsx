import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo } from 'react'
import { useRealtimeValue } from './useRealtimeValue'

type Room = {
  presence?: Record<string, boolean>,
  timeToBeat?: number,
  end?: Record<string, number>,
  start?: number
}

type Context = {
  room: string,
  name: string
  serverTimeOffset: number,
  roomData: Room
}

const context = createContext<null | Context>(null)

export const Provider = ({ room, children }: PropsWithChildren<{ room: string }>) => {
  const [roomData, setRoomData, isInit] = useRealtimeValue<Room>(`rooms/${room}`)

  const namePath = useCallback(user => {
    return `users/${user.uid}/name`
  }, [])
  const [name, , isNameInit] = useRealtimeValue<string>(namePath)

  const [serverTimeOffset, , isOffsetInit] = useRealtimeValue<number>('/.info/serverTimeOffset')

  const contextVal = useMemo(() => {
    if (!isInit || !isOffsetInit || !isNameInit) {
      return null
    }
    return {
      room,
      name: name || '',
      roomData: roomData || {},
      serverTimeOffset: serverTimeOffset || 0
    }
  }, [room, roomData, serverTimeOffset, name, isInit, isOffsetInit, isNameInit])

  if (contextVal === null) {
    return null
  }

  return (
    <context.Provider value={contextVal}>
      {children}
    </context.Provider>
  )
}

export const useProvider = () => {
  const ctx = useContext(context)
  if (!ctx) {
    throw new Error('Context missing')
  }
  return ctx
}
