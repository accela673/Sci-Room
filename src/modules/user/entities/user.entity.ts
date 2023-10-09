import { BaseEntity } from 'src/base/base.entity';
import { ArticleEntity } from 'src/modules/article/entities/article.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  confirmCodeId: number;

  @Column({ nullable: true })
  passwordRecoveryCodeId: number;

  @Column({ default: false })
  isConfirmed: boolean;

  @OneToMany(() => ArticleEntity, (article) => article.user, { cascade: true })
  articles: ArticleEntity[];
}
