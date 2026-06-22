// Global Language State
let currentLang = 'bn';

// Dynamic Text Dictionary for translations
const translations = {
  c1Crack: { bn: '⚠️ চাপ অতিরিক্ত! কুশন ফেটে গেছে।', en: '⚠️ Pressure too high! Cushion cracked.' },
  c1Normal: { bn: 'চাপ স্বাভাবিক।', en: 'Pressure is normal.' },
  
  c5H: { bn: 'হাইড্রোজেন (Hydrogen)', en: 'Hydrogen' },
  c5He: { bn: 'হিলিয়াম (Helium)', en: 'Helium' },
  c5Li: { bn: 'লিথিয়াম (Lithium)', en: 'Lithium' },
  c5Be: { bn: 'বেরিলিয়াম (Beryllium)', en: 'Beryllium' },
  c5B: { bn: 'বোরন (Boron)', en: 'Boron' },
  c5C: { bn: 'কার্বন (Carbon)', en: 'Carbon' },
  c5Neutral: { bn: 'নিরপেক্ষ (0)', en: 'Neutral (0)' },
  c5Positive: { bn: 'ধনাত্মক (+', en: 'Positive (+' },
  c5Negative: { bn: 'ঋণাত্মক (-', en: 'Negative (-' },
  
  c6HDesc: { bn: 'গ্রুপ ১, পর্যায় ১। সবচেয়ে হালকা গ্যাস। জ্বলনশীল।', en: 'Group 1, Period 1. Lightest gas. Highly flammable.' },
  c6HeDesc: { bn: 'গ্রুপ ১৮, পর্যায় ১। নিষ্ক্রিয় গ্যাস, হালকা এবং অ-দাহ্য।', en: 'Group 18, Period 1. Noble gas, light and non-flammable.' },
  c6LiDesc: { bn: 'গ্রুপ ১, পর্যায় ২। ক্ষার ধাতু, খুব নরম এবং সক্রিয়।', en: 'Group 1, Period 2. Alkali metal, soft and highly reactive.' },
  c6CDesc: { bn: 'গ্রুপ ১৪, পর্যায় ২। অধাতু, সমস্ত জৈব যৌগের ভিত্তি।', en: 'Group 14, Period 2. Non-metal, backbone of organic life.' },
  c6ODesc: { bn: 'গ্রুপ ১৬, পর্যায় ২। প্রাণদায়ী গ্যাস, শ্বাসক্রিয়ায় প্রয়োজনীয়।', en: 'Group 16, Period 2. Reactive non-metal, vital for respiration.' },
  c6NaDesc: { bn: 'গ্রুপ ১, পর্যায় ৩। অতি সক্রিয় ধাতু, জলের সাথে বিক্রিয়া করে।', en: 'Group 1, Period 3. Highly reactive metal, reacts violently with water.' },
  c6ClDesc: { bn: 'গ্রুপ ১৭, পর্যায় ৩। হ্যালোজেন গ্যাস, তীব্র গন্ধযুক্ত বিষাক্ত।', en: 'Group 17, Period 3. Halogen gas, pungent and toxic.' },
  c6FeDesc: { bn: 'গ্রুপ ৮, পর্যায় ৪। অবস্থান্তর ধাতু, হিমোগ্লোবিনের অংশ।', en: 'Group 8, Period 4. Transition metal, vital part of hemoglobin.' },
  
  c8Tall: { bn: 'লম্বা (Tall)', en: 'Tall' },
  c8Short: { bn: 'খাটো (Short)', en: 'Short' },
  c8PhenoRatio: { bn: 'ফেনোটাইপ অনুপাত: ', en: 'Phenotypic Ratio: ' },
  
  c9Complete: { bn: '🎉 অভিনন্দন! আপনি সঠিকভাবে সবগুলো জৈব অণু বিন্যাস করেছেন!', en: '🎉 Success! You categorized all biomolecules correctly!' },
  
  c12Active: { bn: 'শক্তি প্রবাহ সম্পূর্ণ!', en: 'Energy Flow Complete!' },
  c12Inactive: { bn: 'অসম্পূর্ণ চেইন', en: 'Chain Incomplete' },
  
  c13Stable: { bn: 'কক্ষপথ স্থিতিশীল (Stable Orbit)', en: 'Stable Orbit' },
  c13Crashed: { bn: '💥 সূর্য লেগে ক্রাশ করেছে! (Crashed)', en: '💥 Collided with the Sun!' },
  c13Escaped: { bn: '🛸 কক্ষপথচ্যুত মহাকাশে বিলীন! (Escaped)', en: '🛸 Escaped orbit into deep space' }
};

function setLanguage(lang) {
  currentLang = lang;
  if (lang === 'bn') {
    document.documentElement.classList.remove('lang-en');
    document.documentElement.classList.add('lang-bn');
    document.documentElement.lang = 'bn';
  } else {
    document.documentElement.classList.remove('lang-bn');
    document.documentElement.classList.add('lang-en');
    document.documentElement.lang = 'en';
  }
  
  // Refresh simulations language elements
  refreshSimStrings();
}

document.getElementById('langToggle').addEventListener('click', () => {
  const nextLang = currentLang === 'bn' ? 'en' : 'bn';
  setLanguage(nextLang);
});

