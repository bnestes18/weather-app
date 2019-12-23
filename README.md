# weather-app
This project gets a user’s location and displays their current weather information.

The core functionality of this project begins with two APIs: 

IPAPI - This API returns the appropriate geolocation information (i.e. city, state, longitude/latitude) based on a detected IP address 		 from the user's electronic device (i.e. laptop, desktop, smartphone).
WeatherBit - The provided API's can retrieve current weather observations, a 16-day weather forecast, historical weather data from the 		 past 10 years, and so on.  This project uses the API to retrieve only the daily weather.

This project also provides the ability for the user to customize their own weather options (i.e. A user can either show or hide the weather icon, or edit their description of the weather data).  Defaults are set in place if there are no custom options.  Below is a screenshot of the user interface.  


In order to customize the data, provide the following in the browser console:
1. The name of the function -> createWeatherTemplate()
In the source code, there is an object with default options: 
let defaults = {
                apiKey: null,
                selector: '#app',
                units: 'I',
                message: `Today's weather is: {{ temp }}, {{ description }} in {{ cityName }}, {{ stateName }}`,
                noWeather: 'Unable to display weather data at this time',
                showIcon: true
               }
2. If you wish to provide custom options, pass an object (similar to the one up above) with ONLY the data that you wish to change into the createWeatherTemplate() function.

Here's an example: createWeatherTemplate({apiKey: '123456', showIcon: false})

NOTE: The minimum data that you will always have to provide is the apiKey.  Otherwise, the User Interface will not display any weather data.

![weatherApp](https://user-images.githubusercontent.com/40964189/71370257-5f66d000-257b-11ea-8c98-af66b6b17cf9.png)
