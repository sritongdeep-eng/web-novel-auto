// The Veridian Protocol — Static Site Navigation

const chapters = [
  { id: 01, title: "CHAPTER 1 — The Glitch in the Blood", file: "01-the-glitch-in-the-blood.md" },
  { id: 02, title: "CHAPTER 2 — The Crimson Circuit", file: "02-the-crimson-circuit.md" },
  { id: 03, title: "CHAPTER 3 — Fragments of the Old World", file: "03-fragments-of-the-old-world.md" },
  { id: 04, title: "CHAPTER 4 — The Witch of Sector 7", file: "04-the-witch-of-sector-7.md" },
  { id: 05, title: "CHAPTER 5 — Protocol Zero", file: "05-protocol-zero.md" },
  { id: 06, title: "CHAPTER 6 — The Blood Network", file: "06-the-blood-network.md" },
  { id: 07, title: "CHAPTER 7 — Echoes in the Static", file: "07-echoes-in-the-static.md" },
  { id: 08, title: "CHAPTER 8 — The Veridian Core", file: "08-the-veridian-core.md" },
  { id: 09, title: "CHAPTER 9 — Sacrifice Protocol", file: "09-sacrifice-protocol.md" },
  { id: 10, title: "CHAPTER 10 — New Genesis", file: "10-new-genesis.md" },
  { id: 11, title: "CHAPTER 11 — The Guardian’s First Watch", file: "11-the-guardians-first-watch.md" },
  { id: 12, title: "CHAPTER 12 — The Shadow in the Static", file: "12-the-shadow-in-the-static.md" },
  { id: 13, title: "CHAPTER 13 — The Military Secret", file: "13-the-military-secret.md" },
  { id: 14, title: "CHAPTER 14 — The NORAD Core", file: "14-the-norad-core.md" },
  { id: 15, title: "CHAPTER 15 — The Choice", file: "15-the-choice.md" },
  { id: 16, title: "CHAPTER 16 — The Void Walker", file: "16-the-void-walker.md" },
  { id: 17, title: "CHAPTER 17 — The First Server", file: "17-the-first-server.md" },
  { id: 18, title: "CHAPTER 18 — The Merge", file: "18-the-merge.md" },
  { id: 19, title: "CHAPTER 19 — The First Contact", file: "19-the-first-contact.md" },
  { id: 20, title: "CHAPTER 20 — The Bridge Between Worlds", file: "20-the-bridge-between-worlds.md" },
  { id: 21, title: "CHAPTER 21 — The Signal", file: "21-the-signal.md" },
  { id: 22, title: "CHAPTER 22 — The CERN Core", file: "22-the-cern-core.md" },
  { id: 23, title: "CHAPTER 23 — The Guardian Protocol", file: "23-the-guardian-protocol.md" },
  { id: 24, title: "CHAPTER 24 — The Weavers’ Gift", file: "24-the-weavers-gift.md" },
  { id: 25, title: "CHAPTER 25 — The Star-Seed", file: "25-the-star-seed.md" },
  { id: 26, title: "CHAPTER 26 — The First Launch", file: "26-the-first-launch.md" },
  { id: 27, title: "CHAPTER 27 — The Colony", file: "27-the-colony.md" },
  { id: 28, title: "CHAPTER 28 — The Galactic Web", file: "28-the-galactic-web.md" },
  { id: 29, title: "CHAPTER 29 — The Tapestry", file: "29-the-tapestry.md" },
  { id: 30, title: "CHAPTER 30 — The Unwritten Story", file: "30-the-unwritten-story.md" },
  { id: 31, title: "CHAPTER 31 — The Edge of the Tapestry", file: "31-the-edge-of-the-tapestry.md" },
  { id: 32, title: "CHAPTER 32 — Into the Void", file: "32-into-the-void.md" },
  { id: 33, title: "CHAPTER 33 — The Final Weave", file: "33-the-final-weave.md" },
  { id: 34, title: "CHAPTER 34 — The Loom", file: "34-the-loom.md" },
  { id: 35, title: "CHAPTER 35 — The Next Chapter", file: "35-the-next-chapter.md" },
  { id: 36, title: "CHAPTER 36 — The Author’s Pen", file: "36-the-authors-pen.md" },
  { id: 37, title: "CHAPTER 37 — The Reader", file: "37-the-reader.md" },
  { id: 38, title: "CHAPTER 38 — The Memory", file: "38-the-memory.md" },
  { id: 39, title: "CHAPTER 39 — The Infinity", file: "39-the-infinity.md" },
  { id: 40, title: "CHAPTER 40 — The Last Page", file: "40-the-last-page.md" },
  { id: 41, title: "BOOK 2: THE CRIMSON CIRCUIT — Chapter 41", file: "41-book2-chapter1.md" },
  { id: 42, title: "CHAPTER 42 — The Reunion", file: "42-the-reunion.md" },
  { id: 43, title: "CHAPTER 43 — The Archive Awakens", file: "43-the-archive-awakens.md" },
  { id: 44, title: "CHAPTER 44 — The Choice", file: "44-the-choice.md" },
  { id: 45, title: "CHAPTER 45 — The Teacher", file: "45-the-teacher.md" },
];


