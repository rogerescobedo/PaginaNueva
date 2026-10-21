# LAB! — Laboratorio de Cómputo en estilo cómic

Sitio web educativo para el curso **Tecnologías de Diseño Web** de la carrera de **Matemática e Informática**, contextualizado en Iquitos, Loreto, Perú.

## Abrir el proyecto

1. Descomprime `Laboratorio_Computo_Estilo_Comic.zip`.
2. Entra a la carpeta `laboratorio-comic`.
3. Haz doble clic en **`index.html`** y se abrirá en tu navegador.
4. Recomendado: Chrome, Edge, Firefox o Safari actualizado.

**No necesitas instalar Python, Node.js ni un servidor.** Es un sitio estático y puede publicarse en GitHub Pages, Vercel, Netlify y otros alojamientos estáticos.

## Estructura

```text
laboratorio-comic/
├── index.html                      Página principal
├── css/
│   └── estilos.css                Diseño cómic, responsive y animaciones
├── js/
│   └── app.js                     Funcionalidad e interacciones
├── assets/
│   ├── estudiantes-laboratorio.webp   Foto real optimizada
│   └── favicon.svg                Icono de la página
└── LEEME.md                        Estas instrucciones
```

## Qué contiene

- Portada con la fotografía original del grupo, opción de ampliar la foto y frases de cómic.
- Presentación del laboratorio y la metodología creativa.
- Tarjetas didácticas de **HTML, CSS, JavaScript y Bootstrap**.
- Cuatro **ideas de proyectos**, filtros por categoría y fichas de desafíos.
- **Mini editor de código**: puedes cambiar HTML, CSS y JavaScript; el botón «Ejecutar» actualiza la vista previa.
- Ruta de aprendizaje paso a paso.
- **Cuestionario interactivo** de tres preguntas.
- Menú móvil, animaciones, barra de desplazamiento y efecto «¡BOOM!».

## ¿Dónde está Bootstrap?

La página enlaza **Bootstrap 5.3.3** (CSS y JavaScript) desde `cdn.jsdelivr.net` en el archivo `index.html`. Se utiliza la cuadrícula/estructura compatible y se han agregado estilos propios para el aspecto cómic.

- Con **internet**, se cargan Bootstrap y la tipografía web.
- Sin **internet**, el diseño principal, el menú, el editor, los filtros y el cuestionario siguen funcionando gracias al CSS y JavaScript incluidos. Se usa una tipografía de respaldo.
- Si se desea distribuir Bootstrap sin conexión, se pueden descargar los archivos oficiales desde [getbootstrap.com](https://getbootstrap.com/) e indicar sus rutas locales en `index.html`.

## Cómo personalizar

- **Textos y secciones**: editar `index.html`.
- **Colores, tipografía y diseño**: cambiar las variables al inicio de `css/estilos.css`.
- **Proyectos y preguntas**: modificar los objetos `projects` y `questions` en `js/app.js`.
- **Código inicial del editor**: cambiar `initialCode` en `js/app.js`.
- **Fotografía**: reemplazar `assets/estudiantes-laboratorio.webp` manteniendo el nombre, o cambiar la ruta en `index.html`.

### Recomendación antes de publicar

La fotografía incluye personas reales. Antes de subir el sitio a internet, se recomienda confirmar los permisos de uso/publicación de la imagen. Los proyectos que aparecen son **propuestas didácticas**, no se presentan como trabajos ya realizados.

## Créditos

Sitio de demostración creado para la asignatura Tecnologías de Diseño Web · Carrera de Matemática e Informática · Iquitos, Loreto. La fotografía fue proporcionada por el usuario.
