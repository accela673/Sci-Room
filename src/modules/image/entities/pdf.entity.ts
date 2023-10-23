import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Pdf extends BaseEntity {
  @Column()
  url: string;

  @Column()
  publicId: string;
}
