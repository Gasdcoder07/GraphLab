/**
 * Matriz Bayer 8×8 para tramado ordenado.
 * Cada valor representa un umbral entre 0 y 63.
 */
export const BAYER_8: number[][] = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

export function bayerThreshold(x: number, y: number): number {
  const row = BAYER_8[y & 7];
  return (row[x & 7] + 0.5) / 64;
}

/**
 * Crea un mosaico de 8×8 con un patrón de tramado ordenado.
 * `density` va de 0 (fondo) a 1 (color de primer plano).
 */
export function makeDitherCanvas(
  foreground: string,
  background: string | null,
  density: number,
  size = 8,
  cellSize = 1,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size * cellSize;
  canvas.height = size * cellSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = foreground;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (density > bayerThreshold(x, y)) {
        ctx.fillRect(
          x * cellSize,
          y * cellSize,
          cellSize,
          cellSize,
        );
      }
    }
  }

  return canvas;
}
