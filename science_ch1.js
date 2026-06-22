// ==========================================================================
// CHAPTER 01 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch1';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "বল স্থির রেখে ক্ষেত্রফল অর্ধেক করা হলে চাপ কেমন হবে?",
      "en": "If force is kept constant and area is halved, what happens to pressure?"
    },
    "options": {
      "bn": [
        "অর্ধেক হবে",
        "দ্বিগুণ হবে",
        "চারগুণ হবে",
        "অপরিবর্তিত থাকবে"
      ],
      "en": [
        "Halved",
        "Doubled",
        "Quadrupled",
        "Unchanged"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "যেহেতু P = F/A, ক্ষেত্রফল অর্ধেক হলে চাপ দ্বিগুণ হবে।",
      "en": "Since P = F/A, halving area doubles the pressure."
    }
  },
  {
    "question": {
      "bn": "চাপের আন্তর্জাতিক একক (SI Unit) কোনটি?",
      "en": "What is the SI unit of pressure?"
    },
    "options": {
      "bn": [
        "নিউটন (N)",
        "পাস্কাল (Pa)",
        "জুল (J)",
        "ওয়াট (W)"
      ],
      "en": [
        "Newton (N)",
        "Pascal (Pa)",
        "Joule (J)",
        "Watt (W)"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "পাস্কাল (Pa) হলো চাপের আন্তর্জাতিক একক যা N/m² এর সমান।",
      "en": "Pascal (Pa) is the SI unit of pressure, equivalent to N/m²."
    }
  },
  {
    "question": {
      "bn": "কোনটি কাঁধের বেল্ট চওড়া করার প্রধান কারণ?",
      "en": "Why are school backpack straps made wide?"
    },
    "options": {
      "bn": [
        "বল বাড়ানোর জন্য",
        "বেল্টের সৌন্দর্য বৃদ্ধির জন্য",
        "ক্ষেত্রফল বাড়িয়ে চাপ কমানোর জন্য",
        "বেল্ট শক্ত করার জন্য"
      ],
      "en": [
        "To increase force",
        "For fashion",
        "To decrease pressure by increasing area",
        "To make it stronger"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "বেল্ট চওড়া করলে ক্ষেত্রফল বাড়ে, ফলে কাঁধে প্রযুক্ত চাপ হ্রাস পায় ও আরামদায়ক হয়।",
      "en": "Wider straps increase contact area, reducing pressure on the shoulder for comfort."
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


      // Simulation Logic
      const forceInput = document.getElementById('c1Force');
      const areaInput = document.getElementById('c1Area');
      const piston = document.getElementById('c1Piston');
      const cushion = document.getElementById('c1Cushion');
      const valText = document.getElementById('c1Val');
      const bar = document.getElementById('c1Bar');

      function updateSim() {
        const force = parseFloat(forceInput.value);
        const area = parseFloat(areaInput.value);
        const pressure = force / area;
        
        document.getElementById('c1ForceVal').textContent = force + ' N';
        document.getElementById('c1AreaVal').textContent = area + ' m²';
        piston.textContent = 'F = ' + force + ' N';
        valText.textContent = pressure.toFixed(2) + ' Pa';
        
        // Piston position
        const topPos = 10 + (force / 100) * 35;
        piston.style.top = topPos + 'px';
        
        // Cushion compression
        const scalePct = 1 - (pressure / 50);
        cushion.style.height = Math.max(10, 45 * scalePct) + 'px';
        
        // Gauge bar filling
        const fillPct = Math.min(100, (pressure / 20) * 100);
        bar.style.width = fillPct + '%';
        
        if (pressure >= 15) {
          cushion.classList.add('cracked');
          bar.style.background = 'var(--chalk-coral)';
          completeSimulation(); // Earn XP
        } else {
          cushion.classList.remove('cracked');
          bar.style.background = 'var(--teal)';
        }
      }
      
      forceInput.addEventListener('input', updateSim);
      areaInput.addEventListener('input', updateSim);
      
      // Extra calculator update
      window.updateStrapCalc = function() {
        const width = parseFloat(document.getElementById('strapWidthSlider').value);
        document.getElementById('strapWidthVal').textContent = width + ' cm';
        const area = (width / 100) * 0.2; // 0.2m shoulder length
        const pressure = 50 / area;
        document.getElementById('strapPresVal').textContent = Math.round(pressure);
      };
      
      window.localInit = function() {
        updateSim();
        updateStrapCalc();
      };
      window.localTextSync = function() {
        updateSim();
        updateStrapCalc();
      };
    
