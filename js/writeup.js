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
        
        challenges.forEach((challenge) => {
            const challengeTop = challenge.offsetTop;
            
            if (window.pageYOffset >= challengeTop - 150) {
                current = challenge.getAttribute('id');
            }
        });

        tocItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.style.background = 'rgba(100, 255, 218, 0.15)';
            } else {
                item.style.background = '';
            }
        });
    }

    window.addEventListener('scroll', highlightTOC);
    highlightTOC();
}

/* ===========================
   COPY CODE FUNCTIONALITY
=========================== */
function copyCode(btn) {
    const codeBlock = btn.closest('.code-block').querySelector('code');
    const textToCopy = codeBlock.textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.background = '#51cf66';
        btn.style.color = '#020c1b';
        btn.style.borderColor = '#51cf66';
        
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
}

/* ===========================
   COPY FLAG FUNCTIONALITY
=========================== */
function copyFlag(btn) {
    const flagText = btn.previousElementSibling.textContent;
    
    navigator.clipboard.writeText(flagText).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = '#51cf66';
        btn.style.color = '#020c1b';
        btn.style.borderColor = '#51cf66';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy flag:', err);
    });
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

    const animateElements = document.querySelectorAll('.challenge-writeup');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/* ===========================
   SYNTAX HIGHLIGHTING
=========================== */
function initSyntaxHighlighting() {
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
}

/* ===========================
   INITIALIZATION
=========================== */
function initWriteup() {
    initSmoothScroll();
    initTOCHighlight();
    initScrollAnimations();
    initSyntaxHighlighting();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWriteup);
} else {
    initWriteup();
}