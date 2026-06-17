'use strict';

// ===== STATE =====
const state = {
  loanProduct: null,
  propertyType: null,
  propertyUse: null,
  homeValue: 1000000,
  mortgageBalance: 0,
  noMortgage: false,
  desiredAmount: null,
  loanPurpose: null,
  creditScore: null,
  zipCode: '92618',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  usState: '',
  dobMonth: '',
  dobDay: '',
  dobYear: ''
};

const TOTAL_STEPS = 14;
let currentStep = 1;
let goingBack = false;

const ZIP_DB = {
  '92618': 'Irvine, CA',
  '90210': 'Beverly Hills, CA',
  '10001': 'New York, NY',
  '60601': 'Chicago, IL',
  '77001': 'Houston, TX',
  '85001': 'Phoenix, AZ',
  '19101': 'Philadelphia, PA',
  '78201': 'San Antonio, TX',
  '92101': 'San Diego, CA',
  '75201': 'Dallas, TX',
  '33101': 'Miami, FL',
  '98101': 'Seattle, WA',
  '80201': 'Denver, CO',
  '30301': 'Atlanta, GA',
  '02101': 'Boston, MA'
};

// ===== UTILS =====
function fmt(n) {
  if (!n && n !== 0) return '';
  return Number(n).toLocaleString('en-US');
}
function parseDollar(str) {
  return parseInt(String(str).replace(/[^0-9]/g, ''), 10) || 0;
}
function calcEquity() {
  return Math.max(0, (state.homeValue || 0) - (state.noMortgage ? 0 : (state.mortgageBalance || 0)));
}
function calcMaxLoan() {
  return Math.floor(calcEquity() * 0.85);
}
function lookupZip(zip) {
  return ZIP_DB[zip] || (zip && zip.length === 5 ? '' : '');
}
function phoneFormat(v) {
  const d = v.replace(/\D/g, '').substring(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0,3)}) ${d.slice(3)}`;
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
}
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

// ===== RENDER =====
function render() {
  const body    = document.getElementById('form-body');
  const fill    = document.getElementById('progress-fill');
  const counter = document.getElementById('step-counter');
  const backBtn = document.getElementById('back-btn');

  const pct = ((currentStep / TOTAL_STEPS) * 100).toFixed(1);
  fill.style.width = pct + '%';
  counter.textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
  backBtn.classList.toggle('visible', currentStep > 1);

  body.innerHTML = '';
  const step = document.createElement('div');
  step.className = 'form-step' + (goingBack ? ' going-back' : '');
  step.innerHTML = buildStep(currentStep);
  body.appendChild(step);

  attachStepListeners(currentStep);
  goingBack = false;

  // Scroll card into view smoothly
  const card = document.querySelector('.form-card');
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== STEP CONTENT BUILDERS =====
function buildStep(n) {
  switch (n) {
    case 1:  return buildStep1();
    case 2:  return buildStep2();
    case 3:  return buildStep3();
    case 4:  return buildStep4();
    case 5:  return buildStep5();
    case 6:  return buildStep6();
    case 7:  return buildStep7();
    case 8:  return buildStep8();
    case 9:  return buildStep9();
    case 10: return buildStep10();
    case 11: return buildStep11();
    case 12: return buildStep12();
    case 13: return buildStep13();
    case 14: return buildStep14();
    default: return '';
  }
}

// ===== OPTION CARD HELPERS =====
function optCard(field, value, icon, label, desc) {
  const sel = state[field] === value;
  return `
    <button class="option-card${sel ? ' selected' : ''}" data-field="${field}" data-value="${value}" type="button">
      <span class="option-icon">${icon}</span>
      <span class="option-text">
        <span class="option-label">${label}</span>
        ${desc ? `<span class="option-desc">${desc}</span>` : ''}
      </span>
      <span class="check-mark"></span>
    </button>`;
}
function optCard2(field, value, icon, label) {
  const sel = state[field] === value;
  return `
    <button class="option-card${sel ? ' selected' : ''}" data-field="${field}" data-value="${value}" type="button">
      <span class="option-icon">${icon}</span>
      <span class="option-text"><span class="option-label">${label}</span></span>
      <span class="check-mark"></span>
    </button>`;
}

// ===== INDIVIDUAL STEP BUILDERS =====
function buildStep1() {
  return `
    <h2 class="step-title">What type of home equity product are you looking for?</h2>
    <p class="step-subtitle">Select one to get started — we'll find your best options</p>
    <div class="options-grid">
      ${optCard('loanProduct','heloc','🏦','HELOC','Variable rate, flexible line of credit — draw as needed')}
      ${optCard('loanProduct','home_equity_loan','💰','Home Equity Loan','Fixed rate, lump-sum payout — predictable payments')}
      ${optCard('loanProduct','cash_out_refi','🔄','Cash-Out Refinance','Replace your mortgage and take cash out')}
    </div>`;
}

function buildStep2() {
  return `
    <h2 class="step-title">What type of property do you have?</h2>
    <p class="step-subtitle">Select the option that best describes your home</p>
    <div class="options-grid two-col">
      ${optCard2('propertyType','single_family','🏠','Single Family Home')}
      ${optCard2('propertyType','townhouse','🏘️','Townhouse')}
      ${optCard2('propertyType','condo','🏢','Condominium')}
      ${optCard2('propertyType','multi_family','🏗️','Multi-Family (2–4 units)')}
      ${optCard2('propertyType','manufactured','🚐','Manufactured Home')}
    </div>`;
}

function buildStep3() {
  return `
    <h2 class="step-title">How do you use this property?</h2>
    <p class="step-subtitle">This helps us match you with the right lenders</p>
    <div class="options-grid">
      ${optCard('propertyUse','primary','🏡','Primary Residence','This is where I live full-time')}
      ${optCard('propertyUse','secondary','🌴','Secondary / Vacation Home','I use it part of the year')}
      ${optCard('propertyUse','investment','💼','Investment / Rental Property','I rent this property out')}
    </div>`;
}

function buildStep4() {
  const val = state.homeValue || 1000000;
  return `
    <h2 class="step-title">What is your home's estimated value?</h2>
    <p class="step-subtitle">Enter your best estimate — you can adjust it later</p>
    <div class="dollar-input-wrap">
      <span class="dollar-prefix">$</span>
      <input class="dollar-input" id="home-value-input" type="text"
             value="${fmt(val)}" placeholder="0" inputmode="numeric" autocomplete="off" />
    </div>
    <input class="range-slider" id="home-value-slider" type="range"
           min="50000" max="3000000" step="5000" value="${val}" />
    <div class="range-labels"><span>$50K</span><span>$3M+</span></div>
    <div class="next-btn-wrap">
      <button class="btn-primary" id="next-btn" type="button">Continue <span style="margin-left:2px">→</span></button>
    </div>`;
}

function buildStep5() {
  const balance = state.noMortgage ? 0 : (state.mortgageBalance || 0);
  const equity  = calcEquity();
  return `
    <h2 class="step-title">What is your current mortgage balance?</h2>
    <p class="step-subtitle">Include all mortgages on this property</p>
    <div class="dollar-input-wrap">
      <span class="dollar-prefix">$</span>
      <input class="dollar-input${state.noMortgage ? ' disabled-input' : ''}" id="mortgage-input" type="text"
             value="${balance ? fmt(balance) : ''}"
             placeholder="0" inputmode="numeric" autocomplete="off"
             ${state.noMortgage ? 'disabled' : ''} />
    </div>
    <button class="no-mortgage-btn${state.noMortgage ? ' active' : ''}" id="no-mortgage-btn" type="button">
      <span class="toggle-icon">${state.noMortgage ? '✅' : '⬜'}</span>
      I own my home free and clear (no mortgage)
    </button>
    <div class="equity-helper" id="equity-display">
      🏡 Estimated equity: <strong>$${fmt(equity)}</strong>
    </div>
    <div class="next-btn-wrap">
      <button class="btn-primary" id="next-btn" type="button">Continue →</button>
    </div>`;
}

function buildStep6() {
  const equity  = calcEquity();
  const maxLoan = calcMaxLoan();
  const desired = state.desiredAmount || '';
  return `
    <h2 class="step-title">How much would you like to borrow?</h2>
    <p class="step-subtitle">Most lenders allow up to 85% of your available equity</p>
    <div class="equity-helper">
      💡 Available equity: <strong>$${fmt(equity)}</strong> &nbsp;·&nbsp; Max recommended: <strong>$${fmt(maxLoan)}</strong>
    </div>
    <div class="dollar-input-wrap">
      <span class="dollar-prefix">$</span>
      <input class="dollar-input" id="desired-amount-input" type="text"
             value="${desired ? fmt(desired) : ''}" placeholder="0"
             inputmode="numeric" autocomplete="off" />
    </div>
    <div class="equity-warning" id="equity-warning">
      ⚠️ This exceeds your estimated available equity. Some lenders may still qualify you based on a higher appraisal.
    </div>
    <div class="next-btn-wrap">
      <button class="btn-primary" id="next-btn" type="button">Continue →</button>
    </div>`;
}

function buildStep7() {
  return `
    <h2 class="step-title">What will you use the funds for?</h2>
    <p class="step-subtitle">Select your primary purpose for the loan</p>
    <div class="options-grid two-col">
      ${optCard2('loanPurpose','home_improvement','🔨','Home Improvement')}
      ${optCard2('loanPurpose','debt_consolidation','💳','Debt Consolidation')}
      ${optCard2('loanPurpose','education','🎓','Education Expenses')}
      ${optCard2('loanPurpose','large_purchase','🚗','Large Purchase')}
      ${optCard2('loanPurpose','medical','🏥','Medical Expenses')}
      ${optCard2('loanPurpose','business','💼','Business Expenses')}
      ${optCard2('loanPurpose','emergency','🆘','Emergency Fund')}
      ${optCard2('loanPurpose','other','📋','Other')}
    </div>`;
}

function buildStep8() {
  const scores = [
    { value: 'excellent', dot: '#22c55e', label: 'Excellent', range: '760 or above' },
    { value: 'very_good', dot: '#86efac', label: 'Very Good', range: '720 – 759' },
    { value: 'good',      dot: '#fbbf24', label: 'Good',      range: '680 – 719' },
    { value: 'fair',      dot: '#f97316', label: 'Fair',      range: '640 – 679' },
    { value: 'poor',      dot: '#ef4444', label: 'Poor',      range: 'Below 640' }
  ];
  return `
    <h2 class="step-title">What is your estimated credit score?</h2>
    <p class="step-subtitle">This does <strong>not</strong> affect your credit — it helps match you with lenders</p>
    <div class="options-grid">
      ${scores.map(s => `
        <button class="option-card${state.creditScore === s.value ? ' selected' : ''}"
                data-field="creditScore" data-value="${s.value}" type="button">
          <span class="score-dot" style="background:${s.dot}"></span>
          <span class="option-text">
            <span class="option-label">${s.label}</span>
            <span class="option-desc">${s.range}</span>
          </span>
          <span class="check-mark"></span>
        </button>`).join('')}
    </div>`;
}

function buildStep9() {
  const city = lookupZip(state.zipCode);
  return `
    <h2 class="step-title">What is the property ZIP code?</h2>
    <p class="step-subtitle">We'll find lenders available in your area</p>
    <div style="text-align:center;margin-bottom:20px;">
      <input class="text-input zip-input" id="zip-input" type="text"
             value="${state.zipCode}" maxlength="5" inputmode="numeric"
             placeholder="00000" autocomplete="postal-code" />
      <div class="zip-city" id="zip-city">${city ? '📍 ' + city : ''}</div>
      <div class="error-msg" id="zip-error" style="text-align:center;">Please enter a valid 5-digit ZIP code</div>
    </div>
    <div class="next-btn-wrap">
      <button class="btn-primary" id="next-btn" type="button">Continue →</button>
    </div>`;
}

function buildStep10() {
  return `
    <h2 class="step-title">What is your name?</h2>
    <p class="step-subtitle">We'll use this to personalize your results</p>
    <label class="input-label">First Name</label>
    <input class="text-input" id="first-name" type="text" value="${state.firstName}"
           placeholder="First name" autocomplete="given-name" />
    <div class="error-msg" id="fname-error">Please enter your first name</div>
    <label class="input-label">Last Name</label>
    <input class="text-input" id="last-name" type="text" value="${state.lastName}"
           placeholder="Last name" autocomplete="family-name" />
    <div class="error-msg" id="lname-error">Please enter your last name</div>
    <div class="next-btn-wrap">
      <button class="btn-primary" id="next-btn" type="button">Continue →</button>
    </div>`;
}

function buildStep11() {
  return `
    <h2 class="step-title">How can lenders reach you?</h2>
    <p class="step-subtitle">You'll receive personalized rate quotes by email and phone</p>
    <label class="input-label">Email Address</label>
    <input class="text-input" id="email-input" type="email" value="${state.email}"
           placeholder="you@email.com" autocomplete="email" />
    <div class="error-msg" id="email-error">Please enter a valid email address</div>
    <label class="input-label">Phone Number</label>
    <div class="phone-wrap">
      <span class="phone-flag">🇺🇸</span>
      <input class="text-input phone-input" id="phone-input" type="tel" value="${state.phone}"
             placeholder="(555) 555-5555" autocomplete="tel" />
    </div>
    <div class="error-msg" id="phone-error">Please enter a valid 10-digit phone number</div>
    <div class="next-btn-wrap">
      <button class="btn-primary" id="next-btn" type="button">Continue →</button>
    </div>
    <p class="cta-sub-text">
      By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      You consent to receive calls and texts from lenders and their agents.
    </p>`;
}

function buildStep12() {
  const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
  return `
    <h2 class="step-title">What is the property address?</h2>
    <p class="step-subtitle">This helps lenders verify your home's value</p>
    <label class="input-label">Street Address</label>
    <input class="text-input" id="street-input" type="text" value="${state.streetAddress}"
           placeholder="123 Main Street" autocomplete="street-address" />
    <div class="error-msg" id="street-error">Please enter the street address</div>
    <div class="input-row">
      <div>
        <label class="input-label">City</label>
        <input class="text-input" id="city-input" type="text" value="${state.city}"
               placeholder="City" autocomplete="address-level2" />
        <div class="error-msg" id="city-error">Required</div>
      </div>
      <div>
        <label class="input-label">State</label>
        <select class="text-input" id="state-select" autocomplete="address-level1">
          <option value="">State</option>
          ${STATES.map(s => `<option value="${s}"${state.usState === s ? ' selected' : ''}>${s}</option>`).join('')}
        </select>
        <div class="error-msg" id="state-error">Required</div>
      </div>
    </div>
    <label class="input-label">ZIP Code</label>
    <input class="text-input" id="addr-zip" type="text" value="${state.zipCode}"
           maxlength="5" placeholder="ZIP code" inputmode="numeric" style="max-width:160px" />
    <div class="next-btn-wrap">
      <button class="btn-primary" id="next-btn" type="button">Continue →</button>
    </div>`;
}

function buildStep13() {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const days   = Array.from({length: 31}, (_, i) => i + 1);
  const curY   = new Date().getFullYear();
  const years  = Array.from({length: 80}, (_, i) => curY - 18 - i);
  return `
    <h2 class="step-title">What is your date of birth?</h2>
    <p class="step-subtitle">Required to verify your identity — you must be 18 or older</p>
    <div class="dob-row">
      <div>
        <label class="input-label">Month</label>
        <select class="text-input" id="dob-month">
          <option value="">Month</option>
          ${months.map((m,i) => `<option value="${i+1}"${state.dobMonth == i+1 ? ' selected' : ''}>${m}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="input-label">Day</label>
        <select class="text-input" id="dob-day">
          <option value="">Day</option>
          ${days.map(d => `<option value="${d}"${state.dobDay == d ? ' selected' : ''}>${d}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="input-label">Year</label>
        <select class="text-input" id="dob-year">
          <option value="">Year</option>
          ${years.map(y => `<option value="${y}"${state.dobYear == y ? ' selected' : ''}>${y}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="error-msg" id="dob-error">Please enter a valid date of birth (must be 18+)</div>
    <div class="next-btn-wrap">
      <button class="btn-primary" id="next-btn" type="button">See My Matches →</button>
    </div>`;
}

function buildStep14() {
  const productLabel = { heloc: 'HELOC', home_equity_loan: 'Home Equity Loan', cash_out_refi: 'Cash-Out Refinance' };
  const creditLabel  = { excellent: 'Excellent (760+)', very_good: 'Very Good (720–759)', good: 'Good (680–719)', fair: 'Fair (640–679)', poor: 'Poor (Below 640)' };
  const lenders = [
    {
      initials: 'RM',
      color: '#CC0000',
      badge: '#a80000',
      name: 'Rocket Mortgage',
      tag: '🏆 #1 Mortgage Lender',
      rate: '7.49',
      type: state.loanProduct === 'heloc' ? 'HELOC' : 'Home Equity Loan',
      details: 'Fast digital close · Up to $500K · Min. 680 FICO · No prepay penalty'
    },
    {
      initials: 'FG',
      color: '#0A2240',
      badge: '#1a3d6e',
      name: 'Figure Lending',
      tag: '⚡ Funds in as little as 5 days',
      rate: '6.55',
      type: 'HELOC',
      details: '100% digital process · Fixed rate HELOC · No traditional appraisal needed'
    },
    {
      initials: 'PM',
      color: '#003B71',
      badge: '#004f99',
      name: 'PennyMac',
      tag: '💰 Competitive low rates',
      rate: '7.00',
      type: state.loanProduct === 'heloc' ? 'HELOC' : 'Home Equity Loan',
      details: 'Borrow up to $750K · 10-yr draw period · No annual fee'
    },
    {
      initials: 'NR',
      color: '#006B77',
      badge: '#008a99',
      name: 'NewRez',
      tag: '✅ Flexible qualifying options',
      rate: '7.25',
      type: state.loanProduct === 'heloc' ? 'HELOC' : 'Home Equity Loan',
      details: 'Multiple term options · Bank statement programs available · Fast approval'
    }
  ];
  const loc = lookupZip(state.zipCode) || state.zipCode;
  return `
    <div class="results-loading" id="results-loading">
      <div class="spinner"></div>
      <h3>Finding your best matches…</h3>
      <p>Comparing options from 100+ lenders in ${loc}</p>
    </div>
    <div class="results-content" id="results-content">
      <div class="results-header">
        <span class="emoji">🎉</span>
        <h2>Great news, ${state.firstName || 'Homeowner'}!</h2>
        <p>We found <strong>${lenders.length} lenders</strong> matching your profile in ${loc}</p>
      </div>
      ${lenders.map((l, i) => `
        <div class="lender-card${i === 0 ? ' lender-card-featured' : ''}">
          ${i === 0 ? '<div class="lender-featured-badge">Best Match</div>' : ''}
          <div class="lender-logo" style="background:linear-gradient(135deg,${l.color},${l.badge})">${l.initials}</div>
          <div class="lender-info">
            <div class="lender-name">${l.name}</div>
            <div class="lender-tag">${l.tag}</div>
            <div>
              <span class="lender-rate">${l.rate}%</span>
              <span class="lender-rate-label">APR · ${l.type}</span>
            </div>
            <div class="lender-details">${l.details}</div>
          </div>
          <button class="lender-btn">View Offer</button>
        </div>`).join('')}
      <div class="summary-box">
        <h4>Your Profile Summary</h4>
        <div class="summary-row"><span>Loan Type</span><span>${productLabel[state.loanProduct] || '—'}</span></div>
        <div class="summary-row"><span>Home Value</span><span>$${fmt(state.homeValue)}</span></div>
        <div class="summary-row"><span>Mortgage Balance</span><span>${state.noMortgage ? 'Free & Clear' : '$' + fmt(state.mortgageBalance)}</span></div>
        <div class="summary-row"><span>Borrow Amount</span><span>$${fmt(state.desiredAmount)}</span></div>
        <div class="summary-row"><span>Credit Score</span><span>${creditLabel[state.creditScore] || '—'}</span></div>
        <div class="summary-row"><span>Location</span><span>${loc}</span></div>
      </div>
    </div>`;
}

// ===== ATTACH LISTENERS =====
function attachStepListeners(n) {
  // Option cards — auto-advance for steps 1,2,3,7,8
  document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const field = card.dataset.field;
      const value = card.dataset.value;
      state[field] = value;
      document.querySelectorAll(`.option-card[data-field="${field}"]`).forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      if ([1, 2, 3, 7, 8].includes(n)) {
        setTimeout(() => nextStep(), 240);
      }
    });
  });

  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) nextBtn.addEventListener('click', nextStep);

  if (n === 4)  attachStep4();
  if (n === 5)  attachStep5();
  if (n === 6)  attachStep6();
  if (n === 9)  attachStep9();
  if (n === 10) attachStep10();
  if (n === 11) attachStep11();
  if (n === 12) attachStep12();
  if (n === 13) attachStep13();
  if (n === 14) startResults();
}

