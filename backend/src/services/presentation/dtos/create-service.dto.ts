import { IsString, IsNotEmpty } from 'class-validator';

export class CreateServiceDto {
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  public title: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  public description: string;
}