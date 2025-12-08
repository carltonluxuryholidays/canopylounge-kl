'use strict';

/**
 * PRELOAD
 */
const preloader = document.querySelector("[data-preaload]");
window.addEventListener("load", function () {
  if (preloader) preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

/**
 * Add event listener to multiple elements
 */
const addEventOnElements = function (elements, eventType, callback) {
  if (!elements) return;
  for (let i = 0, len = elements.length; i < len; i++) {
    if (elements[i]) elements[i].addEventListener(eventType, callback);
  }
};

/**
 * NAVBAR
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  if (navbar) navbar.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};

addEventOnElements(navTogglers, "click", toggleNavbar);

// Toggle dropdown for Branches in mobile view
document.querySelectorAll('.navbar-item.dropdown > a').forEach(item => {
  item.addEventListener('click', function (e) {
    if (window.innerWidth <= 992) {
      e.preventDefault();
      this.parentElement.classList.toggle('active');
    }
  });
});


/**
 * HEADER & BACK TOP BTN
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (header) {
    if (isScrollBottom) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }
  }
  lastScrollPos = window.scrollY;
};

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    if (header) header.classList.add("active");
    if (backTopBtn) backTopBtn.classList.add("active");
    hideHeader();
  } else {
    if (header) header.classList.remove("active");
    if (backTopBtn) backTopBtn.classList.remove("active");
  }
});

/**
 * HERO SLIDER
 */
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems?.[0];

const updateSliderPos = function () {
  if (!heroSliderItems?.length) return;
  if (lastActiveSliderItem) lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
};

const slideNext = function () {
  if (!heroSliderItems?.length) return;
  currentSlidePos = (currentSlidePos + 1) % heroSliderItems.length;
  updateSliderPos();
};

const slidePrev = function () {
  if (!heroSliderItems?.length) return;
  currentSlidePos =
    (currentSlidePos - 1 + heroSliderItems.length) % heroSliderItems.length;
  updateSliderPos();
};

if (heroSliderNextBtn) heroSliderNextBtn.addEventListener("click", slideNext);
if (heroSliderPrevBtn) heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * Auto Slide
 */
let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(slideNext, 7000);
};

addEventOnElements(
  [heroSliderNextBtn, heroSliderPrevBtn],
  "mouseover",
  function () {
    clearInterval(autoSlideInterval);
  }
);

addEventOnElements(
  [heroSliderNextBtn, heroSliderPrevBtn],
  "mouseout",
  autoSlide
);

if (heroSlider) window.addEventListener("load", autoSlide);

/**
 * PARALLAX EFFECT
 */
const parallaxItems = document.querySelectorAll("[data-parallax-item]");

window.addEventListener("mousemove", function (event) {
  if (!parallaxItems.length) return;

  let x = (event.clientX / window.innerWidth) * 10 - 5;
  let y = (event.clientY / window.innerHeight) * 10 - 5;

  // reverse the number
  x = -x;
  y = -y;

  for (let i = 0; i < parallaxItems.length; i++) {
    const speed = Number(parallaxItems[i].dataset.parallaxSpeed || 1);
    parallaxItems[i].style.transform = `translate3d(${x * speed}px, ${y * speed
      }px, 0px)`;
  }
});
