import { UserEntity } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  publishDate: Date;

  // Many articles are authored by one user
  @ManyToOne(() => UserEntity, (user) => user.articles)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @Column()
  authorId: number;
}
