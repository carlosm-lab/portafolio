# Changelog

Todos los cambios notables de este proyecto están documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.0] - 2026-01-07

### ✨ Añadido
- Diseño Dark Luxury con glassmorphism
- Animación de luciérnaga interactiva (firefly)
- **Efecto typewriter en roles del hero** (escribe las etiquetas como máquina de escribir)
- Sistema de animaciones scroll-triggered
- Navegación móvil fullscreen con transiciones
- Sección memorial "In Memoriam" con gatito animado
- Cookie banner GDPR compliant
- Política de privacidad completa
- Páginas de error personalizadas (404, 500)
- PWA con manifest y favicons
- Soporte para múltiples idiomas (hreflang)

### 🔒 Seguridad
- Content Security Policy (CSP) implementado
- HSTS con preload
- Rate limiting (100 req/60s)
- Headers de seguridad completos (X-Frame-Options, X-XSS-Protection, etc.)
- Cross-Origin policies configuradas

### ♿ Accesibilidad
- Skip link para navegación por teclado
- ARIA labels en todos los elementos interactivos
- Soporte para `prefers-reduced-motion`
- Contraste de colores WCAG AA
- Focus visible en elementos navegables

### 🚀 Optimización
- CSS minificado (~35% reducción)
- JavaScript minificado (~60% reducción)
- Imágenes WebP disponibles
- Lazy loading de imágenes
- Preload de recursos críticos (LCP image, fonts)
- Cache headers optimizados (1 año para static)

### 📄 SEO
- Schema.org JSON-LD (ProfilePage + Person)
- Open Graph completo
- Twitter Cards
- Sitemap XML
- Robots.txt configurado

---

## [0.1.0] - 2024-01-01

### ✨ Añadido
- Estructura inicial del proyecto
- Configuración de Flask
- Templates básicos
- Estilos CSS base

---

## Tipos de Cambios

- `✨ Añadido` para nuevas características.
- `🔄 Cambiado` para cambios en funcionalidades existentes.
- `⚠️ Obsoleto` para características que serán eliminadas próximamente.
- `🗑️ Eliminado` para características eliminadas.
- `🐛 Corregido` para corrección de bugs.
- `🔒 Seguridad` para correcciones de vulnerabilidades.
- `♿ Accesibilidad` para mejoras de accesibilidad.
- `🚀 Optimización` para mejoras de rendimiento.
- `📄 SEO` para mejoras de posicionamiento.
