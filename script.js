
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const navLinks = nav.querySelectorAll("a");
const themeBtn = document.getElementById("themeBtn");
const themeIcon = themeBtn.querySelector(".theme-icon");

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "\u2600" : "\u263E";
  themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  themeBtn.setAttribute("title", theme === "dark" ? "Light mode" : "Dark mode");
  themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
};

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme || "dark");

menuBtn.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(opened));
});

themeBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("theme", nextTheme);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

const skillItems = document.querySelectorAll(".skill-item");

if (skillItems.length) {
  skillItems.forEach((item) => {
    const level = Number.parseInt(item.dataset.level || "0", 10);
    item.style.setProperty("--level", String(Math.max(0, Math.min(level, 100))));
  });

  const skillsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.22 }
  );

  skillItems.forEach((item) => skillsObserver.observe(item));
}

const timelineItems = document.querySelectorAll(".timeline-item");
const previewTitle = document.getElementById("previewTitle");
const previewTools = document.getElementById("previewTools");
const previewWorkflow = document.getElementById("previewWorkflow");
const previewResults = document.getElementById("previewResults");

const toListItems = (container, values) => {
  if (!container) return;
  container.innerHTML = "";
  values.forEach((value) => {
    const item = document.createElement("li");
    item.textContent = value;
    container.appendChild(item);
  });
};

const updateServicePreview = (item) => {
  if (!item || !previewTitle || !previewTools || !previewWorkflow || !previewResults) return;

  const title = item.dataset.title || "";
  const tools = (item.dataset.tools || "").split("|").map((entry) => entry.trim()).filter(Boolean);
  const workflow = (item.dataset.workflow || "").split("|").map((entry) => entry.trim()).filter(Boolean);
  const results = (item.dataset.results || "").split("|").map((entry) => entry.trim()).filter(Boolean);

  previewTitle.textContent = title;
  toListItems(previewTools, tools);
  toListItems(previewWorkflow, workflow);
  toListItems(previewResults, results);
};

const setActiveTimelineItem = (targetItem) => {
  timelineItems.forEach((item) => item.classList.remove("is-active"));
  targetItem.classList.add("is-active");
  updateServicePreview(targetItem);
};

if (timelineItems.length) {
  timelineItems.forEach((item, index) => {
    item.style.setProperty("--delay", `${index * 75}ms`);

    const activateItem = () => setActiveTimelineItem(item);
    item.addEventListener("mouseenter", activateItem);
    item.addEventListener("focus", activateItem);
    item.addEventListener("click", activateItem);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateItem();
      }
    });
  });

  const initialItem = document.querySelector(".timeline-item.is-active") || timelineItems[0];
  setActiveTimelineItem(initialItem);

  const timelineObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.22, rootMargin: "0px 0px -32px 0px" }
  );

  timelineItems.forEach((item) => timelineObserver.observe(item));
}

// Typing Animation
const typingText = document.getElementById("typing-text");
const roles = ["Full Stack Developer", "MERN Stack Expert", "UI/UX Designer", "Problem Solver"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typingText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50; // Slower, more controlled deleting
  } else {
    typingText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    // Slower, more natural typing speed (between 120ms and 180ms)
    typeSpeed = Math.random() * (180 - 120) + 120;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    typeSpeed = 3000; // Longer pause at the end of a word (3 seconds)
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 1000; // Pause before starting to type the next word
  }

  setTimeout(type, typeSpeed);
}
if (typingText) {
  type();
}
