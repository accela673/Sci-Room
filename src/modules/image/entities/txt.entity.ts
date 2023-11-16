import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class DocX extends BaseEntity {
  @Column()
  url: string;

  @Column()
  publicId: string;
}
