export default class Gallery {
  constructor(imgArray, thumbsArr, arrowArray, cssPrefix) {
    this.imgArray = imgArray;
    this.thumbsArr = thumbsArr;
    this.arrowArray = arrowArray;
    this.cssPrefix = cssPrefix;
    this.displayedImg = 0;
    this.#setUpGallery();
  }

  #setUpGallery() {
    console.log("SETTING UP GALLERY - cssPrefix: " + this.cssPrefix);
    this.#setUpArrowBtn();
    this.#setUpThumbnails();
  }

  #setUpArrowBtn() {
    console.log("setting up ArrowBtn");
    this.arrowArray.forEach((button) => {
      button.addEventListener(
        "click",
        function () {
          const change = parseInt(button.dataset.galleryChange);
          const newImg = this.validateIndex(this.displayedImg + change);
          this.openThisImg(newImg);
          this.displayedImg = newImg;
        }.bind(this)
      );
    }, this);
  }
  #setUpThumbnails() {
    console.log("setting up Thumbnails");
    this.thumbsArr.forEach(function (thumbnail) {
      thumbnail.addEventListener(
        "click",
        function () {
          const idToDisplay = parseInt(thumbnail.dataset.thumbnailId);
          this.openThisImg(idToDisplay);
          this.displayedImg = idToDisplay;
        }.bind(this)
      );
    }, this);
  }

  #deactivateActiveImg() {
    this.imgArray[this.displayedImg].classList.remove(
      this.cssPrefix + "__img--active"
    );
    this.thumbsArr[this.displayedImg].classList.remove(
      this.cssPrefix + "-thumbnail__item--active"
    );
  }

  #activateImg(imgToDisplay) {
    this.displayedImg = imgToDisplay;
    this.imgArray[imgToDisplay].classList.add(this.cssPrefix + "__img--active");
    this.thumbsArr[imgToDisplay].classList.add(
      this.cssPrefix + "-thumbnail__item--active"
    );
  }
  // PUBLIC METHODS

  // METHOD to validate index of IMG which is about do be displayed
  //  - checks, if index is in range, corrects index when it is out of range
  validateIndex(index) {
    let validIndex;
    if (index >= this.imgArray.length) {
      validIndex = 0;
    } else if (index < 0) {
      validIndex = this.imgArray.length - 1;
    } else {
      validIndex = index;
    }
    return validIndex;
  }

  openThisImg(imgToDisplay) {
    this.#deactivateActiveImg();
    this.#activateImg(imgToDisplay);
  }

  getImgId() {
    return this.displayedImg;
  }
}
