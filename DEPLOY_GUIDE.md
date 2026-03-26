# Guía de Deployment - ChangAR

## 🚀 Opciones de Hosting

ChangAR es una aplicación Next.js que puede deployarse en múltiples plataformas.

---

## 📋 Pre-requisitos (Todas las opciones)

### 1. Variables de Entorno
Configurar estas variables en tu plataforma de hosting:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_WORLD_APP_ID=  # Dejar vacío por ahora
NEXT_PUBLIC_APP_NAME=ChangAR
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
NEXT_PUBLIC_ENVIRONMENT=production
```

### 2. Firestore Rules
Asegurate que las reglas de Firestore estén activas:
```bash
firebase deploy --only firestore:rules
```

---

## 🌐 Opción 1: Netlify

### Paso 1: Conectar Repositorio
1. Ir a https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Conectar tu repositorio Git

### Paso 2: Configurar Build
```
Build command: npm run build
Publish directory: .next
```

### Paso 3: Variables de Entorno
En Netlify dashboard:
- Site settings → Environment variables
- Agregar todas las variables listadas arriba

### Paso 4: Deploy
- Click "Deploy site"
- Netlify detectará automáticamente Next.js

**Archivo incluido:** `netlify.toml` (ya configurado)

---

## 🚂 Opción 2: Railway

### Paso 1: Crear Proyecto
1. Ir a https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Seleccionar tu repositorio

### Paso 2: Configurar
Railway detecta automáticamente Next.js.

**Build Command:** `npm run build`  
**Start Command:** `npm run start`

### Paso 3: Variables de Entorno
En Railway dashboard:
- Variables → Add all environment variables

### Paso 4: Deploy
- Railway hace deploy automático en cada push

---

## 🎨 Opción 3: Render

### Paso 1: Crear Web Service
1. Ir a https://render.com
2. New → Web Service
3. Conectar repositorio

### Paso 2: Configurar
```
Name: changar
Environment: Node
Build Command: npm install && npm run build
Start Command: npm run start
```

### Paso 3: Variables de Entorno
En Render dashboard:
- Environment → Add all variables

### Paso 4: Deploy
- Click "Create Web Service"

---

## 🖥️ Opción 4: VPS/Servidor Propio

### Requisitos
- Ubuntu 20.04+ (o similar)
- Node.js 18+
- Nginx (para reverse proxy)
- PM2 (process manager)

### Paso 1: Preparar Servidor
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install -y nginx
```

### Paso 2: Clonar y Configurar
```bash
# Clonar repositorio
cd /var/www
sudo git clone tu-repo.git changar
cd changar

# Instalar dependencias
npm install

# Crear .env.local
sudo nano .env.local
# Pegar todas las variables de entorno

# Build
npm run build
```

### Paso 3: Configurar PM2
```bash
# Iniciar app con PM2
pm2 start npm --name "changar" -- start

# Configurar auto-start
pm2 startup
pm2 save
```

### Paso 4: Configurar Nginx
```bash
sudo nano /etc/nginx/sites-available/changar
```

Contenido:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar:
```bash
sudo ln -s /etc/nginx/sites-available/changar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Paso 5: SSL con Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## 🐳 Opción 5: Docker

### Paso 1: Build Image
```bash
docker build -t changar .
```

### Paso 2: Run Container
```bash
docker run -d \
  -p 3000:3000 \
  --name changar \
  --env-file .env.local \
  changar
```

### Paso 3: Docker Compose (Opcional)
Crear `docker-compose.yml`:
```yaml
version: '3.8'
services:
  changar:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped
```

Ejecutar:
```bash
docker-compose up -d
```

---

## 🔧 Troubleshooting

### Build Falla
```bash
# Limpiar cache
rm -rf .next node_modules
npm install
npm run build
```

### Puerto en Uso
```bash
# Cambiar puerto en package.json
"start": "next start -p 3001"
```

### Variables de Entorno No Funcionan
- Verificar que empiecen con `NEXT_PUBLIC_`
- Rebuild después de cambiar variables
- En servidor, reiniciar PM2: `pm2 restart changar`

---

## ✅ Verificación Post-Deploy

### 1. Probar Registro
- Ir a `/auth/register`
- Crear cuenta de prueba
- Verificar que se crea en Firebase

### 2. Probar Login
- Iniciar sesión
- Verificar redirect a dashboard

### 3. Probar Funcionalidad Core
- Crear perfil worker
- Crear pedido
- Buscar workers
- Aplicar a trabajo

### 4. Verificar World SDK
- Abrir en navegador normal
- No debería mostrar badge "World App"
- Abrir en World App (si tenés)
- Debería mostrar badge "World App"

---

## 📊 Monitoreo

### Logs en Producción
```bash
# PM2
pm2 logs changar

# Docker
docker logs changar

# Netlify/Railway/Render
Ver logs en dashboard
```

### Firebase Console
- Monitorear usuarios registrados
- Verificar uso de Firestore
- Revisar errores de auth

---

## 🔄 Actualizar Deployment

### Git-based (Netlify/Railway/Render)
```bash
git add .
git commit -m "Update"
git push origin main
# Deploy automático
```

### VPS/Servidor
```bash
cd /var/www/changar
git pull
npm install
npm run build
pm2 restart changar
```

### Docker
```bash
docker-compose down
git pull
docker-compose up -d --build
```

---

## 🎯 Recomendaciones

1. **Usar HTTPS siempre** (Let's Encrypt gratis)
2. **Configurar dominio custom** (mejor que subdomain)
3. **Monitorear Firebase usage** (evitar costos inesperados)
4. **Backup Firestore** regularmente
5. **Configurar alertas** de errores

---

## 📞 Soporte

Si tenés problemas con el deployment:
1. Revisar logs de build
2. Verificar variables de entorno
3. Confirmar que Firebase está configurado
4. Revisar `AUDITORIA_BUGS.md` para issues conocidos
