# GRAFO/LAB — Reglas de diseño UI/UX

Documento normativo del lenguaje visual e interactivo de **GRAFO/LAB**. Su objetivo es servir como base reutilizable (skill) para nuevas implementaciones: describe **reglas, criterios y semántica**, no una estructura de archivos ni una plantilla cerrada.

> Principio raíz: la interfaz es un **instrumento de laboratorio**, no una landing page. Todo elemento debe parecer medible, técnico y deliberado. Si una decisión no aporta información, jerarquía o control, se elimina.

---

## 1. Principios rectores

1. **Monocromo funcional.** Solo se usa la rampa negro → gris → blanco. El color nunca es decorativo ni semántico; la información se codifica con **contraste, inversión, patrón, borde y forma**.
2. **El contraste es la jerarquía.** No se jerarquiza con tamaño excesivo ni con color, sino con luminosidad, inversión y densidad tipográfica.
3. **1-bit como lenguaje.** La estética de tramado (dithering), puntos y scanlines debe ser visible pero subordinada al contenido. Nunca debe reducir la legibilidad.
4. **Bordes antes que sombras.** La estructura se comunica con líneas de 1px. Las sombras son **duras y desplazadas**, nunca difusas.
5. **Datos en mono, prosa en display.** Todo número, etiqueta de estado, fórmula, matriz y metadato usa monoespaciada. Los títulos y descripciones usan la tipografía display.
6. **Inversión = estado.** Blanco sobre negro / negro sobre blanco indica selección, activación o foco. La inversión es el acento máximo del sistema; se usa con moderación.
7. **Una sola acción primaria por contexto.** El resto son acciones secundarias o fantasmas. Nunca compiten dos inversiones fuertes en la misma zona.
8. **Densidad controlada.** La interfaz es compacta pero respirable: paneles con padding de 13px, separación de 16px entre bloques, textos pequeños con tracking amplio.
9. **Todo control debe explicar su efecto.** Los controles deshabilitados llevan `title` que indica cómo habilitarlos. Los modos muestran una pista de uso contextual.
10. **El estado siempre es visible.** Modo activo, vista de complemento, origen de arista, hover y métricas se reflejan en la UI, nunca solo en el canvas.

---

## 2. Paleta y tokens

### 2.1 Rampa permitida

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
| `--paper` | `#f2f2f2` | relleno claro principal (vértices, botones activos) |

**Reglas**
- No introducir colores fuera de esta rampa. Si se necesita un gris intermedio, se deriva de `rgba(255,255,255,α)` o `rgba(0,0,0,α)`.
- Prohibido usar rojo/verde/azul para éxito, error o alerta. "Sí/No", "válido/inválido" se expresan con icono, inversión y texto.
- El blanco puro se reserva para foco, hover, guías y estados activos. El texto de lectura usa `--text`, no `#fff`.

### 2.2 Texturas

| Token | Descripción | Uso |
|---|---|---|
| `--dots-white-6` | puntos blancos 6% en tile 4×4 | fondo de paneles y body |
| `--dots-white-12` | puntos blancos 12% | rieles de sliders |
| `--dots-white-20` | puntos blancos 20% | franja de dithering del header |
| `--dots-black-24` | puntos negros 24% | tramado sobre superficies claras |
| `--dots-black-40` | puntos negros 40% | semitono marcado, celdas de bucle |
| `--scanlines` | líneas horizontales 1px cada 4px al 1.8% | overlays sutiles de panel y body |

**Reglas**
- Las texturas son **fondo**, nunca relleno de texto.
- Un panel puede combinar color de fondo + patrón de puntos + overlay de scanlines. No añadir una cuarta textura.
- El tramado debe ser ordenado (Bayer 8×8), nunca ruido aleatorio.
- En canvas, el tramado se genera por umbral Bayer, no con imágenes externas.

### 2.3 Geometría

