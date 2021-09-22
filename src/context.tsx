import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react'
import { useRealtimeValue } from './useRealtimeValue'

type Room = {
  presence?: Record<string, boolean>,
  timeToBeat?: number,
  end?: Record<string, number>,
  start?: number
}

type Context = {
  room: string,
  serverTimeOffset: number,
  roomData: Room
}

const context = createContext<null | Context>(null)

export const Provider = ({ room, children }: PropsWithChildren<{ room: string }>) => {
  const [roomData, setRoomData, isInit] = useRealtimeValue<Room>(`rooms/${room}`)
  const [serverTimeOffset] = useRealtimeValue<number>('/.info/serverTimeOffset')

  useEffect(() => {
    if (isInit && !roomData) {
      setRoomData({})
    }
  }, [isInit, roomData, setRoomData])

  const contextVal = useMemo(() => {
    console.log(isInit, serverTimeOffset)
    if (!isInit || serverTimeOffset === null) {
      return null
    }
    return {
      room,
      roomData: roomData || {},
      serverTimeOffset
    }
  }, [room, roomData, serverTimeOffset])


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
