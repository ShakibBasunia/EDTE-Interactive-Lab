// ==========================================================================
// SCIENCE CURRICULUM GLOBAL GAME ENGINE & DATABASE MANAGER (BILINGUAL)
// ==========================================================================

// Global Language State
let currentLang = localStorage.getItem('science_lang') || 'bn';

// Standard translations for common elements
const commonTranslations = {
  home: { bn: '🏠 ড্যাশবোর্ড হোম', en: '🏠 Dashboard Home' },
  profileSwitch: { bn: '👥 প্রোফাইল পরিবর্তন', en: '👥 Switch Profile' },
  xp: { bn: 'অভিজ্ঞতা (XP)', en: 'Experience (XP)' },
  lvl: { bn: 'স্তর', en: 'Level' },
  ch: { bn: 'অধ্যায়', en: 'Chapter' },
  completed: { bn: 'সম্পন্ন', en: 'Completed' },
  notCompleted: { bn: 'অসম্পূর্ণ', en: 'Incomplete' },
  levelUp: { bn: '🎉 অভিনন্দন! আপনি স্তর উন্নত করেছেন!', en: '🎉 Level Up! You advanced to a new Level!' },
  physics: { bn: 'পদার্থবিজ্ঞান', en: 'Physics' },
  chemistry: { bn: 'রসায়ন', en: 'Chemistry' },
  biology: { bn: 'জীববিজ্ঞান', en: 'Biology' },
  space: { bn: 'মহাকাশ বিজ্ঞান', en: 'Space Science' },
  earth: { bn: 'পৃথিবী ও পরিবেশ', en: 'Earth Science' },
  
  // Badge titles
  badge_novice: { bn: '🎓 নবীন গবেষক', en: '🎓 Novice Inquirer' },
  badge_physicist: { bn: '⚡ বলবিদ্যার ওস্তাদ', en: '⚡ Physicist' },
  badge_chemist: { bn: '🧪 দক্ষ রসায়নবিদ', en: '🧪 Chemist' },
  badge_biologist: { bn: '🧬 জীববিজ্ঞানী', en: '🧬 Biologist' },
  badge_astronomer: { bn: '🌌 মহাকাশচারী', en: '🌌 Astronomer' },
  badge_ecologist: { bn: '🌍 পরিবেশবিদ', en: '🌍 Ecologist' },
  badge_master: { bn: '🏆 বিজ্ঞান শিরোমণি', en: '🏆 Science Master' },
  
  // Badge requirements descriptions
  req_novice: { bn: 'যেকোনো ১টি ল্যাব কার্যক্রম সম্পূর্ণ করুন।', en: 'Complete any 1 lab activity.' },
  req_physicist: { bn: 'অধ্যায় ১, ২ ও ৩ এর কুইজ সম্পূর্ণ করুন (৮০%+ স্কোর)।', en: 'Complete quizzes for Chapters 1-3 with 80%+' },
  req_chemist: { bn: 'অধ্যায় ৪, ৫, ৬ ও ৭ এর কুইজ সম্পূর্ণ করুন (৮০%+ স্কোর)।', en: 'Complete quizzes for Chapters 4-7 with 80%+' },
  req_biologist: { bn: 'অধ্যায় ৮, ৯, ১০, ১১ ও ১২ এর কুইজ সম্পূর্ণ করুন (৮০%+ স্কোর)।', en: 'Complete quizzes for Chapters 8-12 with 80%+' },
  req_astronomer: { bn: 'অধ্যায় ১৩ এর কুইজে ১০০% স্কোর অর্জন করুন।', en: 'Complete Chapter 13 quiz with 100% score.' },
  req_ecologist: { bn: 'অধ্যায় ১৪ এর কুইজে ১০০% স্কোর অর্জন করুন।', en: 'Complete Chapter 14 quiz with 100% score.' },
  req_master: { bn: 'সকল ১৪টি অধ্যায়ের সিমুলেটর ও কুইজ শেষ করুন।', en: 'Complete all 14 quizzes and simulations.' }
};

