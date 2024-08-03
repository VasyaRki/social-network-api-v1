import {
  ILike,
  Entity,
  Repository,
  DeepPartial,
  FindOptionsWhere,
} from 'typeorm';
import { PagedResult, PaginationQuery } from './types/pagination-query.type';

export class EntityService<Entity> {
  constructor(protected readonly repository: Repository<Entity>) {
    this.repository = repository;
  }

  public async create(input: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.repository.create(input);

    return this.save(entity);
  }

  public async save(input: DeepPartial<Entity>): Promise<Entity> {
    return this.repository.save(input);
  }

  public async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);

    return result.affected > 0;
  }

  public async getOne(
    filter: FindOptionsWhere<Entity>,
    relations?: any,
  ): Promise<Entity> {
    return this.repository.findOne({
      where: filter,
      relations,
    });
  }

  public async getMany(
    filter: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[] = {},
    relations?: any,
  ): Promise<Entity[]> {
    return this.repository.find({
      where: filter,
      relations,
    });
  }

  public async paginate(
    query: PaginationQuery,
    filter: FindOptionsWhere<Entity> = {},
    relations?: any,
  ): Promise<PagedResult<Entity>> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const fields = query?.fields;
    const search = query?.search;

    const where: FindOptionsWhere<Entity> = filter;

    try {
      if (search && fields.length > 0) {
        fields.map((field) => {
          where[field] = ILike(`%${search}%`);
        });
      }

      const [data, total] = await this.repository.findAndCount({
        where,
        relations,
        skip: (page - 1) * limit,
        take: limit,
      });

      return { data, total };
    } catch (error) {
      throw new Error(error);
    }
  }
}
