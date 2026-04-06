// ======================================== TYPING ANIMATION ======================================== 
function startTypingAnimation() {
  const heroTitleEl = document.getElementById('heroTitle');
  const phrases = [
    "I'm a Mechanical Engineer",
    "Undergraduate at Jomo Kenyatta University"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function typeCharacter() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      charIndex--;
      heroTitleEl.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length; // next phrase
        typingTimeout = setTimeout(typeCharacter, 500); // pause before typing next
      } else {
        typingTimeout = setTimeout(typeCharacter, 50); // deleting speed
      }
    } else {
      charIndex++;
      heroTitleEl.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        typingTimeout = setTimeout(typeCharacter, 1500); // pause before deleting
      } else {
        typingTimeout = setTimeout(typeCharacter, 100); // typing speed
      }
    }
  }

  typeCharacter();
}

// Start typing animation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startTypingAnimation);
} else {
  startTypingAnimation();
}

// ======================================== PARTICLE ANIMATION ======================================== 
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.fillStyle = `rgba(0, 168, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const particles = Array(50).fill(null).map(() => new Particle());

  let animationId;
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationId = requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animateParticles();
    }
  });

  animateParticles();
}

// ======================================== SKILL BARS ANIMATION ======================================== 
function animateSkillBars() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.skill-bar-fill').forEach(fill => {
      fill.style.width = fill.getAttribute('data-width') + '%';
    });
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-bar-fill');
        fills.forEach(fill => {
          const width = fill.getAttribute('data-width');
          fill.style.width = width + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('.skill-bars').forEach(el => observer.observe(el));
}

animateSkillBars();

// ======================================== NAVIGATION ======================================== 
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (hamburger && mobileMenu && closeMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileLinks.forEach(link => link.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

// Update active nav link on scroll (throttled)
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.nav-link');

      let current = '';
      sections.forEach(section => {
        if (pageYOffset >= section.offsetTop - 200) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) link.classList.add('active');
      });

      ticking = false;
    });
    ticking = true;
  }
});

// ======================================== LUCIDE ICONS ======================================== 
if (window.lucide) lucide.createIcons();

// ======================================== EDIT PANEL INTEGRATION ======================================== 
const defaultConfig = {
  hero_name: 'Aphline Anyango',
  hero_title: "I'm a Mechanical Engineer",
  about_text: 'Passionate mechanical engineer with expertise in thermal systems design, CAD modeling, and manufacturing processes. I thrive on solving complex engineering challenges and bringing innovative designs from concept to reality. With a strong foundation in analytical problem-solving and hands-on fabrication, I deliver solutions that are both efficient and elegant.',
  contact_email: 'aphline.anyango@email.com',
  project_1_title: 'HVAC Optimization System',
  project_2_title: 'Robotic Arm Actuator',
  project_3_title: 'Turbine Blade Design',
  project_4_title: '3D-Printed Lattice Structures',
  project_5_title: 'Solar Thermal Collector'
};

let config = { ...defaultConfig };

async function initializeElementSdk() {
  if (!window.elementSdk) return;

  window.elementSdk.init({
    defaultConfig,
    onConfigChange: async (newConfig) => {
      config = newConfig;
      updateUIFromConfig();
      // Restart typing animation with new hero_title
      startTypingAnimation();
    },
    mapToCapabilities: () => ({
      recolorables: [],
      borderables: [],
      fontEditable: undefined,
      fontSizeable: undefined
    }),
    mapToEditPanelValues: () => new Map([
      ['hero_name', config.hero_name || defaultConfig.hero_name],
      ['hero_title', config.hero_title || defaultConfig.hero_title],
      ['about_text', config.about_text || defaultConfig.about_text],
      ['contact_email', config.contact_email || defaultConfig.contact_email],
      ['project_1_title', config.project_1_title || defaultConfig.project_1_title],
      ['project_2_title', config.project_2_title || defaultConfig.project_2_title],
      ['project_3_title', config.project_3_title || defaultConfig.project_3_title],
      ['project_4_title', config.project_4_title || defaultConfig.project_4_title],
      ['project_5_title', config.project_5_title || defaultConfig.project_5_title]
    ])
  });
}

function updateUIFromConfig() {
  const heroName = document.getElementById('heroName');
  const heroTitle = document.getElementById('heroTitle');
  const aboutText = document.getElementById('aboutText');
  const contactEmail = document.getElementById('contactEmail');

  if (heroName) {
    const nameParts = (config.hero_name || defaultConfig.hero_name).split(' ');
    heroName.innerHTML = `${nameParts[0]} <span class="hero-accent">${nameParts.slice(1).join(' ')}</span>`;
  }

  if (heroTitle) heroTitle.textContent = config.hero_title || defaultConfig.hero_title;
  if (aboutText) aboutText.textContent = config.about_text || defaultConfig.about_text;
  if (contactEmail) contactEmail.href = `mailto:${config.contact_email || defaultConfig.contact_email}`;

  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    const titleEl = card.querySelector('.project-title');
    if (titleEl) {
      const configKey = `project_${index + 1}_title`;
      titleEl.textContent = config[configKey] || defaultConfig[configKey];
    }
  });
}

initializeElementSdk();
updateUIFromConfig();