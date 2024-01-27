import { BaseEntity } from 'src/base/base.entity';
import { ArticleEntity } from 'src/modules/article/entities/article.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class CommentEntity extends BaseEntity {
  @Column()
  text: string;

  @ManyToOne(() => ArticleEntity, (article) => article.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;
}
