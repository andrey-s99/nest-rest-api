import { ArticleEntity } from '../article.entity';

export class ReturnArticlesDto {
  constructor(
    public data: ArticleEntity[],
    public count: number,
    public page: number,
    public limit: number,
  ) {}
}
