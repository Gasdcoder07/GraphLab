import { useEffect } from 'react';
import { navigate, useHashRoute } from './lib/router';
import { Home } from './pages/Home';
import { GraphLab } from './pages/GraphLab';
import { useGraphSession } from './state/useGraphSession';

export default function App() {
  const route = useHashRoute();
  const session = useGraphSession();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    document.title =
      route.name === 'graph'
        ? 'GRAFO/LAB · Laboratorio de grafos · DSLAB'
        : 'DSLAB · Laboratorio de estructuras de datos y matemáticas';
  }, [route.name]);

  if (route.name === 'graph') {
    return <GraphLab session={session} />;
  }

  return (
    <Home
      onOpenGraph={() => navigate('/grafos')}
    />
  );
}
