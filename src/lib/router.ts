import { useEffect, useState } from 'react';

export type Route = { name: 'home' } | { name: 'graph' };

const HOME_HASH = '#/';
const GRAPH_HASH = '#/grafos';

export function parseRoute(hash: string): Route {
  const clean = hash
    .replace(/^#/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .toLowerCase();

  if (clean === 'grafos' || clean === 'graph') {
    return { name: 'graph' };
  }

  return { name: 'home' };
}

export function navigate(path: '/grafos' | '/') {
  const target = path === '/grafos' ? '/grafos' : '/';
  window.location.hash = `#${target}`;
}

export function useHashRoute(): Route {
  const [hash, setHash] = useState(() =>
    typeof window === 'undefined' ? HOME_HASH : window.location.hash,
  );

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', HOME_HASH);
    }

    const handleChange = () => setHash(window.location.hash);

    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  return parseRoute(hash);
}

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: 'start' });
}

export { GRAPH_HASH, HOME_HASH };
