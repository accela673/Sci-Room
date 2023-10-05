import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  confirmCode: string;

  @CreateDateColumn()
  createdAt: Date;
}
