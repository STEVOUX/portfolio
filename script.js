// Update Footer Year
document.getElementById('year').textContent = new Date().getFullYear();

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smooth: true,
  mouseMultiplier: 1.2,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Custom Cursor (Desktop Only)
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
if (!isTouchDevice) {
  const cursorFollower = document.querySelector('.cursor-follower');
  const cursorDot = document.querySelector('.cursor-dot');

  gsap.set(cursorFollower, { xPercent: -50, yPercent: -50 });
  gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });

  let xToFollower = gsap.quickTo(cursorFollower, "x", { duration: 0.5, ease: "power3" });
  let yToFollower = gsap.quickTo(cursorFollower, "y", { duration: 0.5, ease: "power3" });
  let xToDot = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power3" });
  let yToDot = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power3" });
  
  // Ambient Glow Follower
  const ambientGlow = document.getElementById('ambient-glow');
  let xToAmbient = gsap.quickTo(ambientGlow, "x", { duration: 2, ease: "power3" });
  let yToAmbient = gsap.quickTo(ambientGlow, "y", { duration: 2, ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    xToFollower(e.clientX);
    yToFollower(e.clientY);
    xToDot(e.clientX);
    yToDot(e.clientY);
    xToAmbient(e.clientX);
    yToAmbient(e.clientY);
    
    // Spotlight Effect for cards
    document.querySelectorAll('.spotlight-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Interactive Hover Effects for Cursor
  const interactiveElements = document.querySelectorAll('a, button, [data-interactive]');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursorDot, { scale: 0, duration: 0.3 });
      gsap.to(cursorFollower, { scale: 1.8, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'transparent', duration: 0.3 });
      if(ambientGlow) gsap.to(ambientGlow, { opacity: 0.8, scale: 1.2, duration: 0.5 });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(cursorDot, { scale: 1, duration: 0.3 });
      gsap.to(cursorFollower, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.4)', duration: 0.3 });
      if(ambientGlow) gsap.to(ambientGlow, { opacity: 1, scale: 1, duration: 0.5 });
    });
    });
  });
} else {
  // --- MOBILE SPECIFIC EFFECTS ---
  
  // 1. Mobile Ambient Glow Orbit
  const ambientGlow = document.getElementById('ambient-glow');
  if (ambientGlow) {
    // Make the glow follow a random complex orbit
    gsap.to(ambientGlow, {
      x: () => Math.random() * (window.innerWidth - 300),
      y: () => Math.random() * (window.innerHeight - 300),
      duration: 8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      onRepeat: function() {
        gsap.to(ambientGlow, {
          x: () => Math.random() * (window.innerWidth - 300),
          y: () => Math.random() * (window.innerHeight - 300),
          duration: 8,
          ease: 'sine.inOut'
        });
      }
    });
  }

  // 2. Touch-Based Triggers for Buttons (Pulse Effect)
  const interactiveElements = document.querySelectorAll('a, button, [data-interactive]');
  interactiveElements.forEach(el => {
    el.addEventListener('touchstart', () => {
      gsap.to(el, { scale: 0.95, duration: 0.1, ease: 'power2.out' });
    });
    el.addEventListener('touchend', () => {
      gsap.to(el, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
    });
  });
} // End of isTouchDevice logic

// Navigation Menu Logic
const menuToggle = document.querySelector('.menu-toggle');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const navFooter = document.querySelector('.nav-footer');
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    menuToggle.classList.toggle('active');
    navOverlay.classList.toggle('active');

    if (isMenuOpen) {
      gsap.to(navLinks, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.2
      });
      gsap.to(navFooter, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power4.out',
        delay: 0.5
      });
    } else {
      gsap.to(navLinks, {
        y: 50,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      });
      gsap.to(navFooter, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      });
    }
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Page Transition Logic
  const pageCurtain = document.querySelector('.page-transition');
  
  // Intro Animation on Load
  gsap.to(pageCurtain, {
    yPercent: -100,
    duration: 1,
    ease: 'power4.inOut',
    delay: 0.2
  });

  // Outro Animation on Click
  document.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      // Only transition if it's an internal link and not a hash
      if (href && href.startsWith('#') === false && href.startsWith('http') === false && anchor.target !== '_blank') {
        e.preventDefault();
        if (isMenuOpen) toggleMenu();
        
        gsap.to(pageCurtain, {
          yPercent: 0, // Reset to cover screen
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => {
            window.location.href = href;
          }
        });
      }
    });
  });

  // Magnetic Hover Effect for Buttons and Links
  const magneticElements = document.querySelectorAll('a, button, .social-icon');
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      gsap.to(el, { x: x, y: y, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    });
  });

