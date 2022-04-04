const API_KEY = "4dbc67cff5c05aa96444392724e80f55";
const cityName = document.getElementById("CityName");
const cityTemp = document.getElementById("Temperature");
const cityWind = document.getElementById("Wind");
const IconWind = document.getElementById("iconWind");
const IconTemp = document.getElementById("TempIcon");
const citySearch = document.getElementById("CitySearch");
const myCity = document.getElementById("MyCity");
const errorText = document.getElementById("Error");

const showWeatherByLocation = pos => {
	const coords = pos.coords;
	const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`;
	fetch(URL)
		.then(res => res.json())
		.then(res => weatherInfo(res))
		.catch(err => errorMsg(err));
};

function weatherInfo(info) {
	const { clouds, coord, main, sys, weather, wind, name } = info;
	console.log(info);
	const convertedWind = convertMilesToKilometers(wind.speed);
	const convertedTemp = convertToCelsius(main.temp);
	cityName.textContent = name;
	cityTemp.textContent = "Temperatura: " + convertedTemp + "°C";
	cityWind.textContent = "Prędkość wiatru: " + convertedWind + "km/h";
	IconWind.classList.add(newIconWind(convertedWind));
	IconTemp.classList.add(newIconTemp(convertedTemp));
	errorText.textContent = "";
}

const errorMsg = err => {
	errorText.textContent = `Podane miasto nie istnieje. Kod błędu ${err}`;
};

const getMyLocation = () => {
	navigator.geolocation.getCurrentPosition(pos => showWeatherByLocation(pos));
};
getMyLocation();

const convertToCelsius = temp => Math.round(temp - 273.15);
const convertMilesToKilometers = speed => Math.round(speed * 1.60934);

const newIconWind = windSpeed => {
	if (windSpeed >= 15) {
		return "bi-cloud-haze2";
	} else if (windSpeed <= 14) {
		return "bi-cloud-haze";
	}
};

const newIconTemp = mainTemp => {
	if (mainTemp <= 9) {
		return "bi-thermometer";
	} else if (mainTemp >= 10) {
		return "bi-thermometer-half";
	} else if (mainTemp <= 0) {
		return "bi-thermometer-snow";
	} else if (mainTemp >= 20) {
		return "bi-thermometer-high";
	} else if (mainTemp >= 30) {
		return "bi-thermometer-sun";
	}
};

const showWeatherBySearch = city => {
	const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
	fetch(URL)
		.then(res => res.json())
		.then(res => weatherInfo(res))
		.catch(err => errorMsg(err))
		.finally(() => console.log("Kończe działanie wynikiem..."));
};

citySearch.addEventListener("change", e => showWeatherBySearch(e.target.value));

const getSearchResult = () => {
	showWeatherBySearch(citySearch.value);
};

myCity.addEventListener("click", getMyLocation);

// citySearchBtn.addEventListener('click', getSearchResult);
