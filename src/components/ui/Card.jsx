import React from "react";

function Card({ children }) {
  return (
    <div className="border-0 p-6 h-max rounded-[20px] my-2 bg-slate-100 dark:bg-gray-800 w-[100%]">
      {children}
    </div>
  );
}

export default Card;
