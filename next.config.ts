import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permitir acceso desde la red local (móvil en LAN) durante desarrollo.
  // Next.js 16 bloquea por defecto las peticiones cross-origin en dev.
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.*",
    "10.0.0.*",
    "0.0.0.0",
    "*",
  ],
  // Desactivar la optimización de imágenes en dev para evitar problemas con
  // la API /_next/image cuando se sirven imágenes locales (especialmente
  // desde móvil en la red local). En producción se vuelve a activar.
  images: {
    unoptimized: process.env.NODE_ENV !== "production",
    localPatterns: [
      { pathname: "/images/**", search: "" },
    ],
  },
};

export default nextConfig;
