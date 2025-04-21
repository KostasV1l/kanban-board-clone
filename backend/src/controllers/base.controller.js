/**
 * Base controller class with common request handlers
 * This can be extended by specific controllers
 */
class BaseController {
  constructor(service) {
    this.service = service;
  }

  // Create a new resource
  create = async (req, res) => {
    try {
      const data = req.body;
      const result = await this.service.create(data);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        message: error.message || 'An error occurred while creating the resource',
      });
    }
  };

  // Get a resource by ID
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.findById(id);
      
      if (!result) {
        return res.status(404).json({
          message: 'Resource not found',
        });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: error.message || 'An error occurred while retrieving the resource',
      });
    }
  };

  // Get all resources
  getAll = async (req, res) => {
    try {
      const filter = req.query; // Allow filtering based on query parameters
      const results = await this.service.findAll(filter);
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({
        message: error.message || 'An error occurred while retrieving resources',
      });
    }
  };

  // Update a resource
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await this.service.update(id, data);
      
      if (!result) {
        return res.status(404).json({
          message: 'Resource not found',
        });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: error.message || 'An error occurred while updating the resource',
      });
    }
  };

  // Delete a resource
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);
      
      if (!result) {
        return res.status(404).json({
          message: 'Resource not found',
        });
      }
      
      return res.status(200).json({
        message: 'Resource deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || 'An error occurred while deleting the resource',
      });
    }
  };
}

module.exports = BaseController; 