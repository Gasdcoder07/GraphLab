---
name: GRAFO/LAB Design
description: Reglas normativas de diseño UI/UX de GRAFO/LAB (monocromo 1-bit, instrumento de laboratorio). Úsala para crear, revisar o modificar interfaces, componentes, canvas, estilos y microcopy del proyecto.
---

# GRAFO/LAB — Reglas de diseño UI/UX

## Cuándo usar esta skill

Úsala siempre que la tarea implique:

- crear o modificar componentes, paneles, controles, canvas, tablas o estilos;
- revisar una pantalla existente contra el lenguaje visual del proyecto;
- escribir microcopy de interfaz;
- añadir un estado, modo o control nuevo.

Antes de implementar, lee `DESIGN.md` en la raíz del proyecto. Es la fuente
normativa completa. Esta skill resume sus reglas operativas; si hay conflicto,
manda `DESIGN.md`. Los tokens reales viven en `src/styles/tokens.css` y no deben
duplicarse ni sustituirse desde componentes aislados.

## Principio raíz

La interfaz es un **instrumento de laboratorio**, no una landing page. Todo
elemento debe parecer medible, técnico y deliberado. Si una decisión no aporta
información, jerarquía o control, se elimina.

## Reglas no negociables

1. **Solo rampa monocroma.** Nunca introduzcas color, ni para éxito, error,
   alerta o énfasis. Codifica con contraste, inversión, patrón, borde y forma.
2. **La inversión es el estado máximo.** Blanco sobre negro o negro sobre blanco
   indica selección, activación o foco. Úsala con moderación.
3. **Datos en mono, prosa en display.** Nunca mezcles ambas familias dentro de
   una misma línea de datos.
4. **Bordes de 1px antes que sombras.** Las sombras son duras y desplazadas,
   nunca difusas. Prohibido blur decorativo y glassmorphism.
5. **Radios máximos de 3px** en paneles y controles. Solo swatches, thumbs y
   vértices pueden ser circulares.
6. **Una sola acción primaria por contexto.** Las demás son secundarias o
   fantasma. Nunca compiten dos inversiones fuertes en la misma zona.
7. **Todo estado debe verse en la UI**, no solo en el canvas: modo activo, vista
   de complemento, origen de arista, hover, métricas y dirección.
8. **Todo control deshabilitado explica cómo habilitarse** mediante `title` o
   microcopy visible.
9. **El vacío es un estado diseñado.** Explica qué falta y cómo resolverlo.
10. **Microcopy en español**, técnico, directo, sin humor ni exclamaciones.

## Tokens

### Rampa permitida

| Token | Valor | Uso |
|---|---|---|
| `--black` | `#000000` | sombras, texto sobre claro |
| `--bg` | `#050505` | fondo global |
| `--bg-elevated` | `#0b0b0b` | superficies elevadas |
| `--bg-panel` | `#0e0e0e` | paneles |
| `--bg-inset` | `#060606` | huecos, celdas, campos |
| `--line` | `#2a2a2a` | divisores y bordes base |
| `--line-strong` | `#3d3d3d` | bordes de controles interactivos |
| `--text` | `#ececec` | texto principal |
| `--text-dim` | `#949494` | texto secundario |
| `--text-faint` | `#626262` | metadatos y kickers |
| `--white` | `#ffffff` | foco, hover, estado activo |
| `--paper` | `#f2f2f2` | relleno claro principal |

- Los grises intermedios se derivan de `rgba(255,255,255,α)` o
  `rgba(0,0,0,α)`. No inventes hex fuera de la tabla.
- El blanco puro se reserva para foco, hover, guías y estados activos. El texto
  de lectura usa `--text`, nunca `#fff`.
- Estados como válido/inválido, sí/no se expresan con icono, inversión, borde y
  texto. Nunca con color.

### Texturas

| Token | Uso |
|---|---|
| `--dots-white-6` | fondo de paneles y body |
| `--dots-white-12` | rieles de sliders |
| `--dots-white-20` | franja de dithering del header |
| `--dots-black-24` | tramado sobre superficies claras |
| `--dots-black-40` | semitono marcado, celdas de bucle |
| `--scanlines` | overlay sutil de panel y body |

- Las texturas son fondo, nunca relleno de texto.
- Un panel puede combinar color + puntos + scanlines. No añadas una cuarta
  textura.
- El tramado debe ser ordenado (Bayer 8×8), nunca ruido aleatorio.
- En canvas, el tramado se genera por umbral Bayer, sin imágenes externas.

