Decisiones cerradas
- Nombre: DSLAB como paraguas. Mantendré el lockup DS/LAB para conservar la lógica visual de GRAFO/LAB. El laboratorio actual sigue siendo el módulo 01: GRAFO/LAB.
- Navegación: hash router, sin dependencias nuevas.
- #/ → home.
- #/grafos → laboratorio actual.
- Selector: pestañas verticales con ficha lateral. Los módulos no implementados se pueden seleccionar, pero su CTA queda deshabilitado con explicación.
Estructura visual de la home
┌──────────────────────────────────────────────────────────────────────┐
│ DS/LAB              LABORATORIOS   MÉTODO   GITHUB / GASDCODER07 ↗  │
├──────────────────────────────────────────────────────────────────────┤
│ HERO                                                                │
│ Kicker · Titular · Descripción · CTA primaria · CTA fantasma        │
│                                      ┌────────────────────────────┐  │
│                                      │ ESPÉCIMEN · GRAFO          │  │
│                                      │ mini grafo + matriz + datos│  │
│                                      └────────────────────────────┘  │
├──────────────────────────────────┬───────────────────────────────────┤
│ 01 / LABORATORIOS        span 7  │ 02 / FICHA              span 5   │
│ Selector de laboratorio          │ Módulo seleccionado              │
│ Grafos · Listas · BST · Hash     │ estado + descripción + CTA       │
├───────────────┬──────────────────┼───────────────────────────────────┤
│ 03 / MATEMÁTICAS │ 04 / MÉTODO    │ 05 / REPOSITORIO                │
│ span 4           │ span 4         │ span 4                          │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER · 04 MÓDULOS · 01 ACTIVO · MONO / 1-BIT · GITHUB             │
└──────────────────────────────────────────────────────────────────────┘
Contenido concreto
Navbar
- Marca: DS/LAB, con subtítulo mono ESTRUCTURAS DE DATOS Y MATEMÁTICAS.
- Enlaces:
- LABORATORIOS → desplaza al selector.
- MÉTODO → desplaza al panel de método.
- GITHUB / GASDCODER07 ↗ → https://github.com/gasdcoder07.
- El enlace de GitHub conserva etiqueta textual, aria-label y apertura en pestaña nueva con rel="noreferrer".
- Sticky en escritorio; no sticky a ≤620px. Franja de dithering de 6px.
Hero
- Kicker: LABORATORIO DE ESTRUCTURAS · 001.
- Titular display: “Construye estructuras. Mide sus propiedades.”
- Descripción: “Un laboratorio interactivo para construir estructuras de datos, analizar sus propiedades matemáticas y verificar los resultados.”
- Acción primaria única: Abrir laboratorio de grafos.
- Acción fantasma: Ver repositorio.
- Panel espécimen:
- Mini grafo SVG estático con 6 vértices y 7 aristas.
- Metadatos mono: |V| = 6, |E| = 7, Σ deg(v) = 14.
- Chip GRAFO · ACTIVO.
- Matriz de adyacencia 6×6 en inset, con celdas coherentes con la semántica de la sección 6.10.
- Borde de 1px, sombra dura, tramado y scanlines.
- Franja de datos reales: 04 MÓDULOS, 01 ACTIVO, 03 EN DISEÑO, 1-BIT.
Selector de laboratorio
#	Módulo	Estado	Descripción
01	Grafos	ACTIVO	Vértices, aristas, grados, matrices y complemento.
02	Listas enlazadas	EN DISEÑO	Nodos, punteros, inserción y recorrido.
03	Árboles BST	EN DISEÑO	Búsqueda, inserción, recorridos y altura.
04	Hash maps	EN DISEÑO	Buckets, colisiones y factor de carga.
- Contenedor con role="tablist" vertical.
- La fila seleccionada se invierte; solo una a la vez.
- ACTIVO y EN DISEÑO se distinguen por badge e icono, no por color.
- La ficha lateral cambia según la selección.
- Para Grafos: CTA secundario Abrir laboratorio, que navega a #/grafos.
- Para los demás: estado vacío diseñado con borde discontinuo, explicación de qué falta y CTA deshabilitado con title:
“El módulo estará disponible cuando se implemente su laboratorio.”
Bento grid
- Matemáticas: Conjuntos, Relaciones, Matrices, Combinatoria, todas como EN DISEÑO. Sin métricas inventadas.
- Método: 01 Construir, 02 Medir, 03 Verificar, con una línea de descripción cada uno.
- Repositorio: Gasdcoder07/GraphLab, stack REACT · TS · VITE, enlace a GitHub. Si el repositorio se renombra a DSLAB, solo cambia esta URL.
- Todos los paneles reutilizan .panel, .panel__head, .panel__kicker y .btn.
Implementación
 1. Crear src/lib/router.ts con useHashRoute y navigate.
 2. Extraer el laboratorio actual a src/pages/GraphLab.tsx.
 3. Mover la sesión del grafo a un hook useGraphSession para que el estado sobreviva al volver a la home.
 4. Crear src/pages/Home.tsx y los componentes de components/home/.
 5. Añadir src/data/labs.ts con los cuatro módulos y sus estados.
 6. Crear src/styles/home.css reutilizando tokens, sin duplicarlos.
 7. Extender Icon.tsx con glifos lineales para list, tree, hash, github y external.
 8. Añadir enlace ← DSLAB en el header del laboratorio.
 9. Actualizar index.html con el título y la descripción de DSLAB.
10. Añadir tests unitarios del parser de rutas y ejecutar npm run test + npm run build.
Reglas de diseño que se aplican
- Monocromo estricto, sin color semántico.
- Datos y estados en mono; prosa en display.
- Una sola acción primaria: abrir el laboratorio de grafos.
- Inversión reservada para selección y estado activo.
- Bordes de 1px, sombra dura, radios máximos de 3px.
- Placeholders con explicación visible, no enlaces muertos.
- Responsive por contenido: 12 columnas → 6 → 1.
- Teclado, :focus-visible, ARIA y prefers-reduced-motion.
No he modificado ningún archivo. Para pasar esto a código necesitas cambiar del agente de planificación al agente de implementación.