// Global GSAP Setup
gsap.registerPlugin(ScrollTrigger);

// Text Reveal Utility
document.querySelectorAll('.section-title, .identity-desc, .section-desc').forEach(text => {
  gsap.fromTo(text, 
    { y: 50, opacity: 0, rotationX: -20, filter: 'blur(10px)' },
    {
      y: 0,
      opacity: 1,
      rotationX: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: text,
        start: 'top 90%',
      }
    }
  );
});

// 1. Hero Animations & Floating Tech
const heroTimeline = gsap.timeline();
heroTimeline.fromTo('.hero-title', 
  { y: 100, opacity: 0, filter: 'blur(10px)' },
  { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power4.out', delay: 0.2 }
)
.fromTo('.hero-badge',
  { y: 20, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
  "-=1"
);

// Parallax Hero
gsap.to('.hero-content', {
  yPercent: 30,
  opacity: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

// Horizontal Scrolling Logic (for works.html)
const horizontalContainer = document.querySelector('.horizontal-container');
if (horizontalContainer) {
  const panels = gsap.utils.toArray('.horizontal-panel');
  
  gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".horizontal-wrapper",
      pin: true,
      scrub: 1,
      snap: 1 / (panels.length - 1),
      end: () => "+=" + horizontalContainer.offsetWidth
    }
  });
}

// // Generate Floating Tech Background Elements
const floatContainer = document.getElementById('floating-tech');
if (floatContainer) {
  const floatingIcons = ['react', 'nodedotjs', 'html5', 'css3', 'javascript', 'dart'];

  floatingIcons.forEach((slug, i) => {
    const el = document.createElement('div');
    el.className = 'float-icon';
    // Random positions
    const top = Math.random() * 80 + 10;
    const left = Math.random() * 80 + 10;
    el.style.top = `${top}%`;
    el.style.left = `${left}%`;
    
    fetch(`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`)
      .then(res => res.text())
      .then(svgText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const path = doc.querySelector('path').getAttribute('d');
        if (path) {
          el.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%; height:100%;"><path d="${path}"></path></svg>`;
          floatContainer.appendChild(el);
          
          // Floating animation
          gsap.to(el, {
            y: () => (Math.random() * 100 - 50),
            x: () => (Math.random() * 100 - 50),
            rotation: () => (Math.random() * 90 - 45),
            duration: () => (Math.random() * 10 + 10),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 5
          });
          
          // Parallax on mouse move
          window.addEventListener("mousemove", (e) => {
            if (isTouchDevice) return;
            const xPos = (e.clientX / window.innerWidth - 0.5) * 40;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 40;
            gsap.to(el, {
              x: `+=${xPos}`,
              y: `+=${yPos}`,
              duration: 2,
              ease: 'power2.out'
            });
          });
        }
      });
  });
}

