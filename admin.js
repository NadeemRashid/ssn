/*
  SSN Care Solutions - Admin Portal CMS Script
  Created: August 2026
*/

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Session Login Verification
  // ==========================================
  const loginOverlay = document.getElementById('login-overlay');
  const loginForm = document.getElementById('admin-login-form');
  const passcodeField = document.getElementById('admin-passcode');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  // Check login state
  const sessionActive = sessionStorage.getItem('ssn_admin_session') === 'active';
  if (sessionActive) {
    loginOverlay.classList.add('hidden');
  }

  // Handle Login form
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const passcode = passcodeField.value.trim();
      
      // Simple administrative check
      if (passcode === 'admin123') {
        sessionStorage.setItem('ssn_admin_session', 'active');
        loginOverlay.classList.add('hidden');
        loginError.style.display = 'none';
        passcodeField.value = '';
      } else {
        loginError.style.display = 'block';
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('ssn_admin_session');
      window.location.reload();
    });
  }

  // ==========================================
  // 2. Data Arrays & Defaults
  // ==========================================
  const workImages = [
    'work/0745f37b-2ee1-4afd-a3c5-b6e7a759b194.jpg',
    'work/07c217bf-8f00-4710-ba14-fc19f9240845.jpg',
    'work/1376bfd6-b6d4-4751-8fbc-90080903d44b.jpg',
    'work/20e8c9c3-0f9f-42fc-bd63-7384f86056f1.jpg',
    'work/2b97dd28-19d9-4602-826d-3c42a619b94f.JPG',
    'work/328ac9fb-9340-4c30-850d-550be64ec511.jpg',
    'work/366d8124-9a32-41a6-b95d-e8d0d84409d1.JPG',
    'work/5767402c-8a13-4256-a9e7-30d4ffe9cab0.jpg',
    'work/580f9508-10e1-43b4-803d-e1eb5e6e1f8b.jpg',
    'work/6a5c7cc2-c7a0-4c25-aece-5d7246ca31f0.jpg',
    'work/6a6708b0-7196-4c80-903b-058631777a65.jpg',
    'work/6c893140-bbec-49da-8d5c-e1eb3d748f2a.jpg',
    'work/6d46f5f9-d53f-4f77-9e49-a5bec344377d.jpg',
    'work/715a5a51-36b6-46a7-8ce3-5225e73fdc13.JPG',
    'work/7273b730-afa0-4044-a02f-4146eaa14a71.jpg',
    'work/7586e69b-8813-4b43-8c38-3810bfd068c6.jpg',
    'work/8610a176-5df2-48d3-9c96-7f223eaf4615.jpg',
    'work/891f84c1-5bd8-4baf-825e-bab30151ac20.jpg',
    'work/894a4ec3-41d6-4251-8b7c-fca296598e6f.jpg',
    'work/8ee84376-03ba-492b-a9bb-a8c06f8ca88b.jpg',
    'work/9de1d059-41bc-442d-848b-9ae24e96097b.jpg',
    'work/Picture 10.jpg',
    'work/Picture 13.jpg',
    'work/Picture 14.jpg',
    'work/Picture 3.jpg',
    'work/Picture 4.jpg',
    'work/Picture 5.jpg',
    'work/a0858211-f6c8-4393-87fd-9452c9f72773.jpg',
    'work/a3381d97-b749-4bc9-bc9c-cdf6ee5cf112.JPG',
    'work/ab6c50a6-5e11-40b1-9f8c-1d224d87b287.jpg',
    'work/beb5218a-769a-4c71-beb7-efae8af24da5.jpg',
    'work/c1a79048-de1f-4adc-a049-bc63bab54ab0.jpg',
    'work/d1bc2ec4-6bac-4cd0-a64d-17cc61ca499c.jpg',
    'work/da390f94-bc25-45b5-afe2-d207ab9f1b64.jpg',
    'work/da6716ed-f3cc-430e-9b7d-458fa6df34ad.jpg',
    'work/e5a2b071-50d2-473a-bc55-c82c82592cc6.jpg',
    'work/image006.jpg',
    'work/image007.jpg'
  ];

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

  const defaultTestimonials = [
    { stars: 5, quote: "SSN Care Solutions was a godsend for our family. When my mother, who suffers from severe dementia, neglected her home and began hoarding, we didn't know who to call. The team's social work background meant they treated her with absolute dignity, respect, and kindness. The results were life-changing.", author: "Sarah H. — Family Caregiver, Birmingham" },
    { stars: 5, quote: "Unbelievably thorough and professional. As a clinical team lead coordinating hospital discharges, we need quick turnaround times to ensure homes are clinically clean before patients arrive back. SSN Care Solutions is reliable, compliant with all healthcare sanitization standards, and highly sensitive to patients.", author: "Dr. James K. — NHS Discharge Coordinator" },
    { stars: 5, quote: "They understand what care cleaning really means. They don't just scrub the floors; they make sure my uncle feels safe, comfortable, and independent in his space. Their eco-friendly practices are excellent, and the CQC-registered management gives us complete peace of mind.", author: "Mark D. — Guardian, Manchester" }
  ];

  // Active state containers loaded from storage or defaults
  let galleryItems = [];
  let testimonialsList = [];
  let testimonialsVisible = true;

  // Initialize data
  function initData() {
    const savedGallery = localStorage.getItem('ssn_gallery_items');
    galleryItems = savedGallery ? JSON.parse(savedGallery) : [...defaultGalleryItems];

    const savedTestimonials = localStorage.getItem('ssn_testimonials');
    testimonialsList = savedTestimonials ? JSON.parse(savedTestimonials) : [...defaultTestimonials];

    const savedVisibility = localStorage.getItem('ssn_testimonials_visible');
    testimonialsVisible = savedVisibility !== null ? savedVisibility !== 'false' : true;

    // Prepopulate Image Selector Select
    const imgSelect = document.getElementById('gallery-img-select');
    if (imgSelect) {
      imgSelect.innerHTML = '<option value="" disabled selected>Choose a file...</option>';
      workImages.forEach(img => {
        const option = document.createElement('option');
        option.value = img;
        option.textContent = img.replace('work/', '');
        imgSelect.appendChild(option);
      });
    }

    // Set Visibility toggle switch checked state
    const visToggle = document.getElementById('testimonials-visibility-toggle');
    if (visToggle) {
      visToggle.checked = testimonialsVisible;
    }

    renderLists();
  }

  // ==========================================
  // 3. Dynamic Lists Rendering
  // ==========================================
  const galleryManagerList = document.getElementById('gallery-manager-list');
  const testimonialsManagerList = document.getElementById('testimonials-manager-list');

  function renderLists() {
    // Render Gallery
    if (galleryManagerList) {
      galleryManagerList.innerHTML = '';
      if (galleryItems.length === 0) {
        galleryManagerList.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-light); font-size: 0.85rem;">No gallery items active. Add one below.</div>';
      } else {
        galleryItems.forEach((item, index) => {
          const div = document.createElement('div');
          div.className = 'manager-item';
          div.innerHTML = `
            <img src="${item.src}" alt="${item.caption}" class="manager-thumb">
            <div class="manager-info">
              <h4>${item.caption}</h4>
              <p>Tag: ${item.category} • File: ${item.src.replace('work/', '')}</p>
            </div>
            <button type="button" class="manager-delete-btn" data-index="${index}" data-type="gallery">Delete</button>
          `;
          galleryManagerList.appendChild(div);
        });
      }
    }

    // Render Testimonials
    if (testimonialsManagerList) {
      testimonialsManagerList.innerHTML = '';
      if (testimonialsList.length === 0) {
        testimonialsManagerList.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-light); font-size: 0.85rem;">No active testimonials. Add one below.</div>';
      } else {
        testimonialsList.forEach((t, index) => {
          const div = document.createElement('div');
          div.className = 'manager-item';
          
          let starsHTML = '';
          for (let s = 0; s < t.stars; s++) starsHTML += '★';

          div.innerHTML = `
            <div class="manager-info">
              <h4 style="color: var(--accent-dark);">${starsHTML}</h4>
              <blockquote style="font-size: 0.8rem; line-height: 1.4; color: var(--text-muted); margin: 0.3rem 0; font-style: italic;">"${t.quote.substring(0, 80)}..."</blockquote>
              <p>By: ${t.author}</p>
            </div>
            <button type="button" class="manager-delete-btn" data-index="${index}" data-type="testimonial">Delete</button>
          `;
          testimonialsManagerList.appendChild(div);
        });
      }
    }

    // Bind delete buttons
    document.querySelectorAll('.manager-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const type = e.target.dataset.type;
        
        if (type === 'gallery') {
          galleryItems.splice(index, 1);
        } else {
          testimonialsList.splice(index, 1);
        }
        renderLists();
      });
    });
  }

  // ==========================================
  // 4. Form Submissions
  // ==========================================
  const addGalleryForm = document.getElementById('add-gallery-form');
  const addTestimonialForm = document.getElementById('add-testimonial-form');

  // Handle Add Gallery
  if (addGalleryForm) {
    addGalleryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const src = document.getElementById('gallery-img-select').value;
      const title = document.getElementById('gallery-img-title').value.trim();
      const tag = document.getElementById('gallery-img-tag').value;

      if (!src) {
        alert('Please choose an image file.');
        return;
      }

      galleryItems.push({
        src: src,
        category: tag,
        caption: title
      });

      // Reset
      document.getElementById('gallery-img-select').value = '';
      document.getElementById('gallery-img-title').value = '';
      renderLists();
    });
  }

  // Handle Add Testimonial
  if (addTestimonialForm) {
    addTestimonialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const stars = parseInt(document.getElementById('test-rating').value);
      const quote = document.getElementById('test-quote').value.trim();
      const author = document.getElementById('test-author').value.trim();

      testimonialsList.push({
        stars: stars,
        quote: quote,
        author: author
      });

      // Reset
      document.getElementById('test-quote').value = '';
      document.getElementById('test-author').value = '';
      renderLists();
    });
  }

  // ==========================================
  // 5. Save & Publish, Reset Default Actions
  // ==========================================
  const saveBtn = document.getElementById('save-publish-btn');
  const resetBtn = document.getElementById('reset-defaults-btn');
  const visToggle = document.getElementById('testimonials-visibility-toggle');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const isVisible = visToggle ? visToggle.checked : true;
      
      localStorage.setItem('ssn_gallery_items', JSON.stringify(galleryItems));
      localStorage.setItem('ssn_testimonials', JSON.stringify(testimonialsList));
      localStorage.setItem('ssn_testimonials_visible', isVisible ? 'true' : 'false');
      
      alert('Changes saved! The SSN Care Solutions website is updated successfully.');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to revert all values to defaults? This will erase any custom additions.')) {
        localStorage.removeItem('ssn_gallery_items');
        localStorage.removeItem('ssn_testimonials');
        localStorage.removeItem('ssn_testimonials_visible');
        initData();
        alert('Website default values restored successfully.');
      }
    });
  }

  // Run initialization
  initData();
});
