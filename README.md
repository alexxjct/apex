# Apex — Aplicación web de ejemplo

## Descripción

Apex es una aplicación web construida con Next.js que implementa autenticación con JWT, roles de usuario (user/admin) y revocación de tokens para logout seguro. El proyecto está orientado a la gestión de usuarios y acceso a un dashboard protegido.

---

## Tecnologías usadas

- Frontend y backend: Next.js (React + API Routes)  
- Base de datos: MongoDB Atlas  
- Autenticación: JWT (jsonwebtoken)  
- Hash de contraseñas: bcrypt  
- Gestión de procesos: PM2 (para producción)  
- Estilos: CSS nativo / Tailwind (según implementación)  

---

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/tu_repositorio.git
   cd tu_repositorio

    Instalar dependencias:

    bash

    Copy
    npm install

    Crear archivo .env.local en la raíz con las variables:

    MONGODB_URI=tu_mongodb_uri
    JWT_SECRET=tu_secreto_jwt_seguro
    ADMIN_CREATE_KEY=clave_para_crear_admin
    PORT=3000

Cómo correr la aplicación
npm run dev

Luego abrir en el navegador: http://localhost:3000

En producción (usando PM2):
pm2 start npm --name "apex" -- run start
pm2 save
pm2 startup

Cómo actualizar el proyecto
git pull origin main

Instalar nuevas dependencias (si las hay):
npm install

Reiniciar la aplicación (si usas PM2):
pm2 restart apex
