;(function () {
    
    let apiKey = '64f486df994244a390e668d6e6611fc1' //WeatherBit
    let url = 'https://ipapi.co/json' //iapi url
    let app = document.querySelector('#app');
    let units = 'I';        // Will display temp in Fahrenheit by default

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

    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then(function (locationData) {
            let { city, region_code } = locationData;     // Extract properties from returned api 
            return fetch('https://api.weatherbit.io/v2.0/current?' + 'city=' + city + ',' + region_code + '&key=' + apiKey + '&units=' + units)

        }).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then(function (weatherData) {
            let { temp, city_name } = weatherData.data[0];    // Extract temp property from returned api
            let { icon, description } = weatherData.data[0].weather;        // Extract properties from weather object (inside returned api)
            let iconSrc = '<img src="https://www.weatherbit.io/static/img/icons/' + sanitizeHTML(icon) + '.png"/>';
            // Inject weather icon, description, and temperature into the DOM
            app.innerHTML = '<div>' +
                            app.textContent + '<h1 id="city-name">' + sanitizeHTML(city_name) + '</h1>' +
                                '<div>' + iconSrc  + '</div>' + 
                                '<p id="description">' + sanitizeHTML(description) + '</p>' +
                                '<p id="temp">' + sanitizeHTML(temp) + '&deg' + '</p>' +
                            '</div>';

        })   
        .catch(function (err) {
            console.log(err)
        })
    
})();

