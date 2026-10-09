import { z } from "zod";

//Esquema para la creación de un servicio
export const createServiceSchema = z.object({
    title: z.string().min(3, { message: "El título debe tener al menos 3 caracteres" }),
    description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
});


export type CreateServiceInput = z.infer<typeof createServiceSchema>;