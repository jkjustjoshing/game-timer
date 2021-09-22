import { Name } from './Name';
import { Start } from './Start';
import { Timer } from './Timer';
import { Trigger } from './Trigger';
import { TimeToBeat } from './TimeToBeat';
import { Presence } from './Presence';
import { WhoIsHere } from './WhoIsHere';
import { Provider, useProvider } from './context';
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
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
  let { path, url } = useRouteMatch();

  if (!room || !name) {
    return <Redirect to='..' />
  }

  return (
    <>
      <Timer />
      <TimeToBeat />
      <Switch>
        <Route exact path={path}>
          <Name />
          <Trigger />
          <Presence room={room} />
          <WhoIsHere room={room} />
        </Route>
        <Route path={`${path}/admin`}>
          <Start />
          <WhoIsHere room={room} admin />
        </Route>
      </Switch>
    </>
  )
}
