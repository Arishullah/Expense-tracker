// Expense Tracker Logic
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const summaryDiv = document.getElementById('summary');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderSummary() {
    let total = 0;
    let categoryTotals = {};
    let thisMonthTotal = 0;
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    expenses.forEach(expense => {
        const amount = parseFloat(expense.amount);
        total += amount;
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += amount;
        // Calculate if expense is in this month
        const expDate = new Date(expense.date);
        if (expDate.getMonth() === thisMonth && expDate.getFullYear() === thisYear) {
            thisMonthTotal += amount;
        }
    });
    let summaryHTML = `<div>Total Spent: <span style="color:#6d28d9;font-weight:600;">$${total.toFixed(2)}</span></div>`;
    summaryHTML += `<div>Money Spent This Month: <span style="color:#f43f5e;font-weight:600;">$${thisMonthTotal.toFixed(2)}</span></div>`;
    summaryHTML += `<div>Number of Expenses: <span style="color:#6d28d9;font-weight:600;">${expenses.length}</span></div>`;
    if (Object.keys(categoryTotals).length > 0) {
        summaryHTML += `<div style="margin-top:0.5rem;">By Category:</div>`;
        summaryHTML += `<ul style="list-style:none;padding:0;margin:0;">`;
        for (const cat in categoryTotals) {
            summaryHTML += `<li style="color:#6d28d9;font-weight:500;">${cat}: $${categoryTotals[cat].toFixed(2)}</li>`;
        }
        summaryHTML += `</ul>`;
    }
    summaryDiv.innerHTML = summaryHTML;
}

function renderExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="expense-details">
                <span class="expense-amount">$${parseFloat(expense.amount).toFixed(2)}</span>
                <span class="expense-description">${expense.description}</span>
                <span class="expense-meta">${expense.category} &middot; ${expense.date}</span>
            </div>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        expenseList.appendChild(li);
    });
    renderSummary();
}

expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    expenses.push({ amount, description, category, date });
    saveExpenses();
    renderExpenses();
    expenseForm.reset();
});

expenseList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');
        expenses.splice(index, 1);
        saveExpenses();
        renderExpenses();
    }
});

// Initial render
renderExpenses(); 