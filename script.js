'use strict';
///////////////////////////////////////

// SELECTIONS
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link');
const overlay = document.querySelector('.overlay');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////

// CREATE A MODAL WINDOW
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////

// CREATE A COOKIE MESSAGE
const message = document.createElement('div');

message.classList.add('cookie-message');

message.innerHTML =
  'We use cookied for improved functionality and analytics <button class="btn--close--cookie"> Got it!</button>';

header.append(message); // last child of the header element

document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', () => message.remove());

document.querySelector('.btn--close--cookie').classList.add('btn');

message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

//////////////////////////////////////////

// LEARN MORE: SMOOTH SCROLLING TO SECTION 1

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  // Make the animation nice and smooth: MODERN VERSION
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////

// CREATE A TABBED COMPONENT
//tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return; // Guard clause: to avoid the error when clicking outside the button area

  // bring them all to regular position before lifting the clicked tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Change the content according to the tab that is clicked
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////

// IMPLEMENT PAGE NAVIGATION

// navLinks.forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');

//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//1. Add eventListener to common parent element
nav.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// MENU FADE ANIMATION _ Fade out elements of the header when hovering over one

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }

  console.log(this);
  console.log(e);
  console.log(opacity);
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// STICKY NAVIGATION
const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Create  a new intersection oberver
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry =>   )
// };

// const obsOptions = {
//   root: null, // null for observing the entire viewport
//   threshold: 0.1  // is Intersecting will be flase when les sthan 10% of the target is intersecting the root/viewport in this case
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// REVEAL SECTIONS ON SCROLLING
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace src with data-source
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// SLIDER

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  // // to see things better...
  // slider.style.transform = 'scale(0.35) translateX(-1200px)';
  // slider.style.overflow = 'visible';

  // Slides are overlapped. Place them side by side by changing their x axis
  // Funtion to go the slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  goToSlide(0);

  let currentSlide = 0;
  const maxSlide = slides.length;

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide === maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // Move slides to the right or left if you press any keyboard key
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Move slides of a number of time if you click on
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // pressing dots..
  const dotContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  createDots();

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide= "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  activateDot(0);
};

slider();

//2. What element originated the even

///////////////////////////////////////////////////////////////////////////////////////////////////
//Tests:

//document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
//const logo = document.querySelector('.nav__logo');

// // read attributes
// console.log(logo.getAttribute('src'));
// console.log(logo.alt);

// //set attributes
// logo.alt = 'Beautiful minimalist text';
// console.log(logo.alt);
// logo.setAttribute('company', 'Bankist');

// // Smooth scrolling down

// const btnScrollTo = document.querySelector('.btn--scroll-to');

// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect(); // describes the element s1coords dimensions nd its coords on the viewport

//   //console.log(e.target.getBoundingClientRect()); //e.target describes the clicked button coords and dimensions

//   //console.log(window.pageXOffset, window.pageYOffset); // coords of the current position of the viewport and the top of the page

//   //console.log(
//   //   document.documentElement.clientHeight,
//   //   document.documentElement.clientWidth
//   // ); // dynamic measure of the viewport
//   // Scrolling (left, top of the final point where to scroll to )
//   //window.scrollTo(s1coords.left, s1coords.top);

//   window.scrollTo(
//     s1coords.left + window.pageXOffset,
//     s1coords.top + window.pageYOffset
//   );
//   // by adding the window coords you add to the scolling jum also an extra space which will hide the part above where it was scrolled before clicking (current position + current scroll)

//   // Make the animation nice and smooth: OLD VERSION
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });

//   // Make the animation nice and smooth: MODERN VERSION
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// const h1 = document.querySelector('h1');

// // h1.onmouseenter = function (e) {
// //   alert('onmouseneter!');
// // };

// const alertH1 = function (e) {
//   alert('Great you are reading it!');
// };

// h1.addEventListener('mouseenter', alertH1);
// //h1.removeEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// // random color rgb (255,255,255)

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + 1);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// console.log(randomColor(0, 255));

// // attach an event handler to the menu link andl also to all its parent elements
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor(0, 255);
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor(0, 255);
// });
// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor(0, 255);
//   },
//   true
// );

// DOM CONTENT LOADED: first event fired that loads html and javascript before the html is parsed
Document.addEventListener('DOMContentLoaded', function (e) {
  console.log(e);
});

// once everything is loaded, then the load event is fired
window.addEventListener('load', function (e) {
  console.log(e);
});

// before unload event: is created immediately before the user is about to leave the page, by clicking for example, the closing  tab button. You can use this event to ask if they are sure they want to leave the page. Do not use it unless necessary

window.addEventListener('beforeunload', function (e) {
  e.preventDefault(); // some browsers (not Chrome) require it
  console.log(e);
  e.returnValue = '';
});
