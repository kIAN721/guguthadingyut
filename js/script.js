/* ==========================================================
   1. TELEGRAM BOT NOTIFICATION SETUP
========================================================== */
const TELEGRAM_BOT_TOKEN = "8832112215:AAGga3nuyOUKmOcTPjLs1FcU8zS9Rf7QCrc";
const TELEGRAM_CHAT_ID = "1694644020";

function sendTelegramAlert(textMessage) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: textMessage
    })
  }).catch(err => console.log("Telegram error:", err));
}

/* ==========================================================
   2. BACKGROUND MUSIC TOGGLE CONTROL (Autoplay Enabled)
========================================================== */
let isPlaying = true; // Initialized to true since autoplay is enabled

// Helper function to pause background music when the Jukebox starts
function pauseBgMusic() {
  const bgAudio = document.getElementById('bg-audio');
  const btn = document.getElementById('music-toggle-btn');
  const icon = document.getElementById('music-icon');
  const text = document.getElementById('music-text');

  if (bgAudio && !bgAudio.paused) {
    bgAudio.pause();
  }
  isPlaying = false;
  if (btn) btn.classList.remove('playing');
  if (icon) icon.textContent = '🔇';
  if (text) text.textContent = 'Play';
}

// Helper function to pause the Jukebox when top-right background music is clicked
function pauseJukeboxMusic() {
  const jukeboxAudio = document.getElementById('thadingyut-audio');
  if (jukeboxAudio && !jukeboxAudio.paused) {
    jukeboxAudio.pause();
  }
  isJukeboxPlaying = false;
  if (typeof updateJukeboxUI === 'function') updateJukeboxUI();
}

// Automatically start background music on initial page load
window.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  if (audio) {
    audio.play().then(() => {
      isPlaying = true;
      const btn = document.getElementById('music-toggle-btn');
      if (btn) btn.classList.add('playing');
    }).catch(err => {
      console.log("Autoplay blocked by browser policy, waiting for interaction:", err);
      isPlaying = false;
      const btn = document.getElementById('music-toggle-btn');
      const icon = document.getElementById('music-icon');
      const text = document.getElementById('music-text');
      if (btn) btn.classList.remove('playing');
      if (icon) icon.textContent = '🎵';
      if (text) text.textContent = 'Play';
    });
  }
});

function toggleMusic() {
  const audio = document.getElementById('bg-audio');
  const btn = document.getElementById('music-toggle-btn');
  const icon = document.getElementById('music-icon');
  const text = document.getElementById('music-text');

  if (!audio) return;

  if (!isPlaying) {
    // Stop Jukebox first so both audio sources don't overlap
    pauseJukeboxMusic();

    audio.play().then(() => {
      isPlaying = true;
      btn.classList.add('playing');
      icon.textContent = '🎶';
      text.textContent = 'Mute';
    }).catch(err => {
      console.log("Audio play error:", err);
    });
  } else {
    audio.pause();
    isPlaying = false;
    btn.classList.remove('playing');
    icon.textContent = '🔇';
    text.textContent = 'Play';
  }
}

/* ==========================================================
   3. THADINGYUT LANTERN JUKEBOX CONTROLLER (Scroll List & Auto-Next)
========================================================== */
const thadingyutTracks = [
  {
    title: "သီတင်းကျွတ်ညလေးတစ်ည - May Khalar & Yadanar",
    src: "audio/thadingyutnya.mp3"
  },
  {
    title: "မီးပုံပွဲ - Hlwan Paing",
    src: "audio/meeponepwal.mp3"
  },
  {
    title: "ပွဲတော်ည - ကိုအောင်",
    src: "audio/pwaltawnya.mp3"
  },
  {
    title: "အဖြူရောင်သံစဉ် - Bo Phyu",
    src: "audio/aphyuyaung.mp3"
  },
  {
    title: "ရှမ်းရိုးမကအိုးစည်သံ - Sai Htee Saing",
    src: "audio/shanyoema.mp3"
  },
  {
    title: "အိမ်မက်ဆောင်းည - Bo Phyu",
    src: "audio/eainmat.mp3"
  },
  {
    title: "လတ်တီး - Bo Phyu",
    src: "audio/lattee.mp3"
  }
];

let currentTrackIdx = 0;
let isJukeboxPlaying = false;

// Render the scrollable song list and attach 'ended' listener for auto-next
window.addEventListener('DOMContentLoaded', () => {
  renderJukeboxList();

  const audioEl = document.getElementById('thadingyut-audio');
  if (audioEl) {
    // Automatically advance to the next song when a track finishes
    audioEl.addEventListener('ended', () => {
      nextThadingyutTrack();
    });
  }
});

