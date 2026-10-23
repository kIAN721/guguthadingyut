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
   4. Ring the Golden Bell Mini-Game (Option D)
========================================================== */
let bellTaps = 0;
let bellWishRevealed = false;

function ringBell() {
  if (bellWishRevealed) return;
  bellTaps++;

  const bellBtn = document.getElementById('bell-btn');
  const progressEl = document.getElementById('bell-progress');

  if (bellBtn) {
    // Remove previous animation class and force reflow to restart animation
    bellBtn.className = 'bell-btn';
    void bellBtn.offsetWidth;
    bellBtn.classList.add(`ring-${bellTaps}`);
  }

  if (progressEl) {
    progressEl.textContent = `ခေါင်းလောင်းထိုးမည်: ${bellTaps} / 3 🔔`;
  }

  if (bellTaps === 3 && !bellWishRevealed) {
    bellWishRevealed = true;
    setTimeout(() => {
      const stage = document.getElementById('bell-stage');
      const revealBox = document.getElementById('my-wish-reveal');

      if (stage) stage.style.display = 'none';
      if (revealBox) revealBox.style.display = 'block';

      sendTelegramAlert(`🔔✨ 顾顾 rang the Golden Bell 3 times and unlocked your personal Thadingyut wish!\n⏰ Time: ${new Date().toLocaleString()}`);
    }, 450);
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