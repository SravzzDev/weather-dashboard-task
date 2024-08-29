import React from 'react';
import { Alert } from 'antd';
import moment from 'moment';

function Traveler({ selectedDate, city, forecast }) {
  const formattedDate = selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : null;
  const suggestions = forecast.find((item) => item.date === formattedDate);

  return (
    <div>
      <h3>Traveler Suggestions for {city}</h3>
      {suggestions ? (
        <>
          <Alert message={`Expected weather: ${suggestions.description}`} type="info" />
          {suggestions.description.includes('rain') && (
            <Alert message="Carry an umbrella or raincoat." type="info" />
          )}
          {suggestions.temp > 30 ? (
            <Alert message="Stay hydrated and avoid sun exposure during peak hours." type="warning" />
          ) : null}
        </>
      ) : (
        <Alert message="Select a date to see suggestions" type="warning" />
      )}
    </div>
  );
}

export default Traveler;
