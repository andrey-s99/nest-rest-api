import { UserEntity } from '../users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('articles')
export class ArcticleEntity {
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
  author: UserEntity;
}