| Token | Valor | Regla |
|---|---|---|
| `--radius` | `3px` | radios máximos en paneles y controles. Nada de "cards" redondeadas. |
| `--shadow-hard` | `5px 5px 0 #000` | sombra de panel. Sin blur. |
| Sombra de control activo | `2px–3px 2px–3px 0` gris/negro | refuerza el estado presionado/activo |
| Bordes | `1px solid` | estructura por defecto |
| Separación entre paneles | `16px` | escritorio |
| Padding interno de panel | `13px` | cuerpo; `11px 13px` cabecera |

**Reglas**
- No usar sombras difusas, glassmorphism ni desenfoques decorativos. El `backdrop-filter` solo se permite en header sticky y chips flotantes sobre canvas.
- No usar radios mayores a 3px en contenedores. Los indicadores circulares (swatches, thumbs) son la excepción.
- Los elementos interactivos deben tener borde visible en reposo o al hover; nunca depender solo del cursor.

---

## 3. Tipografía

### 3.1 Familias

- **Display:** `Space Grotesk`, fallback `Inter`, `system-ui`, sans-serif.
- **Mono:** `JetBrains Mono`, fallback `SFMono-Regular`, `Consolas`, monospace.

**Reglas**
- Títulos, nombres de paneles, descripciones y copy usan display.
- Números, unidades, estados, fórmulas, etiquetas de datos, matrices, badges, footer y todo metadato usan mono.
- Nunca mezclar display y mono dentro de una misma línea de datos.
- No usar una tercera familia tipográfica.

### 3.2 Escala y estilo

| Rol | Tamaño | Peso | Tracking / caja |
|---|---|---|---|
| Título de marca | 20px | 700 | `-0.04em` |
| Título de panel | 14px | 600 | `-0.02em`, sentence case |
| Título de definición | 15px | 600 | `-0.02em` |
| Cuerpo / descripción | 11–12px | 400 | normal |
| Etiqueta de control | 9–10px | 600 | uppercase, `0.04em` |
| Kicker / metadato | 8px | 400–600 | uppercase, `0.14–0.16em` |
| Valor de estadística | 20px | 400–700 | mono, `line-height: 1` |
| Footer | 8px | 400 | uppercase, `0.1em` |

**Reglas**
- Las etiquetas de UI van en **mayúsculas con tracking amplio**; los títulos van en **sentence case**. No poner párrafos completos en mayúsculas.
- Los números siempre en mono y con `font-variant-numeric: tabular-nums` cuando se alineen en columnas.
- No usar pesos intermedios arbitrarios: 400, 600, 700.
- El texto de lectura nunca baja de 10px; metadatos decorativos pueden llegar a 8px.
- Las fórmulas se presentan en mono, con prefijo `>` y cursor parpadeante como si fueran una terminal.

---

## 4. Layout y composición

### 4.1 Retícula principal

- Contenedor máximo: `1640px`, centrado, con padding lateral de `16px`.
- Escritorio: tres columnas → `280px` (contexto) · `minmax(0,1fr)` (lienzo) · `390px` (análisis).
- La columna central es la protagonista y debe poder crecer; las laterales tienen ancho estable.
- Separación vertical y horizontal entre paneles: `16px` (12px en centro y móvil).
- Header sticky arriba; footer de estado al final.

**Reglas**
- La columna central nunca se comprime por debajo de su contenido mínimo: usa `minmax(0, 1fr)` y `min-width: 0` en los hijos.
- El lienzo debe tener una altura mínima útil: `440px` en escritorio, `380px` en móvil.
- No anidar más de dos niveles de panel. Un panel contiene secciones, no paneles dentro de paneles.
- El orden de lectura debe coincidir con el orden visual: contexto → acción → resultado.

### 4.2 Breakpoints

| Ancho | Comportamiento |
|---|---|
| `> 1280px` | 3 columnas |
| `≤ 1280px` | 2 columnas: contexto + lienzo; análisis pasa abajo en 2 columnas |
| `≤ 980px` | 1 columna; presets en 2 columnas; lienzo centra la atención |
| `≤ 620px` | 1 columna; header deja de ser sticky; presets y badges a 1 columna; footer y leyenda reducen tamaño |

