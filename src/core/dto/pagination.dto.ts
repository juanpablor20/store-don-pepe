import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number) // Transforma el valor a número
  
  limit: number = 10; // Valor por defecto: 10
}