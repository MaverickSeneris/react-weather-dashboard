import React, { useState } from "react";
import CityCard from "./ui/CityCard";

const mockData = [
  {
    name: "Barcelona",
    temp: 29,
    condition: "sunny",
    time: 1745600580,
    id: 12341234,
  },
  {
    name: "Bilbao",
    temp: 27,
    condition: "rainy",
    time: 1745600580,
    id: 56785678,
  },
  {
    name: "Madrid",
    temp: 31,
    condition: "sunny",
    time: 1745604180,
    id: 578567856,
  },
  {
    name: "Malaga",
    temp: 33,
    condition: "cloudy",
    time: 1745600580,
    id: 90678234,
  },
];

function SearchBar() {
  const [cities, setCities] = useState(mockData);
  const [searchMode, setSearchMode] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();
    console.log(cityName);
    setSearchMode(!searchMode);
  }

  function toggleSearch() {
    setSearchMode(!searchMode);
  }

  console.log(searchMode);

  return (
    <div className="app">
      <input
        type="text"
        placeholder="Search city"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-gray-800 rounded-[10px] my-4 px-2 py-3 w-[100%]"
      />
      <div className="city-list">
        {filteredCities.map((city, index) => (
          <CityCard key={index} data={city} />
        ))}
      </div>
    </div>

    // <div>
    //   {!searchMode ? (
    //     <div
    //       onClick={toggleSearch}
    //       className="bg-gray-800 rounded-[10px] my-4 px-2 py-3"
    //     >
    //       <p>Search for cities</p>
    //     </div>
    //   ) : (
    //     <form onSubmit={handleSubmit} className={"flex gap-2"}>
    //       <input
    //         className={"border"}
    //         type="text"
    //         placeholder="enter city name..."
    //         value={cityName}
    //         onChange={(e) => setCityname(e.target.value)}
    //       />
    //       <button type="submit" className={"border rounded p-1"}>
    //         Search
    //       </button>
    //     </form>
    //   )}
    // </div>
  );
}

export default SearchBar;
