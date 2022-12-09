// const numOfPeople = document.getElementById("numOfPeople");
const bill = document.getElementById("bill");
const numberOfPeople = document.getElementById("numberOfPeople");
const selections = document.querySelectorAll(".selection");
const customTipInput = document.getElementById("customTip");
const resetBtn = document.querySelector(".calculator button");

const tipPerPerson = document.getElementById("tipPerPerson");
const totalPerPerson = document.getElementById("totalPerPerson");

const errorNumber = document.getElementById("errorNumber");

let tipValue = 0;
let billValue = 0;
let peopleValue = 1;
let activeSelection = null;
document.body.classList.add("restarted");

function countTip() {
  billValue = bill.value;
  peopleValue = numberOfPeople.value;
  errorNumber.classList.remove("active");
  document.body.classList.remove("restarted");

  if (isNaN(billValue) || isNaN(peopleValue)) {
    return;
  }
  if (peopleValue == 0) {
    errorNumber.classList.add("active");
    return;
  }

  const tipToDisplay = (billValue * (tipValue / 100)) / peopleValue;
  const totalToDisplay = (billValue * (1 + tipValue / 100)) / peopleValue;
  tipPerPerson.innerText = "$" + tipToDisplay.toFixed(2);
  totalPerPerson.innerText = "$" + totalToDisplay.toFixed(2);
}

function testForCustom(tested) {
  tested.dataset.tip == "custom" ? (tested.value = "") : "";
  return;
}

bill.addEventListener("input", countTip);
numberOfPeople.addEventListener("input", countTip);

selections.forEach((select) => {
  select.addEventListener("click", (e) => {
    const selected = e.target;
    if (activeSelection) {
      activeSelection.classList.toggle("active");
      testForCustom(activeSelection);
    }
    activeSelection = selected;
    activeSelection.dataset.tip == "custom"
      ? ""
      : (tipValue = selected.dataset.tip);
    activeSelection.classList.toggle("active");
    countTip();
  });
});

customTipInput.addEventListener("input", (e) => {
  tipValue = e.target.value;
  countTip();
});
resetBtn.addEventListener("click", (e) => {
  console.log("RESET");
  bill.value = 0;
  numberOfPeople.value = 1;
  document.body.classList.add("restarted");
  if (activeSelection) {
    activeSelection.classList.toggle("active");
    testForCustom(activeSelection);
  }
  activeSelection = null;
  tipPerPerson.innerText = "$0.00";
  totalPerPerson.innerText = "$0.00";
});
