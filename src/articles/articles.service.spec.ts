import { Repository } from 'typeorm';
import { ArticlesService } from './articles.service';
import { ArticleEntity } from './article.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { GetArticlesDto } from './dtos/get-articles.dto';
import { ReturnArticlesDto } from './dtos/return-articles.dto';
import { CacheModule } from '@nestjs/cache-manager';

describe('ArticlesService', () => {
  let articleService: ArticlesService;
  let articlesRepository: Repository<ArticleEntity>;
  let usersRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:', // Use in-memory db for effecient tests
          entities: [ArticleEntity, UserEntity],
          synchronize: true,
        }),
        CacheModule.register(),
        TypeOrmModule.forFeature([ArticleEntity, UserEntity]),
      ],
      providers: [ArticlesService],
    }).compile();

    articleService = moduleRef.get(ArticlesService);
    articlesRepository = moduleRef.get(getRepositoryToken(ArticleEntity));
    usersRepository = moduleRef.get(getRepositoryToken(UserEntity));
  });

  // Clean the db after each test
  afterEach(async () => {
    await articlesRepository.query('DELETE FROM articles');
    await usersRepository.query('DELETE FROM users');
  });

  describe('getArticles', () => {
    it('Should return articles with the correct author and cache the results', async () => {
      // Insert mock user
      const testUser = usersRepository.create({
        username: 'testuser',
        password: 'password',
      });
      await usersRepository.save(testUser);

      // Insert article associated with the user
      const testArticle = articlesRepository.create({
        name: 'Test Article',
        description: 'Test Description',
        publishDate: new Date(),
        authorId: testUser.id,
      });
      await articlesRepository.save(testArticle);

      // Mock user request query params
      const queryDto: GetArticlesDto = {
        author: testUser.username,
        page: 1,
        limit: 5,
      };

      const result = await articleService.getArticles(queryDto);

      expect(result).toBeInstanceOf(ReturnArticlesDto);
      expect(result.count).toEqual(1);
      expect(result.data[0].name).toEqual(testArticle.name);
      expect(result.data[0].author.username).toEqual(testUser.username);
    });
  });
});
