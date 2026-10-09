import { CreateServiceInput } from "@/domain/service.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const serviceAdapter = {
  // 1. Obtener todos los servicios
  async getServices() {
    try {
      
      const res = await fetch(`${API_URL}/services`);
      
      if (!res.ok) {
        throw new Error(`Error al obtener los servicios: ${res.statusText}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error("Adapter Error (getServices):", error);
      throw error;
    }
  },

  // Obtener un servicio por su ID
  async getServiceById(id: string | number) {
    try {

      const res = await fetch(`${API_URL}/services/${id}`);
      
      if (!res.ok) {
        throw new Error(`Servicio con ID ${id} no encontrado`);
      }

      return await res.json();
    } catch (error) {
      console.error(`Adapter Error (getServiceById - ${id}):`, error);
      throw error;
    }
  },

  // 3. Crear un nuevo servicio 
  async createService(data: CreateServiceInput) {
    try {
      const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al crear el servicio: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Adapter Error (createService):", error);
      throw error;
    }
  },
};