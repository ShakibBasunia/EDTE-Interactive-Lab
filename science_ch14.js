// ==========================================================================
// CHAPTER 14 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch14';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "কোন উপাদানটি ভূমিক্ষয় প্রতিরোধে সবচেয়ে কার্যকর ভূমিকা পালন করে?",
      "en": "Which factor plays the most effective role in preventing soil erosion?"
    },
    "options": {
      "bn": [
        "বাঁধ তৈরি",
        "বনায়ন (Afforestation)",
        "কীটনাশক ব্যবহার",
        "খনন কার্য"
      ],
      "en": [
        "Building dams",
        "Afforestation",
        "Pesticide usage",
        "Mining"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "উদ্ভিদের শিকড় মাটির কণাগুলোকে আঁকড়ে ধরে রাখে এবং বৃষ্টির সরাসরি আঘাত থেকে রক্ষা করে, যা বনায়ন নামে পরিচিত।",
      "en": "Afforestation stabilizes soil through root nets and mitigates rainfall impact."
    }
  },
  {
    "question": {
      "bn": "নদী ভাঙন এবং পাহাড় ধসের অন্যতম প্রধান মানবসৃষ্ট কারণ কোনটি?",
      "en": "What is a major human-induced cause of landslides and riverbank erosion?"
    },
    "options": {
      "bn": [
        "অতিরিক্ত বৃষ্টিপাত",
        "নিয়ন্ত্রিত চাষাবাদ",
        "বৃক্ষ নিধন (Deforestation)",
        "নদীর গতিপথ পরিবর্তন"
      ],
      "en": [
        "Excess rainfall",
        "Controlled farming",
        "Deforestation",
        "River dynamic shifts"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "বৃক্ষ নিধনের ফলে মাটির বাঁধন আলগা হয়ে যায়, যার ফলে বৃষ্টির টানে ধস ও ভাঙন বৃদ্ধি পায়।",
      "en": "Deforestation strips the soil of roots, accelerating rain-induced runoff and landslides."
    }
  },
  {
    "question": {
      "bn": "কোনটি একটি রূপান্তরিত শিলার (Metamorphic Rock) উদাহরণ?",
      "en": "Which of the following is an example of a Metamorphic Rock?"
    },
    "options": {
      "bn": [
        "বেলেপাথর (Sandstone)",
        "গ্রানাইট (Granite)",
        "মার্বেল (Marble)",
        "কয়লা (Coal)"
      ],
      "en": [
        "Sandstone",
        "Granite",
        "Marble",
        "Coal"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "চুনাপাথর প্রচণ্ড তাপ ও চাপে রূপান্তরিত হয়ে মার্বেল পাথরে পরিণত হয়।",
      "en": "Limestone undergoes thermal and baric changes to recrystallize into Marble."
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


      const rainBtn = document.getElementById('c14RainBtn');
      const soilL = document.getElementById('c14SoilL');
      const soilR = document.getElementById('c14SoilR');
      
      const soilLText = document.getElementById('soilLText');
      const soilRText = document.getElementById('soilRText');
      
      let rainInterval = null;
      
      rainBtn.addEventListener('click', () => {
        if (rainInterval) clearInterval(rainInterval);
        
        let soilLVol = 100;
        let soilRVol = 100;
        
        AudioFX.playChime();
        rainBtn.setAttribute('disabled', 'true');
        
        rainInterval = setInterval(() => {
          soilLVol -= Math.random() * 0.5;
          soilRVol -= Math.random() * 4.0;
          
          soilLVol = Math.max(90, soilLVol);
          soilRVol = Math.max(0, soilRVol);
          
          soilL.style.height = (soilLVol * 0.5) + 'px';
          soilR.style.height = (soilRVol * 0.5) + 'px';
          
          soilLText.textContent = Math.round(soilLVol) + '%';
          soilRText.textContent = Math.round(soilRVol) + '%';
          
          if (soilRVol === 0) {
            clearInterval(rainInterval);
            rainBtn.removeAttribute('disabled');
            completeSimulation();
          }
        }, 100);
      });
      
      window.transformRock = function(act) {
        const res = document.getElementById('rockResult');
        if (act === 'magma') {
          res.innerHTML = currentLang === 'bn' ? '✓ গলিত ম্যাগমা ঠাণ্ডা হয়ে <b>আগ্নেয় শিলা (Igneous Rock - Granite)</b> তৈরি করল।' : '✓ Molten magma cooled to form <b>Igneous Rock (Granite)</b>.';
        } else {
          res.innerHTML = currentLang === 'bn' ? '✓ তাপ ও চাপে পাললিক শিলা রূপান্তরিত হয়ে <b>মার্বেল পাথরে (Metamorphic Marble)</b> পরিণত হলো।' : '✓ Intense heat and pressure converted limestone into <b>Metamorphic Marble</b>.';
        }
      };
    
