// login.js — handles the login/register tabs and form submissions

const tabBtns = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.tab === 'login') {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    } else {
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    }
  });
});

// If already logged in, skip straight to the dashboard
(async function checkExistingSession() {
  try {
    await apiRequest('/auth/me');
    window.location.href = 'dashboard.html';
  } catch (e) {
    // not logged in — stay on this page
  }
})();

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = 'Logging in...';

  try {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    await apiRequest('/auth/login', { method: 'POST', body: { email, password } });
    window.location.href = 'dashboard.html';
  } catch (err) {
    showAlert('alertBox', err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Login';
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('registerBtn');
  btn.disabled = true;
  btn.textContent = 'Creating account...';

  try {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    await apiRequest('/auth/register', { method: 'POST', body: { name, email, password } });
    window.location.href = 'dashboard.html';
  } catch (err) {
    showAlert('alertBox', err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
});
