import { BrowserRouter, Routes, Route } from "react-router";
import CurrentCity from "./pages/CurrentCity";
import CityList from "./pages/CityList";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<CurrentCity />} />
        <Route path="city-list" element={ <CityList/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
