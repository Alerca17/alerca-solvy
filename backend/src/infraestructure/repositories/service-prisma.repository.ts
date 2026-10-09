import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { ServiceRepository } from '../../services/domain/repositories/service.repository';
import { Service } from '../../services/domain/entities/service.entity';
import { ServiceStatus } from '../../services/domain/enums/service-status.enum';


@Injectable()
export class ServicePrismaRepository implements ServiceRepository {

    //Cliente de prisma
    private prisma = new PrismaClient();

    //Guardar o actualizar un servicio
    public async save(service: Service): Promise<void> {

        await this.prisma.service.upsert({
            where: { id: service.id },
            update: {
                title: service.title,
                description: service.description,
                status: service.status,
            },
            create: {
                id: service.id,
                title: service.title,
                description: service.description,
                status: service.status,
                createdAt: service.createdAt,
            },
        });
    }

    //Buscar un servicio por su id
    public async findById(id: string): Promise<Service | null> {

        const rawData = await this.prisma.service.findUnique({
            where: { id: id },

        });

        if (!rawData) {
            return null;
        }
        return this.mapToDomain(rawData);
    }

    //Traer todos los servicios
    public async findAll(): Promise<Service[]> {

        const rawServices = await this.prisma.service.findMany();
        return rawServices.map((raw) => this.mapToDomain(raw));
    }

    // Método privado para mapear los datos crudos de la base de datos a la entidad de dominio Service
    private mapToDomain(raw: any): Service {
        return new Service(
            raw.id,
            raw.title,
            raw.description,
            raw.status as ServiceStatus, //Validamoos el estado del servicio
            raw.createdAt
        );
    }
}
