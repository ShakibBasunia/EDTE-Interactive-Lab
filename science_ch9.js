// ==========================================================================
// CHAPTER 09 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch9';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "স্টার্চের (শ্বেতসার) সাথে আয়োডিন দ্রবণ যোগ করলে কী রঙ ধারণ করে?",
      "en": "What color change is observed when iodine solution is added to starch?"
    },
    "options": {
      "bn": [
        "লাল",
        "হলুদ",
        "নীল-কালো (Blue-Black)",
        "সবুজ"
      ],
      "en": [
        "Red",
        "Yellow",
        "Blue-Black",
        "Green"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "স্টার্চের অণুর সাথে বিক্রিয়া করে আয়োডিন একটি গাঢ় নীল-কালো জটিল যৌগ তৈরি করে।",
      "en": "Iodine reacts with starch helical coils to create a dark blue-black complex."
    }
  },
  {
    "question": {
      "bn": "আমিষ বা প্রোটিন গঠনের একক কোনটি?",
      "en": "What is the monomer/building block of proteins?"
    },
    "options": {
      "bn": [
        "গ্লুকোজ",
        "অ্যামিনো অ্যাসিড",
        "ফ্যাটি অ্যাসিড",
        "গ্লিসারল"
      ],
      "en": [
        "Glucose",
        "Amino Acid",
        "Fatty Acid",
        "Glycerol"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "অ্যামিনো অ্যাসিড হলো প্রোটিনের গাঠনিক একক যা পেপটাইড বন্ধন দিয়ে যুক্ত থাকে।",
      "en": "Amino acids are the building blocks of proteins, linked by peptide bonds."
    }
  },
  {
    "question": {
      "bn": "নিচের কোনটি গ্রাম প্রতি সবচেয়ে বেশি শক্তি দেয়?",
      "en": "Which of the following biomolecules yields the highest energy per gram?"
    },
    "options": {
      "bn": [
        "শর্করা (Carbs)",
        "আমিষ (Protein)",
        "স্নেহ (Lipid)",
        "ভিটামিন (Vitamin)"
      ],
      "en": [
        "Carbohydrate",
        "Protein",
        "Lipid",
        "Vitamin"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "লিপিড বা স্নেহ জাতীয় খাদ্য সবচেয়ে বেশি অর্থাত ৯ কিলোক্যালরি/গ্রাম তাপশক্তি উৎপন্ন করে।",
      "en": "Lipids yield 9 kcal/g, more than twice that of carbohydrates or proteins (4 kcal/g)."
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


      const chips = document.querySelectorAll('.c9-chip');
      const slots = document.querySelectorAll('.c9-slot');
      const itemsContainer = document.getElementById('c9Items');
      const resetBtn = document.getElementById('c9ResetBtn');
      
      let draggedChip = null;
      
      chips.forEach(chip => {
        chip.addEventListener('dragstart', (e) => {
          draggedChip = chip;
        });
      });
      
      slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
          e.preventDefault();
        });
        slot.addEventListener('drop', (e) => {
          e.preventDefault();
          if (!draggedChip) return;
          
          const slotCat = slot.getAttribute('data-cat');
          const chipCat = draggedChip.getAttribute('data-cat');
          
          if (slotCat === chipCat) {
            slot.querySelector('.c9-slot-chips').appendChild(draggedChip);
            AudioFX.playChime();
            checkCompletion();
          } else {
            AudioFX.playBuzzer();
          }
          draggedChip = null;
        });
      });
      
      function checkCompletion() {
        if (itemsContainer.children.length === 0) {
          completeSimulation();
        }
      }
      
      resetBtn.addEventListener('click', () => {
        chips.forEach(c => itemsContainer.appendChild(c));
        AudioFX.playChime();
      });
      
      window.calcCalories = function() {
        const carbs = parseFloat(document.getElementById('carbInput').value) || 0;
        const prot = parseFloat(document.getElementById('protInput').value) || 0;
        const lipid = parseFloat(document.getElementById('lipidInput').value) || 0;
        
        const total = (carbs * 4) + (prot * 4) + (lipid * 9);
        document.getElementById('kcalResult').textContent = total;
      };
      
      window.localInit = function() {
        calcCalories();
      };
    
