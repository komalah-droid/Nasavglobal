/**
 * Agensi Pekerjaan Nasav Global Sdn Bhd
 * Main Interactive Logic & Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initQuickFinder();
  initCostCalculator();
  initFaqAccordion();
  initConsultationForm();
  initInteractiveTimeline();
});

// --------------------------------------------------------------------------
// 1. Navbar & Mobile Drawer
// --------------------------------------------------------------------------
function initNavbar() {
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  // Sticky header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrapper?.classList.add('scrolled');
    } else {
      navbarWrapper?.classList.remove('scrolled');
    }
  });

  // Mobile drawer toggle
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileNavClose && mobileNav) {
    mobileNavClose.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close on outside click
  mobileNav?.addEventListener('click', (e) => {
    if (e.target === mobileNav) {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// --------------------------------------------------------------------------
// 2. Quick Finder Consultation Dispatcher
// --------------------------------------------------------------------------
function initQuickFinder() {
  const finderForm = document.getElementById('quickFinderForm');
  if (!finderForm) return;

  finderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const careType = document.getElementById('finderCareType')?.value || 'any';
    const nationality = document.getElementById('finderNationality')?.value || 'any';
    const location = document.getElementById('finderLocation')?.value || 'kl';

    // Map care types to readable names
    const careNames = {
      any: 'All Household Care',
      elderly: 'Elderly & Senior Care',
      childcare: 'Infant & Childcare / Nanny',
      housekeeping: 'General Housekeeping & Cooking'
    };

    const natNames = {
      any: 'No Preference',
      indonesian: 'Indonesian',
      filipino: 'Filipino'
    };

    // Pre-fill consultation form if on the page
    const consService = document.getElementById('consService');
    const consNationality = document.getElementById('consNationality');
    const consNotes = document.getElementById('consNotes');

    if (consService) {
      if (careType === 'elderly') consService.value = 'Elderly Care';
      else if (careType === 'childcare') consService.value = 'Childcare';
      else if (careType === 'housekeeping') consService.value = 'Housekeeping';
    }

    if (consNationality) {
      if (nationality === 'indonesian') consNationality.value = 'Indonesian';
      else if (nationality === 'filipino') consNationality.value = 'Filipino';
      else consNationality.value = 'Either';
    }

    if (consNotes && location) {
      consNotes.value = `Location: ${location.toUpperCase()}. Looking for ${careNames[careType] || 'domestic helper'} (${natNames[nationality] || 'Any origin'}).`;
    }

    // Scroll smoothly to contact section
    const contactSection = document.getElementById('contactSection');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('consName')?.focus();
    }
  });
}

// --------------------------------------------------------------------------
// 3. Interactive Cost & Transparent Requirement Calculator
// --------------------------------------------------------------------------
function initCostCalculator() {
  const calcContainer = document.getElementById('costCalculator');
  if (!calcContainer) return;

  const chips = document.querySelectorAll('.calc-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const parent = chip.closest('.calc-chips');
      parent.querySelectorAll('.calc-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      calculateCost();
    });
  });

  calculateCost();
}

function calculateCost() {
  const nationality = document.querySelector('[data-calc="nationality"].active')?.getAttribute('data-value') || 'indonesia';
  const serviceType = document.querySelector('[data-calc="service"].active')?.getAttribute('data-value') || 'general';
  
  // Cost breakdown estimates in MYR based on official Malaysian regulations & agency processing
  let govtLevy = 410; // Annual maid levy in Malaysia
  let fomema = 210;   // FOMEMA medical checkup + screening
  let insuranceSocso = 320; // Mandatory SOCSO & Foreign Worker Insurance scheme
  let visaProcessing = 650; // Calling visa (VDR) & immigration processing fees
  let agencyRecruitment = 0;
  let estimatedSalary = 1500; // Monthly basic wage guideline

  if (nationality === 'indonesia') {
    agencyRecruitment = 9800; // Standardized bi-lateral Indonesia-Malaysia MOU fee structure
    estimatedSalary = 1500;
  } else {
    agencyRecruitment = 11200; // Philippines POEA / DMW accredited documentation, airfare & welfare fund
    estimatedSalary = 1680; // Standard USD ~400 equivalent
  }

  if (serviceType === 'elderly') {
    agencyRecruitment += 600;
  } else if (serviceType === 'childcare') {
    agencyRecruitment += 400;
  }

  const subtotalPackage = govtLevy + fomema + insuranceSocso + visaProcessing + agencyRecruitment;

  // Update DOM elements if they exist
  const levyEl = document.getElementById('costLevy');
  const fomemaEl = document.getElementById('costFomema');
  const insuranceEl = document.getElementById('costInsurance');
  const visaEl = document.getElementById('costVisa');
  const agencyEl = document.getElementById('costAgency');
  const totalEl = document.getElementById('costTotalPackage');
  const salaryEl = document.getElementById('costMonthlySalary');

  if (levyEl) levyEl.textContent = `RM ${govtLevy.toLocaleString()}`;
  if (fomemaEl) fomemaEl.textContent = `RM ${fomema.toLocaleString()}`;
  if (insuranceEl) insuranceEl.textContent = `RM ${insuranceSocso.toLocaleString()}`;
  if (visaEl) visaEl.textContent = `RM ${visaProcessing.toLocaleString()}`;
  if (agencyEl) agencyEl.textContent = `RM ${agencyRecruitment.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `RM ${subtotalPackage.toLocaleString()}`;
  if (salaryEl) salaryEl.textContent = `RM ${estimatedSalary.toLocaleString()} / mo`;
}

// --------------------------------------------------------------------------
// 4. Interactive FAQ Accordion
// --------------------------------------------------------------------------
function initFaqAccordion() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const wasActive = item.classList.contains('active');

      const parentGroup = item.closest('.accordion-group');
      if (parentGroup) {
        parentGroup.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      }

      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  const faqTabs = document.querySelectorAll('.faq-tab-btn');
  faqTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      faqTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');
      const allItems = document.querySelectorAll('.faq-item-entry');
      allItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-faq-cat') === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// --------------------------------------------------------------------------
// 5. Consultation Form & WhatsApp Dispatcher
// --------------------------------------------------------------------------
function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('consName')?.value || '';
    const phone = document.getElementById('consPhone')?.value || '';
    const service = document.getElementById('consService')?.value || 'Domestic Care';
    const nationality = document.getElementById('consNationality')?.value || 'Any';
    const notes = document.getElementById('consNotes')?.value || '';

    const message = `Hello Agensi Pekerjaan Nasav Global,\n\nI would like to consult on hiring a helper.\n- Employer Name: ${name}\n- Contact Number: ${phone}\n- Service Needed: ${service}\n- Preferred Helper Origin: ${nationality}\n- Details/Requirements: ${notes || 'None specified'}\n\nPlease get in touch with me soonest.`;

    const whatsappUrl = `https://wa.me/60143332566?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Show success feedback
    form.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: #ECFDF5; color: #0D9488; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h4 style="font-size: 1.25rem; font-weight: 700; color: var(--slate-900); margin-bottom: 0.5rem;">Inquiry Forwarded via WhatsApp!</h4>
        <p style="font-size: 0.9rem; color: var(--slate-600); margin-bottom: 1.5rem;">Our customer consultant will review your home requirements and contact you immediately.</p>
        <button class="btn btn-secondary btn-sm" onclick="location.reload()">Send Another Request</button>
      </div>
    `;
  });
}

// --------------------------------------------------------------------------
// 6. Interactive Scroll-Driven Timeline Color & Progress
// --------------------------------------------------------------------------
function initInteractiveTimeline() {
  const container = document.querySelector('.timeline-container');
  const progressBar = document.getElementById('timelineProgressBar');
  const steps = document.querySelectorAll('.timeline-step');
  if (!container || !steps.length) return;

  function onScroll() {
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Trigger line is 55% from the top of the viewport
    const triggerY = windowHeight * 0.55;

    // Calculate progress fill percentage through timeline container
    const totalHeight = rect.height;
    const progressPx = Math.max(0, Math.min(totalHeight, triggerY - rect.top));
    const progressPercent = (progressPx / totalHeight) * 100;

    if (progressBar) {
      progressBar.style.height = `${progressPercent}%`;
    }

    // Activate/illuminate each step as the scroll line crosses its node
    steps.forEach((step) => {
      const stepRect = step.getBoundingClientRect();
      const nodeCenter = stepRect.top + 24;

      if (nodeCenter <= triggerY) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', onScroll, { passive: true });

  // Initial calculation on load
  onScroll();
}
