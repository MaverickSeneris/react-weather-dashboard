const mockCities = [
  {
    cityId: "city-001",
    name: "Manila",
    state: "NCR",
    country: "PH",
    temperature: 30,
    condition: "clear",
    weatherIcon: "01d",
    time: 1714356000,
    uvIndex: 7,
    windSpeed: 5,
    humidity: 70,
    visibility: 10000,
    feelsLike: 33,
    pressure: 1012,
    sunset: 1714399200,
    sunrise: 1714342800,
    chanceOfRain: 10,
    hourlyWeatherInfo: {
      hourlyTime: [1714359600, 1714363200, 1714366800],
      hourlyTemperature: [30, 29, 28],
      hourlyWeatherIcon: ["01d", "02d", "03d"]
    },
    dailyWeatherInfo: [
      { day: "Today", icon: "01d", description: "clear sky", tempHigh: 32, tempLow: 25 },
      { day: "Tue", icon: "02d", description: "few clouds", tempHigh: 31, tempLow: 26 },
      { day: "Wed", icon: "03d", description: "scattered clouds", tempHigh: 30, tempLow: 25 },
      { day: "Thu", icon: "04d", description: "broken clouds", tempHigh: 29, tempLow: 24 },
      { day: "Fri", icon: "09d", description: "shower rain", tempHigh: 28, tempLow: 24 },
      { day: "Sat", icon: "10d", description: "rain", tempHigh: 27, tempLow: 23 },
      { day: "Sun", icon: "11d", description: "thunderstorm", tempHigh: 26, tempLow: 22 }
    ]
  },
  {
    cityId: "city-002",
    name: "Tokyo",
    state: "Tokyo",
    country: "JP",
    temperature: 22,
    condition: "clouds",
    weatherIcon: "03d",
    time: 1714356000,
    uvIndex: 5,
    windSpeed: 8,
    humidity: 60,
    visibility: 9000,
    feelsLike: 22,
    pressure: 1008,
    sunset: 1714395000,
    sunrise: 1714341000,
    chanceOfRain: 20,
    hourlyWeatherInfo: {
      hourlyTime: [1714359600, 1714363200, 1714366800],
      hourlyTemperature: [22, 21, 20],
      hourlyWeatherIcon: ["03d", "04d", "04d"]
    },
    dailyWeatherInfo: [
      { day: "Today", icon: "03d", description: "scattered clouds", tempHigh: 24, tempLow: 18 },
      { day: "Tue", icon: "04d", description: "broken clouds", tempHigh: 23, tempLow: 19 },
      { day: "Wed", icon: "10d", description: "rain", tempHigh: 22, tempLow: 18 },
      { day: "Thu", icon: "10d", description: "rain", tempHigh: 21, tempLow: 17 },
      { day: "Fri", icon: "03d", description: "scattered clouds", tempHigh: 22, tempLow: 18 },
      { day: "Sat", icon: "01d", description: "clear sky", tempHigh: 24, tempLow: 19 },
      { day: "Sun", icon: "01d", description: "clear sky", tempHigh: 25, tempLow: 20 }
    ]
  },
  {
    cityId: "city-003",
    name: "Paris",
    state: "Île-de-France",
    country: "FR",
    temperature: 18,
    condition: "rain",
    weatherIcon: "09d",
    time: 1714356000,
    uvIndex: 3,
    windSpeed: 12,
    humidity: 80,
    visibility: 7000,
    feelsLike: 17,
    pressure: 1002,
    sunset: 1714392000,
    sunrise: 1714338000,
    chanceOfRain: 70,
    hourlyWeatherInfo: {
      hourlyTime: [1714359600, 1714363200, 1714366800],
      hourlyTemperature: [18, 17, 16],
      hourlyWeatherIcon: ["09d", "10d", "10d"]
    },
    dailyWeatherInfo: [
      { day: "Today", icon: "09d", description: "shower rain", tempHigh: 19, tempLow: 14 },
      { day: "Tue", icon: "10d", description: "rain", tempHigh: 18, tempLow: 13 },
      { day: "Wed", icon: "10d", description: "rain", tempHigh: 17, tempLow: 12 },
      { day: "Thu", icon: "04d", description: "broken clouds", tempHigh: 18, tempLow: 13 },
      { day: "Fri", icon: "01d", description: "clear sky", tempHigh: 20, tempLow: 14 },
      { day: "Sat", icon: "01d", description: "clear sky", tempHigh: 22, tempLow: 15 },
      { day: "Sun", icon: "02d", description: "few clouds", tempHigh: 23, tempLow: 16 }
    ]
  },
  {
    cityId: "city-004",
    name: "New York",
    state: "NY",
    country: "US",
    temperature: 16,
    condition: "clouds",
    weatherIcon: "02d",
    time: 1714356000,
    uvIndex: 4,
    windSpeed: 15,
    humidity: 65,
    visibility: 8000,
    feelsLike: 15,
    pressure: 1015,
    sunset: 1714397000,
    sunrise: 1714344000,
    chanceOfRain: 15,
    hourlyWeatherInfo: {
      hourlyTime: [1714359600, 1714363200, 1714366800],
      hourlyTemperature: [16, 15, 14],
      hourlyWeatherIcon: ["02d", "03d", "04d"]
    },
    dailyWeatherInfo: [
      { day: "Today", icon: "02d", description: "few clouds", tempHigh: 18, tempLow: 12 },
      { day: "Tue", icon: "03d", description: "scattered clouds", tempHigh: 17, tempLow: 13 },
      { day: "Wed", icon: "04d", description: "broken clouds", tempHigh: 16, tempLow: 12 },
      { day: "Thu", icon: "09d", description: "shower rain", tempHigh: 15, tempLow: 11 },
      { day: "Fri", icon: "10d", description: "rain", tempHigh: 14, tempLow: 10 },
      { day: "Sat", icon: "01d", description: "clear sky", tempHigh: 17, tempLow: 12 },
      { day: "Sun", icon: "02d", description: "few clouds", tempHigh: 18, tempLow: 13 }
    ]
  },
  {
    cityId: "city-005",
    name: "Sydney",
    state: "NSW",
    country: "AU",
    temperature: 24,
    condition: "clear",
    weatherIcon: "01d",
    time: 1714356000,
    uvIndex: 9,
    windSpeed: 10,
    humidity: 50,
    visibility: 10000,
    feelsLike: 25,
    pressure: 1010,
    sunset: 1714401000,
    sunrise: 1714347000,
    chanceOfRain: 5,
    hourlyWeatherInfo: {
      hourlyTime: [1714359600, 1714363200, 1714366800],
      hourlyTemperature: [24, 23, 22],
      hourlyWeatherIcon: ["01d", "01d", "01d"]
    },
    dailyWeatherInfo: [
      { day: "Today", icon: "01d", description: "clear sky", tempHigh: 26, tempLow: 20 },
      { day: "Tue", icon: "01d", description: "clear sky", tempHigh: 27, tempLow: 21 },
      { day: "Wed", icon: "02d", description: "few clouds", tempHigh: 28, tempLow: 22 },
      { day: "Thu", icon: "02d", description: "few clouds", tempHigh: 29, tempLow: 23 },
      { day: "Fri", icon: "03d", description: "scattered clouds", tempHigh: 28, tempLow: 22 },
      { day: "Sat", icon: "01d", description: "clear sky", tempHigh: 27, tempLow: 21 },
      { day: "Sun", icon: "01d", description: "clear sky", tempHigh: 26, tempLow: 20 }
    ]
  }
];

export default mockCities;
