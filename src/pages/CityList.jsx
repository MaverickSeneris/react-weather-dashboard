import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Header from "../components/ui/Header";
import PageContainer from "../components/ui/PageContainer";

function CityList() {
  const [searchMode, setSearchMode] = useState(false);

  function toggleSearchMode() {
    setSearchMode((prevMode) => !prevMode);
  }

  console.log(searchMode);
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
    </PageContainer>
  );
}

export default CityList;