function renderJukeboxList() {
  const listEl = document.getElementById('jukebox-song-list');
  if (!listEl) return;

  listEl.innerHTML = '';
  thadingyutTracks.forEach((track, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const isActive = idx === currentTrackIdx;
    btn.className = 'jukebox-song-item' + (isActive ? ' active' : '');
    btn.innerHTML = `
      <div class="jukebox-item-left">
        <span class="jukebox-item-num">🏮 ${idx + 1}.</span>
        <span class="jukebox-item-title">${track.title}</span>
      </div>
      <span class="jukebox-item-icon">${isActive && isJukeboxPlaying ? '🎶' : '▶️'}</span>
    `;
    btn.onclick = () => selectThadingyutTrack(idx);
    listEl.appendChild(btn);
  });
}

function updateJukeboxUI() {
  const discBtn = document.querySelector('.lantern-toggle-disc');
  const statusEl = document.getElementById('thadingyut-track-status');
  const titleEl = document.getElementById('thadingyut-track-title');

  if (titleEl) titleEl.textContent = thadingyutTracks[currentTrackIdx].title;

  if (isJukeboxPlaying) {
    if (discBtn) discBtn.classList.add('playing');
    if (statusEl) statusEl.textContent = 'Playing 🎶';
  } else {
    if (discBtn) discBtn.classList.remove('playing');
    if (statusEl) statusEl.textContent = 'Paused ⏸️';
  }

  // Update active highlight and status icon in the scrollable song list
  const items = document.querySelectorAll('.jukebox-song-item');
  items.forEach((item, idx) => {
    const icon = item.querySelector('.jukebox-item-icon');
    if (idx === currentTrackIdx) {
      item.classList.add('active');
      if (icon) icon.textContent = isJukeboxPlaying ? '🎶' : '▶️';
    } else {
      item.classList.remove('active');
      if (icon) icon.textContent = '▶️';
    }
  });
}

function selectThadingyutTrack(idx) {
  const audioEl = document.getElementById('thadingyut-audio');
  if (!audioEl) return;

  // If clicking the song that is already active, toggle play/pause
  if (idx === currentTrackIdx && audioEl.getAttribute('src')) {
    toggleThadingyutMusic();
    return;
  }

  currentTrackIdx = idx;
  pauseBgMusic();

  audioEl.setAttribute('src', thadingyutTracks[currentTrackIdx].src);
  audioEl.play().then(() => {
    isJukeboxPlaying = true;
    updateJukeboxUI();
  }).catch(err => {
    console.log("Jukebox play error:", err);
    const statusEl = document.getElementById('thadingyut-track-status');
    if (statusEl) statusEl.textContent = 'Check audio file';
  });
}

function toggleThadingyutMusic() {
  const audioEl = document.getElementById('thadingyut-audio');
  const statusEl = document.getElementById('thadingyut-track-status');
  if (!audioEl) return;

  if (!audioEl.getAttribute('src')) {
    audioEl.setAttribute('src', thadingyutTracks[currentTrackIdx].src);
  }

  if (!isJukeboxPlaying) {
    pauseBgMusic();
    audioEl.play().then(() => {
      isJukeboxPlaying = true;
      updateJukeboxUI();
    }).catch(err => {
      console.log("Jukebox play error (check audio file path):", err);
      if (statusEl) statusEl.textContent = 'Check audio file';
    });
  } else {
    audioEl.pause();
    isJukeboxPlaying = false;
    updateJukeboxUI();
  }
}

