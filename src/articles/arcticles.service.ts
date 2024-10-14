import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { GetArticlesDto } from './dtos/get-articles.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articlesRepository: Repository<ArticleEntity>,
  ) {}

  async getArticles(query: GetArticlesDto) {
    const { author, startDate, endDate, page, limit } = query;

    const qb = this.articlesRepository
      .createQueryBuilder('article')
      .leftJoin('article.author', 'users'); // Join with users table

    if (author) {
      qb.andWhere('users.username = :author', { author });
    }

    if (startDate) {
      qb.andWhere('article.publishDate >= :startDate', { startDate });
    }

    if (endDate) {
      qb.andWhere('article.publishDate <= :endDate', { endDate });
    }

    const skip = (page - 1) * limit;

    const [articles, total] = await qb
      .select([
        'article.id',
        'article.name',
        'article.description',
        'article.publishDate',
        'users.username',
      ])
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: articles,
      count: total,
      page,
      limit,
    };
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
    const article = await this.validateArticle(userId, updateArticleDto.id);

    return await this.articlesRepository.save({
      ...article,
      description: updateArticleDto.newDescription,
    });
  }

  async deleteArticle(userId: number, articleId: number) {
    await this.validateArticle(userId, articleId);
    await this.articlesRepository.delete(articleId);
  }

  // Make sure article exists and belongs to user making the request
  private async validateArticle(
    userId: number,
    articleId: number,
  ): Promise<ArticleEntity> {
    const article = await this.articlesRepository.findOneBy({
      id: articleId,
    });

    if (!article) {
      throw new NotFoundException('Article does not exist.');
    }

    // Check if the user is the author
    if (article.authorId !== userId) {
      throw new UnauthorizedException('Article belongs to a different user.');
    }

    return article;
  }
}
