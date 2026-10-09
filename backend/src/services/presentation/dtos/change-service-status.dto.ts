import { IsEnum, IsNotEmpty } from 'class-validator';
import { ServiceStatus } from '../../domain/enums/service-status.enum';



export class ChangeServiceStatusDto {
  @IsEnum(ServiceStatus, { message: 'El estado enviado no es válido' })
  @IsNotEmpty({ message: 'El estado no puede estar vacío' })
  public status: ServiceStatus;
}