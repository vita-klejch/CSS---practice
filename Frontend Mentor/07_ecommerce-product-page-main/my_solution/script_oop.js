import Gallery from "./Gallery.js";
import { Cart, QuantityControl } from "./Cart.js";

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

// SETTING UP MODAL GALLERY
const modalGalleryContainer = document.querySelector(".js-modal-gallery");
const modalGalleryTrigger = document.querySelector(".js-modal-gallery-trigger");
const modalGalleryOverlay = document.querySelector(".js-modal-gallery-overlay");

// return { getImgId, openThisImg, validateIndex };

// SETTING UP MAIN AND MODAL GALLERY
const mainGallery = new Gallery(
  galleryArr,
  thumbnailsArr,
  galleryArrowBtn,
  "gallery"
);

const modalGallery = new Gallery(
  modalGalleryArr,
  modalThumbnailsArr,
  modalGalleryArrowBtn,
  "modal-gallery"
);

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
    modalGallery.openThisImg(mainGallery.getImgId());
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

const productInfo = {
  id: 0,
  imgSource: "images/image-product-1-thumbnail.jpg",
  title: "Fall Limited Edition Sneakers",
  price: 125,
  quantity: 0,
};

// BTNs to control quantity of sneakers

// buttons to increase/decr. quantity
const quantityBtn = [...document.querySelectorAll(".js-quantity")];

// place to display chosen quantity
const quantityDisplay = document.querySelector(".js-quantity-display");

// btn to add quantity of product to cart
const quantityAddBtn = document.querySelector(".js-add-to-cart");

// INIT Cart + QuantityControl
const newCart = new Cart(cartDisplay, productInfo, "cartData", cartAlert);
const quantityControl = new QuantityControl(
  newCart,
  quantityDisplay,
  quantityBtn,
  quantityAddBtn
);
