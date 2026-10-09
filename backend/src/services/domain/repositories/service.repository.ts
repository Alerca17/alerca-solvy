import { Service } from '../entities/service.entity';

export interface ServiceRepository {
    save(service: Service): Promise<void>;
    findById(id: string): Promise<Service | null>;
    findAll(): Promise<Service[]>;
}