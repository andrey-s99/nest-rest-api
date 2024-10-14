import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/user.entity';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: `postgres`,
  host: 'localhost',
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  entities: [UserEntity],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
