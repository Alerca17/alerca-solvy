'use client';

import { ServiceForm } from "@/components/ServiceForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Solvy - Gestión de Servicios</h1>
        <p className="text-default-500 mt-2">Prueba técnica Frontend (Arquitectura por Capas)</p>
      </div>

      {/* Renderizamos nuestro formulario validado por Zod */}
      <ServiceForm />
    </main>
  );
}