// Chapter Directory
const chapterDirectory = [
  { num: '01', id: 'ch1', file: 'science_ch1.html', bn: 'বল, চাপ ও শক্তি', en: 'Force, Pressure & Energy', cat: 'physics' },
  { num: '02', id: 'ch2', file: 'science_ch2.html', bn: 'তাপ ও তাপমাত্রা', en: 'Heat & Temperature', cat: 'physics' },
  { num: '03', id: 'ch3', file: 'science_ch3.html', bn: 'আধুনিক পদার্থবিজ্ঞান', en: 'Modern Physics', cat: 'physics' },
  { num: '04', id: 'ch4', file: 'science_ch4.html', bn: 'পদার্থের অবস্থা', en: 'States of Matter', cat: 'chemistry' },
  { num: '05', id: 'ch5', file: 'science_ch5.html', bn: 'পদার্থের গঠন', en: 'Structure of Matter', cat: 'chemistry' },
  { num: '06', id: 'ch6', file: 'science_ch6.html', bn: 'পর্যায় সারণি', en: 'Periodic Table', cat: 'chemistry' },
  { num: '07', id: 'ch7', file: 'science_ch7.html', bn: 'রাসায়নিক বন্ধন', en: 'Chemical Bonds', cat: 'chemistry' },
  { num: '08', id: 'ch8', file: 'science_ch8.html', bn: 'জিনতত্ত্ব ও বংশগতি', en: 'Genetics & Heredity', cat: 'biology' },
  { num: '09', id: 'ch9', file: 'science_ch9.html', bn: 'জৈব অণু', en: 'Biomolecules', cat: 'biology' },
  { num: '10', id: 'ch10', file: 'science_ch10.html', bn: 'সালোকসংশ্লেষণ', en: 'Photosynthesis', cat: 'biology' },
  { num: '11', id: 'ch11', file: 'science_ch11.html', bn: 'মানব শরীরের তন্ত্র', en: 'Human Organ Systems', cat: 'biology' },
  { num: '12', id: 'ch12', file: 'science_ch12.html', bn: 'বাস্তুতন্ত্র', en: 'Ecosystems', cat: 'biology' },
  { num: '13', id: 'ch13', file: 'science_ch13.html', bn: 'পৃথিবী ও মহাবিশ্ব', en: 'Earth & Universe', cat: 'space' },
  { num: '14', id: 'ch14', file: 'science_ch14.html', bn: 'পরিবেশ ও ভূমিরূপ', en: 'Environment & Landforms', cat: 'earth' }
];

// ==========================================================================
// SOUND EFFECT SYNTHESIZER (NATIVE WEB AUDIO API)
// ==========================================================================
const AudioFX = {
  ctx: null,
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  playChime() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = 'triangle';
    
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    
    osc.start(now);
    osc.stop(now + 0.35);
  },
  playBuzzer() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = 'sawtooth';
    
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.linearRampToValueAtTime(85, now + 0.25);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    osc.start(now);
    osc.stop(now + 0.28);
  },
  playLevelUp() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = 'sine';
    
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(261.63, now); // C4
    osc.frequency.setValueAtTime(329.63, now + 0.08); // E4
    osc.frequency.setValueAtTime(392.00, now + 0.16); // G4
    osc.frequency.setValueAtTime(523.25, now + 0.24); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.32); // E5
    osc.frequency.setValueAtTime(1046.50, now + 0.40); // C6
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    
    osc.start(now);
    osc.stop(now + 0.65);
  }
};

