// The Veridian Protocol — Static Site Navigation

const chapters = [
  { id: 1, title: "Chapter 1: The Glitch in the Blood", file: "01-the-glitch-in-the-blood.md" },
];

// SITE_BASE is set per-page via an inline <script> before this file loads:
// "." on the homepage (repo root), ".." on chapter pages (one level deep in /chapters/).
const BASE = window.SITE_BASE || '.';

function chapterHref(ch) {
  return `${BASE}/chapters/${ch.file.replace('.md', '.html')}`;
}

function homeHref() {
  return `${BASE}/index.html`;
}

// Figure out which chapter (if any) the current page is showing, from the URL.
function getCurrentChapterId() {
  const path = window.location.pathname;
  const match = path.match(/\/(\d+)-[^/]+\.html$/);
  return match ? parseInt(match[1], 10) : null;
}

let currentFontSize = 1;
const fontSizes = ['16px', '18px', '21px', '24px'];

const translations = {
  en: {
    chapters: 'Chapters',
    searchPlaceholder: 'Search chapters...',
    prev: '← Previous',
    next: 'Next →',
    commentsTitle: 'Comments',
    commentsPlaceholder: 'Your thoughts on this chapter...',
    postComment: 'Post Comment',
    yourName: 'Your name',
    noComments: 'No comments yet. Be the first!'
  },
  th: {
    chapters: 'บททั้งหมด',
    searchPlaceholder: 'ค้นหาบท...',
    prev: '← บทก่อนหน้า',
    next: 'บทต่อไป →',
    commentsTitle: 'ความคิดเห็น',
    commentsPlaceholder: 'ความคิดเห็นของคุณ...',
    postComment: 'โพสต์ความคิดเห็น',
    yourName: 'ชื่อของคุณ',
    noComments: 'ยังไม่มีความคิดเห็น เป็นคนแรกๆ กันเถอะ'
  },
  zh: {
    chapters: '章节目录',
    searchPlaceholder: '搜索章节...',
    prev: '← 上一章',
    next: '下一章 →',
    commentsTitle: '评论',
    commentsPlaceholder: '写下你的想法...',
    postComment: '发表评论',
    yourName: '你的昵称',
    noComments: '暂无评论，快来抢沙发'
  },
  id: {
    chapters: 'Daftar Bab',
    searchPlaceholder: 'Cari bab...',
    prev: '← Sebelumnya',
    next: 'Selanjutnya →',
    commentsTitle: 'Komentar',
    commentsPlaceholder: 'Pendapat kamu...',
    postComment: 'Kirim Komentar',
    yourName: 'Namamu',
    noComments: 'Belum ada komentar. Yuk jadi yang pertama!'
  },
  vi: {
    chapters: 'Danh sách chương',
    searchPlaceholder: 'Tìm chương...',
    prev: '← Trước',
    next: 'Tiếp theo →',
    commentsTitle: 'Bình luận',
    commentsPlaceholder: 'Cảm nghĩ của bạn...',
    postComment: 'Đăng bình luận',
    yourName: 'Tên của bạn',
    noComments: 'Chưa có bình luận. Hãy là người đầu tiên!'
  }
};

let currentLanguage = localStorage.getItem('language') || 'en';

function getText(key) {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

function applyLanguage() {
  const searchInput = document.getElementById('chapter-search');
  if (searchInput) searchInput.placeholder = getText('searchPlaceholder');

  const prevBtn = document.getElementById('prev-chapter');
  const nextBtn = document.getElementById('next-chapter');
  if (prevBtn && !prevBtn.disabled) prevBtn.textContent = getText('prev');
  if (nextBtn && !nextBtn.disabled) nextBtn.textContent = getText('next');

  const chaptersHeading = document.querySelector('.chapter-nav h2');
  if (chaptersHeading) chaptersHeading.textContent = getText('chapters');

  const commentsTitle = document.querySelector('.comments-section h2');
  if (commentsTitle) commentsTitle.textContent = getText('commentsTitle');

  const commentName = document.getElementById('comment-name');
  const commentText = document.getElementById('comment-text');
  const commentFormBtn = document.querySelector('#comment-form button');
  if (commentName) commentName.placeholder = getText('yourName');
  if (commentText) commentText.placeholder = getText('commentsPlaceholder');
  if (commentFormBtn) commentFormBtn.textContent = getText('postComment');

  const chapterId = getCurrentChapterId();
  if (chapterId !== null) loadComments(chapterId);
}

// Sidebar chapter list shown on chapter-reading pages.
function renderChapterList(activeId) {
  const list = document.getElementById('chapter-list');
  if (!list) return;
  list.innerHTML = '';

  chapters.forEach((ch) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = chapterHref(ch);
    link.textContent = ch.title;
    link.className = 'chapter-link';
    if (ch.id === activeId) li.classList.add('active');
    li.appendChild(link);
    list.appendChild(li);
  });
}

