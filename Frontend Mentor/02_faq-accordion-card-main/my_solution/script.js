console.log("test");

const boxes = document.querySelectorAll(".info-box");

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    // console.log("KLIK");
    box.classList.toggle("active");
  });
});
