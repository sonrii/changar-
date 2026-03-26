# Guía de Setup - ChangAR

## 1. Configuración de Firebase

### 1.1 Crear proyecto Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Nombre del proyecto: `changar` (o el que prefieras)
4. Deshabilitar Google Analytics (opcional para MVP)
5. Crear proyecto

### 1.2 Configurar Authentication

1. En el menú lateral, ir a **Authentication**
2. Click en "Comenzar"
3. En la pestaña "Sign-in method":
   - Habilitar **Correo electrónico/Contraseña**
   - Guardar

### 1.3 Configurar Firestore Database

1. En el menú lateral, ir a **Firestore Database**
2. Click en "Crear base de datos"
3. Seleccionar modo: **Producción**
4. Elegir ubicación: `us-east1` o la más cercana a Argentina
5. Crear base de datos

### 1.4 Configurar Firestore Rules

1. En Firestore Database, ir a la pestaña **Reglas**
2. Copiar el contenido del archivo `firestore.rules` del proyecto
3. Publicar las reglas

### 1.5 Obtener credenciales

1. En el menú lateral, ir a **Configuración del proyecto** (ícono de engranaje)
2. En la sección "Tus apps", click en el ícono web `</>`
3. Registrar la app con un nombre (ej: "ChangAR Web")
4. Copiar las credenciales del objeto `firebaseConfig`

## 2. Configuración del proyecto local

### 2.1 Instalar dependencias

```bash
cd changar
npm install
```

### 2.2 Configurar variables de entorno

1. Copiar el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Editar `.env` con las credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=changar.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=changar
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=changar.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 2.3 Ejecutar en desarrollo

```bash
npm run dev
```

La app estará en `http://localhost:3000`

## 3. Verificación del setup

### 3.1 Crear primer usuario

1. Ir a `http://localhost:3000`
2. Click en "Registrate"
3. Completar el formulario:
   - Elegir rol: "Quiero trabajar" o "Necesito contratar"
   - Nombre completo
   - Email
   - Contraseña (mínimo 6 caracteres)
   - Zona
4. Click en "Crear cuenta"

### 3.2 Verificar en Firebase Console

1. Ir a **Authentication** > **Users**
   - Debería aparecer el usuario creado

2. Ir a **Firestore Database** > **Data**
   - Debería existir la colección `users` con el documento del usuario

### 3.3 Probar flujo de trabajador

Si elegiste "Quiero trabajar":

1. Completar perfil de trabajador:
   - Oficio
   - Zona
   - Descripción
   - WhatsApp (opcional)
   - Disponibilidad
2. Ver pedidos disponibles
3. Postularse a un pedido (necesitarás crear un cliente primero)

### 3.4 Probar flujo de cliente

Si elegiste "Necesito contratar":

1. Crear un pedido:
   - Tipo de trabajador
   - Título
   - Descripción
   - Zona
   - Urgencia
2. Buscar trabajadores
3. Ver postulaciones (necesitarás un trabajador que se postule)

## 4. Datos de prueba

### Crear usuarios de prueba

Para probar la aplicación completa, crear al menos:

**1 Cliente:**
- Email: `cliente@test.com`
- Password: `test123`
- Rol: Cliente

**1 Trabajador:**
- Email: `trabajador@test.com`
- Password: `test123`
- Rol: Trabajador
- Oficio: Albañil
- Zona: CABA

## 5. Troubleshooting

### Error: "Firebase: Error (auth/...)"

- Verificar que las credenciales en `.env` sean correctas
- Verificar que Authentication esté habilitado en Firebase Console
- Reiniciar el servidor de desarrollo

### Error: "Missing or insufficient permissions"

- Verificar que las reglas de Firestore estén publicadas correctamente
- Verificar que el usuario esté autenticado

### La app no carga

- Verificar que todas las dependencias estén instaladas: `npm install`
- Verificar que el archivo `.env` exista y tenga las variables correctas
- Limpiar caché: `rm -rf .next` y `npm run dev`

### Errores de TypeScript

- Los errores de TypeScript sobre módulos faltantes son normales antes de `npm install`
- Después de instalar, ejecutar: `npm run dev`

## 6. Deploy a producción

### Opción 1: Vercel (Recomendado)

1. Crear cuenta en [Vercel](https://vercel.com)
2. Conectar repositorio
3. Configurar variables de entorno (las mismas del `.env`)
4. Deploy automático

### Opción 2: Firebase Hosting

1. Instalar Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Inicializar:
```bash
firebase init hosting
```

4. Build:
```bash
npm run build
```

5. Deploy:
```bash
firebase deploy --only hosting
```

## 7. Configuración adicional (Opcional)

### Habilitar índices compuestos en Firestore

Si ves errores sobre índices faltantes:

1. Ir a **Firestore Database** > **Índices**
2. Firebase sugerirá crear índices automáticamente
3. Click en el link del error para crear el índice

### Configurar dominio custom

1. En Firebase Console > **Hosting**
2. Agregar dominio personalizado
3. Seguir instrucciones para configurar DNS

---

## ✅ Checklist de setup completo

- [ ] Proyecto Firebase creado
- [ ] Authentication habilitado
- [ ] Firestore Database creado
- [ ] Firestore Rules publicadas
- [ ] Credenciales copiadas
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` configurado
- [ ] App corriendo en desarrollo (`npm run dev`)
- [ ] Usuario de prueba creado
- [ ] Flujo de trabajador probado
- [ ] Flujo de cliente probado

**¡Setup completo! La aplicación está lista para usar. 🎉**
