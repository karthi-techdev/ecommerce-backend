import { Model, Document } from "mongoose";
import { CommonRepository } from "../repositories/commonRepository";

export class CommonService<T extends Document> {
  repository: CommonRepository<T>;

  constructor(model: Model<T>) {
    this.repository = new CommonRepository(model);
  }

  // Toggle status
  async toggleStatus(id: string) {
    return await this.repository.toggleStatus(id);
  }

  // Get stats
  async getStats() {
    return await this.repository.getStats();
  }

  // Check if a document exists by field value
  async existsByField(field: string, value: any): Promise<boolean> {
    return await this.repository.existsByField(field, value);
  }
}