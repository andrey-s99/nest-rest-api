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
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticlesService } from './arcticles.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { GetArticlesDto } from './dtos/get-articles.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('api/articles')
export class ArcticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async getArticles(@Query() query: GetArticlesDto) {
    return await this.articlesService.getArticles(query);
  }

  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async createArticle(
    @User() user: AuthenticatedUser,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return await this.articlesService.createArticle(user.id, createArticleDto);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch()
  async updateArticle(
    @User() user: AuthenticatedUser,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articlesService.updateArticle(user.id, updateArticleDto);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteArticle(
    @User() user: AuthenticatedUser,
    @Body('articleId') articleId: string,
  ) {
    return await this.articlesService.deleteArticle(
      user.id,
      parseInt(articleId),
    );
  }
}
