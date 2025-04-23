import React from 'react'

function CurrentCityContainer({cityName, popValue, weatherIcon, tempValue}) {
  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className="font-extrabold text-4xl my-2">{cityName}</h1>
      <p className="text-lg font-semibold text-gray-400 word-space">
        Chance of rain: {popValue}%
      </p>

      {/* Current weather icon */}
      <img src={weatherIcon} className="my-6 w-50 pl-4" />
      <h2 className="text-5xl font-bold mb-8">
        {tempValue}&deg;
      </h2>
    </div>
  );
}

export default CurrentCityContainer