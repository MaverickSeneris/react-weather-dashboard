// unitConverters.js

export const convertTemperature = (value, toUnit) => {
  const unit = typeof toUnit === 'string' ? toUnit.toLowerCase() : toUnit;
  if (unit === 'fahrenheit') {
    return (value * 9) / 5 + 32; // Convert from Celsius to Fahrenheit
  }
  // If already in Celsius or no conversion needed, return as-is
  return value;
};

// Convert wind speed from m/s (API standard) to desired unit
export const convertWindSpeed = (valueMs, toUnit) => {
  // API provides wind speed in m/s, convert to desired unit
  const unit = typeof toUnit === 'string' ? toUnit.toLowerCase() : toUnit;
  const conversions = {
    'km/h': Math.round(valueMs * 3.6),
    'kmh': Math.round(valueMs * 3.6), // Handle without slash
    'm/s': Math.round(valueMs),
    'ms': Math.round(valueMs), // Handle without slash
    'knots': Math.round(valueMs * 1.944),
    'mph': Math.round(valueMs * 2.237),
  };
  return conversions[unit] || Math.round(valueMs * 3.6); // Default to km/h
};

// export const convertPressure = (value, toUnit) => {
//   const conversions = {
//     'mm': value,
//     'hPa': value * 1.33322,
//     'Inches': value / 25.4,
//     'kPa': value / 7.50062,
//   };
//   return conversions[toUnit];
// };
export const convertPressure = (value, toUnit) => {
  const unit = typeof toUnit === 'string' ? toUnit.toLowerCase() : toUnit;
  const conversions = {
    'hpa': value,
    'mm': value / 1.33322,
    'inches': (value / 1.33322) / 25.4,
    'kpa': value / 10,
  };

  const result = conversions[unit];
  if (result === undefined) {
    return value; // Return original if unit not recognized
  }
  return Number.isInteger(result) ? result : parseFloat(result.toFixed(2));
};



export const convertPrecipitation = (value, toUnit) => {
  const unit = typeof toUnit === 'string' ? toUnit.toLowerCase() : toUnit;
  return unit === 'inches' ? value / 25.4 : value; // base mm
};

export const convertDistance = (value, toUnit) => {
  const unit = typeof toUnit === 'string' ? toUnit.toLowerCase() : toUnit;
  return unit === 'miles' ? value / 1.60934 : value;
};
