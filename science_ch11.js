// ==========================================================================
// CHAPTER 11 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch11';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "সুস্থ প্রাপ্তবয়স্ক মানুষের স্বাভাবিক রক্তচাপ কত?",
      "en": "What is the normal blood pressure of a healthy adult?"
    },
    "options": {
      "bn": [
        "৮০/১২০ mmHg",
        "১২০/৮০ mmHg",
        "১০০/১৫০ mmHg",
        "১৪০/৯০ mmHg"
      ],
      "en": [
        "80/120 mmHg",
        "120/80 mmHg",
        "100/150 mmHg",
        "140/90 mmHg"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "স্বাভাবিক সিস্টোলিক রক্তচাপ ১২০ এবং ডায়াস্টোলিক রক্তচাপ ৮০ mmHg।",
      "en": "Normal systolic pressure is 120 mmHg and diastolic pressure is 80 mmHg."
    }
  },
  {
    "question": {
      "bn": "হৃদপিণ্ডের স্বতঃস্ফূর্ত সংকোচনকে কী বলা হয়?",
      "en": "What is the active contraction phase of the cardiac cycle called?"
    },
    "options": {
      "bn": [
        "ডায়াস্টোল",
        "সিস্টোল",
        "পালস",
        "ব্যারোরেসেপ্টর"
      ],
      "en": [
        "Diastole",
        "Systole",
        "Pulse",
        "Baroreceptor"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "হৃদপিণ্ডের পাম্প করার জন্য প্রকোষ্ঠের সংকোচন কালকে সিস্টোল বলে।",
      "en": "Systole is the phase of cardiac contraction that drives blood flow."
    }
  },
  {
    "question": {
      "bn": "হৃদপিণ্ড প্রধানত কয়টি প্রকোষ্ঠে বিভক্ত থাকে?",
      "en": "How many chambers does the human heart have?"
    },
    "options": {
      "bn": [
        "২টি",
        "৩টি",
        "৪টি",
        "৫টি"
      ],
      "en": [
        "2",
        "3",
        "4",
        "5"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "মানুষের হৃদপিণ্ডে দুটি অলিন্দ (Atria) and দুটি নিলয় (Ventricles) মিলিয়ে মোট ৪টি প্রকোষ্ঠ রয়েছে।",
      "en": "The human heart consists of 4 chambers: two upper atria and two lower ventricles."
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


      const pad = document.getElementById('c11Pad');
      const heart = document.getElementById('c11Heart');
      const bpmText = document.getElementById('c11BPM');
      const statusText = document.getElementById('c11Status');
      
      let tapTimes = [];
      
      pad.addEventListener('click', () => {
        const now = Date.now();
        tapTimes.push(now);
        
        heart.classList.add('pulse');
        setTimeout(() => heart.classList.remove('pulse'), 100);
        
        AudioFX.playChime();
        
        if (tapTimes.length > 5) tapTimes.shift();
        
        if (tapTimes.length > 1) {
          let sumDiffs = 0;
          for (let i = 1; i < tapTimes.length; i++) {
            sumDiffs += (tapTimes[i] - tapTimes[i-1]);
          }
          const avgInterval = sumDiffs / (tapTimes.length - 1);
          const bpm = Math.round(60000 / avgInterval);
          
          bpmText.textContent = bpm;
          
          if (bpm >= 60 && bpm <= 100) {
            statusText.textContent = 'Status: Normal Resting Pulse';
            statusText.style.color = '#2ecc71';
            completeSimulation();
          } else if (bpm > 100) {
            statusText.textContent = 'Status: High Pulse / Active Exercise';
            statusText.style.color = 'var(--chalk-yellow)';
          } else {
            statusText.textContent = 'Status: Low Pulse Rate';
            statusText.style.color = 'var(--chalk-coral)';
          }
        }
      });
      
      window.pumpBP = function() {
        const res = document.getElementById('bpResult');
        const sys = 115 + Math.round(Math.random() * 30);
        const dia = 75 + Math.round(Math.random() * 15);
        
        let cond = '';
        if (sys < 120 && dia < 80) cond = 'Normal (স্বাভাবিক)';
        else if (sys >= 130 || dia >= 85) cond = 'Prehypertension (উচ্চ রক্তচাপ ঝুঁকি)';
        else cond = 'Elevated (উচ্চ)';
        
        res.innerHTML = `Reading: <b>${sys}/${dia} mmHg</b><br><span style="font-size:0.75rem;">Condition: ${cond}</span>`;
      };
    
