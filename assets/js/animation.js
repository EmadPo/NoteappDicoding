const animateHeader = document.querySelector('.animate-header');
const headerAnimation = new TimelineMax();
const cards = document.querySelectorAll('.note-card');

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    document.querySelector('.loading-indicator').style.display = 'none';
  }, 1000);
});

// header
headerAnimation.fromTo(
  animateHeader,
  1, // Duration
  { opacity: 0, y: 50 }, // From
  { opacity: 1, y: 0, ease: Power2.easeOut } // To
);

const buttons = document.querySelectorAll('.button');

// Card
function animateCard(card, delay) {
  setTimeout(function () {
    gsap.from(card, {
      duration: 1,
      opacity: 0,
      y: 50,
      ease: 'power2.out',
    });
  }, delay);
}

cards.forEach((card, index) => {
  // Tambahkan delay untuk setiap kartu
  const delay = index * 100; // Ubah nilai delay sesuai kebutuhan (dalam milidetik)
  animateCard(card, delay);
});

// Button
function animateButton(button) {
  gsap.to(button, {
    scale: 0.95,
    duration: 0.2,
    ease: 'power1.inOut',
  });
}

// reset button
function resetButtonAnimation(button) {
  gsap.to(button, {
    scale: 1,
    duration: 0.2,
    ease: 'power1.inOut',
  });
}

buttons.forEach((button) => {
  button.addEventListener('mousedown', () => {
    animateButton(button);
  });

  button.addEventListener('mouseup', () => {
    resetButtonAnimation(button);
  });

  button.addEventListener('mouseleave', () => {
    resetButtonAnimation(button);
  });
});
