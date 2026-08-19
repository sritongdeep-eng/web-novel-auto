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

// Initialize
renderChapterList();
loadChapter(0);
setupFontToggle();