**Reglas**
- El colapso es **por contenido**, no por dispositivo: si una columna deja de ser legible, baja de fila.
- En móvil, la acción principal (lienzo) debe quedar antes que los paneles secundarios de análisis.
- No ocultar funcionalidad esencial en móvil; solo se ocultan metadatos decorativos (`header__tag`).

---

## 5. Superficies y jerarquía

Niveles, de atrás hacia adelante:

1. **Body:** `--bg` + gradiente radial tenue superior + puntos al 6%.
2. **Scanlines globales:** overlay fijo no interactivo.
3. **Panel:** `--bg-panel` + puntos 6% + borde `--line` + sombra dura + scanlines internas al 30%.
4. **Cabecera de panel:** fondo blanco al 1.8%, borde inferior, kicker + título + metadato.
5. **Inset:** `--bg-inset` o `#050505` + borde tenue, para fórmulas, celdas y estados vacíos.
6. **Elemento activo:** inversión a `--paper` con texto negro y sombra dura corta.

**Reglas**
- Un panel debe leerse como una unidad: cabecera, cuerpo, borde y sombra consistentes.
- El overlay de scanlines va por encima del contenido visual pero con `pointer-events: none`.
- No usar elevación por blur. La elevación se expresa con borde + sombra desplazada.
- Las superficies claras (`--paper`) son escasas y siempre indican estado o énfasis.

---

## 6. Componentes: reglas de uso

### 6.1 Panel

- Cabecera obligatoria con **kicker numerado** (`01 / FAMILIAS`), título y metadato a la derecha (conteo, `AUTO`, dimensiones).
- Cuerpo con padding `13px`.
- Título en sentence case; kicker en mayúsculas mono.
- El metadato de cabecera nunca es interactivo.

### 6.2 Botón

- Forma: rectángulo, borde 1px, fondo oscuro, texto mono 10px uppercase.
- Hover: invierte a blanco con texto negro. Activo: se desplaza `1px` y gana sombra dura corta.
- Deshabilitado: opacidad `0.35`, cursor `not-allowed`, `title` explicativo.
- Variante fantasma: sin fondo, solo borde/texto; para acciones terciarias como "Limpiar".

**Regla:** toda acción con icono debe conservar etiqueta textual. Si el espacio es crítico, el icono necesita `title` y `aria-label`.

### 6.3 Toggle

- Track de `30×16px`, thumb cuadrado de `10×10px`, sin radio.
- Off: borde gris, thumb gris. On: track claro, thumb negro.
- Etiqueta mono uppercase a la derecha.
- El input real permanece accesible (no `display:none`), con foco visible sobre el track.

### 6.4 Slider

- Fila superior: etiqueta + valor numérico en caja con borde.
- Riel de 4px con textura de puntos; thumb rectangular claro con sombra dura.
- Debajo, rango mínimo/máximo en mono 8px.
- El valor siempre visible; no depender del tooltip nativo.

### 6.5 Badge de estado

- Dos columnas; variante `wide` ocupa toda la fila.
- Estructura: etiqueta pequeña arriba + valor con icono `check` o `x`.
- `ok` refuerza borde y texto; `no` baja el contraste pero no oculta el valor.
- Nunca usar color para el estado.

### 6.6 Tabs

- Contenedor segmentado con borde y fondo inset.
- Pestaña activa: inversión total (fondo claro, texto negro).
- `role="tablist"` / `role="tab"` + `aria-selected`.

### 6.7 Estadísticas

- Rejilla de 3 columnas; valor grande en mono, etiqueta pequeña arriba.
- El número es el protagonista; la unidad va en la etiqueta, no pegada al número.
- Los totales derivados (suma de grados) deben poder verificarse visualmente con su fórmula al lado.

### 6.8 Chips y leyendas

- Chips flotantes sobre el canvas: fondo negro translúcido, borde tenue, mono 9px, `backdrop-filter` sutil.
- Chip activo: inversión total. Se usa para "ORIGEN" y "MOSTRANDO Ḡ".
- Leyenda inferior: swatches de 10px + línea de muestra + estado de hover a la derecha.
- La leyenda debe ser contextual: muestra solo lo relevante al modo, dirección y preset actual.

