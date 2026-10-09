import { z } from "zod";

// Estados permitidos para un servicio (Enum de Dominio)
export const ServiceStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);
export type ServiceStatus = z.infer<typeof ServiceStatusEnum>;

//Validación para la creación
export const createServiceSchema = z.object({
  title: z.string().min(3, { message: "El título debe tener al menos 3 caracteres" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

//Validar estrictamente el cambio de estado
export const updateServiceStatusSchema = z.object({
  status: ServiceStatusEnum,
});

export type UpdateServiceStatusInput = z.infer<typeof updateServiceStatusSchema>;