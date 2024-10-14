import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { ArcticlesController } from './arcticles.controller';
import { ArticlesService } from './arcticles.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArcticlesController],
  providers: [ArticlesService, JwtStrategy],
})
export class ArcticlesModule {}
