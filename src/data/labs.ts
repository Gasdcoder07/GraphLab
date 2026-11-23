export type LabStatus = 'active' | 'design';

export type LabId = 'graphs' | 'linked-lists' | 'bst' | 'hash-maps';

export interface LabModule {
  id: LabId;
  index: string;
  name: string;
  domain: string;
  status: LabStatus;
  summary: string;
  detail: string;
  features: string[];
  href?: string;
}

export const LABS: LabModule[] = [
  {
    id: 'graphs',
    index: '01',
    name: 'Grafos',
    domain: 'MATEMÁTICAS DISCRETAS',
    status: 'active',
    summary: 'Vértices, aristas, grados y matrices.',
    detail:
      'Construye grafos y analiza grado, conectividad, bipartición, condición de Euler, matrices A y M y complemento Ḡ.',
    features: [
      'Presets y edición directa',
      'Matriz de adyacencia e incidencia',
      'Vista del complemento Ḡ',
    ],
    href: '#/grafos',
  },
  {
    id: 'linked-lists',
    index: '02',
    name: 'Listas enlazadas',
    domain: 'ESTRUCTURAS DE DATOS',
    status: 'design',
    summary: 'Nodos, punteros, inserción y recorrido.',
    detail:
      'Construcción de listas simples y dobles con operaciones de inserción, eliminación y recorrido.',
    features: [
      'Lista simple y lista doble',
      'Inserción y eliminación',
      'Recorrido paso a paso',
    ],
  },
  {
    id: 'bst',
    index: '03',
    name: 'Árboles BST',
    domain: 'ESTRUCTURAS DE DATOS',
    status: 'design',
    summary: 'Búsqueda, recorridos y altura.',
    detail:
      'Árboles binarios de búsqueda con inserción, búsqueda, recorridos y análisis de altura.',
    features: [
      'Inserción y búsqueda',
      'Recorridos inorden, preorden y postorden',
      'Altura y factor de equilibrio',
    ],
  },
  {
    id: 'hash-maps',
    index: '04',
    name: 'Hash maps',
    domain: 'ESTRUCTURAS DE DATOS',
    status: 'design',
    summary: 'Buckets, colisiones y factor de carga.',
    detail:
      'Tablas hash con cubetas, estrategias de colisión y análisis del factor de carga.',
    features: [
      'Cubetas y función hash',
      'Resolución de colisiones',
      'Factor de carga',
    ],
  },
];

export const STATUS_LABEL: Record<LabStatus, string> = {
  active: 'ACTIVO',
  design: 'EN DISEÑO',
};

export function getLab(id: LabId): LabModule {
  return LABS.find((lab) => lab.id === id) ?? LABS[0];
}
