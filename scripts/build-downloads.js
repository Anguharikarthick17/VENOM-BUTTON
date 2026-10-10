/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STAGING_DIR = path.join(__dirname, '..', 'downloads-staging');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'downloads');

fs.mkdirSync(STAGING_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const MIT_LICENSE = (name) => `MIT License

Copyright (c) 2026 GENZLOG (https://genzlog.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "${name}"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

// ─────────────────────────────────────────────────────────────
// 1. ANIMATED LOGIN PAGE
// ─────────────────────────────────────────────────────────────
const loginDir = path.join(STAGING_DIR, 'animated-login-page');
fs.mkdirSync(loginDir, { recursive: true });

fs.writeFileSync(path.join(loginDir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animated Split-Screen Login — Free Code by GENZLOG</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="login-wrapper">
    <!-- Left Hero Brand Panel -->
    <div class="brand-panel">
      <div class="brand-header">
        <div class="brand-logo">
          <span class="logo-mark">GZ</span>
          <span class="logo-text">GENZLOG</span>
        </div>
        <span class="brand-tag">FREE UI COMPONENT</span>
      </div>
      
      <div class="brand-content">
        <h1 class="brand-title">Build faster.<br><span class="accent-text">Ship cleaner.</span></h1>
        <p class="brand-desc">A minimal, responsive split-screen authentication experience designed for modern SaaS and creator platforms.</p>
        
        <div class="feature-bullets">
          <div class="bullet"><span>✓</span> Pure HTML5, CSS3, & Vanilla JS</div>
          <div class="bullet"><span>✓</span> Zero external dependencies</div>
          <div class="bullet"><span>✓</span> Fully responsive mobile drawer</div>
        </div>
      </div>

      <div class="brand-footer">
        <p>© 2026 GENZLOG. Free MIT License.</p>
      </div>
    </div>

    <!-- Right Interactive Form Panel -->
    <div class="form-panel">
      <div class="form-container">
        <div class="form-header">
          <h2>Welcome back</h2>
          <p>Please enter your credentials to access your dashboard.</p>
        </div>

        <form id="loginForm" class="auth-form" onsubmit="return false;">
          <div class="input-group">
            <label for="email">Email address</label>
            <input type="email" id="email" placeholder="name@company.com" required autocomplete="email">
            <span class="input-hint" id="emailHint"></span>
          </div>

          <div class="input-group">
            <div class="label-row">
              <label for="password">Password</label>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>
            <div class="password-wrapper">
              <input type="password" id="password" placeholder="••••••••" required autocomplete="current-password">
              <button type="button" id="togglePassword" class="toggle-btn" aria-label="Toggle password visibility">👁</button>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-label">
              <input type="checkbox" id="rememberMe">
              <span>Remember this device for 30 days</span>
            </label>
          </div>

          <button type="submit" id="submitBtn" class="submit-btn">
            <span class="btn-text">Sign in to account</span>
            <span class="btn-icon">→</span>
          </button>

          <div id="formAlert" class="form-alert" role="alert"></div>

          <div class="divider">
            <span>or continue with</span>
          </div>

          <div class="social-row">
            <button type="button" class="social-btn">Google</button>
            <button type="button" class="social-btn">GitHub</button>
          </div>

          <p class="signup-prompt">
            Don't have an account yet? <a href="#" class="signup-link">Create one for free</a>
          </p>
        </form>
      </div>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
`);

fs.writeFileSync(path.join(loginDir, 'style.css'), `:root {
  --bg-primary: #050505;
  --bg-surface: #0e0e11;
  --bg-input: #15151a;
  --border-color: #22222a;
  --border-focus: #FFFFFF;
  --text-primary: #F5F5F5;
  --text-secondary: #94949e;
  --accent-primary: #FFFFFF;
  --accent-glow: rgba(255, 255, 255, 0.2);
  --error: #ff4d4f;
  --success: #10b981;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-wrapper {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

/* Left Brand Panel */
.brand-panel {
  flex: 1;
  background: radial-gradient(circle at 20% 30%, #17171e 0%, #050505 70%);
  border-right: 1px solid var(--border-color);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.brand-panel::before {
  content: "";
  position: absolute;
  top: -20%;
  left: -20%;
  width: 400px;
  height: 400px;
  background: var(--accent-glow);
  filter: blur(120px);
  border-radius: 50%;
  pointer-events: none;
}

.brand-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-mark {
  background: var(--accent-primary);
  color: #000;
  font-weight: 900;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  letter-spacing: -0.05em;
}

.logo-text {
  font-weight: 800;
  letter-spacing: 0.1em;
  font-size: 1rem;
}

.brand-tag {
  font-size: 0.7rem;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  letter-spacing: 0.05em;
}

.brand-content {
  margin: 4rem 0;
  max-width: 480px;
}

.brand-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.accent-text {
  color: var(--accent-primary);
}

.brand-desc {
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.feature-bullets {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bullet {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #d1d1db;
  font-size: 0.95rem;
}

.bullet span {
  color: var(--accent-primary);
  font-weight: bold;
}

.brand-footer {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

/* Right Form Panel */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: var(--bg-primary);
}

.form-container {
  width: 100%;
  max-width: 420px;
}

.form-header {
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.input-group {
  margin-bottom: 1.25rem;
}

.input-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #cfcfe0;
  margin-bottom: 0.5rem;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.forgot-link {
  font-size: 0.8rem;
  color: var(--accent-primary);
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.85rem 1rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  outline: none;
}

input[type="email"]:focus,
input[type="password"]:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 2.75rem;
}

.toggle-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
}

.form-options {
  margin-bottom: 1.5rem;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.remember-label input[type="checkbox"] {
  accent-color: var(--accent-primary);
}

.submit-btn {
  width: 100%;
  padding: 0.95rem 1.5rem;
  background: var(--accent-primary);
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  background: #ffe033;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px var(--accent-glow);
}

.submit-btn:active {
  transform: translateY(0);
}

.form-alert {
  display: none;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  line-height: 1.4;
}

.form-alert.success {
  display: block;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid var(--success);
  color: #34d399;
}

.form-alert.error {
  display: block;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid var(--error);
  color: #f87171;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.divider span {
  padding: 0 0.75rem;
}

.social-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  flex: 1;
  padding: 0.75rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  border-color: #444455;
  background: #181820;
}

.signup-prompt {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.signup-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 600;
}

.signup-link:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .login-wrapper {
    flex-direction: column;
  }
  .brand-panel {
    display: none;
  }
  .form-panel {
    padding: 2rem 1.5rem;
  }
}
`);

