// ==========================================================================
// CHAPTER 06 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch6';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "পর্যায় সারণির গ্রুপ ১৮ মৌলগুলোকে কী বলা হয়?",
      "en": "What are Group 18 elements in the periodic table called?"
    },
    "options": {
      "bn": [
        "ক্ষার ধাতু",
        "হ্যালোজেন",
        "নিষ্ক্রিয় গ্যাস",
        "অবস্থান্তর ধাতু"
      ],
      "en": [
        "Alkali Metals",
        "Halogens",
        "Noble Gases",
        "Transition Metals"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "গ্রুপ ১৮ মৌলসমূহের সর্বশেষ শক্তিস্তর ইলেকট্রন দ্বারা পূর্ণ থাকে, তাই এরা নিষ্ক্রিয় বা নোবেল গ্যাস।",
      "en": "Group 18 elements have completely filled outer electron shells, rendering them inert."
    }
  },
  {
    "question": {
      "bn": "পর্যায় সারণির হ্যালোজেন গ্রুপের নম্বর কত?",
      "en": "What is the group number of Halogens in the periodic table?"
    },
    "options": {
      "bn": [
        "গ্রুপ ১",
        "গ্রুপ ২",
        "গ্রুপ ১৭",
        "গ্রুপ ১৮"
      ],
      "en": [
        "Group 1",
        "Group 2",
        "Group 17",
        "Group 18"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "গ্রুপ ১৭ এর মৌলগুলো (F, Cl, Br, I) হ্যালোজেন বা লবণ উৎপাদনকারী নামে পরিচিত।",
      "en": "Group 17 elements (F, Cl, Br, I) are known as Halogens (salt-formers)."
    }
  },
  {
    "question": {
      "bn": "মেন্ডেলিভ প্রথম পর্যায় সারণি প্রকাশের সময় মৌলগুলোকে কিসের ভিত্তিতে সাজিয়েছিলেন?",
      "en": "On what basis did Mendeleev arrange elements in his initial periodic table?"
    },
    "options": {
      "bn": [
        "পারমাণবিক সংখ্যা",
        "পারমাণবিক ভর",
        "যোজনী",
        "ঘনত্ব"
      ],
      "en": [
        "Atomic number",
        "Atomic mass",
        "Valency",
        "Density"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "মেন্ডেলিভ মৌলগুলোকে ক্রমবর্ধমান পারমাণবিক ভর অনুসারে সাজিয়েছিলেন। পরবর্তীতে এটি পারমাণবিক সংখ্যা দিয়ে সংশোধিত হয়।",
      "en": "Mendeleev originally arranged elements by increasing atomic mass. Henry Moseley later revised it to atomic number."
    }
  }
];

// Global Translation keys
const localTranslations = {};

// Render Quiz State
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

function renderQuiz() {
  const panel = document.getElementById('quizPanel');
  if (!panel) return;
  
  if (currentQuestionIndex >= quizQuestions.length) {
    renderQuizResults();
    return;
  }
  
  const q = quizQuestions[currentQuestionIndex];
  const lang = currentLang;
  
  // Progress dots
  let dotsHtml = '';
  for (let i = 0; i < quizQuestions.length; i++) {
    let statusClass = '';
    if (i === currentQuestionIndex) statusClass = 'active';
    else if (i < currentQuestionIndex) {
      statusClass = userAnswers[i] === quizQuestions[i].answer ? 'correct' : 'incorrect';
    }
    dotsHtml += `<div class="quiz-dot ${statusClass}"></div>`;
  }
  
  let html = `
    <div class="quiz-progress">${dotsHtml}</div>
    <div class="quiz-question-box">
      <strong>Q${currentQuestionIndex + 1}:</strong> ${q.question[lang]}
    </div>
    <div class="quiz-opts">
  `;
  
  q.options[lang].forEach((opt, idx) => {
    const letter = String.fromCharCode(65 + idx); // A, B, C, D
    html += `
      <button class="quiz-opt" onclick="selectAnswer(${idx})">
        <span class="quiz-opt-letter">${letter}</span>
        <span>${opt}</span>
      </button>
    `;
  });
  
  html += `
    </div>
    <div class="quiz-feedback" id="quizFeedback"></div>
  `;
  
  panel.innerHTML = html;
}

function selectAnswer(optIdx) {
  const q = quizQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll('.quiz-opt');
  const feedback = document.getElementById('quizFeedback');
  const lang = currentLang;
  
  // Disable further clicks
  buttons.forEach(b => b.removeAttribute('onclick'));
  
  userAnswers.push(optIdx);
  
  if (optIdx === q.answer) {
    score++;
    buttons[optIdx].classList.add('correct');
    AudioFX.playChime();
    feedback.style.color = '#2ecc71';
  } else {
    buttons[optIdx].classList.add('incorrect');
    buttons[q.answer].classList.add('correct');
    AudioFX.playBuzzer();
    feedback.style.color = '#e74c3c';
  }
  
  feedback.textContent = q.explain[lang];
  feedback.style.display = 'block';
  
  // Next question after delay
  setTimeout(() => {
    currentQuestionIndex++;
    renderQuiz();
  }, 3500);
}

function renderQuizResults() {
  const panel = document.getElementById('quizPanel');
  const lang = currentLang;
  const passed = score === quizQuestions.length;
  
  // Award XP to active student profile
  const profile = DB.getActiveProfile();
  const oldScore = profile.quizScores[chId] || 0;
  
  if (score > oldScore) {
    profile.quizScores[chId] = score;
    DB.updateActiveProfile({ quizScores: profile.quizScores });
    // Award 50 XP per point gain
    DB.addXP((score - oldScore) * 50);
  }
  
  let messageBn = passed ? '🎉 চমৎকার! আপনি সবগুলো প্রশ্নের সঠিক উত্তর দিয়েছেন।' : '💪 আবার চেষ্টা করুন! সবগুলো সঠিক উত্তর পেতে পাঠটি পুনরায় পড়ুন।';
  let messageEn = passed ? '🎉 Excellent! You answered all questions correctly.' : '💪 Keep learning! Review the core theories and try again.';
  
  panel.innerHTML = `
    <div class="quiz-results-screen">
      <div class="quiz-medal">${passed ? '🥇' : '⭐'}</div>
      <div class="quiz-score-num">${score} / ${quizQuestions.length}</div>
      <p style="font-size:0.85rem; margin:10px 0;">
        <span class="bn">${messageBn}</span>
        <span class="en">${messageEn}</span>
      </p>
      <button class="p-btn p-btn-accent" onclick="resetQuiz()">
        <span class="bn">🔄 আবার খেলুন</span><span class="en">🔄 Retake Quiz</span>
      </button>
    </div>
  `;
}

function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  renderQuiz();
}

