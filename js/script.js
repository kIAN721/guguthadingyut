/* ==========================================================
   Telegram Bot Setup
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
   Background Music Toggle Control (Autoplay Enabled)
========================================================== */
let isPlaying = true; // Autoplay ဖြစ်နေပြီမို့ true စတင်ပေးပါမည်

// မျက်နှာပြင်စဖွင့်ချင်း အလိုအလျောက် သီချင်းစရန်
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
    text.textContent = 'Pause';
  }
}

/* ==========================================================
   Thadingyut Lantern Jukebox Controller
========================================================== */
const thadingyutTracks = [
  {
    title: "သီတင်းကျွတ်ညချမ်း (Acoustic Vibe)",
    src: "audio/thadingyut1.mp3" // Replace with your actual audio filename or link
  },
  {
    title: "မီးပုံးပျံလေးများ (Lantern Glow)",
    src: "audio/thadingyut2.mp3" // Replace with your actual audio filename or link
  },
  {
    title: "ဆီမီးတိုင်လေးတွေထွန်းလို့ (Festival Night)",
    src: "audio/thadingyut3.mp3" // Replace with your actual audio filename or link
  }
];

let currentTrackIdx = 0;
let isJukeboxPlaying = false;

function toggleThadingyutMusic() {
  const audioEl = document.getElementById('thadingyut-audio');
  const discBtn = document.querySelector('.lantern-toggle-disc');
  const statusEl = document.getElementById('thadingyut-track-status');
  const titleEl = document.getElementById('thadingyut-track-title');
  
  if (!audioEl) return;

  if (!audioEl.getAttribute('src')) {
    audioEl.setAttribute('src', thadingyutTracks[currentTrackIdx].src);
  }

  if (!isJukeboxPlaying) {
    audioEl.play().then(() => {
      isJukeboxPlaying = true;
      if (discBtn) discBtn.classList.add('playing');
      if (statusEl) statusEl.textContent = 'ဖွင့်ထားသည် 🎶 (Playing)';
      if (titleEl) titleEl.textContent = thadingyutTracks[currentTrackIdx].title;
    }).catch(err => {
      console.log("Jukebox play error (check audio file path):", err);
      if (statusEl) statusEl.textContent = 'သီချင်းဖိုင် ရှာမတွေ့ပါ (Check audio file)';
    });
  } else {
    audioEl.pause();
    isJukeboxPlaying = false;
    if (discBtn) discBtn.classList.remove('playing');
    if (statusEl) statusEl.textContent = 'ခေတ္တရပ်ထားသည် (Paused)';
  }
}

function nextThadingyutTrack() {
  currentTrackIdx = (currentTrackIdx + 1) % thadingyutTracks.length;
  const audioEl = document.getElementById('thadingyut-audio');
  const titleEl = document.getElementById('thadingyut-track-title');
  const statusEl = document.getElementById('thadingyut-track-status');
  const discBtn = document.querySelector('.lantern-toggle-disc');

  if (!audioEl) return;

  audioEl.setAttribute('src', thadingyutTracks[currentTrackIdx].src);
  if (titleEl) titleEl.textContent = thadingyutTracks[currentTrackIdx].title;

  if (isJukeboxPlaying) {
    audioEl.play().then(() => {
      if (discBtn) discBtn.classList.add('playing');
      if (statusEl) statusEl.textContent = 'ဖွင့်ထားသည် 🎶 (Playing)';
    }).catch(err => console.log(err));
  }
}

/* ==========================================================
   1. Light Oil Lamps (ဆီမီးခွက်)
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
   2. Release Sky Lantern & Send Wish to Telegram
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
   3. Open Pocket Money Envelope (မုန့်ဖိုးအိတ်လေး)
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
   Section 4: 3-Mini-Game Quest Controller
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
    const gain = ctx.createGain();
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
      if (p1) { p1.classList.remove('active'); p1.classList.add('done'); p1.textContent = '1. 🌠 ပြီးပြီ ✓'; }
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
    "နောင်... ✨ (၁ ချက် - စိတ်ချမ်းသာပါစေ)",
    "နောင်... 🌟 (၂ ချက် - ကျန်းမာပျော်ရွှင်ပါစေ)",
    "နောင်... 🙏 (၃ ချက် - ဆုတောင်းပြည့်ပါစေ!)"
  ];
  if (soundText) soundText.textContent = bellMessages[bellRings - 1];

  if (bellRings >= 3) {
    setTimeout(() => {
      document.getElementById('quest-game-2').classList.remove('active');
      document.getElementById('quest-game-3').classList.add('active');

      const p2 = document.getElementById('step-pill-2');
      const p3 = document.getElementById('step-pill-3');
      if (p2) { p2.classList.remove('active'); p2.classList.add('done'); p2.textContent = '2. 🔔 ပြီးပြီ ✓'; }
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
  if (labelEl) labelEl.textContent = 'လှလိုက်တာ! ✨';

  spawnFireworkBurst(fwBtn);

  const countEl = document.getElementById('fw-count');
  const statusEl = document.getElementById('fw-status-text');
  if (countEl) countEl.textContent = fireworksLit;

  if (fireworksLit === 1 && statusEl) {
    statusEl.textContent = 'ရွှီး... ဖောင်း! 🎇 နောက် (၂) ခု ကျန်သေးတယ်နော်!';
  } else if (fireworksLit === 2 && statusEl) {
    statusEl.textContent = 'အရမ်းလှတာပဲ! 🎆 နောက်ဆုံး (၁) ခုကို ဖောက်လိုက်ပါဦး!';
  } else if (fireworksLit >= 3) {
    if (statusEl) statusEl.textContent = 'မီးရှူးမီးပန်းတွေ အကုန်လုံး လင်းလက်သွားပြီ! 🎉🎆';

    setTimeout(() => {
      document.getElementById('quest-game-3').classList.remove('active');
      const p3 = document.getElementById('step-pill-3');
      if (p3) { p3.classList.remove('active'); p3.classList.add('done'); p3.textContent = '3. 🎆 ပြီးပြီ ✓'; }

      const subtitle = document.getElementById('quest-subtitle');
      if (subtitle) subtitle.textContent = 'ဂိမ်း (၃) ခုလုံး အောင်မြင်စွာ ပြီးဆုံးသွားပါပြီ! 🎉💖';

      const wishBox = document.getElementById('unlocked-wish-box');
      if (wishBox) wishBox.classList.add('show');

      if (typeof sendTelegramAlert === 'function') {
        sendTelegramAlert(`🎆 顾顾 completed all 3 Thadingyut mini-games (Stars, Bell & Fireworks) and unlocked your Wish! 💖\n⏰ Time: ${new Date().toLocaleString()}`);
      }
    }, 850);
  }
}

/* ==========================================================
   5. Background Floating Lanterns Canvas
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