fs.writeFileSync(path.join(loginDir, 'script.js'), `document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const loginForm = document.getElementById('loginForm');
  const formAlert = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBtn');

  // Password visibility toggle
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggleBtn.textContent = isPassword ? '🔒' : '👁';
    });
  }

  // Interactive submit validation
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        showAlert('Please fill in both your email and password.', 'error');
        return;
      }

      // Simulate loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Verifying...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showAlert('Demo authentication successful! Connect your real API in script.js.', 'success');
      }, 700);
    });
  }

  function showAlert(msg, type) {
    if (!formAlert) return;
    formAlert.textContent = msg;
    formAlert.className = 'form-alert ' + type;
    formAlert.style.display = 'block';
  }
});
`);

fs.writeFileSync(path.join(loginDir, 'README.md'), `# Animated Split-Screen Login Page
**Free Frontend Resource by GENZLOG (https://genzlog.com)**

A modern, responsive split-screen authentication page featuring an editorial brand panel, sleek form controls, floating labels, password reveal toggle, and responsive mobile adaptations.

## Features
- Split-screen layout (Hero brand panel + form panel)
- Responsive mobile adaptation (gracefully collapses on mobile)
- Password visibility show/hide toggle
- Pure HTML5, CSS3, and Vanilla JavaScript (zero external dependencies)
- Styled with dark mode aesthetics (#050505 background with #FFFFFF crisp monochrome accents)
- Accessible form labeling and ARIA attributes

## Quick Start
1. Extract this ZIP archive into your project directory.
2. Open \`index.html\` directly in any modern browser.
3. To customize colors, update the CSS custom properties in \`:root\` inside \`style.css\`.

## Customization Guide
- **Brand Name & Logo**: Edit the \`.brand-logo\` container in \`index.html\`.
- **Colors**: Open \`style.css\` and modify \`--accent-primary\` and \`--bg-primary\`.
- **Backend API**: In \`script.js\`, replace the \`setTimeout\` simulation in the form submit handler with your actual \`fetch()\` or Supabase/Firebase auth call.

## License
Released under the MIT License. Free for both personal and commercial use with attribution to GENZLOG.
`);

fs.writeFileSync(path.join(loginDir, 'LICENSE.md'), MIT_LICENSE('Animated Split-Screen Login Page'));

// Zip login page
execSync(`cd "${STAGING_DIR}" && zip -r "${path.join(OUTPUT_DIR, 'animated-login-page.zip')}" animated-login-page`);
console.log('Created animated-login-page.zip');

// ─────────────────────────────────────────────────────────────
// 2. MODERN NAVBAR
// ─────────────────────────────────────────────────────────────
const navDir = path.join(STAGING_DIR, 'modern-navbar');
fs.mkdirSync(navDir, { recursive: true });

