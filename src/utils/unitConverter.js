// unitConverters.js

export const convertTemperature = (value, toUnit) => {
  if (toUnit === 'Fahrenheit') {
    return (value * 9) / 5 + 32; // Convert from Celsius to Fahrenheit
  }
  // If already in Celsius or no conversion needed, return as-is
  return value;
};

export const convertWindSpeed = (value, toUnit) => {
  const conversions = {
    'km/h': Math.round(value),
    'm/s': Math.round(value / 3.6),
    'Knots': Math.round(value / 1.852),
  };
  return conversions[toUnit];
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
  const conversions = {
    'hPa': value,
    'mm': value / 1.33322,
    'Inches': (value / 1.33322) / 25.4,
    'kPa': value / 10,
  };

  const result = conversions[toUnit];
  return Number.isInteger(result) ? result : parseFloat(result.toFixed(2));
};



export const convertPrecipitation = (value, toUnit) => {
  return toUnit === 'Inches' ? value / 25.4 : value; // base mm
};

export const convertDistance = (value, toUnit) => {
  return toUnit === 'Miles' ? value / 1.60934 : value;
};
