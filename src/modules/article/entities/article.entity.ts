import { BaseEntity } from 'src/base/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { CommentEntity } from 'src/modules/comment/entites/comment.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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

  @Column({ nullable: true, default: null })
  isApproved: boolean;

  @Column({ default: true })
  isPending: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  coauthors: null | string;

  @Column({ nullable: true })
  coauthorsEmails: null | string;

  @ManyToOne(() => UserEntity, (user) => user.articles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.article, {
    cascade: true,
  })
  comments: CommentEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.article)
  category: CategoryEntity;
}
