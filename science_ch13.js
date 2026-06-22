// ==========================================================================
// CHAPTER 13 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch13';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "গ্রহগুলোর সূর্যকে প্রদক্ষিণ করার কক্ষপথ কেমন হয়?",
      "en": "What is the shape of planetary orbits around the Sun according to Kepler's 1st Law?"
    },
    "options": {
      "bn": [
        "পূর্ণ বৃত্তাকার",
        "উপবৃত্তাকার (Elliptical)",
        "সরল রৈখিক",
        "কোনো নির্দিষ্ট নিয়ম নেই"
      ],
      "en": [
        "Circular",
        "Elliptical",
        "Linear",
        "Random"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "কেপলারের ১ম সূত্রানুযায়ী সব গ্রহ সূর্যের চারপাশে উপবৃত্তাকার কক্ষপথে ঘোরে।",
      "en": "Kepler's first law states that all planets orbit the Sun in elliptical paths."
    }
  },
  {
    "question": {
      "bn": "মহাবিশ্ব যে ক্রমাগত প্রসারিত হচ্ছে, এটি প্রথম কে প্রমাণ করেন?",
      "en": "Who first discovered and proved that the universe is expanding?"
    },
    "options": {
      "bn": [
        "আইজাক নিউটন",
        "গ্যালিলিও গ্যালিলি",
        "এডউইন হাবল",
        "স্টিফেন হকিং"
      ],
      "en": [
        "Isaac Newton",
        "Galileo Galilei",
        "Edwin Hubble",
        "Stephen Hawking"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "এডউইন হাবল ১৯২৯ সালে গ্যালাক্সিসমূহের লোহিত বিচ্যুতি (Redshift) লক্ষ্য করে প্রমাণ করেন মহাবিশ্ব প্রসারিত হচ্ছে।",
      "en": "Edwin Hubble proved cosmic expansion by observing the spectral redshift of distant galaxies."
    }
  },
  {
    "question": {
      "bn": "গ্রহের কক্ষপথীয় বেগ মুক্তিবেগের (Escape Velocity) চেয়ে বেশি হলে কী হবে?",
      "en": "What happens if a planet's velocity exceeds the escape velocity of its host star?"
    },
    "options": {
      "bn": [
        "সূর্যে পতিত হবে",
        "মহাশূন্যে কক্ষচ্যুত হবে",
        "গতি ধীর হবে",
        "গোলক আকারে ঘুরবে"
      ],
      "en": [
        "Falls into the sun",
        "Escapes into deep space",
        "Slowing down",
        "Orbits in circles"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "মুক্তিবেগ অতিক্রম করলে গ্রহটি নক্ষত্রের মহাকর্ষীয় আকর্ষণ মুক্ত হয়ে মহাশূন্যে ছুটে চলে যায়।",
      "en": "Exceeding escape velocity breaks gravitational bonds, causing the planet to escape."
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


      const vSlider = document.getElementById('c13V');
      const planet = document.getElementById('c13Planet');
      const statusText = document.getElementById('c13Status');
      
      let angle = 0;
      let orbitLoop = null;
      
      function renderOrbit() {
        const vel = parseFloat(vSlider.value);
        document.getElementById('c13VVal').textContent = vel;
        
        const centerX = 145;
        const centerY = 80;
        
        if (vel < 18) {
          statusText.innerHTML = '<span style="color:var(--chalk-coral);">💥 Crashed into Sun!</span>';
          planet.style.left = centerX + 'px';
          planet.style.top = centerY + 'px';
        } else if (vel > 48) {
          statusText.innerHTML = '<span style="color:var(--chalk-coral);">🛸 Escaped Orbit!</span>';
          planet.style.left = '-20px';
          planet.style.top = '-20px';
        } else {
          statusText.innerHTML = '<span style="color:#2ecc71;">✓ Stable Elliptical Orbit</span>';
          
          const rx = 60 + (vel - 30) * 1.5;
          const ry = 40 + (vel - 30) * 0.5;
          
          const x = centerX + Math.cos(angle) * rx;
          const y = centerY + Math.sin(angle) * ry;
          
          planet.style.left = x + 'px';
          planet.style.top = y + 'px';
          
          angle += (vel / 1000);
          
          completeSimulation();
        }
        
        orbitLoop = requestAnimationFrame(renderOrbit);
      }
      
      window.localInit = function() {
        if (!orbitLoop) renderOrbit();
      };
    