### Geometría

| Token / regla | Valor |
|---|---|
| `--radius` | `3px` máximo |
| `--shadow-hard` | `5px 5px 0 #000` |
| Sombra de control activo | `2px–3px 2px–3px 0` |
| Bordes | `1px solid` |
| Separación entre paneles | `16px` (12px en centro y móvil) |
| Padding de panel | `13px` |
| Padding de cabecera | `11px 13px` |

- Sin sombras difusas, sin desenfoques decorativos. `backdrop-filter` solo se
  permite en header sticky y chips flotantes sobre canvas.
- Todo elemento interactivo debe tener borde visible en reposo o al hover;
  nunca dependas solo del cursor.

## Tipografía

- **Display:** `Space Grotesk`, `Inter`, `system-ui`, sans-serif. Para títulos,
  nombres de panel, descripciones y copy.
- **Mono:** `JetBrains Mono`, `SFMono-Regular`, `Consolas`, monospace. Para
  números, unidades, estados, fórmulas, matrices, badges, kickers, footer y todo
  metadato.
- No existe una tercera familia tipográfica.

| Rol | Tamaño | Peso | Estilo |
|---|---|---|---|
| Título de marca | 20px | 700 | tracking `-0.04em` |
| Título de panel | 14px | 600 | tracking `-0.02em`, sentence case |
| Título de definición | 15px | 600 | tracking `-0.02em` |
| Cuerpo / descripción | 11–12px | 400 | normal |
| Etiqueta de control | 9–10px | 600 | uppercase, tracking `0.04em` |
| Kicker / metadato | 8px | 400–600 | uppercase, tracking `0.14–0.16em` |
| Valor de estadística | 20px | 400–700 | mono, `line-height: 1` |
| Footer | 8px | 400 | uppercase, tracking `0.1em` |

- Etiquetas de UI en MAYÚSCULAS con tracking amplio; títulos en sentence case.
  No escribas párrafos completos en mayúsculas.
- Números en mono y con `font-variant-numeric: tabular-nums` cuando se alineen
  en columnas.
- Pesos permitidos: 400, 600, 700.
- Texto de lectura nunca por debajo de 10px; metadatos decorativos hasta 8px.
- Las fórmulas se presentan en mono, con prefijo `>` y cursor parpadeante, como
  una terminal.

## Layout

- Contenedor máximo: `1640px`, centrado, padding lateral `16px`.
- Escritorio: `280px` (contexto) · `minmax(0, 1fr)` (lienzo) · `390px`
  (análisis). La columna central es la protagonista.
- La columna central nunca se comprime: usa `minmax(0, 1fr)` y `min-width: 0`
  en los hijos.
- Altura mínima útil del canvas: `440px` en escritorio, `380px` en móvil.
- Header sticky arriba; footer de estado al final.
- No anides más de dos niveles de panel. Un panel contiene secciones, no
  paneles dentro de paneles.
- Orden de lectura = orden visual: contexto → acción → resultado.

| Ancho | Comportamiento |
|---|---|
| `> 1280px` | 3 columnas |
| `≤ 1280px` | 2 columnas: contexto + lienzo; análisis abajo en 2 columnas |
| `≤ 980px` | 1 columna; presets en 2 columnas; canvas al centro |
| `≤ 620px` | 1 columna; header no sticky; presets y badges a 1 columna; footer y leyenda reducidos |

- El colapso es por contenido, no por dispositivo.
- En móvil, el canvas va antes que los paneles secundarios de análisis.
- Solo se ocultan metadatos decorativos (`header__tag`). Nunca funcionalidad
  esencial.

## Superficies y jerarquía

De atrás hacia adelante:

1. **Body:** `--bg`, gradiente radial tenue superior y puntos al 6%.
2. **Scanlines globales:** overlay fijo, no interactivo.
3. **Panel:** `--bg-panel`, puntos 6%, borde `--line`, sombra dura y scanlines
   internas al 30%.
4. **Cabecera:** blanco al 1.8%, borde inferior, kicker + título + metadato.
5. **Inset:** `--bg-inset` o `#050505` con borde tenue para fórmulas, celdas y
   estados vacíos.
6. **Elemento activo:** inversión a `--paper`, texto negro, sombra dura corta.

- Un panel se lee como una unidad: cabecera, cuerpo, borde y sombra consistentes.
- Las scanlines van por encima del contenido con `pointer-events: none`.
- La elevación se expresa con borde + sombra desplazada, nunca con blur.
- `--paper` es escaso y siempre indica estado o énfasis.