// ==========================================================================
// STUDENT PROFILE DATABASE ACTIONS
// ==========================================================================
const DB = {
  getDefaultData() {
    return {
      profiles: [
        {
          id: 'p_default',
          name: 'তাহমিদ (Tahmid)',
          avatar: '👨‍🎓',
          xp: 150,
          quizScores: {},
          completedSims: {}
        }
      ],
      activeProfileId: 'p_default'
    };
  },
  load() {
    let data = localStorage.getItem('science_db');
    if (!data) {
      data = JSON.stringify(this.getDefaultData());
      localStorage.setItem('science_db', data);
    }
    return JSON.parse(data);
  },
  save(state) {
    localStorage.setItem('science_db', JSON.stringify(state));
  },
  getActiveProfile() {
    const state = this.load();
    const active = state.profiles.find(p => p.id === state.activeProfileId);
    return active || state.profiles[0];
  },
  updateActiveProfile(updates) {
    const state = this.load();
    const profileIdx = state.profiles.findIndex(p => p.id === state.activeProfileId);
    if (profileIdx !== -1) {
      state.profiles[profileIdx] = { ...state.profiles[profileIdx], ...updates };
      this.save(state);
    }
  },
  addXP(amount) {
    const profile = this.getActiveProfile();
    const oldXp = profile.xp || 0;
    const newXp = oldXp + amount;
    
    const oldLvl = Math.floor(oldXp / 500) + 1;
    const newLvl = Math.floor(newXp / 500) + 1;
    
    profile.xp = newXp;
    this.updateActiveProfile({ xp: newXp });
    
    // Check level up
    if (newLvl > oldLvl) {
      setTimeout(() => {
        AudioFX.playLevelUp();
        this.triggerLevelUpNotification(newLvl);
      }, 500);
    }
    
    // Redraw sidebar UI
    this.syncSidebar();
  },
  triggerLevelUpNotification(lvl) {
    const toast = document.createElement('div');
    toast.className = 'level-up-toast';
    toast.innerHTML = `
      <div style="font-size:2rem;">👑</div>
      <div>
        <strong class="bn">${commonTranslations.levelUp.bn}</strong>
        <strong class="en">${commonTranslations.levelUp.en}</strong>
        <div style="font-size:0.8rem; margin-top:2px;">
          <span class="bn">আপনার নতুন স্তর: <b>${lvl}</b></span>
          <span class="en">New Level achieved: <b>${lvl}</b></span>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transition = 'opacity 0.5s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  },
  
  // Badge logic evaluations
  checkBadges(profile) {
    const unlocked = [];
    const completedSimsCount = Object.keys(profile.completedSims || {}).length;
    const quizzes = profile.quizScores || {};
    
    // Novice Inquirer: 1 complete simulation
    if (completedSimsCount >= 1) unlocked.push('novice');
    
    // Physicist: Ch 1, 2, 3 quizzes >= 80% (assuming quizzes are graded out of 5, 80% is 4/5)
    if ((quizzes.ch1 >= 4) && (quizzes.ch2 >= 4) && (quizzes.ch3 >= 4)) {
      unlocked.push('physicist');
    }
    
    // Chemist: Ch 4, 5, 6, 7 quizzes >= 4
    if ((quizzes.ch4 >= 4) && (quizzes.ch5 >= 4) && (quizzes.ch6 >= 4) && (quizzes.ch7 >= 4)) {
      unlocked.push('chemist');
    }
    
    // Biologist: Ch 8-12 quizzes >= 4
    if ((quizzes.ch8 >= 4) && (quizzes.ch9 >= 4) && (quizzes.ch10 >= 4) && (quizzes.ch11 >= 4) && (quizzes.ch12 >= 4)) {
      unlocked.push('biologist');
    }
    
    // Astronomer: Ch 13 quiz == 5
    if (quizzes.ch13 === 5) unlocked.push('astronomer');
    
    // Ecologist: Ch 14 quiz == 5
    if (quizzes.ch14 === 5) unlocked.push('ecologist');
    
    // Master: All 14 quizzes done, and 14 sims done
    const doneQuizzes = Object.keys(quizzes).length;
    if (doneQuizzes >= 14 && completedSimsCount >= 14) unlocked.push('master');
    
    return unlocked;
  },
  
  // Render Left Navigation HUD Sidebar
  syncSidebar() {
    const sidebarNode = document.getElementById('sidebar');
    if (!sidebarNode) return;
    
    const profile = this.getActiveProfile();
    const xp = profile.xp || 0;
    const level = Math.floor(xp / 500) + 1;
    const currentXpInLvl = xp % 500;
    const pct = (currentXpInLvl / 500) * 100;
    const unlockedBadges = this.checkBadges(profile);
    
    // Determine which page is currently active
    const currentFilename = window.location.pathname.split('/').pop() || 'science.html';
    
    // Assemble Sidebar HTML
    let html = `
      <!-- Mobile header -->
      <div class="mobile-nav-header">
        <h2 style="font-size:1.1rem; color:var(--chalk-yellow);">Class 9-10 Science</h2>
        <button class="hamburger-btn" id="mobileMenuToggle">☰ Menu</button>
      </div>

      <!-- Sidebar Contents wrapper (collapsible in mobile) -->
      <div class="sidebar-nav" id="sidebarMenu">
        
        <!-- Profile HUD -->
        <div class="hud-profile">
          <div class="hud-avatar">${profile.avatar || '👨‍🎓'}</div>
          <div class="hud-name">${profile.name}</div>
          <div class="hud-level-badge">
            <span class="bn">${commonTranslations.lvl.bn} ${level}</span>
            <span class="en">${commonTranslations.lvl.en} ${level}</span>
          </div>
          <div class="hud-xp-track">
            <div class="hud-xp-bar" style="width: ${pct}%"></div>
          </div>
          <div class="hud-xp-text">${currentXpInLvl} / 500 XP</div>
          
          <!-- Badges rack -->
          <div class="badge-rack">
    `;
    
    const badgesInfo = [
      { key: 'novice', icon: '🎓' },
      { key: 'physicist', icon: '⚡' },
      { key: 'chemist', icon: '🧪' },
      { key: 'biologist', icon: '🧬' },
      { key: 'astronomer', icon: '🌌' },
      { key: 'ecologist', icon: '🌍' },
      { key: 'master', icon: '🏆' }
    ];
    
    badgesInfo.forEach(b => {
      const isUnlocked = unlockedBadges.includes(b.key);
      const titleBn = commonTranslations['badge_' + b.key].bn;
      const titleEn = commonTranslations['badge_' + b.key].en;
      const reqBn = commonTranslations['req_' + b.key].bn;
      const reqEn = commonTranslations['req_' + b.key].en;
      
      const tooltip = currentLang === 'bn' ? `${titleBn} - ${reqBn}` : `${titleEn} - ${reqEn}`;
      
      html += `
        <div class="badge-item ${isUnlocked ? 'unlocked' : ''}" data-title="${tooltip}">
          ${b.icon}
        </div>
      `;
    });
    
    html += `
          </div>
        </div>

        <!-- Links -->
        <a href="index.html" class="sidebar-link">
          <span class="sidebar-ch-num">🌐</span>
          <span>
            <span class="bn">প্রধান পোর্টাল হোম</span>
            <span class="en">Main Portal Home</span>
          </span>
        </a>
        <a href="science.html" class="sidebar-link ${currentFilename === 'science.html' ? 'active' : ''}">
          <span class="sidebar-ch-num">🏠</span>
          <span>
            <span class="bn">${commonTranslations.home.bn}</span>
            <span class="en">${commonTranslations.home.en}</span>
          </span>
        </a>
    `;
    
    // Chapters Links
    chapterDirectory.forEach(ch => {
      const isActive = currentFilename === ch.file;
      const isQuizDone = (profile.quizScores[ch.id] !== undefined);
      const isSimDone = (profile.completedSims[ch.id] !== undefined);
      
      let marker = '';
      if (isQuizDone && isSimDone) {
        marker = ' ✅';
      } else if (isQuizDone || isSimDone) {
        marker = ' 🟡';
      }
      
      html += `
        <a href="${ch.file}" class="sidebar-link ${isActive ? 'active' : ''}">
          <span class="sidebar-ch-num">${ch.num}</span>
          <span>
            <span class="bn">${ch.bn}${marker}</span>
            <span class="en">${ch.en}${marker}</span>
          </span>
        </a>
      `;
    });
    
    html += `
      </div> <!-- End sidebar menu -->
      
      <!-- Footer items -->
      <div class="sidebar-footer">
        <a href="science.html" class="lang-toggle" style="text-decoration:none; font-size:0.7rem; font-weight:bold;">
          <span class="bn">${commonTranslations.profileSwitch.bn}</span>
          <span class="en">${commonTranslations.profileSwitch.en}</span>
        </a>
        <button class="lang-toggle" id="globalLangToggle">বাংলা / EN</button>
      </div>
    `;
    
    sidebarNode.innerHTML = html;
    
    // Bind Event Listeners inside sidebar
    document.getElementById('globalLangToggle').addEventListener('click', () => {
      const nextLang = currentLang === 'bn' ? 'en' : 'bn';
      setLanguage(nextLang);
    });
    
    // Mobile navigation toggle
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const menuList = document.getElementById('sidebarMenu');
    if (toggleBtn && menuList) {
      toggleBtn.addEventListener('click', () => {
        menuList.classList.toggle('active');
      });
    }
  }
};

// ==========================================================================
// SYSTEM LANGUAGE TOGGLER
// ==========================================================================
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('science_lang', lang);
  
  if (lang === 'bn') {
    document.documentElement.classList.remove('lang-en');
    document.documentElement.classList.add('lang-bn');
    document.documentElement.lang = 'bn';
  } else {
    document.documentElement.classList.remove('lang-bn');
    document.documentElement.classList.add('lang-en');
    document.documentElement.lang = 'en';
  }
  
  // Re-sync Sidebar and trigger local page updates if they exist
  DB.syncSidebar();
  if (window.refreshLocalPageStrings) {
    window.refreshLocalPageStrings();
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  
  // Intercept keypresses or clicks to resume audio context
  document.body.addEventListener('click', () => {
    AudioFX.init();
  }, { once: true });
});
