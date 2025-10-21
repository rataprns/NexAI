# NexAI: Modular Starter for AI-Powered Applications with Next.js

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rataprns/NexAI.git)

NexAI is a modern and modular template for building applications with Next.js, TypeScript, MongoDB, and Genkit. Designed under the principles of Clean Architecture and Domain-Driven Design (DDD), NexAI provides a solid foundation for creating intelligent SaaS, scheduling platforms, or AI-driven web applications.

It includes an AI-powered chatbot with tools, a complete scheduling system, an administrative dashboard, and a visual landing page editor, all ready to use and customize out of the box.

[Leer en Español](./README.es.md)

## ✨ Key Features

- **🧩 Modular and Clean Architecture:** Based on Clean Architecture and DDD principles for maximum scalability and maintainability.
- **⚛️ Modern Stack:** Next.js 15 (App Router), React Server Components, TypeScript, and Tailwind CSS.
- **🤖 Integrated AI Chatbot:** Powered by Genkit and Google's Gemini model, with action tools to schedule, check, cancel, and rebook appointments.
- **📊 Advanced Analytics Dashboard:** Go beyond simple message counts. Automatically classify user intent (e.g., booking, inquiry, complaint), analyze sentiment and urgency, and audit bot performance by tracking the success and failure of every AI-driven action.
- **📅 Smart Scheduling System:** Complete appointment management with authentication via "secret words"—ideal for automated assistants without logins.
- **🔐 Secure Authentication:** JWT-based with protected sessions and a pre-configured admin panel.
- **🧱 Dynamic Landing Page Editor:** Visual interface to edit, reorder, and customize sections, texts, images, and themes.
- **🗣️ Internationalization (i18n):** Spanish and English included by default.
- **💬 AI Server Integration:** Ready-to-run configuration with Genkit in parallel with the frontend.

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file. Copy the contents of `.env.example` into a new file named `.env` and replace the placeholder values.

```bash
# MongoDB Connection String
MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>

# JWT Secret for session authentication
# Generate a strong secret with: openssl rand -base64 32
JWT_SECRET=<YOUR_JWT_SECRET>

# Google AI Studio API Key for Gemini
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>

# Public app name
NEXT_PUBLIC_APP_NAME="NexAI"

# Nodemailer SMTP Configuration for sending emails
EMAIL_HOST=<YOUR_SMTP_HOST>
EMAIL_PORT=<YOUR_SMTP_PORT>
EMAIL_USER=<YOUR_SMTP_USER>
EMAIL_PASS=<YOUR_SMTP_PASSWORD>
EMAIL_SECURE=false # true for SSL (port 465), false for TLS (port 587)
FROM_EMAIL="Your App <your-email@example.com>" # "From" email address for sent emails
```

## 🚀 Ideal For

- Developers looking to quickly launch a SaaS with integrated AI.
- Teams wanting to prototype functional conversational assistants with a modular backend.
- Projects that require automated scheduling and actionable chatbots.
- Foundations for internal startup frameworks or advanced open-source projects.
