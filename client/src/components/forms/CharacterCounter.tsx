import React from 'react';

interface CharacterCounterProps {
  current: number;
  max: number;
}

export function CharacterCounter({ current, max }: CharacterCounterProps) {
  const percentage = (current / max) * 100;
  
  let colorClass = 'text-gray-400';
  if (current >= max) {
    colorClass = 'text-red-500';
  } else if (percentage >= 100) {
    colorClass = 'text-yellow-500';
  } else if (percentage >= 80) {
    colorClass = 'text-green-500';
  }

  return (
    <div className={`text-xs text-right mt-1 font-medium ${colorClass}`}>
      {current} / {max}
    </div>
  );
}
