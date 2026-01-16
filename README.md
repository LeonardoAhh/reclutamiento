# Viñoplastic - Plataforma de Reclutamiento

Portal de reclutamiento para Viñoplastic Inyección, desarrollado con React + Vite y Firebase.

## 🚀 Setup Rápido

### Requisitos
- Node.js 18+
- Cuenta Firebase con proyecto configurado

### Instalación Local

```bash
# Instalar dependencias
npm install

# Copiar archivo de entorno
cp .env.example .env

# Editar .env con tus credenciales de Firebase
# Luego ejecutar
npm run dev
```

## 🔐 Variables de Entorno

Crea un archivo `.env` con las siguientes variables:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

## 📦 Deploy en Vercel

1. **Conecta tu repositorio** a Vercel
2. **Configura las variables de entorno** en Vercel Dashboard:
   - Settings → Environment Variables
   - Agrega cada variable `VITE_FIREBASE_*`
3. **Deploy** automático en cada push

## 📁 Estructura

```
src/
├── firebase/config.js     # Configuración Firebase
├── services/              # Servicios de datos
├── pages/                 # Páginas de la app
│   ├── Landing.jsx        # Página de bienvenida
│   ├── Home.jsx           # Listado de vacantes
│   ├── ApplicationForm.jsx # Formulario postulación
│   ├── Login.jsx          # Login admin
│   ├── Admin.jsx          # Panel admin
│   └── admin/             # Secciones admin
└── index.css              # Estilos globales
```

## ⚠️ Importante

- **NUNCA** subas el archivo `.env` a GitHub
- Configura las variables de entorno directamente en Vercel para producción
