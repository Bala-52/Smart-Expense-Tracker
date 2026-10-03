// routes/dashboard.js
const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// GET /api/dashboard/summary
router.get('/summary', (req, res) => {
  const expenses = db.getExpensesByUser(req.user.id);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonthTotal = expenses
    .filter((e) => e.date && e.date.slice(0, 7) === currentMonthKey)
    .reduce((sum, e) => sum + e.amount, 0);

  // Category breakdown
  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  // Last 6 months trend (including current month)
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    const total = expenses
      .filter((e) => e.date && e.date.slice(0, 7) === key)
      .reduce((sum, e) => sum + e.amount, 0);
    monthlyTrend.push({ month: label, total });
  }

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  res.json({
    totalSpent,
    thisMonthTotal,
    expenseCount: expenses.length,
    categoryTotals,
    monthlyTrend,
    recentExpenses,
  });
});

module.exports = router;
