import { IsString } from 'class-validator';
import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Image extends BaseEntity {
  @Column()
  @IsString()
  url: string;

  @Column()
  publicId: string;
}
