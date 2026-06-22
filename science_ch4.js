// ==========================================================================
// CHAPTER 04 SIMULATION & GAMIFIED QUIZ ENGINE
// ==========================================================================

const chId = 'ch4';

// Quiz Questions Array (3 questions per chapter)
const quizQuestions = [
  {
    "question": {
      "bn": "কোন অবস্থায় পদার্থের কণাগুলোর মধ্যে আন্তঃআণবিক আকর্ষণ বল সর্বোচ্চ থাকে?",
      "en": "In which state of matter is the intermolecular force of attraction maximum?"
    },
    "options": {
      "bn": [
        "তরল",
        "কঠিন",
        "গ্যাসীয়",
        "প্লাজমা"
      ],
      "en": [
        "Liquid",
        "Solid",
        "Gaseous",
        "Plasma"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "কঠিন অবস্থায় কণাগুলো খুব কাছাকাছি থাকে এবং এদের আকর্ষণ সবচেয়ে বেশি হয়।",
      "en": "Solid state particles are closely packed with maximum cohesive force."
    }
  },
  {
    "question": {
      "bn": "গলনের সময় ক্রমাগত তাপ দিলেও তাপমাত্রা বৃদ্ধি পায় না কেন?",
      "en": "Why does temperature remain constant during melting despite continuous heating?"
    },
    "options": {
      "bn": [
        "তাপ শোষিত হয় না",
        "তাপ কণাগুলোর আকর্ষণ ভাঙতে ব্যায়িত হয়",
        "থার্মোমিটার নষ্ট হয়ে যায়",
        "কণাগুলো তাপ শোষণ করা বন্ধ করে দেয়"
      ],
      "en": [
        "Heat is not absorbed",
        "Heat is used to break intermolecular bonds",
        "Thermometer malfunction",
        "Particles stop absorbing heat"
      ]
    },
    "answer": 1,
    "explain": {
      "bn": "গলনের সুপ্ততাপ কেবল কণাগুলোর পারস্পরিক বন্ধন ভেঙে কঠিন থেকে তরল করতে ব্যবহৃত হয়, তাই তাপমাত্রা বাড়ে না।",
      "en": "The latent heat of fusion is consumed to overcome molecular lattice forces, keeping temperature constant."
    }
  },
  {
    "question": {
      "bn": "নিচের কোনটি কঠিন থেকে সরাসরি গ্যাসে রূপান্তরিত হয় (ঊর্ধ্বপাতন)?",
      "en": "Which of the following undergoes sublimation (solid to gas directly)?"
    },
    "options": {
      "bn": [
        "বরফ",
        "মোম",
        "কற்பূর (Camphor)",
        "জল"
      ],
      "en": [
        "Ice",
        "Wax",
        "Camphor",
        "Water"
      ]
    },
    "answer": 2,
    "explain": {
      "bn": "কற்பূর, ন্যাপথলিন, কঠিন কার্বন ডাই অক্সাইড প্রভৃতিকে তাপ দিলে সরাসরি তরল না হয়ে গ্যাস হয়।",
      "en": "Substances like camphor, naphthalene, and dry ice sublimate directly to gas upon heating."
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


      const heatInput = document.getElementById('c4Heat');
      const c4Chamber = document.getElementById('c4Chamber');
      const numParticles = 30;
      const particles = [];
      
      // Initialize particles
      for (let i = 0; i < numParticles; i++) {
        const div = document.createElement('div');
        div.className = 'c4-particle';
        c4Chamber.appendChild(div);
        particles.push({
          el: div,
          x: 0,
          y: 0,
          dx: (Math.random() - 0.5) * 5,
          dy: (Math.random() - 0.5) * 5,
          baseX: 0,
          baseY: 0
        });
      }
      
      // Lattice base grid coordinate for SOLID
      let idx = 0;
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 6; col++) {
          if (idx < numParticles) {
            particles[idx].baseX = 80 + col * 25;
            particles[idx].baseY = 50 + row * 18;
          }
          idx++;
        }
      }
      
      let loopId = null;
      function drawPhaseLoop() {
        const heatState = parseInt(heatInput.value); // 1: Solid, 2: Liquid, 3: Gas
        
        particles.forEach((p, i) => {
          if (heatState === 1) {
            p.x = p.baseX + (Math.random() - 0.5) * 2;
            p.y = p.baseY + (Math.random() - 0.5) * 2;
          } 
          else if (heatState === 2) {
            p.dx += (Math.random() - 0.5) * 0.5;
            p.dy += (Math.random() - 0.5) * 0.5;
            p.dx = Math.max(-2, Math.min(2, p.dx));
            p.dy = Math.max(-2, Math.min(2, p.dy));
            
            p.x += p.dx;
            p.y += p.dy;
            
            if (p.x < 10 || p.x > 280) p.dx *= -1;
            if (p.y < 80 || p.y > 130) p.dy *= -1;
            
            p.x = Math.max(10, Math.min(280, p.x));
            p.y = Math.max(80, Math.min(130, p.y));
          } 
          else {
            p.x += p.dx * 1.5;
            p.y += p.dy * 1.5;
            
            if (p.x < 5 || p.x > 280) p.dx *= -1;
            if (p.y < 5 || p.y > 130) p.dy *= -1;
            
            p.x = Math.max(5, Math.min(280, p.x));
            p.y = Math.max(5, Math.min(130, p.y));
          }
          
          p.el.style.left = p.x + 'px';
          p.el.style.top = p.y + 'px';
        });
        
        loopId = requestAnimationFrame(drawPhaseLoop);
      }
      
      function updateHeatUI() {
        const val = parseInt(heatInput.value);
        const textNode = document.getElementById('c4HeatText');
        if (val === 1) {
          textNode.innerHTML = '<span class="bn">Solid (কঠিন)</span><span class="en">Solid</span>';
        } else if (val === 2) {
          textNode.innerHTML = '<span class="bn">Liquid (তরল)</span><span class="en">Liquid</span>';
        } else {
          textNode.innerHTML = '<span class="bn">Gas (গ্যাস)</span><span class="en">Gas</span>';
          completeSimulation(); // Earn XP
        }
      }
      
      heatInput.addEventListener('input', updateHeatUI);
      
      // Water Heating Curve Simulation
      let curveInterval = null;
      window.startHeatingCurve = function() {
        if (curveInterval) clearInterval(curveInterval);
        let temp = -15;
        const tempText = document.getElementById('curveTemp');
        const phaseText = document.getElementById('curvePhase');
        
        curveInterval = setInterval(() => {
          if (temp < 0) {
            temp += 2;
            phaseText.textContent = currentLang === 'bn' ? 'কঠিন বরফ (Solid Ice)' : 'Solid Ice';
          } else if (temp === 0) {
            temp = 1;
            phaseText.textContent = currentLang === 'bn' ? 'গলন দশা (Melting Ice/Water)' : 'Melting Ice/Water';
          } else if (temp < 100) {
            temp += 10;
            phaseText.textContent = currentLang === 'bn' ? 'তরল পানি (Liquid Water)' : 'Liquid Water';
          } else if (temp === 100) {
            temp = 101;
            phaseText.textContent = currentLang === 'bn' ? 'স্ফুটন দশা (Boiling Water/Steam)' : 'Boiling Water/Steam';
          } else if (temp < 150) {
            temp += 10;
            phaseText.textContent = currentLang === 'bn' ? 'জলীয় বাষ্প (Water Vapor/Gas)' : 'Water Vapor/Gas';
          } else {
            clearInterval(curveInterval);
          }
          
          tempText.textContent = Math.min(150, temp);
        }, 150);
      };
      
      window.localInit = function() {
        updateHeatUI();
        if (!loopId) drawPhaseLoop();
      };
      window.localTextSync = function() {
        updateHeatUI();
      };
    
