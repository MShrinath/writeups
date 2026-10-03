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
   PDF EXPORT (PROFESSIONAL LIGHT REPORT)
=========================== */
function initPDFExport() {
    const btn = document.getElementById('btn-download-pdf');
    if (!btn) return;

    btn.addEventListener('click', async function () {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        btn.disabled = true;

        try {
            if (typeof window.jspdf === 'undefined') {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            }
            await buildProfessionalPDF();
        } catch (e) {
            console.error('PDF generation failed:', e);
            alert('Failed to generate PDF. Error: ' + (e.message || e));
        } finally {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    });
}

function loadScript(src) {
    return new Promise(function (resolve, reject) {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = function () { reject(new Error('Failed to load script: ' + src)); };
        document.head.appendChild(s);
    });
}

function loadImageData(imgEl) {
    return new Promise(function (resolve) {
        if (!imgEl || !imgEl.src) return resolve(null);
        var image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = function () {
            try {
                var canvas = document.createElement('canvas');
                canvas.width = image.naturalWidth || image.width || 800;
                canvas.height = image.naturalHeight || image.height || 600;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
                resolve({
                    data: canvas.toDataURL('image/jpeg', 0.90),
                    w: canvas.width,
                    h: canvas.height
                });
            } catch (e) {
                resolve(null);
            }
        };
        image.onerror = function () { resolve(null); };
        image.src = imgEl.src;
    });
}

async function buildProfessionalPDF() {
    // Preload all writeup images
    var imgDataMap = new Map();
    var images = Array.from(document.querySelectorAll('.challenge-writeup img'));
    await Promise.all(images.map(function (img) {
        return loadImageData(img).then(function (d) {
            if (d) imgDataMap.set(img.src, d);
        });
    }));

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
    });

    // Page Geometry (A4: 210 x 297 mm)
    const PW = 210;
    const PH = 297;
    const ML = 16;
    const MR = 16;
    const MT = 18;
    const MB = 18;
    const CW = PW - ML - MR;       // 178 mm
    const BOTTOM_LIMIT = PH - MB;  // 279 mm
    let y = MT;
    let page = 1;

    // Palette: Executive Professional Light Report
    const TEAL        = [13, 148, 136];   // Brand primary (#0d9488)
    const DARK_TEAL   = [15, 118, 110];   // #0f766e
    const SLATE_DARK  = [15, 23, 42];     // Body heading & main text (#0f172a)
    const SLATE_BODY  = [51, 65, 85];     // Body text (#334155)
    const SLATE_MUTE  = [100, 116, 139];  // Meta / secondary (#64748b)
    const SLATE_TINT  = [148, 163, 184];  // Divider / subtle (#94a3b8)
    const BORDER      = [226, 232, 240];  // Slate 200 (#e2e8f0)
    const CARD_BG     = [248, 250, 252];  // Slate 50 (#f8fafc)
    const WHITE       = [255, 255, 255];
    const CODE_BG     = [15, 23, 42];     // Terminal background (#0f172a)
    const CODE_HDR    = [30, 41, 59];     // Terminal header (#1e293b)
    const CODE_TEXT   = [241, 245, 249];  // Light code text (#f1f5f9)
    const FLAG_BG     = [240, 253, 250];  // Mint 50 (#f0fdfa)
    const FLAG_BORDER = [13, 148, 136];   // Emerald (#0d9488)
    const FLAG_TEXT   = [15, 118, 110];   // Emerald 700 (#0f766e)

    // Category styling mapping
    const CAT_COLORS = {
        web:           { bg: [254, 242, 242], border: [252, 165, 165], text: [220, 38, 38] },
        crypto:        { bg: [240, 253, 244], border: [187, 247, 208], text: [22, 163, 74] },
        reverse:       { bg: [245, 243, 255], border: [216, 180, 254], text: [126, 34, 206] },
        forensics:     { bg: [239, 246, 255], border: [191, 219, 254], text: [29, 78, 216] },
        pwn:           { bg: [255, 247, 237], border: [254, 215, 170], text: [194, 65, 12] },
        osint:         { bg: [254, 252, 232], border: [254, 240, 138], text: [161, 98, 7] },
        misc:          { bg: [240, 253, 250], border: [153, 246, 228], text: [13, 148, 136] },
        welcome:       { bg: [254, 249, 195], border: [253, 224, 71],  text: [161, 98, 7] },
        steganography: { bg: [253, 242, 248], border: [249, 168, 212], text: [190, 24, 93] },
        network:       { bg: [236, 254, 255], border: [165, 243, 252], text: [14, 116, 144] },
        default:       { bg: [241, 245, 249], border: [203, 213, 225], text: [71, 85, 105] }
    };

    const INFO_VARIANTS = {
        success: { bg: [240, 253, 244], border: [187, 247, 208], bar: [34, 197, 94],  text: [22, 101, 52] },
        warning: { bg: [255, 251, 235], border: [254, 230, 138], bar: [234, 179, 8],  text: [146, 64, 14] },
        danger:  { bg: [254, 242, 242], border: [254, 202, 202], bar: [239, 68, 68],  text: [153, 27, 27] },
        info:    { bg: [239, 246, 255], border: [191, 219, 254], bar: [59, 130, 246], text: [30, 64, 175] }
    };

    function newPage() {
        doc.addPage();
        page++;
        y = MT;
    }

    function guard(h) {
        if (y + h > BOTTOM_LIMIT) {
            newPage();
            return true;
        }
        return false;
    }

    function isOldPlaceholder(txt) {
        if (!txt) return true;
        var s = txt.toLowerCase().replace(/[\s\-_]+/g, '');
        return s === 'oldctf' || s === 'n/a' || s === 'none';
    }

    function stripped(el) {
        if (!el) return '';
        return Array.from(el.childNodes)
            .filter(function (n) { return !(n.nodeType === 1 && n.tagName === 'I'); })
            .map(function (n) { return n.textContent; })
            .join('').replace(/\s+/g, ' ').trim();
    }

    function drawPill(text, x, yPos, colorObj, fontSize) {
        fontSize = fontSize || 7;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(fontSize);
        var tw = doc.getTextWidth(text);
        var pw = tw + 5;
        var ph = fontSize * 0.35 + 3.2;
        doc.setFillColor.apply(doc, colorObj.bg);
        doc.setDrawColor.apply(doc, colorObj.border);
        doc.setLineWidth(0.2);
        doc.roundedRect(x, yPos, pw, ph, 1, 1, 'FD');
        doc.setTextColor.apply(doc, colorObj.text);
        doc.text(text, x + 2.5, yPos + ph - 1.1);
        return pw;
    }

    function para(str, x, w, sz, clr, style, lhMultiplier) {
        if (!str) return;
        var fs = style || 'normal';
        var lh = (sz * 0.3527) * (lhMultiplier || 1.4) + 0.8;
        var lines = doc.splitTextToSize(str, w);
        lines.forEach(function (line) {
            guard(lh + 0.5);
            doc.setFont('helvetica', fs);
            doc.setFontSize(sz);
            doc.setTextColor.apply(doc, clr);
            doc.text(line, x, y);
            y += lh;
        });
        y += 1.5;
    }

    function renderCodeBlock(codeText, lang) {
        if (!codeText) return;
        var codeLines = doc.splitTextToSize(codeText, CW - 12);
        var lineH = 3.8;
        var hdrH = 7.5;
        var pad = 3.5;

        guard(hdrH + 3 * lineH + pad * 2);

        var currentLine = 0;
        var totalLines = codeLines.length;

        while (currentLine < totalLines) {
            var isContinuation = currentLine > 0;
            var curHdrH = isContinuation ? 5.5 : hdrH;
            var availableSpace = BOTTOM_LIMIT - y - pad - curHdrH;
            var maxLines = Math.floor(availableSpace / lineH);

            if (maxLines < 2) {
                newPage();
                availableSpace = BOTTOM_LIMIT - y - pad - curHdrH;
                maxLines = Math.floor(availableSpace / lineH);
            }

            var chunkCount = Math.min(maxLines, totalLines - currentLine);
            var boxHeight = curHdrH + (chunkCount * lineH) + pad;

            // Box Background
            doc.setFillColor.apply(doc, CODE_BG);
            doc.setDrawColor.apply(doc, CODE_HDR);
            doc.setLineWidth(0.3);
            doc.roundedRect(ML, y, CW, boxHeight, 1.5, 1.5, 'FD');

            // Header bar
            doc.setFillColor.apply(doc, CODE_HDR);
            doc.roundedRect(ML, y, CW, curHdrH, 1.5, 1.5, 'F');
            doc.rect(ML, y + curHdrH - 1.5, CW, 1.5, 'F');

            if (!isContinuation) {
                // macOS-style terminal dots
                doc.setFillColor(239, 68, 68);
                doc.circle(ML + 4, y + curHdrH / 2, 1, 'F');
                doc.setFillColor(245, 158, 11);
                doc.circle(ML + 7.5, y + curHdrH / 2, 1, 'F');
                doc.setFillColor(16, 185, 129);
                doc.circle(ML + 11, y + curHdrH / 2, 1, 'F');

                if (lang) {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(7);
                    doc.setTextColor(45, 212, 191);
                    doc.text(lang.toUpperCase(), ML + CW - 4, y + curHdrH / 2 + 1, { align: 'right' });
                }
            } else {
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(6.5);
                doc.setTextColor.apply(doc, SLATE_TINT);
                doc.text((lang ? lang.toUpperCase() + ' ' : '') + '(continued)', ML + 4, y + curHdrH / 2 + 1);
            }

            var startY = y + curHdrH + pad;
            doc.setFont('courier', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor.apply(doc, CODE_TEXT);

            for (var i = 0; i < chunkCount; i++) {
                doc.text(codeLines[currentLine + i], ML + 5, startY + (i * lineH));
            }

            y += boxHeight + 4;
            currentLine += chunkCount;

            if (currentLine < totalLines) {
                newPage();
            }
        }
    }

    function renderInfoBox(node) {
        var it = node.textContent.replace(/\s+/g, ' ').trim();
        if (!it) return;

        var variant = 'info';
        if (node.classList.contains('success')) variant = 'success';
        else if (node.classList.contains('warning')) variant = 'warning';
        else if (node.classList.contains('danger')) variant = 'danger';

        var colors = INFO_VARIANTS[variant] || INFO_VARIANTS.info;
        var iLines = doc.splitTextToSize(it, CW - 12);
        var ibh = iLines.length * 4.2 + 8;

        guard(ibh + 3);

        doc.setFillColor.apply(doc, colors.bg);
        doc.setDrawColor.apply(doc, colors.border);
        doc.setLineWidth(0.25);
        doc.roundedRect(ML, y, CW, ibh, 1.2, 1.2, 'FD');

        doc.setFillColor.apply(doc, colors.bar);
        doc.rect(ML, y, 2.5, ibh, 'F');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor.apply(doc, colors.text);
        var iy = y + 5.2;
        iLines.forEach(function (l) {
            doc.text(l, ML + 6, iy);
            iy += 4.2;
        });

        y += ibh + 4;
    }

    function renderImage(imgEl, caption) {
        var iData = imgDataMap.get(imgEl.src);
        if (!iData) {
            guard(12);
            doc.setFillColor.apply(doc, CARD_BG);
            doc.setDrawColor.apply(doc, BORDER);
            doc.setLineWidth(0.25);
            doc.roundedRect(ML, y, CW, 10, 1, 1, 'FD');
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(7.5);
            doc.setTextColor.apply(doc, SLATE_MUTE);
            doc.text('[Screenshot: ' + (caption || imgEl.alt || 'Attachment') + ']', ML + CW / 2, y + 6.5, { align: 'center' });
            y += 14;
            return;
        }

        var MAX_W = CW - 4;
        var MAX_H = 95;
        var ratio = iData.h / iData.w;
        var iW = MAX_W;
        var iH = iW * ratio;
        if (iH > MAX_H) {
            iH = MAX_H;
            iW = iH / ratio;
        }

        var totalH = iH + (caption ? 10 : 4);
        guard(totalH);

        var imgX = ML + (CW - iW) / 2;
        doc.setDrawColor.apply(doc, BORDER);
        doc.setLineWidth(0.25);
        doc.rect(imgX - 0.5, y - 0.5, iW + 1, iH + 1);

        doc.addImage(iData.data, 'JPEG', imgX, y, iW, iH);
        y += iH + 2;

        if (caption) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(7.5);
            doc.setTextColor.apply(doc, SLATE_MUTE);
            doc.text(caption, ML + CW / 2, y + 3.5, { align: 'center' });
            y += 7;
        } else {
            y += 3;
        }
    }

    function renderList(listEl) {
        var isOrdered = listEl.tagName.toLowerCase() === 'ol';
        var items = Array.from(listEl.querySelectorAll(':scope > li'));
        items.forEach(function (li, idx) {
            var prefix = isOrdered ? (idx + 1) + '.' : '\u2022';
            var liText = li.textContent.replace(/\s+/g, ' ').trim();
            if (!liText) return;

            var lines = doc.splitTextToSize(liText, CW - 8);
            var lh = 4.2;
            guard(lines.length * lh + 2);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor.apply(doc, TEAL);
            doc.text(prefix, ML + 2, y + 3.5);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor.apply(doc, SLATE_BODY);

            lines.forEach(function (line) {
                guard(lh);
                doc.text(line, ML + 7, y + 3.5);
                y += lh;
            });
            y += 1;
        });
        y += 2;
    }

    function renderFlag(flag) {
        if (!flag) return;
        var fLines = doc.splitTextToSize(flag, CW - 12);
        var fbh = fLines.length * 5 + 13;
        guard(fbh + 5);

        y += 2;
        doc.setFillColor.apply(doc, FLAG_BG);
        doc.setDrawColor.apply(doc, FLAG_BORDER);
        doc.setLineWidth(0.4);
        doc.roundedRect(ML, y, CW, fbh, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor.apply(doc, FLAG_TEXT);
        doc.text('\u2691  CAPTURED FLAG', ML + 5, y + 6);

        doc.setFont('courier', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor.apply(doc, SLATE_DARK);
        var fy = y + 11.5;
        fLines.forEach(function (line) {
            doc.text(line, ML + 5, fy);
            fy += 5;
        });

        y += fbh + 5;
    }

    // =========================================================================
    // PAGE 1: EXECUTIVE COVER & SUMMARY
    // =========================================================================

    // Top Teal Accent Stripe
    doc.setFillColor.apply(doc, TEAL);
    doc.rect(0, 0, PW, 4.5, 'F');

    // Document Pill Badge
    y = 12;
    drawPill('CYBERSECURITY CTF REPORT', ML, y, { bg: [240, 253, 250], border: [153, 246, 228], text: [15, 118, 110] }, 7);
    y += 9;

    // CTF Title
    var ctfTitle = document.querySelector('h1')?.textContent?.trim() || 'CTF Writeup';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor.apply(doc, SLATE_DARK);
    var titleLines = doc.splitTextToSize(ctfTitle, CW);
    titleLines.forEach(function (tl) {
        doc.text(tl, ML, y + 6);
        y += 8.5;
    });
    y += 2;

    // Subtitle & Divider
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor.apply(doc, SLATE_MUTE);
    doc.text('Author: mshrinath   \u00b7   CTF Archive: mshrinxthwp.web.app', ML, y);
    y += 5.5;

    doc.setDrawColor.apply(doc, BORDER);
    doc.setLineWidth(0.3);
    doc.line(ML, y, PW - MR, y);
    doc.setDrawColor.apply(doc, TEAL);
    doc.setLineWidth(1);
    doc.line(ML, y, ML + 25, y);
    y += 7;

    // 4-Card Metadata Grid
    var cards = Array.from(document.querySelectorAll('.meta-card'));
    if (cards.length) {
        var colGap = 3.5;
        var colW = (CW - (cards.length - 1) * colGap) / cards.length;
        var cardH = 15;
        cards.forEach(function (card, i) {
            var lbl = card.querySelector('.meta-label')?.textContent?.trim() || '';
            var val = card.querySelector('.meta-value')?.textContent?.trim() || '';
            var cx = ML + i * (colW + colGap);

            doc.setFillColor.apply(doc, CARD_BG);
            doc.setDrawColor.apply(doc, BORDER);
            doc.setLineWidth(0.25);
            doc.roundedRect(cx, y, colW, cardH, 1.2, 1.2, 'FD');

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(6.5);
            doc.setTextColor.apply(doc, SLATE_MUTE);
            doc.text(lbl.toUpperCase(), cx + 3.5, y + 5);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor.apply(doc, SLATE_DARK);
            var valTrunc = val.length > 18 ? val.substring(0, 16) + '...' : val;
            doc.text(valTrunc, cx + 3.5, y + 11);
        });
        y += cardH + 7;
    }

    // Overview Section
    var ovEl = document.querySelector('.overview-box p');
    var ovText = ovEl?.textContent?.trim() || '';
    if (ovText && !isOldPlaceholder(ovText)) {
        var ovLines = doc.splitTextToSize(ovText, CW - 12);
        var ovH = ovLines.length * 4.2 + 9;
        doc.setFillColor.apply(doc, CARD_BG);
        doc.setDrawColor.apply(doc, BORDER);
        doc.setLineWidth(0.25);
        doc.roundedRect(ML, y, CW, ovH, 1.2, 1.2, 'FD');

        doc.setFillColor.apply(doc, TEAL);
        doc.rect(ML, y, 2.5, ovH, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor.apply(doc, DARK_TEAL);
        doc.text('EXECUTIVE OVERVIEW', ML + 6, y + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor.apply(doc, SLATE_BODY);
        var oy = y + 10.5;
        ovLines.forEach(function (line) {
            doc.text(line, ML + 6, oy);
            oy += 4.2;
        });
        y += ovH + 7;
    }

    // Solved Challenges Index Table
    var tocItems = Array.from(document.querySelectorAll('.toc-item'));
    if (tocItems.length) {
        guard(15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor.apply(doc, SLATE_DARK);
        doc.text('SOLVED CHALLENGES INDEX (' + tocItems.length + ')', ML, y);
        y += 4;

        // Table Header
        doc.setFillColor.apply(doc, CARD_BG);
        doc.setDrawColor.apply(doc, BORDER);
        doc.setLineWidth(0.2);
        doc.rect(ML, y, CW, 5.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor.apply(doc, SLATE_MUTE);
        doc.text('#', ML + 4, y + 3.8);
        doc.text('CHALLENGE NAME', ML + 14, y + 3.8);
        doc.text('CATEGORY', ML + CW - 42, y + 3.8);
        y += 5.5;

        tocItems.forEach(function (item, idx) {
            guard(6.2);
            var num = item.querySelector('.toc-number')?.textContent?.trim() || String(idx + 1).padStart(2, '0');
            var name = item.querySelector('.toc-title')?.textContent?.trim() || '';
            var catEl = item.querySelector('.toc-category');
            var cat = catEl?.textContent?.trim() || 'Misc';
            var catClass = (catEl?.className || '').replace('toc-category', '').trim().toLowerCase() || 'default';
            var cObj = CAT_COLORS[catClass] || CAT_COLORS.default;

            if (idx % 2 === 1) {
                doc.setFillColor(250, 252, 254);
                doc.rect(ML, y, CW, 6.2, 'F');
            }
            doc.setDrawColor.apply(doc, BORDER);
            doc.setLineWidth(0.15);
            doc.line(ML, y + 6.2, ML + CW, y + 6.2);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor.apply(doc, TEAL);
            doc.text(num, ML + 4, y + 4.2);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor.apply(doc, SLATE_DARK);
            var maxW = CW - 62;
            var truncName = name;
            while (doc.getTextWidth(truncName) > maxW && truncName.length > 5) {
                truncName = truncName.slice(0, -4) + '...';
            }
            doc.text(truncName, ML + 14, y + 4.2);

            drawPill(cat, ML + CW - 42, y + 1.1, cObj, 6.5);

            y += 6.2;
        });
        y += 6;
    }

    // =========================================================================
    // PAGES 2+: INDIVIDUAL CHALLENGE WRITEUPS
    // =========================================================================
    var challengeEls = Array.from(document.querySelectorAll('.challenge-writeup'));
    challengeEls.forEach(function (ch, idx) {
        newPage();

        var num = ch.querySelector('.challenge-number')?.textContent?.trim() || String(idx + 1).padStart(2, '0');
        var title = ch.querySelector('.challenge-title-group h2')?.textContent?.trim() || 'Challenge ' + num;
        var catEl = ch.querySelector('.category-badge');
        var catText = catEl?.textContent?.trim() || 'General';
        var catClass = (catEl?.className || '').replace('category-badge', '').trim().toLowerCase() || 'default';
        var cObj = CAT_COLORS[catClass] || CAT_COLORS.default;
        var ptsText = ch.querySelector('.points-badge')?.textContent?.trim() || '';

        // Challenge Number Badge
        doc.setFillColor.apply(doc, TEAL);
        doc.roundedRect(ML, y, 12, 12, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor.apply(doc, WHITE);
        doc.text(num, ML + 6, y + 8, { align: 'center' });

        // Challenge Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13.5);
        doc.setTextColor.apply(doc, SLATE_DARK);
        doc.text(title, ML + 16, y + 5.5);

        // Badges below title
        var bx = ML + 16;
        var pw = drawPill(catText, bx, y + 7.5, cObj, 7);
        bx += pw + 3;

        if (ptsText) {
            drawPill(ptsText, bx, y + 7.5, { bg: CARD_BG, border: BORDER, text: SLATE_MUTE }, 7);
        }

        y += 17;

        // Separator line
        doc.setDrawColor.apply(doc, BORDER);
        doc.setLineWidth(0.3);
        doc.line(ML, y, PW - MR, y);
        y += 6;

        // Description Box
        var descEl = ch.querySelector('.challenge-description p');
        var descTxt = descEl?.textContent?.trim() || '';
        if (descTxt && !isOldPlaceholder(descTxt)) {
            guard(14);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor.apply(doc, DARK_TEAL);
            doc.text('CHALLENGE DESCRIPTION', ML, y);
            y += 4;
            para(descTxt, ML, CW, 8.5, SLATE_BODY, 'normal', 1.4);
            y += 3;
        }

        // Attached Files / Links
        var fileTags = Array.from(ch.querySelectorAll('.file-tag'));
        if (fileTags.length) {
            guard(10);
            var fx = ML;
            fileTags.forEach(function (ft) {
                var fText = ft.textContent.replace(/\s+/g, ' ').trim();
                var fpw = drawPill('\u2913 ' + fText, fx, y, { bg: [240, 249, 255], border: [186, 230, 253], text: [3, 105, 161] }, 7);
                fx += fpw + 3;
                if (fx > PW - MR - 25) {
                    fx = ML;
                    y += 6;
                }
            });
            y += 8;
        }

        // Solution Header
        guard(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor.apply(doc, SLATE_DARK);
        doc.text('SOLUTION WALKTHROUGH', ML, y);
        doc.setDrawColor.apply(doc, TEAL);
        doc.setLineWidth(0.6);
        doc.line(ML, y + 2, ML + 30, y + 2);
        y += 7;

        // Solution Content
        var contentEl = ch.querySelector('.writeup-content');
        if (contentEl) {
            Array.from(contentEl.children).forEach(function (node) {
                var tag = node.tagName.toLowerCase();

                if (tag === 'h3' || tag === 'h4') {
                    var ht = stripped(node);
                    if (!ht || ht.toLowerCase() === 'solution') return;
                    guard(16);
                    y += 3;
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(tag === 'h3' ? 10 : 9);
                    doc.setTextColor.apply(doc, SLATE_DARK);
                    doc.text(ht, ML, y);
                    y += 5.5;

                } else if (tag === 'p') {
                    var pt = node.textContent.trim();
                    if (pt) para(pt, ML, CW, 8.5, SLATE_BODY, 'normal', 1.45);

                } else if (tag === 'ul' || tag === 'ol') {
                    renderList(node);

                } else if (tag === 'div' && node.classList.contains('code-block')) {
                    var lang = node.querySelector('.code-lang')?.textContent?.trim() || '';
                    var code = node.querySelector('code')?.textContent?.trim() || '';
                    renderCodeBlock(code, lang);

                } else if (tag === 'div' && node.classList.contains('info-box')) {
                    renderInfoBox(node);

                } else if (tag === 'img' && node.classList.contains('terminal-screenshot')) {
                    renderImage(node, 'Terminal Output');

                } else if (tag === 'div' && (node.classList.contains('image-wrapper') || node.classList.contains('image-grid'))) {
                    Array.from(node.querySelectorAll('img')).forEach(function (imgEl) {
                        var wrap = imgEl.closest('.image-wrapper');
                        var cap = (wrap ? wrap.querySelector('.image-caption')?.textContent?.trim() : '') || imgEl.alt || '';
                        renderImage(imgEl, cap);
                    });
                }
            });
        }

        // Flag Box
        var flagEl = ch.querySelector('.flag-box code');
        if (flagEl) {
            renderFlag(flagEl.textContent.trim());
        }
    });

    // =========================================================================
    // TWO-PASS RUNNING HEADER & FOOTER
    // =========================================================================
    var totalPages = doc.getNumberOfPages();

    for (var p = 1; p <= totalPages; p++) {
        doc.setPage(p);

        // Header on pages 2+
        if (p > 1) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.setTextColor.apply(doc, SLATE_MUTE);
            var hdrTitle = ctfTitle.length > 50 ? ctfTitle.substring(0, 47) + '...' : ctfTitle;
            doc.text(hdrTitle + '  \u00b7  Writeup Report', ML, 11);
            doc.text('mshrinath', PW - MR, 11, { align: 'right' });

            doc.setDrawColor.apply(doc, BORDER);
            doc.setLineWidth(0.2);
            doc.line(ML, 13, PW - MR, 13);
        }

        // Running Footer on all pages
        doc.setDrawColor.apply(doc, BORDER);
        doc.setLineWidth(0.2);
        doc.line(ML, PH - MB + 2, PW - MR, PH - MB + 2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor.apply(doc, SLATE_MUTE);
        doc.text('CTF Archive  \u00b7  mshrinxthwp.web.app', ML, PH - MB + 7);
        doc.text('Page ' + p + ' of ' + totalPages, PW - MR, PH - MB + 7, { align: 'right' });
    }

    // Metadata properties
    doc.setProperties({
        title: ctfTitle + ' - Writeup Report',
        subject: 'CTF Writeup and Solutions',
        author: 'mshrinath',
        keywords: 'CTF, Cybersecurity, Writeup, Walkthrough',
        creator: 'mshrinath CTF Archive'
    });

    var rawTitle = document.querySelector('h1')?.textContent?.trim() || document.title;
    var filename = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-writeup.pdf';
    doc.save(filename);
}

/* ===========================
   INITIALIZATION
=========================== */
function initWriteup() {
    initSmoothScroll();
    initTOCHighlight();
    initScrollAnimations();
    initPDFExport();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWriteup);
} else {
    initWriteup();
}