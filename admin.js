let challengeCount = 0;
let generatedHTML = '';

function addChallenge() {
    challengeCount++;
    const container = document.getElementById('challengesContainer');
    
    const challengeDiv = document.createElement('div');
    challengeDiv.className = 'challenge-item';
    challengeDiv.id = `challenge-${challengeCount}`;
    
    challengeDiv.innerHTML = `
        <div class="challenge-header">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div class="challenge-number">${challengeCount}</div>
                <h3 class="collapsible" onclick="toggleCollapse(${challengeCount})">
                    Challenge ${challengeCount} <i class="fas fa-chevron-down"></i>
                </h3>
            </div>
            <button class="btn btn-danger" onclick="removeChallenge(${challengeCount})">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <div class="collapse-content active" id="collapse-${challengeCount}">
            <div class="form-row">
                <div class="form-group">
                    <label>Challenge Name *</label>
                    <input type="text" id="ch${challengeCount}-name" placeholder="e.g., Web Gauntlet">
                </div>

                <div class="form-group">
                    <label>Category *</label>
                    <select id="ch${challengeCount}-category">
                        <option value="web">Web</option>
                        <option value="crypto">Crypto</option>
                        <option value="forensics">Forensics</option>
                        <option value="reverse">Reverse</option>
                        <option value="pwn">PWN</option>
                        <option value="osint">OSINT</option>
                        <option value="steganography">Steganography</option>
                        <option value="misc">Misc</option>
                        <option value="network">Network</option>
                        <option value="malware">Malware</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Points</label>
                    <input type="number" id="ch${challengeCount}-points" placeholder="100">
                </div>
            </div>

            <div class="form-group">
                <label>Description *</label>
                <textarea id="ch${challengeCount}-description" placeholder="Challenge description..." rows="2"></textarea>
            </div>

            <div class="form-group">
                <label>Files/Links (one per line)</label>
                <textarea id="ch${challengeCount}-files" placeholder="file.txt&#10;http://challenge.com" rows="2"></textarea>
            </div>

            <div class="form-group">
                <label>Solution Steps</label>
                <div id="ch${challengeCount}-steps"></div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="btn btn-secondary" onclick="addStep(${challengeCount}, 'text')">
                        <i class="fas fa-paragraph"></i> Add Text
                    </button>
                    <button class="btn btn-secondary" onclick="addStep(${challengeCount}, 'heading')">
                        <i class="fas fa-heading"></i> Add Heading
                    </button>
                    <button class="btn btn-secondary" onclick="addStep(${challengeCount}, 'code')">
                        <i class="fas fa-code"></i> Add Code
                    </button>
                    <button class="btn btn-secondary" onclick="addStep(${challengeCount}, 'image')">
                        <i class="fas fa-image"></i> Add Image
                    </button>
                </div>
            </div>

            <div class="form-group">
                <label>Flag *</label>
                <input type="text" id="ch${challengeCount}-flag" placeholder="CTF{...}">
            </div>
        </div>
    `;
    
    container.appendChild(challengeDiv);
}

let stepCounters = {};

