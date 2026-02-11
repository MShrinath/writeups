/* ===========================
   PARTICLES BACKGROUND
=========================== */
function initParticles() {
    if (!window.particlesJS) return;

    setTimeout(() => {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
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
                    enable: true,
                    distance: 150,
                    color: '#64ffda',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2
                }
            },
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
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
   SMOOTH SCROLL FOR TOC
=========================== */
function initSmoothScroll() {
    const tocLinks = document.querySelectorAll('.toc-item');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===========================
   HIGHLIGHT ACTIVE TOC ITEM
=========================== */
function initTOCHighlight() {
    const challenges = document.querySelectorAll('.challenge-writeup');
    const tocItems = document.querySelectorAll('.toc-item');
    
    if (challenges.length === 0 || tocItems.length === 0) return;

    function highlightTOC() {
        let current = '';
        
        challenges.forEach(challenge => {
            const challengeTop = challenge.offsetTop;
            const challengeHeight = challenge.clientHeight;
            
            if (window.pageYOffset >= challengeTop - 150) {
                current = challenge.getAttribute('id');
            }
        });

        tocItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightTOC);
    highlightTOC(); // Initial call
}

/* ===========================
   COPY CODE FUNCTIONALITY
=========================== */
window.copyCode = function(btn) {
    const codeBlock = btn.closest('.code-block').querySelector('code');
    const textToCopy = codeBlock.textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.background = 'var(--green)';
        btn.style.color = 'var(--bg-dark)';
        btn.style.borderColor = 'var(--green)';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        btn.innerHTML = '<i class="fas fa-times"></i> Failed';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
};

/* ===========================
   COPY FLAG FUNCTIONALITY
=========================== */
window.copyFlag = function(btn) {
    const flagText = btn.previousElementSibling.textContent;
    
    navigator.clipboard.writeText(flagText).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = 'var(--green)';
        btn.style.color = 'var(--bg-dark)';
        btn.style.borderColor = 'var(--green)';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy flag:', err);
    });
};

/* ===========================
   SCROLL PROGRESS BAR
=========================== */
function initProgressBar() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #64ffda, #4dabf7);
        z-index: 9999;
        width: 0%;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    // Update progress bar on scroll
    function updateProgressBar() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar(); // Initial call
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
   LAZY LOAD IMAGES
=========================== */
function initLazyLoad() {
    const images = document.querySelectorAll('.achievement-image img, .ctf-card img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

/* ===========================
   ANIMATE ON SCROLL
=========================== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.ctf-card, .challenge-writeup');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/* ===========================
   INITIALIZATION
=========================== */
function init() {
    // Initialize particles background
    initParticles();
    
    // Initialize smooth scroll and TOC (writeup page)
    initSmoothScroll();
    initTOCHighlight();
    
    // Initialize progress bar
    initProgressBar();
    
    // Initialize glitch effect
    initGlitchEffect();
    
    // Initialize lazy loading
    initLazyLoad();
    
    // Initialize scroll animations
    initScrollAnimations();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}