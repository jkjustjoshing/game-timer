import React, { useState, useEffect, useCallback, createContext } from 'react'
import logo from './logo.svg'
import './App.css'
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth"
import { getDatabase, ref, onValue, off, set } from "firebase/database";
import { useUser, useFirebaseApp } from './firebase'
import { Input } from './Input';
import { Start } from './Start';
import { Timer } from './Timer';
import { Trigger } from './Trigger';
import { TimeToBeat } from './TimeToBeat';
import { Presence } from './Presence';
import { WhoIsHere } from './WhoIsHere';
import { Provider } from './context';


function App() {
  const [count, setCount] = useState(0)
  const user = useUser()
  const app = useFirebaseApp()
  const [room, setRoom] = useState('')
  const [timeToBeat, setTimeToBeat] = useState(0)


  return (
    <div className="App">
      <Input path={useCallback(user => `users/${user.uid}/name`, [])} placeholder="Name" />
      <input placeholder="Room" value={room} onChange={e => setRoom(e.target.value)} />

      {!room ? null : (
        <Provider room={room}>
          <Start />
          <Timer />
          <TimeToBeat />
          <Trigger room={room} />
          <Presence room={room} />

          <WhoIsHere room={room} />
        </Provider>
      )}
    </div>
  )
}

export default App
