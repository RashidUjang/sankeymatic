import { process_sankey } from "./sankeymatic.js";

// Mock data
let nodeList = [
  {
    type: "income",
    amount: 5000,
    categoryID: "Salary",
    parentCategoryID: "None",
  },
  {
    type: "income",
    amount: 3000,
    categoryID: "Allowances",
    parentCategoryID: "None",
  },
  {
    type: "expense",
    amount: 1200,
    categoryID: "Food",
    parentCategoryID: "None",
  },
  {
    type: "expense",
    amount: 6800,
    categoryID: "Transportation",
    parentCategoryID: "None",
  },
];

let categoryList = [
  {
    categoryID: 0,
    categoryName: "None",
    parentCategoryID: "",
    type: "income",
  },
  {
    categoryID: 1,
    categoryName: "Salary",
    parentCategoryID: "",
    type: "income",
  },
  {
    categoryID: 2,
    categoryName: "Allowances",
    parentCategoryID: "",
    type: "income",
  },
  {
    categoryID: 3,
    categoryName: "Food",
    parentCategoryID: "",
    type: "expense",
  },
  {
    categoryID: 4,
    categoryName: "Transportation",
    parentCategoryID: "",
    type: "expense",
  },
  {
    categoryID: 5,
    categoryName: "Car",
    parentCategoryID: 4,
    type: "expense",
  },
];

// Load data into lists
function loadListData(nodeList) {
  nodeList.forEach((val, ind, arr) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    let td = document.createElement("td");

    // Add index number, amount, category and parent category to table
    th.appendChild(document.createTextNode(ind));
    tr.appendChild(th);

    td.appendChild(document.createTextNode(val["amount"]));
    tr.appendChild(td);

    td = document.createElement("td");
    td.appendChild(document.createTextNode(val["categoryID"]));
    tr.appendChild(td);

    td = document.createElement("td");
    td.appendChild(document.createTextNode(val["parentCategoryID"]));
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
    if (val["type"] == "income") {
      document.querySelector("#income-list tbody").appendChild(tr);
    }
    if (val["type"] == "expense") {
      document.querySelector("#expenses-list tbody").appendChild(tr);
    }
  });
}

// Call setup functions upon window load
window.onload = function () {
  loadListData(nodeList);
};

// Add functionalities for both Income and Expense
const addIncomeButton = document.getElementById("button-add-income");
const addExpensesButton = document.getElementById("button-add-expenses");

addIncomeButton.addEventListener("click", triggerModal);
addExpensesButton.addEventListener("click", triggerModal);

// Function to trigger the modal and fill the correct
function triggerModal(e) {
  console.log(e.target.id);
  if (e.target.id == "button-add-income") {
    document.getElementById("modal-income").classList.toggle("is-active");
    loadModalListData("income");
  } else if (e.target.id == "button-add-expenses") {
    document.getElementById("modal-expense").classList.toggle("is-active");
    loadModalListData("expense");
  }
}

// Function to Modal List
function loadModalListData(type) {
  if (type === "income") {
    let parent = document.getElementById("parent-select-income-1");
    let category = document.getElementById("category-select-income-1");

    categoryList.forEach((val, ind, arr) => {
      if (val["type"] === "income") {
        let option = document.createElement("option");

        option.appendChild(document.createTextNode(val["categoryName"]));
        category.appendChild(option);
      }
    });
  } else if (type === "expense") {
    let parent = document.getElementById("parent-select-expenses-1");
    let category = document.getElementById("category-select-expenses-1");

    categoryList.forEach((val, ind, arr) => {
      if (val["type"] === "expense") {
        let option = document.createElement("option");

        option.appendChild(document.createTextNode(val["categoryName"]));
        category.appendChild(option);
      }
    });
  }
}

// Close modal
const closePopupButtons = [...document.getElementsByClassName("modal-close")];

closePopupButtons.forEach((val, ind, arr) => {
  val.addEventListener("click", closeModal);
});

function closeModal(e) {
  if (
    e.target.parentElement.id == "modal-income" ||
    e.target.parentElement.id == "modal-expense"
  ) {
    e.target.parentElement.classList.toggle("is-active");
  }
}

// Process Sankey
const generateButton = document.getElementById("generate-button");
generateButton.addEventListener("click", processSankey);

function processSankey(e) {
  process_sankey();
}

const tabButtons = document.querySelectorAll(".tabs ul li a");
tabButtons.forEach((val, ind, arr) => {
  val.addEventListener("click", applyIsActive);
});

function applyIsActive(e) {
  e.preventDefault();
  console.log(e.target);
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
