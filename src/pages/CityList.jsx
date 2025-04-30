import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Header from "../components/ui/Header";
import PageContainer from "../components/ui/PageContainer";
import mockCities from "../mockCities";
import Card from "../components/ui/Card";
import formatTime from "../utils/timeFormatter";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router";

function CityList() {
  const [searchMode, setSearchMode] = useState(false);
  const [favoriteCities, setFavoriteCities] = useState([]);

  // Track the city being dragged/swiped
  const [draggedId, setDraggedId] = useState(null);
  const [swiped, setSwiped] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedCities")) || [];
    setFavoriteCities(stored);
  }, [searchMode]);

  function toggleSearchMode() {
    setSearchMode((prevMode) => !prevMode);
  }
function handleDelete(id) {
  const updated = favoriteCities.filter((city) => city.cityId !== id);
  setFavoriteCities(updated);
  localStorage.setItem("savedCities", JSON.stringify(updated)); // \u2190 update storage
  setDraggedId(null);
  setSwiped(false);
}


  return (
    <PageContainer>
      {/* Header */}
      {!searchMode && <Header title={"My Cities"} />}

      {/* Search */}
      {searchMode ? (
        <SearchBar toggleSearchMode={toggleSearchMode} />
      ) : (
        <div
          onClick={toggleSearchMode}
          className="bg-gray-800 rounded-[10px] text-gray-500 p-2 mt-4"
        >
          Search City
        </div>
      )}

      {/* Favorite City Cards */}
      {!searchMode && (
        <div className="mt-6">
          {favoriteCities.map((city) => (
            <div
              key={city.cityId}
              className="relative flex items-center h-[100%]" // Parent flex container
              onTouchStart={() => {
                setDraggedId(city.cityId);
              }}
              onTouchMove={(e) => {
                const touchX = e.touches[0].clientX;
                if (touchX < 150) {
                  setSwiped(true); // activate squeezed look
                }
              }}
              onTouchEnd={() => {
                // optional: reset swipe if you want automatic return
                // setDraggedId(null);
                // setSwiped(false);
              }}
            >
              {/* Card */}
              <div
                className={`transition-all duration-400  ${
                  draggedId === city.cityId && swiped
                    ? "flex-grow-[0.95]" // squeezed when swiped
                    : "flex-grow"
                }`}
              >
                <Card>
                  <div className="flex justify-between">
                    <Link
                      to={`/test/${city.cityId || "unknown"}`}
                      key={city.cityId}
                      state={{
                        currentWeatherInfo: city,
                        cityName: city.name,
                      }}
                      className="flex flex-col justify-between h-8 visited:text-white"
                    >
                      <h2 className="font-bold text-2xl">{city.name}</h2>
                      <span className="text-sm font-bold text-gray-400">
                        {formatTime(city.time)}
                      </span>
                    </Link>
                    <div>
                      <span className="text-5xl font-regular">
                        {city.temperature}&deg;
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Delete Button - only if swiped this card */}
              {draggedId === city.cityId && swiped && (
                <button
                  onClick={() => handleDelete(city.cityId)}
                  className="ml-4 flex-shrink-0 p-5 bg-[#d53d3d] hover:bg-red-400 active:bg-red-400 focus:bg-red-400 text-white rounded-[15px] h-[100px] w-[20%]"
                >
                  <IoCloseSharp size={"35px"} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default CityList;
