import React from "react";


function Header({ title }) {
  return <h1 className="font-bold text-4xl" style={{ color: 'var(--fg)' }}>{title}</h1>;
}

export default Header;