function nextThadingyutTrack() {
  currentTrackIdx = (currentTrackIdx + 1) % thadingyutTracks.length;
  const audioEl = document.getElementById('thadingyut-audio');
  if (!audioEl) return;

  pauseBgMusic();
  audioEl.setAttribute('src', thadingyutTracks[currentTrackIdx].src);

  audioEl.play().then(() => {
    isJukeboxPlaying = true;
    updateJukeboxUI();

    // Smoothly scroll the active song into view inside the jukebox list
    const items = document.querySelectorAll('.jukebox-song-item');
    if (items[currentTrackIdx]) {
      items[currentTrackIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }).catch(err => console.log(err));
}

/* ==========================================================
   4. INTERACTIVE OIL LAMPS (Section 1)
========================================================== */
let litCount = 0;
let allLitSent = false;

function lightLamp(el) {
  if (!el.classList.contains('lit')) {
    el.classList.add('lit');
    litCount++;
    if (litCount === 5 && !allLitSent) {
      allLitSent = true;
      document.getElementById('lamp-secret-msg').style.display = 'block';
      sendTelegramAlert(`🪔 顾顾 lit all 5 Thadingyut oil lamps (ဆီမီးခွက်)!\n⏰ Time: ${new Date().toLocaleString()}`);
    }
  }
}

/* ==========================================================
   5. SKY LANTERN WISH & TELEGRAM ALERT (Section 2)
========================================================== */
function releaseLantern() {
  const lantern = document.getElementById('wish-lantern');
  const input = document.getElementById('wish-input');
  const status = document.getElementById('wish-status');
  const wishText = input.value.trim() || "(ဆုတောင်းစာ မရေးဘဲ မီးပုံးပျံလွှတ်လိုက်ပါတယ် 🏮)";

  lantern.classList.add('fly-away');
  status.textContent = "ရေးးးး မီးပုံးပျံ အပေါ်ကိုပျံတက်သွားပြီ ဟီးးးး🙄…. ကုကုဆုတောင်းပြည့်ပါစေနော် 🏮✨";

  sendTelegramAlert(`🏮 顾顾 released a Thadingyut Sky Lantern!\n\n💭 Her Wish: ${wishText}\n⏰ Time: ${new Date().toLocaleString()}`);

  setTimeout(() => {
    lantern.style.transition = 'none';
    lantern.classList.remove('fly-away');
    setTimeout(() => {
      lantern.style.transition = 'transform 3.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 3.2s ease';
    }, 50);
  }, 3600);
}

/* ==========================================================
   6. POCKET MONEY ENVELOPE REVEAL (Section 3)
========================================================== */
let giftOpened = false;

function openMonePhoe() {
  document.getElementById('mone-phoe-reveal').style.display = 'block';
  if (!giftOpened) {
    giftOpened = true;
    sendTelegramAlert(`🧧 顾顾 opened your Thadingyut မုန့်ဖိုး envelope!\n⏰ Time: ${new Date().toLocaleString()}`);
  }
}

/* ==========================================================
   7. 3-MINI-GAME QUEST CONTROLLER (Section 4)
========================================================== */
let starsCaught = 0;
let bellRings = 0;
let fireworksLit = 0;

function playQuestTone(freq = 587.33, duration = 1.0) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = this.createGain ? this.createGain() : ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {}
}

// STAGE 1: Catch 3 Stars
function catchQuestStar(starBtn) {
  if (starBtn.classList.contains('caught')) return;
  starBtn.classList.add('caught');
  starsCaught++;
  playQuestTone(659.25 + starsCaught * 110, 0.6);

  const countEl = document.getElementById('star-count');
  if (countEl) countEl.textContent = starsCaught;

  if (starsCaught >= 3) {
    setTimeout(() => {
      document.getElementById('quest-game-1').classList.remove('active');
      document.getElementById('quest-game-2').classList.add('active');

      const p1 = document.getElementById('step-pill-1');
      const p2 = document.getElementById('step-pill-2');
      if (p1) { p1.classList.remove('active'); p1.classList.add('done'); p1.textContent = '1. 🌠 Done ✓'; }
      if (p2) p2.classList.add('active');
    }, 450);
  }
}

// STAGE 2: Ring Pagoda Bell 3 Times
function ringPagodaBell() {
  if (bellRings >= 3) return;
  bellRings++;
  playQuestTone(523.25, 1.4);

  const bellEmoji = document.getElementById('bell-emoji');
  const ripple = document.getElementById('bell-ripple');
  const countEl = document.getElementById('bell-count');
  const soundText = document.getElementById('bell-sound-text');

  if (countEl) countEl.textContent = bellRings;

  if (bellEmoji) {
    bellEmoji.classList.remove('ringing');
    void bellEmoji.offsetWidth;
    bellEmoji.classList.add('ringing');
  }

  if (ripple) {
    ripple.classList.remove('active');
    void ripple.offsetWidth;
    ripple.classList.add('active');
  }

  const bellMessages = [
    "Ringing... ✨ (One - စိတ်ချမ်းသာပါစေ)",
    "Ringing... 🌟 (Two - ကျန်းမာပျော်ရွှင်ပါစေ)",
    "Ringing... 🙏 (Three - ဆုတောင်းပြည့်ပါစေ!)"
  ];
  if (soundText) soundText.textContent = bellMessages[bellRings - 1];

  if (bellRings >= 3) {
    setTimeout(() => {
      document.getElementById('quest-game-2').classList.remove('active');
      document.getElementById('quest-game-3').classList.add('active');

      const p2 = document.getElementById('step-pill-2');
      const p3 = document.getElementById('step-pill-3');
      if (p2) { p2.classList.remove('active'); p2.classList.add('done'); p2.textContent = '2. 🔔 Done ✓'; }
      if (p3) p3.classList.add('active');
    }, 800);
  }
}

// STAGE 3: Sparkle the Festival Fireworks
function spawnFireworkBurst(btnElement) {
  const rect = btnElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const sparks = ['✨', '🎆', '🎇', '🌟', '💛', '💖'];

  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'fw-spark-particle';
    p.textContent = sparks[i % sparks.length];
    p.style.left = `${centerX}px`;
    p.style.top = `${centerY}px`;
    document.body.appendChild(p);

    const angle = (Math.PI * 2 * i) / 8;
    const distance = 50 + Math.random() * 35;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    requestAnimationFrame(() => {
      p.style.transform = `translate(${dx}px, ${dy}px) scale(1.25)`;
      p.style.opacity = '0';
    });

    setTimeout(() => p.remove(), 800);
  }
}