function attachStep4() {
  const input  = document.getElementById('home-value-input');
  const slider = document.getElementById('home-value-slider');
  input.addEventListener('input', () => {
    const raw = parseDollar(input.value);
    state.homeValue = raw;
    slider.value = raw;
    const pos = input.selectionStart;
    input.value = fmt(raw);
    try { input.setSelectionRange(pos, pos); } catch(e) {}
  });
  input.addEventListener('blur', () => { input.value = fmt(state.homeValue || 0); });
  slider.addEventListener('input', () => {
    state.homeValue = parseInt(slider.value, 10);
    input.value = fmt(state.homeValue);
  });
}

function attachStep5() {
  const input   = document.getElementById('mortgage-input');
  const noBtn   = document.getElementById('no-mortgage-btn');
  const display = document.getElementById('equity-display');

  function updateEquity() {
    display.innerHTML = `🏡 Estimated equity: <strong>$${fmt(calcEquity())}</strong>`;
  }

  input.addEventListener('input', () => {
    state.mortgageBalance = parseDollar(input.value);
    input.value = fmt(state.mortgageBalance);
    updateEquity();
  });
  input.addEventListener('blur', () => { input.value = fmt(state.mortgageBalance || 0); });

  noBtn.addEventListener('click', () => {
    state.noMortgage = !state.noMortgage;
    if (state.noMortgage) {
      state.mortgageBalance = 0;
      input.value = '0';
      input.disabled = true;
      input.classList.add('disabled-input');
      noBtn.classList.add('active');
      noBtn.querySelector('.toggle-icon').textContent = '✅';
    } else {
      input.value = '';
      input.disabled = false;
      input.classList.remove('disabled-input');
      noBtn.classList.remove('active');
      noBtn.querySelector('.toggle-icon').textContent = '⬜';
    }
    updateEquity();
  });
}

