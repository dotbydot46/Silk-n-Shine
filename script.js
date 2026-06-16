const nav = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-menu a");
const modal = document.querySelector("#bookingModal");
const bookingForm = document.querySelector("#bookingForm");
const bookingResult = document.querySelector("#bookingResult");
const bookingMessage = document.querySelector("#bookingMessage");
const serviceSelect = document.querySelector("#serviceSelect");
const copyBooking = document.querySelector("#copyBooking");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

menuToggle.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

function openBooking(service = "") {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  bookingForm.hidden = false;
  bookingResult.hidden = true;

  if (service && serviceSelect) {
    serviceSelect.value = service;
  }

  setTimeout(() => {
    const firstInput = bookingForm.querySelector("input, select, textarea");
    if (firstInput) firstInput.focus();
  }, 100);
}

function closeBooking() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".open-booking").forEach(button => {
  button.addEventListener("click", () => openBooking(button.dataset.service || ""));
});

document.querySelectorAll(".close-booking").forEach(button => {
  button.addEventListener("click", closeBooking);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("show")) closeBooking();
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(bookingForm);
  const message = [
    "New booking request for Silk n Shine Barbers",
    "",
    "Name: " + data.get("name"),
    "Phone: " + data.get("phone"),
    "Service: " + data.get("service"),
    "Preferred barber: " + data.get("barber"),
    "Preferred date: " + data.get("date"),
    "Preferred time: " + data.get("time"),
    "Notes: " + (data.get("notes") || "No notes"),
    "",
    "Please confirm if this appointment is available."
  ].join("\n");

  bookingMessage.value = message;
  bookingForm.hidden = true;
  bookingResult.hidden = false;
});

copyBooking.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(bookingMessage.value);
    copyBooking.textContent = "Copied";
    setTimeout(() => copyBooking.textContent = "Copy request", 1600);
  } catch (error) {
    bookingMessage.select();
    document.execCommand("copy");
    copyBooking.textContent = "Copied";
    setTimeout(() => copyBooking.textContent = "Copy request", 1600);
  }
});
