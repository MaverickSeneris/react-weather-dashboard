import React from 'react'

function CancelButton({ nameSymbol, toggler}) {
  return (
    <button
      onClick={toggler}
      className="border-0 p-2 h-[100%] rounded-[10px] flex items-center justify-center font-semibold text-sm transition duration-150 active:scale-95"
      style={{
        backgroundColor: 'var(--red)',
        color: 'var(--bg-0)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.9';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {nameSymbol}
    </button>
  );
}

export default CancelButton