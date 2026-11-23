import { scrollToSection } from '../../lib/router';
import { Icon } from '../ui/Icon';

const LINKS = [
  { id: 'laboratorios', label: 'Laboratorios' },
  { id: 'metodo', label: 'Método' },
];

export function HomeNav() {
  return (
    <header className="home__nav">
      <div className="home__nav-inner">
        <div className="home__brand">
          <a className="home__brand-title" href="#/">
            <span>DS</span>
            <span className="home__brand-title-sep">/</span>
            <span>LAB</span>
          </a>
          <p className="home__brand-sub">Estructuras de datos y matemáticas</p>
        </div>

        <nav className="home__nav-links" aria-label="Secciones de la home">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className="home__nav-link"
              onClick={() => scrollToSection(link.id)}
            >
              {link.label}
            </button>
          ))}
          <a
            className="home__nav-github"
            href="https://github.com/gasdcoder07"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" size={14} />
            GitHub / Gasdcoder07
          </a>
        </nav>
      </div>
      <div className="home__dither" aria-hidden="true" />
    </header>
  );
}
