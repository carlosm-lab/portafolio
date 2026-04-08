# 🤝 Contribuir al Proyecto

¡Gracias por tu interés en contribuir! Este documento explica cómo puedes ayudar a mejorar este portfolio.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Pull Requests](#pull-requests)
- [Estilo de Código](#estilo-de-código)
- [Configuración Local](#configuración-local)

---

## 📜 Código de Conducta

Este proyecto sigue un código de conducta inclusivo y respetuoso:

- Sé respetuoso y constructivo
- No se tolera acoso ni discriminación
- Acepta críticas constructivas con gracia
- Enfócate en lo que es mejor para la comunidad

---

## 🚀 Cómo Contribuir

### Tipos de Contribuciones Bienvenidas

- 🐛 **Reportar bugs** — Encontraste algo que no funciona
- 💡 **Sugerir mejoras** — Tienes ideas para mejorar
- 📝 **Documentación** — Corregir errores o mejorar docs
- 🎨 **Diseño** — Mejoras visuales o UX
- ♿ **Accesibilidad** — Mejoras para usuarios con discapacidades
- 🌐 **Traducciones** — Traducir contenido

---

## 🐛 Reportar Bugs

Antes de reportar un bug:

1. **Verifica** que no exista ya un issue similar
2. **Prueba** en la última versión del proyecto

### Información a Incluir

```markdown
**Descripción del Bug**
Descripción clara y concisa.

**Pasos para Reproducir**
1. Ir a '...'
2. Click en '...'
3. Ver error

**Comportamiento Esperado**
Qué debería pasar.

**Screenshots**
Si aplica.

**Entorno**
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Versión: [si aplica]
```

---

## 💡 Sugerir Mejoras

Las sugerencias son bienvenidas. Incluye:

- **Descripción clara** de la mejora
- **Justificación** de por qué sería útil
- **Mockups o ejemplos** si aplica

---

## 🔀 Pull Requests

### Proceso

1. **Fork** el repositorio
2. **Crea una rama** para tu feature:
   ```bash
   git checkout -b feature/mi-mejora
   ```
3. **Haz tus cambios** siguiendo el estilo de código
4. **Minifica** si modificas CSS/JS:
   ```bash
   cleancss -o static/css/style.min.css static/css/style.css
   terser static/js/script.js -o static/js/script.min.js -c -m
   ```
5. **Commit** con mensaje descriptivo:
   ```bash
   git commit -m "feat: añade nueva animación al header"
   ```
6. **Push** a tu fork:
   ```bash
   git push origin feature/mi-mejora
   ```
7. **Abre un Pull Request**

### Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Cambios en documentación |
| `style:` | Formato (sin cambio de lógica) |
| `refactor:` | Refactorización de código |
| `perf:` | Mejora de rendimiento |
| `a11y:` | Mejora de accesibilidad |

---

## 🎨 Estilo de Código

### HTML
- Indentación: 4 espacios
- Atributos en orden: id, class, data-*, otros
- Comentarios para secciones grandes

### CSS
- Usar CSS Custom Properties (variables)
- Mobile-first
- Comentarios para secciones
- BEM para clases cuando aplique

### JavaScript
- ES6+ (const/let, arrow functions, template literals)
- `'use strict';` al inicio
- JSDoc para funciones complejas
- Nombres descriptivos

---

## 🛠️ Configuración Local

```bash
# 1. Fork y clonar
git clone https://github.com/TU-USUARIO/portafolio.git
cd portafolio

# 2. Crear entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Ejecutar servidor
python app.py
```

### Herramientas Recomendadas

- **Editor:** VS Code con extensiones Prettier, ESLint
- **Browser:** Chrome DevTools para debugging
- **Testing:** Lighthouse para performance/a11y

---

## 📞 Contacto

¿Preguntas? Contáctame:
- Email: carlosmolina.contact@gmail.com
- LinkedIn: [carlos-molina-Villacorta](https://linkedin.com/in/carlos-molina-Villacorta)

---

¡Gracias por contribuir! 🎉
