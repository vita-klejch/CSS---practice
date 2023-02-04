// BTNs to control quantity of sneakers
const quantityBtn = [...document.querySelectorAll(".js-quantity")];
const quantityDisplay = document.querySelector(".js-quantity-display");

quantityBtn.forEach((button) => {
  button.addEventListener("click", () => {
    const change = parseInt(button.dataset.change);
    const quantity = parseInt(quantityDisplay.innerText);
    const newValue = quantity + change;
    quantityDisplay.innerText = newValue < 0 ? "0" : newValue;
  });
});

// GALLERY CONTROLERS
const galleryArr = [...document.querySelectorAll(".js-gallery-img")];
const thumbnailsArr = [...document.querySelectorAll(".js-thumbnail-control")];
const galleryArrowBtn = [...document.querySelectorAll(".js-gallery-arrow")];

const modalGalleryArr = [...document.querySelectorAll(".js-modal-gallery-img")];
const modalThumbnailsArr = [
  ...document.querySelectorAll(".js-modal-thumbnail-control"),
];
const modalGalleryArrowBtn = [
  ...document.querySelectorAll(".js-modal-gallery-arrow"),
];

// SETTING UP MAIN GALLERY
const mainGallery = setUpGallery(
  galleryArr,
  thumbnailsArr,
  galleryArrowBtn,
  "gallery"
);

// SETTING UP MODAL GALLERY
const modalGallery = setUpGallery(
  modalGalleryArr,
  modalThumbnailsArr,
  modalGalleryArrowBtn,
  "modal-gallery"
);

const modalGalleryContainer = document.querySelector(".js-modal-gallery");
const modalGalleryTrigger = document.querySelector(".js-modal-gallery-trigger");
const modalGalleryOverlay = document.querySelector(".js-modal-gallery-overlay");

function setUpGallery(imgArray, thumbsArr, arrowArray, cssPrefix) {
  let displayedImg = 0;
  console.log("SETTING UP GALLERY - cssPrefix: " + cssPrefix);
  setUpArrowBtn();
  setUpThumbnails();

  function setUpArrowBtn() {
    arrowArray.forEach((button) => {
      button.addEventListener("click", () => {
        const change = parseInt(button.dataset.galleryChange);
        let newImg = validateIndex(displayedImg + change);

        openThisImg(newImg);
        displayedImg = newImg;
      });
    });
  }

  function setUpThumbnails() {
    thumbsArr.forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        const idToDisplay = parseInt(thumbnail.dataset.thumbnailId);

        openThisImg(idToDisplay);
        displayedImg = idToDisplay;
      });
    });
  }

  function deactivateActiveImg() {
    imgArray[displayedImg].classList.remove(cssPrefix + "__img--active");
    thumbsArr[displayedImg].classList.remove(
      cssPrefix + "-thumbnail__item--active"
    );
  }

  function activateImg(imgToDisplay) {
    displayedImg = imgToDisplay;
    imgArray[imgToDisplay].classList.add(cssPrefix + "__img--active");
    thumbsArr[imgToDisplay].classList.add(
      cssPrefix + "-thumbnail__item--active"
    );
  }
  // FUNCTION to validate index if IMG which is about do be displayed
  //  - checks, if index is in range, corrects index when it is out of range
  function validateIndex(index) {
    let validIndex;
    if (index >= imgArray.length) {
      validIndex = 0;
    } else if (index < 0) {
      validIndex = imgArray.length - 1;
    } else {
      validIndex = index;
    }
    return validIndex;
  }

  function openThisImg(imgToDisplay) {
    deactivateActiveImg();
    activateImg(imgToDisplay);
  }

  function getImgId() {
    return displayedImg;
  }

  return { getImgId, openThisImg, validateIndex };
}

// CONTROL MODAL GALLERY with key - LEFT/RIGHT arrow key
document.addEventListener("keydown", (event) => {
  const keyName = event.key;
  const modalIsActive = modalGalleryContainer.classList.contains(
    "modal-gallery--active"
  );

  if (modalIsActive && keyName === "ArrowRight") {
    const idToActivate = modalGallery.getImgId() + 1;
    const validatedId = modalGallery.validateIndex(idToActivate);
    modalGallery.openThisImg(validatedId);
  } else if (modalIsActive && keyName === "ArrowLeft") {
    const idToActivate = modalGallery.getImgId() - 1;
    const validatedId = modalGallery.validateIndex(idToActivate);
    modalGallery.openThisImg(validatedId);
  }
});

