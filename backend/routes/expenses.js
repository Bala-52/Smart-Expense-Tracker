// routes/expenses.js
const express = require('express');
const crypto = require('crypto');

const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

// GET /api/expenses  -> list all expenses for logged-in user
router.get('/', (req, res) => {
  const expenses = db
    .getExpensesByUser(req.user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ expenses });
});

// POST /api/expenses -> add new expense
router.post('/', (req, res) => {
  const { amount, category, description, date } = req.body;

  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return res.status(400).json({ message: 'A valid amount is required.' });
  }
  if (Number(amount) <= 0) {
    return res.status(400).json({ message: 'Amount must be greater than zero.' });
  }

  const expense = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    amount: Number(amount),
    category: category && CATEGORIES.includes(category) ? category : 'Other',
    description: description || '',
    date: date || new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  };

  db.createExpense(expense);
  res.status(201).json({ expense });
});

// PUT /api/expenses/:id -> update an expense
router.put('/:id', (req, res) => {
  const { amount, category, description, date } = req.body;
  const updates = {};

  if (amount !== undefined) {
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number.' });
    }
    updates.amount = Number(amount);
  }
  if (category !== undefined) updates.category = CATEGORIES.includes(category) ? category : 'Other';
  if (description !== undefined) updates.description = description;
  if (date !== undefined) updates.date = date;

  const updated = db.updateExpense(req.params.id, req.user.id, updates);
  if (!updated) return res.status(404).json({ message: 'Expense not found.' });

  res.json({ expense: updated });
});

// DELETE /api/expenses/:id
router.delete('/:id', (req, res) => {
  const deleted = db.deleteExpense(req.params.id, req.user.id);
  if (!deleted) return res.status(404).json({ message: 'Expense not found.' });
  res.json({ message: 'Expense deleted.' });
});

// GET /api/expenses/meta/categories -> list of allowed categories
router.get('/meta/categories', (req, res) => {
  res.json({ categories: CATEGORIES });
});

module.exports = router;
