// ==========================================================================
// CHAPTER 08 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch8';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "বংশগতির জনক কাকে বলা হয়?",
      "en": "Who is known as the Father of Genetics?"
    },
    "options": {
      "bn": [
        "চার্লস ডারউইন",
        "গ্রেগর জোহান মেন্ডেল",
        "জ্যাঁ ল্যামার্ক",
        "রবার্ট হুক"
      ],
      "en": [
        "Charles Darwin",
        "Gregor Mendel",
        "Jean Lamarck",
        "Robert Hooke"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "গ্রেগর জোহান মেন্ডেল মটরশুঁটি নিয়ে প্রজনন গবেষণা করে প্রথম বংশগতির সূত্র আবিষ্কার করেন।",
      "en": "Gregor Mendel discovered the laws of heredity through his hybridization work with peas."
    }
  },
  {
    "question": {
      "bn": "দুটি সংকর লম্বা গাছের (Tt) প্রজননে খাটো গাছ (tt) পাওয়ার সম্ভাবনা শতকরা কত?",
      "en": "In a cross between two heterozygous tall plants (Tt), what is the percentage probability of obtaining a short plant (tt)?"
    },
    "options": {
      "bn": [
        "০%",
        "২৫%",
        "৫০%",
        "৭৫%"
      ],
      "en": [
        "0%",
        "25%",
        "50%",
        "75%"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "পুনেট স্কয়ার অনুপাত অনুযায়ী চার ভাগের এক ভাগ অর্থাৎ ২৫% গাছ খাটো (tt) হবে।",
      "en": "According to the Punnett square ratios, 1 out of 4 (25%) offspring will inherit homozygous recessive (tt) genes."
    }
  },
  {
    "question": {
      "bn": "কোন প্রোটিনযুক্ত আণুবীক্ষণিক তন্তু ক্রোমোজোমে তথ্য বহন করে?",
      "en": "Which microscopic structural material in chromosomes carries genetic information?"
    },
    "options": {
      "bn": [
        "আরএনএ (RNA)",
        "ডিএনএ (DNA)",
        "লিপিড (Lipid)",
        "অ্যামাইলোপেকটিন"
      ],
      "en": [
        "RNA",
        "DNA",
        "Lipid",
        "Amylopectin"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "ডিঅক্সিরাইবোনিউক্লিক অ্যাসিড (DNA) হলো জীবের প্রধান বংশগতির বস্তু যা বংশানুক্রমিক বৈশিষ্ট্য বহন করে।",
      "en": "Deoxyribonucleic acid (DNA) is the primary genetic material carrying hereditary information."
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


      window.crossPeas = function() {
        const P1 = document.getElementById('c8P1').value;
        const P2 = document.getElementById('c8P2').value;
        
        const p1Alleles = [P1[0], P1[1]];
        const p2Alleles = [P2[0], P2[1]];
        
        const cells = [
          p1Alleles[0] + p2Alleles[0],
          p1Alleles[0] + p2Alleles[1],
          p1Alleles[1] + p2Alleles[0],
          p1Alleles[1] + p2Alleles[1]
        ];
        
        const sortedCells = cells.map(c => {
          if (c[0] === 't' && c[1] === 'T') return 'Tt';
          return c;
        });
        
        const grid = document.getElementById('c8Grid');
        grid.innerHTML = `
          <div class="c8-label">P1 \ P2</div>
          <div class="c8-label">${p2Alleles[0]}</div>
          <div class="c8-label">${p2Alleles[1]}</div>
          
          <div class="c8-label">${p1Alleles[0]}</div>
          <div class="c8-cell"><b>${sortedCells[0]}</b></div>
          <div class="c8-cell"><b>${sortedCells[1]}</b></div>
          
          <div class="c8-label">${p1Alleles[1]}</div>
          <div class="c8-cell"><b>${sortedCells[2]}</b></div>
          <div class="c8-cell"><b>${sortedCells[3]}</b></div>
        `;
        
        let tallCount = 0;
        let shortCount = 0;
        
        sortedCells.forEach(c => {
          if (c.includes('T')) tallCount++;
          else shortCount++;
        });
        
        const resultNode = document.getElementById('c8Result');
        const lang = currentLang;
        
        const tallWord = lang === 'bn' ? 'লম্বা' : 'Tall';
        const shortWord = lang === 'bn' ? 'খাটো' : 'Short';
        
        resultNode.textContent = (lang === 'bn' ? 'ফেনোটাইপ অনুপাত: ' : 'Phenotype Ratio: ') + `${tallCount} ${tallWord} : ${shortCount} ${shortWord}`;
        
        if (P1 === 'Tt' && P2 === 'Tt') {
          completeSimulation();
        }
      };
      
      window.localInit = function() {
        crossPeas();
      };
      window.localTextSync = function() {
        crossPeas();
      };
    
