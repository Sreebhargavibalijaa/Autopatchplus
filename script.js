// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
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
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const submitDemo = document.getElementById('submitDemo');
const modalEmail = document.getElementById('modal-email');
const modalBackdrop = document.querySelector('.modal-backdrop');

// Open modal
openModalBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modalEmail.focus(), 300);
});

// Close modal
const closeModal = () => {
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
};

closeModalBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

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
    showToast('✅ Demo request submitted! We'll follow up soon.', 'success');
    closeModal();
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

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Animate elements when they come into view
document.querySelectorAll('.card, .step, .stat, .gallery-item').forEach(el => {
  observer.observe(el);
});

// Founder section specific animations
const founderSection = document.getElementById('founders');
if (founderSection) {
  const stats = document.querySelectorAll('.stat');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Animate stats with counting effect
  const animateStats = () => {
    stats.forEach(stat => {
      const target = parseInt(stat.querySelector('h4').textContent);
      let current = 0;
      const increment = target / 50; // Adjust speed here
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.querySelector('h4').textContent = `${target}+`;
          clearInterval(timer);
        } else {
          stat.querySelector('h4').textContent = `${Math.floor(current)}+`;
        }
      }, 40);
    });
  };

  // Parallax effect for gallery images
  const handleParallax = (e) => {
    galleryItems.forEach(item => {
      const speed = 0.1;
      const rect = item.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        item.style.transform = `translateX(${x}px) translateY(${y}px)`;
      }
    });
  };

  // Initialize animations when founder section is in view
  const founderObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateStats();
      document.addEventListener('mousemove', handleParallax);
      founderObserver.unobserve(entries[0].target);
    }
  }, observerOptions);

  founderObserver.observe(founderSection);
}

// Add smooth reveal animation for sections
document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});
