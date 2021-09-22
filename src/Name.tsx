import React from 'react';
import { useProvider } from './context';

export function Name({ className }: { className: string }) {
  const p = useProvider()

  return <div className={className}>{p.name}</div>
}
