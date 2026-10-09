import { Module } from '@nestjs/common';
import { ServicesController } from './presentation/controllers/services.controller';
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case';
import { GetAllServicesUseCase } from './application/use-cases/get-all-services.use-case';
import { ChangeServiceStatusUseCase } from './application/use-cases/change-service-status.use-case.ts';
import { ServicePrismaRepository } from '../infraestructure/repositories/service-prisma.repository';
@Module({
  // Conexion para las peticiones web
  controllers: [ServicesController], 
  
  providers: [
    //Registramos a los Casos de Uso (dominio y reglas de negocio)
    CreateServiceUseCase,
    GetAllServicesUseCase,
    ChangeServiceStatusUseCase,
    
    {
      provide: 'ServiceRepository',
      useClass: ServicePrismaRepository, 
    },
  ],
})
export class ServicesModule {}