import React from 'react'

function CardTitle({ title}) {
  return (
    <p className="text-xs font-bold pb-2" style={{ color: 'var(--gray)' }}>{title}</p>
  );
}

export default CardTitle