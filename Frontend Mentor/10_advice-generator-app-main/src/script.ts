interface DataFromFetch {
  id: number;
  advice: string;
}

const numberDisplay = <HTMLElement>document.querySelector(".js-number");
const adviceDisplay = <HTMLElement>document.querySelector(".js-advice");
const diceBtn = document.querySelector(".js-dice-btn");
const loaderDiv = <HTMLElement>document.querySelector(".js-loader-container");

// init after loading
fetchData();

// main function - fetch data, display response
async function fetchData() {
  // show animation (spinner) before starting fetching data
  adviceDisplay.innerText = "";
  loaderDiv.classList.remove("hidden");

  fetch("https://api.adviceslip.com/advice", { cache: "no-cache" })
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
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
}

// helper function to display data
function displayData(data: DataFromFetch) {
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

diceBtn?.addEventListener("click", fetchData);
