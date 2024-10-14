import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articlesRepository: Repository<ArticleEntity>,
  ) {}

  async getArticles() {
    return await this.articlesRepository.find();
  }

  async createArticle(userId: number, createArticleDto: CreateArticleDto) {
    console.log(`User ID: ${userId}`);
    const newArticle = new ArticleEntity();
    newArticle.name = createArticleDto.name;
    newArticle.description = createArticleDto.description;
    newArticle.publishDate = new Date();

    newArticle.authorId = userId;

    await this.articlesRepository.insert(newArticle);
    return newArticle;
  }
}
