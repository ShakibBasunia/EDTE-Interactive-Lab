// ==========================================================================
// CHAPTER 02 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch2';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "সেলসিয়াস ও ফারেনহাইট স্কেলে কোন তাপমাত্রায় সমান মান দেখায়?",
      "en": "At what temperature do Celsius and Fahrenheit scales read the same value?"
    },
    "options": {
      "bn": [
        "0 ডিগ্রী",
        "100 ডিগ্রী",
        "-40 ডিগ্রী",
        "32 ডিগ্রী"
      ],
      "en": [
        "0 degrees",
        "100 degrees",
        "-40 degrees",
        "32 degrees"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "সমীকরণ সমাধান করলে পাওয়া যায়, -৪০ ডিগ্রীতে সেলসিয়াস ও ফারেনহাইট উভয় স্কেলের মান সমান হয়।",
      "en": "Solving C/5 = (F-32)/9 for C=F yields -40 degrees for both scales."
    }
  },
  {
    "question": {
      "bn": "পরম শূন্য (Absolute Zero) তাপমাত্রা কেলভিন স্কেলে কত?",
      "en": "What is Absolute Zero temperature in Kelvin scale?"
    },
    "options": {
      "bn": [
        "0 K",
        "273.15 K",
        "-273.15 K",
        "100 K"
      ],
      "en": [
        "0 K",
        "273.15 K",
        "-273.15 K",
        "100 K"
      ]
    },
    "answer": 0,
    "explain": {
      "bn": "কেলভিন স্কেলে সর্বনিম্ন তাত্ত্বিক তাপমাত্রা হলো পরম শূন্য যা ০ কেলভিন (বা -২৭৩.১৫ ডিগ্রী সেলসিয়াস)।",
      "en": "The theoretical minimum temperature is Absolute Zero, which is 0 K (-273.15°C)."
    }
  },
  {
    "question": {
      "bn": "তাপমাত্রার আন্তর্জাতিক (SI) একক কোনটি?",
      "en": "What is the SI unit of temperature?"
    },
    "options": {
      "bn": [
        "সেলসিয়াস (°C)",
        "ফারেনহাইট (°F)",
        "কেলভিন (K)",
        "জুল (J)"
      ],
      "en": [
        "Celsius (°C)",
        "Fahrenheit (°F)",
        "Kelvin (K)",
        "Joule (J)"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "বিজ্ঞানে ও এসআই এককে তাপমাত্রার প্রধান একক কেলভিন (K)।",
      "en": "Kelvin (K) is the SI base unit of thermodynamic temperature."
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


      const tempInput = document.getElementById('c2Temp');
      const c2Chamber = document.getElementById('c2Chamber');
      const numMolecules = 15;
      const molecules = [];
      
      // Initialize particles
      for (let i = 0; i < numMolecules; i++) {
        const div = document.createElement('div');
        div.className = 'c2-molecule';
        c2Chamber.appendChild(div);
        
        molecules.push({
          el: div,
          x: Math.random() * 260 + 10,
          y: Math.random() * 120 + 10,
          dx: (Math.random() - 0.5) * 4,
          dy: (Math.random() - 0.5) * 4
        });
      }
      
      let animId = null;
      function animate() {
        const temp = parseFloat(tempInput.value);
        // speed scaling factor based on temp
        const speedScale = Math.max(0.1, (temp + 150) / 100);
        
        molecules.forEach(m => {
          m.x += m.dx * speedScale;
          m.y += m.dy * speedScale;
          
          // boundary collision
          if (m.x < 5 || m.x > 280) { m.dx *= -1; m.x = Math.max(5, Math.min(280, m.x)); }
          if (m.y < 5 || m.y > 145) { m.dy *= -1; m.y = Math.max(5, Math.min(145, m.y)); }
          
          m.el.style.left = m.x + 'px';
          m.el.style.top = m.y + 'px';
        });
        
        // update rail track simulator
        const trackL = document.getElementById('railTrackL');
        const trackR = document.getElementById('railTrackR');
        const gap = document.getElementById('railGap');
        const railStatus = document.getElementById('railStatus');
        if (trackL && trackR && gap && railStatus) {
          const expansion = Math.max(0, (temp + 100) * 0.05); // max 15px
          const gapSize = Math.max(0, 20 - expansion);
          
          trackL.style.width = (70 + expansion/2) + 'px';
          trackR.style.width = (70 + expansion/2) + 'px';
          gap.style.width = gapSize + 'px';
          
          if (gapSize === 0) {
            railStatus.innerHTML = '<span style="color:var(--chalk-coral);">⚠️ Collision/Buckling risk!</span>';
          } else {
            railStatus.textContent = 'Gap: ' + gapSize.toFixed(1) + 'mm (Safe)';
          }
        }
        
        animId = requestAnimationFrame(animate);
      }
      
      function updateTemp() {
        const C = parseFloat(tempInput.value);
        const F = (C * 9/5) + 32;
        const K = C + 273.15;
        
        document.getElementById('c2TempText').textContent = C + '°C';
        document.getElementById('c2C').textContent = C;
        document.getElementById('c2F').textContent = F.toFixed(1);
        document.getElementById('c2K').textContent = K.toFixed(2);
        
        if (C >= 150) {
          completeSimulation(); // Earn XP
        }
      }
      
      tempInput.addEventListener('input', updateTemp);
      
      window.localInit = function() {
        updateTemp();
        if (!animId) animate();
      };
      
      window.localTextSync = function() {
        updateTemp();
      };
    
