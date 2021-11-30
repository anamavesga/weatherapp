let apiKey = "1204dcab8ab0929ce69763471e001916";

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
  return result;
}
function timeFormat(selectedDate) {
  let hour = selectedDate.getHours();
  let minute = selectedDate.getMinutes();

  let result = `${hour}:${minute} AM`;
  return result;
}

function updateTemperature(apiReturn) {
  let temperature = Math.round(apiReturn.data.main.temp);
  let feelsLike = Math.round(apiReturn.data.main.feels_like);
  let forecast = apiReturn.data.weather[0].main;
  let cityName = apiReturn.data.name;
  let currentHumidity = apiReturn.data.main.humidity;
  console.log(temperature, feelsLike, forecast, cityName, currentHumidity);
  //
  let feels = document.querySelector("#feels");
  feels.innerHTML = `Feels like ${feelsLike} C`;
  let temp = document.querySelector("#CurrenTemp");
  temp.innerHTML = `${temperature} C`;
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
}

function getCurrentCityWeather(position) {
  let latitud = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(updateTemperature);
}

function getCurrentCity() {
  navigator.geolocation.getCurrentPosition(getCurrentCityWeather);
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
