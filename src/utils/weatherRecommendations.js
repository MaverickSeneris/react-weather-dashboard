// Generate weather-based recommendations

export const getWeatherRecommendations = (weatherData) => {
  if (!weatherData || !weatherData.current) return null;

  const { temperature, feelsLike, uvIndex, chanceOfRain, windSpeed, humidity, description } = weatherData.current;
  const recommendations = {
    clothing: [],
    accessories: [],
    activities: [],
    tips: []
  };

  // Temperature-based clothing recommendations
  if (temperature < 0) {
    recommendations.clothing.push("Heavy winter coat", "Warm boots", "Gloves", "Thermal layers");
    recommendations.tips.push("Extreme cold - limit outdoor exposure");
  } else if (temperature < 10) {
    recommendations.clothing.push("Winter jacket", "Warm sweater", "Long pants", "Closed-toe shoes");
    recommendations.tips.push("Cold weather - dress in layers");
  } else if (temperature < 20) {
    recommendations.clothing.push("Light jacket or sweater", "Long sleeves", "Jeans or long pants");
    recommendations.tips.push("Cool weather - bring a light layer");
  } else if (temperature < 30) {
    recommendations.clothing.push("T-shirt or light top", "Shorts or light pants", "Comfortable shoes");
    recommendations.tips.push("Pleasant weather - perfect for outdoor activities");
  } else {
    recommendations.clothing.push("Lightweight clothing", "Tank top or short sleeves", "Shorts", "Sandals");
    recommendations.tips.push("Hot weather - stay hydrated and wear light colors");
  }

  // Rain recommendations
  if (chanceOfRain > 50) {
    recommendations.accessories.push("Umbrella", "Rain jacket");
    recommendations.tips.push("High chance of rain - bring rain gear");
  } else if (chanceOfRain > 30) {
    recommendations.accessories.push("Light rain jacket or umbrella");
    recommendations.tips.push("Possible rain - be prepared");
  }

  // UV Index recommendations
  if (uvIndex >= 8) {
    recommendations.accessories.push("Sunglasses", "Sunscreen (SPF 50+)", "Hat");
    recommendations.tips.push("Very high UV - avoid prolonged sun exposure");
  } else if (uvIndex >= 6) {
    recommendations.accessories.push("Sunglasses", "Sunscreen (SPF 30+)");
    recommendations.tips.push("High UV - protect your skin");
  } else if (uvIndex >= 3) {
    recommendations.accessories.push("Sunglasses", "Sunscreen");
    recommendations.tips.push("Moderate UV - some protection needed");
  }

  // Wind recommendations
  if (windSpeed > 15) {
    recommendations.tips.push("Strong winds - secure loose items");
    recommendations.accessories.push("Windbreaker");
  }

  // Humidity recommendations
  if (humidity > 80) {
    recommendations.tips.push("High humidity - feels warmer than actual temperature");
  } else if (humidity < 30) {
    recommendations.tips.push("Low humidity - stay hydrated");
  }

  // Activity recommendations based on weather
  const desc = description?.toLowerCase() || "";
  if (desc.includes("rain") || desc.includes("storm") || chanceOfRain > 60) {
    recommendations.activities.push("Indoor activities", "Visit museums", "Shopping", "Read a book");
  } else if (temperature > 25 && uvIndex < 6) {
    recommendations.activities.push("Beach day", "Outdoor sports", "Picnic", "Swimming");
  } else if (temperature > 15 && temperature < 25) {
    recommendations.activities.push("Walking", "Cycling", "Outdoor dining", "Park visit");
  } else if (temperature < 5) {
    recommendations.activities.push("Indoor activities", "Hot beverages", "Winter sports");
  } else {
    recommendations.activities.push("Outdoor walk", "Light exercise", "Enjoy the weather");
  }

  return recommendations;
};

// Get weather alerts (only alarming conditions)
export const getWeatherAlerts = (weatherData) => {
  if (!weatherData || !weatherData.current) return [];

  const { temperature, feelsLike, uvIndex, chanceOfRain, windSpeed, description } = weatherData.current;
  const alerts = [];

  // Extreme temperature alerts
  if (temperature > 40) {
    alerts.push({
      type: "danger",
      icon: "🌡️",
      title: "Extreme Heat Warning",
      message: `Temperature is ${temperature}°C. Avoid outdoor activities and stay hydrated.`
    });
  } else if (temperature < -10) {
    alerts.push({
      type: "danger",
      icon: "🥶",
      title: "Extreme Cold Warning",
      message: `Temperature is ${temperature}°C. Risk of frostbite and hypothermia. Limit outdoor exposure.`
    });
  } else if (temperature > 35) {
    alerts.push({
      type: "warning",
      icon: "🌡️",
      title: "Heat Alert",
      message: `Hot weather (${temperature}°C). Stay cool and hydrated.`
    });
  } else if (temperature < 0) {
    alerts.push({
      type: "warning",
      icon: "❄️",
      title: "Freezing Alert",
      message: `Freezing temperatures (${temperature}°C). Bundle up and be cautious.`
    });
  }

  // UV Index alerts
  if (uvIndex >= 11) {
    alerts.push({
      type: "danger",
      icon: "☀️",
      title: "Extreme UV Alert",
      message: `UV Index is ${uvIndex} (Extreme). Avoid sun exposure between 10 AM - 4 PM.`
    });
  } else if (uvIndex >= 8) {
    alerts.push({
      type: "warning",
      icon: "☀️",
      title: "Very High UV",
      message: `UV Index is ${uvIndex} (Very High). Protect your skin with sunscreen and clothing.`
    });
  }

  // Rain/Storm alerts
  if (chanceOfRain > 90 || description?.toLowerCase().includes("thunderstorm")) {
    alerts.push({
      type: "danger",
      icon: "⛈️",
      title: "Severe Weather Alert",
      message: `Heavy rain or thunderstorms expected. Stay indoors and avoid outdoor activities.`
    });
  } else if (chanceOfRain > 80) {
    alerts.push({
      type: "warning",
      icon: "🌧️",
      title: "Heavy Rain Expected",
      message: `Very high chance of rain (${chanceOfRain}%). Bring an umbrella and plan accordingly.`
    });
  }

  // Wind alerts
  if (windSpeed > 20) {
    alerts.push({
      type: "danger",
      icon: "💨",
      title: "Strong Wind Warning",
      message: `Strong winds (${windSpeed.toFixed(1)} m/s). Be cautious outdoors and avoid high places.`
    });
  } else if (windSpeed > 15) {
    alerts.push({
      type: "warning",
      icon: "💨",
      title: "Windy Conditions",
      message: `Strong winds (${windSpeed.toFixed(1)} m/s). Secure loose items.`
    });
  }

  // Weather condition alerts
  const desc = description?.toLowerCase() || "";
  const visibility = weatherData.current?.visibility || null;
  if (desc.includes("fog") && visibility && visibility < 1000) {
    alerts.push({
      type: "warning",
      icon: "🌫️",
      title: "Dense Fog",
      message: "Dense fog conditions. Drive carefully and use fog lights."
    });
  }

  return alerts;
};

