import {process_sankey} from "./sankeymatic.js";

// Add functionalities for both Income and Expense
const addIncomeButton = document.getElementById("btn-add-income");
const addExpensesButton = document.getElementById("btn-add-expenses");

addIncomeButton.addEventListener("click", addIncomeNode);
addExpensesButton.addEventListener("click", addExpenseNode);

//TODO: Compile into one function
function addIncomeNode(e) {
    let newNode = e.target.previousElementSibling.cloneNode(true);
    document.getElementById("income-list").insertBefore(newNode, addIncomeButton);
}

function addExpenseNode(e) {
    let newNode = e.target.previousElementSibling.cloneNode(true);
    document.getElementById("expenses-list").insertBefore(newNode, addExpensesButton);
}

// Process Sankey
const generateButton = document.getElementById("generate-button");
generateButton.addEventListener("click", processSankey)

function processSankey(e) {
    // Get Income and Expense
    process_sankey();
}

const tabButtons = document.querySelectorAll('.tabs ul li a');
tabButtons.forEach((val, ind, arr) => {
    val.addEventListener('click', applyIsActive);
  });

function applyIsActive(e) {
    e.preventDefault();
}