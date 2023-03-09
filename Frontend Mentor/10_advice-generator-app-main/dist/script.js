"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const numberDisplay = document.querySelector(".js-number");
const adviceDisplay = document.querySelector(".js-advice");
const diceBtn = document.querySelector(".js-dice-btn");
const loaderDiv = document.querySelector(".js-loader-container");
// init after loading
fetchData();
// main function - fetch data, display response
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        // show animation (spinner) before starting fetching data
        adviceDisplay.innerText = "";
        loaderDiv.classList.remove("hidden");
        fetch("https://api.adviceslip.com/advice", { cache: "no-cache" })
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            }
            else {
                throw Error(response.statusText);
            }
        })
            .then((data) => {
            // stop/hide animation, display data
            loaderDiv.classList.add("hidden");
            displayData(data.slip);
        })
            .catch((error) => {
            // stop/hide animation, handle error
            loaderDiv.classList.add("hidden");
            console.log(error);
            displayError();
        });
    });
}
// helper function to display data
function displayData(data) {
    numberDisplay.innerText = `Advice #${data.id}`;
    adviceDisplay.innerText = `"${data.advice}"`;
    return;
}
// helper function to display error message
function displayError() {
    numberDisplay.innerText = "Error";
    adviceDisplay.innerText =
        "Unfortunately, something went wrong. Please check your connection and try again later";
    return;
}
diceBtn === null || diceBtn === void 0 ? void 0 : diceBtn.addEventListener("click", fetchData);