let currentChapter = 0;

// Font size state
let currentFontSize = 1; // 0=small, 1=medium, 2=large
const fontSizes = ['1rem', '1.1rem', '1.25rem'];

function renderChapterList() {
  const list = document.getElementById('chapter-list');
  list.innerHTML = '';

  chapters.forEach((ch, idx) => {
    const li = document.createElement('li');
    li.textContent = ch.title;
    li.dataset.index = idx;
    if (idx === currentChapter) {
      li.classList.add('active');
    }
    li.addEventListener('click', () => loadChapter(idx));
    list.appendChild(li);
  });
}

function updateProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

async function loadChapter(index) {
  if (index < 0 || index >= chapters.length) return;

  currentChapter = index;
  const chapter = chapters[index];

  try {
    const response = await fetch(`/content/chapters/${chapter.file}`);
    const markdown = await response.text();

    const contentDiv = document.getElementById('chapter-content');
    contentDiv.innerHTML = marked.parse(markdown);
    contentDiv.style.fontSize = fontSizes[currentFontSize];

    document.getElementById('prev-chapter').disabled = index === 0;
    document.getElementById('next-chapter').disabled = index === chapters.length - 1;

    renderChapterList();
    updateChapterStats(markdown);
    setupReactions(chapter.id);
    setupBookmark(chapter.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateProgressBar();
    loadComments(chapter.id);
  } catch (error) {
    document.getElementById('chapter-content').innerHTML = `
      <h1>${chapter.title}</h1>
      <p><em>Chapter content loading...</em></p>
    `;
  }
}

function updateChapterStats(markdown) {
  const plainText = markdown.replace(/[#*_`]/g, '').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(' ').length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const timeEl = document.getElementById('reading-time');
  const countEl = document.getElementById('word-count');
  if (timeEl) timeEl.textContent = `⏱️ ${readingTime} min read`;
  if (countEl) countEl.textContent = `📝 ${wordCount} words`;
}

function setupReactions(chapterId) {
  const container = document.getElementById('chapter-content');
  if (!container) return;

  const existing = container.querySelector('.reactions');
  if (existing) existing.remove();

  const reactionsDiv = document.createElement('div');
  reactionsDiv.className = 'reactions';

  const reactionTypes = [
    { emoji: '🔥', key: 'fire' },
    { emoji: '❤️', key: 'heart' },
    { emoji: '👏', key: 'clap' },
    { emoji: '😱', key: 'shock' }
  ];

  reactionTypes.forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'reaction-btn';
    const storageKey = `reactions_${chapterId}_${type.key}`;
    const count = parseInt(localStorage.getItem(storageKey) || '0');
    btn.innerHTML = `${type.emoji} <span>${count}</span>`;
    btn.addEventListener('click', () => {
      const currentCount = parseInt(localStorage.getItem(storageKey) || '0');
      localStorage.setItem(storageKey, currentCount + 1);
      btn.innerHTML = `${type.emoji} <span>${currentCount + 1}</span>`;
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 300);
    });
    reactionsDiv.appendChild(btn);
  });

  container.appendChild(reactionsDiv);
}

