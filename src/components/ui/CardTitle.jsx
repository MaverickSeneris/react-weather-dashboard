import React from 'react'

function CardTitle({ title}) {
  return (
    <p className="text-xs font-bold text-slate-500 dark:text-gray-400 pb-2">{title}</p>
  );
}

export default CardTitle