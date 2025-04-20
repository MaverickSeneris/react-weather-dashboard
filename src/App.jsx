import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import CityList from "./pages/CityList";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="city-list" element={ <CityList/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
