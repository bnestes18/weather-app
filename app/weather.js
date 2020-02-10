let createWeatherTemplate = function(options) {
	// VARIABLES and OBJECTS

	/*
    Object that configures selector (css selector), units (Celsius -> '' or Fahrenheit -> I), 
    weather description message, and the display of icon (boolean)
    */
	let defaults = {
		apiKey: null,
		selector: '#app',
		units: 'I',
		message: `Today's weather is: {{ temp }}, {{ description }} in {{ cityName }}, {{ stateName }}`,
		noWeather: 'Unable to display weather data at this time',
		showIcon: true,
	};

	// Merge custom options (if any), with the default options
	let settings = Object.assign(defaults, options);
	let app = document.querySelector(settings.selector);

	// FUNCTIONS

	/*
    Displays icon if user configures the setting to show it
    */
	let getIcon = function(weatherIcon) {
		if (!settings.showIcon) return ''; // If options value is set to false, show empty string

		// Otherwise, return the icon
		let html =
			'<div>' +
			'<img id="image" src="https://www.weatherbit.io/static/img/icons/' +
			sanitizeHTML(weatherIcon) +
			'.png"/>' +
			'</div>';
		return html;
	};

	/* 
    Replaces the placeholders (in defaults object) with weather object data
    returned from weather api
    */
	let getDescription = function(weather) {
		let { temp, city_name, state_code } = weather.data[0];
		let { description } = weather.data[0].weather;

		return settings.message
			.replace('{{ description }}', sanitizeHTML(description))
			.replace('{{ cityName }}', sanitizeHTML(city_name))
			.replace('{{ stateName }}', sanitizeHTML(state_code))
			.replace('{{ temp }}', sanitizeHTML(temp) + '&deg');
	};
	/*
    Renders a message if there is no weather to display 
    (as a result of an error)
    */
	let renderNoWeather = function() {
		return '<p>' + settings.noWeather + '</p>';
	};

	/*
    Extracts location and weather properties from returned data objects
    and renders the location, weather icon and weather description
    properties into the DOM
    */
	let renderWeather = function(weather) {
		let { icon } = weather.data[0].weather; // Extract properties from weather object (inside returned api)

		// Inject weather icon, description, and temperature into the DOM
		app.innerHTML =
			'<div>' +
			'<h1>Weather App</h1>' +
			'<p>Checking the weather near you...</p>' +
			getIcon(sanitizeHTML(icon)) +
			'<p id="description">' +
			getDescription(weather) +
			'</p>';
		('</div>');
	};

	/*!
    * Sanitize and encode all HTML in a user-submitted string
    * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
    * @param  {String} str  The user-submitted string
    * @return {String} str  The sanitized string
    */
	let sanitizeHTML = function(str) {
		var temp = document.createElement('div');
		temp.textContent = str;
		return temp.innerHTML;
	};

	// Check if apiKey exists before making get requests to the api(s)
	if (!settings.apiKey) {
		console.warn('Please provide a valid api key in order to display the weather.');
	}

	// Make a Get request for the location data
	fetch('https://ipapi.co/json')
		.then(function(response) {
			if (response.ok) {
				return response.json();
			} else {
				return Promise.reject(response);
			}
			// Make a Get request for the weather data
		})
		.then(function(locationData) {
			let { city, region_code } = locationData; // Extract properties from returned api
			return fetch(
				'https://api.weatherbit.io/v2.0/current?' +
					'city=' +
					city +
					',' +
					region_code +
					'&units=' +
					settings.units +
					'&key=' +
					settings.apiKey,
			);
		})
		.then(function(response) {
			if (response.ok) {
				return response.json();
			} else {
				return Promise.reject(response);
			}
		})
		.then(function(weatherData) {
			// Render the weather
			renderWeather(weatherData);
		})
		.catch(function(err) {
			console.log(err);
			app.innerHTML = renderNoWeather();
		});
};

// Initialize template defaults
createWeatherTemplate({
	apiKey: '64f486df994244a390e668d6e6611fc1', //WeatherBit'
});