function attachStep6() {
  const input   = document.getElementById('desired-amount-input');
  const warning = document.getElementById('equity-warning');
  input.addEventListener('input', () => {
    const val = parseDollar(input.value);
    state.desiredAmount = val;
    input.value = fmt(val);
    warning.classList.toggle('show', val > 0 && val > calcEquity());
  });
  input.addEventListener('blur', () => { if (state.desiredAmount) input.value = fmt(state.desiredAmount); });
}

function attachStep9() {
  const input  = document.getElementById('zip-input');
  const cityEl = document.getElementById('zip-city');
  input.addEventListener('input', () => {
    const zip = input.value.replace(/\D/g, '').substring(0, 5);
    input.value = zip;
    state.zipCode = zip;
    const city = lookupZip(zip);
    cityEl.textContent = city ? '📍 ' + city : '';
  });
}

function attachStep10() {
  document.getElementById('first-name').addEventListener('input', e => { state.firstName = e.target.value; });
  document.getElementById('last-name').addEventListener('input', e => { state.lastName = e.target.value; });
}

function attachStep11() {
  document.getElementById('email-input').addEventListener('input', e => { state.email = e.target.value; });
  const ph = document.getElementById('phone-input');
  ph.addEventListener('input', () => {
    const formatted = phoneFormat(ph.value);
    ph.value = formatted;
    state.phone = formatted;
  });
}

