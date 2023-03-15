// basic interface - IP data type
interface IPDataType {
  ip: string;
  location: string;
  timezone: string;
  isp: string;
}

// developer setting
// if set to TRUE - uses fake data, do NOT fetch data about IP adress from API
const useFakeData = false;

const form = document.querySelector(".js-form");

// const - for displaying information about IP adress
const displayIP = <HTMLElement>document.querySelector(".js-data-ip");
const displayLocation = <HTMLElement>(
  document.querySelector(".js-data-location")
);
const displayTimezone = <HTMLElement>(
  document.querySelector(".js-data-timezone")
);
const displayISP = <HTMLElement>document.querySelector(".js-data-isp");

// setting Leaflet map object, used for displaying map
var map = L.map("map", { zoomControl: false });
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// handling submit
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit();
});

// init - display info when page is loaded for the forst time
//   - it search for user's IP adress when page is loaded
getInfoAboutIP();

// handles submit from form
function handleSubmit() {
  const inputField = <HTMLInputElement>document.querySelector(".js-input");
  getInfoAboutIP(inputField.value);
}

// displays map, using latitude a longitude as coords
function createMap(coordX: number, coordY: number) {
  map.setView([coordX, coordY], 13);

  // uses icon as a marker, adds it to map
  var myIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [40, 50],
  });
  var maker = L.marker([coordX, coordY], { icon: myIcon }).addTo(map);
}

// fetch information about IP adress
async function getInfoAboutIP(ipAdress: string = "") {
  // checking if USER is online, stops if not and display error msg
  if (!window.navigator.onLine) {
    displayError("Failed to connect. Please check your internet connection");
    return;
  }

  // tests if my DEV mode is on - using fake data, NOT fetching from API
  if (useFakeData) {
    const fakeData: IPDataType = {
      ip: "192.212.174.101",
      location: "Krale Jiriho, Ceska Trebova",
      timezone: "UTC-01:00",
      isp: "Prague Satelite (fake data)",
    };
    displayData(fakeData);
    createMap(40, 40);
  } else {
    fetch(
      "https://geo.ipify.org/api/v2/country,city?apiKey=at_TCkwjOosBckyIXFa40dFEGeQLrnJQ&ipAddress=" +
        ipAdress
    )
      .then((response) => {
        // tests if response is valid
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else if (response.status == 422) {
          throw Error("invalid IP adress");
        } else {
          console.log(response.statusText);
          throw Error("Connection error. Please try later.");
        }
      })
      .then((data) => {
        const dataToDisplay: IPDataType = {
          ip: data.ip,
          location: `${data.location.city}, ${data.location.region}, ${data.location.country}`,
          timezone: `UTC ${data.location.timezone}`,
          isp: data.isp,
        };

        displayData(dataToDisplay);
        createMap(data.location.lat, data.location.lng);
      })
      .catch((error) => {
        displayError(error);
      });
  }
}

// helper function to display data
function displayData(data: IPDataType) {
  displayIP.innerText = data.ip;
  displayLocation.innerText = data.location;
  displayTimezone.innerText = data.timezone;
  displayISP.innerText = data.isp;
}

// helper function to display error msg
function displayError(msg: string) {
  const errorData: IPDataType = {
    ip: msg,
    location: "-",
    timezone: "-",
    isp: "-",
  };
  displayData(errorData);
}
