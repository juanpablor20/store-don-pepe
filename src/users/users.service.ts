import { ConflictException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient, User } from '@prisma/client';
import { PaginationDto } from 'src/core';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {



  private readonly logger = new Logger('userService');
  constructor() {
    super();
  }
  
    
  
     async onModuleInit() {
         
      await this.$connect();
      this.logger.log('database connecttion  initializado');
     }



    
    async create(createUserDto: CreateUserDto) {
      const existeUsuario = await this.user.findUnique({
        where: {email: createUserDto.email},
     } );
     if(existeUsuario){
      return new ConflictException('el correo ya esta en uso');
     }
      return await this.user.create({
        data: {
          name: createUserDto.name,
          last_name: createUserDto.last_name,
          noDocument: createUserDto.noDocument,
          email: createUserDto.email,
          telephone: createUserDto.telephone,
          rol: createUserDto.rol,
          password: await bcrypt.hash(createUserDto.password, 10),
          
        },
      });
    }


  async findByEmail(email: string): Promise<User | null> {
    return this.user.findUnique({
      where: { email },
    });
  }
 
  
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalItems = await this.user.count();
    const lastPage = Math.ceil(totalItems / limit);
  
    return {
      data: await this.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        total: totalItems,
        page: page,
        lastPage: lastPage,
      },
    };
  }
  async findOne(id: number) {
    const user = await this.user.findUnique({
      where: { id },
    });
  
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Verifica si el usuario existe
    await this.findOne(id); // Si no existe, findOne lanzará una excepción
  
    // Actualiza el usuario
    return this.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

 


  async remove(id: number) {
 
    await this.findOne(id);
    const user = this.user.update({
      where: { id },
      data: {
        avalable: false,
      },
    });
    return user;
  }
}
