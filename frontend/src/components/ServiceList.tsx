'use client';

import { useServices } from "@/context/ServiceContext";
import { Card, CardHeader, CardBody, CardFooter, Divider, Spinner, Chip, Button } from "@heroui/react";
import { serviceAdapter } from "@/adapters/service.adapter";
import { ServiceStatus } from "@/domain/service.schema";
import { useState } from "react";

export function ServiceList() {
    const { services, loadingServices, refreshServices } = useServices();

    const [updatingId, setUpdatingId] = useState<string | number | null>(null);

    const getNextStatusInfo = (currentStatus: ServiceStatus) => {
        if (currentStatus === "PENDING") {
            return { next: "IN_PROGRESS" as ServiceStatus, label: "Iniciar Servicio", color: "primary" };
        }
        if (currentStatus === "IN_PROGRESS") {
            return { next: "COMPLETED" as ServiceStatus, label: "Completar Servicio", color: "success" };
        }
        return null;
    };

    const handleStatusChange = async (id: string | number, nextStatus: ServiceStatus) => {
        try {
            setUpdatingId(id);

            await serviceAdapter.updateServiceStatus(id, { status: nextStatus });
            await refreshServices();

        } catch (error) {
            console.error("Error al actualizar estado:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    if (loadingServices) {
        return (
            <div className="flex justify-center p-10">
                <Spinner size="lg" label="Cargando servicios..." />
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <p className="text-center text-default-500 mt-10">
                No hay servicios registrados aún. Ve a la pestaña "Crear" para añadir uno.
            </p>
        );
    }

    const statusColorMap: Record<ServiceStatus, "warning" | "primary" | "success"> = {
        PENDING: "warning",     // Amarillo
        IN_PROGRESS: "primary", // Azul
        COMPLETED: "success",   // Verde
    };

    return (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            {services.map((service) => {
                const nextStatusInfo = getNextStatusInfo(service.status);

                return (
                    <Card key={service.id} className="w-full shadow-md border border-default-200">
                        <CardHeader className="flex gap-3 justify-between">
                            <div className="flex flex-col">
                                <p className="text-lg font-bold">{service.title}</p>
                                <p className="text-small text-default-500">ID: {service.id}</p>
                            </div>
                            <Chip color={statusColorMap[service.status]} variant="flat" size="sm">
                                {service.status}
                            </Chip>
                        </CardHeader>

                        <Divider />

                        <CardBody>
                            <p className="text-default-700">{service.description}</p>
                        </CardBody>

                        <Divider />

                        <CardFooter className="flex justify-end">
                            {nextStatusInfo ? (

                                <Button
                                    color={nextStatusInfo.color as any}
                                    variant="flat"
                                    isLoading={updatingId === service.id}
                                    onClick={() => handleStatusChange(service.id, nextStatusInfo.next)}
                                >
                                    {nextStatusInfo.label}
                                </Button>
                            ) : (
                                <p className="text-sm text-success font-semibold">Servicio Finalizado</p>
                            )}
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}