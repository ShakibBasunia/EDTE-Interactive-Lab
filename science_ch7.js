// ==========================================================================
// CHAPTER 07 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch7';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "আয়নিক বন্ধন কাদের মধ্যে গঠিত হয়?",
      "en": "Between what types of elements does ionic bonding typically occur?"
    },
    "options": {
      "bn": [
        "দুটি ধাতব পরমাণুর মধ্যে",
        "ধাতু ও অধাতব পরমাণুর মধ্যে",
        "দুটি অধাতব পরমাণুর মধ্যে",
        "নিষ্ক্রিয় গ্যাস সমূহের মধ্যে"
      ],
      "en": [
        "Between two metal atoms",
        "Between a metal and a non-metal",
        "Between two non-metals",
        "Between noble gases"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "ধাতু ইলেকট্রন বর্জন করে এবং অধাতু তা গ্রহণ করে আয়নিক বন্ধন তৈরি করে।",
      "en": "Ionic bonds form when metals donate electrons to non-metals."
    }
  },
  {
    "question": {
      "bn": "সমযোজী বন্ধন কীভাবে গঠিত হয়?",
      "en": "How is a covalent bond formed?"
    },
    "options": {
      "bn": [
        "ইলেকট্রন স্থানান্তরের মাধ্যমে",
        "ইলেকট্রন শেয়ারিংয়ের মাধ্যমে",
        "প্রোটন বিনিময়ের মাধ্যমে",
        "কোনোটিই নয়"
      ],
      "en": [
        "By electron transfer",
        "By electron sharing",
        "By proton exchange",
        "None of these"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "দুটি অধাতু পরমাণু নিজেদের বহিঃস্থ স্তরের ইলেকট্রন শেয়ার বা ভাগাভাগি করে সমযোজী বন্ধন গঠন করে।",
      "en": "Covalent bonds are formed when two non-metals share valence electrons."
    }
  },
  {
    "question": {
      "bn": "নিচের কোনটি আয়নিক যৌগের সাধারণ বৈশিষ্ট্য?",
      "en": "Which of the following is a common property of ionic compounds?"
    },
    "options": {
      "bn": [
        "নরম প্রকৃতি",
        "পানিতে অদ্রবণীয়তা",
        "গলিত অবস্থায় বিদ্যুৎ পরিবাহিতা",
        "উদ্বায়ী প্রকৃতি"
      ],
      "en": [
        "Soft nature",
        "Insolubility in water",
        "Electrical conductivity when molten",
        "Volatile nature"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "আয়নিক যৌগসমূহ পানিতে দ্রবণীয়, এদের গলনাঙ্ক উচ্চ এবং তরল বা দ্রবীভূত অবস্থায় মুক্ত আয়ন থাকায় বিদ্যুৎ পরিবাহন করে।",
      "en": "Ionic compounds have high melting points and conduct electricity in aqueous or molten states due to free ions."
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


      const stage = document.getElementById('c7Stage');
      const ionicBtn = document.getElementById('c7IonicBtn');
      const covalentBtn = document.getElementById('c7CovalentBtn');
      
      let bondTimeout = null;

      function renderIonic() {
        if (bondTimeout) clearTimeout(bondTimeout);
        stage.innerHTML = `
          <div class="c7-atom na" id="atomNa">Na</div>
          <div class="c7-atom cl" id="atomCl">Cl</div>
          <div class="c7-electron" id="ionElectron" style="left:52px; top:67px;"></div>
        `;

        bondTimeout = setTimeout(() => {
          const electron = document.getElementById('ionElectron');
          const na = document.getElementById('atomNa');
          const cl = document.getElementById('atomCl');
          
          if (!electron || !na || !cl) return;
          
          electron.style.left = '212px';

          bondTimeout = setTimeout(() => {
            if (!na || !cl || !electron) return;
            na.innerHTML = 'Na⁺';
            cl.innerHTML = 'Cl⁻';
            na.style.background = 'rgba(52, 152, 219, 0.4)';
            cl.style.background = 'rgba(46, 204, 113, 0.4)';
            
            na.style.left = '100px';
            cl.style.left = '145px';
            electron.style.left = '145px';
            
            completeSimulation();
          }, 800);
        }, 500);
      }

      function renderCovalent() {
        if (bondTimeout) clearTimeout(bondTimeout);
        stage.innerHTML = `
          <div class="c7-atom h1" id="atomH1">H</div>
          <div class="c7-atom h2" id="atomH2">H</div>
          <div class="c7-atom o" id="atomO">O</div>
          <div class="c7-electron" id="covE1" style="left:52px; top:32px;"></div>
          <div class="c7-electron" id="covE2" style="left:52px; top:112px;"></div>
        `;

        bondTimeout = setTimeout(() => {
          const h1 = document.getElementById('atomH1');
          const h2 = document.getElementById('atomH2');
          const o = document.getElementById('atomO');
          const e1 = document.getElementById('covE1');
          const e2 = document.getElementById('covE2');

          if (!h1 || !h2 || !o || !e1 || !e2) return;

          h1.style.left = '120px';
          h1.style.top = '30px';
          h2.style.left = '120px';
          h2.style.top = '100px';
          o.style.left = '180px';
          o.style.top = '65px';

          e1.style.left = '154px';
          e1.style.top = '48px';
          
          e2.style.left = '154px';
          e2.style.top = '98px';
          
          completeSimulation();
        }, 500);
      }

      ionicBtn.addEventListener('click', () => {
        [ionicBtn, covalentBtn].forEach(b => b.classList.remove('p-btn-accent'));
        ionicBtn.classList.add('p-btn-accent');
        renderIonic();
      });

      covalentBtn.addEventListener('click', () => {
        [ionicBtn, covalentBtn].forEach(b => b.classList.remove('p-btn-accent'));
        covalentBtn.classList.add('p-btn-accent');
        renderCovalent();
      });
      
      window.runSolubility = function(type) {
        const res = document.getElementById('solubilityResult');
        if (type === 'salt') {
          res.innerHTML = currentLang === 'bn' ? '✓ লবণ আয়নিত হয়ে পানিতে সম্পূর্ণ মিশে গেল (দ্রবণীয়)।' : '✓ Salt ionizes and dissolves fully in water (soluble).';
          res.style.color = 'var(--cyan)';
        } else {
          res.innerHTML = currentLang === 'bn' ? '❌ সমযোজী তেল অপোলার থাকায় উপরে স্তর তৈরি করল (অদ্রবণীয়)।' : '❌ Covalent oil forms a separate layer on top (insoluble).';
          res.style.color = 'var(--chalk-coral)';
        }
      };
      
      window.localInit = function() {
        renderIonic();
      };
    