function launchFirework(fwBtn, idx) {
  if (fwBtn.classList.contains('sparkled')) return;
  fwBtn.classList.add('sparkled');
  fireworksLit++;

  // Play rising celebration chord notes
  playQuestTone(523.25 + fireworksLit * 130, 0.7);
  setTimeout(() => playQuestTone(783.99 + fireworksLit * 150, 0.8), 110);

  const emojiEl = fwBtn.querySelector('.fw-emoji');
  const labelEl = fwBtn.querySelector('.fw-label');
  const icons = ['🎇', '🎆', '🎇'];
  if (emojiEl) emojiEl.textContent = icons[idx % icons.length];
  if (labelEl) labelEl.textContent = 'ဝါးးးးးးးး! ✨';

  spawnFireworkBurst(fwBtn);

  const countEl = document.getElementById('fw-count');
  const statusEl = document.getElementById('fw-status-text');
  if (countEl) countEl.textContent = fireworksLit;

  if (fireworksLit === 1 && statusEl) {
    statusEl.textContent = '🎇 နောက်နှစ်ခုကျန်သေးတယ်နော်';
  } else if (fireworksLit === 2 && statusEl) {
    statusEl.textContent = '🎆 နောက်ဆုံးတစ်ခုလည်းနှိပ်လိုက်ဦးနော်!';
  } else if (fireworksLit >= 3) {
    if (statusEl) statusEl.textContent = 'ရေးးးးး အကုန်ပြီးသွားပါပြီ! 🎉🎆';

    setTimeout(() => {
      document.getElementById('quest-game-3').classList.remove('active');
      const p3 = document.getElementById('step-pill-3');
      if (p3) { p3.classList.remove('active'); p3.classList.add('done'); p3.textContent = '3. 🎆 Done ✓'; }

      const subtitle = document.getElementById('quest-subtitle');
      if (subtitle) subtitle.textContent = 'All 3 games have been completed!!!! 🎉💖';

      const wishBox = document.getElementById('unlocked-wish-box');
      if (wishBox) wishBox.classList.add('show');

      if (typeof sendTelegramAlert === 'function') {
        sendTelegramAlert(`🎆 顾顾 completed all 3 Thadingyut mini-games (Stars, Bell & Fireworks) and unlocked your Wish! 💖\n⏰ Time: ${new Date().toLocaleString()}`);
      }
    }, 850);
  }
}

/* ==========================================================
   8. BACKGROUND FLOATING LANTERNS SKY CANVAS
========================================================== */
const canvas = document.getElementById('sky-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const lanterns = Array.from({ length: 22 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 6 + 4,
    speedY: Math.random() * 0.6 + 0.3,
    drift: Math.random() * 0.4 - 0.2,
    alpha: Math.random() * 0.5 + 0.3
  }));

  function drawSky() {
    ctx.clearRect(0, 0, w, h);
    lanterns.forEach(l => {
      l.y -= l.speedY;
      l.x += l.drift;
      if (l.y < -20) {
        l.y = h + 20;
        l.x = Math.random() * w;
      }
      ctx.save();
      ctx.beginPath();
      const grad = ctx.createRadialGradient(l.x, l.y, 1, l.x, l.y, l.r * 2.5);
      grad.addColorStop(0, `rgba(254, 240, 138, ${l.alpha})`);
      grad.addColorStop(0.5, `rgba(245, 158, 11, ${l.alpha * 0.6})`);
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.arc(l.x, l.y, l.r * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(drawSky);
  }
  drawSky();
}