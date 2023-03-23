const navToggle = document.querySelector(".js-nav-toggle");

// toggle display menu for smal devices (mobile)
navToggle?.addEventListener("click", () => {
  const parent = navToggle.parentElement;
  parent?.classList.toggle("nav-mobile--active");
});

//------------------------------------

// basic const - HTMLElements
const form = document.querySelector("form");
const input = <HTMLInputElement>document.querySelector("#js-form-input");

//     place, where search (shorten link) is going to be displayed
const searchContent = document.querySelector(".js-search-content");

//     place to display ERROR MSG
const errorMsgDisplay = <HTMLElement>(
  document.querySelector(".js-error-display")
);

// FORM VALIDATION and FETCHING DATA
// - checks if input is not empty string
// - then it call function for fetching shorten link
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = input.value;
  if (input.value == "") {
    displayError("Please add a link.");
  } else {
    hideError();
    fetchData(inputValue);
  }
});

// helper function for DISPLAY and HIDE ERROR MSG
function displayError(msg: string) {
  errorMsgDisplay.innerText = msg;
  form?.parentElement?.classList.add("search-area--error");
}
function hideError() {
  form?.parentElement?.classList.remove("search-area--error");
}

// fetching  shorten link
async function fetchData(originalLink: string) {
  fetch("https://api.shrtco.de/v2/shorten?url=" + originalLink)
    .then((response) => {
      // handles NOT OK response
      if (!response.ok) {
        if (response.status == 400) {
          throw Error("Unable to shorten this link. Try something else.");
        } else {
          throw Error("Something went wrong. Please try later.");
        }
      } else {
        return response.json();
      }
    })
    .then((json) => {
      if (json.ok) {
        const shortenLink = json.result.full_short_link3;
        const newCard = getCardComponent(originalLink, shortenLink);
        searchContent?.appendChild(newCard);
        searchContent?.appendChild(newCard);

        // starts display animation for new card
        setTimeout(() => {
          newCard.classList.add("link-card--visible");
        }, 10);
      }
    })
    .catch((error) => {
      displayError(error);
    });
}

// helper function - RETURNS element with a given class
function getStyledElement(
  element: string,
  classStyle: string,
  textContent: string | null = null
): HTMLElement {
  const component = document.createElement(element);
  component.classList.add(classStyle);
  textContent && component.appendChild(document.createTextNode(textContent));
  return component;
}

// function RETURNS new  card component
function getCardComponent(
  originalLink: string,
  shortenLink: string
): HTMLElement {
  const card = getStyledElement("div", "link-card");
  const cardOriginalLink = getStyledElement(
    "div",
    "link-card__original",
    originalLink
  );
  card.appendChild(cardOriginalLink);

  const cardShortenLink = getStyledElement(
    "div",
    "link-card__shorten",
    shortenLink
  );
  card.appendChild(cardShortenLink);
  const button = getStyledElement("button", "link-card__copy-btn", "Copy");
  button.addEventListener("click", () => {
    button.classList.add("link-card__copy-btn--copied");
    button.innerText = "Copied!";
    navigator.clipboard.writeText(shortenLink);
  });
  cardShortenLink.appendChild(button);
  return card;
}
