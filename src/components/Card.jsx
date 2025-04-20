import React from "react";

function Card({ children }) {
  return (
    <div className="border-0 p-3 h-max rounded-[20px] my-2 bg-gray-800 w-[100%]">
      {children}
    </div>
  );
}

export default Card;
