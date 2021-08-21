const apiKey = "13761af9429944de944a47df188d38d4";
let app = document.querySelector('#app');
let options = {
    enableHighAccuracy: true, 
    timeout: Infinity, maximumAge: 0
}


// Challenge: Create a multipage website that allows you to see different weather screens



async function fetchData(url) {
    try {
        let response = await fetch(url);
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    catch (e) {
        app.innerHTML = "Cannot Retrieve weather at this time. Please try again later"
        console.warn(e);
    }
}

function sanitizeHTML (str) {
	return str.toString().replace(/javascript:/gi, '').replace(/[^\w-_. ]/gi, function (c) {
		return `&#${c.charCodeAt(0)};`;
	});
}

function render(weather) {
    console.log('This is the weather object', weather);

    let weatherData = `
        <p>Currently: ${sanitizeHTML(weather.weather.description)}<img src="https://www.weatherbit.io/static/img/icons/${sanitizeHTML(weather.weather.icon)}.png"/ alt="An icon showing ${sanitizeHTML(weather.weather.description).toLowerCase()}"></p>
        <p>Temperature in ${sanitizeHTML(weather.city_name)}, ${sanitizeHTML(weather.state_code)} is: ${sanitizeHTML(weather.app_temp)} degrees fahrenheit</p>

    `

    app.innerHTML += weatherData;
}

/**
 * Log the user's location details
 * @param  {Object} position The location details
 */
async function getWeather (position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let url = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}&units=I`
    
    let weather = await fetchData(url);
    
    // Render the weather
    render(weather.data[0]);
}

/**
 * Log an error message
 * @param  {Object} error The error details
 */
function noWeather (error) {
    console.warn(error);
    app.innerHTML = "Request Denied"
}

// Request access to the user's location
navigator.geolocation.getCurrentPosition(getWeather, noWeather, options);
