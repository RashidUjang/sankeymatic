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
    document.getElementsByClassName("item-expenses");
    document.getElementsByClassName("item-income");
}