## Componentes

### Panel

- Cabecera obligatoria con kicker numerado (`01 / FAMILIAS`), título en sentence
  case y metadato no interactivo a la derecha (conteo, `AUTO`, dimensiones).
- Cuerpo con padding `13px`; cabecera con `11px 13px`.

### Botón

- Rectángulo con borde 1px, fondo oscuro y texto mono 10px uppercase.
- Hover: invierte a blanco con texto negro.
- Activo: se desplaza `1px` y gana sombra dura corta.
- Deshabilitado: opacidad `0.35`, `cursor: not-allowed` y `title` explicativo.
- Variante fantasma: sin fondo, solo borde/texto, para acciones terciarias.
- Toda acción con icono conserva etiqueta textual. Si el espacio es crítico, el
  icono necesita `title` y `aria-label`.

### Toggle

- Track `30×16px`, thumb cuadrado `10×10px`, sin radio.
- Off: borde gris y thumb gris. On: track claro y thumb negro.
- Etiqueta mono uppercase a la derecha.
- El `input` real sigue accesible (no `display: none`) y muestra foco sobre el
  track.

### Slider

- Fila superior: etiqueta + valor numérico dentro de una caja con borde.
- Riel de 4px con textura de puntos; thumb rectangular claro con sombra dura.
- Rango mínimo/máximo debajo en mono 8px.
- El valor siempre visible; no dependas del tooltip nativo.

### Badge de estado

- Dos columnas; la variante `wide` ocupa toda la fila.
- Etiqueta pequeña arriba; valor con icono `check` o `x`.
- `ok` refuerza borde y texto; `no` baja el contraste sin ocultar el valor.
- Nunca uses color para el estado.

### Tabs

- Contenedor segmentado con borde y fondo inset.
- Pestaña activa con inversión total.
- Usa `role="tablist"`, `role="tab"` y `aria-selected`.

### Estadísticas

- Rejilla de 3 columnas; valor grande en mono y etiqueta pequeña arriba.
- El número es el protagonista; la unidad va en la etiqueta, no pegada al
  número.
- Los totales derivados deben poder verificarse con su fórmula al lado.

### Chips y leyendas

- Chips sobre canvas: fondo negro translúcido, borde tenue, mono 9px y
  `backdrop-filter` sutil.
- Chip activo con inversión total (`ORIGEN`, `MOSTRANDO Ḡ`).
- Leyenda inferior con swatches de 10px, línea de muestra y estado de hover a la
  derecha.
- La leyenda es contextual: solo muestra lo relevante al modo, dirección y
  preset actual.

### Estados vacíos

- Siempre explican qué falta y cómo resolverlo.
- En paneles: borde discontinuo, fondo inset con puntos, icono tenue y mensaje
  mono centrado.
- En canvas: `SIN VÉRTICES` + instrucción
  (`ELIGE UNA FAMILIA O USA + VÉRTICE`).
- No muestres tablas vacías ni métricas inventadas.

### Tabla / matriz

- Cabeceras sticky; esquina superior izquierda sticky en ambos ejes.
- Celdas cuadradas de `28×28px`, centradas, mono 10px.
- Celda con valor: inversión clara. Valor fuerte/múltiple: inversión + borde
  interior.
- Celda negativa: fondo oscuro + contorno claro.
- Celda de bucle: fondo claro tramado.
- Hover de celda: contorno blanco interior, sin cambiar el layout.
- Scroll en ambos ejes sin perder cabeceras.

### Tarjeta de definición

- Cabecera con kicker `DEFINICIÓN FORMAL`, título y glifo `§`.
- Incluye badge del preset, título matemático, descripción breve y bloque de
  fórmula tipo terminal.
- La fórmula es el cierre visual; no añadas acciones aquí.

## Interacción y comportamiento

### Modos de herramienta

- Modos: `Mover`, `Vértice`, `Arista`, `Eliminar`.
- Solo uno activo; se refleja con inversión y `aria-pressed`.
- Cursor según modo: `grab`, `grabbing`, `crosshair`, `not-allowed`.
- En vista de complemento, las herramientas estructurales se deshabilitan y se
  explica por qué.
- El modo activo muestra una pista contextual en un chip sobre el canvas.

### Manipulación directa

- **Mover:** arrastrar un vértice dentro de los márgenes útiles del canvas.
- **Añadir vértice:** clic en zona vacía. Clic sobre un vértice existente no crea
  nada.