function attachStep12() {
  document.getElementById('street-input').addEventListener('input', e => { state.streetAddress = e.target.value; });
  document.getElementById('city-input').addEventListener('input', e => { state.city = e.target.value; });
  document.getElementById('state-select').addEventListener('change', e => { state.usState = e.target.value; });
  document.getElementById('addr-zip').addEventListener('input', e => {
    const z = e.target.value.replace(/\D/g,'').substring(0,5);
    e.target.value = z;
    state.zipCode = z;
  });
}

function attachStep13() {
  document.getElementById('dob-month').addEventListener('change', e => { state.dobMonth = e.target.value; });
  document.getElementById('dob-day').addEventListener('change', e => { state.dobDay = e.target.value; });
  document.getElementById('dob-year').addEventListener('change', e => { state.dobYear = e.target.value; });
}

function startResults() {
  setTimeout(() => {
    const loading = document.getElementById('results-loading');
    const content = document.getElementById('results-content');
    if (loading) { loading.style.opacity = '0'; loading.style.transition = 'opacity 0.3s'; }
    setTimeout(() => {
      if (loading) loading.style.display = 'none';
      if (content) { content.style.display = 'block'; content.style.animation = 'fadeSlideIn 0.35s ease'; }
    }, 300);
  }, 3000);
}