fs.writeFileSync(path.join(navDir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Glassmorphism Navigation Bar — GENZLOG</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Navigation Bar -->
  <header class="navbar" id="navbar">
    <div class="nav-container">
      <a href="#" class="brand-logo">
        <span class="logo-box">GZ</span>
        <span class="logo-title">STUDIO</span>
      </a>

      <!-- Desktop Links -->
      <nav class="nav-links">
        <a href="#services" class="nav-item">Services</a>
        <a href="#free-code" class="nav-item">Free Code</a>
        <a href="#work" class="nav-item">Work</a>
        <a href="#about" class="nav-item">About</a>
      </nav>

      <!-- Desktop Action -->
      <div class="nav-actions">
        <a href="#contact" class="btn-primary">Let's Talk ↗</a>
      </div>

      <!-- Mobile Hamburger Button -->
      <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile Slide Drawer -->
    <div class="mobile-drawer" id="mobileDrawer">
      <nav class="mobile-links">
        <a href="#services" class="mobile-item">Services</a>
        <a href="#free-code" class="mobile-item">Free Code</a>
        <a href="#work" class="mobile-item">Work</a>
        <a href="#about" class="mobile-item">About</a>
        <a href="#contact" class="btn-primary mobile-cta">Let's Talk ↗</a>
      </nav>
    </div>
  </header>

  <!-- Demo Content Below Navbar -->
  <main class="demo-content">
    <div class="hero-sample">
      <span class="badge">FREE UI COMPONENT</span>
      <h1>Responsive Glassmorphism Navbar</h1>
      <p>Scroll down to see the frosted glass effect activate on scroll. Resize the window to test the mobile slide-out drawer.</p>
    </div>
  </main>

  <script src="script.js"></script>
</body>
</html>
`);

fs.writeFileSync(path.join(navDir, 'style.css'), `:root {
  --bg-dark: #050505;
  --bg-glass: rgba(10, 10, 14, 0.75);
  --border-glass: rgba(255, 255, 255, 0.08);
  --text-main: #F5F5F5;
  --text-muted: #94949e;
  --accent: #FFFFFF;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background: var(--bg-dark);
  color: var(--text-main);
  min-height: 200vh;
}

/* Navbar Container */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1.25rem 2rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  background: transparent;
}

.navbar.scrolled {
  padding: 0.85rem 2rem;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-glass);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand */
.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--text-main);
}

.logo-box {
  background: var(--accent);
  color: #000;
  font-weight: 900;
  font-size: 0.85rem;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
}

.logo-title {
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.08em;
}

/* Desktop Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-item {
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: color 0.2s ease;
  position: relative;
}

.nav-item:hover {
  color: var(--text-main);
}

.nav-item::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.2s ease;
}

.nav-item:hover::after {
  width: 100%;
}

/* Button CTA */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--accent);
  color: #000;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.6rem 1.15rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #ffe033;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(255, 255, 255, 0.25);
}

/* Hamburger Toggle */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
}

.mobile-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-main);
  transition: all 0.3s ease;
}

.mobile-toggle.active span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.mobile-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-toggle.active span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Drawer */
.mobile-drawer {
  display: none;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border-glass);
  margin-top: 0.75rem;
}

.mobile-drawer.open {
  display: block;
}

.mobile-links {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.mobile-item {
  color: var(--text-main);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
}

.mobile-cta {
  display: inline-block;
  text-align: center;
  margin-top: 0.5rem;
}

/* Demo Content */
.demo-content {
  padding-top: 140px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--accent);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
}

.hero-sample h1 {
  font-size: 2.8rem;
  margin-bottom: 1rem;
}

