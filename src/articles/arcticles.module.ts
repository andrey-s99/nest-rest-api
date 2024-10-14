import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArcticleEntity } from './article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArcticleEntity])],
  controllers: [],
  providers: [],
})
export class ArcticlesModule {}
