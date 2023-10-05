import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseDto } from './dto/base.dto.';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  absorbFromDto(dto: BaseDto) {
    dto.getKeys().forEach((key: string) => {
      this[key] = dto[key];
    });
    return this;
  }

  toDto<T extends BaseDto>(dto: T): T {
    this.getKeys().forEach((key: string) => {
      dto[key] = this[key];
    });
    return dto;
  }

  private getKeys() {
    return Object.keys(this);
  }
}