.hero-sample p {
  color: var(--text-muted);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .nav-links, .nav-actions {
    display: none;
  }
  .mobile-toggle {
    display: flex;
  }
}
`);

fs.writeFileSync(path.join(navDir, 'script.js'), `document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  // Scroll detection for frosted glass effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
    });

    // Close mobile menu on clicking any link
    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
      });
    });
  }
});
`);

fs.writeFileSync(path.join(navDir, 'README.md'), `# Responsive Glassmorphism Navigation Bar
**Free Frontend Resource by GENZLOG (https://genzlog.com)**

A modern navigation bar component with frosted glass blur upon scrolling, responsive mobile slide-out menu, hover micro-interactions, and pure vanilla CSS/JavaScript.

## Features
- Sticky fixed navigation
- Frosted glass effect activates on scroll (\`backdrop-filter: blur(16px)\`)
- Fully responsive mobile drawer with animated hamburger icon
- Zero external CSS or JavaScript libraries required
- Accessible keyboard and mobile touch support

## Setup
1. Include \`style.css\` in your HTML \`<head>\`.
2. Include the \`<header class="navbar">\` markup.
3. Link \`script.js\` right before \`</body>\`.

## License
MIT License. Free for personal & commercial use with attribution to GENZLOG.
`);

fs.writeFileSync(path.join(navDir, 'LICENSE.md'), MIT_LICENSE('Responsive Glassmorphism Navigation Bar'));

execSync(`cd "${STAGING_DIR}" && zip -r "${path.join(OUTPUT_DIR, 'modern-navbar.zip')}" modern-navbar`);
console.log('Created modern-navbar.zip');

// ─────────────────────────────────────────────────────────────
// 3. PRICING CARDS
// ─────────────────────────────────────────────────────────────
const priceDir = path.join(STAGING_DIR, 'pricing-cards');
fs.mkdirSync(priceDir, { recursive: true });

fs.writeFileSync(path.join(priceDir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern SaaS Pricing Cards with Monthly/Annual Toggle — GENZLOG</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="pricing-container">
    <div class="pricing-header">
      <span class="badge">TRANSPARENT PRICING</span>
      <h1>Simple plans that scale with you</h1>
      <p>Choose the tier that matches your scope. Upgrade or customize at any time.</p>

      <!-- Toggle Billing Switch -->
      <div class="toggle-wrapper">
        <span class="toggle-label" id="monthlyLabel">Monthly</span>
        <button class="toggle-switch" id="billingToggle" aria-label="Toggle annual billing">
          <span class="toggle-knob"></span>
        </button>
        <span class="toggle-label" id="annualLabel">
          Yearly <span class="discount-pill">Save 20%</span>
        </span>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="cards-grid">
      <!-- Tier 1: Starter -->
      <div class="pricing-card">
        <div class="card-header">
          <span class="tier-name">STARTER</span>
          <p class="tier-desc">Ideal for personal portfolios and simple single-page sites.</p>
        </div>
        <div class="price-box">
          <span class="currency">₹</span>
          <span class="amount" data-monthly="9,999" data-annual="7,999">9,999</span>
          <span class="period">/ project</span>
        </div>
        <ul class="feature-list">
          <li><span class="check">✓</span> 1 High-Converting Landing Page</li>
          <li><span class="check">✓</span> Mobile-First Responsive Design</li>
          <li><span class="check">✓</span> Contact / Lead Form</li>
          <li><span class="check">✓</span> Basic SEO Setup</li>
          <li class="disabled"><span>✕</span> CMS Integration</li>
          <li class="disabled"><span>✕</span> Custom Web Animations</li>
        </ul>
        <a href="#contact" class="btn-card">Choose Starter</a>
      </div>

      <!-- Tier 2: Business (Featured) -->
      <div class="pricing-card featured">
        <div class="popular-badge">MOST POPULAR</div>
        <div class="card-header">
          <span class="tier-name">BUSINESS</span>
          <p class="tier-desc">Complete multi-page web presence for small and growing companies.</p>
        </div>
        <div class="price-box">
          <span class="currency">₹</span>
          <span class="amount" data-monthly="14,999" data-annual="11,999">14,999</span>
          <span class="period">/ project</span>
        </div>
        <ul class="feature-list">
          <li><span class="check">✓</span> Up to 5 Responsive Pages</li>
          <li><span class="check">✓</span> Modern UI/UX Design System</li>
          <li><span class="check">✓</span> Custom Contact & Inquiry Engine</li>
          <li><span class="check">✓</span> Performance Optimization (&lt;1s load)</li>
          <li><span class="check">✓</span> Deployment & Domain Setup Support</li>
          <li><span class="check">✓</span> Agreed Revision Allowance</li>
        </ul>
        <a href="#contact" class="btn-card primary">Choose Business</a>
      </div>

      <!-- Tier 3: Custom / Enterprise -->
      <div class="pricing-card">
        <div class="card-header">
          <span class="tier-name">CUSTOM APP</span>
          <p class="tier-desc">Complex web applications, e-commerce, and custom digital software.</p>
        </div>
        <div class="price-box">
          <span class="currency">₹</span>
          <span class="amount" data-monthly="29,999" data-annual="24,999">29,999</span>
          <span class="period">/ starting range</span>
        </div>
        <ul class="feature-list">
          <li><span class="check">✓</span> Bespoke Web App Architecture</li>
          <li><span class="check">✓</span> Database & Authentication</li>
          <li><span class="check">✓</span> Third-party API Integrations</li>
          <li><span class="check">✓</span> E-commerce / Payment Gateways</li>
          <li><span class="check">✓</span> Automated CI/CD Deployment</li>
          <li><span class="check">✓</span> Dedicated Maintenance Support</li>
        </ul>
        <a href="#contact" class="btn-card">Get Custom Quote</a>
      </div>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
`);

fs.writeFileSync(path.join(priceDir, 'style.css'), `:root {
  --bg-page: #050505;
  --bg-card: #0d0d11;
  --bg-featured: #121218;
  --border-card: #202028;
  --border-featured: #FFFFFF;
  --text-main: #F5F5F5;
  --text-dim: #8e8e9a;
  --accent: #FFFFFF;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background: var(--bg-page);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
}

.pricing-container {
  max-width: 1200px;
  width: 100%;
}

.pricing-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 3.5rem;
}

.badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--accent);
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}

.pricing-header h1 {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 0.75rem;
}

.pricing-header p {
  color: var(--text-dim);
  font-size: 1rem;
  line-height: 1.5;
}

/* Toggle */
.toggle-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  background: #111116;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  border: 1px solid var(--border-card);
}

.toggle-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  background: #252530;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: background 0.25s ease;
}

.toggle-switch.annual {
  background: var(--accent);
}

.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.25s ease;
}

.toggle-switch.annual .toggle-knob {
  transform: translateX(20px);
  background: #000;
}

.discount-pill {
  background: rgba(255, 255, 255, 0.2);
  color: var(--accent);
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 8px;
  font-weight: 700;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  align-items: stretch;
}

.pricing-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 16px;
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.pricing-card:hover {
  transform: translateY(-4px);
  border-color: #383848;
}

.pricing-card.featured {
  background: var(--bg-featured);
  border: 2px solid var(--border-featured);
  box-shadow: 0 10px 40px rgba(255, 255, 255, 0.1);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: #000;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  letter-spacing: 0.08em;
}

