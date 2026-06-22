// ==========================================================================
// CHAPTER 03 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch3';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "আলোক ফোটন ধাতুর কার্যপেক্ষকের চেয়ে কম শক্তির হলে কী ঘটবে?",
      "en": "What happens if a photon's energy is less than the metal's work function?"
    },
    "options": {
      "bn": [
        "ইলেকট্রন কম গতিতে নির্গত হবে",
        "কোনো ইলেকট্রন নির্গত হবে না",
        "ইলেকট্রন বেশি গতিতে নির্গত হবে",
        "ধাতু গলে যাবে"
      ],
      "en": [
        "Electrons emit slower",
        "No electrons emit",
        "Electrons emit faster",
        "The metal melts"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "আপতিত ফোটনের শক্তি কার্যপেক্ষকের সমান বা বেশি না হলে কোনো ফোটোতড়িৎ প্রবাহ ঘটে না।",
      "en": "No emission occurs unless photon energy equals or exceeds the work function."
    }
  },
  {
    "question": {
      "bn": "তরঙ্গদৈর্ঘ্য কমলে ফোটনের শক্তি কেমন হয়?",
      "en": "As light wavelength decreases, what happens to photon energy?"
    },
    "options": {
      "bn": [
        "কমে",
        "একই থাকে",
        "বৃদ্ধি পায়",
        "শূন্য হয়"
      ],
      "en": [
        "Decreases",
        "Stays same",
        "Increases",
        "Becomes zero"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "তরঙ্গদৈর্ঘ্যের সাথে ফোটন শক্তি ব্যস্তানুপাতিক (E = hc/λ)। অর্থাৎ, তরঙ্গদৈর্ঘ্য কমলে শক্তি বৃদ্ধি পায়।",
      "en": "Energy is inversely proportional to wavelength ($E = hc/\\lambda$). Shorter wavelength means higher energy."
    }
  },
  {
    "question": {
      "bn": "ফোটোতড়িৎ ক্রিয়ার সফল ব্যাখ্যা কে দিয়েছেন?",
      "en": "Who provided the mathematical explanation of the photoelectric effect?"
    },
    "options": {
      "bn": [
        "আইজাক নিউটন",
        "আলবার্ট আইনস্টাইন",
        "নীলস বোর",
        "জন ডাল্টন"
      ],
      "en": [
        "Isaac Newton",
        "Albert Einstein",
        "Niels Bohr",
        "John Dalton"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "আলবার্ট আইনস্টাইন ১৯০৫ সালে কোয়ান্টাম তত্ত্ব দ্বারা ফোটোতড়িৎ ব্যাখ্যা দিয়ে নোবেল পুরস্কার পান।",
      "en": "Albert Einstein explained it using quantum concepts, earning a Nobel Prize."
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


      const waveSlider = document.getElementById('c3Wave');
      const c3Ray = document.getElementById('c3Ray');
      const c3Current = document.getElementById('c3Current');
      const c3Energy = document.getElementById('c3Energy');
      const c3Chamber = document.getElementById('c3Chamber');
      
      const electrons = [];
      const thresholdWave = 539; // green
      
      function waveToColor(wave) {
        if (wave < 420) return 'rgba(128, 0, 128, 0.4)'; // UV/Violet
        if (wave < 490) return 'rgba(0, 0, 255, 0.4)';   // Blue
        if (wave < 570) return 'rgba(0, 255, 0, 0.4)';   // Green
        if (wave < 590) return 'rgba(255, 255, 0, 0.4)'; // Yellow
        if (wave < 640) return 'rgba(255, 165, 0, 0.4)'; // Orange
        return 'rgba(255, 0, 0, 0.4)';                   // Red
      }
      
      let loopId = null;
      function renderLoop() {
        const wave = parseFloat(waveSlider.value);
        const energy = 1240 / wave; // eV approximation
        
        c3Energy.textContent = energy.toFixed(2) + ' eV';
        c3Ray.style.background = `linear-gradient(${waveToColor(wave)}, transparent)`;
        
        // Check emission
        if (wave < thresholdWave) {
          c3Current.textContent = ((thresholdWave - wave) * 0.15).toFixed(1) + ' mA';
          
          // Create electrons
          if (Math.random() < 0.15 && electrons.length < 12) {
            const el = document.createElement('div');
            el.className = 'c3-electron';
            c3Chamber.appendChild(el);
            electrons.push({
              el: el,
              x: 140 + (Math.random() - 0.5) * 50,
              y: 110,
              speed: 1.5 + (thresholdWave - wave) * 0.015
            });
          }
          if (wave <= 400) {
            completeSimulation(); // Earn XP for pushing limit
          }
        } else {
          c3Current.textContent = '0.0 mA';
        }
        
        // Move electrons
        for (let i = electrons.length - 1; i >= 0; i--) {
          const e = electrons[i];
          e.y -= e.speed;
          
          if (e.y < 15) {
            e.el.remove();
            electrons.splice(i, 1);
          } else {
            e.el.style.left = e.x + 'px';
            e.el.style.top = e.y + 'px';
          }
        }
        
        loopId = requestAnimationFrame(renderLoop);
      }
      
      function updateWaveText() {
        const val = waveSlider.value;
        document.getElementById('c3WavelengthText').textContent = val + ' nm';
      }
      
      waveSlider.addEventListener('input', () => {
        updateWaveText();
      });
      
      window.updateMetalCalc = function() {
        const work = parseFloat(document.getElementById('metalSelect').value);
        const threshold = 1240 / work;
        document.getElementById('metalCalcResult').innerHTML = `
          <span class="bn">নূন্যতম তরঙ্গদৈর্ঘ্য: <b>${threshold.toFixed(0)} nm</b></span>
          <span class="en">Threshold Wavelength: <b>${threshold.toFixed(0)} nm</b></span>
        `;
      };
      
      window.localInit = function() {
        updateWaveText();
        updateMetalCalc();
        if (!loopId) renderLoop();
      };
      window.localTextSync = function() {
        updateWaveText();
        updateMetalCalc();
      };
    
