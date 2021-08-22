/** 
    * Allows Weather Data to be customizable
    * @param {String}    apiKey           The weather api key
    * @param {Boolean}   showIcon         Displays or hides the weather icon based on value
    * @param {String}    weatherMessage   The message to show with the weather data
    * @param {String}    units            The units to use for the temperature (M for Celcius, S for Scientific, 
    I for Fahrenheit)
*/

function customizeWeather(apiKey, showIcon = true, weatherMessage, units = "I") {
    
    // const apiKey = "c4829f1741a24063a4eb359bfdfe7616";
    if (!apiKey) { throw new Error("Api key is null or invalid.")}

    // Get the #app element
    let app = document.querySelector('#app');
    let options = {
        enableHighAccuracy: true, 
        timeout: Infinity, maximumAge: 0
    }
    let unitType;

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

    /**
     * Sanitize aned encode all HTML in a user-submitted string
     * https://portswigger.net/web-security/corss-site-scripting/preventing
     * @param   {String} str  The user-submitted string
     * @return  {String} str  The sanitized string 
     */
    function sanitizeHTML (str) {
        return str.toString().replace(/javascript:/gi, '').replace(/[^\w-_. ]/gi, function (c) {
            return `&#${c.charCodeAt(0)};`;
        });
    }

    function render(weather) {
        console.log('This is the weather object', weather);

        let weatherData = `
            <p>Currently: ${sanitizeHTML(weather.weather.description)}<img id="icon" class="${showIcon ? '' : 'hideIcon'}" src="https://www.weatherbit.io/static/img/icons/${sanitizeHTML(weather.weather.icon)}.png"/ alt="An icon showing ${sanitizeHTML(weather.weather.description).toLowerCase()}"></p>
            <p>Temperature in ${sanitizeHTML(weather.city_name)}, ${sanitizeHTML(weather.state_code)} is: ${sanitizeHTML(weather.app_temp)} degrees ${unitType}</p>
            <p>${weatherMessage}</p>
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

        if (units === "C") {
            unitType = "celcius"
        } else {
            unitType = "fahrenheit"
        }

        let url = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}&units=${units}`
        
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
}

customizeWeather("", true, "It is going to be beautiful outside!", "C");