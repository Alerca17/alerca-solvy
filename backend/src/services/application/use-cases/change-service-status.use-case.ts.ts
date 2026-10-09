import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Service } from '../../domain/entities/service.entity';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceStatus } from '../../domain/enums/service-status.enum';

@Injectable()
export class ChangeServiceStatusUseCase {
    constructor(
        @Inject('ServiceRepository')
        private readonly serviceRepository: ServiceRepository
    ) { }

    public async execute(id: string, newStatus: ServiceStatus): Promise<Service> {

        //Buscar en la BD el servicio 
        const service = await this.serviceRepository.findById(id);

        //Si no existe, lanzar un error
        if (!service) {
            throw new NotFoundException(`El servicio con id ${id} no encontrado`);
        }

        //Cambiar el estado del servicio
        service.changeStatus(newStatus);

        //Guardar el servicio actualizado en la BD
        await this.serviceRepository.save(service);

        return service;
    }
}