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
  // 3. Editorial Testimonial Carousel (Dynamic)
  // ==========================================
  const defaultTestimonials = [
    { stars: 5, quote: "SSN Care Solutions was a godsend for our family. When my mother, who suffers from severe dementia, neglected her home and began hoarding, we didn't know who to call. The team's social work background meant they treated her with absolute dignity, respect, and kindness. The results were life-changing.", author: "Sarah H. — Family Caregiver, Birmingham" },
    { stars: 5, quote: "Unbelievably thorough and professional. As a clinical team lead coordinating hospital discharges, we need quick turnaround times to ensure homes are clinically clean before patients arrive back. SSN Care Solutions is reliable, compliant with all healthcare sanitization standards, and highly sensitive to patients.", author: "Dr. James K. — NHS Discharge Coordinator" },
    { stars: 5, quote: "They understand what care cleaning really means. They don't just scrub the floors; they make sure my uncle feels safe, comfortable, and independent in his space. Their eco-friendly practices are excellent, and the CQC-registered management gives us complete peace of mind.", author: "Mark D. — Guardian, Manchester" }
  ];

  // Load visibility and array from localStorage
  const testimonialsVisible = localStorage.getItem('ssn_testimonials_visible') !== 'false';
  const testimonialsSection = document.getElementById('testimonials-section');
  
  if (testimonialsSection) {
    testimonialsSection.style.display = testimonialsVisible ? 'block' : 'none';
  }

  const savedTestimonials = localStorage.getItem('ssn_testimonials');
  const testimonialsList = savedTestimonials ? JSON.parse(savedTestimonials) : defaultTestimonials;
  
  // Write default to localStorage if not exists so CMS can read it
  if (!savedTestimonials) {
    localStorage.setItem('ssn_testimonials', JSON.stringify(defaultTestimonials));
  }
  if (localStorage.getItem('ssn_testimonials_visible') === null) {
    localStorage.setItem('ssn_testimonials_visible', 'true');
  }

  const carouselContainer = document.getElementById('testimonials-carousel');
  
  if (carouselContainer && testimonialsVisible && testimonialsList.length > 0) {
    // Generate slides HTML
    testimonialsList.forEach((t, index) => {
      const slide = document.createElement('div');
      slide.className = `testimonial-slide${index === 0 ? ' active' : ''}`;
      
      let starsHTML = '';
      for (let s = 0; s < t.stars; s++) starsHTML += '★';
      
      slide.innerHTML = `
        <div class="testimonial-stars" aria-label="${t.stars} out of 5 stars">${starsHTML}</div>
        <blockquote class="testimonial-quote">"${t.quote}"</blockquote>
        <cite class="testimonial-author">${t.author}</cite>
      `;
      // Insert slide before the dots nav container
      const navContainer = carouselContainer.querySelector('.testimonial-nav');
      carouselContainer.insertBefore(slide, navContainer);
    });

    const slides = carouselContainer.querySelectorAll('.testimonial-slide');
    const dotsContainer = carouselContainer.querySelector('.testimonial-nav');
    let currentSlideIndex = 0;
    let testimonialInterval;

    if (slides.length > 0 && dotsContainer) {
      // Generate navigation dots
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
      });

      const dots = dotsContainer.querySelectorAll('.testimonial-dot');

      function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlideIndex = index;
        
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

      resetAutoplay();
    }
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
  // 6. Booking & Consultation Modal Logic
  // ==========================================
  const modal = document.getElementById('consultation-modal');
  const modalWrapper = modal ? modal.querySelector('.modal-wrapper') : null;
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;
  
  // All Trigger Buttons
  const openModalBtns = document.querySelectorAll('[data-open-modal]');

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

  // ==========================================
  // 9. Interactive Gallery & Lightbox Logic
  // ==========================================
  const defaultGalleryItems = [
    { src: 'work/0745f37b-2ee1-4afd-a3c5-b6e7a759b194.jpg', category: 'kitchen', caption: 'Kitchen Counter Deep Sanitization' },
    { src: 'work/07c217bf-8f00-4710-ba14-fc19f9240845.jpg', category: 'living', caption: 'Living Space De-clutter & Clean' },
    { src: 'work/1376bfd6-b6d4-4751-8fbc-90080903d44b.jpg', category: 'bathroom', caption: 'Bathroom Clinical Scrub' },
    { src: 'work/20e8c9c3-0f9f-42fc-bd63-7384f86056f1.jpg', category: 'living', caption: 'Supportive Living Bedroom Care' },
    { src: 'work/2b97dd28-19d9-4602-826d-3c42a619b94f.JPG', category: 'specialist', caption: 'Hoarding Support & Clear-out' },
    { src: 'work/328ac9fb-9340-4c30-850d-550be64ec511.jpg', category: 'living', caption: 'Detailed Floor Scrubbing' },
    { src: 'work/366d8124-9a32-41a6-b95d-e8d0d84409d1.JPG', category: 'specialist', caption: 'Deep Space Decontamination' },
    { src: 'work/5767402c-8a13-4256-a9e7-30d4ffe9cab0.jpg', category: 'bathroom', caption: 'Restroom Clinical Sanitation' },
    { src: 'work/580f9508-10e1-43b4-803d-e1eb5e6e1f8b.jpg', category: 'kitchen', caption: 'Oven and Stove Deep Scrub' },
    { src: 'work/6a5c7cc2-c7a0-4c25-aece-5d7246ca31f0.jpg', category: 'living', caption: 'Upholstery Extraction & Polish' },
    { src: 'work/6a6708b0-7196-4c80-903b-058631777a65.jpg', category: 'living', caption: 'Independent Living Bedroom Refresh' },
    { src: 'work/6c893140-bbec-49da-8d5c-e1eb3d748f2a.jpg', category: 'bathroom', caption: 'Shower and Tile Descaling' },
    { src: 'work/6d46f5f9-d53f-4f77-9e49-a5bec344377d.jpg', category: 'kitchen', caption: 'Kitchen Cabinet Care & Polish' },
    { src: 'work/715a5a51-36b6-46a7-8ce3-5225e73fdc13.JPG', category: 'specialist', caption: 'Post-Discharge Disinfection' },
    { src: 'work/7273b730-afa0-4044-a02f-4146eaa14a71.jpg', category: 'living', caption: 'Corridor Clear-out & Sanitization' },
    { src: 'work/7586e69b-8813-4b43-8c38-3810bfd068c6.jpg', category: 'living', caption: 'Window Frame & Glass Polishing' }
  ];

  const savedGalleryItems = localStorage.getItem('ssn_gallery_items');
  const galleryItems = savedGalleryItems ? JSON.parse(savedGalleryItems) : defaultGalleryItems;
  
  if (!savedGalleryItems) {
    localStorage.setItem('ssn_gallery_items', JSON.stringify(defaultGalleryItems));
  }

  const galleryGrid = document.getElementById('gallery-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  // Lightbox Elements
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxOverlay = document.querySelector('.lightbox-overlay');

  let activeFilter = 'all';
  let itemsLimit = 8;
  let currentFilteredItems = [];
  let activeLightboxIndex = 0;

  if (galleryGrid) {
    // Initial Render
    filterItems();

    // Filter Buttons Event Listeners
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        activeFilter = e.target.dataset.filter;
        itemsLimit = 8; // Reset limit
        filterItems();
      });
    });

    // Load More Button
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        itemsLimit += 8;
        filterItems();
      });
    }
  }

  function filterItems() {
    if (activeFilter === 'all') {
      currentFilteredItems = galleryItems;
    } else {
      currentFilteredItems = galleryItems.filter(item => item.category === activeFilter);
    }
    
    renderGallery();
  }

  function renderGallery() {
    galleryGrid.innerHTML = '';
    
    const visibleItems = currentFilteredItems.slice(0, itemsLimit);
    
    visibleItems.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'gallery-item';
      itemEl.style.display = 'block'; // Reveal card
      
      itemEl.innerHTML = `
        <img src="${item.src}" alt="${item.caption}" loading="lazy">
        <div class="gallery-overlay">
          <h4>${item.caption}</h4>
          <span>${formatCategoryName(item.category)}</span>
          <div class="gallery-zoom-icon" aria-label="Enlarge image">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
      `;
      
      itemEl.addEventListener('click', () => {
        openLightbox(index);
      });
      
      galleryGrid.appendChild(itemEl);
    });

    // Handle load more button visibility
    if (loadMoreBtn) {
      if (currentFilteredItems.length > itemsLimit) {
        loadMoreBtn.style.display = 'inline-flex';
      } else {
        loadMoreBtn.style.display = 'none';
      }
    }
  }

  function formatCategoryName(cat) {
    if (cat === 'living') return 'Living Room';
    if (cat === 'kitchen') return 'Kitchen';
    if (cat === 'bathroom') return 'Bathroom';
    if (cat === 'specialist') return 'Specialist Care';
    return cat;
  }

  // Lightbox Operations
  function openLightbox(index) {
    if (!lightbox) return;
    activeLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock screen scroll
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock screen scroll
  }

  function updateLightboxContent() {
    const currentItem = currentFilteredItems[activeLightboxIndex];
    if (currentItem) {
      lightboxImg.src = currentItem.src;
      lightboxImg.alt = currentItem.caption;
      lightboxCaption.textContent = currentItem.caption;
    }
  }

  function showNextImage() {
    activeLightboxIndex = (activeLightboxIndex + 1) % currentFilteredItems.length;
    updateLightboxContent();
  }

  // Prev image logic
  function showPrevImage() {
    activeLightboxIndex = (activeLightboxIndex - 1 + currentFilteredItems.length) % currentFilteredItems.length;
    updateLightboxContent();
  }

  if (lightbox) {
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

    // Keyboard navigation in lightbox
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
      }
    });
  }
});