- **Añadir arista:** dos clics (origen → destino). El origen se marca con anillo
  discontinuo + chip `ORIGEN`. Repetir el mismo vértice crea un bucle. Clic en
  vacío cancela el origen.
- **Eliminar:** clic sobre vértice o arista; el hover previsualiza el objetivo.
- Aristas múltiples se curvan para no superponerse; los bucles se dibujan como
  anillos separados con radios escalonados.
- Hitbox mayor que lo visual: vértice visible ~20px con hitbox ~26px; tolerancia
  de arista ~9px.

### Hover e inspección

- Vértice: halo tramado, inversión, resaltado de aristas incidentes y atenuación
  del resto.
- Vecinos: halo más tenue, sin invertirlos.
- La leyenda escribe el estado: etiqueta + `deg` o `in/out` según dirección.
- El hover no desplaza ni redimensiona el layout.

### Bloqueo por contexto

- En complemento Ḡ: edición deshabilitada, chip de estado visible, herramienta
  estructural bloqueada y salida visible para volver a G.
- Toda restricción debe tener una salida visible, no solo un estado bloqueado.

### Feedback

- Toda acción produce un cambio inmediato en canvas, métricas o matrices.
- Acciones destructivas reversibles por preset/deshacer no requieren modal; si
  no son reversibles, se confirman.
- El footer resume el estado global: `nV / mE`, modo, dirección y vista Ḡ.

## Semántica visual de los datos

| Concepto | Codificación | Regla |
|---|---|---|
| Vértice base | Círculo `--paper`, borde negro, etiqueta mono negra | Forma y tamaño estables |
| Vértice hover / origen | Inversión oscura, borde blanco, radio +2px, halo tramado | El halo no tapa etiquetas |
| Vecino en hover | Halo tramado tenue | No invertir al vecino |
| Grado impar (no dirigido) | Semitono tramado + núcleo claro | Solo si `deg > 0` |
| Partición V₂ | Relleno oscuro, borde blanco, anillo exterior discontinuo | Debe distinguirse de hover |
| Arista normal | Línea gris 1.4px | — |
| Arista resaltada | Blanca 2.4px | Hover o incidencia |
| Arista atenuada | Opacidad 0.24 | Contexto de hover |
| Complemento | Línea discontinua `[5,5]` | Nunca sólida |
| Guía de nueva arista | Discontinua blanca + punto en cursor | Solo en modo arista |
| Digrafo | Punta de flecha en destino | También en bucles |
| Bucle | Anillo sobre el vértice, radios escalonados | No superponer bucles |
| Grado visible | Badge inferior `deg n` o `−in +out` | Cambia arriba si no cabe |

- La forma no cambia por estado; solo relleno, borde, halo y tamaño mínimo.
- No uses el mismo tramado para dos significados en un elemento. Si un vértice
  es impar y V₂, prioriza V₂ y comunica lo impar con el badge de grado.
- Las etiquetas mantienen contraste AA sobre su relleno. Si el patrón reduce
  contraste, añade núcleo sólido.
- Las flechas se dibujan fuera del vértice, nunca dentro de la etiqueta.

## Copywriting y microcopy

- Idioma: español. Tono técnico, directo, sin humor ni signos de exclamación.
- Títulos de panel en sentence case (`Estructura en vivo`).
- Etiquetas, kickers y metadatos en MAYÚSCULAS mono.
- Acciones en infinitivo (`Mover`, `Limpiar`, `Volver a G`).
- Instrucciones en segunda persona, una sola frase
  (`Haz clic en una zona vacía para crear un vértice.`).
- Notación consistente: `|V|`, `|E|`, `deg(v)`, `Σ deg(v)`, `Kₙ`, `Kₘ,ₙ`,
  `Ḡ`, `V₁`, `V₂`.
- Estados: `Sí` / `No`, `Vacío`, `Sin aristas`, `N/A · digrafo`. No uses "OK"
  salvo en metadatos de sistema.
- Los mensajes deshabilitados explican causa y solución, no solo "No
  disponible".
- Si un texto no cabe en una línea, primero acórtalo. No bajes de 8px ni
  escondas información esencial en un tooltip.

## Accesibilidad

- Contraste mínimo AA para texto; el mono pequeño necesita fondo suficientemente
  oscuro o claro.
- `:focus-visible` siempre visible: contorno blanco de 2px con offset 2px.
- Usa controles nativos cuando sea posible: `button`, `input[type=checkbox]`,
  `input[type=range]`.
