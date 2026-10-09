'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { serviceAdapter } from "@/adapters/service.adapter";
import { ServiceStatus } from "@/domain/service.schema";


export interface Service {
    id: string | number;
    title: string;
    description: string;
    status: ServiceStatus;
}

interface ServiceContextType {
    services: Service[];
    loadingServices: boolean;
    refreshServices: () => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
    const [services, setServices] = useState<Service[]>([]);
    const [loadingServices, setLoadingServices] = useState(true);

    // Función para ir a buscar los datos al backend a través del adaptador
    const refreshServices = async () => {
        try {
            setLoadingServices(true);
            const data = await serviceAdapter.getServices();
            setServices(data);
        } catch (error) {
            console.error("Error en Context al cargar servicios:", error);
        } finally {
            setLoadingServices(false);
        }
    };

    useEffect(() => {
        refreshServices();
    }, []);

    return (
        <ServiceContext.Provider value={{ services, loadingServices, refreshServices }}>
            {children}
        </ServiceContext.Provider>
    );
}
export function useServices() {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error("useServices debe usarse estrictamente dentro de un ServiceProvider");
    }
    return context;
}