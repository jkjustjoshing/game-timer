import React from 'react';
import { useProvider } from './context';

export function Name() {
  const p = useProvider()
  console.log(p)

  return <div className='name'>{p.name}</div>
}
