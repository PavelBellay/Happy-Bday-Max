/* === Config === */
const BALLOON_DURATION = 9000;
const BALLOON_LIMIT_TIME = 30000;
const BALLOON_INITIAL_COUNT = 5;

/* === Expanded AI lines, no repeats until reset === */
let aiResponses = [
  "Happy Birthday! 🎉 May your day be golden! 🏆",
  "You deserve another slice of cake — and some extra confetti. 🎂",
  "Legend status: activated. ✨",
  "Make a wish, I’ll hold the secret. 🤫",
  "VIP today. Treat yourself! 🥂",
  "Hope your year is as amazing as you are! 🌟",
  "Balloons, cake, and endless smiles — that's the plan! 🎈",
  "Today is YOUR day — let's make it sparkle. ✨",
  "Every candle on your cake is a wish waiting to come true.",
  "Here’s to laughter, love, and lots of dessert. 🍰",
  "Cheers to you and all the magic you bring! 🪄",
  "Let the birthday adventures begin! 🚀"
];
let usedResponses = [];

function getAIReply(){
  if (aiResponses.length === 0) {
    aiResponses = [...usedResponses];
    usedResponses = [];
  }
  const index = Math.floor(Math.random() * aiResponses.length);
  const line = aiResponses.splice(index, 1)[0];
  usedResponses.push(line);
  return line;
}

/* === Elements === */
const chatWindow = document.getElementById('chat-window');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const balloonWrap = document.getElementById('balloon-wrap');
const cursor = document.getElementById('cursor-follower');
const sendBtn = document.getElementById('send-btn');

/* === Append messages with enhanced physics animation === */
function appendMessage(who, text){
  const el = document.createElement('div');
  el.className = 'message ' + (who === 'You'? 'you': 'bot');
  el.innerHTML = `<strong>${who}</strong><div class="bubble">${text}</div>`;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  // "fly in" with bounce
  gsap.fromTo(el, {y:-30, opacity:0, rotation:-2, scale:0.9}, {
    y:0, opacity:1, rotation:0, scale:1,
    duration:0.6,
    ease:'elastic.out(1, 0.6)'
  });
}

/* === Form submit === */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = input.value.trim();
  if(!val) return;
  appendMessage('You', val);
  input.value = '';
  gsap.fromTo(sendBtn, {scale:1}, {scale:0.96, duration:0.08, yoyo:true, repeat:1});
  setTimeout(()=>{
    appendMessage('AI Friend', getAIReply());
  }, 700);
});

/* === Balloons === */
let balloonStart = Date.now();
function createBalloon(){
  const b = document.createElement('div');
  b.className = 'balloon';
  b.textContent = '🎈';
  balloonWrap.appendChild(b);
  const startX = Math.random() * window.innerWidth;
  const wobble = (Math.random()*200) - 100;
  gsap.set(b, { x: startX, y: window.innerHeight + 80, rotation: -8 + Math.random()*16, scale: 0.95 + Math.random()*0.2});
  gsap.to(b, {
    x: startX + wobble,
    y: -160,
    rotation: -20 + Math.random()*40,
    duration: (BALLOON_DURATION/1000) + Math.random()*2,
    ease: 'power1.inOut',
    onComplete: () => { b.remove(); }
  });
}
function launchBalloons(){
  for(let i=0;i<BALLOON_INITIAL_COUNT;i++) createBalloon();
  const spawnInterval = setInterval(()=>{
    if(Date.now() - balloonStart > BALLOON_LIMIT_TIME){
      clearInterval(spawnInterval);
      return;
    }
    createBalloon();
  }, 1400);
}

/* === Cursor follower === */
function enableCursorFollower(){
  if(('ontouchstart' in window) || navigator.maxTouchPoints > 0) return;
  cursor.style.display = 'block';
  document.addEventListener('mousemove', e => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power3.out' });
    gsap.to(cursor, { scale: 1.0, duration: 0.12, ease:'power2.out' });
  });
  document.addEventListener('mousedown', () => {
    gsap.to(cursor, { scale: 0.8, duration: 0.08 });
  });
  document.addEventListener('mouseup', () => {
    gsap.to(cursor, { scale: 1.0, duration: 0.08 });
  });
}

/* === Title & entrance animations === */
gsap.from(".title", { y:-40, opacity:0, duration:0.9, ease:"back.out(1.2)" });
gsap.from(".subtitle", { y:-10, opacity:0, duration:0.6, delay:0.15 });
gsap.from("#chat-card", { scale:0.96, opacity:0, duration:0.9, delay:0.25, ease:"elastic.out(1,0.6)" });

/* === Start balloons and cursor === */
launchBalloons();
enableCursorFollower();
input.focus();
setTimeout(()=> appendMessage('AI Friend', 'Hi — I\'m your golden party buddy! Say something to get a fun line.'), 650);
