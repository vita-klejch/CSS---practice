var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import toggleTheme from "./toggleTheme.js";
// CONFIG
// true/false value sets which mode is default (true sets dark as default)
const defaultDarkMode = false;
// HTML Elements
//    - Filter elements
const filterTrigger = document.querySelector(".js-filter-trigger");
const parentFilter = filterTrigger === null || filterTrigger === void 0 ? void 0 : filterTrigger.parentElement;
const filterBtns = document.querySelectorAll("[data-filter-type]");
//    - Display controls
const mainContent = document.querySelector(".js-main-content");
const detailContent = document.querySelector(".js-detail-content");
const cardDisplay = document.querySelector(".js-cards-group");
const detailDisplay = document.querySelector(".js-detail-display");
//    - Btn to go back from DETAIL MODE TO CARDS/MAIN CONTENT
const backBtn = document.querySelector(".js-back-btn");
//    - Search elements
const searchInput = (document.querySelector(".js-search-input"));
// toggle DARK/LIGHT mode
const darkModeToggle = document.querySelector(".js-mode-toggle");
// function toggleTheme imported from module
// sets btn to toggle between dark/light mode, choose which css class is added to body
// true/false value sets which mode is default (true sets dark as default)
toggleTheme(darkModeToggle, "dark-mode", defaultDarkMode);
// toggle displaying filter list
// display filter list - btns to activate filters
filterTrigger === null || filterTrigger === void 0 ? void 0 : filterTrigger.addEventListener("click", (e) => {
    parentFilter.classList.toggle("filter--active");
    e.stopPropagation();
});
// eventListeners for FILTER BTN/list
filterBtns.forEach((btn) => {
    const filterType = btn.dataset.filterType;
    btn.addEventListener("click", () => {
        activateFilter(filterType);
    });
});
// BTN to go back from DETAIL mode to CARDS mode
backBtn === null || backBtn === void 0 ? void 0 : backBtn.addEventListener("click", () => deactiveDetailMode());
// event listener for submiting string to search form
document.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSearch(searchInput.value);
});
// handle search, display data
function handleSearch(searchValue) {
    const countriesData = loadData();
    const filteredData = countriesData.filter((country) => country.name.toLowerCase().includes(searchValue.toLowerCase()));
    // checks if something was found
    // - if NOT -> display msg
    // - else   -> display data
    if (filteredData.length == 0) {
        cardDisplay.innerText = "Nothing was found.";
    }
    else {
        displayData(filteredData);
    }
}
// handle filter -> load data and use filter on them
// load data from localstorage and filter them
// then display filtered data
function activateFilter(filterType = null) {
    const data = loadData();
    if (filterType == null || filterType == "no-filter") {
        displayData(data);
    }
    else {
        const filteredData = data.filter((country) => {
            return country.region == filterType;
        });
        displayData(filteredData);
    }
}
// HIDE filter list(filter options) when clicking somewhere else on page
document.addEventListener("click", (e) => {
    parentFilter.classList.remove("filter--active");
});
// function to display given data as a CARDS
function displayData(dataArray) {
    cardDisplay && deleteChildrens(cardDisplay);
    dataArray.forEach((data, index) => {
        const countryData = {
            countryName: data.name,
            population: data.population,
            region: data.region,
            capital: data.capital,
            flag: data.flag,
        };
        const newCardComponent = getCardComponent(countryData);
        const myContainer = document.createElement("div");
        myContainer.innerHTML = newCardComponent;
        // event for displaying detail about country
        myContainer.addEventListener("click", () => showCardDetail(data.name));
        cardDisplay === null || cardDisplay === void 0 ? void 0 : cardDisplay.appendChild(myContainer);
    });
}
// helper function to delete childrens of given element
// - it is used when displaying new set of cards (after activating filters,..)
function deleteChildrens(element) {
    while (element === null || element === void 0 ? void 0 : element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
// HELEPER FUNCTION
// returns simple card component/string
function getCardComponent(data) {
    const { countryName, population, region, capital, flag } = data;
    return `<div class="card">
          <img src="${flag}" class="card__img" alt="" srcset="" />
          <div class="card__content">
            <div class="card__title">${countryName}</div>
            <div class="card__atribute">
              <span class="card--strong">Population: </span>${population.toLocaleString()}
            </div>
            <div class="card__atribute">
              <span class="card--strong">Region: </span>${region}
            </div>
            <div class="card__atribute">
              <span class="card--strong">Capital: </span>${capital}
            </div>
          </div>
        </div>`;
}
// HELEPER FUNCTION
// returns formated string for displaying detail info. about country
function getDetailComponent(data, borderData) {
    const currencies = data.currencies && data.currencies.map((curency) => curency.name);
    const languages = data.languages.map((lang) => lang.name);
    return `<img src="${data.flag}" class="detail__img" />
          <div class="detail__content">
            <div class="detail__title">${data.name}</div>
            <div class="detail__atribute-container">
              <div class="detail__atribute-group">
                <div class="detail__atribute">
                  <span class="detail--strong">Native Name: </span>${data.nativeName}
                </div>
                <div class="detail__atribute">
                  <span class="detail--strong">Population: </span>${data.population.toLocaleString()}
                </div>
                <div class="detail__atribute">
                  <span class="detail--strong">Region: </span>${data.region}
                </div>
                <div class="detail__atribute">
                  <span class="detail--strong">Sub Region: </span>${data.subregion}
                </div>
                <div class="detail__atribute">
                  <span class="detail--strong">Capital: </span>${data.capital}
                </div>
              </div>
              <div class="detail__atribute-group">
                <div class="detail__atribute">
                  <span class="detail--strong">Top Level Domain: </span>${data.topLevelDomain}
                </div>
                <div class="detail__atribute">
                  <span class="detail--strong">Currencies: </span>${currencies ? currencies.join(", ") : "No data"}
                </div>
                <div class="detail__atribute">
                  <span class="detail--strong">Languages: </span>${languages.join(", ")}
                </div>
              </div>
            </div>
            <!-- INFO about border countries - START -->
            <div class="detail__border">
              <div class="detail__border-title">Border Countries:</div>
              <div class="detail__border-links">
                ${borderData}
              </div>
            </div>
            <!-- INFO about border countries - END -->
          </div>`;
}
// localstorage - handle FETCHED DATA
//  - LOADS and SAVES data to localstorage
function saveData(data) {
    localStorage.setItem("countriesData", JSON.stringify(data));
}
function loadData() {
    const data = localStorage.getItem("countriesData");
    return data && JSON.parse(data);
}
// INIT page when loading
// data can be fetch from api
//   - for better performance data fetched from local json file
function initPage() {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log("Getting data....");
        const data = loadData();
        if (data == null) {
            // console.log("LOCALSTORAGE EMPTY - fetching data");
            fetch("data.json")
                .then((response) => response.json())
                .then((json) => {
                saveData(json);
                displayData(json);
            });
        }
        else {
            // console.log("LOCALSTORAGE contains data");
            displayData(data);
        }
    });
}
// handles actions, which should active ditail mode
// -> display detail info about given country
function showCardDetail(countryName) {
    activeDetailMode();
    searchInput.value = "";
    const data = loadData();
    const filteredDataArray = data.filter((country) => country.name == countryName);
    const newData = filteredDataArray[0];
    deleteChildrens(detailDisplay);
    const borderData = newData.borders == undefined
        ? "No data about borders."
        : getBorderData(data, newData.borders);
    const newContent = getDetailComponent(newData, borderData);
    detailDisplay.innerHTML = newContent;
    const borderElements = [
        ...document.querySelectorAll("[data-detailID]"),
    ];
    borderElements.forEach((element) => {
        element.addEventListener("click", () => {
            showCardDetail(element.dataset.detailid);
        });
    });
}
// HELPER FUNCTION
// format btns to display detail info about border countries
function getBorderData(countriesData, borders) {
    let answer = "";
    countriesData.forEach((country) => {
        if (borders.includes(country.alpha3Code)) {
            answer += `<div class="detail__border-link" data-detailID='${country.name}'>${country.name}</div>\n`;
        }
    });
    return answer;
}
// HELPER FUNCTION
// - switch between cards (mainContent) and detail about single sountry
// can be done with 'toggle'
function activeDetailMode() {
    mainContent === null || mainContent === void 0 ? void 0 : mainContent.classList.add("hidden-content");
    detailContent === null || detailContent === void 0 ? void 0 : detailContent.classList.remove("hidden-content");
}
function deactiveDetailMode() {
    mainContent === null || mainContent === void 0 ? void 0 : mainContent.classList.remove("hidden-content");
    detailContent === null || detailContent === void 0 ? void 0 : detailContent.classList.add("hidden-content");
}
// basic INITIALIZATION
initPage();
