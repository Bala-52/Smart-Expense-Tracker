// db.js
// Very small file-based JSON "database".
// Good enough for a demo / learning project — no native compilation needed.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const EXPENSES_FILE = path.join(DATA_DIR, 'expenses.json');

function ensureFile(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

function init() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  ensureFile(USERS_FILE, []);
  ensureFile(EXPENSES_FILE, []);
}

function readJSON(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return raw.trim() ? JSON.parse(raw) : [];
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ---------- Users ----------
function getUsers() {
  return readJSON(USERS_FILE);
}

function saveUsers(users) {
  writeJSON(USERS_FILE, users);
}

function findUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  return getUsers().find((u) => u.id === id);
}

function createUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

// ---------- Expenses ----------
function getExpenses() {
  return readJSON(EXPENSES_FILE);
}

function saveExpenses(expenses) {
  writeJSON(EXPENSES_FILE, expenses);
}

function getExpensesByUser(userId) {
  return getExpenses().filter((e) => e.userId === userId);
}

function createExpense(expense) {
  const expenses = getExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
  return expense;
}

function updateExpense(id, userId, updates) {
  const expenses = getExpenses();
  const idx = expenses.findIndex((e) => e.id === id && e.userId === userId);
  if (idx === -1) return null;
  expenses[idx] = { ...expenses[idx], ...updates };
  saveExpenses(expenses);
  return expenses[idx];
}

function deleteExpense(id, userId) {
  const expenses = getExpenses();
  const idx = expenses.findIndex((e) => e.id === id && e.userId === userId);
  if (idx === -1) return false;
  expenses.splice(idx, 1);
  saveExpenses(expenses);
  return true;
}

module.exports = {
  init,
  findUserByEmail,
  findUserById,
  createUser,
  getExpensesByUser,
  createExpense,
  updateExpense,
  deleteExpense,
};
