// ==========================================================================
// CHAPTER 05 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch5';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "কোনো পরমাণুর ২য় কক্ষপথে সর্বোচ্চ কয়টি ইলেকট্রন থাকতে পারে?",
      "en": "What is the maximum number of electrons that can be held in the second shell of an atom?"
    },
    "options": {
      "bn": [
        "২টি",
        "৮টি",
        "১৮টি",
        "৩২টি"
      ],
      "en": [
        "2",
        "8",
        "18",
        "32"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "২n² সূত্র অনুযায়ী ২য় শেলের (n=2) জন্য ইলেকট্রন সংখ্যা হলো ২*(২)² = ৮টি।",
      "en": "By $2n^2$ formula, the second shell ($n=2$) holds max $2*(2)^2 = 8$ electrons."
    }
  },
  {
    "question": {
      "bn": "পরমাণুর নিউক্লিয়াসে কোন কোন কণা থাকে?",
      "en": "Which subatomic particles reside in the nucleus of an atom?"
    },
    "options": {
      "bn": [
        "ইলেকট্রন ও প্রোটন",
        "প্রোটন ও নিউট্রন",
        "ইলেকট্রন ও নিউট্রন",
        "শুধু প্রোটন"
      ],
      "en": [
        "Electrons & Protons",
        "Protons & Neutrons",
        "Electrons & Neutrons",
        "Protons only"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "পরমাণুর কেন্দ্রে নিউক্লিয়াসে ধনাত্মক প্রোটন ও চার্জহীন নিউট্রন থাকে; ইলেকট্রন বাইরে ঘোরে।",
      "en": "Positive protons and neutral neutrons form the nucleus; negative electrons orbit outside."
    }
  },
  {
    "question": {
      "bn": "প্রোটনের চেয়ে ইলেকট্রন একটি বেশি হলে পরমাণুটির আধান কেমন হবে?",
      "en": "If an atom has one more electron than protons, what is its net charge?"
    },
    "options": {
      "bn": [
        "ধনাত্মক (+1)",
        "নিরপেক্ষ (0)",
        "ঋণাত্মক (-1)",
        "ধনাত্মক (+2)"
      ],
      "en": [
        "Positive (+1)",
        "Neutral (0)",
        "Negative (-1)",
        "Positive (+2)"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "ঋণাত্মক চার্জযুক্ত ইলেকট্রন বেশি হলে পরমাণুটি ঋণাত্মক আধান বা অ্যানায়নে (-১) পরিণত হয়।",
      "en": "Excess negative electrons create a negatively charged ion (anion with -1 charge)."
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


      const pSlider = document.getElementById('c5P');
      const eSlider = document.getElementById('c5E');
      const nuc = document.getElementById('c5Nuc');
      const elementText = document.getElementById('c5ElementName');
      const chargeText = document.getElementById('c5ChargeText');
      const c5Chamber = document.getElementById('c5Chamber');
      
      const elementNames = {
        1: { name: {bn:'হাইড্রোজেন (H)', en:'Hydrogen (H)'}, symbol:'H' },
        2: { name: {bn:'হিলিয়াম (He)', en:'Helium (He)'}, symbol:'He' },
        3: { name: {bn:'লিথিয়াম (Li)', en:'Lithium (Li)'}, symbol:'Li' },
        4: { name: {bn:'বেরিলিয়াম (Be)', en:'Beryllium (Be)'}, symbol:'Be' },
        5: { name: {bn:'বোরন (B)', en:'Boron (B)'}, symbol:'B' },
        6: { name: {bn:'কার্বন (C)', en:'Carbon (C)'}, symbol:'C' }
      };
      
      let eElements = [];
      let orbitAngle = 0;
      let orbitInterval = null;
      
      function buildAtom() {
        const protons = parseInt(pSlider.value);
        const electrons = parseInt(eSlider.value);
        
        document.getElementById('c5PVal').textContent = protons;
        document.getElementById('c5EVal').textContent = electrons;
        
        nuc.textContent = protons + 'p';
        
        const el = elementNames[protons];
        elementText.textContent = currentLang === 'bn' ? el.name.bn : el.name.en;
        
        const charge = protons - electrons;
        if (charge === 0) {
          chargeText.textContent = currentLang === 'bn' ? 'নিরপেক্ষ (0)' : 'Neutral (0)';
          chargeText.style.color = '#fff';
        } else if (charge > 0) {
          chargeText.textContent = '+' + charge;
          chargeText.style.color = 'var(--chalk-yellow)';
        } else {
          chargeText.textContent = charge;
          chargeText.style.color = 'var(--chalk-coral)';
        }
        
        eElements.forEach(el => el.remove());
        eElements = [];
        
        for (let i = 0; i < electrons; i++) {
          const div = document.createElement('div');
          div.className = 'c5-electron';
          c5Chamber.appendChild(div);
          eElements.push(div);
        }
        
        if (protons === 6 && electrons === 6) {
          completeSimulation();
        }
        
        positionElectrons();
      }
      
      function positionElectrons() {
        const electrons = eElements.length;
        const center = 80;
        const centerX = 145;
        
        for (let i = 0; i < electrons; i++) {
          let radius = 35;
          let angle = orbitAngle + (i * Math.PI * 2 / Math.min(2, electrons));
          
          if (i >= 2) {
            radius = 60;
            angle = -orbitAngle + ((i - 2) * Math.PI * 2 / (electrons - 2));
          }
          
          const x = centerX + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          
          eElements[i].style.left = x + 'px';
          eElements[i].style.top = y + 'px';
        }
      }
      
      pSlider.addEventListener('input', buildAtom);
      eSlider.addEventListener('input', buildAtom);
      
      window.localInit = function() {
        buildAtom();
        if (orbitInterval) clearInterval(orbitInterval);
        orbitInterval = setInterval(() => {
          orbitAngle += 0.04;
          positionElectrons();
        }, 30);
      };
      
      window.localTextSync = function() {
        buildAtom();
      };
    