- Estados ARIA: `aria-pressed` en modos y presets, `aria-selected` en tabs,
  `role="toolbar"` y `role="tablist"`.
- Iconos decorativos con `aria-hidden="true"`; iconos con significado con texto
  o `aria-label`.
- El canvas es `role="img"` con `aria-label` descriptivo; la interacción tiene
  equivalente textual en métricas, matrices y leyenda.
- No transmitas información solo por color o textura; acompaña con texto o
  icono.
- Áreas táctiles mínimas de ~26px de radio efectivo en canvas.
- Respeta `prefers-reduced-motion`: transiciones a `0.01ms` sin eliminar
  cambios de estado.
- Orden de tabulación = orden visual: header → contexto → herramientas → canvas
  → análisis → matrices.

## Movimiento

- Transiciones de `0.12–0.14s ease` para color, borde, fondo y transform.
- Único movimiento continuo permitido: cursor parpadeante de la fórmula
  (`steps(2, start)`, 1.1s).
- El press se expresa con `translate(1px, 1px)`, no con escala.
- Sin animaciones de entrada, parallax, rebotes ni loaders decorativos.
- Todo movimiento debe ser interrumpible y no bloquear la interacción.

## Iconografía

- Estilo lineal, trazo `1.8`, esquinas redondeadas, `viewBox="0 0 24 24"`.
- Tamaños: 11–12px en badges/leyenda, 15px en botones, 26px en estados vacíos.
- Color `currentColor`. Nunca iconos multicolor ni rellenos.
- Un icono debe ser reconocible a 12px; si no, acompáñalo siempre de texto.
- No mezcles sets de iconos. Si falta un glifo, dibújalo con el mismo trazo y
  grid.

## Scroll y densidad

- Scrollbars finas de 8px, pista casi negra, thumb gris con borde negro.
- Tablas y listas largas scrollean dentro de su panel; nunca hacen scrollear la
  página completa.
- Altura máxima de matrices: ~320px en escritorio, ~360px en 2 columnas.
- El canvas no scrollea: se adapta al contenedor y redistribuye nodos al
  redimensionar.

## Antipatrones prohibidos

- Colores de acento, gradientes llamativos o sombras difusas.
- Cards con radios grandes, glassmorphism o bordes "suaves".
- Iconos sin etiqueta en acciones principales.
- Texto gris claro sobre fondo claro o blanco puro para párrafos.
- Tipografía display en datos numéricos.
- Errores o estados vacíos ocultos tras un panel en blanco.
- Deshabilitar un control sin explicar cómo habilitarlo.
- Tramado como decoración de texto.
- Animaciones de entrada o transiciones largas.
- Duplicar la misma información en tres sitios sin jerarquía; elige canvas,
  panel o footer.
- Cambiar la forma de un elemento para indicar estado; usa relleno o borde.

## Flujo de implementación

1. Lee `DESIGN.md` y los tokens existentes en `src/styles/tokens.css`.
2. Reutiliza tokens y patrones existentes; si falta algo, extiende la rampa o la
   semántica de forma centralizada, nunca con una excepción aislada.
3. Define la semántica visual de los datos antes de maquetar.
4. Diseña primero los estados vacío, deshabilitado, hover, foco y activo.
5. Escribe el microcopy junto al componente.
6. Verifica responsive, teclado, lector de pantalla y
   `prefers-reduced-motion`.
7. Pasa el checklist antes de dar la tarea por terminada.

## Checklist final

- [ ] ¿Usa solo tokens de la rampa monocroma?
- [ ] ¿La jerarquía se entiende sin color?
- [ ] ¿Los datos están en mono y la prosa en display?
- [ ] ¿Hay una sola acción primaria visible por contexto?
- [ ] ¿Los estados activo/hover/foco/deshabilitado son distinguibles?
- [ ] ¿Los controles deshabilitados explican cómo habilitarse?
- [ ] ¿El estado vacío explica qué falta y cómo resolverlo?
- [ ] ¿La textura no compite con la legibilidad?
- [ ] ¿Los bordes son de 1px y las sombras duras?
- [ ] ¿Los radios no superan 3px en contenedores?
- [ ] ¿El layout colapsa por contenido y mantiene el canvas útil?
- [ ] ¿Funciona con teclado y con `prefers-reduced-motion`?
- [ ] ¿La semántica de vértices/aristas coincide con la tabla de datos?
- [ ] ¿El copy es breve, técnico y en español?
- [ ] ¿El footer o la leyenda reflejan el estado global?
