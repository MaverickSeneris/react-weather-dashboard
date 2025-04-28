import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Header from "../components/ui/Header";
import PageContainer from "../components/ui/PageContainer";
import currentWeatherData from "../../src/mockWeatherData.json";
import mockCities from "../mockCities";
import Card from "../components/ui/Card";
import formatTime from "../utils/timeFormatter";

function CityList() {
  const [searchMode, setSearchMode] = useState(false);
  const [favoriteCities, setFavoriteCities] = useState(mockCities);

  console.log(favoriteCities);

  function toggleSearchMode() {
    setSearchMode((prevMode) => !prevMode);
  }

  return (
    <PageContainer>
      {!searchMode && <Header title={"My Cities"} />}

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
      {!searchMode && (
        <div className="mt-6">
          {favoriteCities.map((city) => {
            return (
              <div className="mb-4">
                <Card>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col ">
                      <h2 className="font-bold text-2xl">{city.name}</h2>
                      <span className="text-sm font-bold text-gray-400">
                        {formatTime(city.time)}
                      </span>
                    </div>
                    <div>
                      <span className="text-5xl font-medium">
                        {city.temperature}&deg;
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}

export default CityList;
