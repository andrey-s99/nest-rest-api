import { ArticleEntity } from '../articles/article.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // One user can have many articles
  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];
}