### 6.9 Estados vacíos

- Siempre explican **qué falta** y **cómo resolverlo**.
- En paneles: borde discontinuo, fondo inset con puntos, icono tenue y mensaje mono centrado.
- En canvas: mensaje central `SIN VÉRTICES` + instrucción (`ELIGE UNA FAMILIA O USA + VÉRTICE`).
- No mostrar tablas vacías ni métricas inventadas; el vacío es un estado diseñado.

### 6.10 Tabla / matriz

- Cabeceras sticky; esquina superior izquierda sticky en ambos ejes.
- Celdas cuadradas de `28×28px`, centradas, mono 10px.
- Celda con valor: inversión clara. Valor fuerte/múltiple: inversión + borde interior.
- Celda negativa: fondo oscuro + contorno claro.
- Celda de bucle: fondo claro tramado.
- Hover de celda: contorno blanco interior, sin cambiar el layout.
- La tabla debe poder desplazarse en ambos ejes sin perder cabeceras.

### 6.11 Tarjeta de definición

- Kicker `DEFINICIÓN FORMAL`, título y glifo `§` en la cabecera.
- Badge del preset, título matemático, descripción breve y bloque de fórmula tipo terminal.
- La fórmula es el cierre visual de la tarjeta; no añadir acciones aquí.

---

## 7. Interacción y comportamiento

### 7.1 Modos de herramienta

- Modos: `Mover`, `Vértice`, `Arista`, `Eliminar`.
- Solo un modo activo a la vez; se refleja con inversión y `aria-pressed`.
- El cursor comunica el modo: `grab`, `grabbing`, `crosshair`, `not-allowed`.
- En vista de complemento, las herramientas estructurales se deshabilitan y se explica por qué.
- El modo activo muestra una pista contextual en un chip sobre el canvas.

### 7.2 Manipulación directa en canvas

- **Mover:** arrastrar un vértice; el arrastre se limita a los márgenes útiles del canvas.
- **Añadir vértice:** clic en zona vacía. Clic sobre un vértice existente no crea nada.
- **Añadir arista:** dos clics (origen → destino). El origen se marca con anillo discontinuo + chip `ORIGEN`. Repetir el mismo vértice crea un bucle. Clic en vacío cancela el origen.
- **Eliminar:** clic sobre vértice o arista; el hover previsualiza el objetivo.
- Las aristas múltiples se curvan para no superponerse; los bucles se dibujan como anillos separados.
- El hitbox debe ser mayor que el elemento visual (vértice visible ~20px, hitbox ~26px; arista tolerancia ~9px).

### 7.3 Hover e inspección

- Hover sobre vértice: halo tramado, inversión del vértice, resaltado de aristas incidentes y atenuación del resto.
- Los vecinos reciben un halo más tenue.
- El estado de hover se escribe en la leyenda: etiqueta + `deg` o `in/out` según dirección.
- El hover no debe desplazar ni redimensionar el layout.

### 7.4 Bloqueo por contexto

- En vista de complemento Ḡ: edición deshabilitada, chip de estado visible, herramienta estructural bloqueada y acción para volver a G.
- Cualquier restricción debe tener una salida visible ("Volver a G"), no solo un estado bloqueado.

### 7.5 Feedback

- Toda acción debe producir un cambio inmediato en canvas, métricas o matrices.
- Las acciones destructivas (Limpiar, Eliminar) no requieren modal si son reversibles por preset/deshacer; si no lo son, deben confirmarse.
- El footer resume el estado global: `nV / mE`, modo, dirección y vista Ḡ.

---

## 8. Semántica visual de los datos

La codificación debe ser consistente en todos los canvas y miniaturas:

