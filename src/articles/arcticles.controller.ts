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
import { UpdateArticleDto } from './dtos/update-article.dto';

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
