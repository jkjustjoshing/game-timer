import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { FirebaseProvider } from './firebase'

ReactDOM.render(
  <React.StrictMode>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
