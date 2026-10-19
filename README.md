# BI Academy

Proyecto web educativo para aprender Business Intelligence, toma de decisiones y ETL, además de un dashboard interactivo de ejemplo de LigaPro 2026.

## Archivos principales
- `index.html`: página educativa con fundamentos de BI, ETL y cuestionario gamificado.
- `dashboard.html`: dashboard deportivo con filtros, KPI y gráficos interactivos.
- `css/styles.css`: estilos de la landing page educativa.
- `css/dashboard.css`: estilos del dashboard.
- `js/main.js`: navegación y comportamientos generales.
- `js/quiz.js`: lógica del cuestionario y gamificación.
- `js/dashboard.js`: datos simulados, métricas, tabla y gráficos de Chart.js.

## Cómo ejecutarlo en GitHub Codespaces
1. Abre el proyecto en Codespaces.
2. Ejecuta un servidor local desde la carpeta del proyecto:
   ```bash
   cd /workspaces/bi_1_fonseca
   python3 -m http.server 8000
   ```
3. Abre el puerto 8000 en la vista previa o usa Live Server.
4. Accede a:
   - `http://localhost:8000/index.html`
   - `http://localhost:8000/dashboard.html`

## Funcionalidades
- Página educativa con fundamentos de BI y ETL.
- Cuestionario interactivo con 10 preguntas, puntuación, rangos y reinicio.
- Dashboard deportivo responsivo con KPI, filtros, gráficos y tabla.
- Datos académicos simulados con aviso visible de demostración.
