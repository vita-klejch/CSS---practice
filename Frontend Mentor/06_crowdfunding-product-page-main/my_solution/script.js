const modalOptions = document.querySelectorAll(".js-modal-option");
const modalOpeners = document.querySelectorAll(".js-modal-opener");
const modalSelectCloseBtn = document.getElementById("js-modal-select-close");
const modalSelectionBlock = document.getElementById("modal-selection-block");
const modalContinueBtn = document.querySelectorAll(".js-modal-continue");

const modalThanksBlock = document.getElementById("modal-thanks");
const closeThanksModalBtn = document.getElementById("close-thanks-modal");

const bookmarkToggle = document.querySelector(".js-bookmark-toggle");

let lastSelection = null;

// MANAGE BOOKMARK TOGGLE
bookmarkToggle.addEventListener("click", () => {
  bookmarkToggle.classList.toggle("bookmark--active");
});

modalContinueBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    modalSelectionBlock.classList.add("modal--hidden");
    modalThanksBlock.classList.remove("modal--hidden");
    console.log("CONTINUE CLICKED");
  });
});

// BUTTON to close SELECTION modal
modalSelectCloseBtn.addEventListener("click", () => {
  modalSelectionBlock.classList.add("modal--hidden");
});

// BUTTON to close THANKS modal
closeThanksModalBtn.addEventListener("click", () => {
  modalThanksBlock.classList.add("modal--hidden");
});

// BUTTONS to display SELECTION modal
modalOpeners.forEach((opener) => {
  opener.addEventListener("click", (e) => {
    console.log("MODAL OPENED");
    const selectionID = e.target.dataset.modal;
    const selection = document.getElementById(selectionID);
    if (selection) {
      selection.checked = true;
      manage_outset(selection);
    }
    modalSelectionBlock.classList.remove("modal--hidden"); // display modal
  });
});

// BUTTONS inside SELECTION modal
//   - used to change SELECTION
modalOptions.forEach((option) => {
  option.addEventListener(
    "change",
    (e) => {
      console.log("OPTION CHANGED");
      console.log(e.target);
      e.target.dataset.outlineTargetId ? manage_outset(e.target) : null;
    },
    false
  );
});

// HELPER FUNCTION
// manage toggle outline for MODAL SELECTION
function manage_outset(target) {
  lastSelection && lastSelection.classList.remove("article--active"); // remove old outline
  lastSelection = document.getElementById(target.dataset.outlineTargetId);
  console.log("LAST SELECTION: ");
  console.log(lastSelection);
  lastSelection.classList.add("article--active"); // add  new outline article
}

// CLOSE ACTIVE MODAL WHEN CLICK OUTSIDE MODAL-BOX
const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      modalSelectionBlock.classList.add("modal--hidden");
      modalThanksBlock.classList.add("modal--hidden");
    }
  });
});
