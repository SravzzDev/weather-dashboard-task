import React from 'react';
import { Alert } from 'antd';
import moment from 'moment';

function EventPlanner({ selectedDate, city, forecast }) {
    const formattedDate = selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : null;
    const suggestions = forecast.find((item) => item.date === formattedDate);

    return (
        <div>
            <h3>Event Planner Suggestions for {city}</h3>
            {suggestions ? (
                <>
                    <Alert message={`Expected weather: ${suggestions.description}`} type="info" />
                    {suggestions.description.includes('rain') && (
                        <Alert message="Consider moving the event indoors or prepare for wet conditions." type="warning" />
                    )}
                    {suggestions.wind > 20 && (
                        <Alert message="High winds expected, secure outdoor decorations." type="warning" />
                    )}
                </>
            ) : (
                <Alert message="Select a date to see suggestions" type="warning" />
            )}
        </div>
    );
}

export default EventPlanner;
