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
                    <select id="ch${challengeCount}-category" onchange="toggleCustomCategory(${challengeCount})">
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
                        <option value="others">Others</option>
                    </select>
                    <input type="text" id="ch${challengeCount}-custom-category" placeholder="Enter custom category" style="display: none; margin-top: 10px;">
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
            <label>Image Type</label>
            <select class="step-image-type" onchange="updateImageInputs(${challengeId}, ${stepCounters[challengeId]})" style="margin-bottom: 10px;">
                <option value="single">Single Image (with caption)</option>
                <option value="terminal">Terminal Screenshot</option>
                <option value="grid">Image Grid (side-by-side)</option>
            </select>
            <div class="image-inputs-container">
                <label>Image Path</label>
                <input type="text" class="step-data" data-type="image" placeholder="images/screenshot.png">
                <label style="margin-top: 10px;">Caption (optional)</label>
                <input type="text" class="step-caption" placeholder="Screenshot description">
            </div>
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

function toggleCustomCategory(challengeId) {
    const select = document.getElementById(`ch${challengeId}-category`);
    const customInput = document.getElementById(`ch${challengeId}-custom-category`);
    
    if (select.value === 'others') {
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
        customInput.value = '';
    }
}

function toggleTeamNameInput() {
    const select = document.getElementById('ctfTeam');
    const teamNameInput = document.getElementById('ctfTeamName');
    teamNameInput.style.display = select.value === 'team' ? 'block' : 'none';
    if (select.value === 'solo') teamNameInput.value = '';
}

function toggleIndexTeamNameInput() {
    const select = document.getElementById('indexType');
    const teamNameInput = document.getElementById('indexTeamName');
    teamNameInput.style.display = select.value === 'team' ? 'block' : 'none';
    if (select.value === 'solo') teamNameInput.value = '';
}

