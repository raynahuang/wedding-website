// =========================
// Active nav
// =========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) {
      current = s.getAttribute('id');
    }
  });

  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) {
      a.classList.add('active');
    }
  });
});


// =========================
// Story animation
// =========================
const storyPs = document.querySelectorAll('.story-prose p');

const storyObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
});

storyPs.forEach((p, i) => {
  p.style.transitionDelay = (i * 0.15) + 's';
  storyObs.observe(p);
});


// =========================
// RSVP dynamic behavior (NEW)
// =========================
document.addEventListener("DOMContentLoaded", () => {
    const attending = document.getElementById('attending');
    const guests = document.getElementById('guests');
    const guestNames = document.getElementById('guestNames');
  
    // Hide guest fields by default
    if (guests) guests.style.display = 'none';
    if (guestNames) guestNames.style.display = 'none';
  
    if (attending) {
      attending.addEventListener('change', function () {
        if (this.value === "No" || this.value === "") {
          guests.style.display = 'none';
          guestNames.style.display = 'none';
        } else {
          guests.style.display = 'block';
          guestNames.style.display = 'block';
        }
      });
    }
  });


// =========================
// RSVP → Google Form
// =========================
function submitRSVP() {
    let name = document.getElementById('name').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let email = document.getElementById('email').value.trim();
    let attending = document.getElementById('attending').value;
    let guests = document.getElementById('guests').value;
    let guestNames = document.getElementById('guestNames').value.trim();
  
    if (!name || !phone || !email || !attending) {
      alert('Please fill all required fields 💛');
      return;
    }
  
    if (attending === "Yes") {
      if (!guests || !guestNames) {
        alert('Please complete guest details 💛');
        return;
      }
    }
  
    // ✅ handle "No"
    if (attending === "No") {
      guests = "0";
      guestNames = "Not attending";
    }
  
    const btn = document.querySelector('.rsvp-btn');
    btn.innerText = "Sending...";
    btn.disabled = true;
  
    const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScaAILlko82vJknVDrMjsHW8OwEn4qNNnIfcYOfpcvkX9AtLA/formResponse";
  
    const formData = new FormData();
  
    formData.append("entry.877086558", name);
    formData.append("entry.1498135098", phone);
    formData.append("entry.1424661284", email);
    formData.append("entry.1605365033", attending);
    formData.append("entry.2606285", guests);
    formData.append("entry.1099223744", guestNames);
  
    fetch(formURL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });
  
    setTimeout(() => {
      document.getElementById('rsvpForm').style.display = 'none';
      document.getElementById('rsvpSuccess').style.display = 'block';
    }, 800);
  }