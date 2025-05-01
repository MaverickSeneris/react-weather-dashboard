import React from "react";
import Header from "../components/ui/Header";
import WindyMapEmbed from "../components/WindyMap"


function WeatherMap() {
  return (
    <div className="px-4 pt-8">
      <Header title={"Map"} />
      <div className="mt-4">
        <WindyMapEmbed />
      </div>
    </div>
  );
}

export default WeatherMap;
