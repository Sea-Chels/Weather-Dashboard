//main document elements
var mainContainer = document.getElementById('main-container');
var currentSection = document.getElementById('current-section');
var futureSection = document.getElementById('future-section')
var weatherInput = document.getElementById('weatherInput');
var searchList = document.getElementById('searchList');
var weatherForm = document.getElementById('searchContainer');
var fiveDayForecast = document.getElementById('weather-card-container')
var searchArray = [];


searchList.addEventListener('click', e=>{
    let selectPastSearch = e.target.textContent;
    console.log(selectPastSearch);
})


const recentSearchToggle = (event)=>{
    weatherInput.value = event.target.textContent;
    let location = weatherInput.value.trim();
    if(location){
        getWeather(location)
    }
}

const createSearchHistory = ()=>{
    if (JSON.parse(localStorage.getItem('searchItem'))) {
        const searchData = JSON.parse(localStorage.getItem('searchItem'));
        searchList.onclick = recentSearchToggle;
        searchData.reverse();
        searchList.innerHTML = '';
    
        searchData.forEach(function(item, index) {
            if (index < 5) {
                const searchText = document.createElement('li');
                searchText.textContent = item;
                searchList.appendChild(searchText);
            }});}
}

const saveSearch = function(searchTerm) {
    searchArray.push(searchTerm);
    localStorage.setItem('searchItem', JSON.stringify(searchArray));
    createSearchHistory();
}

const getWeather = async (location)=>{
    var API = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=9715e578f2709cb80a6b24733357c03c`
    var coordinates = await fetch(API)
    // console.log(coordinates)
    coordinatesData = await coordinates.json();
    var lat = coordinatesData.coord.lat;
    var lon = coordinatesData.coord.lon;
    const data = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=9715e578f2709cb80a6b24733357c03c`
    )
    const weather = await data.json();
    console.log(weather)
    currentSection.innerHMTL = '';

    if (weather.current.uvi < 3) {
        var uvClass = 'low';
        var uvRating = " Good"
    } else if (weather.current.uvi >= 3 && weather.current.uvi < 8) {
        var uvClass = 'medium';
        var uvRating = " Medium"
    } else {
        var uvClass = 'high';
        var uvRating = " High"
    }
    // const unixDate = weather.current.dt;
// current day section 
    currentSection.innerHTML =` <h2>Today: ${location}</h2>
    <img src="http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@4x.png">
    <p>Temp: ${Math.round(weather.current.temp)}°F</p>
    <p>Wind: ${Math.round(weather.current.wind_speed)} MPH</p>
    <p>Humidity: ${weather.current.humidity}%</p>
    <p class= "${uvClass}">UV Index: ${weather.current.uvi}, ${uvRating}</p>`

    //clear five-day forcast section
    fiveDayForecast.innerHTML = '';

// five-day forecast
for (var i = 1; i < 6; i++) {
    // console.log(weather);
    var weatherCard = document.createElement('div');
    weatherCard.classList = 'weather-card'
    var weatherDay = document.createElement('h3')
    const unixDate = weather.daily[i].dt;
        weatherDay.textContent = `${new Date(unixDate*1000).toLocaleString('en-US', {weekday: 'long'})}`;
    var weatherImage = document.createElement('img') 
        weatherImage.src = `http://openweathermap.org/img/wn/${weather.daily[i].weather[0].icon}@2x.png`;
        weatherImage.alt = `${weather.daily[i].weather[0].description}`
    var temp = document.createElement('h3') 
        temp.classList.add('temperature');
        temp.textContent = `Temp: ${Math.round(weather.daily[i].temp.day)}°F`
    var wind = document.createElement('p');
        wind.textContent = `Wind: ${Math.round(weather.daily[i].wind_speed)} MPH`
    var humidity = document.createElement('p');
        humidity.textContent = `Humidity: ${weather.daily[i].humidity}%`
    var uvIndex = document.createElement('p');
        uvIndex.classList.add(`${uvClass}`)
        uvIndex.textContent = `UV Index: ${weather.daily[i].uvi}, ${uvRating}`

     weatherCard.appendChild(weatherDay)
     weatherCard.appendChild(weatherImage)
     weatherCard.appendChild(temp)
     weatherCard.appendChild(wind)
     weatherCard.appendChild(humidity)
     weatherCard.appendChild(uvIndex)
     fiveDayForecast.appendChild(weatherCard);

  }

}
weatherForm.addEventListener('click', e=>searchList.classList.toggle("hide"))

weatherForm.addEventListener('keypress', (e)=>{
    if (e.key === 'Enter') {
        e.preventDefault();
        const location = weatherInput.value.trim();
        console.log(location)
        if (location) {
            getWeather(location);
        }
      saveSearch(location);
      createSearchHistory();
      console.log(`Successfully submitted user input: ${location}`);
    }
});

window.onload = function() {
    createSearchHistory();

    if (localStorage.getItem('searchItem')) {
        searchArray = JSON.parse(localStorage.getItem('searchItem'));
        searchArray.reverse();
    } else {
        searchArray = ["Seattle"];
    }

    getWeather(searchArray[0]);

    weatherInput.value = searchArray[0];
}


// window.onclick = function(event) {
//     if (!event.target.matches('#weatherInput') && !event.target.matches('#searchList')) {
//         searchList.classList.remove("show");
//     }
// }
