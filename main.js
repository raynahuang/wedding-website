// Active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// Reusable IntersectionObserver factory
const onScrollVisible = (selector, className = 'visible', opts = {}) => {
  const els = document.querySelectorAll(selector);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add(className);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px', ...opts });
  els.forEach(el => obs.observe(el));
  return els;
};

// Story paragraphs — staggered fade in
const storyPs = onScrollVisible('.story-prose p');
storyPs.forEach((p, i) => p.style.transitionDelay = (i * 0.15) + 's');

// Schedule cards
onScrollVisible('.anim-card', 'visible', { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

// Gallery photos
onScrollVisible('.photo-frame', 'in-view', { threshold: 0.2 });

// RSVP form behavior
document.addEventListener('DOMContentLoaded', () => {
  const attending  = document.getElementById('attending');
  const guests     = document.getElementById('guests');
  const guestNames = document.getElementById('guestNames');

  const toggleGuestFields = (show) => {
    if (guests)     guests.style.display     = show ? 'block' : 'none';
    if (guestNames) guestNames.style.display = show ? 'block' : 'none';
  };
  toggleGuestFields(false);

  if (attending) {
    attending.addEventListener('change', function () {
      toggleGuestFields(this.value === 'Yes');
    });
  }
});

// RSVP submit → Google Form
function submitRSVP() {
  const get = id => document.getElementById(id).value.trim();
  const name = get('name'), phone = get('phone'), email = get('email');
  const attending = document.getElementById('attending').value;
  let guests = document.getElementById('guests').value;
  let guestNames = document.getElementById('guestNames').value.trim();

  if (!name || !phone || !email || !attending) {
    alert('Please fill all required fields 💛');
    return;
  }
  if (attending === 'Yes' && (!guests || !guestNames)) {
    alert('Please complete guest details 💛');
    return;
  }
  if (attending === 'No') { guests = '0'; guestNames = 'Not attending'; }

  const btn = document.querySelector('.rsvp-btn');
  btn.innerText = 'Sending...';
  btn.disabled = true;

  const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLScaAILlko82vJknVDrMjsHW8OwEn4qNNnIfcYOfpcvkX9AtLA/formResponse';
  const formData = new FormData();
  Object.entries({
    'entry.877086558':  name,
    'entry.1498135098': phone,
    'entry.1424661284': email,
    'entry.1605365033': attending,
    'entry.2606285':    guests,
    'entry.1099223744': guestNames,
  }).forEach(([k, v]) => formData.append(k, v));

  fetch(formURL, { method: 'POST', mode: 'no-cors', body: formData });

  setTimeout(() => {
    document.getElementById('rsvpForm').style.display = 'none';
    document.getElementById('rsvpSuccess').style.display = 'block';
  }, 800);
}