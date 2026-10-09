'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServiceSchema, CreateServiceInput } from "@/domain/service.schema";
import { serviceAdapter } from "@/adapters/service.adapter";
import { Button, Input, Textarea } from "@heroui/react";
import { useState } from "react";
import { useServices } from "@/context/ServiceContext";

export function ServiceForm() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const { refreshServices } = useServices();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateServiceInput>({
        resolver: zodResolver(createServiceSchema),
    });

    const onSubmit = async (data: CreateServiceInput) => {
        try {
            setLoading(true);
            setSuccessMessage("");

            await serviceAdapter.createService(data);
            await refreshServices();
            
            setSuccessMessage("¡Servicio creado exitosamente!");
            reset(); // Limpia el formulario
        } catch (error) {
            console.error("Error al enviar el servicio:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-4 p-6 bg-default-50 rounded-large shadow-medium">
            <h2 className="text-2xl font-bold text-center mb-2">Crear Nuevo Servicio</h2>

            <Input
                label="Título del Servicio"
                placeholder="Ej: Desarrollo Backend"
                variant="bordered"
                {...register("title")}
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
            />

            <Textarea
                label="Descripción"
                placeholder="Describe detalladamente el servicio..."
                variant="bordered"
                {...register("description")}
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
            />

            <Button color="primary" type="submit" isLoading={loading} size="lg">
                Guardar Servicio
            </Button>

            {successMessage && (
                <p className="text-success text-center font-medium mt-2">{successMessage}</p>
            )}
        </form>
    );
}