import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/user.entity';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ArticleEntity } from '../articles/article.entity';

config();

const configService = new ConfigService();

// DataSource config to run migrations
export default new DataSource({
  type: `postgres`,
  host: 'localhost',
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  entities: [UserEntity, ArticleEntity],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
