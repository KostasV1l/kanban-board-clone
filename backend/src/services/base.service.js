/**
 * Base service class with common CRUD operations
 * This can be extended by specific services
 */
class BaseService {
    constructor(model) {
        this.model = model;
    }

    // Create a new document
    async create(data) {
        try {
            return await this.model.create(data);
        } catch (error) {
            throw error;
        }
    }

    // Find one document by ID
    async findById(id) {
        try {
            const document = await this.model.findById(id);
            return document ? document.toJSON() : null;
        } catch (error) {
            throw error;
        }
    }

    // Find all documents (with optional filter)
    async findAll(filter = {}) {
        try {
            const documents = await this.model.find(filter);
            return documents && documents.length ? documents.map((doc) => doc.toJSON()) : [];
        } catch (error) {
            throw error;
        }
    }

    // Update a document by ID
    async update(id, data) {
        try {
            const document = await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
            return document ? document.toJSON() : null;
        } catch (error) {
            throw error;
        }
    }

    // Delete a document by ID
    async delete(id) {
        try {
            const document = await this.model.findByIdAndDelete(id);
            return document ? document.toJSON() : null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BaseService;
