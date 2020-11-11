import { process_sankey } from "./sankeymatic.js";
import { matchCategory } from "./util.js";

// List of all categories & nodes.
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
  button.addEventListener("click", deleteNode);
  button.appendChild(document.createTextNode("Delete"));
  td.appendChild(button);

  tr.appendChild(td);

  // Choose depending on type to appear in the income or expenses table
  if (data["record_type"] == "0") {
    // Add an ID to the row, to be used to know which element to delete
    tr.id = "i" + data["record_id"];

    document.querySelector("#income-list tbody").appendChild(tr);
  }
  if (data["record_type"] == "1") {
    // Add an ID to the row, to be used to know which element to delete
    tr.id = "e" + data["record_id"];

    document.querySelector("#expenses-list tbody").appendChild(tr);
  }

  // Delete Listener
  function deleteNode(e) {
    const url =
      "http://localhost:3000/budget/record/" +
      e.target.parentElement.parentElement.id.slice(1);
    console.log(url);
    const options = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    try {
      fetch(url, options).then((res) => console.log(res));
    } catch (err) {
      console.error(err.message);
    }

    e.target.parentElement.parentElement.remove();
    
    if (
      document
        .getElementById("notification-delete-success")
        .classList.contains("is-hidden")
    ) {
      document
        .getElementById("notification-delete-success")
        .classList.toggle("is-hidden");
    }
  }
}

// Create new options and add them into the income and expenses' select elements
function loadModalListData(categoryList) {
  let parentIncome = document.getElementById("select-parent-income");
  let parentExpense = document.getElementById("select-parent-expenses");

  categoryList.forEach((val, ind, arr) => {
    let option = document.createElement("option");

    option.appendChild(
      document.createTextNode(
        matchCategory(val["category_id"], categoryList, 0)
      )
    );
    option.value = val["category_id"];

    if (val["category_type"] == 0) {
      parentIncome.appendChild(option);
    } else if (val["category_type"] == 1) {
      parentExpense.appendChild(option);
    }
  });
}

function setupTables() {
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

      // Load initial list data
      loadListData(nodeList);
      loadModalListData(categoryList);
    });
}

// Call setup functions upon window load
window.onload = function () {
  setupTables();
};

function refreshLists() {
  const tables = [...document.getElementsByTagName("tbody")];
  tables.forEach((val, ind, arr) => {
    val.innerHTML = "";
  });

  setupTables();
}

// Add functionalities for both Income and Expense
const addIncomeButton = document.getElementById("button-add-income");
const addExpensesButton = document.getElementById("button-add-expenses");

addIncomeButton.addEventListener("click", triggerModal);
addExpensesButton.addEventListener("click", triggerModal);

// Function to trigger the modal and fill the correct
function triggerModal(e) {
  if (e.target.id == "button-add-income") {
    document.getElementById("modal-income").classList.toggle("is-active");
  } else if (e.target.id == "button-add-expenses") {
    document.getElementById("modal-expense").classList.toggle("is-active");
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
async function addNode(e) {
  e.preventDefault();
  let record;

  if (e.target.id == "button-add-income-modal") {
    const categoryName = document.getElementById("input-income-category").value;
    const parentCategoryID = document.getElementById("select-parent-income")
      .value;
    const categoryID = await checkCategory(
      0,
      categoryName + "",
      parentCategoryID
    );
    const amount = document.getElementById("input-income-amount").value;

    // Build record object
    record = {
      record_type: 0,
      amount: amount,
      category_id: categoryID,
    };

    closeModal("income");
  } else if (e.target.id == "button-add-expenses-modal") {
    const categoryName = document.getElementById("input-expenses-category")
      .value;
    const parentCategoryID = document.getElementById("select-parent-expenses")
      .value;
    const categoryID = await checkCategory(
      1,
      categoryName + "",
      parentCategoryID
    );
    const amount = document.getElementById("input-expenses-amount").value;

    // Build record object
    record = {
      record_type: 1,
      amount: amount,
      category_id: categoryID,
    };

    closeModal("expense");
  }

  // Create record in DB and refresh tables
  createRecord(record);
  refreshLists();

  // Display Toast Message
  if (
    document
      .getElementById("notification-add-success")
      .classList.contains("is-hidden")
  ) {
    document
      .getElementById("notification-add-success")
      .classList.toggle("is-hidden");
  }
}

async function createRecord(record) {
  const url = "http://localhost:3000/budget/record";
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  };

  try {
    const response = await fetch(url, options);
    const jsonResponse = await response.json();
    console.log(jsonResponse);
  } catch (e) {
    console.error(e.message);
  }
}

async function checkCategory(categoryType, categoryName, parentCategoryID) {
  // If category does not exist in list, create new category
  if (
    !categoryList.some(
      (val, ind, arr) =>
        val["category_name"] === categoryName &&
        val["category_type"] === categoryType
    )
  ) {
    if (parentCategoryID == 0) {
      parentCategoryID = null;
    }

    // Build category object
    let category = {
      category_type: categoryType,
      category_name: categoryName,
      parent_category_id: parentCategoryID,
    };

    try {
      const url = "http://localhost:3000/budget/category";
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      };

      const response = await fetch(url, options);
      const jsonResponse = await response.json();

      return jsonResponse[0]["category_id"];
    } catch (e) {
      console.error(e.message);
    }
  } else {
    console.log("Found a category with the same name.");
  }
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