.tier-name {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.tier-desc {
  color: var(--text-dim);
  font-size: 0.85rem;
  margin-top: 0.4rem;
  line-height: 1.4;
}

.price-box {
  margin: 1.75rem 0;
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.currency {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-dim);
}

.amount {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.period {
  color: var(--text-dim);
  font-size: 0.85rem;
  margin-left: 0.25rem;
}

.feature-list {
  list-style: none;
  margin-bottom: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.feature-list li {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #d1d1dc;
}

.feature-list li.disabled {
  color: #555562;
}

.check {
  color: var(--accent);
  font-weight: bold;
}

.btn-card {
  display: block;
  text-align: center;
  padding: 0.85rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  background: #181820;
  color: var(--text-main);
  border: 1px solid var(--border-card);
  transition: all 0.2s ease;
}

.btn-card:hover {
  background: #252532;
  border-color: #404050;
}

.btn-card.primary {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
}

.btn-card.primary:hover {
  background: #ffe033;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.25);
}

@media (max-width: 768px) {
  .pricing-header h1 {
    font-size: 2.1rem;
  }
}
`);

fs.writeFileSync(path.join(priceDir, 'script.js'), `document.addEventListener('DOMContentLoaded', () => {
  const billingToggle = document.getElementById('billingToggle');
  const amountEls = document.querySelectorAll('.amount');

  let isAnnual = false;

  if (billingToggle) {
    billingToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      billingToggle.classList.toggle('annual', isAnnual);

      amountEls.forEach(el => {
        const targetValue = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
        el.textContent = targetValue;
      });
    });
  }
});
`);

fs.writeFileSync(path.join(priceDir, 'README.md'), `# Modern SaaS Pricing Cards with Monthly/Annual Toggle
**Free Frontend Resource by GENZLOG (https://genzlog.com)**

An eye-catching, responsive pricing table component with a smooth Monthly vs Annual billing switch, glowing featured card, feature checklists, and dark-mode styling.

## Features
- Dynamic price toggling between monthly & annual rates
- Highlighted "Most Popular" card with crisp white border and badge
- Responsive grid (adjusts cleanly on mobile, tablet, and desktop)
- Semantic list structure with active/disabled feature indicators
- Zero dependencies (vanilla HTML, CSS, JavaScript)

## Quick Start
1. Unzip into your project directory.
2. Open \`index.html\` in a browser.
3. Configure your tiers and prices using the \`data-monthly\` and \`data-annual\` attributes on \`.amount\`.

## License
MIT License. Free for personal & commercial use with attribution to GENZLOG.
`);

fs.writeFileSync(path.join(priceDir, 'LICENSE.md'), MIT_LICENSE('Modern SaaS Pricing Cards'));

execSync(`cd "${STAGING_DIR}" && zip -r "${path.join(OUTPUT_DIR, 'pricing-cards.zip')}" pricing-cards`);
console.log('Created pricing-cards.zip');

// ─────────────────────────────────────────────────────────────
// 4. INTERACTIVE CONTACT FORM
// ─────────────────────────────────────────────────────────────
const contactDir = path.join(STAGING_DIR, 'interactive-contact-form');
fs.mkdirSync(contactDir, { recursive: true });

fs.writeFileSync(path.join(contactDir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Validated Business Inquiry & Contact Form — GENZLOG</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="contact-wrapper">
    <div class="contact-card">
      <div class="card-header">
        <span class="badge">START A PROJECT</span>
        <h1>Let's build something.</h1>
        <p>Tell us about your project requirements and we will reply within 24 hours.</p>
      </div>

      <form id="inquiryForm" class="inquiry-form" onsubmit="return false;">
        <!-- Step 1: Service chips -->
        <div class="form-section">
          <label class="section-label">Select what you need:</label>
          <div class="chip-group" id="serviceChips">
            <button type="button" class="chip active" data-value="Business Website">Business Website</button>
            <button type="button" class="chip" data-value="Landing Page">Landing Page</button>
            <button type="button" class="chip" data-value="Web Application">Web Application</button>
            <button type="button" class="chip" data-value="UI/UX Design">UI/UX Design</button>
            <button type="button" class="chip" data-value="E-commerce">E-commerce</button>
            <button type="button" class="chip" data-value="Custom Software">Custom Software</button>
          </div>
          <input type="hidden" id="selectedService" value="Business Website">
        </div>

        <!-- Step 2: Budget range -->
        <div class="form-section">
          <label class="section-label">Estimated budget:</label>
          <div class="chip-group" id="budgetChips">
            <button type="button" class="chip active" data-value="₹10k–₹15k">₹10,000–₹15,000 (Basic)</button>
            <button type="button" class="chip" data-value="₹15k–₹30k">₹15,000–₹30,000</button>
            <button type="button" class="chip" data-value="₹30k–₹60k">₹30,000–₹60,000</button>
            <button type="button" class="chip" data-value="₹60k+">₹60,000+</button>
          </div>
          <input type="hidden" id="selectedBudget" value="₹10k–₹15k">
        </div>

        <!-- Step 3: Contact Inputs -->
        <div class="inputs-grid">
          <div class="input-field">
            <label for="clientName">Your Name *</label>
            <input type="text" id="clientName" placeholder="Alex Morgan" required>
          </div>

          <div class="input-field">
            <label for="clientEmail">Email Address *</label>
            <input type="email" id="clientEmail" placeholder="alex@company.com" required>
          </div>
        </div>

        <div class="input-field">
          <label for="clientCompany">Company / Business (Optional)</label>
          <input type="text" id="clientCompany" placeholder="Acme Studio">
        </div>

        <div class="input-field">
          <label for="projectDesc">Project Description *</label>
          <textarea id="projectDesc" rows="4" placeholder="Briefly describe what your business does and what pages/features you need..." required></textarea>
        </div>

        <button type="submit" id="submitBtn" class="btn-submit">
          <span>Send Project Inquiry</span>
          <span>↗</span>
        </button>

        <div id="statusAlert" class="status-alert"></div>
      </form>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
`);

fs.writeFileSync(path.join(contactDir, 'style.css'), `:root {
  --bg-page: #050505;
  --bg-card: #0b0b0e;
  --bg-input: #131318;
  --border: #22222a;
  --text-main: #F5F5F5;
  --text-dim: #90909e;
  --accent: #FFFFFF;
  --accent-glow: rgba(255, 255, 255, 0.2);
  --success: #10b981;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background: var(--bg-page);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.contact-wrapper {
  max-width: 680px;
  width: 100%;
}

.contact-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
}

.badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--accent);
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.card-header h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.card-header p {
  color: var(--text-dim);
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 1.75rem;
}

.section-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #d1d1dc;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  background: #15151c;
  color: var(--text-dim);
  border: 1px solid var(--border);
  padding: 0.5rem 0.9rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: #3f3f50;
  color: var(--text-main);
}

