import React from 'react';
import { Alert } from 'antd';
import moment from 'moment';

function Farmer({ selectedDate, city, forecast ,currentWeather}) {
  const formattedDate = selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : null;
  const suggestions = forecast.find((item) => item.date === formattedDate);

  return (
    <div>
      <h3>Farmer Suggestions for {city}</h3>
      {suggestions ? (
        <>
          <Alert message={`Expected temperature: ${suggestions.temp}°C`} type="info" />
          {suggestions.temp < 15 ? (
            <Alert message="Consider protecting crops from frost." type="warning" />
          ) : suggestions.temp > 30 ? (
            <Alert message="Ensure adequate irrigation due to high temperature." type="warning" />
          ) : null}
          {suggestions.description.includes('rain') && (
            <Alert message="Rain expected, prepare for wet soil conditions." type="info" />
          )}
        </>
      ) : (
        <Alert message="Select a date to see suggestions" type="warning" />
      )}
    </div>
  );
}

export default Farmer;
