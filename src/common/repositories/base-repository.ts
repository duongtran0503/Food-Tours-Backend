import { Model, Document, UpdateQuery,QueryFilter, QueryOptions } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  // 1. Tạo mới
  async create(dto: unknown): Promise<T> {
    const createdData = new this.model(dto);
    return createdData.save() as Promise<T>;
  }

  // 2. Tìm tất cả (có phân trang & chọn lọc trường)
  async findAll(
    filter: QueryFilter<T> = {},
    projection?: string | Record<string, number>,
    options: QueryOptions = {},
  ): Promise<T[]> {
    return this.model.find(filter, projection, options).exec();
  }

  // 3. Tìm một theo ID
  async findById(id: string, projection?: string | Record<string, number>): Promise<T | null> {
    return this.model.findById(id, projection).exec();
  }

  // 4. Tìm một theo điều kiện Filter
  async findOne(filter: QueryFilter<T>, projection?: string | Record<string, number>): Promise<T | null> {
    return this.model.findOne(filter, projection).exec();
  }

  // 5. Cập nhật
  async update(id: string, updateDto: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  // 6. Xóa
  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}