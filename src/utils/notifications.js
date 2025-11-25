// Notification utility for weather alerts

export const sendWeatherNotification = (title, body, icon = "/pwa-192x192.png") => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return;
  }

  // Check if notifications are enabled in settings
  const savedSettings = localStorage.getItem("weatherSettings");
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    if (!settings.notifications) {
      return; // Notifications are disabled
    }
  }

  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: icon,
      badge: icon,
      tag: "weather-notification",
    });
  } else if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, {
          body: body,
          icon: icon,
          badge: icon,
          tag: "weather-notification",
        });
      }
    });
  }
};

// Check for severe weather conditions and notify
export const checkWeatherAlerts = (weatherData) => {
  if (!weatherData || !weatherData.current) return;

  const current = weatherData.current;
  
  // Severe weather conditions
  if (current.chanceOfRain > 80) {
    sendWeatherNotification(
      "Heavy Rain Expected",
      `There's a ${current.chanceOfRain}% chance of rain. Don't forget your umbrella!`
    );
  }
  
  // Extreme temperatures
  if (current.temperature > 35) {
    sendWeatherNotification(
      "Hot Weather Alert",
      `Temperature is ${current.temperature}°C. Stay hydrated and avoid direct sun exposure.`
    );
  } else if (current.temperature < 0) {
    sendWeatherNotification(
      "Freezing Weather Alert",
      `Temperature is ${current.temperature}°C. Bundle up and stay warm!`
    );
  }
  
  // High UV index
  if (current.uvIndex >= 8) {
    sendWeatherNotification(
      "High UV Index",
      `UV index is ${current.uvIndex}. Protect yourself from sun exposure.`
    );
  }
  
  // Strong winds
  if (current.windSpeed > 15) {
    sendWeatherNotification(
      "Strong Wind Alert",
      `Wind speed is ${current.windSpeed} m/s. Be cautious outdoors.`
    );
  }
};

