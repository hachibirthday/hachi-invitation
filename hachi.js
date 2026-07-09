// ---------- COUNTDOWN ----------
const targetDate = new Date("2026-08-22T10:00:00+08:00").getTime();

const dEl = document.getElementById("cd-days");
const hEl = document.getElementById("cd-hours");
const mEl = document.getElementById("cd-mins");
const sEl = document.getElementById("cd-secs");
const msgEl = document.getElementById("cd-msg");

function pad(n) {
    return String(n).padStart(2, "0");
}

function tick() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
        dEl.textContent = "00";
        hEl.textContent = "00";
        mEl.textContent = "00";
        sEl.textContent = "00";
        msgEl.textContent = "It's here — Happy Birthday, Hachi! 🎉";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    dEl.textContent = pad(days);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(mins);
    sEl.textContent = pad(secs);
}

tick();
setInterval(tick, 1000);

// ---------- RSVP CONFETTI ----------
const btn = document.getElementById("rsvpBtn");
const note = document.getElementById("rsvpNote");

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let confettiPieces = [];
let animId = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const colors = [
    "#D62828",
    "#1B3F8B",
    "#FFC800",
    "#2FA84F",
    "#FFFFFF"
];
function spawnConfetti() {
    confettiPieces = [];

    for (let i = 0; i < 140; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * canvas.height * 0.5,
            w: 6 + Math.random() * 6,
            h: 8 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: 2 + Math.random() * 3,
            speedX: (Math.random() - 0.5) * 2,
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10
        });
    }

    if (!animId) {
        animateConfetti();
    }

    setTimeout(() => {
        confettiPieces = [];
    }, 4200);
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rot += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);

        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);

        ctx.restore();
    });

    confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 30);

    animId = requestAnimationFrame(animateConfetti);

    if (confettiPieces.length === 0) {
        cancelAnimationFrame(animId);
        animId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

if (btn) {
    btn.addEventListener("click", () => {
        spawnConfetti();

        note.textContent = "Heroic! We can't wait to celebrate with you. 🎈";

        btn.textContent = "✅ YOU'RE IN, HERO!";
        btn.style.background = "#2FA84F";
    });
    
    
}