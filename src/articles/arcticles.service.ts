import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

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
    const newArticle = new ArticleEntity();
    newArticle.name = createArticleDto.name;
    newArticle.description = createArticleDto.description;
    newArticle.publishDate = new Date();

    newArticle.authorId = userId;

    await this.articlesRepository.insert(newArticle);
    return newArticle;
  }

  async updateArticle(userId: number, updateArticleDto: UpdateArticleDto) {
    // Check if the article exists
    const article = await this.articlesRepository.findOneBy({ id: updateArticleDto.id });
    if (!article) {
      throw new NotFoundException('Article does not exist.');
    }

    // Check if the user is the author
    if (article.authorId !== userId) {
      throw new UnauthorizedException('Article belongs to a different user.');
    }

    return await this.articlesRepository.save({
      ...article,
      description: updateArticleDto.newDescription
    });
  }
}
