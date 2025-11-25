import React from "react";

function Card({ children }) {
  return (
    <div className="border-0 p-6 h-max rounded-[20px] my-2 w-[100%]" style={{ backgroundColor: 'var(--bg-1)' }}>
      {children}
    </div>
  );
}

export default Card;
