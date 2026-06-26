// ----- Typing animation for hero name -----
const name = "Saira Ejaz";
const typedEl = document.getElementById('typedName');
let i = 0;
function typeWriter(){
  if(i < name.length){
    typedEl.textContent += name.charAt(i);
    i++;
    setTimeout(typeWriter, 90);
  }
}
window.addEventListener('DOMContentLoaded', typeWriter);

// ----- Mobile nav toggle -----
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// ----- Scroll reveal for sections -----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      if(entry.target.id === 'skills'){
        document.querySelectorAll('.bar-fill').forEach(bar => bar.classList.add('animate'));
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ----- Cursor glow follow -----
const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ----- Navbar background + scroll progress -----
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50 ? 'rgba(11,19,43,0.92)' : 'rgba(11,19,43,0.7)';
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrolled + '%';
});

// ----- Footer year -----
document.getElementById('year').textContent = new Date().getFullYear();

// ----- Magnetic buttons -----
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
  });
});

// ----- 3D tilt on project cards -----
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ----- Particle network background -----
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initParticles(){
  particles = [];
  const count = window.innerWidth < 700 ? 35 : 70;
  for(let p = 0; p < count; p++){
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5
    });
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function animateParticles(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let a = 0; a < particles.length; a++){
    const p1 = particles[a];
    p1.x += p1.vx;
    p1.y += p1.vy;
    if(p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
    if(p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

    ctx.beginPath();
    ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(91,192,190,0.5)';
    ctx.fill();

    for(let b = a + 1; b < particles.length; b++){
      const p2 = particles[b];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if(dist < 120){
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(91,192,190,${0.12 * (1 - dist / 120)})`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Respect reduced motion: stop particle animation
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  canvas.style.display = 'none';
}