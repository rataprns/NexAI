# NexAI — Starter Modular para Aplicaciones con IA y Next.js

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rataprns/NexAI.git)

NexAI es una plantilla moderna y modular para construir aplicaciones con Next.js, TypeScript, MongoDB y Genkit. Diseñada bajo principios de Clean Architecture y Domain-Driven Design (DDD), NexAI proporciona una base sólida para crear SaaS inteligentes, plataformas de agendamiento o aplicaciones web impulsadas por IA.

Incluye de fábrica un chatbot con herramientas de IA, un sistema de agendamiento completo, un panel administrativo y un editor visual de landing page, todo listo para usar y personalizar.

[Read in English](./README.md)

## ✨ Características Principales

- **🧩 Arquitectura Modular y Limpia:** Basada en principios de Clean Architecture y DDD para máxima escalabilidad y mantenibilidad.
- **⚛️ Stack Moderno:** Next.js 15 (App Router), React Server Components, TypeScript y Tailwind CSS.
- **🤖 Chatbot con IA Integrada:** Potenciado por Genkit y el modelo Gemini de Google, con herramientas de acción (tools) para agendar, consultar, cancelar y reagendar citas.
- **📊 Panel de Analíticas Avanzadas:** Ve más allá del simple conteo de mensajes. Clasifica automáticamente la intención del usuario (ej. agendar, consultar, queja), analiza el sentimiento y la urgencia, y audita el rendimiento del bot rastreando el éxito y fracaso de cada acción impulsada por la IA.
- **📅 Sistema de Agendamiento Inteligente:** Gestión completa de citas con autenticación mediante “palabras secretas” — ideal para asistentes automatizados sin login.
- **🔐 Autenticación Segura:** Basada en JWT con sesiones protegidas y panel de administración preconfigurado.
- **🧱 Editor Dinámico de Landing Page:** Interfaz visual para editar, reordenar y personalizar secciones, textos, imágenes y temas.
- **🗣️ Internacionalización (i18n):** Español e inglés incluidos por defecto.
- **💬 Integración con Servidor de IA:** Configuración lista para correr con Genkit en paralelo al frontend.

## ⚙️ Variables de Entorno

Para ejecutar este proyecto, necesitarás añadir las siguientes variables de entorno a tu archivo `.env`. Copia el contenido de `.env.example` a un nuevo archivo llamado `.env` y reemplaza los valores de ejemplo.

```bash
# Cadena de conexión de MongoDB
MONGODB_URI=<TU_CADENA_DE_CONEXION_MONGODB>

# Secreto de JWT para la autenticación de sesiones
# Genera un secreto seguro con: openssl rand -base64 32
JWT_SECRET=<TU_SECRETO_JWT>

# Clave de API de Google AI Studio para Gemini
GEMINI_API_KEY=<TU_API_KEY_DE_GEMINI>

# Nombre público de la aplicación
NEXT_PUBLIC_APP_NAME="NexAI"

# Configuración de Nodemailer SMTP para el envío de correos
EMAIL_HOST=<TU_HOST_SMTP>
EMAIL_PORT=<TU_PUERTO_SMTP>
EMAIL_USER=<TU_USUARIO_SMTP>
EMAIL_PASS=<TU_CONTRASENA_SMTP>
EMAIL_SECURE=false # true para SSL (puerto 465), false para TLS (puerto 587)
PRAVI_FROM_EMAIL="Tu App <tu-email@example.com>" # Email "Desde" para los correos enviados
```

## 🚀 Ideal para

- Desarrolladores que buscan iniciar rápido un SaaS con IA integrada.
- Equipos que desean prototipar asistentes conversacionales funcionales con backend modular.
- Proyectos que necesiten agendamiento automatizado y chatbots accionables.
- Bases para frameworks internos de startups o proyectos open source avanzados.
