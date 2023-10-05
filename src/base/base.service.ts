import { Brackets, ObjectLiteral, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ListParamsDto } from './dto/list-params.dto';
import { ListDto } from './dto/list.dto';
import { BadRequestException } from '@nestjs/common';

export abstract class BaseService<T extends BaseEntity> {
  repository: Repository<T>;

  protected constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async list(listParamsDto: ListParamsDto) {
    const array = await this.repository
      .createQueryBuilder()
      .limit(listParamsDto.limit)
      .offset(listParamsDto.countOffset())
      .orderBy(listParamsDto.getOrderedField(), listParamsDto.order)
      .getMany();
    const itemsCount = await this.repository.createQueryBuilder().getCount();
    return new ListDto(array, {
      page: listParamsDto.page,
      itemsCount,
      limit: listParamsDto.limit,
      order: listParamsDto.order,
      orderField: listParamsDto.orderField,
    });
  }

  async listWithRelations(
    listParamsDto: ListParamsDto,
    entity: string,
    relations?: string[],
  ) {
    const query = this.repository
      .createQueryBuilder(entity)
      .where(`${entity}.isDeleted != true`);

    if (relations) {
      for (const relation of relations) {
        query.leftJoinAndSelect(`${entity}.${relation}`, `${relation}`);
      }
    }

    const array = await query
      .limit(listParamsDto.limit)
      .offset(listParamsDto.countOffset())
      .orderBy(
        `${entity}.${listParamsDto.getOrderedField()}`,
        listParamsDto.order,
      )
      .getMany();

    const itemsCount = await this.repository.createQueryBuilder().getCount();
    return new ListDto(array, {
      page: listParamsDto.page,
      itemsCount,
      limit: listParamsDto.limit,
      order: listParamsDto.order,
      orderField: listParamsDto.orderField,
    });
  }

  async get(id: number): Promise<T | null> {
    return this.repository
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
  }

  async getWithRelations(id: number, entity: string, relations?: string[]) {
    const query = this.repository
      .createQueryBuilder(entity)
      .where(`${entity}.id = :id`, { id })
      .andWhere(`${entity}.isDeleted != true`);

    if (relations) {
      for (const relation of relations) {
        query.leftJoinAndSelect(`${entity}.${relation}`, `${relation}`);
      }
    }

    return await query.getOne();
  }

  async listBy(
    where: string | ObjectLiteral | Brackets,
    listParamsDto: ListParamsDto,
  ): Promise<ListDto<T>> {
    const array = await this.repository
      .createQueryBuilder()
      .where(where)
      .limit(listParamsDto.limit)
      .offset(listParamsDto.countOffset())
      .orderBy(listParamsDto.getOrderedField(), listParamsDto.order)
      .getMany();
    const itemsCount = await this.repository
      .createQueryBuilder()
      .where(where)
      .getCount();
    return new ListDto<T>(array, {
      page: listParamsDto.page,
      itemsCount,
      limit: listParamsDto.limit,
      order: listParamsDto.order,
      orderField: listParamsDto.orderField,
    });
  }

  deleteBy(where: string | ObjectLiteral | Brackets) {
    return this.repository.createQueryBuilder().where(where).delete();
  }

  async filterKeys(obj, except) {
    Object.keys(obj).forEach((n) => except.includes(n) || delete obj[n]);
  }

  async checkIfExcist(obj: any, name: string, id: any) {
    if (!obj) {
      throw new BadRequestException(
        `Поле ${name} С id ${id} не найдено в базе данных`,
      );
    }
  }
}
