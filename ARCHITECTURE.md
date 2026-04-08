# 🏗️ Arquitectura del Proyecto

Este documento describe la arquitectura técnica del Portfolio Carlos Molina.

---

## 📊 Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Browser   │  │   Mobile    │  │    PWA      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL EDGE                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  CDN (Static Assets) - Cache 1 año                      │    │
│  │  • /static/css/*.min.css                                │    │
│  │  • /static/js/*.min.js                                  │    │
│  │  • /static/img/*                                        │    │
│  └─────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL SERVERLESS                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Flask Application (api/index.py)                       │    │
│  │  • Rate Limiting (100 req/60s)                          │    │
│  │  • Security Headers                                      │    │
│  │  • Template Rendering                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Directorios

```
portafolio/
├── api/                    # Serverless functions
│   └── index.py           # Flask app principal
│
├── static/                 # Assets estáticos (CDN)
│   ├── css/
│   │   ├── style.css      # CSS fuente
│   │   └── style.min.css  # CSS minificado
│   ├── js/
│   │   ├── script.js      # JS principal
│   │   ├── script.min.js  # JS minificado
│   │   ├── firefly.js     # Efecto luciérnaga
│   │   ├── firefly.min.js
│   │   └── tracking.js    # Google Analytics
│   ├── img/               # Imágenes
│   ├── cv/                # PDF del CV
│   ├── favicon.svg
│   ├── manifest.json      # PWA manifest
│   ├── robots.txt
│   └── sitemap.xml
│
├── templates/              # Jinja2 templates
│   ├── index.html         # Página principal
│   ├── privacy.html       # Política de privacidad
│   ├── 404.html           # Error 404
│   └── 500.html           # Error 500
│
├── app.py                  # Servidor desarrollo local
├── requirements.txt        # Dependencias Python
├── vercel.json            # Config Vercel
├── README.md
├── DEPLOY.md
├── CHANGELOG.md
├── ARCHITECTURE.md
├── LICENSE
└── .gitignore
```

---

## 🔄 Flujo de Peticiones

### 1. Assets Estáticos
```
Request → Vercel Edge CDN → Cache Hit? → Response
                               ↓ No
                        Serve from origin
```

### 2. Páginas Dinámicas
```
Request → Vercel Edge → Serverless Function → Flask
                                                  ↓
                                         Rate Limit Check
                                                  ↓
                                         Render Template
                                                  ↓
                                         Add Security Headers
                                                  ↓
                                              Response
```

---

## 🎨 Sistema de Diseño CSS

### Custom Properties (Design Tokens)

```css
:root {
    /* Colores */
    --color-bg-primary: #050505;
    --color-accent: #C9A962;
    --color-text-primary: #EDEDED;
    
    /* Tipografía */
    --font-display: 'Playfair Display';
    --font-body: 'Inter';
    
    /* Espaciado */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    /* ... */
    
    /* Efectos */
    --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    --glass-blur: 20px;
}
```

### Componentes Principales

| Componente | Descripción |
|------------|-------------|
| `.glass-card` | Tarjeta con efecto glassmorphism |
| `.reveal` | Animación scroll-triggered |
| `.skill-card` | Tarjeta de habilidades |
| `.project-card` | Tarjeta de proyectos |
| `.mobile-nav` | Navegación móvil fullscreen |

---

## 🔧 Sistema de JavaScript

### Módulos

```javascript
// script.js - Arquitectura modular
├── ScrollReveal        // Animaciones al scroll
├── StaggerAnimation    // Animaciones escalonadas
├── HeaderController    // Comportamiento del header
├── MobileNav          // Navegación móvil
├── SmoothScroll       // Scroll suave
├── ParallaxEffect     // Efecto parallax
├── CursorGlow         // Efecto glow en cursor
└── CookieConsent      // Banner de cookies
```

### Firefly Animation
```javascript
// firefly.js - Sistema de partículas
├── createFirefly()     // Crear SVG de luciérnaga
├── createTrail()       // Crear estela de partículas
├── animateFirefly()    // Loop de animación
├── updateTarget()      // Movimiento autónomo
├── getKittenPosition() // Interacción con gatito
└── updateEyes()        // Tracking de ojos del gatito
```

---

## 🔒 Capas de Seguridad

```
┌─────────────────────────────────────────┐
│ Layer 1: Vercel Edge                    │
│ • DDoS Protection                       │
│ • SSL/TLS Termination                   │
│ • Geographic Distribution               │
├─────────────────────────────────────────┤
│ Layer 2: HTTP Headers                   │
│ • Content-Security-Policy               │
│ • Strict-Transport-Security             │
│ • X-Frame-Options                       │
│ • X-Content-Type-Options                │
├─────────────────────────────────────────┤
│ Layer 3: Application                    │
│ • Rate Limiting (100/60s per IP)        │
│ • Input Sanitization                    │
│ • Error Handling                        │
└─────────────────────────────────────────┘
```

---

## 📱 Responsive Design

### Breakpoints

| Breakpoint | Ancho | Uso |
|------------|-------|-----|
| Mobile S | 320px | Mínimo soportado |
| Mobile L | 425px | Móviles grandes |
| Tablet | 768px | Tablets, nav móvil |
| Laptop | 1024px | Nav desktop |
| Desktop | 1400px | Container max-width |

### Grid System
- Bootstrap Grid 5.3 (solo grid, ~10KB)
- CSS Grid para layouts complejos
- Flexbox para componentes

---

## 🌐 SEO & Metadata

### Head Structure
```html
<head>
    <!-- Basic Meta -->
    <meta charset="UTF-8">
    <meta name="viewport" content="...">
    <meta name="description" content="...">
    
    <!-- Open Graph -->
    <meta property="og:title" content="...">
    <meta property="og:image" content="...">
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="...">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
        { "@type": "ProfilePage", ... }
    </script>
    
    <!-- Canonical & Hreflang -->
    <link rel="canonical" href="...">
    <link rel="alternate" hreflang="es" href="...">
</head>
```

---

## 🚀 Pipeline de Build

```
1. Desarrollo
   └── Editar style.css, script.js
   
2. Minificación
   ├── cleancss → style.min.css
   ├── terser → script.min.js
   └── terser → firefly.min.js
   
3. Commit
   └── git add . && git commit
   
4. Deploy
   ├── Push to GitHub
   └── Vercel auto-deploy
```

---

## 📈 Métricas de Rendimiento

### Objetivos Core Web Vitals

| Métrica | Objetivo | Estrategia |
|---------|----------|------------|
| LCP | < 2.5s | Preload imagen principal |
| FID | < 100ms | JS no-bloqueante |
| CLS | < 0.1 | Dimensiones de imagen fijas |

### Optimizaciones Aplicadas
- CSS minificado (-35%)
- JS minificado (-60%)
- Imágenes WebP
- Font display swap
- Lazy loading
- Cache 1 año para static
