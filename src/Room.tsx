import { Name } from './Name';
import { PersistTimeToBeat, Start } from './Start';
import { Timer } from './Timer';
import { Trigger } from './Trigger';
import { Presence } from './Presence';
import { WhoIsHere } from './WhoIsHere';
import { Provider, useProvider } from './context';
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import React from 'react';
import styles from './Room.module.css';

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
    <div className={styles.wrapper}>
      <Switch>
        <Route exact path={path}>
          <Name className={styles.name} />
        </Route>
      </Switch>

      <div className={styles.content}>
        <Switch>
          <Route exact path={path}>
            <Trigger />
            <Presence room={room} />
            <WhoIsHere className={styles.competitors + ' ' + styles.bottom} />
          </Route>
          <Route path={`${path}/admin`}>
            <Timer />
            <div className={styles.bottom}>
              <Start />
              <PersistTimeToBeat />
              <WhoIsHere className={styles.competitors} />
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  )
}
