// CART CLASS - handle displaying and saving information about product
class Cart {
  constructor(cartDisplay, productInfo, saveId, cartAlert = null) {
    this.cartDisplay = cartDisplay;
    this.cartAlert = cartAlert;
    this.saveId = saveId;
    this.cartData = JSON.parse(localStorage.getItem(this.saveId));
    if (this.cartData == null) {
      localStorage.setItem(this.saveId, JSON.stringify(productInfo));
      this.cartData = productInfo;
    }
    this.#displayCart();
  }

  // DISPLAYS cart
  #displayCart() {
    const dataToDisplay = this.cartData;

    // checks if quantity of product is NULL
    if (dataToDisplay.quantity === 0) {
      this.#clearCart();
      // const textNode = document.createTextNode("Your cart is empty");
      // this.cartDisplay.appendChild(textNode);
      this.cartAlert.innerText = "";
      this.cartDisplay.innerText = "Your cart is empty";
    } else {
      this.#clearCart();
      this.cartAlert.innerText = dataToDisplay.quantity;
      this.cartDisplay.innerText = "";
      const cartComponent = this.#getCartComponent(dataToDisplay);
      this.cartDisplay.appendChild(cartComponent);

      // ADD Checkout BTN to cartDisplay
      const checkoutBtn = this.#getStyledElement(
        "button",
        "btn btn--primary",
        "Checkout"
      );
      this.cartDisplay.appendChild(checkoutBtn);
    }
  }

  // ADD item to the cart - PUBLIC METHOD
  addToCart(quantityToAdd) {
    this.cartData.quantity = this.cartData.quantity + quantityToAdd;
    this.#saveData();
    this.#displayCart();
  }

  // SAVE DATA to localstorage object with given name

  #saveData() {
    localStorage.setItem(this.saveId, JSON.stringify(this.cartData));
  }

  // DELETE EVERYTHING - data AND cart display
  #deleteCart() {
    this.#clearCart();
    this.cartDisplay.innerText = "";
    this.cartData.quantity = 0;
    this.#saveData();
    this.#displayCart();
  }

  // delete cart display, it DO NOT delete data
  #clearCart() {
    let child = this.cartDisplay.lastElementChild;
    while (child) {
      this.cartDisplay.removeChild(child);
      child = this.cartDisplay.lastElementChild;
    }
  }

  // helper function - create and return node with css class & text content
  #getStyledElement(element, style, textContent = null) {
    const component = document.createElement(element);
    component.classList = style;
    textContent && component.appendChild(document.createTextNode(textContent));
    return component;
  }

  // returns cart component from given data
  #getCartComponent(itemData) {
    const component = this.#getStyledElement("div", "popover__content");
    const cartItemComponent = this.#getStyledElement("div", "cart-item");
    component.appendChild(cartItemComponent);

    // CREATE IMAGE, append to parent node (cartItemComponent)
    const imgComponent = this.#getStyledElement("img", "cart-item__img");
    imgComponent.src = itemData.imgSource;
    cartItemComponent.appendChild(imgComponent);

    // CREATE cart-item__content COMPONENT, append to parent node
    const contentComponent = this.#getStyledElement(
      "div",
      "cart-item__content"
    );
    cartItemComponent.appendChild(contentComponent);

    const textComponent = this.#getStyledElement(
      "div",
      "cart-item__text",
      itemData.title
    );
    const priceText = `${itemData.price} x ${itemData.quantity} = `;
    const priceComponent = this.#getStyledElement(
      "div",
      "cart-item__price",
      priceText
    );
    const costPrice = itemData.price * itemData.quantity;
    const boldComponent = this.#getStyledElement(
      "span",
      "cart-item--bold",
      "$" + costPrice
    );
    contentComponent.appendChild(textComponent);
    contentComponent.appendChild(priceComponent);
    priceComponent.appendChild(boldComponent);
    const deleteBtn = this.#getStyledElement(
      "div",
      "cart-item__delete js-cart-delete"
    );
    deleteBtn.addEventListener("click", () => {
      this.#deleteCart();
    });
    cartItemComponent.appendChild(deleteBtn);

    return component;
  }
}

// class control add a certain amount of product to cart
// helper function to a class Cart - NEEDS Cart object to be working
class QuantityControl {
  constructor(CartObj, quantityDisplay, quantityBtn, quantityAddBtn) {
    this.quantityDisplay = quantityDisplay;
    this.quantityBtn = quantityBtn;
    this.quantityAddBtn = quantityAddBtn;
    this.#setUpQuantityBtn();
    this.quantityAddBtn.addEventListener("click", this.#addToCart.bind(this));
    this.CartObj = CartObj;
  }

  #setUpQuantityBtn() {
    this.quantityBtn.forEach(
      function (button) {
        button.addEventListener("click", () => {
          const change = parseInt(button.dataset.change);
          const quantity = parseInt(this.quantityDisplay.innerText);
          const newValue = quantity + change;
          this.quantityDisplay.innerText = newValue < 0 ? "0" : newValue;
        });
      }.bind(this)
    );
  }

  #addToCart() {
    const quantity = parseInt(this.quantityDisplay.innerText);
    if (quantity > 0) {
      this.CartObj.addToCart(quantity);
    }
  }
}

export { Cart, QuantityControl };
