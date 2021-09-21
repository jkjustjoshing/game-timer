// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth"
import { getDatabase, ref, onValue, off, set } from "firebase/database";
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
export const getApp = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBYIHGRUizgUmHIh_FNdOk23JOtdOuVUJU",
    authDomain: "game-timer-64b5c.firebaseapp.com",
    projectId: "game-timer-64b5c",
    storageBucket: "game-timer-64b5c.appspot.com",
    messagingSenderId: "608013255432",
    appId: "1:608013255432:web:2cb9c94b74314b15abe2bd"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  return app
}

const firebaseContext = createContext<FirebaseApp | null>(null)
const firebaseUser = createContext<User | null>(null)

export function FirebaseProvider({ children }: PropsWithChildren<{}>) {
  const [count, setCount] = useState(0)
  const [error, setError] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [app] = useState(() => getApp())

  useEffect(() => {
    signInAnonymously(getAuth(app)).catch(() => { setError(true) })
  }, [])

  useEffect(() => {
    onAuthStateChanged(getAuth(app), user => {
      setUser(user)
    })
  }, [])

  if (error) {
    return <div>Error connecting to server</div>
  }

  if (!user) {
    return <div>Loading</div>
  }

  return <firebaseContext.Provider value={app}>
    <firebaseUser.Provider value={user}>
      {children}
    </firebaseUser.Provider>
  </firebaseContext.Provider>
}

export const useUser = () => {
  const user = useContext(firebaseUser)
  if (!firebaseUser) {
    throw new Error('No user')
  }
  return user
}
export const useFirebaseApp = () => {
  const firebase = useContext(firebaseContext)
  if (!firebase) {
    throw new Error('No firebase')
  }
  return firebase
}
