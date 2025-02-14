
import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/core';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit{

   private readonly logger = new Logger('ProductsService');
   constructor (){
    super();
   }

   async onModuleInit() {
       
    await this.$connect();
    this.logger.log('database connecttion  initializado');
   }
 

 create(createProductDto: CreateProductDto) {

  return this.products.create({
   data: createProductDto,
  });

 
  }


  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.products.count();
    const lastPage = Math.ceil(totalPages / limit);
    
    return {
      data: await this.products.findMany({
        skip: (page - 1) * limit,
        take: limit,
      
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }
 

  async findOne(id: number) {
    const product = await this.products.findUnique({
      where: { id }, 
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }


  async update(id: number, updateProductDto: UpdateProductDto) {
    // Verifica si el producto existe
    await this.findOne(id); // Si no existe, findOne lanzará una excepción
  
    // Actualiza el producto
    return this.products.update({
      where: { id }, // Filtra por ID
      data: updateProductDto, // Datos a actualizar
    });
  }

  async remove(id: number) {
    // Verifica si el producto existe
    await this.findOne(id); // Si no existe, findOne lanzará una excepción
  
    // Elimina el producto
    return this.products.delete({
      where: { id }, // Filtra por ID
    });
  }
}
