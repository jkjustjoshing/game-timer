import React, { useState, useEffect, useCallback, createContext, FormEventHandler } from 'react'
import logo from './logo.svg'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
  Redirect
} from 'react-router-dom';
import { useUser, useFirebaseApp } from './firebase'
import { Input } from './Input';
import { Name } from './Name';
import { Start } from './Start';
import { Timer } from './Timer';
import { Trigger } from './Trigger';
import { TimeToBeat } from './TimeToBeat';
import { Presence } from './Presence';
import { WhoIsHere } from './WhoIsHere';
import { Provider, useProvider } from './context';


function App() {
  const [count, setCount] = useState(0)
  const user = useUser()
  const app = useFirebaseApp()
  const [room, setRoom] = useState('')
  const [timeToBeat, setTimeToBeat] = useState(0)

  return (
    <Router>
      <Switch>
        <Route path="/:roomId">
          <RoomWrapper />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )

}

function Home () {
  const history = useHistory()

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    const roomEle = (e.target as any).room

    history.push(`/${roomEle.value}`)
  }

  return (
    <form className="App" onSubmit={onSubmit}>
      <Input path={useCallback(user => `users/${user.uid}/name`, [])} placeholder="Name" required />
      <input placeholder="Room" name='room' required />
      <button type="submit">Submit</button>
    </form>
  )
}

function RoomWrapper () {
  const { roomId } = useParams<{ roomId: string }>()

  return (
    <Provider room={roomId}>
      <Room />
    </Provider>
  )
}

function Room () {
  const { room, name } = useProvider()
  if (!room || !name) {
    return <Redirect to='..' />
  }

  return <>
    <Name />
    <Start />
    <Timer />
    <TimeToBeat />
    <Trigger room={room} />
    <Presence room={room} />

    <WhoIsHere room={room} />
  </>
}

export default App
