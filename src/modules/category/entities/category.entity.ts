import { BaseEntity } from 'src/base/base.entity';
import { ArticleEntity } from 'src/modules/article/entities/article.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class CategoryEntity extends BaseEntity {
  @Column({
    unique: true,
    nullable: true,
  })
  name: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @OneToMany(() => ArticleEntity, (article) => article.category)
  article: ArticleEntity[];
}
