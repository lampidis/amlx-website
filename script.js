const root = document.documentElement;
const header = document.querySelector("[data-header]");
const heroMedia = document.querySelector("[data-hero-media]");
const contactForm = document.querySelector("[data-contact-form]");

root.classList.add("is-ready");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function updateHeroMotion() {
  if (!heroMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const shift = Math.min(window.scrollY * 0.08, 42);
  heroMedia.style.setProperty("--hero-shift", `${shift}px`);
}

updateHeader();
updateHeroMotion();

window.addEventListener(
  "scroll",
  () => {
    updateHeader();
    updateHeroMotion();
  },
  { passive: true }
);

const revealItems = document.querySelectorAll("[data-reveal]");

function isInInitialViewport(item) {
  const rect = item.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.96 && rect.bottom > 0;
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => {
    if (isInInitialViewport(item)) {
      item.classList.add("is-visible");
    } else {
      observer.observe(item);
    }
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const organization = formData.get("organization") || "";
    const message = formData.get("message") || "";
    const status = contactForm.querySelector("[data-form-status]");

    const subject = encodeURIComponent(`AMLX partnership request from ${organization || name}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization}`,
        "",
        message,
      ].join("\n")
    );

    if (status) {
      status.textContent = "Opening your email client with the request.";
    }

    window.location.href = `mailto:t.vanheuvelen@amlx.nl?subject=${subject}&body=${body}`;
  });
}
