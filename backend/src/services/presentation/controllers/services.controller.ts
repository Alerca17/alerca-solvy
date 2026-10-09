import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { CreateServiceUseCase } from '../../application/use-cases/create-service.use-case';
import { GetAllServicesUseCase } from '../../application/use-cases/get-all-services.use-case';
import { CreateServiceDto } from '../dtos/create-service.dto';
import { ChangeServiceStatusDto } from '../dtos/change-service-status.dto';
import { ChangeServiceStatusUseCase } from '../../application/use-cases/change-service-status.use-case.ts';


@Controller('services')
export class ServicesController {
    constructor(
        private readonly createServiceUseCase: CreateServiceUseCase,
        private readonly getAllServicesUseCase: GetAllServicesUseCase,
        private readonly changeServiceStatusUseCase: ChangeServiceStatusUseCase
    ) {}

    @Post()
    public async createService(@Body() dto: CreateServiceDto) {
        return await this.createServiceUseCase.execute(dto.title, dto.description);
    }

    @Get()
    public async getAllServices() {
        return await this.getAllServicesUseCase.execute();
    }

    @Patch(':id/status')
    public async changeServiceStatus(
        @Param('id') id: string,
        @Body() dto: ChangeServiceStatusDto
    ) {
        return await this.changeServiceStatusUseCase.execute(id, dto.status);
    }
}
