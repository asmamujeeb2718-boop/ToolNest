

/* =========================================================
   ToolNest – script.js
   All tool logic: Percentage, CGPA, Age, Word Counter,
   WhatsApp Direct, Stylish Text Generator
   ========================================================= */

/* =========================================================
   MODAL SYSTEM
   ========================================================= */

function openTool(toolId) {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  const tpl = document.getElementById('tpl-' + toolId);
  if (!tpl) return;

  content.innerHTML = '';
  content.appendChild(tpl.content.cloneNode(true));
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Post-render initializations
  if (toolId === 'age') initAgeDates();
  if (toolId === 'wordcount') updateWordCount();
}

function closeToolModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) {
    closeToolModal();
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeToolModal();
});

/* =========================================================
   HELPER: show result box
   ========================================================= */
function showResult(id, html) {
  const box = document.getElementById(id);
  if (!box) return;
  box.innerHTML = html;
  box.classList.add('visible');
}

/* =========================================================
   1. PERCENTAGE CALCULATOR
   ========================================================= */

function pctTab(btn, paneId) {
  // Deactivate all tabs and panes
  const tabs = btn.closest('.tab-bar').querySelectorAll('.tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const modal = btn.closest('.modal-content');
  modal.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  modal.querySelector('#pct-' + paneId).classList.add('active');
}

function calcBasicPct() {
  const pct = parseFloat(document.getElementById('pct-val').value);
  const of = parseFloat(document.getElementById('pct-of').value);
  if (isNaN(pct) || isNaN(of)) return alert('Please enter both values.');
  const result = (pct / 100) * of;
  showResult('pct-basic-result',
    `<span class="result-big">${result.toFixed(2)}</span>
     <span class="result-label">${pct}% of ${of} = <strong>${result.toFixed(2)}</strong></span>`
  );
}

function calcMarksPct() {
  const obt = parseFloat(document.getElementById('marks-obt').value);
  const total = parseFloat(document.getElementById('marks-total').value);
  if (isNaN(obt) || isNaN(total) || total === 0) return alert('Please enter valid marks.');
  const pct = (obt / total) * 100;
  const grade = getGrade(pct);
  showResult('pct-marks-result',
    `<span class="result-big">${pct.toFixed(2)}%</span>
     <span class="result-label">Marks: ${obt} / ${total} &nbsp;|&nbsp; Grade: <strong>${grade}</strong></span>`
  );
}

function calcPctChange() {
  const orig = parseFloat(document.getElementById('pct-orig').value);
  const newVal = parseFloat(document.getElementById('pct-new').value);
  if (isNaN(orig) || isNaN(newVal) || orig === 0) return alert('Please enter valid values.');
  const change = ((newVal - orig) / Math.abs(orig)) * 100;
  const dir = change >= 0 ? '↑ Increase' : '↓ Decrease';
  showResult('pct-change-result',
    `<span class="result-big">${Math.abs(change).toFixed(2)}%</span>
     <span class="result-label">${dir} from ${orig} to ${newVal}</span>`
  );
}

function getGrade(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
}

/* =========================================================
   2. CGPA CALCULATOR
   ========================================================= */

function addCgpaRow() {
  const container = document.getElementById('cgpa-rows');
  const row = document.createElement('div');
  row.className = 'cgpa-row';
  row.innerHTML = `
    <input type="text" placeholder="Subject (optional)" class="subj-name" />
    <input type="number" placeholder="Grade (0-10)" class="subj-grade" min="0" max="10" step="0.1" />
    <input type="number" placeholder="Credits" class="subj-credit" min="1" max="6" />
    <button class="icon-btn del-btn" onclick="removeCgpaRow(this)">✕</button>
  `;
  container.appendChild(row);
}

function removeCgpaRow(btn) {
  const rows = document.querySelectorAll('.cgpa-row');
  if (rows.length <= 1) return alert('At least one subject is required.');
  btn.closest('.cgpa-row').remove();
}

function calcCgpa() {
  const grades = document.querySelectorAll('.subj-grade');
  const credits = document.querySelectorAll('.subj-credit');
  let totalPoints = 0, totalCredits = 0;
  let valid = true;

  for (let i = 0; i < grades.length; i++) {
    const g = parseFloat(grades[i].value);
    const c = parseFloat(credits[i].value);
    if (isNaN(g) || isNaN(c) || c <= 0 || g < 0 || g > 10) { valid = false; break; }
    totalPoints += g * c;
    totalCredits += c;
  }

  if (!valid || totalCredits === 0) return alert('Please fill in valid grade and credit values.');
  const cgpa = totalPoints / totalCredits;
  const outOf4 = (cgpa / 10) * 4;
  showResult('cgpa-result',
    `<span class="result-big">${cgpa.toFixed(2)}</span>
     <span class="result-label">CGPA out of 10 &nbsp;|&nbsp; Equivalent GPA (4.0 scale): <strong>${outOf4.toFixed(2)}</strong></span>
     <br><span class="result-label">Total Credit Hours: <strong>${totalCredits}</strong></span>`
  );
}

/* =========================================================
   3. AGE CALCULATOR
   ========================================================= */

function initAgeDates() {
  const today = new Date().toISOString().split('T')[0];
  const refInput = document.getElementById('age-ref-date');
  if (refInput) refInput.value = today;
}

function calcAge() {
  const dobInput = document.getElementById('dob-input');
  const refInput = document.getElementById('age-ref-date');
  if (!dobInput.value) return alert('Please enter your date of birth.');

  const dob = new Date(dobInput.value);
  const ref = refInput.value ? new Date(refInput.value) : new Date();

  if (dob > ref) return alert('Date of birth cannot be in the future.');

  let years = ref.getFullYear() - dob.getFullYear();
  let months = ref.getMonth() - dob.getMonth();
  let days = ref.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { years--; months += 12; }

  const totalDays = Math.floor((ref - dob) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const nextBirthday = getNextBirthday(dob, ref);

  showResult('age-result',
    `<span class="result-big">${years} yrs, ${months} mo, ${days} d</span>
     <span class="result-label">Total Days: <strong>${totalDays.toLocaleString()}</strong> &nbsp;|&nbsp; Weeks: <strong>${totalWeeks.toLocaleString()}</strong></span>
     <br><span class="result-label">Approx. Hours Lived: <strong>${totalHours.toLocaleString()}</strong></span>
     <br><span class="result-label">Next Birthday in: <strong>${nextBirthday} days</strong></span>`
  );
}

function getNextBirthday(dob, ref) {
  let next = new Date(ref.getFullYear(), dob.getMonth(), dob.getDate());
  if (next <= ref) next.setFullYear(ref.getFullYear() + 1);
  return Math.ceil((next - ref) / (1000 * 60 * 60 * 24));
}

/* =========================================================
   4. WORD COUNTER
   ========================================================= */

function updateWordCount() {
  const text = document.getElementById('wc-textarea')?.value || '';

  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text === '' ? 0 : (text.match(/[^.!?]*[.!?]+/g) || []).length;
  const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).length;
  const readTime = words === 0 ? '0 min' : (Math.ceil(words / 200)) + ' min';

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('wc-words', words.toLocaleString());
  set('wc-chars', chars.toLocaleString());
  set('wc-chars-nsp', charsNoSpace.toLocaleString());
  set('wc-sentences', sentences.toLocaleString());
  set('wc-paragraphs', paragraphs.toLocaleString());
  set('wc-read-time', readTime);
}

/* =========================================================
   5. WHATSAPP DIRECT MESSAGE
   ========================================================= */

function openWhatsApp() {
  const code = document.getElementById('wa-country')?.value;
  let number = document.getElementById('wa-number')?.value.trim();
  const message = document.getElementById('wa-message')?.value.trim();

  // Remove leading zero if present
  number = number.replace(/^0+/, '');

  if (!number) return alert('Please enter a phone number.');
  if (!/^\d{7,12}$/.test(number)) return alert('Please enter a valid phone number (digits only, 7–12 digits).');

  const fullNumber = code + number;
  const encodedMsg = encodeURIComponent(message || '');
  const url = `https://wa.me/${fullNumber}${encodedMsg ? '?text=' + encodedMsg : ''}`;

  window.open(url, '_blank');

  const resultBox = document.getElementById('wa-result');
  if (resultBox) {
    resultBox.innerHTML = `<span class="result-label">✅ Opening WhatsApp for <strong>+${fullNumber}</strong>…</span>`;
    resultBox.classList.add('visible');
  }
}

/* =========================================================
   6. STYLISH TEXT GENERATOR
   ========================================================= */

const STYLE_MAP = {
  'Bold Serif':    { from: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', to: '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗' },
  'Italic Serif':  { from: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', to: '𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧' },
  'Bold Italic':   { from: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', to: '𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛' },
  'Script':        { from: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', to: '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏' },
  'Double-Struck': { from: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', to: '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡' },
  'Fraktur':       { from: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', to: '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷' },
  'Monospace':     { from: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', to: '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿' },
  'Circled':       { from: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', to: 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ' },
  'Square':        { from: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', to: '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉' },
};

// Special converters
function toSmallCaps(text) {
  const map = {a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'Q',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ'};
  return text.split('').map(c => map[c.toLowerCase()] || c).join('');
}

function toUpsideDown(text) {
  const map = {a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ɓ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z',' ':' ','.':'˙',',':'\'','!':'¡','?':'¿'};
  return text.split('').reverse().map(c => map[c.toLowerCase()] || c).join('');
}

function convertStyle(text, from, to) {
  const fromArr = [...from];
  const toArr = [...to];
  return [...text].map(ch => {
    const idx = fromArr.indexOf(ch);
    return (idx >= 0 && idx < toArr.length) ? toArr[idx] : ch;
  }).join('');
}

function generateStylish() {
  const input = document.getElementById('st-input')?.value || '';
  const container = document.getElementById('st-results');
  if (!container) return;

  if (!input.trim()) {
    container.innerHTML = '<p class="st-hint">Start typing above to see styles ↑</p>';
    return;
  }

  container.innerHTML = '';

  // Named map styles
  for (const [label, { from, to }] of Object.entries(STYLE_MAP)) {
    const converted = convertStyle(input, from, to);
    container.appendChild(createStyleItem(label, converted));
  }

  // Special styles
  container.appendChild(createStyleItem('Small Caps', toSmallCaps(input)));
  container.appendChild(createStyleItem('Upside Down', toUpsideDown(input)));

  // Aesthetic style: add dots
  container.appendChild(createStyleItem('Dots', [...input].join('·')));

  // Zalgo-lite (combining underline)
  const zalgo = [...input].map(c => c + '\u0332').join('');
  container.appendChild(createStyleItem('Underline', zalgo));
}

function createStyleItem(label, text) {
  const div = document.createElement('div');
  div.className = 'st-item';
  div.innerHTML = `
    <div>
      <div class="st-label">${label}</div>
      <div class="st-text">${escapeHtml(text)}</div>
    </div>
    <button class="copy-btn" onclick="copyStyle(this, \`${escapeForAttr(text)}\`)">Copy</button>
  `;
  return div;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeForAttr(text) {
  return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function copyStyle(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1800);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
  });
}

// QR CODE
function generateQR() {
  let text = document.getElementById("qr-input").value;
  let qrImg = document.getElementById("qr-img");
  qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(text);
}

// PASSWORD
function generatePassword() {
  let length = document.getElementById("pass-length").value;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  document.getElementById("pass-result").innerText = password;
}

// JPG TO PNG
function convertToPNG() {
  let file = document.getElementById("jpg-input").files[0];
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  let img = new Image();

  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    let pngUrl = canvas.toDataURL("image/png");
    document.getElementById("png-download").href = pngUrl;
  };

  img.src = URL.createObjectURL(file);
}

// RESIZER
function resizeImage() {
  let file = document.getElementById("resize-input").files[0];
  let width = document.getElementById("resize-width").value;
  let height = document.getElementById("resize-height").value;

  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  let img = new Image();

  img.onload = function() {
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    let resizedUrl = canvas.toDataURL("image/png");
    document.getElementById("resize-download").href = resizedUrl;
  };

  img.src = URL.createObjectURL(file);
}