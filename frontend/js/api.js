// api.js — shared helper for calling the backend API
const API_BASE = '/api';

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // send/receive the httpOnly auth cookie
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    // no JSON body
  }

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
}

function showAlert(elId, message, type = 'error') {
  const box = document.getElementById(elId);
  if (!box) return;
  box.textContent = message;
  box.className = `alert ${type}`;
  box.classList.remove('hidden');
  setTimeout(() => box.classList.add('hidden'), 4000);
}