// ===== VALIDATION =====
function showErr(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show', show);
}

function validateStep(n) {
  switch (n) {
    case 1:  return !!state.loanProduct;
    case 2:  return !!state.propertyType;
    case 3:  return !!state.propertyUse;
    case 4:  return (state.homeValue || 0) >= 10000;
    case 5:  return true;
    case 6:  return (state.desiredAmount || 0) > 0;
    case 7:  return !!state.loanPurpose;
    case 8:  return !!state.creditScore;
    case 9: {
      const ok = state.zipCode.length === 5;
      showErr('zip-error', !ok);
      return ok;
    }
    case 10: {
      const fOk = state.firstName.trim().length > 0;
      const lOk = state.lastName.trim().length > 0;
      showErr('fname-error', !fOk);
      showErr('lname-error', !lOk);
      return fOk && lOk;
    }
    case 11: {
      const eOk = isValidEmail(state.email);
      const pOk = state.phone.replace(/\D/g,'').length === 10;
      showErr('email-error', !eOk);
      showErr('phone-error', !pOk);
      return eOk && pOk;
    }
    case 12: {
      const sOk = state.streetAddress.trim().length > 0;
      const cOk = state.city.trim().length > 0;
      const stOk = state.usState.length > 0;
      showErr('street-error', !sOk);
      showErr('city-error', !cOk);
      showErr('state-error', !stOk);
      return sOk && cOk && stOk;
    }
    case 13: {
      const ok = !!(state.dobMonth && state.dobDay && state.dobYear);
      showErr('dob-error', !ok);
      return ok;
    }
    default: return true;
  }
}

// ===== NAVIGATION =====
function nextStep() {
  if (!validateStep(currentStep)) return;
  if (currentStep < TOTAL_STEPS) {
    currentStep++;
    render();
  }
}
function prevStep() {
  if (currentStep > 1) {
    goingBack = true;
    currentStep--;
    render();
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  render();
  document.getElementById('back-btn').addEventListener('click', prevStep);
});
