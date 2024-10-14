import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ArcticlesModule } from './articles/arcticles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), // Load env variables
    DatabaseModule,
    AuthModule,
    ArcticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
