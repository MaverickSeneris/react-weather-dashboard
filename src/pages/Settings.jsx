import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router";
import Header from "../components/ui/Header";
import PageContainer from "../components/ui/PageContainer";
import WeatherSettings from "../components/WeatherSettings";

function Settings() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const [direction, setDirection] = useState("right");

  useEffect(() => {
    // Determine slide direction based on route order
    const routeOrder = ["/", "/city-list", "/weather-map", "/settings"];
    const currentIndex = routeOrder.indexOf(location.pathname);
    const previousIndex = routeOrder.indexOf(previousPath.current);
    
    if (previousIndex !== -1 && currentIndex !== -1) {
      setDirection(currentIndex > previousIndex ? "right" : "left");
    }
    
    previousPath.current = location.pathname;
  }, [location.pathname]);

  return (
    <motion.div
      key={location.pathname}
      initial={{ 
        opacity: 0, 
        x: direction === "right" ? 150 : -150
      }}
      animate={{ 
        opacity: 1, 
        x: 0
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 250,
        duration: 0.35,
      }}
    >
    <PageContainer>
      <Header title={"Settings"} />
      <div className="mt-8">
        <WeatherSettings />
      </div>
    </PageContainer>
    </motion.div>
  );
}

export default Settings;
