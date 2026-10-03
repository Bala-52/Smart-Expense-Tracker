// dashboard.js — dashboard data loading, charts, expense form, logout

let categoryChart = null;
let trendChart = null;

const rupee = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

// ---------- Auth guard ----------
async function guardAndLoadUser() {
  try {
    const { user } = await apiRequest('/auth/me');
    document.getElementById('userGreeting').textContent = `Hi, ${user.name}`;
  } catch (err) {
    window.location.href = 'index.html';
  }
}

// ---------- Logout ----------
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (e) {
    // ignore — clearing client-side redirect regardless
  } finally {
    window.location.href = 'index.html';
  }
});

// ---------- Load categories into the select ----------
async function loadCategories() {
  const { categories } = await apiRequest('/expenses/meta/categories');
  const select = document.getElementById('category');
  select.innerHTML = categories.map((c) => `<option value="${c}">${c}</option>`).join('');
}

// ---------- Load dashboard summary + charts ----------
async function loadSummary() {
  const data = await apiRequest('/dashboard/summary');

  document.getElementById('totalSpent').textContent = rupee(data.totalSpent);
  document.getElementById('thisMonthTotal').textContent = rupee(data.thisMonthTotal);
  document.getElementById('expenseCount').textContent = data.expenseCount;

  const categoryEntries = Object.entries(data.categoryTotals || {});
  const topCategory = categoryEntries.sort((a, b) => b[1] - a[1])[0];
  document.getElementById('topCategory').textContent = topCategory ? topCategory[0] : '—';

  renderCategoryChart(categoryEntries);
  renderTrendChart(data.monthlyTrend || []);
}

function renderCategoryChart(entries) {
  const ctx = document.getElementById('categoryChart');
  const labels = entries.map((e) => e[0]);
  const values = entries.map((e) => e[1]);
  const colors = ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#84cc16'];

  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels.length ? labels : ['No data'],
      datasets: [{ data: values.length ? values : [1], backgroundColor: colors, borderWidth: 0 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
    },
  });
}

function renderTrendChart(trend) {
  const ctx = document.getElementById('trendChart');
  if (trendChart) trendChart.destroy();
  trendChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: trend.map((t) => t.month),
      datasets: [
        {
          label: 'Spent',
          data: trend.map((t) => t.total),
          backgroundColor: '#4f46e5',
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

// ---------- Load & render expense table ----------
async function loadExpenses() {
  const { expenses } = await apiRequest('/expenses');
  const tbody = document.getElementById('expenseTableBody');
  const emptyState = document.getElementById('emptyState');

  if (!expenses.length) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  tbody.innerHTML = expenses
    .slice(0, 20)
    .map(
      (e) => `
      <tr data-id="${e.id}">
        <td>${e.date}</td>
        <td><span class="category-badge">${e.category}</span></td>
        <td>${e.description || '—'}</td>
        <td>${rupee(e.amount)}</td>
        <td><button class="delete-btn" onclick="deleteExpense('${e.id}')">Delete</button></td>
      </tr>`
    )
    .join('');
}

// ---------- Delete expense ----------
async function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return;
  try {
    await apiRequest(`/expenses/${id}`, { method: 'DELETE' });
    await refreshAll();
  } catch (err) {
    showAlert('alertBox', err.message, 'error');
  }
}
window.deleteExpense = deleteExpense; // used by inline onclick

// ---------- Add expense ----------
document.getElementById('expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value.trim();
  const date = document.getElementById('date').value;

  try {
    await apiRequest('/expenses', { method: 'POST', body: { amount, category, description, date } });
    e.target.reset();
    document.getElementById('date').valueAsDate = new Date();
    await refreshAll();
    showAlert('alertBox', 'Expense added!', 'success');
  } catch (err) {
    showAlert('alertBox', err.message, 'error');
  }
});

async function refreshAll() {
  await Promise.all([loadSummary(), loadExpenses()]);
}

// ---------- Init ----------
(async function init() {
  await guardAndLoadUser();
  await loadCategories();
  document.getElementById('date').valueAsDate = new Date();
  await refreshAll();
})();
