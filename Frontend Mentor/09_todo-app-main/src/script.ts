// INFO: CSS class 'item--animation' is used for animating
// when todo is added, deleted or filtered

// INTERFACE
// basic type - single TODO object
interface ToDoType {
  id: number;
  title: string;
  isCompleted: boolean;
}

// GLOBAL VARIABLES
let topId: number = 0; // keep track about TOP TODO ID - for creating new TODOs
let toDoData: ToDoType[] = []; // stores all displayed TODO

// GLOBAL CONSTANTS
// location, where all TODO should be displayed
const todoList = document.querySelector(".js-todo-list");

// location, where will be displayed quantity of unfinnished TODOs
let counterItem: HTMLElement;

// call init function - load data, display them
populateItems();

// FILTERS
//
const filterBtn = document.querySelectorAll("[data-filter]");
let activeFilterName: string = "all";

// ADD EVENTLISTENERS to filter BTN
filterBtn.forEach((btn) => {
  const filterType: string = (<HTMLElement>btn).dataset.filter!;
  btn.addEventListener("click", () => {
    handleFilterDisplay(filterType);
    handleFilter(filterType);
  });
});

// manage to display which filter is active - adds/removes class
function handleFilterDisplay(newFilterName: string) {
  filterBtn.forEach((btn) => {
    const filterType: string = (<HTMLElement>btn).dataset.filter!;
    filterType == activeFilterName &&
      btn.classList.remove("item__filter--active");
    filterType == newFilterName && btn.classList.add("item__filter--active");
  });
  activeFilterName = newFilterName;
}

// apply filters - HIDE/DISPLAY items
function handleFilter(filterType: string) {
  const displayedData = [
    ...document.querySelectorAll(".js-todo-list .item:not(:last-child)"),
  ];
  if (filterType == "all") {
    displayedData.forEach((item) => item.classList.remove("item--animation"));
  } else if (filterType == "active") {
    displayedData.forEach((item) => {
      if (item.classList.contains("item--checked")) {
        item.classList.add("item--animation");
      } else {
        item.classList.remove("item--animation");
      }
    });
  } else {
    displayedData.forEach((item) => {
      if (item.classList.contains("item--checked")) {
        item.classList.remove("item--animation");
      } else {
        item.classList.add("item--animation");
      }
    });
  }
}

// DISPLAY DATA, POPULATE

// LOAD data from localstorage and returns them
function loadData(): ToDoType[] {
  const JSONdata = localStorage.getItem("todoData");
  const loadedData: ToDoType[] = JSONdata && JSON.parse(JSONdata);
  toDoData = loadedData;
  if (toDoData) {
    toDoData.forEach((item) => {
      item.id > topId && (topId = item.id);
    });
  } else {
    toDoData = [];
  }
  return loadedData;
}

// SAVE data to localstorage
function saveData(dataToSave: ToDoType[]) {
  localStorage.setItem("todoData", JSON.stringify(dataToSave));
}

// displayData given data
function displayData(dataToDisplay: ToDoType[]) {
  if (dataToDisplay) {
    dataToDisplay.forEach((itemData) => {
      const itemComponent = getItemComponent(itemData);
      todoList?.appendChild(itemComponent);
    });
  }
  const filterArea = <HTMLElement>(
    document.querySelector(".js-filter-area")?.children[0]
  );
  // adds second filter area
  // - it is displayed on different screen size (tablets and bigger)
  const filterClone = <HTMLElement>filterArea?.cloneNode(true);
  filterClone.classList.add("tablet-display");
  filterClone.classList.remove("item");

  // adds info area
  const infoArea = getStyledElement("div", "item");
  infoArea.classList.add("item__info-area");
  counterItem = getStyledElement("div", "item__title", "X");
  counterItem.classList.add("js-todo-counter");
  const clearItem = getStyledElement("div", "item__title", "Clear completed");
  clearItem.classList.add("item--clickable");
  clearItem.addEventListener("click", clearCompleted);
  infoArea.appendChild(counterItem);
  infoArea.appendChild(filterClone);
  infoArea.appendChild(clearItem);
  todoList?.appendChild(infoArea);
}

