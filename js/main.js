// The Veridian Protocol — Static Site Navigation

const chapters = [
  { id: 1, title: "CHAPTER 1 — The Glitch in the Blood", file: "01-the-glitch-in-the-blood.md" },
  { id: 2, title: "CHAPTER 2 — The Crimson Circuit", file: "02-the-crimson-circuit.md" },
  { id: 3, title: "CHAPTER 3 — Fragments of the Old World", file: "03-fragments-of-the-old-world.md" },
  { id: 4, title: "CHAPTER 4 — The Witch of Sector 7", file: "04-the-witch-of-sector-7.md" },
  { id: 5, title: "CHAPTER 5 — Protocol Zero", file: "05-protocol-zero.md" },
  { id: 6, title: "CHAPTER 6 — The Blood Network", file: "06-the-blood-network.md" },
  { id: 7, title: "CHAPTER 7 — Echoes in the Static", file: "07-echoes-in-the-static.md" },
  { id: 8, title: "CHAPTER 8 — The Veridian Core", file: "08-the-veridian-core.md" },
  { id: 9, title: "CHAPTER 9 — Sacrifice Protocol", file: "09-sacrifice-protocol.md" },
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

const fontSizes = ['16px', '18px', '21px', '24px'];
let currentFontSize = 1;

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
    noComments: 'No comments yet. Be the first!',
    loading: 'Loading chapter...',
    rss: '📡 RSS'
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
    noComments: 'ยังไม่มีความคิดเห็น เป็นคนแรกๆ กันเถอะ',
    loading: 'กำลังโหลดบท...',
    rss: '📡 RSS'
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
    noComments: '暂无评论，快来抢沙发',
    loading: '正在加载章节...',
    rss: '📡 订阅'
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
    noComments: 'Belum ada komentar. Yuk jadi yang pertama!',
    loading: 'Memuat bab...',
    rss: '📡 RSS'
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
    noComments: 'Chưa có bình luận. Hãy là người đầu tiên!',
    loading: 'Đang tải chương...',
    rss: '📡 RSS'
  }
};

let currentLanguage = localStorage.getItem('language') || 'en';

function getText(key) {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = getText(key);
    if (text && !['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) {
      el.textContent = text;
    }
  });

  const searchInput = document.getElementById('chapter-search');
  if (searchInput) searchInput.placeholder = getText('searchPlaceholder');

  const prevBtn = document.getElementById('prev-chapter');
  const nextBtn = document.getElementById('next-chapter');
  if (prevBtn) prevBtn.textContent = getText('prev');
  if (nextBtn) nextBtn.textContent = getText('next');

  const commentsTitle = document.querySelector('.comments-section h2');
  if (commentsTitle) commentsTitle.textContent = getText('commentsTitle');

  const commentName = document.getElementById('comment-name');
  const commentText = document.getElementById('comment-text');
  const commentFormBtn = document.querySelector('#comment-form button');
  if (commentName) commentName.placeholder = getText('yourName');
  if (commentText) commentText.placeholder = getText('commentsPlaceholder');
  if (commentFormBtn) commentFormBtn.textContent = getText('postComment');
}

function renderChapterList() {
  const list = document.getElementById('chapter-list');
  if (!list) return;
  list.innerHTML = '';

  chapters.forEach((ch, idx) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `/chapters/${ch.file.replace('.md', '.html')}`;
    link.textContent = ch.title;
    link.className = 'chapter-link';
    if (idx === currentChapter) li.classList.add('active');
    li.appendChild(link);
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

  const contentDiv = document.getElementById('chapter-content');
  if (contentDiv) contentDiv.innerHTML = `<div class="chapter-loading">${getText('loading')}</div>`;

  try {
    const response = await fetch(`/content/chapters/${chapter.file}`);
    const markdown = await response.text();
    const parser = window._md || ((md) => md);
    const html = parser(markdown);

    if (contentDiv) {
      contentDiv.innerHTML = html;
      contentDiv.style.fontSize = fontSizes[currentFontSize];
    }

    const prevBtn = document.getElementById('prev-chapter');
    const nextBtn = document.getElementById('next-chapter');
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === chapters.length - 1;

    renderChapterList();
    updateChapterStats(markdown);
    setupReactions(chapter.id);
    setupBookmark(chapter.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateProgressBar();
    loadComments(chapter.id);
    applyLanguage();
  } catch (error) {
    if (contentDiv) {
      contentDiv.innerHTML = `
        <h1>${chapter.title}</h1>
        <p><em>Chapter content loading...</em></p>
      `;
    }
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

function ensureChapterStats() {
  const contentDiv = document.getElementById('chapter-content');
  if (!contentDiv) return;

  let stats = contentDiv.querySelector('.chapter-stats');
  if (!stats) {
    stats = document.createElement('div');
    stats.className = 'chapter-stats';
    stats.innerHTML = '<span id="reading-time"></span> <span id="word-count"></span>';
    contentDiv.appendChild(stats);
  }
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
  const saved = localStorage.getItem('fontSize');
  if (saved !== null) currentFontSize = parseInt(saved);

  const toggle = document.getElementById('font-toggle');
  if (toggle) {
    toggle.textContent = `A${'⁺'.repeat(Math.max(0, currentFontSize - 1))}`;
    toggle.addEventListener('click', () => {
      currentFontSize = (currentFontSize + 1) % fontSizes.length;
      const content = document.getElementById('chapter-content');
      if (content) content.style.fontSize = fontSizes[currentFontSize];
      localStorage.setItem('fontSize', currentFontSize);
      toggle.textContent = `A${'⁺'.repeat(Math.max(0, currentFontSize - 1))}`;
    });
  }

  const content = document.getElementById('chapter-content');
  if (content) content.style.fontSize = fontSizes[currentFontSize];
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

function setupLanguageSelector() {
  const select = document.getElementById('language-select');
  if (!select) return;

  select.value = currentLanguage;
  select.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('language', currentLanguage);
    applyLanguage();
    loadComments(chapters[currentChapter]?.id);
  });
}

// Event listeners
document.getElementById('prev-chapter')?.addEventListener('click', () => {
  if (currentChapter > 0) loadChapter(currentChapter - 1);
});

document.getElementById('next-chapter')?.addEventListener('click', () => {
  if (currentChapter < chapters.length - 1) loadChapter(currentChapter + 1);
});

document.getElementById('comment-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('comment-name');
  const textInput = document.getElementById('comment-text');
  const name = nameInput?.value.trim();
  const text = textInput?.value.trim();
  const chapter = chapters[currentChapter];

  if (!name || !text || !chapter) return;

  const key = `comments_${chapter.id}`;
  const comments = JSON.parse(localStorage.getItem(key) || '[]');
  comments.push({ name, text, timestamp: Date.now() });
  localStorage.setItem(key, JSON.stringify(comments));

  if (textInput) textInput.value = '';
  loadComments(chapter.id);
});

window.addEventListener('scroll', updateProgressBar);

// Initialize
renderChapterList();
loadChapter(0);
setupFontToggle();
setupThemeToggle();
setupSocialShare();
setupSearch();
setupLanguageSelector();
applyLanguage();