function updateImageInputs(challengeId, stepId) {
    const stepDiv = document.getElementById(`ch${challengeId}-step${stepId}`);
    const imageType = stepDiv.querySelector('.step-image-type').value;
    const container = stepDiv.querySelector('.image-inputs-container');
    
    let html = '';
    
    if (imageType === 'single') {
        html = `
            <label>Image Path</label>
            <input type="text" class="step-data" data-type="image" placeholder="images/screenshot.png">
            <label style="margin-top: 10px;">Caption (optional)</label>
            <input type="text" class="step-caption" placeholder="Screenshot description">
        `;
    } else if (imageType === 'terminal') {
        html = `
            <label>Terminal Screenshot Path</label>
            <input type="text" class="step-data" data-type="image" data-subtype="terminal" placeholder="images/terminal.png">
        `;
    } else if (imageType === 'grid') {
        html = `
            <label>Number of Images (2-4)</label>
            <input type="number" class="grid-count" value="2" min="2" max="4" onchange="updateGridInputs(${challengeId}, ${stepId})" style="margin-bottom: 10px;">
            <div class="grid-images-container">
                <label>Image 1 Path</label>
                <input type="text" class="grid-image" data-index="0" placeholder="images/img1.png" style="margin-bottom: 10px;">
                <label>Image 2 Path</label>
                <input type="text" class="grid-image" data-index="1" placeholder="images/img2.png">
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function updateGridInputs(challengeId, stepId) {
    const stepDiv = document.getElementById(`ch${challengeId}-step${stepId}`);
    const count = parseInt(stepDiv.querySelector('.grid-count').value);
    const gridContainer = stepDiv.querySelector('.grid-images-container');
    
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <label>Image ${i + 1} Path</label>
            <input type="text" class="grid-image" data-index="${i}" placeholder="images/img${i + 1}.png" style="margin-bottom: ${i < count - 1 ? '10px' : '0'};">
        `;
    }
    
    gridContainer.innerHTML = html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateIndexCard() {
    const ctfName = document.getElementById('ctfName').value;
    const ctfMonth = document.getElementById('ctfMonth').value;
    const ctfYear = document.getElementById('ctfYear').value;
    const ctfOverview = document.getElementById('ctfOverview').value;
    const ctfTeam = document.getElementById('ctfTeam').value;
    
    if (!ctfName) {
        alert('Please fill CTF Name first!');
        return;
    }

    // Populate index card fields with CTF info
    document.getElementById('indexYear').value = ctfYear;
    document.getElementById('indexMonth').value = ctfMonth;
    document.getElementById('indexType').value = ctfTeam;
    const teamNameVal = document.getElementById('ctfTeamName').value;
    document.getElementById('indexTeamName').value = teamNameVal;
    document.getElementById('indexTeamName').style.display = ctfTeam === 'team' ? 'block' : 'none';
    document.getElementById('indexDescription').value = ctfOverview;
    document.getElementById('indexFilename').value = ctfName.toLowerCase().replace(/\s+/g, '_') + '_writeup.html';
    
    // Show the index card section
    const section = document.getElementById('indexCardSection');
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function generateIndexCardCode() {
    const ctfName = document.getElementById('ctfName').value;
    const year = document.getElementById('indexYear').value;
    const month = document.getElementById('indexMonth').value;
    const type = document.getElementById('indexType').value;
    const indexTeamName = document.getElementById('indexTeamName').value.trim();
    const tags = document.getElementById('indexTags').value;
    const filename = document.getElementById('indexFilename').value;
    const solvedCount = document.querySelectorAll('.challenge-item').length;

    if (!ctfName) {
        alert('Please fill in the CTF Name first!');
        return;
    }

    const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
    if (!tagsArray.length) tagsArray.push('CTF');

    const teamIcon = type === 'solo' ? 'fa-user' : 'fa-users';
    const teamText = type === 'solo' ? 'Solo Participation' : (indexTeamName ? 'Team: ' + escapeHtml(indexTeamName) : 'Team');

    let tagsHTML = '';
    for (const tag of tagsArray) {
        tagsHTML += '                            <span class="tag">' + escapeHtml(tag) + '</span>\n';
    }

    const code =
`                    <!-- ${escapeHtml(ctfName)} -->
                    <a class="ctf-card" href="${escapeHtml(filename)}" data-year="${escapeHtml(year)}">
                        <div class="ctf-header">
                            <div class="ctf-icon">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div class="ctf-badge">${solvedCount} Solved</div>
                        </div>
                        <h3 class="ctf-title">${escapeHtml(ctfName)}</h3>
                        <div class="ctf-meta">
                            <span class="meta-item">
                                <i class="far fa-calendar"></i>
                                ${escapeHtml(month)} ${escapeHtml(year)}
                            </span>
                            <span class="meta-item">
                                <i class="fas ${teamIcon}"></i>
                                ${teamText}
                            </span>
                        </div>
                        <div class="ctf-tags">
${tagsHTML}                        </div>
                        <div class="ctf-footer">
                            <span class="read-more">Read Writeup <i class="fas fa-arrow-right"></i></span>
                        </div>
                    </a>`;

    document.getElementById('outputText').textContent = code;
    document.getElementById('outputBox').style.display = 'block';
    document.getElementById('outputBox').scrollIntoView({ behavior: 'smooth' });
}

function copyOutput() {
    const text = document.getElementById('outputText').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

function generateWriteup() {
    // Get CTF info
    const ctfMonth = document.getElementById('ctfMonth').value;
    const ctfYear = document.getElementById('ctfYear').value;
    const ctfData = {
        name: document.getElementById('ctfName').value,
        date: ctfMonth + ' ' + ctfYear,
        total_challenges: document.getElementById('ctfTotal').value,
        rank: document.getElementById('ctfRank').value,
        team: document.getElementById('ctfTeam').value === 'solo' ? 'Solo' : ('Team: ' + (document.getElementById('ctfTeamName').value.trim() || 'Team')),
        overview: document.getElementById('ctfOverview').value
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
        
        let category = document.getElementById(`ch${id}-category`).value;
        if (category === 'others') {
            const customCategory = document.getElementById(`ch${id}-custom-category`).value.trim();
            category = customCategory || 'misc';
        }
        
        const challenge = {
            name: document.getElementById(`ch${id}-name`).value,
            category: category,
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
                const imageTypeSelect = step.querySelector('.step-image-type');
                const imageType = imageTypeSelect ? imageTypeSelect.value : 'single';
                
                if (imageType === 'single') {
                    const caption = step.querySelector('.step-caption');
                    challenge.solution.push({
                        type: 'image',
                        imageType: 'single',
                        path: dataElem.value,
                        caption: caption ? caption.value : ''
                    });
                } else if (imageType === 'terminal') {
                    challenge.solution.push({
                        type: 'image',
                        imageType: 'terminal',
                        path: dataElem.value
                    });
                } else if (imageType === 'grid') {
                    const gridImages = step.querySelectorAll('.grid-image');
                    const images = [];
                    gridImages.forEach(img => {
                        if (img.value.trim()) {
                            images.push(img.value.trim());
                        }
                    });
                    challenge.solution.push({
                        type: 'image',
                        imageType: 'grid',
                        images: images
                    });
                }
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
    let html = '';
    
    // Start building HTML
    html += '<!DOCTYPE html>\n';
    html += '<html lang="en">\n';
    html += '<head>\n';
    html += '    <meta charset="UTF-8">\n';
    html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '    <title>' + escapeHtml(ctf.name) + ' Writeup | mshrinath</title>\n';
    html += '    <meta name="description" content="Detailed writeup for ' + escapeHtml(ctf.name) + ' challenges" />\n';
    html += '    <link rel="stylesheet" href="/assets/css/base.css">\n';
    html += '    <link rel="stylesheet" href="/assets/css/writeup.css">\n';
    html += '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">\n';
    html += '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">\n';
    html += '    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"><\/script>\n';
    html += '    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js" defer><\/script>\n';
    html += '    <script src="/assets/js/writeup.js" defer><\/script>\n';
    html += '</head>\n';
    html += '<body>\n';
    html += '    <div id="particles-js"></div>\n\n';
    
    html += '    <header class="main-header">\n';
    html += '        <div class="container">\n';
    html += '            <div class="header-content">\n';
    html += '                <a href="/" class="back-link">\n';
    html += '                    <i class="fas fa-arrow-left"></i>\n';
    html += '                    <span>Back to CTFs</span>\n';
    html += '                </a>\n';
    html += '                <a href="/" class="nav-link">\n';
    html += '                    <i class="fas fa-home"></i> Portfolio\n';
    html += '                </a>\n';
    html += '            </div>\n';
    html += '        </div>\n';
    html += '    </header>\n\n';
    
    html += '    <main>\n';
    html += generateHeaderSection(ctf, challenges);
    html += generateChallengesSection(challenges);
    html += generateNavigationSection();
    html += '    </main>\n\n';
    
    html += generateFooter();
    html += generateScripts();
    
    html += '</body>\n';
    html += '</html>';
    
    return html;
}

function generateHeaderSection(ctf, challenges) {
    let html = '';
    
    html += '        <section class="writeup-header">\n';
    html += '            <div class="container">\n';
    html += '                <div class="breadcrumb">\n';
    html += '                    <a href="/">CTF Writeups</a>\n';
    html += '                    <i class="fas fa-chevron-right"></i>\n';
    html += '                    <span>' + escapeHtml(ctf.name) + '</span>\n';
    html += '                </div>\n\n';
    
    html += '                <h1 class="glitch-text" data-text="' + escapeHtml(ctf.name) + '">' + escapeHtml(ctf.name) + '</h1>\n\n';
    
    html += '                <div class="writeup-meta-grid">\n';
    html += '                    <div class="meta-card">\n';
    html += '                        <i class="far fa-calendar"></i>\n';
    html += '                        <div class="meta-content">\n';
    html += '                            <span class="meta-label">Date</span>\n';
    html += '                            <span class="meta-value">' + escapeHtml(ctf.date) + '</span>\n';
    html += '                        </div>\n';
    html += '                    </div>\n';
    html += '                    <div class="meta-card">\n';
    html += '                        <i class="fas fa-flag-checkered"></i>\n';
    html += '                        <div class="meta-content">\n';
    html += '                            <span class="meta-label">Solved</span>\n';
    html += '                            <span class="meta-value">' + challenges.length + ' / ' + (ctf.total_challenges || '?') + '</span>\n';
    html += '                        </div>\n';
    html += '                    </div>\n';
    html += '                    <div class="meta-card">\n';
    html += '                        <i class="fas fa-trophy"></i>\n';
    html += '                        <div class="meta-content">\n';
    html += '                            <span class="meta-label">Rank</span>\n';
    html += '                            <span class="meta-value">' + (escapeHtml(ctf.rank) || 'N/A') + '</span>\n';
    html += '                        </div>\n';
    html += '                    </div>\n';
    html += '                    <div class="meta-card">\n';
    html += '                        <i class="fas ' + (ctf.team === 'Solo' ? 'fa-user' : 'fa-users') + '"></i>\n';
    html += '                        <div class="meta-content">\n';
    html += '                            <span class="meta-label">Team</span>\n';
    html += '                            <span class="meta-value">' + (escapeHtml(ctf.team) || 'Solo') + '</span>\n';
    html += '                        </div>\n';
    html += '                    </div>\n';
    html += '                </div>\n\n';
    
    html += '                <div class="overview-box">\n';
    html += '                    <h2>Overview</h2>\n';
    html += '                    <p>' + escapeHtml(ctf.overview) + '</p>\n';
    html += '                </div>\n\n';
    
    html += '                <div class="toc-box">\n';
    html += '                    <h3><i class="fas fa-list"></i> Challenges Solved</h3>\n';
    html += '                    <nav class="toc-nav">\n';
    
    for (let i = 0; i < challenges.length; i++) {
        const ch = challenges[i];
        html += '                        <a href="#challenge-' + (i+1) + '" class="toc-item">\n';
        html += '                            <span class="toc-number">' + String(i+1).padStart(2, '0') + '</span>\n';
        html += '                            <span class="toc-title">' + escapeHtml(ch.name) + '</span>\n';
        html += '                            <span class="toc-category">' + (ch.category.charAt(0).toUpperCase() + ch.category.slice(1)) + '</span>\n';
        html += '                        </a>\n';
    }
    
    html += '                    </nav>\n';
    html += '                </div>\n';
    html += '            </div>\n';
    html += '        </section>\n\n';
    
    return html;
}

function generateChallengesSection(challenges) {
    let html = '';
    
    html += '        <section class="challenges-section">\n';
    html += '            <div class="container">\n';
    
    for (let i = 0; i < challenges.length; i++) {
        const ch = challenges[i];
        html += generateChallenge(ch, i + 1);
    }
    
    html += '            </div>\n';
    html += '        </section>\n\n';
    
    return html;
}

function generateChallenge(ch, num) {
    let html = '';
    
    html += '                <div id="challenge-' + num + '" class="challenge-writeup">\n';
    html += '                    <div class="challenge-header">\n';
    html += '                        <div class="challenge-number">' + String(num).padStart(2, '0') + '</div>\n';
    html += '                        <div class="challenge-title-group">\n';
    html += '                            <h2>' + escapeHtml(ch.name) + '</h2>\n';
    html += '                            <div class="challenge-meta">\n';
    html += '                                <span class="category-badge ' + ch.category + '">' + (ch.category.charAt(0).toUpperCase() + ch.category.slice(1)) + '</span>\n';
    html += '                                <span class="points-badge">' + (ch.points || '?') + ' points</span>\n';
    html += '                            </div>\n';
    html += '                        </div>\n';
    html += '                    </div>\n\n';
    
    html += '                    <div class="challenge-description">\n';
    html += '                        <h3><i class="fas fa-file-alt"></i> Challenge Description</h3>\n';
    html += '                        <p>' + escapeHtml(ch.description) + '</p>\n';
    
    if (ch.files.length > 0) {
        html += '                        <div class="challenge-files">\n';
        for (let j = 0; j < ch.files.length; j++) {
            const file = ch.files[j];
            const icon = file.startsWith('http') ? 'fas fa-link' : 'fas fa-file';
            html += '                            <span class="file-tag"><i class="' + icon + '"></i> ' + escapeHtml(file) + '</span>\n';
        }
        html += '                        </div>\n';
    }
    
    html += '                    </div>\n\n';
    
    html += '                    <div class="writeup-content">\n';
    html += '                        <h3><i class="fas fa-lightbulb"></i> Solution</h3>\n';
    
    for (let k = 0; k < ch.solution.length; k++) {
        const step = ch.solution[k];
        if (step.type === 'text') {
            html += '                        <p>' + escapeHtml(step.content) + '</p>\n';
        } else if (step.type === 'heading') {
            html += '                        <h4>' + escapeHtml(step.content) + '</h4>\n';
        } else if (step.type === 'code') {
            html += '                        <div class="code-block">\n';
            html += '                            <div class="code-header">\n';
            html += '                                <span class="code-lang">' + (step.language.charAt(0).toUpperCase() + step.language.slice(1)) + '</span>\n';
            html += '                                <button class="copy-btn" onclick="copyCode(this)">\n';
            html += '                                    <i class="fas fa-copy"></i> Copy\n';
            html += '                                </button>\n';
            html += '                            </div>\n';
            html += '                            <pre><code class="language-' + step.language + '">' + escapeHtml(step.content) + '</code></pre>\n';
            html += '                        </div>\n';
        } else if (step.type === 'image') {
            if (step.imageType === 'terminal') {
                html += '                        <img src="' + escapeHtml(step.path) + '" class="terminal-screenshot">\n';
            } else if (step.imageType === 'grid') {
                html += '                        <div class="image-grid">\n';
                for (let m = 0; m < step.images.length; m++) {
                    html += '                            <img src="' + escapeHtml(step.images[m]) + '" alt="Image ' + (m + 1) + '" class="screenshot">\n';
                }
                html += '                        </div>\n';
            } else {
                // Single image (default)
                html += '                        <div class="image-wrapper">\n';
                html += '                            <img src="' + escapeHtml(step.path) + '" alt="' + escapeHtml(step.caption || '') + '" class="screenshot">\n';
                if (step.caption) {
                    html += '                            <div class="image-caption">' + escapeHtml(step.caption) + '</div>\n';
                }
                html += '                        </div>\n';
            }
        }
    }
    
    html += '                    </div>\n\n';
    
    html += '                    <div class="flag-section">\n';
    html += '                        <h3><i class="fas fa-flag"></i> Flag</h3>\n';
    html += '                        <div class="flag-box">\n';
    html += '                            <code>' + escapeHtml(ch.flag) + '</code>\n';
    html += '                            <button class="copy-btn" onclick="copyFlag(this)">\n';
    html += '                                <i class="fas fa-copy"></i>\n';
    html += '                            </button>\n';
    html += '                        </div>\n';
    html += '                    </div>\n';
    html += '                </div>\n\n';
    
    return html;
}

function generateNavigationSection() {
    let html = '';
    
    html += '        <section class="writeup-navigation">\n';
    html += '            <div class="container">\n';
    html += '                <a href="/" class="nav-btn">\n';
    html += '                    <i class="fas fa-arrow-left"></i>\n';
    html += '                    Back to All CTFs\n';
    html += '                </a>\n';
    html += '            </div>\n';
    html += '        </section>\n';
    
    return html;
}

function generateFooter() {
    let html = '';
    
    html += '    <footer>\n';
    html += '        <div class="container">\n';
    html += '            <div class="footer-content">\n';
    html += '                <p>&copy; 2026 mshrinath</p>\n';
    html += '                <div class="footer-links">\n';
    html += '                    <a href="/">Portfolio</a>\n';
    html += '                    <span class="separator">•</span>\n';
    html += '                    <a href="/">CTF Writeups</a>\n';
    html += '                </div>\n';
    html += '            </div>\n';
    html += '        </div>\n';
    html += '    </footer>\n\n';
    
    return html;
}

function generateScripts() {
    let html = '';
    
    html += '    <script>\n';
    html += '        hljs.highlightAll();\n\n';
    
    html += '        function copyCode(btn) {\n';
    html += '            const codeBlock = btn.closest(\'.code-block\').querySelector(\'code\');\n';
    html += '            navigator.clipboard.writeText(codeBlock.textContent);\n';
    html += '            btn.innerHTML = \'<i class="fas fa-check"></i> Copied!\';\n';
    html += '            setTimeout(() => {\n';
    html += '                btn.innerHTML = \'<i class="fas fa-copy"></i> Copy\';\n';
    html += '            }, 2000);\n';
    html += '        }\n\n';
    
    html += '        function copyFlag(btn) {\n';
    html += '            const flagText = btn.previousElementSibling.textContent;\n';
    html += '            navigator.clipboard.writeText(flagText);\n';
    html += '            btn.innerHTML = \'<i class="fas fa-check"></i>\';\n';
    html += '            setTimeout(() => {\n';
    html += '                btn.innerHTML = \'<i class="fas fa-copy"></i>\';\n';
    html += '            }, 2000);\n';
    html += '        }\n';
    html += '    <\/script>\n';
    
    return html;
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
        document.getElementById('ctfTotal').value = '';
        document.getElementById('ctfRank').value = '';
        document.getElementById('ctfTeam').value = 'solo';
        document.getElementById('ctfTeamName').value = '';
        document.getElementById('ctfTeamName').style.display = 'none';
        document.getElementById('ctfOverview').value = '';
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
