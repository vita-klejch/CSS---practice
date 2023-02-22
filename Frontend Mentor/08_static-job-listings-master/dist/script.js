"use strict";
// parent element, where all the jobs are displyed
const root = document.querySelector(".js-root");
// element, where information about active filters are displayed
const infoBox = document.querySelector(".js-info-box");
// BTN to delete ALL active filters
const clearBtn = document.querySelector(".js-info-box-clear");
clearBtn.addEventListener("click", () => removeAllActiveTags());
// variable to store data about ALL jobs
let cardsData = [];
// helper variable, used for storing filtered data which are about to be displayed
let filteredData = [];
fetchData();
// function to fetch data - reads JSON file; saves data to variable cardsData
function fetchData() {
    fetch("./data.json")
        .then((response) => response.json())
        .then((json) => {
        const data = json;
        displayCards(data, "card");
        cardsData = data;
    });
}
// const to keep track about active filters/tags
const activeTags = new Set();
// helper function, returns element with css class
function getStyledElement(element, classStyle, textContent = null) {
    const component = document.createElement(element);
    component.classList.add(classStyle);
    textContent && component.appendChild(document.createTextNode(textContent));
    return component;
}
// basic function to display cards
function displayCards(cardsData, cssPrefix) {
    cardsData.forEach((card) => {
        const tagsArray = [card.role, card.level, ...card.languages];
        card.tagsArray = tagsArray;
        const cardElement = getStyledElement("div", cssPrefix);
        const cardContainer = getStyledElement("div", cssPrefix + "__container");
        cardElement.appendChild(cardContainer);
        // CREATE LOGO/ADD IMG (left area)
        const cardLogo = getStyledElement("div", cssPrefix + "__logo");
        cardContainer.appendChild(cardLogo);
        const cardImg = getStyledElement("img", cssPrefix + "__logo-img");
        cardImg.setAttribute("src", card.logo);
        cardLogo.appendChild(cardImg);
        // CREATE MAIN INFO AREA (middle area)
        const cardMainInfo = getStyledElement("div", cssPrefix + "__main-info");
        const cardHeader = getStyledElement("div", cssPrefix + "__header", card.company);
        cardContainer.appendChild(cardMainInfo);
        cardMainInfo.appendChild(cardHeader);
        if (card.new) {
            const cardNEWinfo = getStyledElement("span", cssPrefix + "__header--bubble", "New!");
            cardHeader.appendChild(cardNEWinfo);
        }
        if (card.featured) {
            cardElement.classList.add(cssPrefix + "--featured");
            const cardNEWinfo = getStyledElement("span", cssPrefix + "__header--bubble-black", "Featured");
            cardHeader.appendChild(cardNEWinfo);
        }
        const cardHeadline = getStyledElement("div", cssPrefix + "__headline", card.position);
        cardMainInfo.appendChild(cardHeadline);
        const cardJobComments = getStyledElement("div", cssPrefix + "__job-comments");
        const cardComment1 = getStyledElement("div", cssPrefix + "__single-comment", card.postedAt);
        const cardComment2 = getStyledElement("div", cssPrefix + "__single-comment", card.contract);
        const cardComment3 = getStyledElement("div", cssPrefix + "__single-comment", card.location);
        cardJobComments.appendChild(cardComment1);
        cardJobComments.appendChild(cardComment2);
        cardJobComments.appendChild(cardComment3);
        cardMainInfo.appendChild(cardJobComments);
        // CREATE TAGS AREA (right area)
        const cardTags = getStyledElement("div", cssPrefix + "__tags-area");
        cardContainer.appendChild(cardTags);
        tagsArray.forEach((tag) => {
            const tagElement = getStyledElement("div", cssPrefix + "__tag", tag);
            tagElement.setAttribute("data-tag", tag);
            // click on element adds tag to active filters
            tagElement.addEventListener("click", () => {
                addToActiveTags(tag);
            });
            cardTags.appendChild(tagElement);
        });
        root.appendChild(cardElement);
    });
}
// function which is added to eventListener - click acivates filtering
function addToActiveTags(tag) {
    var _a;
    if (!activeTags.has(tag)) {
        activeTags.add(tag);
        const boxItem = getStyledElement("div", "info-box__item");
        boxItem.setAttribute("data-tag", tag);
        const boxItemText = getStyledElement("div", "info-box__item-text", tag);
        const boxItemIcon = getStyledElement("div", "info-box__item-icon");
        boxItemIcon.addEventListener("click", () => removeFromActiveTag(boxItem));
        boxItem.appendChild(boxItemText);
        boxItem.appendChild(boxItemIcon);
        infoBox === null || infoBox === void 0 ? void 0 : infoBox.appendChild(boxItem);
        activeTags.size == 1 &&
            ((_a = infoBox === null || infoBox === void 0 ? void 0 : infoBox.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove("info-box--hidden"));
        applyFilter();
    }
}
// removes ONE filter from sected filters/tags
function removeFromActiveTag(element) {
    var _a;
    const tag = element.dataset.tag;
    // console.log("remove this tag: " + tag);
    while (element.firstChild) {
        const x = element.lastChild;
        x && element.removeChild(x);
    }
    element.remove();
    activeTags.delete(tag);
    activeTags.size == 0 &&
        ((_a = infoBox === null || infoBox === void 0 ? void 0 : infoBox.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add("info-box--hidden"));
    applyFilter();
}
// removes ALL filters from sected filters/tags
function removeAllActiveTags() {
    var _a;
    while (infoBox === null || infoBox === void 0 ? void 0 : infoBox.firstChild) {
        const x = infoBox.lastChild;
        x && infoBox.removeChild(x);
    }
    activeTags.forEach((tag) => activeTags.delete(tag));
    (_a = infoBox === null || infoBox === void 0 ? void 0 : infoBox.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add("info-box--hidden");
    applyFilter();
}
// checks all jobs, filters them; jobs which comply with selected tags/filters
// are added to helper variable (filteredData) and these jobs are displayed
function applyFilter() {
    let filteredData = [];
    const x = [...activeTags];
    cardsData.forEach((card) => {
        const containsData = x.every((item) => card.tagsArray.includes(item));
        containsData && filteredData.push(card);
    });
    while (root.firstChild) {
        const x = root.lastChild;
        x && root.removeChild(x);
        console.log(x);
    }
    displayCards(filteredData, "card");
}
