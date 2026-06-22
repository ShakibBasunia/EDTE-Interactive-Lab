// ==========================================================================
// CHAPTER 12 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch12';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "খাদ্য শৃঙ্খলের কোন স্তরে শক্তির পরিমাণ সবচেয়ে বেশি থাকে?",
      "en": "Which trophic level in a food chain contains the maximum amount of energy?"
    },
    "options": {
      "bn": [
        "উৎপাদক (Producers)",
        "তৃণভোজী খাদক",
        "মাংসাশী খাদক",
        "সর্বোচ্চ খাদক"
      ],
      "en": [
        "Producers",
        "Primary Consumers",
        "Secondary Consumers",
        "Decomposers"
      ]
    },
    "answer": 0,
    "explain": {
      "bn": "উৎপাদক তথা সবুজ উদ্ভিদ সৌরশক্তিকে প্রথম খাদ্যে পরিণত করে, তাই এখানে শক্তির সঞ্চয় সর্বাধিক।",
      "en": "Producers (plants) capture sunlight directly, holding 100% of base chemical energy."
    }
  },
  {
    "question": {
      "bn": "বাস্তুতন্ত্রের ট্রফিক স্তরে এক ধাপ থেকে পরবর্তী ধাপে কত শতাংশ শক্তি স্থানান্তরিত হয়?",
      "en": "What percentage of energy is transferred from one trophic level to the next?"
    },
    "options": {
      "bn": [
        "১০০%",
        "৯০%",
        "৫০%",
        "১০%"
      ],
      "en": [
        "100%",
        "90%",
        "50%",
        "10%"
      ]
    },
    "answer": 3,
    "explain": {
      "bn": "লিন্ডেম্যানের ১০% সূত্রানুযায়ী প্রতিটি স্তরে আগের স্তরের মাত্র ১০% শক্তি স্থানান্তরিত হয়।",
      "en": "According to Lindeman's 10% rule, only one-tenth of energy reaches the next level."
    }
  },
  {
    "question": {
      "bn": "বাস্তুতন্ত্রের সব মৃত উপাদান পচিয়ে মাটিতে ফেরাতে কাজ করে কোনটি?",
      "en": "Which organisms decay organic matter to recycle nutrients into soil?"
    },
    "options": {
      "bn": [
        "উৎপাদক",
        "তৃণভোজী",
        "বিয়োজক (Decomposers)",
        "পরজীবী"
      ],
      "en": [
        "Producers",
        "Herbivores",
        "Decomposers",
        "Parasites"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "ব্যাকটেরিয়া ও ছত্রাকের মতো বিয়োজকসমূহ মৃত জৈব পদার্থ পচিয়ে অজৈব পুষ্টি মাটিতে ফিরিয়ে দেয়।",
      "en": "Decomposers (bacteria and fungi) break down dead matter, returning inorganic nutrients to soil."
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


      let expectedIndex = 1;
      
      window.clickNode = function(index) {
        if (index === expectedIndex) {
          document.getElementById('n' + index).classList.add('active');
          AudioFX.playChime();
          
          if (index > 1) {
            document.getElementById('c' + (index - 1)).classList.add('active');
          }
          
          expectedIndex++;
          
          if (expectedIndex === 5) {
            const status = document.getElementById('c12Status');
            status.innerHTML = '<span style="color:#2ecc71; font-weight:bold;">✓ চেইন সম্পূর্ণ! শক্তি প্রবাহিত হয়েছে।</span>';
            completeSimulation();
          }
        } else {
          AudioFX.playBuzzer();
          resetChain();
        }
      };
      
      function resetChain() {
        expectedIndex = 1;
        document.querySelectorAll('.c12-node').forEach(n => n.classList.remove('active'));
        document.querySelectorAll('.c12-connector').forEach(c => c.classList.remove('active'));
        document.getElementById('c12Status').innerHTML = `
          <span class="bn">অসম্পূর্ণ চেইন (Chain Incomplete)</span>
          <span class="en">Chain Incomplete</span>
        `;
      }
      
      window.sprayToxin = function() {
        const res = document.getElementById('toxinResult');
        res.innerHTML = `
          🌾 Grass: 0.1 ppm<br>
          🐛 Insect: 1.0 ppm<br>
          🐸 Frog: 10.0 ppm<br>
          🐍 Snake: <b>100.0 ppm (Extreme Toxicity!)</b>
        `;
      };
      
      window.localInit = function() {
        resetChain();
      };
    