| Concepto | Codificación | Regla |
|---|---|---|
| Vértice base | Círculo claro `--paper`, borde negro, etiqueta mono negra | Forma y tamaño estables |
| Vértice hover / origen | Inversión a oscuro con borde blanco, radio +2px, halo tramado | El halo no tapa etiquetas |
| Vecino en hover | Halo tramado tenue | No invertir el vecino |
| Grado impar (no dirigido) | Relleno con semitono tramado + núcleo claro para legibilidad | Solo si `deg > 0` |
| Partición V₂ | Relleno oscuro, borde blanco, anillo exterior discontinuo | Debe distinguirse de hover |
| Arista normal | Línea gris 1.4px | — |
| Arista resaltada | Blanca 2.4px | Hover o incidencia |
| Arista atenuada | Opacidad 0.24 | Contexto de hover |
| Complemento | Línea discontinua `[5,5]` | Nunca sólida |
| Guía de nueva arista | Línea discontinua blanca + punto en cursor | Solo en modo arista |
| Digrafo | Punta de flecha en destino | También en bucles |
| Bucle | Anillo sobre el vértice, radios escalonados | No superponer bucles |
| Grado visible | Badge inferior con `deg n` o `−in +out` | Cambia arriba si no cabe |

**Reglas**
- La forma nunca cambia por estado; solo relleno, borde, halo y tamaño mínimo.
- El tramado no debe usarse para dos significados simultáneos en el mismo elemento. Si un vértice es impar y V₂, prioriza V₂ y comunica lo impar por el badge de grado.
- El texto de las etiquetas debe mantener contraste WCAG AA sobre su relleno. Si el patrón reduce contraste, añade núcleo sólido.
- Las flechas se dibujan fuera del vértice, no dentro de la etiqueta.

---

## 9. Copywriting y microcopy

- Idioma: **español**. Tono técnico, directo, sin humor ni signos de exclamación.
- Títulos de panel: sentence case (`Estructura en vivo`).
- Etiquetas de control, kickers y metadatos: MAYÚSCULAS mono.
- Verbos en infinitivo para acciones (`Mover`, `Limpiar`, `Volver a G`).
- Instrucciones en segunda persona, una sola frase (`Haz clic en una zona vacía para crear un vértice.`).
- Notación matemática consistente: `|V|`, `|E|`, `deg(v)`, `Σ deg(v)`, `Kₙ`, `Kₘ,ₙ`, `Ḡ`, `V₁`, `V₂`.
- Estados: `Sí` / `No`, `Vacío`, `Sin aristas`, `N/A · digrafo`. No usar "OK" salvo en metadatos de sistema.
- Los mensajes de deshabilitado explican la causa y la solución, no solo "No disponible".

**Regla:** si un texto no cabe en una línea, primero acorta; no reduzcas por debajo de 8px ni escondas información esencial en un tooltip.

---

## 10. Accesibilidad

- Contraste mínimo AA para texto; el texto pequeño mono necesita fondo suficientemente oscuro o claro.
- `:focus-visible` siempre visible: contorno blanco de 2px con offset 2px.
- Controles nativos cuando sea posible: `button`, `input[type=checkbox]`, `input[type=range]`.
- Estados ARIA: `aria-pressed` en modos y presets, `aria-selected` en tabs, `role="toolbar"`, `role="tablist"`.
- Iconos decorativos con `aria-hidden="true"`; iconos con significado acompañados de texto o `aria-label`.
- El canvas es `role="img"` con `aria-label` que describe su función; la interacción debe tener equivalente textual en paneles (métricas, matrices, leyenda).
- No transmitir información **solo** por color; ya se cumple por diseño, pero también aplica a texturas: acompaña con texto o icono.
- Áreas táctiles: mínimo ~26px de radio efectivo en canvas; controles con padding suficiente.
- Respetar `prefers-reduced-motion`: animaciones y transiciones a `0.01ms`, sin eliminar cambios de estado.
- El orden de tabulación debe seguir el orden visual: header → contexto → herramientas → canvas → análisis → matrices.

---

## 11. Movimiento

- Transiciones cortas: `0.12–0.14s ease` para color, borde, fondo y transform.
- El único movimiento continuo permitido es el cursor parpadeante de la fórmula (`steps(2, start)`, 1.1s).
- El press de botones se expresa con `translate(1px, 1px)`, no con escala.
- No usar animaciones de entrada, parallax, rebotes ni loaders decorativos.
- Todo movimiento debe ser interrumpible y no bloquear la interacción.

