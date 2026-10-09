'use client'

import { Button } from "@heroui/react";

export default function Home() {
  return (
    // 2. Usamos clases de Tailwind para centrar todo en la pantalla completa (min-h-screen)
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Frontend de Solvy Listo</h1>
      
      {/* 3. Nuestro botón ya viene con animaciones, colores y accesibilidad */}
      <Button color="primary" size="lg">
        Botón de Prueba HeroUI
      </Button>
    </main>
  );
}