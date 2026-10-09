import { Injectable, Inject } from '@nestjs/common';
import { Service } from '../../domain/entities/service.entity';
import { ServiceStatus } from '../../domain/enums/service-status.enum';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateServiceUseCase {
    constructor(
        @Inject('ServiceRepository')
        private readonly serviceRepository: ServiceRepository
    ) { }

    public async execute(title: string, description: string): Promise<Service> {

        //Creacion de un servicio
        const newService = new Service(
            randomUUID(),
            title,
            description,
            ServiceStatus.PENDING,
            new Date()
        );

        //Conexion con el repositorio para guardar el servicio
        await this.serviceRepository.save(newService);

        //Retorno del servicio creado
        return newService;
    }
}