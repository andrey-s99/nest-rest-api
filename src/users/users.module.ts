import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity])],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
