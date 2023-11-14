import { BaseEntity } from 'src/base/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ArticleEntity extends BaseEntity {
  @Column({ nullable: true })
  fileUrl: null | string;

  // @Column({ nullable: true })
  // txtFile: string;

  // @Column({ nullable: true })
  // pdfFile: string;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  coauthors: null | string;

  @ManyToOne(() => UserEntity, (user) => user.articles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.article)
  category: CategoryEntity;
}
