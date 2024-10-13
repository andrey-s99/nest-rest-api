import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
    constructor (
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        // Hash user password
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);

        // Create a new user entity for the db
        const userEntity = this.usersRepository.create(
            {
                username: createUserDto.username,
                password: hashedPassword
            }
        );

        // Add new user entity to the db
        // insert method is used for effeciency and simplicity
        await this.usersRepository.insert(userEntity);

        return userEntity;
    }
}