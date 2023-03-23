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
const navToggle = document.querySelector(".js-nav-toggle");
// toggle display menu for smal devices (mobile)
navToggle === null || navToggle === void 0 ? void 0 : navToggle.addEventListener("click", () => {
    const parent = navToggle.parentElement;
    parent === null || parent === void 0 ? void 0 : parent.classList.toggle("nav-mobile--active");
});
//------------------------------------
// basic const - HTMLElements
const form = document.querySelector("form");
const input = document.querySelector("#js-form-input");
//     place, where search (shorten link) is going to be displayed
const searchContent = document.querySelector(".js-search-content");
//     place to display ERROR MSG
const errorMsgDisplay = (document.querySelector(".js-error-display"));
// FORM VALIDATION and FETCHING DATA
// - checks if input is not empty string
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = input.value;
    // console.log(inputValue);
    if (input.value == "") {
        displayError("Please add a link.");
    }
    else {
        hideError();
        fetchData(inputValue);
    }
});
// helper function for DISPLAY and HIDE ERROR MSG
function displayError(msg) {
    var _a;
    errorMsgDisplay.innerText = msg;
    (_a = form === null || form === void 0 ? void 0 : form.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add("search-area--error");
}
function hideError() {
    var _a;
    (_a = form === null || form === void 0 ? void 0 : form.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove("search-area--error");
}
function fetchData(originalLink) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log("Fetching data...");
        fetch("https://api.shrtco.de/v2/shorten?url=" + originalLink)
            .then((response) => {
            // console.log("response.status:", response.status);
            if (!response.ok) {
                // console.log(response.status);
                if (response.status == 400) {
                    throw Error("Unable to shorten this link. Try something else.");
                }
                else {
                    throw Error("Something went wrong. Please try later.");
                }
            }
            else {
                // console.log(response);
                return response.json();
            }
        })
            .then((json) => {
            if (json.ok) {
                // console.log("Data recieved...");
                // console.log("Shorten link:", json.result.full_short_link3);
                const shortenLink = json.result.full_short_link3;
                const newCard = getCardComponent(originalLink, shortenLink);
                searchContent === null || searchContent === void 0 ? void 0 : searchContent.appendChild(newCard);
                searchContent === null || searchContent === void 0 ? void 0 : searchContent.appendChild(newCard);
                setTimeout(() => {
                    newCard.classList.add("link-card--visible");
                    // console.log("setTimeout");
                }, 10);
            }
        })
            .catch((error) => {
            displayError(error);
        });
    });
}
function getStyledElement(element, classStyle, textContent = null) {
    const component = document.createElement(element);
    component.classList.add(classStyle);
    textContent && component.appendChild(document.createTextNode(textContent));
    return component;
}
function getCardComponent(originalLink, shortenLink) {
    // console.log("Creating card...");
    const card = getStyledElement("div", "link-card");
    const cardOriginalLink = getStyledElement("div", "link-card__original", originalLink);
    card.appendChild(cardOriginalLink);
    const cardShortenLink = getStyledElement("div", "link-card__shorten", shortenLink);
    card.appendChild(cardShortenLink);
    const button = getStyledElement("button", "link-card__copy-btn", "Copy");
    button.addEventListener("click", () => {
        // console.log("COPY", shortenLink);
        button.classList.add("link-card__copy-btn--copied");
        button.innerText = "Copied!";
        navigator.clipboard.writeText(shortenLink);
    });
    cardShortenLink.appendChild(button);
    return card;
}