// Mark simulator as completed to award XP
function completeSimulation() {
  const profile = DB.getActiveProfile();
  if (!profile.completedSims[chId]) {
    profile.completedSims[chId] = true;
    DB.updateActiveProfile({ completedSims: profile.completedSims });
    DB.addXP(100); // 100 XP for simulator completion
  }
}

// Global Language trigger on current page
window.refreshLocalPageStrings = function() {
  renderQuiz();
  if (window.localTextSync) {
    window.localTextSync();
  }
};

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  renderQuiz();
  DB.syncSidebar();
  if (window.localInit) {
    window.localInit();
  }
});


      const elementData = {
        'H': {
          title: { bn: 'হাইড্রোজেন (Hydrogen)', en: 'Hydrogen (H)' },
          desc: { bn: 'গ্রুপ ১, পর্যায় ১। সবচেয়ে হালকা গ্যাস। অত্যন্ত দাহ্য।', en: 'Group 1, Period 1. Lightest gas. Highly flammable.' }
        },
        'He': {
          title: { bn: 'হিলিয়াম (Helium)', en: 'Helium (He)' },
          desc: { bn: 'গ্রুপ ১৮, পর্যায় ১। নিষ্ক্রিয় নোবেল গ্যাস, হালকা এবং অ-দাহ্য।', en: 'Group 18, Period 1. Noble gas, light and non-flammable.' }
        },
        'Li': {
          title: { bn: 'লিথিয়াম (Lithium)', en: 'Lithium (Li)' },
          desc: { bn: 'গ্রুপ ১, পর্যায় ২। ক্ষার ধাতু, খুব নরম এবং সক্রিয়। পানিতে ভাসে।', en: 'Group 1, Period 2. Alkali metal, soft and highly reactive. Floats on water.' }
        },
        'C': {
          title: { bn: 'কার্বন (Carbon)', en: 'Carbon (C)' },
          desc: { bn: 'গ্রুপ ১৪, পর্যায় ২। অধাতু, সমস্ত জৈব যৌগের ভিত্তি।', en: 'Group 14, Period 2. Non-metal, backbone of organic chemistry.' }
        },
        'O': {
          title: { bn: 'অক্সিজেন (Oxygen)', en: 'Oxygen (O)' },
          desc: { bn: 'গ্রুপ ১৬, পর্যায় ২। অধাতু, প্রাণীর শ্বাসকার্য ও দহনে সাহায্যকারী গ্যাস।', en: 'Group 16, Period 2. Reactive non-metal, vital for respiration.' }
        },
        'Na': {
          title: { bn: 'সোডিয়াম (Sodium)', en: 'Sodium (Na)' },
          desc: { bn: 'গ্রুপ ১, পর্যায় ৩। অতি সক্রিয় ক্ষার ধাতু, পানির সাথে বিস্ফোরণ ঘটায়।', en: 'Group 1, Period 3. Highly reactive alkali metal, stored in kerosene.' }
        },
        'Cl': {
          title: { bn: 'ক্লোরিন (Chlorine)', en: 'Chlorine (Cl)' },
          desc: { bn: 'গ্রুপ ১৭, পর্যায় ৩। তীব্র গন্ধযুক্ত বিষাক্ত হ্যালোজেন গ্যাস।', en: 'Group 17, Period 3. Halogen gas, yellow-green and toxic.' }
        },
        'Fe': {
          title: { bn: 'লোহা (Iron)', en: 'Iron (Fe)' },
          desc: { bn: 'গ্রুপ ৮, পর্যায় ৪। অবস্থান্তর ধাতু, হিমোগ্লোবিন গঠনে ব্যবহৃত হয়।', en: 'Group 8, Period 4. Transition metal, vital part of hemoglobin.' }
        }
      };
      
      let clickedElements = new Set();

      window.selectElement = function(sym, el) {
        document.querySelectorAll('.c6-cell').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        clickedElements.add(sym);
        
        const details = document.getElementById('c6Details');
        const lang = currentLang;
        details.innerHTML = `
          <strong>${elementData[sym].title[lang]}</strong><br>
          ${elementData[sym].desc[lang]}
        `;
        
        AudioFX.playChime();
        
        if (clickedElements.size >= 5) {
          completeSimulation();
        }
      };
      
      window.triggerNaReaction = function() {
        const text = document.getElementById('reactionText');
        AudioFX.playBuzzer();
        text.innerHTML = currentLang === 'bn' ? '💥 সোডিয়াম পানিতে ফেলা হলো... ফিসফিসানি... বিস্ফোরণ!' : '💥 Sodium dropped in water... Fizzing... Boom!';
        text.style.color = '#e74c3c';
        
        setTimeout(() => {
          text.innerHTML = currentLang === 'bn' ? '🧪 তীব্র ক্ষার সোডিয়াম হাইড্রোক্সাইড (NaOH) তৈরি হয়েছে।' : '🧪 Strong alkaline NaOH solution formed.';
          text.style.color = '#2ecc71';
        }, 2200);
      };
      
      window.localInit = function() {
        const first = document.querySelector('.c6-cell');
        if (first) selectElement('H', first);
      };
      
      window.localTextSync = function() {
        const activeCell = document.querySelector('.c6-cell.active');
        if (activeCell) {
          const sym = activeCell.querySelector('.c6-sym').textContent;
          const details = document.getElementById('c6Details');
          details.innerHTML = `
            <strong>${elementData[sym].title[currentLang]}</strong><br>
            ${elementData[sym].desc[currentLang]}
          `;
        }
      };
    
