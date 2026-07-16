/* Bluegrass Property Solutions — nav + estimate form */
(function () {
  // ── mobile nav ──────────────────────────────────────────
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── estimate form (Web3Forms) ───────────────────────────
  var form = document.getElementById('estimate-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var submit = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var key = form.querySelector('input[name="access_key"]').value;
    if (!key || key.indexOf('YOUR_WEB3FORMS') === 0) {
      status.className = 'form-status err';
      status.textContent = 'This form isn’t connected yet. Please call (270) 978-7035 and we’ll get you a free estimate.';
      return;
    }

    var original = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    status.className = 'form-status';
    status.textContent = '';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Thanks — your request is in. Tyler will get back to you shortly. Need it sooner? Call (270) 978-7035.';
          status.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      })
      .catch(function () {
        status.className = 'form-status err';
        status.textContent = 'Something went wrong sending that. Please call or text (270) 978-7035 and we’ll take care of it.';
      })
      .finally(function () {
        submit.disabled = false;
        submit.textContent = original;
      });
  });
})();
