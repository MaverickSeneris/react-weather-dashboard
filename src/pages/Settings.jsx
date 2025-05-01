import React from "react";
import Header from "../components/ui/Header";
import PageContainer from "../components/ui/PageContainer";
import WeatherSettings from "../components/WeatherSettings";

function Settings() {
  return (
    <PageContainer>
      <Header title={"Settings"} />
      <div className="mt-8">
        <WeatherSettings />
      </div>
    </PageContainer>
  );
}

export default Settings;
