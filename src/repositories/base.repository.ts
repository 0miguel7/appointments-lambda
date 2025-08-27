export interface IRepository<T> {
  create(item: T): Promise<T>;
  getById(id: string): Promise<T | null>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
