/* ===========================
   PARTICLES BACKGROUND
=========================== */
function initParticles() {
    if (!window.particlesJS) return;

    const isMobile = window.innerWidth < 768;

    setTimeout(() => {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: isMobile ? 30 : 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#64ffda'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5
                },
                size: {
                    value: 3,
                    random: true
                },
                lineLinked: {
                    enable: !isMobile,
                    distance: 150,
                    color: '#64ffda',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: isMobile ? 1 : 2
                }
            },
            interactivity: {
                events: {
                    onHover: {
                        enable: !isMobile,
                        mode: 'repulse'
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }, 300);
}

/* ===========================
   SCROLL PROGRESS BAR
=========================== */
function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.appendChild(progressBar);

    function updateProgressBar() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();
}

/* ===========================
   GLITCH EFFECT
=========================== */
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    glitchElements.forEach(element => {
        const text = element.getAttribute('data-text');
        if (text) {
            element.setAttribute('data-text', text);
        }
    });
}

/* ===========================
   INITIALIZATION
=========================== */
function initBase() {
    initParticles();
    initProgressBar();
    initGlitchEffect();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBase);
} else {
    initBase();
}