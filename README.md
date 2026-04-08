# 🌟 Carlos Molina Portfolio

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://carlosmolina.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat&logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-green?style=flat&logo=flask)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

> **Dark Luxury Portfolio** — Un portafolio web profesional con diseño premium, animaciones fluidas y arquitectura optimizada para producción.

![Portfolio Preview](https://carlosmolina.vercel.app/static/img/perfil.jpg)

---

## ✨ Características

- 🎨 **Diseño Dark Luxury** — Estética premium con glassmorphism y gradientes sutiles
- 🔥 **Firefly Animation** — Luciérnaga interactiva que sigue el cursor
- 📱 **Fully Responsive** — Optimizado para móviles, tablets y desktop
- ♿ **Accesible (WCAG 2.1)** — Skip-link, ARIA labels, navegación por teclado
- 🔒 **Seguro** — CSP, HSTS, rate limiting y headers de protección
- 🚀 **Optimizado** — CSS/JS minificados, imágenes WebP, lazy loading
- 🍪 **GDPR Compliant** — Cookie banner y política de privacidad

---

## 🛠️ Tech Stack

| Categoría | Tecnología |
|-----------|------------|
| **Backend** | Python 3.9+, Flask 3.0 |
| **Frontend** | HTML5, CSS3 (variables), JavaScript ES6+ |
| **Layout** | Bootstrap Grid 5.3 (solo grid) |
| **Fonts** | Google Fonts (Playfair Display, Inter) |
| **Hosting** | Vercel (Serverless) |
| **PWA** | Manifest, favicons, apple-touch-icon |

---

## 📁 Estructura del Proyecto

```
portafolio/
├── api/
│   └── index.py          # Flask app (Vercel serverless)
├── static/
│   ├── css/
│   │   ├── style.css     # CSS fuente (desarrollo)
│   │   └── style.min.css # CSS minificado (producción)
│   ├── js/
│   │   ├── script.js     # JS principal
│   │   ├── script.min.js # JS minificado
│   │   ├── firefly.js    # Efecto luciérnaga
│   │   ├── firefly.min.js
│   │   └── tracking.js   # Google Analytics events
│   ├── img/              # Imágenes (JPG, WebP, PNG)
│   ├── cv/               # PDF del CV
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── manifest.json
├── templates/
│   ├── index.html        # Página principal
│   ├── privacy.html      # Política de privacidad
│   ├── 404.html          # Error 404
│   └── 500.html          # Error 500
├── app.py                # Servidor de desarrollo local
├── requirements.txt      # Dependencias Python
├── vercel.json           # Configuración Vercel
└── README.md
```

---

## 🚀 Inicio Rápido

### Requisitos

- Python 3.9 o superior
- pip (gestor de paquetes Python)
- Node.js (opcional, para minificación)

### Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/carlosm-lab/portafolio.git
cd portafolio

# 2. Crear entorno virtual
python -m venv venv

# 3. Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Ejecutar servidor de desarrollo
python app.py
```

El servidor estará disponible en:
- **Local:** http://127.0.0.1:5000
- **Red:** http://<tu-ip>:5000

---

## 📦 Scripts de Build

### Minificar CSS/JS (Producción)

```bash
# Instalar herramientas globalmente
npm install -g clean-css-cli terser

# Minificar CSS
cleancss -o static/css/style.min.css static/css/style.css

# Minificar JavaScript
terser static/js/script.js -o static/js/script.min.js -c -m
terser static/js/firefly.js -o static/js/firefly.min.js -c -m
```

---

## 🌐 Despliegue en Vercel

### Opción 1: Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

### Opción 2: GitHub Integration

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Vercel detectará automáticamente la configuración de `vercel.json`
3. Cada push a `main` desplegará automáticamente

### Variables de Entorno (Opcional)

```bash
FLASK_DEBUG=false
```

---

## 🔒 Seguridad

El proyecto implementa las siguientes medidas de seguridad:

| Header | Valor |
|--------|-------|
| Content-Security-Policy | Restrictivo, permite Google Fonts/Analytics |
| X-Frame-Options | SAMEORIGIN |
| X-Content-Type-Options | nosniff |
| Strict-Transport-Security | 1 año + includeSubDomains + preload |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | Restrictivo (no camera, mic, etc.) |
| Rate Limiting | 100 requests/60s por IP |

---

## ♿ Accesibilidad

- ✅ Skip link para navegación por teclado
- ✅ ARIA labels en elementos interactivos
- ✅ Roles semánticos (main, nav, article, section)
- ✅ Alt text en todas las imágenes
- ✅ Soporte para `prefers-reduced-motion`
- ✅ Focus visible en elementos navegables
- ✅ Contraste de colores WCAG AA

---

## 📊 SEO

- ✅ Meta tags completos (description, keywords, author)
- ✅ Open Graph para Facebook/LinkedIn
- ✅ Twitter Cards
- ✅ Schema.org JSON-LD (ProfilePage + Person)
- ✅ Canonical URL
- ✅ Hreflang (es-SV, es, x-default)
- ✅ Sitemap XML
- ✅ Robots.txt

---

## 🎨 Personalización

### Colores (CSS Variables)

Editar en `static/css/style.css`:

```css
:root {
    --color-bg-primary: #050505;
    --color-accent: #C9A962;        /* Dorado principal */
    --color-text-primary: #EDEDED;
    --color-text-secondary: #A0A0A0;
}
```

### Fuentes

Las fuentes se cargan desde Google Fonts:
- **Display:** Playfair Display (títulos)
- **Body:** Inter (texto)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

**Carlos José Molina Villacorta**

- 🌐 Website: [carlosmolina.vercel.app](https://carlosmolina.vercel.app)
- 💼 LinkedIn: [carlos-molina-Villacorta](https://linkedin.com/in/carlos-molina-Villacorta)
- 🐙 GitHub: [@carlosm-lab](https://github.com/carlosm-lab)
- 📧 Email: carlosmolina.contact@gmail.com

---

<p align="center">
  Hecho con ❤️ en San Miguel, El Salvador
</p>
