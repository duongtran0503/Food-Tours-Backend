import { Model, UpdateQuery, QueryOptions, QueryFilter, ProjectionType, Types,Document } from 'mongoose';

export type EntityDocument<T> = Document<Types.ObjectId, unknown, T> & T & {
  _id: Types.ObjectId;
  id: string;
}
export abstract class BaseRepository<T, C = Partial<T>> {
  constructor(protected readonly model: Model<T>) {}

  // 1. Tạo mới
  async create(dto: C): Promise<EntityDocument<T>> {
    const createdData = new this.model(dto);
    const result = await createdData.save();
    return result as unknown as EntityDocument<T>;
  }

  // 2. Tìm tất cả
  async findAll(
    filter: QueryFilter<T> = {},
    projection?: ProjectionType<T>,
    options: QueryOptions<T> = {},
  ): Promise<EntityDocument<T>[]> {
    const result = await this.model.find(filter, projection, options).lean().exec();
    return result as unknown as EntityDocument<T>[];
  }

  // 3. Tìm một theo ID
  async findById(
    id: string, 
    projection?: ProjectionType<T>, 
    options: QueryOptions<T> = {}
  ): Promise<EntityDocument<T> | null> {
    const result = await this.model.findById(id, projection, options).lean().exec();
    return result as unknown as EntityDocument<T> | null;
  }

  // 4. Tìm một theo điều kiện Filter
  async findOne(
    filter: QueryFilter<T>, 
    projection?: ProjectionType<T>, 
    options: QueryOptions<T> = {}
  ): Promise<EntityDocument<T> | null> {
    const result = await this.model.findOne(filter, projection, options).lean().exec();
    return result as unknown as EntityDocument<T> | null;
  }

  // 5. Cập nhật
  async update(id: string, updateDto: UpdateQuery<T>, options: QueryOptions<T> = {}): Promise<EntityDocument<T> | null> {
    const result = await this.model.findByIdAndUpdate(id, updateDto, { new: true, ...options }).exec();
    return result as unknown as EntityDocument<T> | null;
  }

  // 6. Xóa
  async delete(id: string, options: QueryOptions<T> = {}): Promise<EntityDocument<T> | null> {
    const result = await this.model.findByIdAndDelete(id, options).exec();
    return result as unknown as EntityDocument<T> | null;
  }

  getModel(): Model<T> {
    return this.model;
  }
}