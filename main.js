/** 
    * Allows Weather Data to be customizable
    * @param {String}    apiKey           The weather api key
    * @param {Boolean}   showIcon         Displays or hides the weather icon based on value
    * @param {String}    weatherMessage   The message to show with the weather data
    * @param {String}    units            The units to use for the temperature (M for Celcius, S for Scientific, 
    I for Fahrenheit)
*/

function customizeWeather(apiKey, customOptions) {
    // Default options object - Referencede if either no customOptions are specified or only a subset of custom options are provided
    let defaults = {
        showIcon: true, 
        weatherMessage: "", 
        units: "I" 
    }

    let options = undefined || customOptions;

    // If no custom options are specified, set to default options
    if (!options) {
        options = defaults;
    } else {
        // Custom options are specified - set defaults for omitted options (if any)
        options = Object.assign({}, defaults, customOptions);
    }

    let {showIcon, weatherMessage, units} = options;
    
    if (!apiKey) { throw new Error("Api key is null or invalid.")}

    // Get the #app element
    let app = document.querySelector('#app');
    
    let unitType;

    // Challenge: Create a multipage website that allows you to see different weather screens


    /**
     * Fetches data (weather data) via API call
     * @param {String} url      The api endpoint
     */
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

    /**
     * Displays the template with the fetched weather data
     * @param {Object} weather      Weather data object (i.e. description, icon, city_name, state_code)
     */
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

        if (units === "M") {
            unitType = "celcius"
        } else if (units === "S") {
            unitType = "kelvin"
        }
        else {
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
    navigator.geolocation.getCurrentPosition(getWeather, noWeather, {
        enableHighAccuracy: true, 
        timeout: Infinity, maximumAge: 0
    });
}

customizeWeather("", {showIcon: false, units: "I"});
