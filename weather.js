let createWeatherTemplate = function (options) {

    
    // VARIABLES and OBJECTS

    /*
    Object that configures selector (css selector), units (Celsius -> '' or Fahrenheit -> I), 
    weather description message, and the display of icon (boolean)
    */
    let defaults = {
        selector: '#app',
        units: 'I',
        message: function (data1, data2, data3) {
            return `Today's weather is: ${data1} in ${data2}, ${data3}`
        },
        showIcon: true
        
    }
    
    let apiKey = '64f486df994244a390e668d6e6611fc1' //WeatherBit
    let settings = Object.assign(defaults, options);
    let app = document.querySelector(settings.selector);

    // FUNCTIONS

    /*
    Extracts location and weather properties from returned data objects
    and renders the location, weather icon and weather description
    properties into the DoM
    */
    let renderWeather = function (data) {
        let { temp, city_name, state_code } = data.data[0];      // Extract temp property from returned api
        let { icon, description } = data.data[0].weather;        // Extract properties from weather object (inside returned api)
        let iconSrc = '<img id="image" src="https://www.weatherbit.io/static/img/icons/' + sanitizeHTML(icon) + '.png"/>';

        // Inject weather icon, description, and temperature into the DOM
        app.innerHTML = '<div>' + 
                        '<h1>Weather App</h1>' +
                        app.textContent + '<h2 id="city-name">' + sanitizeHTML(city_name) + ', ' + 
                            sanitizeHTML(state_code) + '</h2>' +
                            '<div>' + iconSrc + '</div>' + 
                            '<p id="description">' + sanitizeHTML(settings.message(description, city_name, state_code)) + '</p>' +
                            '<p id="temp">' + sanitizeHTML(temp) + '&deg' + '</p>' +
                        '</div>';
    }

    /*!
    * Sanitize and encode all HTML in a user-submitted string
    * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
    * @param  {String} str  The user-submitted string
    * @return {String} str  The sanitized string
    */
    let sanitizeHTML = function (str) {
        var temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    // Make a Get request for the location data
    fetch('https://ipapi.co/json')
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        // Make a Get request for the weather data
        }).then(function (locationData) {
            let { city, region_code } = locationData;     // Extract properties from returned api 
            return fetch('https://api.weatherbit.io/v2.0/current?' + 'city=' + city + ',' + region_code + '&units=' + settings.units + '&key=' + apiKey)

        }).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then(function (weatherData) {

            renderWeather(weatherData);

            let image = document.querySelector('#image');  // Select the image after it renders
            if (settings.showIcon) {                   // Checks boolean value of showIcon property (in defaults)
                image.style.display = 'inline';
            } else {
                image.style.display = 'none';
            }
        })   

        .catch(function (err) {
            console.log(err);
            app.textContent = 'Unable to display weather data at this time'
        })
};

createWeatherTemplate();        // Initialize template defaults