// GALLERY MODAL - CONTROL

// OPEN MODAL WHEN  CLICKING on gallery
// OPENS ONLY WHEN window.innerWidth > 1024 - large screen
modalGalleryTrigger.addEventListener("click", () => {
  if (window.innerWidth > 1024) {
    x = mainGallery.getImgId();
    modalGallery.openThisImg(x);
    modalGalleryContainer.classList.add("modal-gallery--active");
  }
});

// CLOSE MODAL WHEN CLICKING ON OVERLAY
modalGalleryOverlay.addEventListener("click", () => {
  modalGalleryContainer.classList.remove("modal-gallery--active");
});

// NAV CONTROL ---------------
const navOverlay = document.querySelector(".js-nav-overlay");
const popoverOverlay = document.querySelector(".js-popover-overlay");
const navCheckbox = document.querySelector(".js-nav-checkbox");

// CLOSE NAV WHEN CLICK ON OVERLAY
navOverlay.addEventListener("click", (e) => {
  navCheckbox.checked = false;
});
popoverOverlay.addEventListener("click", () => {
  cartIcon.parentNode.classList.remove("popover--active");
});

// CART ICON -  CONTROLERS
const cartIcon = document.querySelector(".js-popover-trigger");

// - CLICK ON CART ICON  --> activate POPOVER
cartIcon.addEventListener("click", (e) => {
  e.target.parentNode.classList.toggle("popover--active");
});
// ADD TO CART - CONTROL
const cartDisplay = document.querySelector(".js-cart-display");
const cartAlert = document.querySelector(".js-cart-alert");
const addBtn = document.querySelector(".js-add-to-cart");

addBtn.addEventListener("click", addToCart);

initiateCart();
displayCart();

// DELETE ALL ITEMS FROM CART
function deleteCart() {
  let child = cartDisplay.lastElementChild;
  while (child) {
    cartDisplay.removeChild(child);
    child = cartDisplay.lastElementChild;
  }
  const oldData = JSON.parse(localStorage.getItem("cartData"));
  const newData = { ...oldData, quantity: 0 };
  localStorage.setItem("cartData", JSON.stringify(newData));
  displayCart();
}

function initiateCart() {
  const cartData = localStorage.getItem("cartData");
  if (cartData == null) {
    const dataToSave = {
      id: 0,
      imgSource: "images/image-product-1-thumbnail.jpg",
      title: "Fall Limited Edition Sneakers",
      price: 125,
      quantity: 0,
    };
    localStorage.setItem("cartData", JSON.stringify(dataToSave));
  }
}

function displayCart() {
  const dataToDisplay = JSON.parse(localStorage.getItem("cartData"));
  if (dataToDisplay.quantity === 0) {
    cartDisplay.innerText = "Your cart is empty";
    cartAlert.innerText = "";
  } else {
    const cartComponent = getCartComponent(dataToDisplay);
    cartDisplay.innerHTML = cartComponent;
    cartAlert.innerText = dataToDisplay.quantity;
    const delBtn = document.querySelector(".js-cart-delete");
    delBtn.addEventListener("click", deleteCart);
  }
}

function getCartComponent(itemData) {
  const returnStatement = `
        <div class="popover__content">
          <div class="cart-item">
            <img
              src="${itemData.imgSource}"
              class="cart-item__img"
            />
            <div class="cart-item__content">
              <div class="cart-item__text">
                ${itemData.title}
              </div>
              <div class="cart-item__price">$${itemData.price} x ${
    itemData.quantity
  } = 
              <span class="cart-item--bold">$${
                itemData.price * itemData.quantity
              }</span>
              </div>
            </div>
            <div class="cart-item__delete js-cart-delete"></div>
          </div>
        </div>
        <button class="btn btn--primary">Checkout</button>`;
  return returnStatement;
}

function addToCart() {
  const quantity = parseInt(quantityDisplay.innerText);
  if (quantity > 0) {
    const oldData = JSON.parse(localStorage.getItem("cartData"));
    const newQuantity = oldData.quantity + quantity;
    dataToSave = {
      id: 0,
      imgSource: "images/image-product-1-thumbnail.jpg",
      title: "Fall Limited Edition Sneakers",
      price: 125,
      quantity: newQuantity,
    };
    localStorage.setItem("cartData", JSON.stringify(dataToSave));
    displayCart();
  }
}
