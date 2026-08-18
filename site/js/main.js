// The Veridian Protocol — Static Site Navigation

const chapters = [
  { id: 1, title: "Chapter 1: The Glitch in the Blood", file: "01-the-glitch-in-the-blood.md" }
];

let currentChapter = 0;

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

async function loadChapter(index) {
  if (index < 0 || index >= chapters.length) return;

  currentChapter = index;
  const chapter = chapters[index];

  try {
    const response = await fetch(`/content/chapters/${chapter.file}`);
    const markdown = await response.text();

    const contentDiv = document.getElementById('chapter-content');
    contentDiv.innerHTML = marked.parse(markdown);

    document.getElementById('prev-chapter').disabled = index === 0;
    document.getElementById('next-chapter').disabled = index === chapters.length - 1;

    renderChapterList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    document.getElementById('chapter-content').innerHTML = `
      <h1>${chapter.title}</h1>
      <p><em>Chapter content loading...</em></p>
    `;
  }
}

document.getElementById('prev-chapter').addEventListener('click', () => {
  if (currentChapter > 0) loadChapter(currentChapter - 1);
});

document.getElementById('next-chapter').addEventListener('click', () => {
  if (currentChapter < chapters.length - 1) loadChapter(currentChapter + 1);
});

// Initialize
renderChapterList();
loadChapter(0);
