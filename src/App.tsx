import React, { useState, useEffect, useCallback, createContext, FormEventHandler } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import { Input } from './Input';
import { Room } from './Room';
import { Trivia } from './trivia';


function App() {

  return (
    <Router>
      <Switch>
        <Route path='/trivia'>
          <Trivia />
        </Route>
        <Route path="/:roomId">
          <Room />
        </Route>
        <Route exact path="/">
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
    <form className='landing' onSubmit={onSubmit}>
      <label htmlFor="name">Your Name</label>
      <Input path={useCallback(user => `users/${user.uid}/name`, [])} required id="name" autoFocus />
      <label htmlFor="room">Room Code</label>
      <input name='room' required id="room" autoCapitalize="off" autoComplete="off" autoCorrect="off"  />
      <button type="submit">Submit</button>
    </form>
  )
}


export default App
