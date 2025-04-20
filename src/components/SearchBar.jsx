import React, { useState } from "react";

function SearchBar() {
  const [cityName, setCityname] = useState("");

  function handleSubmit(e) {
    e.preventDefault()
    console.log(cityName)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={"flex gap-2"}>
        <input
          className={"border"}
          type="text"
          placeholder="enter city name..."
          value={cityName}
          onChange={e => setCityname(e.target.value)}

        />
        <button type="submit" className={"border rounded p-1"}>Search</button>
      </form>
    </div>
  );
}

export default SearchBar;
