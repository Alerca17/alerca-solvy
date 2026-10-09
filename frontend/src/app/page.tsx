'use client';

import { Tabs, Tab } from "@heroui/react";
import { ServiceForm } from "@/components/ServiceForm";
import { ServiceList } from "@/components/ServiceList";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-4 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Solvy - Gestión de Servicios</h1>
        <p className="text-default-500 mt-2">Prueba técnica Frontend (Arquitectura por Capas)</p>
      </div>

      <div className="w-full max-w-lg flex flex-col">
        <Tabs
          aria-label="Opciones de navegación"
          color="primary"
          variant="bordered"
          fullWidth
        >

          <Tab key="list" title="Ver Servicios">
            <div className="w-full pt-6 flex justify-center">
              <ServiceList />
            </div>
          </Tab>

          <Tab key="create" title="Crear Nuevo Servicio">
            <div className="w-full pt-6 flex justify-center">
              <ServiceForm />
            </div>
          </Tab>

        </Tabs>
      </div>
    </main>
  );
}