// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Contact Form Submission =====
const form = document.getElementById('contact-form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const email = form.querySelector('input').value.trim();

  if (!validateEmail(email)) {
    showToast('❌ Please enter a valid email address.', 'error');
    return;
  }

  simulateLoading(form.querySelector('button'), () => {
    form.reset();
    showToast('✅ Thanks for joining Autopatch+ Early Access!', 'success');
  });
});

// ===== Modal Logic =====
const modal = document.getElementById('modal');
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const submitDemo = document.getElementById('submitDemo');
const modalEmail = document.getElementById('modal-email');

openModal?.addEventListener('click', () => {
  modal.classList.add('visible');
  setTimeout(() => modalEmail.focus(), 300);
});

closeModal?.addEventListener('click', () => modal.classList.remove('visible'));

modal?.addEventListener('click', e => {
  if (e.target.classList.contains('modal-backdrop')) {
    modal.classList.remove('visible');
  }
});

// Escape key closes modal
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('visible')) {
    modal.classList.remove('visible');
  }
});

// ===== Demo Submission =====
submitDemo?.addEventListener('click', () => {
  const email = modalEmail.value.trim();

  if (!validateEmail(email)) {
    showToast('❌ Enter a valid email.', 'error');
    return;
  }

  simulateLoading(submitDemo, () => {
    showToast('✅ Demo request submitted! We’ll follow up soon.', 'success');
    modal.classList.remove('visible');
    modalEmail.value = '';
  });
});

// ===== Utilities =====

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
}

function simulateLoading(button, callback, duration = 1200) {
  if (!button) return;
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `<span class="loader"></span>`;
  setTimeout(() => {
    button.disabled = false;
    button.innerHTML = originalText;
    callback();
  }, duration);
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('visible');
  }, 100);

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== Inject Styles for Toasts and Loader (Optional for JS-only setup) =====
const style = document.createElement('style');
style.innerHTML = `
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  background: #222;
  color: #fff;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 9999;
  pointer-events: none;
}
.toast.visible {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}
.toast.success { background: #22c55e; }
.toast.error { background: #ef4444; }

.loader {
  border: 3px solid #ccc;
  border-top: 3px solid #8f5eff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  vertical-align: middle;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

// ===== Log to confirm script is working =====
console.log('%cAutopatch+ script loaded 🚀', 'color: #8f5eff; font-weight: bold;');
