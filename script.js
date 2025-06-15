document.addEventListener('DOMContentLoaded', function() {
  // ===== Preloader =====
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 1000);
    });
  }

  // ===== Theme Toggle =====
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.setAttribute('data-theme', 
        document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
      );
      localStorage.setItem('theme', document.body.getAttribute('data-theme'));
      themeToggle.querySelector('.theme-icon').textContent = 
        document.body.getAttribute('data-theme') === 'light' ? '☀️' : '🌙';
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.querySelector('.theme-icon').textContent = 
      savedTheme === 'light' ? '☀️' : '🌙';
  }

  // ===== Mobile Menu =====
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      mobileMenuBtn.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    });
  }

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          mobileMenuBtn.textContent = '☰';
        }
        
        // Smooth scroll to target
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without page jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });

  // ===== Header Scroll Effect =====
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    });
    
    // Trigger on load in case page is scrolled
    window.dispatchEvent(new Event('scroll'));
  }

  // ===== Back to Top Button =====
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== Animate Stats =====
  const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const suffix = stat.textContent.match(/\D+$/) ? stat.textContent.match(/\D+$/)[0] : '';
      let count = 0;
      const duration = 2000; // Animation duration in ms
      const increment = target / (duration / 16); // 60fps
      
      const updateCount = () => {
        count += increment;
        if (count < target) {
          stat.textContent = Math.floor(count) + suffix;
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target + suffix;
        }
      };
      
      // Start animation when element is in viewport
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          updateCount();
          observer.unobserve(stat);
        }
      });
      
      observer.observe(stat);
    });
  };
  
  // Run stats animation when page loads
  setTimeout(animateStats, 1000);

  // ===== Features Tabs =====
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabButtons.length && tabContents.length) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding content
        const tabId = button.getAttribute('data-tab');
        document.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
      });
    });
  }

  // ===== Pricing Toggle =====
  const pricingToggle = document.getElementById('pricingToggle');
  const monthlyPrices = document.querySelectorAll('.monthly-price');
  const annualPrices = document.querySelectorAll('.annual-price');
  
  if (pricingToggle && monthlyPrices.length && annualPrices.length) {
    pricingToggle.addEventListener('change', () => {
      if (pricingToggle.checked) {
        monthlyPrices.forEach(price => price.classList.add('hidden'));
        annualPrices.forEach(price => price.classList.remove('hidden'));
      } else {
        monthlyPrices.forEach(price => price.classList.remove('hidden'));
        annualPrices.forEach(price => price.classList.add('hidden'));
      }
    });
  }

  // ===== Testimonial Slider =====
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let currentTestimonial = 0;
  
  if (testimonials.length) {
    const showTestimonial = (index) => {
      testimonials.forEach(testimonial => testimonial.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      testimonials[index].classList.add('active');
      dots[index].classList.add('active');
      currentTestimonial = index;
    };
    
    // Next testimonial
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        let nextIndex = currentTestimonial + 1;
        if (nextIndex >= testimonials.length) nextIndex = 0;
        showTestimonial(nextIndex);
      });
    }
    
    // Previous testimonial
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        let prevIndex = currentTestimonial - 1;
        if (prevIndex < 0) prevIndex = testimonials.length - 1;
        showTestimonial(prevIndex);
      });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showTestimonial(index);
      });
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
      let nextIndex = currentTestimonial + 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      showTestimonial(nextIndex);
    }, 8000);
  }

  // ===== FAQ Accordion =====
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const toggle = item.querySelector('.faq-toggle');
      
      question.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    });
  }

  // ===== Video Modal =====
  const videoModal = document.getElementById('videoModal');
  const videoBtns = document.querySelectorAll('.video-btn');
  const closeVideoModal = document.getElementById('closeVideoModal');
  const demoVideo = document.getElementById('demoVideo');
  
  if (videoModal) {
    // Open modal
    videoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        demoVideo.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
        videoModal.classList.add('visible');
        document.body.style.overflow = 'hidden';
      });
    });
    
    // Close modal
    closeVideoModal.addEventListener('click', () => {
      demoVideo.src = '';
      videoModal.classList.remove('visible');
      document.body.style.overflow = '';
    });
    
    videoModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        demoVideo.src = '';
        videoModal.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== Contact Form Submission =====
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value.trim();
      
      if (!validateEmail(email)) {
        showToast('❌ Please enter a valid email address.', 'error');
        return;
      }
      
      simulateLoading(form.querySelector('button'), () => {
        form.reset();
        showToast('✅ Thanks for joining Autopatch+ Early Access!', 'success');
      });
    });
  }

  // ===== Modal Logic =====
  const modal = document.getElementById('modal');
  const openModal = document.getElementById('openModal');
  const openModalMobile = document.getElementById('openModalMobile');
  const closeModal = document.getElementById('closeModal');
  const submitDemo = document.getElementById('submitDemo');
  const modalEmail = document.getElementById('modal-email');
  
  // Open modal
  if (openModal) {
    openModal.addEventListener('click', () => {
      modal.classList.add('visible');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (modalEmail) modalEmail.focus();
      }, 300);
    });
  }
  
  if (openModalMobile) {
    openModalMobile.addEventListener('click', () => {
      modal.classList.add('visible');
      document.body.style.overflow = 'hidden';
      mobileMenu.classList.remove('active');
      mobileMenuBtn.textContent = '☰';
      setTimeout(() => {
        if (modalEmail) modalEmail.focus();
      }, 300);
    });
  }
  
  // Close modal
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.classList.remove('visible');
      document.body.style.overflow = '';
    });
  }
  
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target.classList.contains('modal-backdrop')) {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Escape key closes modal
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('visible')) {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
      }
      if (videoModal && videoModal.classList.contains('visible')) {
        videoModal.classList.remove('visible');
        demoVideo.src = '';
        document.body.style.overflow = '';
      }
      if (enterpriseModal && enterpriseModal.classList.contains('visible')) {
        enterpriseModal.classList.remove('visible');
        document.body.style.overflow = '';
      }
    }
  });

  // ===== Demo Submission =====
  if (submitDemo) {
    submitDemo.addEventListener('click', () => {
      const email = modalEmail.value.trim();
      
      if (!validateEmail(email)) {
        showToast('❌ Enter a valid email.', 'error');
        return;
      }
      
      simulateLoading(submitDemo, () => {
        showToast('✅ Demo request submitted! We\'ll follow up soon.', 'success');
        modal.classList.remove('visible');
        document.body.style.overflow = '';
        modalEmail.value = '';
      });
    });
  }

  // ===== Enterprise Modal =====
  const enterpriseModal = document.getElementById('enterpriseModal');
  const openEnterpriseModal = document.getElementById('openEnterpriseModal');
  const closeEnterpriseModal = document.getElementById('closeEnterpriseModal');
  const submitEnterprise = document.getElementById('submitEnterprise');
  
  if (openEnterpriseModal) {
    openEnterpriseModal.addEventListener('click', () => {
      enterpriseModal.classList.add('visible');
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (closeEnterpriseModal) {
    closeEnterpriseModal.addEventListener('click', () => {
      enterpriseModal.classList.remove('visible');
      document.body.style.overflow = '';
    });
  }
  
  if (enterpriseModal) {
    enterpriseModal.addEventListener('click', e => {
      if (e.target.classList.contains('modal-backdrop')) {
        enterpriseModal.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  }
  
  if (submitEnterprise) {
    submitEnterprise.addEventListener('click', () => {
      const email = document.getElementById('enterprise-email').value.trim();
      
      if (!validateEmail(email)) {
        showToast('❌ Enter a valid email.', 'error');
        return;
      }
      
      simulateLoading(submitEnterprise, () => {
        showToast('✅ Your enterprise request has been submitted! Our sales team will contact you shortly.', 'success');
        enterpriseModal.classList.remove('visible');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Initialize Particles.js =====
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#8f5eff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#8f5eff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
  }

  // ===== Log to confirm script is working =====
  console.log('%cAutopatch+ script loaded 🚀', 'color: #8f5eff; font-weight: bold; font-size: 1.2rem;');
  console.log('%cLooking for a frontend developer? 😊', 'color: #00e1ff; font-size: 1rem;');
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

// ===== Inject Styles for Toasts and Loader =====
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
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
.toast.visible {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}
.toast.success { background: var(--success-color); }
.toast.error { background: var(--error-color); }
.toast.warning { background: var(--warning-color); }

.loader {
  border: 3px solid #ccc;
  border-top: 3px solid var(--primary-color);
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