class MockModel {
  modelName: string;
  
  constructor(modelName: string, data: any = {}) {
    this.modelName = modelName;
    Object.assign(this, data);

    // Add mock methods for user model
    if (modelName === 'users') {
      this.comparePassword = async (candidatePassword: string) => {
        // Mock implementation: password matches if it's the same as the stored one
        return candidatePassword === this.password;
      };
    }
  }
  
  [key: string]: any;  // Allow dynamic properties for any model type

  // Common static methods that all models need
  static readonly countDocuments = jest.fn().mockImplementation(() => {
    return {
      exec: jest.fn().mockResolvedValue(1)
    };
  });
  static readonly findOne = jest.fn().mockImplementation((query) => {
    // Handle different query scenarios
    const result = new MockModel('Mock', {
      _id: '123',
      status: 'active',
      isDeleted: false,
      ...query
    });
    return {
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(result)
    };
  });

  static readonly find = jest.fn().mockImplementation((query) => {
    // Create a mock document that matches the query
    const mockDoc = new MockModel('Mock', {
      _id: '123',
      question: 'Test FAQ?',
      answer: 'This is an answer',
      status: 'active',
      isDeleted: query?.isDeleted || false,
      ...query
    });
    
    return {
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockDoc]),
      populate: jest.fn().mockReturnThis(),
    };
  });

  static readonly findById = jest.fn().mockImplementation((id) => {
    if (id === '123' || id === '12345') {
      return Promise.resolve(new MockModel('Mock', {
        _id: id,
        status: 'active',
        isDeleted: false
      }));
    }
    return Promise.resolve(null);
  });

  static readonly findByIdAndUpdate = jest.fn().mockImplementation((id, update) => {
    if (id === '123' || id === '12345') {
      return Promise.resolve(new MockModel('Mock', {
        _id: id,
        ...update,
        status: update.status || 'active',
        isDeleted: update.isDeleted || false
      }));
    }
    return Promise.resolve(null);
  });

  static readonly findByIdAndDelete = jest.fn().mockImplementation((id) => {
    if (id === '123' || id === '12345') {
      return Promise.resolve(new MockModel('Mock', {
        _id: id,
        isDeleted: true
      }));
    }
    return Promise.resolve(null);
  });

  static readonly deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });

  static readonly create = jest.fn().mockImplementation(function(this: any, doc: any) {
    // 'this' refers to the model class (e.g. FaqModel)
    const modelName = this?.modelName || 'Unknown';
    const instance = new MockModel(modelName, {
      ...doc,
      _id: doc._id || new ObjectId().toString(),
      status: doc.status || 'active',
      isDeleted: doc.isDeleted || false,
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date()
    });
    return Promise.resolve(instance);
  });

  save = jest.fn().mockImplementation(() => {
    const errors: any = {};

    // For all models, validate their required fields
    const requiredFields: { [key: string]: string[] } = {
      User: ['email', 'password'],
      Faq: ['question', 'answer'],
      NewsLetter: ['name', 'template'],
      Category: ['name', 'description'],
      Page: ['title', 'description'],
      FooterInfo: ['title', 'order']
    };
    
    if (requiredFields[this.modelName]) {
      requiredFields[this.modelName].forEach(field => {
        if (!this[field]) {
          errors[field] = {
            name: 'ValidatorError',
            message: `${field} is required`,
            path: field,
            kind: 'required'
          };
        }
      });
    } else {
      // Generic validation for other models
      Object.entries(this).forEach(([key, value]) => {
        if (!['_id', 'createdAt', 'updatedAt', 'status', 'isDeleted'].includes(key) && 
            (value === undefined || value === null || value === '')) {
          errors[key] = {
            name: 'ValidatorError',
            message: `${key} is required`,
            path: key,
            kind: 'required'
          };
        }
      });
    }

    if (Object.keys(errors).length > 0) {
      const error = new Error('Validation failed') as any;
      error.name = 'ValidationError';
      error.errors = errors;
      error._message = 'Model validation failed';
      return Promise.reject(error as Error);
    }

    // Mock field population
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
    this._id = this._id || new ObjectId().toString();
    this.status = this.status || 'active';
    this.isDeleted = this.isDeleted || false;

    return Promise.resolve(this);
  });

  // Common instance methods all documents have
  populate = jest.fn().mockReturnThis();
  execPopulate = jest.fn().mockResolvedValue(this);
  toJSON = jest.fn().mockImplementation(() => ({ ...this }));
  lean = jest.fn().mockReturnThis();
}

class ObjectId {
  private readonly value: string;
  
  constructor(str?: string) {
    this.value = String(str || Math.random());
  }
  
  toString() {
    return this.value;
  }
  
  static createFromTime(time: number): ObjectId {
    return new ObjectId(String(time));
  }
}

// Mongoose Schema mock
interface SchemaInstance {
  obj: any;
  pre: jest.Mock;
  post: jest.Mock;
  virtual: jest.Mock;
  set: jest.Mock;
  index: jest.Mock;
  plugin: jest.Mock;
  path: jest.Mock;
}

interface SchemaConstructor {
  (definition: any, options?: any): SchemaInstance;
  Types: { ObjectId: typeof ObjectId };
  prototype: SchemaInstance;
}

// Create Schema constructor function
const Schema = function(this: any, definition: any, options?: any) {
  if (!(this instanceof Schema)) {
    return new (Schema as any)(definition, options);
  }

  this.obj = definition;
  this.methods = {};
  this.pre = jest.fn().mockReturnThis();
  this.post = jest.fn().mockReturnThis();
  this.virtual = jest.fn().mockReturnThis();
  this.set = jest.fn().mockReturnThis();
  this.index = jest.fn().mockReturnThis();
  this.plugin = jest.fn().mockReturnThis();
  this.path = jest.fn().mockReturnThis();
  
  return this;
} as any;

Schema.Types = { ObjectId };

Schema.prototype.pre = jest.fn().mockReturnThis();
Schema.prototype.post = jest.fn().mockReturnThis();
Schema.prototype.virtual = jest.fn().mockReturnThis();
Schema.prototype.set = jest.fn().mockReturnThis();
Schema.prototype.index = jest.fn().mockReturnThis();
Schema.prototype.plugin = jest.fn().mockReturnThis();
Schema.prototype.path = jest.fn().mockReturnThis();


const models: { [key: string]: typeof MockModel } = {};

const model = jest.fn().mockImplementation((name: string, schema?: any) => {
  if (!models[name]) {
    models[name] = class extends MockModel {};
  }
  return models[name];
});

const mongoose = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  connection: {
    close: jest.fn().mockResolvedValue(undefined),
    db: {
      collections: jest.fn().mockResolvedValue([{
        collectionName: 'users',
        deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
      }, {
        collectionName: 'settings',
        deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
      }]),
      collection: jest.fn().mockReturnValue({
        deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
      })
    },
    readyState: 1,
  },
  Schema,
  model,
  models,
  Types: { ObjectId }
};

export { Schema, model };
export class Document {
  _id?: string;
}
export default mongoose;
