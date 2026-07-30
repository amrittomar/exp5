const platformLimits = {
  Instagram: 110,
  Twitter: 50,
  LinkedIn: 120,
};

const platformColors = {
  Instagram: "linear-gradient(135deg, #ff4ecd, #ff8a5c)",
  Twitter: "linear-gradient(135deg, #4da3ff, #6c7cff)",
  LinkedIn: "linear-gradient(135deg, #2de2c4, #43a5ff)",
};

const defaultPosts = {
  Instagram:
    "✨ New drop alert! Your next big idea deserves a bold spotlight. Share it, spark it, and grow it with confidence.",
  Twitter:
    "Building something exciting for creators and dreamers. What would you love to see next?",
  LinkedIn:
    "Excited to share a fresh idea with my network today. Growth happens when smart teams stay curious, collaborate fast, and keep improving.",
};

let selectedPlatform = "Instagram";
let hasUserEdited = false;
let drafts = JSON.parse(localStorage.getItem("socialDrafts") || "[]");

const platformButtons = document.querySelectorAll(".platform-pill");
const textArea = document.getElementById("postText");
const wordCount = document.getElementById("wordCount");
const warningText = document.getElementById("warningText");
const hint = document.getElementById("platformHint");
const draftList = document.getElementById("draftList");
const draftCount = document.getElementById("draftCount");
const draftBtn = document.getElementById("draftBtn");
const postBtn = document.getElementById("postBtn");

function getWordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function setDefaultPostFor(platform) {
  textArea.value = defaultPosts[platform];
  hasUserEdited = false;
  checkPostLimit();
}

function updatePlatformUI() {
  platformButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.platform === selectedPlatform);
  });

  const limit = platformLimits[selectedPlatform];
  hint.textContent = `${selectedPlatform} limit: ${limit} words`;

  if (!hasUserEdited && !textArea.value.trim()) {
    setDefaultPostFor(selectedPlatform);
  }

  checkPostLimit();
}

function checkPostLimit() {
  const currentWords = getWordCount(textArea.value);
  const limit = platformLimits[selectedPlatform];
  wordCount.textContent = currentWords;

  if (currentWords > limit) {
    warningText.classList.remove("hidden");
    warningText.textContent = `⚠️ Your post exceeds the allowed limit for ${selectedPlatform} (${limit} words max).`;
  } else {
    warningText.classList.add("hidden");
  }
}

function saveDrafts() {
  localStorage.setItem("socialDrafts", JSON.stringify(drafts));
}

function renderDrafts() {
  draftCount.textContent = `${drafts.length} saved`;

  if (!drafts.length) {
    draftList.innerHTML = '<div class="empty-note">No drafts yet — save your first stylish post.</div>';
    return;
  }

  draftList.innerHTML = drafts
    .map(
      (draft, idx) => `
        <div class="draft-item" style="background:${platformColors[draft.platform]};">
          <small>${draft.platform} • ${draft.time}</small>
          <div>${draft.post}</div>
        </div>
      `
    )
    .join("");
}

platformButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!hasUserEdited && !textArea.value.trim()) {
      setDefaultPostFor(button.dataset.platform);
    }

    selectedPlatform = button.dataset.platform;
    updatePlatformUI();
  });
});

textArea.addEventListener("input", () => {
  hasUserEdited = true;
  checkPostLimit();
});

draftBtn.addEventListener("click", () => {
  const post = textArea.value.trim();
  if (!post) {
    alert("Please write something before saving it to draft.");
    return;
  }

  drafts.unshift({
    platform: selectedPlatform,
    post,
    time: new Date().toLocaleString(),
  });

  saveDrafts();
  renderDrafts();
  textArea.value = "";
  checkPostLimit();
});

postBtn.addEventListener("click", () => {
  const post = textArea.value.trim();
  if (!post) {
    alert("Please write a post before sending it.");
    return;
  }

  const limit = platformLimits[selectedPlatform];
  if (getWordCount(post) > limit) {
    warningText.classList.remove("hidden");
    warningText.textContent = `⚠️ Your post is too long for ${selectedPlatform}. The draft has not been sent.`;
    return;
  }

  drafts.unshift({
    platform: selectedPlatform,
    post,
    time: new Date().toLocaleString(),
  });

  saveDrafts();
  renderDrafts();
  textArea.value = "";
  checkPostLimit();
  alert(`Your ${selectedPlatform} post has been saved to drafts.`);
});

setDefaultPostFor(selectedPlatform);
updatePlatformUI();
renderDrafts();
