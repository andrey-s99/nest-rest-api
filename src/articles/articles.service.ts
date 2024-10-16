import {
  Inject,
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
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ReturnArticlesDto } from './dtos/return-articles.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articlesRepository: Repository<ArticleEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getArticles(query: GetArticlesDto): Promise<ReturnArticlesDto> {
    // Destructure optional filters
    const { author, startDate, endDate, page, limit } = query;

    // Create query builder
    const qb = this.articlesRepository
      .createQueryBuilder('article')
      .leftJoin('article.author', 'users'); // Join with users table

    // Apply filters if exist
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

    // Fetch data from bd
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

    const returnArticlesDto = new ReturnArticlesDto(
      articles,
      total,
      page,
      limit,
    );

    // Cache the response
    await this.cacheManager.set('cached-response', returnArticlesDto);

    return returnArticlesDto;
  }

  async createArticle(userId: number, createArticleDto: CreateArticleDto) {
    // Create new article entity
    const newArticle = new ArticleEntity();
    newArticle.name = createArticleDto.name;
    newArticle.description = createArticleDto.description;
    newArticle.publishDate = new Date();

    // Assign user making a request as author
    newArticle.authorId = userId;

    // Insert article to db
    await this.articlesRepository.insert(newArticle);

    return newArticle;
  }

  async updateArticle(userId: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.validateArticle(userId, updateArticleDto.id);

    // Invalidate cache
    await this.cacheManager.reset();

    // Update description
    return await this.articlesRepository.save({
      ...article,
      description: updateArticleDto.newDescription,
    });
  }

  async deleteArticle(userId: number, articleId: number) {
    await this.validateArticle(userId, articleId);

    // Delete article from db
    await this.articlesRepository.delete(articleId);
    // Invalidate cache
    await this.cacheManager.reset();
  }

  // Validate article existence and user ownership
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
