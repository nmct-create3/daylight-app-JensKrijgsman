// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

function _getMinutes(timestamp) {
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  var timeNow = hours.substr(-2) + ':' + minutes.substr(-2);
  var timeArray = timeNow.split(':');
  return parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
}

// 5 TODO: maak updateSun functie
var updateSun = function(procentOver) {
  console.log(procentOver);
  if (procentOver < 50) {
    var procentbot = procentOver * 2;
  } else {
    var procentbot = (100 - procentOver) * 2;
  }
  document.querySelector('.js-sun').style = `bottom:${procentbot}%; left:${100 - procentOver}%`;
};
// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  var zon = document.querySelector('.js-sun');
  var minResting = totalMinutes + _getMinutes(sunrise) - _getMinutes(Date.now() / 1000); //_getMinutes(totalMinutes - Date.now());
  // Bepaal het aantal minuten dat de zon al op is.
  var sunUp = _getMinutes(Date.now() / 1000 - sunrise);
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  updateSun((minResting / totalMinutes) * 100);
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  // Vergeet niet om het resterende aantal minuten in te vullen.
  zon.dataset.time = _parseMillisecondsIntoReadableTime(Date.now() / 1000);
  if (minResting > 0) {
    document.querySelector('.js-time-left').innerHTML = minResting;
  } else {
    document.querySelector('.js-time-left').innerHTML = 'no ';
  }

  // Nu maken we een functie die de zon elke minuut zal updaten
  // Bekijk of de zon niet nog onder of reeds onder is
  if (_getMinutes(Date.now() / 1000) > _getMinutes(sunrise) + totalMinutes) {
    document.querySelector('html').setAttribute('class', 'is-night');
    document.querySelector('.js-sun').classList.add('u-invisible');
  } else if (getMinutes(Date.now() / 1000) < _getMinutes(sunrise)) {
    document.querySelector('html').setAttribute('class', 'is-night');
    document.querySelector('.js-sun').classList.add('u-invisible');
  } else {
    document.querySelector('html').setAttribute('class', 'is-day');
    document.querySelector('.js-sun').classList.remove('u-invisible');
  }
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  document.querySelector('.js-location').innerHTML = queryResponse.city.name;
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  document.querySelector('.js-sunrise').innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
  document.querySelector('.js-sunset').innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
  var totalMinutes = _getMinutes(queryResponse.city.sunset) - _getMinutes(queryResponse.city.sunrise);
  placeSunAndStartMoving(totalMinutes, queryResponse.city.sunrise);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async function(lat, lon) {
  // Eerst bouwen we onze url op
  var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b22482794b3eac3d438c74ac34a07d8f&units=metric&lang=nl&cnt=1`;
  // Met de fetch API proberen we de data op te halen.
  try {
    const get = await fetch(url); //, { headers: headers }
    const forecast = await get.json();
    console.log(forecast);
    showResult(forecast);
  } catch (error) {
    console.log(error);
  }

  // Als dat gelukt is, gaan we naar onze showResult functie.
};

document.addEventListener('DOMContentLoaded', function() {
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
  // placeSunAndStartMoving(38388, 1571292762);
});
