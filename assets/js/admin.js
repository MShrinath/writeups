let challengeCount = 0;
let generatedHTML = '';

/* ===========================
   IMAGE PATH AUTO-PREFIX
=========================== */
function prefixImgPath(input) {
    const prefix = '/assets/img/';
    let val = input.value;
    // Don't touch empty values or absolute URLs
    if (!val || val.startsWith('http://') || val.startsWith('https://')) return;
    // Avoid double-prefixing
    if (val.startsWith(prefix)) return;
    input.value = prefix + val;
    // Keep cursor at end
    const len = input.value.length;
    try { input.setSelectionRange(len, len); } catch(e) {}
}

/* ===========================
   INDEX TAGS PILL PICKER
=========================== */
const _indexSelectedTags = new Set();

function toggleIndexTag(value) {
    if (_indexSelectedTags.has(value)) {
        _indexSelectedTags.delete(value);
    } else {
        _indexSelectedTags.add(value);
    }
    // Sync hidden input
    document.getElementById('indexTags').value = [..._indexSelectedTags].join(', ');
    // Update pill active states
    document.querySelectorAll('#indexTags-picker .cat-pill').forEach(pill => {
        pill.classList.toggle('active', _indexSelectedTags.has(pill.dataset.value));
    });
}

function setIndexTags(tagsArray) {
    _indexSelectedTags.clear();
    document.querySelectorAll('#indexTags-picker .cat-pill').forEach(pill => pill.classList.remove('active'));
    tagsArray.forEach(tag => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        _indexSelectedTags.add(trimmed);
        const pill = document.querySelector(`#indexTags-picker .cat-pill[data-value="${trimmed}"]`);
        if (pill) pill.classList.add('active');
    });
    document.getElementById('indexTags').value = [..._indexSelectedTags].join(', ');
}

/* ===========================
   ADD CHALLENGE
=========================== */
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
                    <label>Points</label>
                    <input type="number" id="ch${challengeCount}-points" placeholder="100">
                </div>
            </div>

            <div class="form-group">
                <label>Category *</label>
                <div class="category-picker" id="ch${challengeCount}-category-picker">
                    <button type="button" class="cat-pill" data-value="welcome" onclick="selectCategory(${challengeCount}, 'welcome')">Welcome</button>
                    <button type="button" class="cat-pill active" data-value="web" onclick="selectCategory(${challengeCount}, 'web')">Web</button>
                    <button type="button" class="cat-pill" data-value="crypto" onclick="selectCategory(${challengeCount}, 'crypto')">Crypto</button>
                    <button type="button" class="cat-pill" data-value="forensics" onclick="selectCategory(${challengeCount}, 'forensics')">Forensics</button>
                    <button type="button" class="cat-pill" data-value="reverse" onclick="selectCategory(${challengeCount}, 'reverse')">Reverse</button>
                    <button type="button" class="cat-pill" data-value="pwn" onclick="selectCategory(${challengeCount}, 'pwn')">PWN</button>
                    <button type="button" class="cat-pill" data-value="osint" onclick="selectCategory(${challengeCount}, 'osint')">OSINT</button>
                    <button type="button" class="cat-pill" data-value="steganography" onclick="selectCategory(${challengeCount}, 'steganography')">Steganography</button>
                    <button type="button" class="cat-pill" data-value="misc" onclick="selectCategory(${challengeCount}, 'misc')">Misc</button>
                    <button type="button" class="cat-pill" data-value="network" onclick="selectCategory(${challengeCount}, 'network')">Network</button>
                    <button type="button" class="cat-pill" data-value="malware" onclick="selectCategory(${challengeCount}, 'malware')">Malware</button>
                    <button type="button" class="cat-pill" data-value="hardware" onclick="selectCategory(${challengeCount}, 'hardware')">Hardware</button>
                    <button type="button" class="cat-pill" data-value="blockchain" onclick="selectCategory(${challengeCount}, 'blockchain')">Blockchain</button>
                    <button type="button" class="cat-pill" data-value="mobile" onclick="selectCategory(${challengeCount}, 'mobile')">Mobile</button>
                    <button type="button" class="cat-pill" data-value="programming" onclick="selectCategory(${challengeCount}, 'programming')">Programming</button>
                    <button type="button" class="cat-pill" data-value="trivia" onclick="selectCategory(${challengeCount}, 'trivia')">Trivia</button>
                    <button type="button" class="cat-pill" data-value="others" onclick="selectCategory(${challengeCount}, 'others')">Others +</button>
                </div>
                <input type="hidden" id="ch${challengeCount}-category" value="web">
                <input type="text" id="ch${challengeCount}-custom-category" placeholder="Enter custom category" style="display: none; margin-top: 10px;">
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
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
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
                    <button class="btn btn-secondary" onclick="addStep(${challengeCount}, 'infobox')">
                        <i class="fas fa-info-circle"></i> Add Info Box
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

    // set initial height so collapse works correctly
    const collapseEl = challengeDiv.querySelector('.collapse-content');
    expandCollapse(collapseEl);
}

