import React from "react";

function Card({ children, style, className = "", compact = false }) {
  const paddingClass = compact 
    ? "pt-4 px-4 pb-2"  // Reduced bottom padding for city list cards
    : "p-4";             // Equal padding for all other cards
  
  return (
    <div 
      className={`border-0 ${paddingClass} h-max rounded-[20px] my-1 w-[100%] ${className}`}
      style={{ backgroundColor: 'var(--bg-1)', ...style }}
    >
      {children}
    </div>
  );
}

export default Card;