// Identity Section Animation
if (document.querySelector('.identity-text')) {
  gsap.fromTo('.identity-text',
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.identity', start: 'top 70%' } }
  );

  gsap.fromTo('.identity-stack',
    { x: 50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.identity', start: 'top 70%' } }
  );
}

// 2. Skills Section logic
const skillsData = [
  { name: 'React', color: '#61DAFB', path: 'M22.65 14.39L12 22.13 1.35 14.39 5.4 2.15h13.2l4.05 12.24z' }, // Simplified path, we'll use unpkg for accurate SVGs
];

// Instead of hardcoding all SVG paths in vanilla JS which is huge, we will use SimpleIcons CDN via image or fetch, or just simple inline paths.
// To save space and ensure accuracy, we will use the actual SVG data from simple-icons CDN via jsdelivr.
const skills = [
  { slug: 'react', color: '#61DAFB' },
  { slug: 'nodedotjs', color: '#339933' },
  { slug: 'html5', color: '#E34F26' },
  { slug: 'css3', color: '#1572B6' },
  { slug: 'javascript', color: '#F7DF1E' },
  { slug: 'flutter', color: '#02569B' },
  { slug: 'dart', color: '#0175C2' },
  { slug: 'adobephotoshop', color: '#31A8FF', fallbackPath: "M0 0v24h24v-24h-24zm14.7 15.5c-1.2 1.3-3.1 1.6-4.5 1.6v2.9h-2.1v-14h4.8c3.2 0 4.8 1.4 4.8 3.5 0 2.2-1.6 3.6-4 3.6h-2.5v3.4c.8 0 1.9-.1 2.6-.9.6-.6 1.1-1.6 1.1-2.9h1.9c-.1 1.5-.9 2.8-2.1 2.8zm-4.5-9.2v4.4h2.5c1.1 0 1.9-.6 1.9-2.2s-.8-2.2-1.9-2.2h-2.5zm11.2 9.5c0 1.9-1.3 3.6-3.8 3.6-2.1 0-3.3-1.1-3.6-2.5h2.1c.1.5.7 1.1 1.6 1.1 1.1 0 1.6-.7 1.6-1.5 0-2.3-5.3-1.2-5.3-5 0-1.8 1.4-3.3 3.6-3.3 1.9 0 3 1.1 3.3 2.2h-2c-.1-.5-.6-1-1.3-1-1 0-1.5.6-1.5 1.3 0 2.1 5.3 1.2 5.3 5.1z" },
  { slug: 'adobeaftereffects', color: '#9999FF', fallbackPath: "M0 0v24h24v-24h-24zm6.6 19h-2.3l4.3-12.8h2.6l4.3 12.8h-2.4l-1.1-3.4h-4.3l-1.1 3.4zm4.8-10.7l-1.6 4.9h3.2l-1.6-4.9zm10 8.3c0 1.8-1.5 3.3-4.2 3.3-2.6 0-4-1.5-4-3.5 0-2.3 1.6-3.7 3.8-3.7.8 0 1.6.2 2.2.6v-2h-3.9v-2.1h6.1v7.4zm-6.1-.7c0 1.1.9 1.6 2.1 1.6s2.1-.5 2.1-1.6c0-1.1-1.3-1.3-2.1-1.3-1 0-2.1.2-2.1 1.3z" },
  { slug: 'davinciresolve', color: '#ffffff' } // white glow for resolve
];

const skillsRing = document.getElementById('skills-ring');

if (skillsRing) {
  skills.forEach((skill, index) => {
    const angle = (index / skills.length) * (2 * Math.PI);
    
    // Create item container
    const item = document.createElement('div');
    item.className = 'skill-item';
    item.setAttribute('data-interactive', 'true');
    
    // Calculate position (handled by JS for responsiveness but initially set here)
    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? 120 : 200; // Reduced from 300 to 200 to avoid text intersection
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    item.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

    // Tooltip
    item.title = skill.slug.toUpperCase();
    
    // Icon wrapper
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'skill-icon-wrapper';
    
    // Fetch SVG
    if (skill.slug === 'davinciresolve') {
      // generic simple icon for resolve fallback
      iconWrapper.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>`;
    } else {
      fetch(`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${skill.slug}.svg`)
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.text();
        })
        .then(svgText => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, 'image/svg+xml');
          const path = doc.querySelector('path');
          if (path) {
            const d = path.getAttribute('d');
            iconWrapper.innerHTML = `<svg viewBox="0 0 24 24"><path d="${d}"></path></svg>`;
          }
        })
        .catch(() => {
          if(skill.fallbackPath) {
             iconWrapper.innerHTML = `<svg viewBox="0 0 24 24"><path d="${skill.fallbackPath}"></path></svg>`;
          }
        });
    }
    
    // Magnetic Hover Effect for skills
    item.addEventListener('mouseenter', (e) => {
      iconWrapper.style.boxShadow = `0 0 20px ${skill.color}`;
      const svg = iconWrapper.querySelector('svg');
      if(svg) svg.style.fill = skill.color;
      
      gsap.to(cursorDot, { opacity: 0, duration: 0.2 });
      gsap.to(cursorFollower, { width: '60px', height: '60px', backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'transparent', duration: 0.2 });
    });
    
    item.addEventListener('mouseleave', (e) => {
      iconWrapper.style.boxShadow = `0 0 0px rgba(0,0,0,0)`;
      const svg = iconWrapper.querySelector('svg');
      if(svg) svg.style.fill = 'rgba(255,255,255,0.5)';
      
      gsap.to(item, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      gsap.to(cursorDot, { opacity: 1, duration: 0.2 });
      gsap.to(cursorFollower, { width: '40px', height: '40px', backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.4)', duration: 0.2 });
    });

    item.addEventListener('mousemove', (e) => {
      if (isTouchDevice) return;
      const rect = item.getBoundingClientRect();
      const itemX = rect.left + rect.width / 2;
      const itemY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - itemX;
      const distanceY = e.clientY - itemY;
      
      gsap.to(item, {
        x: distanceX * 0.4,
        y: distanceY * 0.4,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    item.appendChild(iconWrapper);
    skillsRing.appendChild(item);
  });

  // 3. Auto-Rotating Skills Ring for Mobile
  if (isTouchDevice) {
    gsap.to(skillsRing, {
      rotation: 360,
      duration: 25,
      ease: "none",
      repeat: -1
    });
    
    // Counter-rotate the items so they stay upright
    const items = skillsRing.querySelectorAll('.skill-item');
    gsap.to(items, {
      rotation: -360,
      duration: 25,
      ease: "none",
      repeat: -1
    });
  }
}

// Update positions on resize
window.addEventListener('resize', () => {
  const isMobile = window.innerWidth < 768;
  const radius = isMobile ? 120 : 200;
  const items = document.querySelectorAll('.skill-item');
  items.forEach((item, index) => {
    const angle = (index / skills.length) * (2 * Math.PI);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    item.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  });
});

// Skills Animation (Parallax instead of pinning)
gsap.to('.skills-ring', {
  yPercent: 20,
  ease: 'none',
  scrollTrigger: {
    trigger: '.skills',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});

const items = document.querySelectorAll('.skill-item');

// Rotation
const rotationTween = gsap.to('.skills-ring', {
  rotation: 360,
  duration: 40,
  repeat: -1,
  ease: 'none'
});

// Counter-rotate items
let counterTween;
// We need to wait a tick for items to be generated or select them dynamically
setTimeout(() => {
  const dynamicItems = document.querySelectorAll('.skill-item');
  counterTween = gsap.to(dynamicItems, {
    rotation: -360,
    duration: 40,
    repeat: -1,
    ease: 'none'
  });
}, 100);

const onRingEnter = () => {
  gsap.to([rotationTween, counterTween], { timeScale: 0.2, duration: 1 });
};
const onRingLeave = () => {
  gsap.to([rotationTween, counterTween], { timeScale: 1, duration: 1 });
};

skillsRing.addEventListener('mouseenter', onRingEnter);
skillsRing.addEventListener('mouseleave', onRingLeave);

// 3. Projects Section
const projectsData = [
  {
    name: "Jeevaa Group",
    description: "Official website developed by Infidevs",
    link: "https://www.jeevaagroup.com/"
  }
];

const projectsGrid = document.getElementById('projects-grid');

projectsData.forEach(project => {
  const card = document.createElement('a');
  card.href = project.link;
  card.target = "_blank";
  card.className = "project-card"; // Removed glass and spotlight-card
  card.setAttribute('data-interactive', 'true');
  
  card.innerHTML = `
    <div class="project-info">
      <h3>${project.name}</h3>
      <p>${project.description}</p>
    </div>
    <div class="project-link-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
      </svg>
    </div>
  `;
  
  projectsGrid.appendChild(card);
});

// Floating Image Reveal Removed


// Animate projects on scroll
gsap.utils.toArray('.project-card').forEach((card, i) => {
  gsap.fromTo(card,
    { y: 150, opacity: 0, rotationX: 10, filter: 'blur(10px)' },
    {
      y: 0, 
      opacity: 1, 
      rotationX: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
      }
    }
  );
});

// 4. Infidevs Section
gsap.fromTo('.infidevs-content',
  { scale: 0.8, opacity: 0, filter: 'blur(20px)' },
  {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 1.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.infidevs',
      start: 'top 80%',
    }
  }
);