.chip.active {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
  font-weight: 700;
}

.inputs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.input-field {
  margin-bottom: 1.25rem;
}

.input-field label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #ccc;
  margin-bottom: 0.45rem;
}

input[type="text"],
input[type="email"],
textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-main);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

input:focus,
textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.btn-submit {
  width: 100%;
  padding: 1rem 1.5rem;
  background: var(--accent);
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.btn-submit:hover {
  background: #ffe033;
  box-shadow: 0 4px 15px var(--accent-glow);
}

.status-alert {
  display: none;
  margin-top: 1.25rem;
  padding: 0.85rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid var(--success);
  color: #34d399;
}

@media (max-width: 600px) {
  .inputs-grid {
    grid-template-columns: 1fr;
  }
  .contact-card {
    padding: 2rem 1.5rem;
  }
}
`);

fs.writeFileSync(path.join(contactDir, 'script.js'), `document.addEventListener('DOMContentLoaded', () => {
  // Setup chip click selectors
  setupChips('serviceChips', 'selectedService');
  setupChips('budgetChips', 'selectedBudget');

  function setupChips(containerId, hiddenInputId) {
    const container = document.getElementById(containerId);
    const hiddenInput = document.getElementById(hiddenInputId);
    if (!container || !hiddenInput) return;

    const chips = container.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        hiddenInput.value = chip.getAttribute('data-value');
      });
    });
  }

  // Handle Form Submission
  const form = document.getElementById('inquiryForm');
  const alertEl = document.getElementById('statusAlert');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const service = document.getElementById('selectedService').value;
      const budget = document.getElementById('selectedBudget').value;

      if (!name || !email) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting inquiry...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Project Inquiry ↗';
        alertEl.textContent = \`Inquiry recorded for \${name}! We will review your \${service} inquiry (\${budget}) and reply via \${email}.\`;
        alertEl.style.display = 'block';
        form.reset();
      }, 700);
    });
  }
});
`);

fs.writeFileSync(path.join(contactDir, 'README.md'), `# Validated Business Inquiry & Contact Form
**Free Frontend Resource by GENZLOG (https://genzlog.com)**

A modern client lead-generation contact form with interactive service chip pills, budget tier selection, floating inputs, and client-side validation.

## Features
- Interactive service requirement selector chips
- Budget tier selector chips
- Responsive grid layout
- Vanilla JavaScript validation
- Ready for integration with Web3Forms, Formspree, or custom API endpoints

## License
MIT License. Free for personal & commercial use with attribution to GENZLOG.
`);

fs.writeFileSync(path.join(contactDir, 'LICENSE.md'), MIT_LICENSE('Validated Business Inquiry & Contact Form'));

execSync(`cd "${STAGING_DIR}" && zip -r "${path.join(OUTPUT_DIR, 'interactive-contact-form.zip')}" interactive-contact-form`);
console.log('Created interactive-contact-form.zip');

// ─────────────────────────────────────────────────────────────
// 5. CREATIVE BUTTON PACK
// ─────────────────────────────────────────────────────────────
const btnDir = path.join(STAGING_DIR, 'creative-button-pack');
fs.mkdirSync(btnDir, { recursive: true });

