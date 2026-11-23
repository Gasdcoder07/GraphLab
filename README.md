# GRAFO/LAB

Laboratorio interactivo de teoría de grafos reconstruido con **React + TypeScript + Vite** y una interfaz monocroma basada en **dithering shading**.

El archivo `main.html` original se conserva en la raíz como referencia.

## Características

- Presets: grafo simple, multigrafo, digrafo, Kₙ, Kₘ,ₙ, grafo disconexo, circuito de Euler y camino de Euler.
- Edición en canvas: mover, añadir vértices, añadir aristas y bucles, eliminar.
- Análisis estructural en tiempo real:
  - orden, tamaño y suma de grados;
  - lema del apretón de manos;
  - conectividad y componentes;
  - bipartición;
  - grafo completo;
  - condición de Euler;
  - grados de entrada y salida en digrafos.
- Matriz de adyacencia A y matriz de incidencia M.
- Vista del complemento Ḡ con restauración del grafo original.
- Hover con resaltado de vecindad.
- Diseño responsive, accesible y con soporte para `prefers-reduced-motion`.
- Tramado Bayer 8×8 real en el canvas y texturas de puntos en la interfaz.

## Stack

- React 19
- TypeScript
- Vite
- Vitest
- CSS propio, sin Tailwind ni librerías de UI
- Fuentes locales: Space Grotesk y JetBrains Mono

## Desarrollo

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Build y tests

```bash
npm run test
npm run build
npm run preview
```

## Estructura

```text
src/
├─ App.tsx
├─ components/        # Header, paneles, toolbar y canvas
├─ data/presets.ts    # metadatos y constructores de presets
├─ lib/
│  ├─ analysis.ts     # análisis de grados, componentes, bipartición y Euler
│  ├─ matrices.ts     # matrices A y M
│  ├─ dither.ts       # matriz Bayer y patrones de tramado
│  └─ canvasRenderer.ts
├─ state/
│  └─ graphReducer.ts
├─ styles/
│  ├─ tokens.css
│  └─ app.css
└─ test/
```

## Notas de diseño

- Los vértices de grado par usan relleno sólido claro.
- Los vértices de grado impar usan un anillo de semitono.
- Los vértices de la partición V₂ usan relleno oscuro y borde punteado.
- Las aristas del complemento se dibujan discontinuas.
- En digrafos se muestran flechas y las valencias `−entrada / +salida`.
