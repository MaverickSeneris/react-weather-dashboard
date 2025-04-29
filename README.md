
# 🌦️ React Weather Dashboard

A sleek and minimal weather dashboard built with React and Vite. Search for any city and get real-time weather updates with a clean, responsive UI.

![screenshot](screenshot.png) <!-- Optional: add a screenshot -->

## 🚀 Features

- 🌤️ Current weather data (temperature, conditions, etc.)
- 📍 Search by city
- 🌡️ Feels like, humidity, wind speed, and more
- 📱 Responsive design (works on mobile and desktop)
- ⚡ Fast performance using Vite

## 🛠️ Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Axios](https://axios-http.com/) for HTTP requests
- [Tailwind CSS](https://tailwindcss.com/) (if you're using it)

## 🧑‍💻 Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/MaverickSeneris/react-weather-dashboard.git
   cd react-weather-dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Add your API key:**

   Create a `.env` file in the root folder:

   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

   Replace `your_api_key_here` with your actual key from [OpenWeatherMap](https://openweathermap.org/api).

4. **Run the app:**

   ```bash
   npm run dev
   ```

## 📁 Folder Structure

```
src/
├── components/
│   └── WeatherCard.jsx
├── api/
│   └── weather.js
├── App.jsx
├── main.jsx
```

## 🧪 TODO

- [ ] Add forecast data (hourly/daily)
- [ ] Add loading and error states
- [ ] Add theme toggle (dark/light)
- [ ] Add animations or transitions

## 🧙 Author

- **Maverick Seneris**  
  [@MaverickSeneris](https://github.com/MaverickSeneris)

## 📜 License

MIT – feel free to fork, modify, and build something great.
