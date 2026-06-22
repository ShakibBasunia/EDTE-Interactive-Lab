// ==========================================================================
// CHAPTER 10 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch10';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "সালোকসংশ্লেষণের আলোক বিক্রিয়ায় কোন নিষ্কাশনটি উপজাত (Byproduct) হিসেবে নির্গত হয়?",
      "en": "Which substance is released as a byproduct during the light reactions of photosynthesis?"
    },
    "options": {
      "bn": [
        "কার্বন ডাই অক্সাইড",
        "গ্লুকোজ",
        "অক্সিজেন",
        "পানি"
      ],
      "en": [
        "Carbon dioxide",
        "Glucose",
        "Oxygen",
        "Water"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "পানির আলোক বিভাজনের (Photolysis) ফলে উপজাত হিসেবে অক্সিজেন গ্যাস বাতাসে নির্গত হয়।",
      "en": "Photolysis of water releases oxygen gas as a byproduct into the atmosphere."
    }
  },
  {
    "question": {
      "bn": "সবুজ আলোতে সালোকসংশ্লেষণের হার কেমন হয়?",
      "en": "What is the rate of photosynthesis under green light?"
    },
    "options": {
      "bn": [
        "সবচেয়ে বেশি হয়",
        "খুবই কম বা শূন্য হয়",
        "অপরিবর্তিত থাকে",
        "মাঝারি নামের হয়"
      ],
      "en": [
        "Maximum",
        "Very low or zero",
        "Unchanged",
        "Medium"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "পাতার ক্লোরোফিল সবুজ আলো শোষণ না করে প্রতিফলিত করে দেয়, তাই সবুজ আলোতে সালোকসংশ্লেষণ প্রায় হয় না।",
      "en": "Leaves reflect green wavelengths, preventing energy absorption and resulting in negligible photosynthesis."
    }
  },
  {
    "question": {
      "bn": "সালোকসংশ্লেষণে সৌরশক্তি কোন শক্তিতে রূপান্তরিত হয়?",
      "en": "Into which energy form is solar energy converted during photosynthesis?"
    },
    "options": {
      "bn": [
        "যান্ত্রিক শক্তি",
        "রাসায়নিক শক্তি",
        "তাপ শক্তি",
        "বৈদ্যুতিক শক্তি"
      ],
      "en": [
        "Mechanical energy",
        "Chemical energy",
        "Thermal energy",
        "Electrical energy"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "উদ্ভিদ সৌরশক্তিকে গ্লুকোজ অণুর মধ্যকার রাসায়নিক বন্ধন শক্তি বা রাসায়নিক শক্তিতে রূপান্তর করে।",
      "en": "Solar energy is trapped and stored as chemical energy within glucose molecules."
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


      const lightInput = document.getElementById('c10Light');
      const co2Input = document.getElementById('c10CO2');
      const leaf = document.getElementById('c10Leaf');
      
      const molecules = [];
      const numMols = 12;
      
      for (let i = 0; i < numMols; i++) {
        const type = i % 2 === 0 ? 'co2' : 'h2o';
        const div = document.createElement('div');
        div.className = 'c10-molecule ' + type;
        div.textContent = type === 'co2' ? 'CO₂' : 'H₂O';
        leaf.appendChild(div);
        
        molecules.push({
          el: div,
          type: type,
          x: Math.random() * 260 + 10,
          y: Math.random() * 80 + 10,
          dx: (Math.random() - 0.5) * 2,
          dy: (Math.random() - 0.5) * 2
        });
      }
      
      let loopId = null;
      function animateLeaf() {
        const light = parseFloat(lightInput.value);
        const co2 = parseFloat(co2Input.value);
        
        const speed = (light * co2) / 2500;
        
        molecules.forEach(m => {
          m.x += m.dx * speed;
          m.y += m.dy * speed;
          
          if (m.x < 10 || m.x > 260) m.dx *= -1;
          if (m.y < 10 || m.y > 90) m.dy *= -1;
          
          m.el.style.left = m.x + 'px';
          m.el.style.top = m.y + 'px';
        });
        
        if (light >= 90 && co2 >= 90) {
          completeSimulation();
        }
        
        loopId = requestAnimationFrame(animateLeaf);
      }
      
      function updateSliders() {
        document.getElementById('c10LVal').textContent = lightInput.value + '%';
        document.getElementById('c10CO2Val').textContent = co2Input.value + '%';
      }
      
      lightInput.addEventListener('input', () => { updateSliders(); });
      co2Input.addEventListener('input', () => { updateSliders(); });
      
      window.setSpectrum = function(color) {
        const res = document.getElementById('spectrumResult');
        if (color === 'red' || color === 'blue') {
          res.innerHTML = currentLang === 'bn' ? '✓ লাল/নীল আলোতে ফোটন শোষণ সর্বোচ্চ (সালোকসংশ্লেষণ দ্রুত)।' : '✓ High photon absorption under Red/Blue light (Fast photosynthesis).';
          res.style.color = '#2ecc71';
        } else {
          res.innerHTML = currentLang === 'bn' ? '❌ সবুজ আলো প্রতিফলিত হয় (সালোকসংশ্লেষণ প্রায় বন্ধ)।' : '❌ Green light is reflected (No photosynthesis occurs).';
          res.style.color = '#e74c3c';
        }
      };
      
      window.localInit = function() {
        updateSliders();
        if (!loopId) animateLeaf();
      };
    
