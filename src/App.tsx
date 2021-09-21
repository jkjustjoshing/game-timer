import React, { useState, useEffect, useCallback } from 'react'
import logo from './logo.svg'
import './App.css'
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth"
import { getDatabase, ref, onValue, off, set } from "firebase/database";
import { useUser, useFirebaseApp } from './firebase'
import { Input } from './Input';
import { Start } from './Start';
import { Trigger } from './Trigger';
import { Presence } from './Presence';
import { WhoIsHere } from './WhoIsHere';


function App() {
  const [count, setCount] = useState(0)
  const user = useUser()
  const app = useFirebaseApp()
  const [room, setRoom] = useState('')

  return (
    <div className="App">
      <Input path={useCallback(user => `users/${user.uid}/name`, [])} placeholder="Name" />
      <input placeholder="Room" value={room} onChange={e => setRoom(e.target.value)} />
      <Start room={room} />
      <Trigger room={room} />
      <Presence room={room} />

      <WhoIsHere room={room} />
    </div>
  )
}

export default App
