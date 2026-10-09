import { Injectable, Inject } from '@nestjs/common';
import { Service } from '../../domain/entities/service.entity';
import type { ServiceRepository } from '../../domain/repositories/service.repository';

@Injectable()
export class GetAllServicesUseCase {
    constructor(
        @Inject('ServiceRepository')
        private readonly serviceRepository: ServiceRepository
    ) { }

    public async execute(): Promise<Service[]> {
        return await this.serviceRepository.findAll();
    }
}