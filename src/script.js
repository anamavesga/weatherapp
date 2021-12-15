let apiKey = "1204dcab8ab0929ce69763471e001916";
let temperature;
let feelsLike;
let temperatureUnit = "C";

function dateFormat(selectedDate) {
  let day = selectedDate.getDay();
  let date = selectedDate.getDate();
  let month = selectedDate.getMonth();
  let year = selectedDate.getFullYear();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let result = `${days[day]} ${date} ${months[month]} ${year}`;
  document.querySelector("#forecast-day-1").innerHTML =
    days[(day + 1) % days.length];
  document.querySelector("#forecast-day-2").innerHTML =
    days[(day + 2) % days.length];
  document.querySelector("#forecast-day-3").innerHTML =
    days[(day + 3) % days.length];
  document.querySelector("#forecast-day-4").innerHTML =
    days[(day + 4) % days.length];
  return result;
}
function timeFormat(selectedDate) {
  let hour = "00" + selectedDate.getHours();
  hour = hour.substring(hour.length - 2);
  let minute = "00" + selectedDate.getMinutes();
  minute = minute.substring(minute.length - 2);

  let result = `${hour}:${minute} AM`;
  return result;
}

function updateTemperatureDegrees() {
  let feels = document.querySelector("#feels");
  feels.innerHTML = `Feels like ${feelsLike}`;
  let temp = document.querySelector("#CurrenTemp");
  temp.innerHTML = `${temperature}`;
}

function forecastIcon(mainweather) {
  console.log("mainweather", mainweather);
  let icon = "";
  if ("clouds".toUpperCase() === mainweather.toUpperCase()) {
    icon = "⛅";
  } else if ("snow".toUpperCase() === mainweather.toUpperCase()) {
    icon = "☃️";
  } else if ("rain".toUpperCase() === mainweather.toUpperCase()) {
    icon = "🌧️";
  } else {
    icon = "🌞";
  }
  console.log("icon", icon);
  return icon;
}

function formatForecast(dayForecast) {
  return (
    forecastIcon(dayForecast.weather[0].main) +
    " " +
    Math.round(dayForecast.temp.day)
  );
}

function updateForecast(apiReturn) {
  console.log(apiReturn);
  let days = apiReturn.data.daily;
  let forecast1 = document.querySelector("#forecast-1");
  let forecast2 = document.querySelector("#forecast-2");
  let forecast3 = document.querySelector("#forecast-3");
  let forecast4 = document.querySelector("#forecast-4");

  forecast1.innerHTML = formatForecast(apiReturn.data.daily[1]);
  forecast2.innerHTML = formatForecast(apiReturn.data.daily[2]);
  forecast3.innerHTML = formatForecast(apiReturn.data.daily[3]);
  forecast4.innerHTML = formatForecast(apiReturn.data.daily[4]);
}

function updateTemperature(apiReturn) {
  temperatureUnit = "C";
  console.log("previous", apiReturn);

  temperature = Math.round(apiReturn.data.main.temp);
  feelsLike = Math.round(apiReturn.data.main.feels_like);
  let forecast = apiReturn.data.weather[0].main;
  let cityName = apiReturn.data.name;
  let currentHumidity = apiReturn.data.main.humidity;
  console.log(temperature, feelsLike, forecast, cityName, currentHumidity);
  //
  updateTemperatureDegrees();
  let condition = document.querySelector("#currentForecast");
  condition.innerHTML = `${forecast}`;
  let city = document.querySelector("#city");
  city.innerHTML = `${cityName}`;
  let humi = document.querySelector("#humedad");
  humi.innerHTML = `${currentHumidity}`;
}

function searchCity() {
  let city = document.querySelector("#citySelector");

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateTemperature);

  let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?id=${city.value}&appid=${apiKey}&units=metric&cnt=4`;
  console.log(forecastUrl);
  axios.get(forecastUrl).then(updateForecast);
}

function getCurrentCityWeather(position) {
  let latitud = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateTemperature);

  let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitud}&lon=${longitude}&appid=${apiKey}&units=metric&exclude=current,minutely,hourly,alerts`;
  console.log(forecastUrl);
  axios.get(forecastUrl).then(updateForecast);
}

function getCurrentCity() {
  navigator.geolocation.getCurrentPosition(getCurrentCityWeather);
}

function farenheitToCelcius(farenheitTemperature) {
  let celciusTemperature = (farenheitTemperature - 32) * (5 / 9);
  return Math.round(celciusTemperature);
}
function celciusToFarenheit(celciusTemperature) {
  let farenheitTemperature = celciusTemperature * (9 / 5) + 32;
  return Math.round(farenheitTemperature);
}

function setCelsiusUnit() {
  if (temperatureUnit !== "C" && temperature) {
    //F->C
    temperatureUnit = "C";
    temperature = farenheitToCelcius(temperature);
    feelsLike = farenheitToCelcius(feelsLike);
    updateTemperatureDegrees();
  }
}
function setFarenheitUnit() {
  if (temperatureUnit !== "F" && temperature) {
    //C->F
    temperatureUnit = "F";
    temperature = celciusToFarenheit(temperature);
    feelsLike = celciusToFarenheit(feelsLike);
    updateTemperatureDegrees();
  }
}
let today = new Date();
let dateField = document.querySelector("#date");
let timeField = document.querySelector("#time");

let formatedDate = dateFormat(today);
let formatedTime = timeFormat(today);

dateField.innerHTML = formatedDate;
timeField.innerHTML = formatedTime;

let searchButton = document.querySelector("#citybutton");
searchButton.addEventListener("click", searchCity);

let currentButton = document.querySelector("#currentCity");
currentButton.addEventListener("click", getCurrentCity);

let farenheitPicker = document.querySelector("#farenheitPicker");
farenheitPicker.addEventListener("click", setFarenheitUnit);

let celsiusPicker = document.querySelector("#celsiusPicker");
celsiusPicker.addEventListener("click", setCelsiusUnit);