// INIT - calls loading func. and displays returned data
function populateItems() {
  const data: ToDoType[] = loadData();
  displayData(data);
  counterItem = <HTMLElement>document.querySelector(".js-todo-counter");
  refreshCounter();
}

// helper function, returns element with css class
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

// returns item component
function getItemComponent(itemData: ToDoType, isNewComponent: boolean = false) {
  let itemElement = getStyledElement("div", "item");
  itemData.isCompleted && itemElement.classList.add("item--checked");
  itemElement.setAttribute("data-item-id", `${itemData.id}`);
  let checkboxElement = getStyledElement("div", "item__checkbox");
  checkboxElement.addEventListener("click", () =>
    toggleCompleteStatus(itemElement)
  );
  let titleElement = getStyledElement("div", "item__title", itemData.title);
  let deleteElement = getStyledElement("div", "item__delete");
  deleteElement.addEventListener("click", () => deleteItem(itemElement));
  itemElement.appendChild(checkboxElement);
  itemElement.appendChild(titleElement);
  itemElement.appendChild(deleteElement);

  // handles animation when adding NEW item
  if (isNewComponent) {
    itemElement.classList.add("item--animation");
  }

  return itemElement;
}

// helper - finds index of item in array of todo data
function getIndexOfID(id: number): number {
  let index = toDoData.map((item) => item.id).indexOf(id);
  return index;
}

// deletes given item
function deleteItem(itemToDelete: HTMLElement) {
  const IDtoDelete = parseInt(itemToDelete.dataset.itemId!);
  const pos = getIndexOfID(IDtoDelete);
  toDoData.splice(pos, 1);
  saveData(toDoData);

  // add animation for DELETED item
  itemToDelete.classList.add("item--animation");
  setTimeout(() => {
    removeElement(itemToDelete);
  }, 1000);
  refreshCounter();
}

// toggles check/uncheck status for component/TODO
function toggleCompleteStatus(itemToToggle: HTMLElement) {
  const id = parseInt(itemToToggle.dataset.itemId!);
  const pos = getIndexOfID(id);
  toDoData[pos].isCompleted = !toDoData[pos].isCompleted;
  saveData(toDoData);
  itemToToggle.classList.toggle("item--checked");
  refreshCounter();
}

// DELETE element from DOM
function removeElement(elementToRemove: HTMLElement) {
  while (elementToRemove.firstChild) {
    elementToRemove.removeChild(elementToRemove.firstChild);
  }
  elementToRemove.remove();
  refreshCounter();
}

// handle INPUT - add new TODO
const todoInput = <HTMLInputElement>document.querySelector(".js-todo-input");
document.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewTodo(todoInput.value);
  todoInput && (todoInput.value = "");
});

// adds new TODO
function addNewTodo(todoTitle: string) {
  const newTodo: ToDoType = {
    id: ++topId,
    title: todoTitle,
    isCompleted: false,
  };
  const newTodoItem = getItemComponent(newTodo, true);
  todoList?.insertBefore(newTodoItem, todoList.lastChild);
  toDoData = [...toDoData, newTodo];
  saveData(toDoData);
  setTimeout(() => newTodoItem.classList.remove("item--animation"), 50);
  refreshCounter();
}

// deletes finished TODOs (marked as checked)
function clearCompleted() {
  const displayedData = <HTMLElement[]>[
    ...document.querySelectorAll(".js-todo-list .item:not(:last-child)"),
  ];
  displayedData.forEach((item) => {
    if (item.classList.contains("item--checked")) {
      item.classList.add("item--animation");
      deleteItem(item);
    }
  });
}

// counts how many TODOs is not finnished, display number
function refreshCounter() {
  let counter: number = 0;
  if (toDoData) {
    counter = toDoData.reduce((total, item) => {
      return total + (item.isCompleted ? 0 : 1);
    }, 0);
  }
  counterItem.innerText = `${counter} item${counter == 1 ? "" : "s"} left`;
}

// TOGGLE THEME - LIGHT (primary) / DARK
const themeToggle = document.querySelector(".js-theme-toggle");
themeToggle &&
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });
