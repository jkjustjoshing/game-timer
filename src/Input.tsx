import { User } from 'firebase/auth';
import React from 'react';
import { useRealtimeValue } from './useRealtimeValue';

type InputProps<T extends string | number> = { path: (user: User) => string } & (
  T extends string ? { type?: 'text' | never } : { type: 'number' }
) & Omit<React.HTMLProps<HTMLInputElement>, 'disabled' | 'onChange' | 'value' | 'type'>

export function Input<T extends string | number>({ path, ...props }: InputProps<T>) {
  const [val, setVal, isInit] = useRealtimeValue<T>(path)

  return <input {...props} disabled={!isInit} value={val || ''} onChange={e => {
    setVal((props.type === 'number' ? Number(e.target.value) : e.target.value) as any)
  }} />
}
