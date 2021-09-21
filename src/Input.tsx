import { User } from 'firebase/auth';
import React from 'react';
import { useRealtimeValue } from './useRealtimeValue';

type InputProps = {
  path: (user: User) => string
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'disabled' | 'onChange' | 'value'>

export function Input({ path, ...props }: InputProps) {
  const [val, setVal, isInit] = useRealtimeValue<string>(path)

  return <input {...props} disabled={!isInit} value={val || ''} onChange={e => setVal(e.target.value)} />
}
