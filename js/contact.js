const form = document.getElementById('contact-form');
const status = document.getElementById('status');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(form));
  status.textContent = 'Sending...';
  try {
    const res = await fetch('https://formspree.io/f/xqpqelny', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error((data.errors && data.errors[0].message) || 'Could not send your message.');
    status.textContent = 'Thanks! Your message has been sent.';
    form.reset();
  } catch (err) {
    status.textContent = err.message || 'Something went wrong. Please try again.';
  }
});
