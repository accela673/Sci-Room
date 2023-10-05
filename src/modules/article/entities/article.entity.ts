import { BaseEntity } from 'src/base/base.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ArticleEntity extends BaseEntity {
  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(() => UserEntity, (user) => user.articles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;
}
