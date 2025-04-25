import React from 'react'

function CancelButton({ nameSymbol, toggler}) {
  return (
    <button
      onClick={toggler}
      className="border-0 p-2 h-[100%] rounded-[10px] bg-[#d53d3d] hover:bg-red-400 active:bg-red-400 focus:bg-red-400 flex items-center justify-center font-semibold text-sm
    transition duration-150 active:scale-95"
    >
      {nameSymbol}
    </button>
  );
}

export default CancelButton