// Homepage: full Book 1 / Book 2 chapter grids.
function renderHomeChapterGrids() {
  const book1 = document.getElementById('book1-list');
  const book2 = document.getElementById('book2-list');
  if (!book1 && !book2) return;

  chapters.forEach((ch) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = chapterHref(ch);
    link.textContent = ch.title;
    li.appendChild(link);
    (ch.id <= 40 ? book1 : book2)?.appendChild(li);
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

// Chapter text is already rendered server-side; just measure what's on the page.
function updateChapterStatsFromDOM() {
  const contentDiv = document.getElementById('chapter-content');
  const timeEl = document.getElementById('reading-time');
  const countEl = document.getElementById('word-count');
  if (!contentDiv || !timeEl || !countEl) return;

  const plainText = contentDiv.textContent.replace(/\s+/g, ' ').trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  timeEl.textContent = `⏱️ ${readingTime} min read`;
  countEl.textContent = `📝 ${wordCount} words`;
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

const dateLocales = { en: 'en-US', th: 'th-TH', zh: 'zh-CN', id: 'id-ID', vi: 'vi-VN' };

function formatCommentDate(timestamp) {
  if (!timestamp) return '';
  const locale = dateLocales[currentLanguage] || 'en-US';
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp));
  } catch {
    return new Date(timestamp).toLocaleString();
  }
}

function loadComments(chapterId) {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;

  const key = `comments_${chapterId}`;
  const comments = JSON.parse(localStorage.getItem(key) || '[]');

  if (comments.length === 0) {
    commentsList.innerHTML = `<p class="no-comments">${getText('noComments')}</p>`;
    return;
  }

  commentsList.innerHTML = comments.map(c => `
    <div class="comment">
      <div class="comment-header">
        <span class="comment-author">${escapeHtml(c.name)}</span>
        <span class="comment-date">${formatCommentDate(c.timestamp)}</span>
      </div>
      <div class="comment-text">${escapeHtml(c.text)}</div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function setupThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    toggle.textContent = '☀️';
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    toggle.textContent = '🌙';
  }

  toggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      toggle.textContent = '🌙';
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      toggle.textContent = '☀️';
      localStorage.setItem('theme', 'light');
    }
  });
}

function setupFontToggle() {
  const saved = localStorage.getItem('fontSize');
  if (saved !== null) currentFontSize = parseInt(saved);

  const toggle = document.getElementById('font-toggle');
  const content = document.getElementById('chapter-content');
  if (!toggle) return;

  toggle.textContent = `A${'⁺'.repeat(Math.max(0, currentFontSize - 1))}`;
  if (content) content.style.fontSize = fontSizes[currentFontSize];

  toggle.addEventListener('click', () => {
    currentFontSize = (currentFontSize + 1) % fontSizes.length;
    if (content) content.style.fontSize = fontSizes[currentFontSize];
    localStorage.setItem('fontSize', currentFontSize);
    toggle.textContent = `A${'⁺'.repeat(Math.max(0, currentFontSize - 1))}`;
  });
}

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

// Works for both the homepage's static search box and the chapter-page sidebar.
function setupSearch() {
  const input = document.getElementById('chapter-search');
  if (!input) return;

  input.placeholder = getText('searchPlaceholder');
  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.chapter-grid li, #chapter-list li').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

function setupLanguageSelector() {
  const select = document.getElementById('language-select');
  if (!select) return;

  select.value = currentLanguage;
  select.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('language', currentLanguage);
    applyLanguage();
  });
}

document.getElementById('comment-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('comment-name');
  const textInput = document.getElementById('comment-text');
  const name = nameInput?.value.trim();
  const text = textInput?.value.trim();
  const chapterId = getCurrentChapterId();

  if (!name || !text || chapterId === null) return;

  const key = `comments_${chapterId}`;
  const comments = JSON.parse(localStorage.getItem(key) || '[]');
  comments.push({ name, text, timestamp: Date.now() });
  localStorage.setItem(key, JSON.stringify(comments));

  if (textInput) textInput.value = '';
  loadComments(chapterId);
});

window.addEventListener('scroll', updateProgressBar);

// Initialize
const activeChapterId = getCurrentChapterId();
renderChapterList(activeChapterId);
renderHomeChapterGrids();
setupFontToggle();
setupThemeToggle();
setupSocialShare();
setupSearch();
setupLanguageSelector();
applyLanguage();
updateProgressBar();

if (activeChapterId !== null) {
  updateChapterStatsFromDOM();
  setupReactions(activeChapterId);
  setupBookmark(activeChapterId);
  loadComments(activeChapterId);
}
