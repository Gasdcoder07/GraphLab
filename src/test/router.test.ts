import { describe, expect, it } from 'vitest';
import { parseRoute } from '../lib/router';

describe('parseRoute', () => {
  it('resuelve la ruta inicial como home', () => {
    expect(parseRoute('')).toEqual({ name: 'home' });
    expect(parseRoute('#/')).toEqual({ name: 'home' });
  });

  it('resuelve el laboratorio de grafos', () => {
    expect(parseRoute('#/grafos')).toEqual({ name: 'graph' });
    expect(parseRoute('#/grafos/')).toEqual({ name: 'graph' });
  });

  it('resuelve rutas desconocidas como home', () => {
    expect(parseRoute('#/varios')).toEqual({ name: 'home' });
  });
});
