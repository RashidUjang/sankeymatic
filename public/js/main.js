import {process_sankey} from "./sankeymatic.js";

let nodeList = [{
    "type": "income",
    "amount": 5000,
    "category": "salary",
    "parentCategory": ""
}];

// Add functionalities for both Income and Expense
const addIncomeButton = document.getElementById("button-add-income");
const addExpensesButton = document.getElementById("button-add-expenses");

addIncomeButton.addEventListener("click", triggerModal);
addExpensesButton.addEventListener("click", triggerModal);

//TODO: Compile into one function
function triggerModal(e) {
    if (e.target.id = "button-add-income") {
        document.getElementById("modal-income").classList.toggle("is-active");
    } else if (e.target.id = "button-add-expense") {
        // TODO: Open modal-expense
    } 
}

function addExpenseNode(e) {
    let newNode = e.target.previousElementSibling.cloneNode(true);
    document.getElementById("expenses-list").insertBefore(newNode, addExpensesButton);
}

// Close modal
const closePopupButtons = [...document.getElementsByClassName("modal-close")];

closePopupButtons.forEach((val, ind, arr) => {
    val.addEventListener("click", closeModal);
});

function closeModal(e) {
    if (e.target.parentElement.id == "modal-income") {
        e.target.parentElement.classList.toggle("is-active");
    } else if (e.target.parentElement == "modal-expense") {
        // TODO: Close modal-expense
    }
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