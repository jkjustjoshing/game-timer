import React, { useState } from 'react'
import { Link, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import * as data from './data'

export const Trivia = () => {
  let { path } = useRouteMatch<{ playerCount: string }>();
  const params = new URLSearchParams(useLocation().search)

  const playerCount = Number(params.get('playerCount'))

  return (
    <>
      <Switch>
        {
          (Object.keys(data) as (keyof typeof data)[]).map((key) => (
            <Route key={key} path={`${path}/${key}` as string}>
              <Game items={data[key] as any} playerCount={playerCount} />
            </Route>
          ))
        }
        <Index />
      </Switch>
    </>
  )
}

const Index = () => {
  let { path } = useRouteMatch();
  const [playerCount, setPlayerCount] = useState(1)

  return (
    <>
      <label htmlFor='playerCount'>Number of players</label>
      <input
        id='playerCount'
        style={{ fontSize: 30 }}
        placeholder="Number of players"
        type="number"
        value={playerCount}
        onChange={(e) => setPlayerCount(Number(e.target.value))}
      />
      <ul>
        {
          Object.keys(data).map(l => (
            <li key={l}><Link to={`${path}/${l}?playerCount=${playerCount}`}>{l}</Link></li>
          ))
        }
      </ul>
    </>
  )
}

import styles from './Items.module.css'

export const Game = <T extends { name: string }>({ items, playerCount }: { items: T[], playerCount: number }) => {
  const cellCount = playerCount // + 1
  const [names, setNames] = useState<string[]>(new Array(playerCount).fill(''))
  console.log(items)
  return <div className={styles.wrapper} style={{ gridTemplateColumns: `repeat(${Math.ceil(cellCount / 2)}, 1fr)` }}>
    {
      new Array(playerCount).fill(null).map((_,i) => (
        <div key={i} className={styles.singleGame}>
          <input placeholder="Player name" className={styles.name} value={names[i]} onChange={e => {
            setNames(n => {
              let newNames = [...n]
              newNames[i] = e.target.value
              return newNames
            })
          }} />
          <SingleGame items={items} />
        </div>
      ))
    }
    {/* <div style={{ height: `calc(${100 / Math.ceil(cellCount / 2) + 'vh'} - 10px)` }} className={styles.singleGame}>
      Questions:
    </div> */}
  </div>
}

export const SingleGame = <T extends { name: string }>({ items: _items }: { items: T[] }) => {
  const [items, setItems] = useState(() => _items.map(item => ({ item, alive: true })))

  const toggle = (item: (typeof items)[0]['item']) => () => {
    setItems(items => items.map(i => i.item !== item ? i : { item, alive: !i.alive }))
  }

  const cols = 4
  return (
    <ul className={styles.list} style={{
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${Math.ceil(items.length / cols)}, 1fr)`
    }}>
      {
        items.map(({ item, alive }) => {
          return <li key={item.name}>
            <button onClick={toggle(item)} className={styles.button} style={{ opacity: alive ? 1 : 0.2, color: alive ? undefined : 'black' }}>
              {item.name}
            </button>
          </li>
        })
      }
    </ul>
  )
}

