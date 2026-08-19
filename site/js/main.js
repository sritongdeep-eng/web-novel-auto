// The Veridian Protocol — Static Site Navigation

const chapters = [
  { id: 1, title: "Chapter 1: The Glitch in the Blood", file: "01-the-glitch-in-the-blood.md" }
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