fs.writeFileSync(path.join(btnDir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>10 Creative Micro-Interaction Button Styles — GENZLOG</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="showcase-container">
    <div class="header">
      <span class="badge">FREE CSS COMPONENT PACK</span>
      <h1>10 Creative Button Micro-Interactions</h1>
      <p>Clean, modular CSS buttons ready to copy directly into your Next.js, HTML, or Tailwind project.</p>
    </div>

    <div class="buttons-grid">
      <!-- 1. Signature Magnetic Glow -->
      <div class="button-card">
        <span class="btn-name">01 // Magnetic Glow</span>
        <button class="btn btn-glow">Get Started ↗</button>
      </div>

      <!-- 2. Cyberpunk Glitch -->
      <div class="button-card">
        <span class="btn-name">02 // Cyber Glitch</span>
        <button class="btn btn-glitch" data-text="EXECUTE">EXECUTE</button>
      </div>

      <!-- 3. Border Beam Sweep -->
      <div class="button-card">
        <span class="btn-name">03 // Border Beam</span>
        <button class="btn btn-beam">Explore Library</button>
      </div>

      <!-- 4. Tactile 3D Push -->
      <div class="button-card">
        <span class="btn-name">04 // 3D Tactile</span>
        <button class="btn btn-3d">Download Code</button>
      </div>

      <!-- 5. Shimmer Gradient Sweep -->
      <div class="button-card">
        <span class="btn-name">05 // Shimmer Sweep</span>
        <button class="btn btn-shimmer">Subscribe Free</button>
      </div>

      <!-- 6. Arrow Slide Reveal -->
      <div class="button-card">
        <span class="btn-name">06 // Slide Reveal</span>
        <button class="btn btn-slide"><span>Learn More</span> <span class="arrow">→</span></button>
      </div>

      <!-- 7. Pulse Radar Ring -->
      <div class="button-card">
        <span class="btn-name">07 // Radar Pulse</span>
        <button class="btn btn-pulse"><span class="dot"></span> Live Demo</button>
      </div>

      <!-- 8. Minimal Underline Expand -->
      <div class="button-card">
        <span class="btn-name">08 // Minimal Expand</span>
        <button class="btn btn-underline">View Portfolio</button>
      </div>

      <!-- 9. Frosted Glass Morph -->
      <div class="button-card">
        <span class="btn-name">09 // Glass Morph</span>
        <button class="btn btn-glass">Documentation</button>
      </div>

      <!-- 10. Neon Invert Pop -->
      <div class="button-card">
        <span class="btn-name">10 // Neon Invert</span>
        <button class="btn btn-neon">Contact Us</button>
      </div>
    </div>
  </div>
</body>
</html>
`);

fs.writeFileSync(path.join(btnDir, 'style.css'), `:root {
  --bg-page: #050505;
  --bg-card: #0b0b0f;
  --border: #1e1e26;
  --text-main: #F5F5F5;
  --accent: #FFFFFF;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background: var(--bg-page);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
}

.showcase-container {
  max-width: 1000px;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--accent);
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
  margin-bottom: 1rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.header p {
  color: #8c8c98;
  font-size: 1rem;
}

.buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.button-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.btn-name {
  font-size: 0.75rem;
  font-family: monospace;
  color: #71717e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Base button */
.btn {
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
  border: none;
}

/* 1. Glow Button */
.btn-glow {
  background: var(--accent);
  color: #000;
  box-shadow: 0 0 0 rgba(255, 255, 255, 0);
}
.btn-glow:hover {
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.45);
  transform: translateY(-2px);
}

/* 2. Cyber Glitch */
.btn-glitch {
  background: #111;
  color: #fff;
  border: 1px solid #333;
  position: relative;
}
.btn-glitch:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: skewX(-4deg);
}

/* 3. Border Beam */
.btn-beam {
  background: #0f0f14;
  color: #fff;
  border: 1px solid #2a2a35;
  position: relative;
  overflow: hidden;
}
.btn-beam::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  transition: left 0.4s ease;
}
.btn-beam:hover::before {
  left: 100%;
}

/* 4. 3D Tactile */
.btn-3d {
  background: var(--accent);
  color: #000;
  box-shadow: 0 4px 0 #b39700;
}
.btn-3d:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 #b39700;
}

