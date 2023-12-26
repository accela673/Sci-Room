import { BaseEntity } from 'src/base/base.entity';
import { ArticleEntity } from 'src/modules/article/entities/article.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from '../enums/roles.enum';

@Entity()
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => ArticleEntity, (article) => article.user, { cascade: true })
  articles: ArticleEntity[];
}
