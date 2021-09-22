import { Name } from './Name';
import { Start } from './Start';
import { Timer } from './Timer';
import { Trigger } from './Trigger';
import { TimeToBeat } from './TimeToBeat';
import { Presence } from './Presence';
import { WhoIsHere } from './WhoIsHere';
import { Provider, useProvider } from './context';
import { Redirect, useParams } from 'react-router-dom';
import React from 'react';
import './Room.css';

export function Room () {
  const { roomId } = useParams<{ roomId: string }>()

  return (
    <Provider room={roomId}>
      <RoomContents />
    </Provider>
  )
}

function RoomContents () {
  const { room, name } = useProvider()
  if (!room || !name) {
    return <Redirect to='..' />
  }

  return <>
    <Name />
    <Start />
    <Timer />
    <TimeToBeat />
    <Trigger />
    <Presence room={room} />

    <WhoIsHere room={room} />
  </>
}