/* 5. Shimmer Sweep */
.btn-shimmer {
  background: linear-gradient(90deg, #181820 0%, #303040 50%, #181820 100%);
  background-size: 200% 100%;
  color: #fff;
  border: 1px solid #333344;
}
.btn-shimmer:hover {
  background-position: -100% 0;
}

/* 6. Slide Reveal */
.btn-slide {
  background: #16161f;
  color: #fff;
  border: 1px solid #2a2a38;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-slide .arrow {
  transition: transform 0.2s ease;
}
.btn-slide:hover .arrow {
  transform: translateX(4px);
  color: var(--accent);
}

/* 7. Pulse Radar */
.btn-pulse {
  background: #111116;
  color: #fff;
  border: 1px solid #282835;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-pulse .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

/* 8. Minimal Underline */
.btn-underline {
  background: transparent;
  color: #ccc;
  border: none;
  padding: 0.5rem 0.2rem;
  border-bottom: 2px solid #333;
  border-radius: 0;
}
.btn-underline:hover {
  color: #fff;
  border-bottom-color: var(--accent);
}

/* 9. Glass Morph */
.btn-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.btn-glass:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* 10. Neon Invert */
.btn-neon {
  background: transparent;
  color: var(--accent);
  border: 1.5px solid var(--accent);
}
.btn-neon:hover {
  background: var(--accent);
  color: #000;
}
`);

fs.writeFileSync(path.join(btnDir, 'README.md'), `# 10 Creative Button Micro-Interactions
**Free Frontend Resource by GENZLOG (https://genzlog.com)**

A modular collection of 10 modern CSS button animations designed for high click-through rates and sleek visual appeal.

## Styles Included
1. \`.btn-glow\` — Signature magnetic ambient glow
2. \`.btn-glitch\` — Cyberpunk skewed hover effect
3. \`.btn-beam\` — Top border glowing beam sweep
4. \`.btn-3d\` — Tactile 3D press button with real depth
5. \`.btn-shimmer\` — Smooth linear gradient background sweep
6. \`.btn-slide\` — Micro-interaction icon offset
7. \`.btn-pulse\` — Live radar status pulse dot
8. \`.btn-underline\` — Minimal expanding underline
9. \`.btn-glass\` — Glassmorphism frosted acrylic button
10. \`.btn-neon\` — High-contrast neon fill inverter

## Usage
Simply copy the desired CSS class into your stylesheet and attach it to any \`<button>\` or \`<a>\` element.

## License
MIT License. Free for personal & commercial use with attribution to GENZLOG.
`);

fs.writeFileSync(path.join(btnDir, 'LICENSE.md'), MIT_LICENSE('10 Creative Button Micro-Interactions'));

execSync(`cd "${STAGING_DIR}" && zip -r "${path.join(OUTPUT_DIR, 'creative-button-pack.zip')}" creative-button-pack`);
console.log('Created creative-button-pack.zip');

// ─────────────────────────────────────────────────────────────
// 6. MINIMAL PORTFOLIO HERO
// ─────────────────────────────────────────────────────────────
const heroDir = path.join(STAGING_DIR, 'minimal-portfolio-hero');
fs.mkdirSync(heroDir, { recursive: true });

fs.writeFileSync(path.join(heroDir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minimal Editorial Agency Hero Section — GENZLOG</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <section class="hero-section">
    <!-- Top Metadata Bar -->
    <div class="hero-topbar">
      <div class="status-indicator">
        <span class="status-dot"></span>
        <span>AVAILABLE FOR Q2/Q3 WEB PROJECTS</span>
      </div>
      <div class="location-tag">
        <span id="liveTime">IST 09:30 AM</span> • REMOTE WORLDWIDE
      </div>
    </div>

    <!-- Main Editorial Headline -->
    <div class="hero-headline">
      <span class="tagline-kicker">// DIGITAL STUDIO</span>
      <h1>
        YOUR IDEAS.<br>
        <span class="highlight">BUILT FOR</span> THE WEB.
      </h1>
      <p class="hero-subtext">
        We architect high-performance websites and digital tools for businesses that refuse to settle for generic templates.
      </p>
    </div>

    <!-- Actions & Stats -->
    <div class="hero-actions">
      <div class="cta-row">
        <a href="#contact" class="btn-primary">Build My Website ↗</a>
        <a href="#free-code" class="btn-secondary">Explore Free Code ↓</a>
      </div>

      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-num">&lt; 1s</span>
          <span class="stat-label">Average load speed</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">100%</span>
          <span class="stat-label">Responsive layouts</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">₹10K</span>
          <span class="stat-label">Starting website range</span>
        </div>
      </div>
    </div>
  </section>

  <script src="script.js"></script>
</body>
</html>
`);

fs.writeFileSync(path.join(heroDir, 'style.css'), `:root {
  --bg-page: #050505;
  --text-main: #F5F5F5;
  --text-muted: #8e8e9a;
  --accent: #FFFFFF;
  --border: #1e1e24;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background: var(--bg-page);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-section {
  width: 100%;
  max-width: 1100px;
  padding: 4rem 2rem;
  margin: 0 auto;
}

.hero-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--text-muted);
  margin-bottom: 3.5rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 1.6s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

.tagline-kicker {
  display: inline-block;
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--accent);
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
}

.hero-headline h1 {
  font-size: clamp(2.8rem, 7vw, 5.5rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.highlight {
  color: var(--accent);
}

.hero-subtext {
  font-size: 1.15rem;
  color: var(--text-muted);
  max-width: 620px;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.cta-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--accent);
  color: #000;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.85rem 1.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #ffe033;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.25);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  color: #fff;
  border: 1px solid var(--border);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.85rem 1.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: #404050;
  background: #111116;
}

.stats-row {
  display: flex;
  gap: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
}

.stat-label {
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--text-muted);
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .hero-topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
`);

fs.writeFileSync(path.join(heroDir, 'script.js'), `function updateClock() {
  const el = document.getElementById('liveTime');
  if (!el) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  el.textContent = timeStr + ' LOCAL';
}
updateClock();
setInterval(updateClock, 30000);
`);

fs.writeFileSync(path.join(heroDir, 'README.md'), `# Minimal Editorial Agency Hero Section
**Free Frontend Resource by GENZLOG (https://genzlog.com)**

A modern, bold editorial hero component featuring live status availability indicator, responsive typographic scale, CTA buttons, and a key stat metric row.

## Features
- Scaled headline typography using \`clamp()\`
- Live availability indicator dot with CSS pulse
- Dual CTA buttons (Primary & Secondary action paths)
- Metric stats row
- Pure HTML, CSS, & Vanilla JS

## License
MIT License. Free for personal & commercial use with attribution to GENZLOG.
`);

fs.writeFileSync(path.join(heroDir, 'LICENSE.md'), MIT_LICENSE('Minimal Editorial Agency Hero Section'));

execSync(`cd "${STAGING_DIR}" && zip -r "${path.join(OUTPUT_DIR, 'minimal-portfolio-hero.zip')}" minimal-portfolio-hero`);
console.log('Created minimal-portfolio-hero.zip');

console.log('All 6 downloadable resource ZIPs created successfully!');
