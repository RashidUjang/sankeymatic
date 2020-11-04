import { process_sankey } from "./sankeymatic.js";
import { matchCategory } from "./util.js";

// List of all categories. TODO: Store in a non-global variable?
let categoryList;
let nodeList;

// Load data into lists
function loadListData(nodeList) {
  nodeList.forEach((val, ind, arr) => {
    addDataIntoTable(val, ind);
  });
}

// Add all data into nodeList
function addDataIntoTable(data, ind) {
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  let td = document.createElement("td");

  const categoryName = matchCategory(data["category_id"], categoryList, 0);
  const amount = data["amount"];
  const parentCategoryName = matchCategory(
    data["category_id"],
    categoryList,
    1
  );

  // Add index number, amount, category and parent category to table
  th.appendChild(document.createTextNode(ind));
  tr.appendChild(th);

  td.appendChild(document.createTextNode(amount));
  tr.appendChild(td);

  td = document.createElement("td");
  td.appendChild(document.createTextNode(categoryName));
  tr.appendChild(td);

  td = document.createElement("td");
  td.appendChild(document.createTextNode(parentCategoryName));
  tr.appendChild(td);

  // Add button in action column
  td = document.createElement("td");
  const button = document.createElement("button");
  button.className = "button is-danger is-outlined is-small";
  button.type = "button";
  button.appendChild(document.createTextNode("Delete"));
  td.appendChild(button);
  tr.appendChild(td);

  // Choose depending on type to appear in the income or expenses table
  if (data["record_type"] == "0") {
    document.querySelector("#income-list tbody").appendChild(tr);
  }
  if (data["record_type"] == "1") {
    document.querySelector("#expenses-list tbody").appendChild(tr);
  }
}

// Call setup functions upon window load
window.onload = function () {
  let urls = [
    "http://localhost:3000/budget/record",
    "http://localhost:3000/budget/category",
  ];

  let requests = urls.map((val, ind, arr) => fetch(val));

  Promise.all(requests)
    .then((responses) => {
      // Calls .json() on each response object using the .map() function, which gives an array of Promises
      // This array of Promises is then inserted into Promie.all() and returns a single Promise which w
      // This Promise is then returned to allow the running of the next .then() method which when resolved will contain the json body content of all the Promises in the fetch
      return Promise.all(responses.map((response) => response.json()));
    })
    .then((data) => {
      nodeList = data[0];
      categoryList = data[1];
      // export { categoryList }

      // Load initial list data
      loadListData(nodeList);
    });
};

// Add functionalities for both Income and Expense
const addIncomeButton = document.getElementById("button-add-income");
const addExpensesButton = document.getElementById("button-add-expenses");

addIncomeButton.addEventListener("click", triggerModal);
addExpensesButton.addEventListener("click", triggerModal);

// Function to trigger the modal and fill the correct
function triggerModal(e) {
  if (e.target.id == "button-add-income") {
    document.getElementById("modal-income").classList.toggle("is-active");
    loadModalListData("income");
  } else if (e.target.id == "button-add-expenses") {
    document.getElementById("modal-expense").classList.toggle("is-active");
    loadModalListData("expense");
  }
}

// Function to Modal List Dropdown
function loadModalListData(type) {
  if (type === "income") {
    let parent = document.getElementById("select-parent-income");

    categoryList.forEach((val, ind, arr) => {
      if (val["type"] === "income") {
        let option = document.createElement("option");

        option.appendChild(document.createTextNode(val["categoryName"]));
        parent.appendChild(option);
      }
    });
  } else if (type === "expense") {
    let parent = document.getElementById("select-parent-expenses");

    categoryList.forEach((val, ind, arr) => {
      if (val["type"] === "expense") {
        let option = document.createElement("option");

        option.appendChild(document.createTextNode(val["categoryName"]));
        parent.appendChild(option);
      }
    });
  }
}

// Close modal
const closePopupButtons = [...document.getElementsByClassName("modal-close")];

closePopupButtons.forEach((val, ind, arr) => {
  val.addEventListener("click", closeModal);
});

// Function to closeModal. Can be triggered from the click event and also manually by passing in the value as manual
function closeModal(e) {
  if (typeof e.target !== "undefined") {
    if (
      e.target.parentElement.id === "modal-income" ||
      e.target.parentElement.id === "modal-expense"
    ) {
      e.target.parentElement.classList.toggle("is-active");
    }
  } else {
    if (e === "income") {
      document.getElementById("modal-income").classList.toggle("is-active");
    } else if (e === "expense") {
      document.getElementById("modal-expense").classList.toggle("is-active");
    }
  }
}

// Get reference and attach listeners to buttons in the modal
const addIncomeButtonModal = document.getElementById("button-add-income-modal");
const addExpensesButtonModal = document.getElementById(
  "button-add-expenses-modal"
);

addIncomeButtonModal.addEventListener("click", addNode);
addExpensesButtonModal.addEventListener("click", addNode);

// Function to add node
function addNode(e) {
  e.preventDefault();
  let record;

  if (e.target.id == "button-add-income-modal") {
    record = {
      type: "income",
      amount: document.getElementById("input-income-amount").value,
      categoryID: document.getElementById("input-income-category").value,
      parentCategoryID: "None",
    };

    addDataIntoTable(record, 3);
    closeModal("income");
  } else if (e.target.id == "button-add-expenses-modal") {
    record = {
      type: "expense",
      amount: document.getElementById("input-expenses-amount").value,
      categoryID: document.getElementById("input-expenses-category").value,
      parentCategoryID: "None",
    };

    addDataIntoTable(record, 3);
    closeModal("income");
  }

  // TODO: Replace with backend API. Only if successful call the toast.
  nodeList.push(record);

  // Display Toast Message
  document.querySelector(".notification").classList.toggle("is-hidden");
}

// Process Sankey
const generateButton = document.getElementById("generate-button");
generateButton.addEventListener("click", processSankey);

function processSankey(e) {
  process_sankey(nodeList);
}

const tabButtons = document.querySelectorAll(".tabs ul li a");
tabButtons.forEach((val, ind, arr) => {
  val.addEventListener("click", applyIsActive);
});

function applyIsActive(e) {
  e.preventDefault();
  e.target.parentElement.classList.toggle("is-active");

  if (e.target.id == "budget-input-option") {
    document
      .getElementById("general-input-option")
      .parentElement.classList.toggle("is-active");
    document.getElementById("budget-input-style").classList.toggle("is-hidden");
    document
      .getElementById("general-input-style")
      .classList.toggle("is-hidden");
  } else if (e.target.id == "general-input-option") {
    document
      .getElementById("budget-input-option")
      .parentElement.classList.toggle("is-active");
    document.getElementById("budget-input-style").classList.toggle("is-hidden");
    document
      .getElementById("general-input-style")
      .classList.toggle("is-hidden");
  }
}

export { categoryList };