---

## 12. Iconografía

- Estilo lineal, trazo `1.8`, esquinas redondeadas, viewBox `24×24`.
- Tamaños: 11–12px en badges/leyenda, 15px en botones, 26px en estados vacíos.
- Color: `currentColor`. Nunca iconos multicolor ni rellenos.
- Un icono debe ser reconocible a 12px; si no, se acompaña siempre de texto.
- No mezclar sets de iconos. Si falta un glifo, se dibuja con el mismo trazo y grid.

---

## 13. Scroll y densidad

- Scrollbars finas de 8px, pista casi negra, thumb gris con borde negro.
- Las tablas y listas largas scrollean dentro de su panel; nunca hacen scrollear la página completa.
- Altura máxima de matrices: ~320px en escritorio, ~360px en el layout de 2 columnas.
- El canvas no scrollea: se adapta al contenedor y redistribuye los nodos al redimensionar.

---

## 14. Antipatrones (prohibido)

- Colores de acento, gradientes llamativos o sombras difusas.
- Cards con radios grandes, glassmorphism o bordes "suaves".
- Iconos sin etiqueta en acciones principales.
- Texto gris claro sobre fondo claro o texto blanco puro para párrafos.
- Mezclar tipografía display en datos numéricos.
- Ocultar errores o estados vacíos detrás de un panel en blanco.
- Deshabilitar un control sin explicar cómo habilitarlo.
- Usar textura de tramado como decoración de texto.
- Añadir animaciones de entrada o transiciones largas.
- Duplicar la misma información en tres sitios sin jerarquía (elegir: canvas, panel, footer).
- Cambiar la forma de un elemento para indicar estado; usar relleno/borde.

---

## 15. Checklist para nuevas implementaciones

Antes de dar por terminada una pantalla o componente:

- [ ] ¿Usa solo tokens de la rampa monocroma?
- [ ] ¿La jerarquía se entiende sin color?
- [ ] ¿Los datos están en mono y la prosa en display?
- [ ] ¿Hay una sola acción primaria visible por contexto?
- [ ] ¿Los estados activo/hover/foco/deshabilitado están definidos y son distinguibles?
- [ ] ¿Los controles deshabilitados explican cómo habilitarse?
- [ ] ¿El estado vacío explica qué falta y cómo resolverlo?
- [ ] ¿La textura no compite con la legibilidad?
- [ ] ¿Los bordes son de 1px y las sombras duras?
- [ ] ¿Los radios no superan 3px en contenedores?
- [ ] ¿El layout colapsa por contenido y mantiene el canvas útil?
- [ ] ¿Funciona con teclado y con `prefers-reduced-motion`?
- [ ] ¿La semántica visual de vértices/aristas es consistente con la tabla de la sección 8?
- [ ] ¿El copy es breve, técnico y en español?
- [ ] ¿El footer o la leyenda reflejan el estado global?

---

## 16. Cómo reutilizar este documento

1. **Empieza por los tokens**, no por los componentes. Define la rampa, las texturas, la geometría y las dos familias tipográficas.
2. **Define superficies y jerarquía** antes de maquetar: body → panel → cabecera → inset → activo.
3. **Elige el modo de codificación** de los datos (forma, inversión, patrón, línea) y respétalo en todas las vistas.
4. **Diseña primero el estado vacío y el estado deshabilitado**; son los que más suelen romper la coherencia.
5. **Escribe el microcopy** junto al componente, no después.
6. **Valida con el checklist** de la sección 15 antes de añadir cualquier excepción.
7. Si una nueva necesidad no encaja, **extiende la rampa o la semántica**, nunca introduzcas color, blur o radios nuevos de forma aislada.

> La estructura de archivos, el framework y los nombres de clases son libres. Lo que no es libre es el **lenguaje visual**: monocromo, 1-bit, duro, medible y coherente.