let stepCounters = {};

/* ===========================
   ADD STEP
=========================== */
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
    } else if (type === 'infobox') {
        content = `
            <label>Type</label>
            <select class="step-infobox-type" style="margin-bottom: 10px;">
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="danger">Danger</option>
                <option value="info">Info</option>
            </select>
            <label>Title (optional)</label>
            <input type="text" class="step-infobox-title" placeholder="e.g., Success!" style="margin-bottom: 10px;">
            <label>Message</label>
            <textarea class="step-data" data-type="infobox" placeholder="Your message here..." rows="2"></textarea>
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
                <input type="text" class="step-data" data-type="image" placeholder="screenshot.png" oninput="prefixImgPath(this)">
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

    // keep collapse height in sync
    const collapseEl = document.getElementById(`collapse-${challengeId}`);
    if (collapseEl && collapseEl.classList.contains('active')) {
        expandCollapse(collapseEl);
    }
}

/* ===========================
   REMOVE CHALLENGE
=========================== */
function removeChallenge(id) {
    const challenge = document.getElementById(`challenge-${id}`);
    if (challenge) {
        challenge.remove();
    }
}

/* ===========================
   COLLAPSE
=========================== */
function expandCollapse(el) {
    el.style.maxHeight = el.scrollHeight + 'px';
}

function toggleCollapse(id) {
    const content = document.getElementById(`collapse-${id}`);
    if (content.classList.toggle('active')) {
        expandCollapse(content);
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        requestAnimationFrame(() => { content.style.maxHeight = '0'; });
    }
}

/* ===========================
   SELECT CATEGORY (challenges)
=========================== */
function selectCategory(challengeId, value) {
    document.getElementById(`ch${challengeId}-category`).value = value;

    const picker = document.getElementById(`ch${challengeId}-category-picker`);
    picker.querySelectorAll('.cat-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.value === value);
    });

    const customInput = document.getElementById(`ch${challengeId}-custom-category`);
    if (value === 'others') {
        customInput.style.display = 'block';
        customInput.focus();
    } else {
        customInput.style.display = 'none';
        customInput.value = '';
    }
}

/* ===========================
   TEAM TOGGLES
=========================== */
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

/* ===========================
   IMAGE INPUT UPDATES
=========================== */
function updateImageInputs(challengeId, stepId) {
    const stepDiv = document.getElementById(`ch${challengeId}-step${stepId}`);
    const imageType = stepDiv.querySelector('.step-image-type').value;
    const container = stepDiv.querySelector('.image-inputs-container');
    
    let html = '';
    
    if (imageType === 'single') {
        html = `
            <label>Image Path</label>
            <input type="text" class="step-data" data-type="image" placeholder="screenshot.png" oninput="prefixImgPath(this)">
            <label style="margin-top: 10px;">Caption (optional)</label>
            <input type="text" class="step-caption" placeholder="Screenshot description">
        `;
    } else if (imageType === 'terminal') {
        html = `
            <label>Terminal Screenshot Path</label>
            <input type="text" class="step-data" data-type="image" data-subtype="terminal" placeholder="terminal.png" oninput="prefixImgPath(this)">
        `;
    } else if (imageType === 'grid') {
        html = `
            <label>Number of Images (2-4)</label>
            <input type="number" class="grid-count" value="2" min="2" max="4" onchange="updateGridInputs(${challengeId}, ${stepId})" style="margin-bottom: 10px;">
            <div class="grid-images-container">
                <label>Image 1 Path</label>
                <input type="text" class="grid-image" data-index="0" placeholder="img1.png" style="margin-bottom: 10px;" oninput="prefixImgPath(this)">
                <label>Image 2 Path</label>
                <input type="text" class="grid-image" data-index="1" placeholder="img2.png" oninput="prefixImgPath(this)">
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
            <input type="text" class="grid-image" data-index="${i}" placeholder="img${i + 1}.png" style="margin-bottom: ${i < count - 1 ? '10px' : '0'};" oninput="prefixImgPath(this)">
        `;
    }
    
    gridContainer.innerHTML = html;
}

/* ===========================
   ESCAPE HTML
=========================== */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ===========================
   GENERATE INDEX CARD (populate form)
=========================== */
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

    // Auto-select tags from challenge categories
    const usedCats = new Set();
    const catToTag = {
        welcome: 'Welcome', web: 'Web', crypto: 'Crypto', forensics: 'Forensics',
        reverse: 'Reverse Engineering', pwn: 'PWN', osint: 'OSINT',
        steganography: 'Steganography', misc: 'Misc', network: 'Network',
        malware: 'Malware', hardware: 'Hardware', blockchain: 'Blockchain',
        mobile: 'Mobile', programming: 'Programming', trivia: 'Trivia'
    };
    document.querySelectorAll('.challenge-item').forEach(elem => {
        const id = elem.id.split('-')[1];
        const catEl = document.getElementById(`ch${id}-category`);
        if (catEl) {
            const cat = catEl.value;
            if (cat && cat !== 'others' && catToTag[cat]) {
                usedCats.add(catToTag[cat]);
            }
        }
    });
    setIndexTags([...usedCats]);

    // Show the index card section
    const section = document.getElementById('indexCardSection');
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ===========================
   GENERATE INDEX CARD CODE (output HTML)
=========================== */
function generateIndexCardCode() {
    const ctfName = document.getElementById('ctfName').value;
    const year = document.getElementById('indexYear').value;
    const month = document.getElementById('indexMonth').value;
    const type = document.getElementById('indexType').value;
    const indexTeamName = document.getElementById('indexTeamName').value.trim();
    const tagsRaw = document.getElementById('indexTags').value;
    const filename = document.getElementById('indexFilename').value;
    const solvedCount = document.querySelectorAll('.challenge-item').length;

    if (!ctfName) {
        alert('Please fill in the CTF Name first!');
        return;
    }

    const tagsArray = tagsRaw.split(',').map(t => t.trim()).filter(t => t);
    if (!tagsArray.length) tagsArray.push('CTF');

    const teamIcon = type === 'solo' ? 'fa-user' : 'fa-users';
    const teamText = type === 'solo' ? 'Solo Participation' : (indexTeamName ? 'Team: ' + escapeHtml(indexTeamName) : 'Team');

    let tagsHTML = '';
    for (const tag of tagsArray) {
        const cls = tag.toLowerCase().replace(/\s+/g, '');
        tagsHTML += '                            <span class="tag ' + cls + '">' + escapeHtml(tag) + '</span>\n';
    }

    const code =
`                    <!-- ${escapeHtml(ctfName)} -->
                    <a class="ctf-card" 
                    href="${escapeHtml(filename)}" 
                    data-year="${escapeHtml(year)}">
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
                            <span class="read-more">
                                Read Writeup <i class="fas fa-arrow-right"></i>
                            </span>
                        </div>
                    </a>`;

    document.getElementById('outputText').textContent = code;
    document.getElementById('outputBox').style.display = 'block';
    document.getElementById('outputBox').scrollIntoView({ behavior: 'smooth' });
}

/* ===========================
   COPY OUTPUT
=========================== */
function copyOutput() {
    const text = document.getElementById('outputText').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

/* ===========================
   GENERATE WRITEUP HTML
=========================== */
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
            } else if (type === 'infobox') {
                const variantSelect = step.querySelector('.step-infobox-type');
                const titleInput = step.querySelector('.step-infobox-title');
                challenge.solution.push({
                    type: 'infobox',
                    variant: variantSelect ? variantSelect.value : 'info',
                    title: titleInput ? titleInput.value.trim() : '',
                    content: dataElem.value
                });
            } else {
                challenge.solution.push({
                    type: type,
                    content: dataElem.value
                });
            }
        });

        if (challenge.name) {
            challenges.push(challenge);
        }
    });

    if (challenges.length === 0) {
        alert('Please add at least one challenge!');
        return;
    }

    // Generate HTML
    const sourceData = {
        ctf: {
            name: ctfData.name,
            month: ctfMonth,
            year: ctfYear,
            total_challenges: document.getElementById('ctfTotal').value,
            rank: document.getElementById('ctfRank').value,
            team: document.getElementById('ctfTeam').value,
            teamName: document.getElementById('ctfTeam').value === 'team' ? document.getElementById('ctfTeamName').value.trim() : '',
            overview: ctfData.overview
        },
        challenges
    };
    generatedHTML = generateHTML(ctfData, challenges, sourceData);
    
    // Copy to clipboard
    navigator.clipboard.writeText(generatedHTML).then(() => {
        const msg = document.getElementById('successMessage');
        msg.style.display = 'block';
        msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => {
            msg.style.display = 'none';
        }, 5000);
    });
}

/* ===========================
   HTML GENERATION
=========================== */
function generateHTML(ctf, challenges, sourceData) {
    let html = '';
    
    html += '<!DOCTYPE html>\n';
    html += '<html lang="en">\n';
    html += '<head>\n';
    html += '    <meta charset="UTF-8">\n';
    html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '    <title>' + escapeHtml(ctf.name) + ' Writeup | mshrinath</title>\n';
    html += '    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">\n';
    html += '    <meta name="description" content="Detailed writeup for ' + escapeHtml(ctf.name) + ' challenges" />\n';
    html += '    <link rel="stylesheet" href="/assets/css/base.css">\n';
    html += '    <link rel="stylesheet" href="/assets/css/writeup.css">\n';
    html += '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">\n';
    html += '    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js" defer><\/script>\n';
    html += '    <script src="/assets/js/base.js" defer><\/script>\n';
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
    html += '    </main>\n\n';
    
    html += generateFooter();
    if (sourceData) {
        html += '    <script type="application/json" id="writeup-source">' + JSON.stringify(sourceData) + '<\/script>\n';
    }
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
        html += '                            <span class="toc-category ' + ch.category + '">' + (ch.category.charAt(0).toUpperCase() + ch.category.slice(1)) + '</span>\n';
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
            if (!step.content.trim()) continue;
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
        } else if (step.type === 'infobox') {
            const icons = { success: 'fas fa-check-circle', warning: 'fas fa-exclamation-triangle', danger: 'fas fa-times-circle', info: 'fas fa-info-circle' };
            const icon = icons[step.variant] || icons.info;
            html += '                        <div class="info-box ' + step.variant + '">\n';
            html += '                            <i class="' + icon + '"></i>\n';
            html += '                            <div>\n';
            if (step.title) {
                html += '                                <strong>' + escapeHtml(step.title) + '</strong> ' + escapeHtml(step.content) + '\n';
            } else {
                html += '                                ' + escapeHtml(step.content) + '\n';
            }
            html += '                            </div>\n';
            html += '                        </div>\n';
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

function generateFooter() {
    let html = '';
    
    html += '    <footer>\n';
    html += '        <div class="container">\n';
    html += '            <div class="footer-content">\n';
    html += '                <p>&copy; 2026 mshrinath</p>\n';
    html += '                <div class="footer-links">\n';
    html += '                    <a href="https://github.com/mshrinath" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>\n';
    html += '                    <span class="separator">\u2022</span>\n';
    html += '                    <a href="https://linkedin.com/in/mshrinath" target="_blank" rel="noopener"><i class="fab fa-linkedin"></i> LinkedIn</a>\n';
    html += '                </div>\n';
    html += '            </div>\n';
    html += '        </div>\n';
    html += '    </footer>\n\n';
    
    return html;
}

/* ===========================
   DOWNLOAD HTML
=========================== */
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

/* ===========================
   CLEAR ALL
=========================== */
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

/* ===========================
   SAVE / LOAD / IMPORT
=========================== */
function collectProjectData() {
    const ctfMonth = document.getElementById('ctfMonth').value;
    const ctfYear = document.getElementById('ctfYear').value;
    const ctfTeam = document.getElementById('ctfTeam').value;
    const challenges = [];

    document.querySelectorAll('.challenge-item').forEach(elem => {
        const id = elem.id.split('-')[1];
        let category = document.getElementById(`ch${id}-category`).value;
        if (category === 'others') {
            category = document.getElementById(`ch${id}-custom-category`).value.trim() || 'misc';
        }

        const solution = [];
        document.querySelectorAll(`#ch${id}-steps .solution-step`).forEach(step => {
            const dataElem = step.querySelector('.step-data');
            if (!dataElem) return;
            const type = dataElem.dataset.type;
            if (type === 'code') {
                const lang = step.querySelector('.step-lang');
                solution.push({ type: 'code', language: lang ? lang.value : 'bash', content: dataElem.value });
            } else if (type === 'image') {
                const imageTypeSelect = step.querySelector('.step-image-type');
                const imageType = imageTypeSelect ? imageTypeSelect.value : 'single';
                if (imageType === 'grid') {
                    const images = Array.from(step.querySelectorAll('.grid-image')).map(i => i.value.trim()).filter(Boolean);
                    solution.push({ type: 'image', imageType: 'grid', images });
                } else if (imageType === 'terminal') {
                    solution.push({ type: 'image', imageType: 'terminal', path: dataElem.value });
                } else {
                    const caption = step.querySelector('.step-caption');
                    solution.push({ type: 'image', imageType: 'single', path: dataElem.value, caption: caption ? caption.value : '' });
                }
            } else if (type === 'infobox') {
                const variant = step.querySelector('.step-infobox-type');
                const title = step.querySelector('.step-infobox-title');
                solution.push({ type: 'infobox', variant: variant ? variant.value : 'info', title: title ? title.value.trim() : '', content: dataElem.value });
            } else {
                solution.push({ type, content: dataElem.value });
            }
        });

        challenges.push({
            name: document.getElementById(`ch${id}-name`).value,
            category,
            points: document.getElementById(`ch${id}-points`).value,
            description: document.getElementById(`ch${id}-description`).value,
            files: document.getElementById(`ch${id}-files`).value.split('\n').filter(f => f.trim()),
            flag: document.getElementById(`ch${id}-flag`).value,
            solution
        });
    });

    return {
        ctf: {
            name: document.getElementById('ctfName').value,
            month: ctfMonth,
            year: ctfYear,
            total_challenges: document.getElementById('ctfTotal').value,
            rank: document.getElementById('ctfRank').value,
            team: ctfTeam,
            teamName: ctfTeam === 'team' ? document.getElementById('ctfTeamName').value.trim() : '',
            overview: document.getElementById('ctfOverview').value
        },
        challenges
    };
}

function extractJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const data = parseHTMLToData(evt.target.result);
                const json = JSON.stringify(data, null, 2);
                document.getElementById('outputText').textContent = json;
                document.getElementById('outputBox').style.display = 'block';
                document.getElementById('outputBox').scrollIntoView({ behavior: 'smooth' });
            } catch (err) {
                alert('Failed to extract JSON: ' + err.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function saveProject() {
    const data = collectProjectData();
    const name = (data.ctf.name || 'writeup').replace(/\s+/g, '_');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
}

function loadProject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.html';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                let data;
                if (file.name.endsWith('.json')) {
                    data = JSON.parse(evt.target.result);
                } else {
                    data = parseHTMLToData(evt.target.result);
                }
                populateFromData(data);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (err) {
                alert('Failed to load file: ' + err.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function parseHTMLToData(htmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Try embedded JSON first (present in files generated by this tool)
    const jsonScript = doc.querySelector('#writeup-source');
    if (jsonScript) {
        try { return JSON.parse(jsonScript.textContent); } catch(e) {}
    }

    // Fallback: DOM-parse the known HTML structure
    const data = { ctf: {}, challenges: [] };

    const glitch = doc.querySelector('.glitch-text');
    data.ctf.name = glitch ? glitch.getAttribute('data-text') : '';

    const metaValues = doc.querySelectorAll('.meta-card .meta-value');
    if (metaValues[0]) {
        const parts = metaValues[0].textContent.trim().split(' ');
        data.ctf.month = parts[0] || '';
        data.ctf.year = parts[1] || '';
    }
    if (metaValues[1]) {
        const parts = metaValues[1].textContent.trim().split('/');
        data.ctf.total_challenges = (parts[1] || '').trim().replace('?', '');
    }
    if (metaValues[2]) data.ctf.rank = metaValues[2].textContent.trim();
    if (metaValues[3]) {
        const teamText = metaValues[3].textContent.trim();
        if (teamText === 'Solo') {
            data.ctf.team = 'solo';
            data.ctf.teamName = '';
        } else {
            data.ctf.team = 'team';
            data.ctf.teamName = teamText.replace(/^Team:\s*/, '');
        }
    }

    const overviewP = doc.querySelector('.overview-box p');
    data.ctf.overview = overviewP ? overviewP.textContent.trim() : '';

    doc.querySelectorAll('.challenge-writeup').forEach(div => {
        const ch = { name: '', category: '', points: '', description: '', files: [], flag: '', solution: [] };

        const h2 = div.querySelector('.challenge-title-group h2');
        ch.name = h2 ? h2.textContent.trim() : '';

        const catBadge = div.querySelector('.category-badge');
        if (catBadge) {
            const cat = Array.from(catBadge.classList).find(c => c !== 'category-badge');
            ch.category = cat || catBadge.textContent.trim().toLowerCase();
        }

        const pointsBadge = div.querySelector('.points-badge');
        if (pointsBadge) ch.points = pointsBadge.textContent.replace(/\s*points/, '').replace('?', '').trim();

        const descP = div.querySelector('.challenge-description p');
        ch.description = descP ? descP.textContent.trim() : '';

        div.querySelectorAll('.file-tag').forEach(tag => {
            const text = tag.textContent.trim();
            if (text) ch.files.push(text);
        });

        const flagCode = div.querySelector('.flag-box code');
        ch.flag = flagCode ? flagCode.textContent.trim() : '';

        const writeupContent = div.querySelector('.writeup-content');
        if (writeupContent) {
            Array.from(writeupContent.children).forEach(elem => {
                const tag = elem.tagName.toLowerCase();
                if (tag === 'h3') return;
                if (tag === 'p') {
                    const content = elem.textContent.trim();
                    if (content) ch.solution.push({ type: 'text', content });
                } else if (tag === 'h4') {
                    ch.solution.push({ type: 'heading', content: elem.textContent.trim() });
                } else if (elem.classList.contains('code-block')) {
                    const codeElem = elem.querySelector('code');
                    const langClass = codeElem ? Array.from(codeElem.classList).find(c => c.startsWith('language-')) : null;
                    ch.solution.push({ type: 'code', language: langClass ? langClass.replace('language-', '') : 'bash', content: codeElem ? codeElem.textContent.trim() : '' });
                } else if (tag === 'img' && elem.classList.contains('terminal-screenshot')) {
                    ch.solution.push({ type: 'image', imageType: 'terminal', path: elem.getAttribute('src') });
                } else if (elem.classList.contains('image-wrapper')) {
                    const img = elem.querySelector('img');
                    const cap = elem.querySelector('.image-caption');
                    ch.solution.push({ type: 'image', imageType: 'single', path: img ? img.getAttribute('src') : '', caption: cap ? cap.textContent.trim() : '' });
                } else if (elem.classList.contains('image-grid')) {
                    ch.solution.push({ type: 'image', imageType: 'grid', images: Array.from(elem.querySelectorAll('img')).map(i => i.getAttribute('src')) });
                } else if (elem.classList.contains('info-box')) {
                    const variant = ['success','warning','danger','info'].find(v => elem.classList.contains(v)) || 'info';
                    const strong = elem.querySelector('strong');
                    const title = strong ? strong.textContent.trim() : '';
                    const contentDiv = elem.querySelector('div');
                    let content = contentDiv ? contentDiv.textContent.trim() : '';
                    if (title && content.startsWith(title)) content = content.slice(title.length).trim();
                    ch.solution.push({ type: 'infobox', variant, title, content });
                }
            });
        }

        data.challenges.push(ch);
    });

    return data;
}

function populateFromData(data) {
    document.getElementById('challengesContainer').innerHTML = '';
    challengeCount = 0;
    stepCounters = {};
    generatedHTML = '';

    const ctf = data.ctf || {};
    document.getElementById('ctfName').value = ctf.name || '';
    if (ctf.month) document.getElementById('ctfMonth').value = ctf.month;
    if (ctf.year) document.getElementById('ctfYear').value = ctf.year;
    document.getElementById('ctfTotal').value = ctf.total_challenges || '';
    document.getElementById('ctfRank').value = ctf.rank || '';
    const teamVal = (ctf.team === 'solo' || ctf.team === 'Solo') ? 'solo' : (ctf.team ? 'team' : 'solo');
    document.getElementById('ctfTeam').value = teamVal;
    document.getElementById('ctfTeamName').value = ctf.teamName || '';
    document.getElementById('ctfTeamName').style.display = teamVal === 'team' ? 'block' : 'none';
    document.getElementById('ctfOverview').value = ctf.overview || '';

    const knownCats = ['welcome','web','crypto','forensics','reverse','pwn','osint','steganography','misc','network','malware','hardware','blockchain','mobile','programming','trivia','others'];

    (data.challenges || []).forEach(ch => {
        addChallenge();
        const id = challengeCount;

        document.getElementById(`ch${id}-name`).value = ch.name || '';

        const catLower = (ch.category || '').toLowerCase();
        if (knownCats.includes(catLower)) {
            selectCategory(id, catLower);
        } else {
            selectCategory(id, 'others');
            document.getElementById(`ch${id}-custom-category`).value = ch.category || '';
        }

        document.getElementById(`ch${id}-points`).value = ch.points || '';
        document.getElementById(`ch${id}-description`).value = ch.description || '';
        document.getElementById(`ch${id}-files`).value = (ch.files || []).join('\n');
        document.getElementById(`ch${id}-flag`).value = ch.flag || '';

        (ch.solution || []).forEach(step => {
            addStep(id, step.type);
            const stepId = stepCounters[id];
            const stepElem = document.getElementById(`ch${id}-step${stepId}`);

            if (step.type === 'code') {
                const langSel = stepElem.querySelector('.step-lang');
                if (langSel) langSel.value = step.language || 'bash';
                stepElem.querySelector('.step-data').value = step.content || '';
            } else if (step.type === 'image') {
                const typeSel = stepElem.querySelector('.step-image-type');
                if (typeSel) {
                    typeSel.value = step.imageType || 'single';
                    updateImageInputs(id, stepId);
                }
                if (step.imageType === 'grid') {
                    const countInput = stepElem.querySelector('.grid-count');
                    if (countInput) {
                        countInput.value = (step.images || []).length;
                        updateGridInputs(id, stepId);
                    }
                    stepElem.querySelectorAll('.grid-image').forEach((inp, i) => {
                        if (step.images && step.images[i]) inp.value = step.images[i];
                    });
                } else {
                    const dataElem = stepElem.querySelector('.step-data');
                    if (dataElem) dataElem.value = step.path || '';
                    if (step.imageType === 'single') {
                        const cap = stepElem.querySelector('.step-caption');
                        if (cap) cap.value = step.caption || '';
                    }
                }
            } else if (step.type === 'infobox') {
                const varSel = stepElem.querySelector('.step-infobox-type');
                if (varSel) varSel.value = step.variant || 'info';
                const titleInp = stepElem.querySelector('.step-infobox-title');
                if (titleInp) titleInp.value = step.title || '';
                stepElem.querySelector('.step-data').value = step.content || '';
            } else {
                stepElem.querySelector('.step-data').value = step.content || '';
            }
        });
    });
}

/* ===========================
   INITIALIZATION
=========================== */
window.onload = () => {
    addChallenge();
};