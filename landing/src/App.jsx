import React from 'react'

const GITHUB_URL = 'https://github.com/yourusername/urbanflow'
const APP_STORE_URL = '#'
const PLAY_STORE_URL = '#'

const features = [
  {
    title: 'Multimodal Route Planning',
    icon: '🚦',
    description:
      'Combine bus, train, walking and more into one seamless route across the city.',
  },
  {
    title: 'Real-Time Location Tracking',
    icon: '📍',
    description:
      'GPS-powered live location updates with offline support when you need it most.',
  },
  {
    title: 'Eco-Stats Dashboard',
    icon: '🌱',
    description:
      'Track your carbon footprint and green choices with detailed analytics.',
  },
  {
    title: 'Trip History & Analytics',
    icon: '📊',
    description:
      'Access personal travel insights and summaries with beautiful charts.',
  },
  {
    title: 'AI Recommendations',
    icon: '🧠',
    description:
      'Get the best route suggestions based on your behavior patterns.',
  },
  {
    title: 'Smart Notifications',
    icon: '🔔',
    description:
      'Real-time alerts for delays, traffic, and route changes.',
  },
  {
    title: 'Interactive Maps',
    icon: '🗺️',
    description:
      'Beautiful map integration with clear route visualization.',
  },
  {
    title: 'Secure Authentication',
    icon: '🔐',
    description:
      'JWT-based auth with password hashing and token management.',
  },
]

const screenshots = [
  { label: 'Home', gradient: 'linear-gradient(135deg, #3CB371, #2E8B57)' },
  { label: 'Route Planner', gradient: 'linear-gradient(135deg, #4682B4, #2F5E8C)' },
  { label: 'EcoStats', gradient: 'linear-gradient(135deg, #3CB371, #4682B4)' },
  { label: 'Live Tracking', gradient: 'linear-gradient(135deg, #2F5E8C, #3CB371)' },
]

function App() {
  return (
    <div className="page">
      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-mark">🌍</span> UrbanFlow
        </a>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#screenshots">Screenshots</a>
          <a href="#download">Download</a>
          <a
            className="nav-cta"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-inner">
            <span className="badge">🌱 Mobility, reimagined</span>
            <h1 className="hero-title">
              UrbanFlow
            </h1>
            <p className="hero-tagline">
              A Multimodal Mobility Assistant for Smarter, Greener Travel
            </p>
            <p className="hero-pitch">
              Plan journeys with eco-friendly and intelligent routes across the
              city. Combine buses, trains, and walking into one seamless trip —
              track it live, measure your impact, and travel with confidence.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#download">
                Get the App
              </a>
              <a
                className="btn btn-secondary"
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="section-head">
            <h2>Features</h2>
            <p>Everything you need for smarter, greener urban travel.</p>
          </div>
          <div className="feature-grid">
            {features.map((f) => (
              <article className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="screenshots" className="section section-alt">
          <div className="section-head">
            <h2>Screenshots</h2>
            <p>A glimpse of the UrbanFlow experience.</p>
          </div>
          <div className="screenshot-grid">
            {screenshots.map((s) => (
              <figure className="screenshot" key={s.label}>
                <div
                  className="screenshot-placeholder"
                  style={{ background: s.gradient }}
                  aria-label={s.label}
                >
                  <span className="screenshot-glyph">📱</span>
                </div>
                <figcaption>{s.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="download" className="section cta-section">
          <div className="cta-inner">
            <h2>Get UrbanFlow</h2>
            <p>Download the app or explore the source on GitHub.</p>
            <div className="cta-buttons">
              <a className="btn btn-primary" href={APP_STORE_URL}>
                App Store
              </a>
              <a className="btn btn-primary" href={PLAY_STORE_URL}>
                Google Play
              </a>
              <a
                className="btn btn-secondary"
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
            <p className="coming-soon">App Store &amp; Google Play — coming soon.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-mark">🌍</span> UrbanFlow
            <p className="footer-tag">Smarter, greener urban mobility.</p>
          </div>
          <nav className="footer-links">
            <a href="#features">Features</a>
            <a href="#screenshots">Screenshots</a>
            <a href="#download">Download</a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          © 2026 UrbanFlow. Made with 💚 for cities, commuters, and the climate.
        </div>
      </footer>
    </div>
  )
}

export default App