function addStep(challengeId, type) {
    if (!stepCounters[challengeId]) stepCounters[challengeId] = 0;
    stepCounters[challengeId]++;
    
    const stepsContainer = document.getElementById(`ch${challengeId}-steps`);
    const stepDiv = document.createElement('div');
    stepDiv.className = 'solution-step';
    stepDiv.id = `ch${challengeId}-step${stepCounters[challengeId]}`;
    
    let content = '';
    
    if (type === 'text') {
        content = `
            <label>Text Content</label>
            <textarea class="step-data" data-type="text" placeholder="Your explanation here..." rows="3"></textarea>
        `;
    } else if (type === 'heading') {
        content = `
            <label>Heading</label>
            <input type="text" class="step-data" data-type="heading" placeholder="Step 1: Initial Analysis">
        `;
    } else if (type === 'code') {
        content = `
            <label>Language</label>
            <select class="step-lang" style="margin-bottom: 10px;">
                <option value="bash">Bash</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="sql">SQL</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="php">PHP</option>
            </select>
            <label>Code</label>
            <textarea class="step-data" data-type="code" placeholder="Your code here..." rows="4"></textarea>
        `;
    } else if (type === 'image') {
        content = `
            <label>Image Path</label>
            <input type="text" class="step-data" data-type="image" placeholder="images/screenshot.png">
            <label style="margin-top: 10px;">Caption (optional)</label>
            <input type="text" class="step-caption" placeholder="Screenshot description">
        `;
    }
    
    stepDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="color: var(--primary);">${type.toUpperCase()} Step</strong>
            <button class="btn btn-danger" onclick="this.closest('.solution-step').remove()" style="padding: 6px 12px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
        ${content}
    `;
    
    stepsContainer.appendChild(stepDiv);
}

function removeChallenge(id) {
    const challenge = document.getElementById(`challenge-${id}`);
    if (challenge) {
        challenge.remove();
    }
}

function toggleCollapse(id) {
    const content = document.getElementById(`collapse-${id}`);
    content.classList.toggle('active');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateWriteup() {
    // Get CTF info
    const ctfData = {
        name: document.getElementById('ctfName').value,
        date: document.getElementById('ctfDate').value,
        total_challenges: document.getElementById('totalChallenges').value,
        rank: document.getElementById('rank').value,
        team: document.getElementById('team').value,
        overview: document.getElementById('overview').value
    };

    if (!ctfData.name || !ctfData.overview) {
        alert('Please fill in CTF Name and Overview!');
        return;
    }

    // Get challenges
    const challenges = [];
    const challengeElements = document.querySelectorAll('.challenge-item');
    
    challengeElements.forEach((elem, index) => {
        const id = elem.id.split('-')[1];
        
        const challenge = {
            name: document.getElementById(`ch${id}-name`).value,
            category: document.getElementById(`ch${id}-category`).value,
            points: document.getElementById(`ch${id}-points`).value,
            description: document.getElementById(`ch${id}-description`).value,
            files: document.getElementById(`ch${id}-files`).value.split('\n').filter(f => f.trim()),
            flag: document.getElementById(`ch${id}-flag`).value,
            solution: []
        };

        // Get solution steps
        const steps = document.querySelectorAll(`#ch${id}-steps .solution-step`);
        steps.forEach(step => {
            const dataElem = step.querySelector('.step-data');
            const type = dataElem.dataset.type;
            
            if (type === 'code') {
                const lang = step.querySelector('.step-lang').value;
                challenge.solution.push({
                    type: 'code',
                    language: lang,
                    content: dataElem.value
                });
            } else if (type === 'image') {
                const caption = step.querySelector('.step-caption').value;
                challenge.solution.push({
                    type: 'image',
                    path: dataElem.value,
                    caption: caption
                });
            } else {
                challenge.solution.push({
                    type: type,
                    content: dataElem.value
                });
            }
        });

        if (challenge.name && challenge.description && challenge.flag) {
            challenges.push(challenge);
        }
    });

    if (challenges.length === 0) {
        alert('Please add at least one challenge!');
        return;
    }

    // Generate HTML
    generatedHTML = generateHTML(ctfData, challenges);
    
    // Copy to clipboard
    navigator.clipboard.writeText(generatedHTML).then(() => {
        const msg = document.getElementById('successMessage');
        msg.style.display = 'block';
        setTimeout(() => {
            msg.style.display = 'none';
        }, 5000);
        
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
}

function generateHTML(ctf, challenges) {
    // Build TOC
    let toc = '';
    challenges.forEach((ch, i) => {
        toc += `                        <a href="#challenge-${i+1}" class="toc-item">
                    <span class="toc-number">${String(i+1).padStart(2, '0')}</span>
                    <span class="toc-title">${escapeHtml(ch.name)}</span>
                    <span class="toc-category">${ch.category.charAt(0).toUpperCase() + ch.category.slice(1)}</span>
                </a>\n`;
    });

    // Build challenges HTML
    let challengesHTML = '';
    challenges.forEach((ch, i) => {
        let filesHTML = '';
        if (ch.files.length > 0) {
            filesHTML = '                        <div class="challenge-files">\n';
            ch.files.forEach(file => {
                const icon = file.startsWith('http') ? 'fas fa-link' : 'fas fa-file';
                filesHTML += `                            <span class="file-tag"><i class="${icon}"></i> ${escapeHtml(file)}</span>\n`;
            });
            filesHTML += '                        </div>\n';
        }

        let solutionHTML = '';
        ch.solution.forEach(step => {
            if (step.type === 'text') {
                solutionHTML += `                        <p>${escapeHtml(step.content)}</p>\n`;
            } else if (step.type === 'heading') {
                solutionHTML += `                        <h4>${escapeHtml(step.content)}</h4>\n`;
            } else if (step.type === 'code') {
                solutionHTML += `                        <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">${step.language.charAt(0).toUpperCase() + step.language.slice(1)}</span>
                        <button class="copy-btn" onclick="copyCode(this)">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <pre><code class="language-${step.language}">${escapeHtml(step.content)}</code></pre>
                </div>\n`;
            } else if (step.type === 'image') {
                solutionHTML += `                        <div class="image-wrapper">
                    <img src="${escapeHtml(step.path)}" alt="${escapeHtml(step.caption)}" class="screenshot">
                    ${step.caption ? `<div class="image-caption">${escapeHtml(step.caption)}</div>` : ''}
                </div>\n`;
            }
        });

        challengesHTML += `                <div id="challenge-${i+1}" class="challenge-writeup">
            <div class="challenge-header">
                <div class="challenge-number">${String(i+1).padStart(2, '0')}</div>
                <div class="challenge-title-group">
                    <h2>${escapeHtml(ch.name)}</h2>
                    <div class="challenge-meta">
                        <span class="category-badge ${ch.category}">${ch.category.charAt(0).toUpperCase() + ch.category.slice(1)}</span>
                        <span class="points-badge">${ch.points || '?'} points</span>
                    </div>
                </div>
            </div>

            <div class="challenge-description">
                <h3><i class="fas fa-file-alt"></i> Challenge Description</h3>
                <p>${escapeHtml(ch.description)}</p>
${filesHTML}                    </div>

            <div class="writeup-content">
                <h3><i class="fas fa-lightbulb"></i> Solution</h3>
${solutionHTML}                    </div>

            <div class="flag-section">
                <h3><i class="fas fa-flag"></i> Flag</h3>
                <div class="flag-box">
                    <code>${escapeHtml(ch.flag)}</code>
                    <button class="copy-btn" onclick="copyFlag(this)">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
        </div>

`;
    });

    // Full HTML template
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(ctf.name)} Writeup | mshrinath</title>
<meta name="description" content="Detailed writeup for ${escapeHtml(ctf.name)} challenges" />
<link rel="stylesheet" href="writeups-style.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js" defer></script>
<script src="writeups-script.js" defer></script>
</head>
<body>
<div id="particles-js"></div>

<header class="main-header">
<div class="container">
    <div class="header-content">
        <a href="/writeups" class="back-link">
            <i class="fas fa-arrow-left"></i>
            <span>Back to CTFs</span>
        </a>
        <a href="/" class="nav-link">
            <i class="fas fa-home"></i>
        </a>
    </div>
</div>
</header>

<main>
<section class="writeup-header">
    <div class="container">
        <div class="breadcrumb">
            <a href="/writeups">CTF Writeups</a>
            <i class="fas fa-chevron-right"></i>
            <span>${escapeHtml(ctf.name)}</span>
        </div>
        
        <h1 class="glitch-text" data-text="${escapeHtml(ctf.name)}">${escapeHtml(ctf.name)}</h1>
        
        <div class="writeup-meta-grid">
            <div class="meta-card">
                <i class="far fa-calendar"></i>
                <div class="meta-content">
                    <span class="meta-label">Date</span>
                    <span class="meta-value">${escapeHtml(ctf.date)}</span>
                </div>
            </div>
            <div class="meta-card">
                <i class="fas fa-flag-checkered"></i>
                <div class="meta-content">
                    <span class="meta-label">Solved</span>
                    <span class="meta-value">${challenges.length} / ${ctf.total_challenges || '?'}</span>
                </div>
            </div>
            <div class="meta-card">
                <i class="fas fa-trophy"></i>
                <div class="meta-content">
                    <span class="meta-label">Rank</span>
                    <span class="meta-value">${escapeHtml(ctf.rank) || 'N/A'}</span>
                </div>
            </div>
            <div class="meta-card">
                <i class="fas fa-users"></i>
                <div class="meta-content">
                    <span class="meta-label">Team</span>
                    <span class="meta-value">${escapeHtml(ctf.team) || 'Solo'}</span>
                </div>
            </div>
        </div>

        <div class="overview-box">
            <h2>Overview</h2>
            <p>${escapeHtml(ctf.overview)}</p>
        </div>

        <div class="toc-box">
            <h3><i class="fas fa-list"></i> Challenges Solved</h3>
            <nav class="toc-nav">
${toc}                    </nav>
        </div>
    </div>
</section>

<section class="challenges-section">
    <div class="container">
${challengesHTML}            </div>
</section>

<section class="writeup-navigation">
    <div class="container">
        <a href="/writeups" class="nav-btn">
            <i class="fas fa-arrow-left"></i>
            Back to All CTFs
        </a>
    </div>
</section>
</main>

<footer>
<div class="container">
    <div class="footer-content">
        <p>&copy; 2026 mshrinath</p>
        <div class="footer-links">
            <a href="/">Portfolio</a>
            <span class="separator">•</span>
            <a href="/writeups">CTF Writeups</a>
        </div>
    </div>
</div>
</footer>

<scrip>
hljs.highlightAll();

function copyCode(btn) {
    const codeBlock = btn.closest('.code-block').querySelector('code');
    navigator.clipboard.writeText(codeBlock.textContent);
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
    }, 2000);
}

function copyFlag(btn) {
    const flagText = btn.previousElementSibling.textContent;
    navigator.clipboard.writeText(flagText);
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-copy"></i>';
    }, 2000);
}
</script>
</body>
</html>`;
}

function downloadHTML() {
    if (!generatedHTML) {
        alert('Generate the writeup first!');
        return;
    }

    const ctfName = document.getElementById('ctfName').value.toLowerCase().replace(/\s+/g, '_');
    const filename = `${ctfName}_writeup.html`;
    
    const blob = new Blob([generatedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function clearAll() {
    if (confirm('Are you sure? This will clear all data!')) {
        document.getElementById('ctfName').value = '';
        document.getElementById('ctfDate').value = '';
        document.getElementById('totalChallenges').value = '';
        document.getElementById('rank').value = '';
        document.getElementById('team').value = '';
        document.getElementById('overview').value = '';
        document.getElementById('challengesContainer').innerHTML = '';
        challengeCount = 0;
        stepCounters = {};
        generatedHTML = '';
    }
}

// Add first challenge on load
window.onload = () => {
    addChallenge();
};