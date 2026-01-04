import { Model, Document, Types } from "mongoose";

export class CommonRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // Check if a document exists by field value
  async existsByField(field: string, value: any): Promise<boolean> {
    try {
      const query: any = {};
      query[field] = value;
      query.isDeleted = false;
      const doc = await this.model.findOne(query).lean();
      return !!doc;
    } catch (error) {
      console.error('Error in existsByField:', error);
      throw error;
    }
  }

  // Toggle status by ID
  async toggleStatus(id: string): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const doc = await this.model.findById(id);
    if (!doc) return null;

    const currentStatus = doc.get("status");
    doc.set("status", currentStatus === "active" ? "inactive" : "active");
    return await doc.save();
  }

  // Get stats (total, active, inactive)
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    try {
      const [total, active, inactive] = await Promise.all([
        this.model.countDocuments({ isDeleted: false }).exec(),
        this.model.countDocuments({ status: "active", isDeleted: false }).exec(),
        this.model.countDocuments({ status: "inactive", isDeleted: false }).exec(),
      ]);

      // Validate stats consistency
      if (total !== active + inactive) {
        console.warn('Statistics mismatch: total !== active + inactive');
      }

      return { total, active, inactive };
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  }
}