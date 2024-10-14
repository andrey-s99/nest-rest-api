import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticlesService } from './arcticles.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { CreateArticleDto } from './dtos/create-article.dto';

@Controller('api/articles')
export class ArcticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @HttpCode(200)
  @Get()
  async getArticles(@Query() params: any) {
    return await this.articlesService.getArticles();
  }

  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async createArticle(
    @User() user: AuthenticatedUser,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return await this.articlesService.createArticle(user.id, createArticleDto);
  }
}
