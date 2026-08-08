/*
  SSN Care Solutions - Interactive Website Logic
  Created: August 2026
*/

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Sticky Navigation & Active Link Highlight
  // ==========================================
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', () => {
    // Sticky Header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy active navigation state
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 2. Responsive Mobile Menu
  // ==========================================
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
      hamburger.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 3. Editorial Testimonial Carousel
  // ==========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-nav');
  let currentSlideIndex = 0;
  let testimonialInterval;

  if (slides.length > 0 && dotsContainer) {
    // Generate navigation dots based on slide count
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('testimonial-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => showSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonial-dot');

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlideIndex = index;
      
      // Reset autoplay timer when user manual overrides
      resetAutoplay();
    }

    function nextSlide() {
      let nextIndex = (currentSlideIndex + 1) % slides.length;
      showSlide(nextIndex);
    }

    function resetAutoplay() {
      clearInterval(testimonialInterval);
      testimonialInterval = setInterval(nextSlide, 7000);
    }

    // Start autoplay
    resetAutoplay();
  }

  // ==========================================
  // 4. Interactive Accordion (FAQ)
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all open FAQs
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-content').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 5. Instant Cleaning Estimate Calculator
  // ==========================================
  const calcServiceOptions = document.querySelectorAll('.option-card');
  const calcBedroomsSlider = document.getElementById('calc-bedrooms');
  const calcBathroomsSlider = document.getElementById('calc-bathrooms');
  const calcBedroomsValue = document.getElementById('calc-bedrooms-val');
  const calcBathroomsValue = document.getElementById('calc-bathrooms-val');
  const calcAddons = document.querySelectorAll('.calculator-form-group input[type="checkbox"]');
  
  // Results Elements
  const priceDisplay = document.getElementById('estimated-price');
  const detailServiceText = document.getElementById('detail-service');
  const detailHomeSizeText = document.getElementById('detail-home-size');
  const detailExtrasText = document.getElementById('detail-extras');

  let selectedService = 'standard';
  let selectedMultiplier = 1.0;
  let serviceName = 'Standard Cleaning';

  if (calcBedroomsSlider && calcBathroomsSlider) {
    
    // Select Service Card
    calcServiceOptions.forEach(option => {
      option.addEventListener('click', () => {
        calcServiceOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        
        selectedService = option.dataset.service;
        selectedMultiplier = parseFloat(option.dataset.multiplier);
        serviceName = option.querySelector('h4').textContent;
        
        calculatePrice();
      });
    });

    // Update Slider Labels on Input
    calcBedroomsSlider.addEventListener('input', (e) => {
      calcBedroomsValue.textContent = e.target.value;
      calculatePrice();
    });

    calcBathroomsSlider.addEventListener('input', (e) => {
      calcBathroomsValue.textContent = e.target.value;
      calculatePrice();
    });

    // Addons trigger change
    calcAddons.forEach(addon => {
      addon.addEventListener('change', calculatePrice);
    });

    function calculatePrice() {
      // Pricing Constants
      const BASE_FLAT_RATE = 75; // Starting base price
      const PRICE_PER_BEDROOM = 25;
      const PRICE_PER_BATHROOM = 15;
      
      const bedrooms = parseInt(calcBedroomsSlider.value);
      const bathrooms = parseInt(calcBathroomsSlider.value);
      
      // Calculate Room Costs
      const roomsTotal = (bedrooms * PRICE_PER_BEDROOM) + (bathrooms * PRICE_PER_BATHROOM);
      
      // Base Price before multipliers/addons
      let subtotal = BASE_FLAT_RATE + roomsTotal;
      
      // Apply service multiplier
      subtotal *= selectedMultiplier;
      
      // Calculate Extras
      let extrasTotal = 0;
      let selectedAddonsList = [];
      
      calcAddons.forEach(addon => {
        if (addon.checked) {
          const cost = parseFloat(addon.dataset.cost);
          extrasTotal += cost;
          selectedAddonsList.push(addon.name);
        }
      });
      
      // Final Sum
      const finalPrice = Math.round(subtotal + extrasTotal);
      
      // Update UI displays with counting transition
      animatePrice(finalPrice);
      
      // Update Details Display
      detailServiceText.textContent = serviceName;
      detailHomeSizeText.textContent = `${bedrooms} Bed, ${bathrooms} Bath`;
      detailExtrasText.textContent = selectedAddonsList.length > 0 
        ? selectedAddonsList.join(', ') 
        : 'None selected';
    }

    // Helper to animate price transition
    let currentDisplayedPrice = 75;
    function animatePrice(targetPrice) {
      const duration = 400; // ms
      const startTime = performance.now();
      const startPrice = currentDisplayedPrice;
      
      function update(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function outQuad
        const ease = progress * (2 - progress);
        const currentVal = Math.round(startPrice + (targetPrice - startPrice) * ease);
        
        priceDisplay.textContent = currentVal;
        currentDisplayedPrice = currentVal;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          priceDisplay.textContent = targetPrice;
          currentDisplayedPrice = targetPrice;
        }
      }
      
      requestAnimationFrame(update);
    }

    // Initial Pricing Calculation
    calculatePrice();
  }

  // ==========================================
  // 6. Booking & Consultation Modal Logic
  // ==========================================
  const modal = document.getElementById('consultation-modal');
  const modalWrapper = modal ? modal.querySelector('.modal-wrapper') : null;
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;
  
  // All Trigger Buttons
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const bookEstimateBtn = document.getElementById('book-estimate-btn');

  // Input elements in Modal to autofill
  const modalServiceSelect = document.getElementById('modal-service');
  const modalMessageArea = document.getElementById('modal-notes');

  function openModal() {
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = ''; // Resume background scrolling
  }

  if (modal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    // Autofill Modal details from Calculator Selection
    if (bookEstimateBtn) {
      bookEstimateBtn.addEventListener('click', () => {
        // Map selected calculator service to Modal service list
        if (modalServiceSelect) {
          if (selectedService === 'standard') modalServiceSelect.value = 'General Cleaning';
          else if (selectedService === 'deep') modalServiceSelect.value = 'Deep Cleaning & Sanitization';
          else if (selectedService === 'infection') modalServiceSelect.value = 'Infection Control / Sanitization';
          else if (selectedService === 'hoarding') modalServiceSelect.value = 'Specialist Care & Hoarding Support';
        }
        
        // Write message context
        if (modalMessageArea) {
          const bedrooms = calcBedroomsSlider.value;
          const bathrooms = calcBathroomsSlider.value;
          modalMessageArea.value = `Calculated Estimate: £${priceDisplay.textContent}. \nHome Details: ${bedrooms} Bedrooms, ${bathrooms} Bathrooms. \nService Selection: ${serviceName}.`;
        }
        
        openModal();
      });
    }
  }

  // ==========================================
  // 7. Intersection Observer for Fade-In Effects
  // ==========================================
  const fadeElements = document.querySelectorAll('.fade-in-up');
  
  if (fadeElements.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target); // Stop tracking once visible
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
  }

  // ==========================================
  // 8. Contact Form Submissions Handling
  // ==========================================
  const contactForm = document.getElementById('main-contact-form');
  const modalForm = document.getElementById('modal-consult-form');

  function handleFormSubmit(e, formType) {
    e.preventDefault();
    const form = e.target;
    
    // Simulate beautiful feedback
    const originalBtn = form.querySelector('button[type="submit"]');
    const originalText = originalBtn.innerHTML;
    originalBtn.innerHTML = 'Sending request...';
    originalBtn.disabled = true;

    setTimeout(() => {
      originalBtn.innerHTML = 'Success ✓';
      originalBtn.style.backgroundColor = '#2E7D32';
      originalBtn.style.borderColor = '#2E7D32';
      originalBtn.style.color = '#ffffff';

      // Show alert popup
      alert(`Thank you for choosing SSN Care Solutions! \nYour ${formType} has been received. A qualified care manager will review your details and contact you within 24 hours to schedule a consultation.`);
      
      // Reset form
      form.reset();
      
      if (formType === 'Consultation Request') {
        closeModal();
      }

      // Reset Button styles after timeout
      setTimeout(() => {
        originalBtn.innerHTML = originalText;
        originalBtn.style.backgroundColor = '';
        originalBtn.style.borderColor = '';
        originalBtn.style.color = '';
        originalBtn.disabled = false;
      }, 3000);

    }, 1500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Message & Request'));
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Consultation Request'));
  }
});
