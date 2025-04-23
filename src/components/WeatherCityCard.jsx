import React from "react";
import CardTitle from "./CardTitle";
import Card from "./Card";
import CurrentCityContainer from "./CurrentCityContainer";
import sampleIcon from "../assets/weather-icons/00_missing_data.svg";
import DailyContainer from "./DailyContainer";
import HourlyContainer from "./HourlyContainer";

function WeatherCityCard({ children }) {
  return (
    <div className="flex flex-col items-center w-100 px-4 mt-10 pb-2">
      <CurrentCityContainer
        cityName={"City Here"}
        popValue={0}
        weatherIcon={sampleIcon}
        tempValue={0}
      />
      <Card>
        <CardTitle title={"TODAY'S FORECAST"} />
        <HourlyContainer
          hourlyWeatherInfo={{ time: [], icon: [], temperature: [] }}
        />
      </Card>
      <Card>
        <CardTitle title={"7-DAY FORECAST"} />
        <DailyContainer />
      </Card>
      <Card>
        <CardTitle title={"CURRENT CONDITION"} />
      </Card>
    </div>
  );
}

export default WeatherCityCard;