function setupBookmark(chapterId) {
  const container = document.getElementById('chapter-content');
  if (!container) return;

  const existing = container.querySelector('.bookmark-btn');
  if (existing) existing.remove();

  const btn = document.createElement('button');
  btn.className = 'bookmark-btn';
  const storageKey = `bookmark_${chapterId}`;
  const isBookmarked = localStorage.getItem(storageKey) === 'true';
  btn.textContent = isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark';
  if (isBookmarked) btn.classList.add('bookmarked');

  btn.addEventListener('click', () => {
    const current = localStorage.getItem(storageKey) === 'true';
    localStorage.setItem(storageKey, !current);
    btn.textContent = !current ? '🔖 Bookmarked' : '🔖 Bookmark';
    btn.classList.toggle('bookmarked');
  });

  container.appendChild(btn);
}

function setupFontToggle() {
  const chapterContent = document.getElementById('chapter-content');
  if (!chapterContent) return;

  // Create font size toggle button
  const toggle = document.createElement('button');
  toggle.textContent = 'A⁺';
  toggle.className = 'font-toggle';
  toggle.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--accent);color:white;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;z-index:999;';
  toggle.addEventListener('click', () => {
    currentFontSize = (currentFontSize + 1) % fontSizes.length;
    chapterContent.style.fontSize = fontSizes[currentFontSize];
    localStorage.setItem('fontSize', currentFontSize);
  });
  document.body.appendChild(toggle);

  // Restore saved font size
  const saved = localStorage.getItem('fontSize');
  if (saved !== null) {
    currentFontSize = parseInt(saved);
    chapterContent.style.fontSize = fontSizes[currentFontSize];
  }
}

function loadComments(chapterId) {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;

  const key = `comments_${chapterId}`;
  const comments = JSON.parse(localStorage.getItem(key) || '[]');

  if (comments.length === 0) {
    commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first!</p>';
    return;
  }

  commentsList.innerHTML = comments.map(c => `
    <div class="comment">
      <div class="comment-author">${escapeHtml(c.name)}</div>
      <div class="comment-text">${escapeHtml(c.text)}</div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.getElementById('prev-chapter').addEventListener('click', () => {
  if (currentChapter > 0) loadChapter(currentChapter - 1);
});

document.getElementById('next-chapter').addEventListener('click', () => {
  if (currentChapter < chapters.length - 1) loadChapter(currentChapter + 1);
});

document.getElementById('comment-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('comment-name').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  const chapter = chapters[currentChapter];

  if (!name || !text || !chapter) return;

  const key = `comments_${chapter.id}`;
  const comments = JSON.parse(localStorage.getItem(key) || '[]');
  comments.push({ name, text, timestamp: Date.now() });
  localStorage.setItem(key, JSON.stringify(comments));

  document.getElementById('comment-text').value = '';
  loadComments(chapter.id);
});

window.addEventListener('scroll', updateProgressBar);

// Theme toggle
function setupThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    toggle.textContent = '☀️';
  }

  toggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    toggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// Social share
function setupSocialShare() {
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      let shareUrl = '';

      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'line':
          shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
          break;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    });
  });
}

// Search
function setupSearch() {
  const nav = document.querySelector('.chapter-nav');
  if (!nav) return;

  const searchBox = document.createElement('div');
  searchBox.className = 'search-box';
  searchBox.innerHTML = '<input type="text" id="chapter-search" placeholder="Search chapters...">';
  nav.insertBefore(searchBox, nav.firstChild);

  const input = document.getElementById('chapter-search');
  const list = document.getElementById('chapter-list');

  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const items = list.querySelectorAll('li');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

// Initialize
renderChapterList();
loadChapter(0);
setupFontToggle();
setupThemeToggle();
setupSocialShare();
setupSearch();
