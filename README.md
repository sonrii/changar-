# ChangAR

**Laburo rápido, gente real**

Plataforma para conectar trabajadores con clientes en Argentina.

🌍 **World Mini App Ready** - Estructuralmente preparado para despliegue como World Mini App

## 🎯 Descripción

ChangAR es una plataforma que conecta trabajadores verificados con clientes que necesitan servicios. Changas y oficios en Argentina. La aplicación está diseñada para ser simple, rápida y útil, con foco en la experiencia local argentina.

### Oficios disponibles (MVP)
- Albañil
- Plomero
- Electricista

### Zonas cubiertas
- CABA
- GBA Sur
- GBA Norte
- GBA Oeste
- La Plata
- Córdoba
- Rosario

## 🌍 World Mini App Integration

ChangAR incluye integración real con World Mini App SDK:

- ✅ **SDK oficial instalado** - `@worldcoin/minikit-js` (real, no placeholder)
- ✅ **Detección de plataforma real** - Usa `MiniKit.isInstalled()`
- ✅ **Inicialización automática** - `MiniKitProvider` integrado
- ✅ **Indicador UI** - Badge "World App" cuando se detecta
- ✅ **Modo browser funcional** - Funciona sin configuración World
- ✅ **Firebase preservado** - Backend principal sin cambios

**Modo actual:** Firebase email/password (funciona en browser y World App)  
**Modo futuro:** World ID authentication (requiere configuración)

### Configuración World App (Opcional)

Para habilitar funciones World completas:

1. **Registrar app en World Developer Portal**
   - https://developer.worldcoin.org/
   - Crear Mini App y obtener App ID

2. **Configurar variable de entorno**
   ```bash
   NEXT_PUBLIC_WORLD_APP_ID=app_your_id_here
   ```

3. **Desplegar y probar en World App**
   - App funciona en browser sin configuración
   - Funciones World se activan cuando se abre en World App

Ver `WORLD_SDK_INTEGRATION.md` para detalles completos.

## 🚀 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Backend**: Firebase
  - Authentication
  - Firestore
  - Hosting
- **UI Components**: Componentes custom con Lucide React
- **Notificaciones**: React Hot Toast

## 📋 Prerequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase

## 🛠️ Instalación

1. **Clonar el repositorio o navegar a la carpeta del proyecto**

```bash
cd changar
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar Firebase**

   a. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
   
   b. Habilitar Authentication (Email/Password)
   
   c. Crear una base de datos Firestore
   
   d. Copiar las credenciales de configuración

4. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

5. **Configurar Firestore Rules**

En Firebase Console, ir a Firestore Database > Rules y copiar el contenido de `firestore.rules`

6. **Ejecutar en desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Build para producción

```bash
npm run build
npm start
```

## 🌍 Despliegue como World Mini App

Para desplegar ChangAR como World Mini App, sigue estos pasos:

1. **Crear un nuevo proyecto en World App**: Crea un nuevo proyecto en la plataforma World App y selecciona la opción de desplegar una aplicación existente.
2. **Configurar la aplicación**: Configura la aplicación con las credenciales de Firebase y las variables de entorno necesarias.
3. **Subir el código**: Sube el código de ChangAR al proyecto de World App.
4. **Configurar las rutas**: Configura las rutas de la aplicación para que se ajusten a las necesidades de World App.
5. **Desplegar la aplicación**: Despliega la aplicación en World App y verifica que funcione correctamente.

## 🏗️ Estructura del proyecto

```
changar/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Autenticación
│   │   ├── client/            # Dashboard y flujos de cliente
│   │   ├── worker/            # Dashboard y flujos de trabajador
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes UI base
│   │   ├── Layout.tsx        # Layout wrapper
│   │   ├── WorkerCard.tsx    # Card de trabajador
│   │   └── JobRequestCard.tsx # Card de pedido
│   ├── contexts/             # React Contexts
│   │   └── AuthContext.tsx   # Contexto de autenticación
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilidades y configuración
│   │   ├── firebase.ts       # Configuración Firebase
│   │   ├── constants.ts      # Constantes de la app
│   │   └── utils.ts          # Funciones auxiliares
│   ├── services/             # Servicios de Firebase
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── worker.service.ts
│   │   ├── job.service.ts
│   │   └── application.service.ts
│   └── types/                # TypeScript types
│       └── index.ts
├── firestore.rules           # Reglas de seguridad Firestore
├── .env.example             # Template de variables de entorno
└── README.md
```

## 🔐 Seguridad

Las reglas de Firestore están configuradas para:
- Solo usuarios autenticados pueden leer/escribir
- Los usuarios solo pueden editar sus propios datos
- Los trabajadores solo pueden crear/editar su perfil
- Los clientes solo pueden crear/editar sus pedidos
- Las postulaciones solo pueden ser creadas por el trabajador correspondiente

## 🎨 Flujos principales

### Cliente
1. Registro/Login
2. Crear pedido de trabajo
3. Buscar trabajadores por oficio y zona
4. Ver postulaciones a sus pedidos
5. Contactar trabajadores por WhatsApp

### Trabajador
1. Registro/Login
2. Crear perfil de trabajador
3. Ver pedidos disponibles filtrados por oficio/zona
4. Postularse a pedidos
5. Gestionar disponibilidad

## 🌍 Preparación para World ID

La aplicación está estructurada para integrar World ID en el futuro:
- Campo `verificationStatus` en usuarios
- Abstracción de autenticación
- UI preparada para badges de verificación
- No se muestra verificación activa hasta implementación real

## 📱 Características

- ✅ Autenticación con email/password
- ✅ Roles de usuario (cliente/trabajador)
- ✅ Perfiles de trabajador con oficios y zonas
- ✅ Publicación de pedidos de trabajo
- ✅ Sistema de postulaciones
- ✅ Filtros por oficio, zona y disponibilidad
- ✅ Contacto directo por WhatsApp
- ✅ UI mobile-first
- ✅ Español argentino
- ✅ Diseño moderno y limpio

## 🔄 Próximos pasos (post-MVP)

- [ ] Integración con World ID
- [ ] Sistema de reseñas completo
- [ ] Chat in-app
- [ ] Más oficios
- [ ] Expansión a más ciudades
- [ ] Notificaciones push
- [ ] Fotos de perfil
- [ ] Portfolio de trabajos

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

## 🤝 Contribución

Este es un proyecto MVP cerrado. Para consultas, contactar al equipo de desarrollo.

---

**Desarrollado para el ecosistema World App 🌍**
