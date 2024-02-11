import { BaseEntity } from 'src/base/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { CommentEntity } from 'src/modules/comment/entites/comment.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { StatusEnum } from '../enums/status.enum';

@Entity()
export class ArticleEntity extends BaseEntity {
  @Column({ nullable: true })
  fileUrl: null | string;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.PENDING,
  })
  status: StatusEnum;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  coauthors: null | string;

  @Column({ nullable: true })
  pageCount: number;

  @Column({ nullable: true })
  coauthorsEmails: null | string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true, default: null })
  edition: number;

  @Column({ nullable: true, default: null })
  volume: number;

  @Column({ nullable: true, default: null })
  authorName: string;

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