// ---------- TIMELINE RAIL NAVIGATION ----------
const railItems = document.querySelectorAll('.rail-item');
railItems.forEach(item => {
  item.addEventListener('click', () => {
    document.getElementById(item.dataset.target).scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const sections = document.querySelectorAll('.theory');
const railMap = {};
railItems.forEach(r => railMap[r.dataset.target] = r);

const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      railItems.forEach(r => r.classList.remove('active'));
      if (railMap[e.target.id]) {
        railMap[e.target.id].classList.add('active');
        railMap[e.target.id].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => obs.observe(s));


// ==========================================================================
// 1. CHAPTER 1: FORCE & AREA SIMULATION
// ==========================================================================
(function() {
  const forceSlider = document.getElementById('c1Force');
  const areaSlider = document.getElementById('c1Area');
  const piston = document.getElementById('c1Piston');
  const cushion = document.getElementById('c1Cushion');
  const valText = document.getElementById('c1Val');
  const bar = document.getElementById('c1Bar');

  function update() {
    const F = parseFloat(forceSlider.value);
    const A = parseFloat(areaSlider.value);
    
    // Pressure P = F / A
    const P = F / A;
    valText.textContent = P.toFixed(2) + ' Pa';
    
    // Deform visual components based on pressure
    const deformPercent = Math.min(60, P * 2);
    cushion.style.height = (60 - deformPercent) + 'px';
    cushion.style.width = (120 + A * 2) + 'px';
    
    piston.style.top = (10 + deformPercent * 0.9) + 'px';
    piston.style.width = (120 + A * 2) + 'px';
    piston.innerHTML = `F = ${F} N`;

    // Fill bar
    const barPercent = Math.min(100, (P / 25) * 100);
    bar.style.width = barPercent + '%';

    // Crack detection
    if (P >= 15) {
      cushion.classList.add('cracked');
      bar.style.background = 'var(--chalk-coral)';
    } else {
      cushion.classList.remove('cracked');
      bar.style.background = 'var(--cyan)';
    }
  }

  forceSlider.addEventListener('input', update);
  areaSlider.addEventListener('input', update);
  update();
})();


// ==========================================================================
// 2. CHAPTER 2: MOLECULAR HEAT SIMULATION
// ==========================================================================
(function() {
  const chamber = document.getElementById('c2Chamber');
  const tempSlider = document.getElementById('c2Temp');
  const cEl = document.getElementById('c2C');
  const fEl = document.getElementById('c2F');
  const kEl = document.getElementById('c2K');

  const moleculeCount = 14;
  let molecules = [];
  const chamberWidth = 380; // approximate phone inner width
  const chamberHeight = 150;

  // Setup molecules
  for (let i = 0; i < moleculeCount; i++) {
    const el = document.createElement('div');
    el.className = 'c5-particle-dot n'; // reuse small grey dots
    el.style.position = 'absolute';
    el.style.background = 'var(--cyan)';
    el.style.boxShadow = '0 0 6px var(--cyan)';
    chamber.appendChild(el);

    molecules.push({
      element: el,
      x: Math.random() * (chamberWidth - 25) + 10,
      y: Math.random() * (chamberHeight - 20) + 10,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4
    });
  }

  function animate() {
    const tempCelsius = parseFloat(tempSlider.value);
    
    // Scale speed to absolute temperature (Kelvin)
    const tempKelvin = tempCelsius + 273.15;
    const speedFactor = Math.sqrt(tempKelvin / 298.15); // normalized around room temp

    cEl.textContent = tempCelsius + '°C';
    fEl.textContent = Math.round(tempCelsius * 1.8 + 32) + '°F';
    kEl.textContent = Math.round(tempKelvin) + 'K';

    molecules.forEach(m => {
      m.x += m.vx * speedFactor;
      m.y += m.vy * speedFactor;

      // Wall boundaries bounce checking
      const w = chamber.clientWidth || chamberWidth;
      const h = chamber.clientHeight || chamberHeight;

      if (m.x <= 4 || m.x >= w - 12) {
        m.vx *= -1;
        m.x = m.x <= 4 ? 5 : w - 13;
      }
      if (m.y <= 4 || m.y >= h - 12) {
        m.vy *= -1;
        m.y = m.y <= 4 ? 5 : h - 13;
      }

      m.element.style.left = m.x + 'px';
      m.element.style.top = m.y + 'px';
    });

    requestAnimationFrame(animate);
  }

  tempSlider.addEventListener('input', () => {});
  animate();
})();


// ==========================================================================
// 3. CHAPTER 3: PHOTOELECTRIC EFFECT
// ==========================================================================
(function() {
  const chamber = document.getElementById('c3Chamber');
  const colorSlider = document.getElementById('c3Color');
  const intensSlider = document.getElementById('c3Intens');
  const waveVal = document.getElementById('c3Wave');
  const keVal = document.getElementById('c3KE');
  const ray = document.getElementById('c3Ray');

  let electrons = [];

  function nmToRGB(wavelength) {
    let r, g, b;
    if (wavelength >= 380 && wavelength < 440) {
      r = -(wavelength - 440) / (440 - 380); g = 0.0; b = 1.0;
    } else if (wavelength >= 440 && wavelength < 490) {
      r = 0.0; g = (wavelength - 440) / (490 - 440); b = 1.0;
    } else if (wavelength >= 490 && wavelength < 510) {
      r = 0.0; g = 1.0; b = -(wavelength - 510) / (510 - 490);
    } else if (wavelength >= 510 && wavelength < 580) {
      r = (wavelength - 510) / (580 - 510); g = 1.0; b = 0.0;
    } else if (wavelength >= 580 && wavelength < 645) {
      r = 1.0; g = -(wavelength - 645) / (645 - 580); b = 0.0;
    } else if (wavelength >= 645 && wavelength <= 780) {
      r = 1.0; g = 0.0; b = 0.0;
    } else {
      r = 0.0; g = 0.0; b = 0.0;
    }
    // Intensity scaling
    let factor = 1.0;
    if (wavelength > 700) factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
    else if (wavelength < 420) factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);

    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${factor})`;
  }

  function getWavelengthColorName(w) {
    if (w < 450) return 'Violet';
    if (w < 485) return 'Blue';
    if (w < 500) return 'Cyan';
    if (w < 565) return 'Green';
    if (w < 590) return 'Yellow';
    if (w < 625) return 'Orange';
    return 'Red';
  }

  function update() {
    const w = parseInt(colorSlider.value);
    const intens = parseInt(intensSlider.value);
    
    // Energy E = 1240 / wavelength
    const E = 1240 / w;
    const workFunction = 2.25; // Threshold corresponding to Green (551nm)
    
    waveVal.textContent = `${w} nm (${getWavelengthColorName(w)})`;

    // Calculate Max Kinetic Energy
    const KE = Math.max(0, E - workFunction);
    keVal.textContent = KE.toFixed(2) + ' eV';

    // Show glowing ray
    ray.style.opacity = intens / 100;
    ray.style.background = `linear-gradient(180deg, ${nmToRGB(w)} 0%, transparent 85%)`;

    // Process particles
    if (KE > 0 && Math.random() < (intens / 200)) {
      spawnElectron(KE);
    }
  }

  function spawnElectron(ke) {
    const el = document.createElement('div');
    el.className = 'c3-electron';
    
    const chamberW = chamber.clientWidth || 380;
    const spawnX = 25 + Math.random() * (chamberW - 50);
    el.style.left = spawnX + 'px';
    el.style.bottom = '16px';
    chamber.appendChild(el);

    const speed = 1 + ke * 2.5;
    let pos = 16;
    
    const timer = setInterval(() => {
      pos += speed;
      el.style.bottom = pos + 'px';
      
      // Escape or fade
      if (pos >= 150) {
        clearInterval(timer);
        el.remove();
      }
    }, 30);
  }

  colorSlider.addEventListener('input', update);
  intensSlider.addEventListener('input', update);
  setInterval(update, 100);
})();


// ==========================================================================
// 4. CHAPTER 4: STATES OF MATTER
// ==========================================================================
(function() {
  const chamber = document.getElementById('c4Chamber');
  const sBtn = document.getElementById('c4SolidBtn');
  const lBtn = document.getElementById('c4LiquidBtn');
  const gBtn = document.getElementById('c4GasBtn');

  const count = 16;
  let particles = [];
  let currentState = 'solid'; // 'solid', 'liquid', 'gas'
  
  const width = 380;
  const height = 150;

  // Instantiate particles
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'c4-particle';
    chamber.appendChild(el);
    particles.push({
      element: el,
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5
    });
  }

  function updateSimulation() {
    const w = chamber.clientWidth || width;
    const h = chamber.clientHeight || height;

    particles.forEach((p, idx) => {
      if (currentState === 'solid') {
        // Form ordered 4x4 Grid lattice
        const row = Math.floor(idx / 4);
        const col = idx % 4;
        const targetX = (w / 2 - 45) + col * 25;
        const targetY = (h - 90) + row * 22;

        // Add slight thermal vibration
        const vibX = (Math.random() - 0.5) * 1.5;
        const vibY = (Math.random() - 0.5) * 1.5;

        p.x += (targetX - p.x) * 0.1;
        p.y += (targetY - p.y) * 0.1;
        
        p.element.style.left = (p.x + vibX) + 'px';
        p.element.style.top = (p.y + vibY) + 'px';

      } else if (currentState === 'liquid') {
        // Collect at the bottom and slide around loosely
        p.vy += 0.2; // slight gravity pull
        p.x += p.vx * 0.45;
        p.y += p.vy * 0.45;

        // Friction dampening
        p.vx *= 0.98;

        if (p.x <= 4 || p.x >= w - 16) {
          p.vx *= -1;
          p.x = p.x <= 4 ? 5 : w - 17;
        }
        if (p.y >= h - 16) {
          p.vy *= -0.4; // lose energy on bounce
          p.y = h - 17;
          p.vx += (Math.random() - 0.5) * 1.2; // lateral sliding
        }
        if (p.y <= 60) {
          p.vy = 0.5;
        }

        p.element.style.left = p.x + 'px';
        p.element.style.top = p.y + 'px';

      } else if (currentState === 'gas') {
        // Rapid collisions flying everywhere
        p.x += p.vx * 1.5;
        p.y += p.vy * 1.5;

        if (p.x <= 4 || p.x >= w - 16) {
          p.vx *= -1;
          p.x = p.x <= 4 ? 5 : w - 17;
        }
        if (p.y <= 4 || p.y >= h - 16) {
          p.vy *= -1;
          p.y = p.y <= 4 ? 5 : h - 17;
        }

        p.element.style.left = p.x + 'px';
        p.element.style.top = p.y + 'px';
      }
    });

    requestAnimationFrame(updateSimulation);
  }

  function selectState(state, activeBtn) {
    currentState = state;
    [sBtn, lBtn, gBtn].forEach(b => b.classList.remove('p-btn-accent'));
    activeBtn.classList.add('p-btn-accent');

    if (state === 'gas') {
      particles.forEach(p => {
        p.vx = (Math.random() - 0.5) * 6;
        p.vy = (Math.random() - 0.5) * 6;
      });
    }
  }

  sBtn.addEventListener('click', () => selectState('solid', sBtn));
  lBtn.addEventListener('click', () => selectState('liquid', lBtn));
  gBtn.addEventListener('click', () => selectState('gas', gBtn));

  // Initialize placements
  const w = chamber.clientWidth || width;
  particles.forEach(p => {
    p.x = Math.random() * (w - 40) + 10;
    p.y = Math.random() * 100 + 10;
  });

  updateSimulation();
})();


// ==========================================================================
// 5. CHAPTER 5: ATOM BUILDER
// ==========================================================================
(function() {
  const protonsSlider = document.getElementById('c5Protons');
  const electronsSlider = document.getElementById('c5Electrons');
  const nucleus = document.getElementById('c5Nucleus');
  const elName = document.getElementById('c5ElementName');
  const chargeEl = document.getElementById('c5Charge');
  const chamber = document.getElementById('c5Chamber');

  let electronNodes = [];
  let angle = 0;

  function update() {
    const P = parseInt(protonsSlider.value);
    const E = parseInt(electronsSlider.value);

    // 1. Nucleus particles mapping
    nucleus.innerHTML = '';
    // Add Protons
    for (let i = 0; i < P; i++) {
      const pDot = document.createElement('div');
      pDot.className = 'c5-particle-dot p';
      nucleus.appendChild(pDot);
    }
    // Add Neutrons (P + 0 or P + 1 for stability weight)
    const N = P === 1 ? 0 : P;
    for (let i = 0; i < N; i++) {
      const nDot = document.createElement('div');
      nDot.className = 'c5-particle-dot n';
      nucleus.appendChild(nDot);
    }

    // 2. Element names dictionary
    const names = {
      1: { bn: 'হাইড্রোজেন (Hydrogen)', en: 'Hydrogen' },
      2: { bn: 'হিলিয়াম (Helium)', en: 'Helium' },
      3: { bn: 'লিথিয়াম (Lithium)', en: 'Lithium' },
      4: { bn: 'বেরিলিয়াম (Beryllium)', en: 'Beryllium' },
      5: { bn: 'বোরন (Boron)', en: 'Boron' },
      6: { bn: 'কার্বন (Carbon)', en: 'Carbon' }
    };
    elName.textContent = names[P][currentLang];

    // 3. Net charge details
    const diff = P - E;
    if (diff === 0) {
      chargeEl.textContent = translations.c5Neutral[currentLang];
      chargeEl.style.color = '#fff';
    } else if (diff > 0) {
      chargeEl.textContent = `${translations.c5Positive[currentLang]}${diff})`;
      chargeEl.style.color = 'var(--chalk-coral)';
    } else {
      chargeEl.textContent = `${translations.c5Negative[currentLang]}${Math.abs(diff)})`;
      chargeEl.style.color = 'var(--cyan)';
    }

    // 4. Electron node spawning
    electronNodes.forEach(node => node.remove());
    electronNodes = [];

    for (let i = 0; i < E; i++) {
      const elNode = document.createElement('div');
      elNode.className = 'c5-particle-dot e';
      chamber.appendChild(elNode);
      electronNodes.push(elNode);
    }
  }

  function rotateElectrons() {
    angle += 0.035;
    const E = parseInt(electronsSlider.value);
    
    // Distribute electrons into Orbit 1 (max 2) and Orbit 2 (remaining)
    for (let i = 0; i < E; i++) {
      if (i < 2) {
        // Orbit 1: Radius 45px
        const subAngle = angle + (i * Math.PI);
        const x = Math.cos(subAngle) * 45;
        const y = Math.sin(subAngle) * 45;
        if(electronNodes[i]) {
          electronNodes[i].style.transform = `translate(${x}px, ${y}px)`;
        }
      } else {
        // Orbit 2: Radius 70px
        const subAngle = angle * 0.7 + ((i - 2) * (2 * Math.PI / (E - 2)));
        const x = Math.cos(subAngle) * 70;
        const y = Math.sin(subAngle) * 70;
        if(electronNodes[i]) {
          electronNodes[i].style.transform = `translate(${x}px, ${y}px)`;
        }
      }
    }
    requestAnimationFrame(rotateElectrons);
  }

  protonsSlider.addEventListener('input', update);
  electronsSlider.addEventListener('input', update);

  update();
  rotateElectrons();
})();


// ==========================================================================
// 6. CHAPTER 6: PERIODIC TABLE EXPLORER
// ==========================================================================
(function() {
  const container = document.getElementById('c6-device');
  const elements = container.querySelectorAll('.c6-element');
  const popup = document.getElementById('c6Popup');

  elements.forEach(el => {
    el.addEventListener('click', () => {
      const name = el.dataset.el;
      
      const titleStr = {
        H: { bn: 'H · হাইড্রোজেন (Atomic #1)', en: 'H · Hydrogen (Atomic #1)' },
        He: { bn: 'He · হিলিয়াম (Atomic #2)', en: 'He · Helium (Atomic #2)' },
        Li: { bn: 'Li · লিথিয়াম (Atomic #3)', en: 'Li · Lithium (Atomic #3)' },
        C: { bn: 'C · কার্বন (Atomic #6)', en: 'C · Carbon (Atomic #6)' },
        O: { bn: 'O · অক্সিজেন (Atomic #8)', en: 'O · Oxygen (Atomic #8)' },
        Na: { bn: 'Na · সোডিয়াম (Atomic #11)', en: 'Na · Sodium (Atomic #11)' },
        Cl: { bn: 'Cl · ক্লোরিন (Atomic #17)', en: 'Cl · Chlorine (Atomic #17)' },
        Fe: { bn: 'Fe · লোহা (Atomic #26)', en: 'Fe · Iron (Atomic #26)' }
      };

      const keyName = `c6${name}Desc`;
      const description = translations[keyName][currentLang];

      popup.innerHTML = `<strong>${titleStr[name][currentLang]}</strong><br>${description}`;
    });
  });
})();


// ==========================================================================
// 7. CHAPTER 7: CHEMICAL BONDING
// ==========================================================================
(function() {
  const stage = document.getElementById('c7Stage');
  const ionicBtn = document.getElementById('c7IonicBtn');
  const covalentBtn = document.getElementById('c7CovalentBtn');

  function renderIonic() {
    stage.innerHTML = `
      <div class="c7-atom na" id="atomNa">Na</div>
      <div class="c7-atom cl" id="atomCl">Cl</div>
      <div class="c7-electron" id="ionElectron" style="left:76px; top:67px;"></div>
    `;

    setTimeout(() => {
      const electron = document.getElementById('ionElectron');
      const na = document.getElementById('atomNa');
      const cl = document.getElementById('atomCl');
      
      // Move electron Na ➔ Cl
      electron.style.left = '236px';

      setTimeout(() => {
        // Change atom labels to show ionization
        na.innerHTML = 'Na⁺';
        cl.innerHTML = 'Cl⁻';
        na.style.background = 'rgba(52, 152, 219, 0.4)';
        cl.style.background = 'rgba(46, 204, 113, 0.4)';
        
        // Attract and snap together
        na.style.left = '120px';
        cl.style.left = '180px';
        electron.style.left = '180px';
      }, 700);

    }, 500);
  }

  function renderCovalent() {
    stage.innerHTML = `
      <div class="c7-atom h1" id="atomH1">H</div>
      <div class="c7-atom h2" id="atomH2">H</div>
      <div class="c7-atom o" id="atomO">O</div>
      <div class="c7-electron" id="covE1" style="left:60px; top:42px;"></div>
      <div class="c7-electron" id="covE2" style="left:60px; top:98px;"></div>
    `;

    setTimeout(() => {
      const h1 = document.getElementById('atomH1');
      const h2 = document.getElementById('atomH2');
      const o = document.getElementById('atomO');
      const e1 = document.getElementById('covE1');
      const e2 = document.getElementById('covE2');

      // Shared positions
      h1.style.left = '150px';
      h1.style.top = '25%';
      h2.style.left = '150px';
      h2.style.top = '75%';
      o.style.left = '210px';

      // Move shared valence electrons in between them
      e1.style.left = '188px';
      e1.style.top = '38px';
      
      e2.style.left = '188px';
      e2.style.top = '102px';

    }, 500);
  }

  ionicBtn.addEventListener('click', () => {
    [ionicBtn, covalentBtn].forEach(b => b.classList.remove('p-btn-accent'));
    ionicBtn.classList.add('p-btn-accent');
    renderIonic();
  });

  covalentBtn.addEventListener('click', () => {
    [ionicBtn, covalentBtn].forEach(b => b.classList.remove('p-btn-accent'));
    covalentBtn.classList.add('p-btn-accent');
    renderCovalent();
  });

  // Default ionic render
  renderIonic();
})();


// ==========================================================================
// 8. CHAPTER 8: PUNNETT SQUARE CALCULATOR
// ==========================================================================
(function() {
  const p1Sel = document.getElementById('c8P1');
  const p2Sel = document.getElementById('c8P2');
  const grid = document.getElementById('c8Grid');

  function calculate() {
    const P1 = p1Sel.value; // e.g. "Tt"
    const P2 = p2Sel.value; // e.g. "Tt"
    
    const p1Alleles = [P1[0], P1[1]];
    const p2Alleles = [P2[0], P2[1]];

    grid.innerHTML = '';

    // Row 1: Corner block, then P2 alleles
    grid.appendChild(createCell('🥚\\🌱', 'header'));
    grid.appendChild(createCell(p2Alleles[0], 'header'));
    grid.appendChild(createCell(p2Alleles[1], 'header'));

    let tallCount = 0;
    let shortCount = 0;

    // Rows 2 & 3: P1 allele, then crossings
    for (let r = 0; r < 2; r++) {
      grid.appendChild(createCell(p1Alleles[r], 'header'));
      
      for (let c = 0; c < 2; c++) {
        // Combine alleles, sorting dominant capital letters first
        const pair = [p1Alleles[r], p2Alleles[c]].sort().join('');
        const isTall = pair.includes('T');
        if (isTall) tallCount++; else shortCount++;

        const peaEmoji = isTall ? '🌿' : '🌱';
        const typeText = isTall ? translations.c8Tall[currentLang] : translations.cshort ? translations.cshort[currentLang] : 'Short';
        const displayLabel = `<span class="pea">${peaEmoji}</span><span>${pair}</span><span style="font-size:0.55rem;opacity:0.6;">${typeText}</span>`;
        grid.appendChild(createCell(displayLabel, 'cell'));
      }
    }

    // Add Phenotypic summary text below
    let summaryNode = document.getElementById('c8Summary');
    if (!summaryNode) {
      summaryNode = document.createElement('div');
      summaryNode.id = 'c8Summary';
      summaryNode.style.cssText = 'grid-column: span 3; text-align:center; font-size:0.74rem; color:var(--cyan); margin-top:8px;';
      grid.parentNode.appendChild(summaryNode);
    }
    summaryNode.textContent = translations.c8PhenoRatio[currentLang] + `${tallCount} ${translations.c8Tall[currentLang]} : ${shortCount} ${currentLang === 'bn' ? 'খাটো' : 'Short'}`;
  }

  function createCell(content, type) {
    const cell = document.createElement('div');
    cell.className = 'c8-cell';
    if (type === 'header') cell.classList.add('header');
    cell.innerHTML = content;
    return cell;
  }

  p1Sel.addEventListener('change', calculate);
  p2Sel.addEventListener('change', calculate);
  calculate();
})();


// ==========================================================================
// 9. CHAPTER 9: BIOMOLECULE NUTRIENT DOCKS
// ==========================================================================
(function() {
  const container = document.getElementById('c9-device');
  const itemsContainer = document.getElementById('c9Items');
  const resetBtn = document.getElementById('c9Reset');
  const slots = container.querySelectorAll('.c9-slot');

  let selectedFood = null;
  let selectedElement = null;

  itemsContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.c9-chip');
    if (!chip) return;

    itemsContainer.querySelectorAll('.c9-chip').forEach(c => c.classList.remove('selected'));
    selectedFood = chip.dataset.food;
    selectedElement = chip;
    chip.classList.add('selected');
  });

  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      if (!selectedFood || !selectedElement) return;

      const slotType = slot.dataset.slot;

      // Validate nutrition groups
      let isValid = false;
      if (slotType === 'carb' && (selectedFood === 'rice' || selectedFood === 'potato')) isValid = true;
      if (slotType === 'prot' && (selectedFood === 'egg' || selectedFood === 'fish')) isValid = true;
      if (slotType === 'lip' && selectedFood === 'butter') isValid = true;

      if (isValid) {
        slot.appendChild(selectedElement);
        selectedElement.classList.remove('selected');
        selectedElement.style.borderColor = 'rgba(255,255,255,0.06)';
        selectedFood = null;
        selectedElement = null;
        checkCompletion();
      } else {
        // Highlight wrong classification
        selectedElement.style.borderColor = 'var(--chalk-coral)';
      }
    });
  });

  function checkCompletion() {
    if (itemsContainer.children.length === 0) {
      let note = document.getElementById('c9CompleteNote');
      if (!note) {
        note = document.createElement('div');
        note.id = 'c9CompleteNote';
        note.style.cssText = 'color:#2ecc71; font-size:0.75rem; text-align:center; margin-top:8px; line-height:1.45;';
        itemsContainer.parentNode.insertBefore(note, resetBtn);
      }
      note.textContent = translations.c9Complete[currentLang];
    }
  }

  resetBtn.addEventListener('click', () => {
    const list = ['rice', 'egg', 'butter', 'fish', 'potato'];
    const labels = { rice: '🍚 Rice', egg: '🥚 Egg', butter: '🧈 Butter', fish: '🐟 Fish', potato: '🥔 Potato' };
    
    itemsContainer.innerHTML = '';
    list.forEach(item => {
      const div = document.createElement('div');
      div.className = 'c9-chip';
      div.dataset.food = item;
      div.textContent = labels[item];
      itemsContainer.appendChild(div);
    });

    slots.forEach(s => {
      s.querySelectorAll('.c9-chip').forEach(c => c.remove());
    });

    const note = document.getElementById('c9CompleteNote');
    if (note) note.remove();
    selectedFood = null;
    selectedElement = null;
  });
})();


// ==========================================================================
// 10. CHAPTER 10: PHOTOSYNTHESIS METER
// ==========================================================================
(function() {
  const stage = document.getElementById('c10Stage');
  const lightSlider = document.getElementById('c10Light');
  const co2Slider = document.getElementById('c10CO2');
  const rateVal = document.getElementById('c10Rate');

  function update() {
    const light = parseInt(lightSlider.value);
    const co2 = parseInt(co2Slider.value);
    
    // Rate of photosynthesis = (Light * CO2) / 100
    const rate = Math.round((light * co2) / 100);
    rateVal.textContent = rate + '%';

    // Particle flow animation
    if (rate > 10 && Math.random() < (rate / 150)) {
      spawnMolecule('CO₂', 0, 50, 150, 0, '#74b9ff');
      spawnMolecule('H₂O', 0, 100, 150, 0, '#74b9ff');
    }
    if (rate > 20 && Math.random() < (rate / 250)) {
      spawnMolecule('O₂', 150, 75, 230, -50, '#2ecc71');
      spawnMolecule('Sugar', 150, 75, 230, 50, '#ff7675');
    }
  }

  function spawnMolecule(name, startX, startY, targetDx, targetDy, color) {
    const mol = document.createElement('div');
    mol.className = 'c10-molecule-flow';
    mol.style.color = color;
    mol.style.left = startX + 'px';
    mol.style.top = startY + 'px';
    mol.style.setProperty('--x', targetDx + 'px');
    mol.style.setProperty('--y', targetDy + 'px');
    mol.textContent = name;
    stage.appendChild(mol);

    setTimeout(() => mol.remove(), 2000);
  }

  lightSlider.addEventListener('input', update);
  co2Slider.addEventListener('input', update);
  setInterval(update, 200);
})();


// ==========================================================================
// 11. CHAPTER 11: CIRCULATION PUMP ENGINE
// ==========================================================================
(function() {
  const heart = document.getElementById('c11Heart');
  const bpmText = document.getElementById('c11Bpm');
  
  let clickTimes = [];
  let pulseTimer = null;

  heart.addEventListener('click', () => {
    // Cardiac contract squeeze animation
    heart.classList.add('beat');
    setTimeout(() => heart.classList.remove('beat'), 100);

    // Calculate BPM
    const now = Date.now();
    clickTimes.push(now);
    // keep last 5 taps
    if (clickTimes.length > 5) clickTimes.shift();

    if(clickTimes.length > 1) {
      const interval = (clickTimes[clickTimes.length - 1] - clickTimes[0]) / (clickTimes.length - 1);
      const bpm = Math.round(60000 / interval);
      bpmText.textContent = bpm + ' bpm';
    } else {
      bpmText.textContent = '72 bpm';
    }

    // Trigger pulse runs along circulation SVG paths
    triggerPulse();
  });

  function triggerPulse() {
    const pulseRed = document.getElementById('pulseRed');
    const pulseBlue = document.getElementById('pulseBlue');

    // Simple offset path animation resets
    pulseRed.style.animation = 'none';
    pulseBlue.style.animation = 'none';
    
    // Trigger reflow to restart animation
    void pulseRed.offsetWidth;
    void pulseBlue.offsetWidth;

    pulseRed.style.animation = 'pulseRunRed 1.8s linear infinite';
    pulseBlue.style.animation = 'pulseRunBlue 1.8s linear infinite';
    
    // Assign path geometries
    pulseRed.style.offsetPath = "path('M190,30 C260,30 260,116 190,116')";
    pulseBlue.style.offsetPath = "path('M160,116 C90,116 90,30 160,30')";
  }
})();


// ==========================================================================
// 12. CHAPTER 12: ECOSYSTEM TROPHIC WEB
// ==========================================================================
(function() {
  const container = document.getElementById('c12-device');
  const nodes = container.querySelectorAll('.c12-node');
  const statusVal = document.getElementById('c12Status');
  const energyVal = document.getElementById('c12Energy');

  let currentSequenceIndex = 0; // 0: None, 1: Grass, 2: Grasshopper, 3: Frog, 4: Snake

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const idx = parseInt(node.dataset.idx);

      if (idx === currentSequenceIndex + 1) {
        currentSequenceIndex = idx;
        node.classList.add('active');
        
        // Highlight corresponding connector lines
        if (idx === 2) document.getElementById('l12_1').classList.add('on');
        if (idx === 3) document.getElementById('l12_2').classList.add('on');
        if (idx === 4) document.getElementById('l12_3').classList.add('on');

        updateTrophicStatus();
      } else {
        // Break link if incorrect sequence clicked
        resetWeb();
      }
    });
  });

  function updateTrophicStatus() {
    if (currentSequenceIndex === 1) {
      statusVal.textContent = currentLang === 'bn' ? 'উৎপাদক (ঘাস) যুক্ত' : 'Producer (Grass) Linked';
      energyVal.textContent = '10000 kcal';
    } else if (currentSequenceIndex === 2) {
      statusVal.textContent = currentLang === 'bn' ? 'তৃণভোজী খাদক যুক্ত' : 'Primary Herbivore Linked';
      energyVal.textContent = '1000 kcal (10% law)';
    } else if (currentSequenceIndex === 3) {
      statusVal.textContent = currentLang === 'bn' ? '২য় স্তরের খাদক যুক্ত' : 'Secondary Carnivore Linked';
      energyVal.textContent = '100 kcal (10% law)';
    } else if (currentSequenceIndex === 4) {
      statusVal.textContent = translations.c12Active[currentLang];
      energyVal.textContent = '10 kcal (10% law)';
    }
  }

  function resetWeb() {
    currentSequenceIndex = 0;
    nodes.forEach(n => n.classList.remove('active'));
    document.getElementById('l12_1').classList.remove('on');
    document.getElementById('l12_2').classList.remove('on');
    document.getElementById('l12_3').classList.remove('on');
    statusVal.textContent = translations.c12Inactive[currentLang];
    energyVal.textContent = '0 kcal';
  }
})();


// ==========================================================================
// 13. CHAPTER 13: KEPLER GRAVITY ORBIT
// ==========================================================================
(function() {
  const speedSlider = document.getElementById('c13Speed');
  const earth = document.getElementById('c13Earth');
  const statusEl = document.getElementById('c13Status');

  let orbitAngle = 0;

  function orbitLoop() {
    const speed = parseInt(speedSlider.value);
    
    if (speed < 18) {
      // Gravitational decay crash
      statusEl.textContent = translations.c13Crashed[currentLang];
      statusEl.style.color = 'var(--chalk-coral)';
      earth.style.left = '50%';
      earth.style.top = '50%';
      earth.style.transform = 'translate(-50%, -50%)';
    } else if (speed > 48) {
      // Escape velocity flight
      statusEl.textContent = translations.c13Escaped[currentLang];
      statusEl.style.color = 'var(--chalk-yellow)';
      earth.style.left = '110%';
      earth.style.top = '-10%';
    } else {
      // Stable orbit
      statusEl.textContent = translations.c13Stable[currentLang];
      statusEl.style.color = 'var(--cyan)';

      orbitAngle += (speed / 1000);
      const rx = 65; // radius x
      const ry = 45; // radius y
      
      const x = Math.cos(orbitAngle) * rx;
      const y = Math.sin(orbitAngle) * ry;

      earth.style.left = `calc(50% + ${x}px)`;
      earth.style.top = `calc(50% + ${y}px)`;
    }

    requestAnimationFrame(orbitLoop);
  }

  orbitLoop();
})();


// ==========================================================================
// 14. CHAPTER 14: DEFORESTATION SOIL EROSION
// ==========================================================================
(function() {
  const rainBtn = document.getElementById('c14RainBtn');
  const stage = document.getElementById('c14Stage');
  const soilL = document.getElementById('c14SoilL');
  const soilR = document.getElementById('c14SoilR');
  
  const valL = document.getElementById('c14SoilLVal');
  const valR = document.getElementById('c14SoilRVal');

  let isRaining = false;
  let rainTimer = null;
  
  let leftSoilLevel = 32;
  let rightSoilLevel = 32;

  rainBtn.addEventListener('click', () => {
    isRaining = !isRaining;
    if (isRaining) {
      rainBtn.textContent = currentLang === 'bn' ? '🌧️ বৃষ্টি থামান (Stop Rain)' : '🌧️ Stop Rain';
      rainBtn.classList.remove('p-btn-accent');
      rainBtn.classList.add('p-btn-coral');
      startRain();
    } else {
      rainBtn.textContent = currentLang === 'bn' ? '🌧️ বৃষ্টি শুরু করুন (Start Rain)' : '🌧️ Start Rain';
      rainBtn.classList.add('p-btn-accent');
      rainBtn.classList.remove('p-btn-coral');
      stopRain();
    }
  });

  function startRain() {
    // Generate rain particles
    rainTimer = setInterval(() => {
      const drop = document.createElement('div');
      drop.className = 'c14-rain-drop';
      drop.style.left = Math.random() * 100 + '%';
      drop.style.animationDuration = (0.5 + Math.random() * 0.4) + 's';
      stage.appendChild(drop);

      // Clean up rain particles
      setTimeout(() => drop.remove(), 800);

      // Decaying barren soil heights due to rain erosion
      if (rightSoilLevel > 6) {
        rightSoilLevel -= 0.12;
        soilR.style.height = rightSoilLevel + 'px';
        soilR.style.background = '#83593b'; // muddy
        
        const pct = Math.round((rightSoilLevel / 32) * 100);
        valR.textContent = pct + '%';
      }
      
      // Forested soil erosion decay is negligible due to root binding
      if (leftSoilLevel > 28) {
        leftSoilLevel -= 0.01;
        soilL.style.height = leftSoilLevel + 'px';
        
        const pct = Math.round((leftSoilLevel / 32) * 100);
        valL.textContent = pct + '%';
      }

    }, 60);
  }

  function stopRain() {
    clearInterval(rainTimer);
  }
})();


// ==========================================================================
// TRANSLATION REFRESH OVERLAYS
// ==========================================================================
function refreshSimStrings() {
  // Update Punnett Square and Genetics displays
  const sumNode = document.getElementById('c8Summary');
  if (sumNode) {
    const P1 = document.getElementById('c8P1').value;
    const P2 = document.getElementById('c8P2').value;
    const p1Alleles = [P1[0], P1[1]];
    const p2Alleles = [P2[0], P2[1]];
    let tallCount = 0; let shortCount = 0;
    
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const pair = [p1Alleles[r], p2Alleles[c]].sort().join('');
        if (pair.includes('T')) tallCount++; else shortCount++;
      }
    }
    sumNode.textContent = translations.c8PhenoRatio[currentLang] + `${tallCount} ${translations.c8Tall[currentLang]} : ${shortCount} ${currentLang === 'bn' ? 'খাটো' : 'Short'}`;
  }

  // Chapter 9 Biomolecules reset updates
  const note9 = document.getElementById('c9CompleteNote');
  if (note9) {
    note9.textContent = translations.c9Complete[currentLang];
  }

  // Chapter 12 Ecosystem reset updates
  const note12 = document.getElementById('c12Status');
  if (note12 && note12.textContent !== 'Inactive' && note12.textContent !== 'অসম্পূর্ণ চেইন') {
    const isCompleted = document.getElementById('n12_4').classList.contains('active');
    if (isCompleted) {
      note12.textContent = translations.c12Active[currentLang];
    }
  }

  // Chapter 14 Erosion text updates
  const rainBtn = document.getElementById('c14RainBtn');
  if (rainBtn) {
    const isRaining = rainBtn.classList.contains('p-btn-coral');
    if (isRaining) {
      rainBtn.textContent = currentLang === 'bn' ? '🌧️ বৃষ্টি থামান (Stop Rain)' : '🌧️ Stop Rain';
    } else {
      rainBtn.textContent = currentLang === 'bn' ? '🌧️ বৃষ্টি শুরু করুন (Start Rain)' : '🌧️ Start Rain';
    }
  }
}

// Initial setup call
setLanguage('bn');
