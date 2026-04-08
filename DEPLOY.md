# 🚀 Guía de Despliegue - Portfolio Carlos Molina

Esta guía explica cómo desplegar el portfolio en diferentes plataformas de hosting.

---

## 📋 Requisitos Previos

Antes de desplegar, asegúrate de tener:

- ✅ Código fuente del proyecto
- ✅ Archivos minificados generados (`style.min.css`, `script.min.js`, `firefly.min.js`)
- ✅ Cuenta en la plataforma de hosting elegida

### Generar Archivos Minificados

```bash
# Instalar herramientas
npm install -g clean-css-cli terser

# Minificar CSS
cleancss -o static/css/style.min.css static/css/style.css

# Minificar JavaScript
terser static/js/script.js -o static/js/script.min.js -c -m
terser static/js/firefly.js -o static/js/firefly.min.js -c -m
```

---

## 🔷 Vercel (Recomendado)

Vercel es la plataforma recomendada por su excelente soporte para Python/Flask y despliegue serverless.

### Opción A: Desde la Interfaz Web

1. **Crear cuenta** en [vercel.com](https://vercel.com)

2. **Importar proyecto:**
   - Click en "Add New..." → "Project"
   - Conectar con GitHub/GitLab/Bitbucket
   - Seleccionar el repositorio del portfolio

3. **Configuración automática:**
   - Vercel detectará `vercel.json` automáticamente
   - No se requiere configuración adicional

4. **Deploy:**
   - Click en "Deploy"
   - Esperar ~1-2 minutos

5. **URL generada:** `https://tu-proyecto.vercel.app`

### Opción B: Vercel CLI

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Iniciar sesión
vercel login

# 3. Desplegar (preview)
vercel

# 4. Desplegar a producción
vercel --prod
```

### Dominio Personalizado

1. Ir a Project Settings → Domains
2. Añadir tu dominio (ej: `carlosmolina.com`)
3. Configurar DNS según instrucciones de Vercel:
   - Tipo A: `76.76.21.21`
   - O CNAME: `cname.vercel-dns.com`

---

## 🟠 Railway

Railway es una alternativa simple con soporte nativo para Flask.

### Pasos

1. **Crear cuenta** en [railway.app](https://railway.app)

2. **Nuevo proyecto:**
   - Click en "New Project"
   - Seleccionar "Deploy from GitHub repo"

3. **Configurar:**
   - Railway detectará Flask automáticamente
   - Añadir variable de entorno:
     ```
     PORT=5000
     FLASK_DEBUG=false
     ```

4. **Crear Procfile** (si no existe):
   ```
   web: gunicorn api.index:app
   ```

5. **Actualizar requirements.txt:**
   ```
   Flask==3.0.0
   Werkzeug==3.0.1
   gunicorn==21.2.0
   ```

6. **Deploy** automático al hacer push

---

## 🟣 Render

### Pasos

1. **Crear cuenta** en [render.com](https://render.com)

2. **Nuevo Web Service:**
   - Click en "New" → "Web Service"
   - Conectar repositorio

3. **Configuración:**
   ```
   Name: carlos-molina-portfolio
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn api.index:app
   ```

4. **Variables de entorno:**
   ```
   FLASK_DEBUG=false
   ```

5. **Deploy**

---

## 🐳 Docker

### Dockerfile

Crear `Dockerfile` en la raíz del proyecto:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copiar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copiar código
COPY . .

# Puerto
EXPOSE 5000

# Comando
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "api.index:app"]
```

### Construir y Ejecutar

```bash
# Construir imagen
docker build -t portfolio .

# Ejecutar contenedor
docker run -p 5000:5000 portfolio
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  portfolio:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_DEBUG=false
    restart: unless-stopped
```

```bash
docker-compose up -d
```

---

## ☁️ VPS (DigitalOcean, AWS, etc.)

### Con Nginx + Gunicorn

1. **Conectar al servidor:**
   ```bash
   ssh usuario@tu-servidor
   ```

2. **Instalar dependencias:**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nginx
   ```

3. **Clonar proyecto:**
   ```bash
   git clone https://github.com/usuario/portafolio.git
   cd portafolio
   ```

4. **Crear entorno virtual:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn
   ```

5. **Crear servicio systemd:**
   ```bash
   sudo nano /etc/systemd/system/portfolio.service
   ```
   
   Contenido:
   ```ini
   [Unit]
   Description=Portfolio Flask App
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/var/www/portafolio
   Environment="PATH=/var/www/portafolio/venv/bin"
   ExecStart=/var/www/portafolio/venv/bin/gunicorn --workers 3 --bind unix:portfolio.sock api.index:app

   [Install]
   WantedBy=multi-user.target
   ```

6. **Configurar Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/portfolio
   ```
   
   Contenido:
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;

       location / {
           include proxy_params;
           proxy_pass http://unix:/var/www/portafolio/portfolio.sock;
       }

       location /static {
           alias /var/www/portafolio/static;
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

7. **Activar y reiniciar:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled
   sudo systemctl start portfolio
   sudo systemctl enable portfolio
   sudo systemctl restart nginx
   ```

8. **SSL con Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tu-dominio.com
   ```

---

## ✅ Verificación Post-Despliegue

Después de desplegar, verifica:

| Aspecto | URL/Comando |
|---------|-------------|
| Página principal | `https://tu-dominio.com/` |
| Página de privacidad | `https://tu-dominio.com/privacy` |
| Página 404 | `https://tu-dominio.com/pagina-inexistente` |
| Robots.txt | `https://tu-dominio.com/robots.txt` |
| Sitemap | `https://tu-dominio.com/sitemap.xml` |
| Manifest PWA | `https://tu-dominio.com/manifest.json` |

### Headers de Seguridad

Verificar en [securityheaders.com](https://securityheaders.com/):
- ✅ Content-Security-Policy
- ✅ X-Frame-Options
- ✅ Strict-Transport-Security
- ✅ X-Content-Type-Options

---

## 🔧 Variables de Entorno

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `FLASK_DEBUG` | `false` | Desactivar modo debug en producción |
| `PORT` | `5000` | Puerto (algunas plataformas lo requieren) |

---

## ⚠️ Notas Importantes

1. **NUNCA** desplegar con `FLASK_DEBUG=true` en producción
2. Verificar que todos los assets (CSS, JS, imágenes) carguen correctamente
3. Actualizar la URL canónica en `index.html` si cambias de dominio
4. Actualizar `sitemap.xml` con el dominio correcto

### 🔴 ANTES DE DESPLEGAR A PRODUCCIÓN:

Las directivas de seguridad HTTPS están **temporalmente desactivadas** para desarrollo local. 

**Archivo:** `api/index.py` (líneas ~160-165)

**Acción requerida:** Descomentar las siguientes líneas marcadas con `[PRODUCCIÓN]`:
```python
# [PRODUCCIÓN] Descomentar las siguientes 2 líneas antes de desplegar:
# "upgrade-insecure-requests",
# "block-all-mixed-content"
```

Cambiar a:
```python
"upgrade-insecure-requests",
"block-all-mixed-content"
```

Esto asegura que todo el tráfico se redirija a HTTPS en producción.

---

## 📞 Soporte

¿Problemas con el despliegue? 
- Revisa los logs de la plataforma
- Verifica que `requirements.txt` esté actualizado
- Contacta: carlosmolina.contact@gmail.com
